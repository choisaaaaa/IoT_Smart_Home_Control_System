import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import config from '../config';
import logger from '../utils/logger';
import pool, { RowDataPacket, ResultSetHeader } from '../config/database';

interface DeviceStatusPayload {
  device_id: string;
  status: string;
  firmware_version?: string;
}

interface SensorDataPayload {
  device_id: string;
  sensor_type: string;
  value: string | number;
}

interface CommandResultPayload {
  device_id: string;
  command_id?: number;
  command_type: string;
  status: 'success' | 'failed' | 'timeout';
  result?: string;
}

class MQTTService {
  private client: MqttClient | null = null;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private baseReconnectDelay: number = 1000;
  private wsInstance: any = null;

  constructor() {}

  setWebSocket(ws: any) {
    this.wsInstance = ws;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      const options: IClientOptions = {
        keepalive: 60,
        clean: true,
        connectTimeout: 10000,
        reconnectPeriod: 0,
        username: config.mqtt.username || undefined,
        password: config.mqtt.password || undefined,
        clientId: `iot_hotel_server_${Date.now()}`,
        rejectUnauthorized: false
      };

      const url = `mqtt://${config.mqtt.host}:${config.mqtt.port}`;
      
      try {
        this.client = mqtt.connect(url, options);
      } catch (error) {
        logger.error(`MQTT连接地址无效: ${url}`, error);
        this.scheduleReconnect();
        resolve(false);
        return;
      }

      this.client.on('connect', () => {
        logger.info('MQTT客户端连接成功');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.subscribeAllTopics();
        resolve(true);
      });

      this.client.on('error', (error) => {
        logger.error('MQTT连接错误:', error.message || error);
        this.connected = false;
      });

      this.client.on('close', () => {
        if (this.connected) {
          logger.info('MQTT连接已关闭');
          this.connected = false;
          this.scheduleReconnect();
        }
      });

      this.client.on('message', async (topic: string, message: Buffer) => {
        const msgStr = message.toString();
        logger.debug(`收到MQTT消息 [${topic}]: ${msgStr}`);
        
        try {
          const data = JSON.parse(msgStr);
          await this.handleMessage(topic, data);
        } catch (parseError) {
          logger.warn(`MQTT消息解析失败 [${topic}]: ${msgStr}`);
          await this.handleMessage(topic, { raw: msgStr });
        }
      });
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.warn(`MQTT重连次数已达上限(${this.maxReconnectAttempts})，停止自动重连`);
      return;
    }
    
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000
    );
    
    this.reconnectAttempts++;
    logger.info(`MQTT将在 ${delay/1000}s 后尝试第 ${this.reconnectAttempts} 次重连...`);
    
    setTimeout(() => {
      this.connect().catch(() => {});
    }, delay);
  }

  private subscribeAllTopics() {
    const topics = [
      'hotel/device/status',
      'hotel/device/data/+',
      'hotel/device/command/result',
      'hotel/security/event',
      'hotel/room/control/result'
    ];

    topics.forEach((topic) => {
      this.subscribe(topic).catch(() => {});
    });
  }

  async handleMessage(topic: string, data: any) {
    switch (topic) {
      case 'hotel/device/status':
        await this.handleDeviceStatus(data as DeviceStatusPayload);
        break;
      case 'hotel/device/data/temperature':
      case 'hotel/device/data/humidity':
      case 'hotel/device/data/light':
      case 'hotel/device/data/motion':
      case 'hotel/device/data/door':
        await this.handleSensorData(data as SensorDataPayload);
        break;
      case 'hotel/device/command/result':
        await this.handleCommandResult(data as CommandResultPayload);
        break;
      case 'hotel/security/event':
        await this.handleSecurityEvent(data);
        break;
      default:
        if (topic.startsWith('hotel/device/data/')) {
          await this.handleSensorData(data as SensorDataPayload);
        } else {
          logger.debug(`未处理的MQTT主题: ${topic}`);
        }
    }
  }

  async handleDeviceStatus(data: DeviceStatusPayload) {
    try {
      const now = new Date();
      await pool.query<ResultSetHeader>(
        `UPDATE devices SET 
          device_status = ?, 
          last_seen = ?, 
          firmware_version = COALESCE(?, firmware_version),
          updated_at = ?
         WHERE device_id = ?`,
        [data.status, now, data.firmware_version || null, now, data.device_id]
      );

      logger.info(`设备状态更新: ${data.device_id} -> ${data.status}`);

      this.wsInstance?.emit('device_status_changed', {
        device_id: data.device_id,
        status: data.status,
        timestamp: now.toISOString()
      });
    } catch (error) {
      logger.error('处理设备状态更新失败:', error);
    }
  }

  async handleSensorData(data: SensorDataPayload) {
    try {
      const sensorType = data.sensor_type || 'unknown';
      
      await pool.query<ResultSetHeader>(
        `INSERT INTO sensor_data (device_id, sensor_type, sensor_value, created_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE sensor_value = VALUES(sensor_value), created_at = VALUES(created_at)`,
        [data.device_id, sensorType, String(data.value)]
      );

      this.wsInstance?.emit('sensor_data_update', {
        device_id: data.device_id,
        sensor_type: sensorType,
        value: data.value,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('处理传感器数据失败:', error);
    }
  }

  async handleCommandResult(data: CommandResultPayload) {
    try {
      if (data.command_id) {
        await pool.query<ResultSetHeader>(
          `UPDATE control_commands SET 
            command_status = ?, 
            executed_at = NOW()
           WHERE id = ?`,
          [data.status, data.command_id]
        );
      }

      logger.info(`指令执行结果: 设备=${data.device_id}, 类型=${data.command_type}, 状态=${data.status}`);

      this.wsInstance?.emit('command_result', {
        device_id: data.device_id,
        command_type: data.command_type,
        status: data.status,
        result: data.result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('处理指令结果失败:', error);
    }
  }

  async handleSecurityEvent(data: any) {
    try {
      await pool.query<ResultSetHeader>(
        `INSERT INTO security_events (device_id, event_type, event_data, event_level, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [
          data.device_id || '',
          data.event_type || 'unknown',
          JSON.stringify(data.data || {}),
          data.level || 'info'
        ]
      );

      logger.warn(`安防事件: ${data.event_type} - 设备 ${data.device_id}`);

      this.wsInstance?.emit('security_event', {
        device_id: data.device_id,
        event_type: data.event_type,
        level: data.level || 'info',
        data: data.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('处理安防事件失败:', error);
    }
  }

  async publish(topic: string, message: object): Promise<boolean> {
    if (!this.connected || !this.client) {
      logger.warn(`MQTT未连接，无法发送消息到 ${topic}`);
      return false;
    }

    return new Promise((resolve) => {
      this.client!.publish(topic, JSON.stringify(message), { qos: 1, retain: false }, (err) => {
        if (err) {
          logger.error(`发送MQTT消息失败 [${topic}]:`, err.message);
          resolve(false);
        } else {
          logger.debug(`发送MQTT消息成功 [${topic}]`);
          resolve(true);
        }
      });
    });
  }

  async sendDeviceCommand(deviceId: string, commandType: string, commandValue: string, createdBy?: string): Promise<number | null> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO control_commands (device_id, command_type, command_value, command_status, created_by, created_at)
         VALUES (?, ?, ?, 'pending', ?, NOW())`,
        [deviceId, commandType, commandValue, createdBy || 'system']
      );

      const commandId = result.insertId;

      await this.publish('hotel/device/command', {
        command_id: commandId,
        device_id: deviceId,
        command_type: commandType,
        command_value: commandValue,
        timestamp: new Date().toISOString()
      });

      logger.info(`发送设备指令: #${commandId} -> ${deviceId}/${commandType}=${commandValue}`);
      return commandId;
    } catch (error) {
      logger.error('发送设备指令失败:', error);
      return null;
    }
  }

  async subscribe(topic: string): Promise<boolean> {
    if (!this.connected || !this.client) {
      logger.warn(`MQTT未连接，无法订阅 ${topic}`);
      return false;
    }

    return new Promise((resolve) => {
      this.client!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          logger.error(`订阅MQTT主题失败 [${topic}]:`, err.message);
          resolve(false);
        } else {
          logger.info(`已订阅MQTT主题: ${topic}`);
          resolve(true);
        }
      });
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect() {
    if (this.client && this.connected) {
      try {
        await new Promise<void>((resolve) => {
          this.client!.end(false, () => resolve());
        });
      } catch (e) {}
      this.connected = false;
      logger.info('MQTT客户端已断开');
    }
  }

  async getOnlineDevices(): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM devices WHERE device_status = 'online' ORDER BY last_seen DESC"
      );
      return rows;
    } catch (error) {
      logger.error('获取在线设备列表失败:', error);
      return [];
    }
  }

  async getLatestSensorData(deviceId: string, limit: number = 50): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM sensor_data WHERE device_id = ? ORDER BY created_at DESC LIMIT ?`,
        [deviceId, limit]
      );
      return rows;
    } catch (error) {
      logger.error('获取传感器数据失败:', error);
      return [];
    }
  }
}

export default new MQTTService();