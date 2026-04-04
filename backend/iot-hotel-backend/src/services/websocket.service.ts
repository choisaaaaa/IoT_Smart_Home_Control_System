import { Server, Socket } from 'socket.io';
import http from 'http';
import config from '../config';
import logger from '../utils/logger';
import mqttService from './mqtt.service';
import pool, { RowDataPacket } from '../config/database';

interface ClientInfo {
  socketId: string;
  roomId?: string;
  role?: string;
  connectedAt: Date;
}

class WebSocketService {
  private io: Server | null = null;
  private server: http.Server | null = null;
  private clients: Map<string, ClientInfo> = new Map();

  init(httpServer: http.Server) {
    this.server = httpServer;
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6,
      transports: ['websocket', 'polling']
    });

    this.io.on('connection', (socket: Socket) => {
      const clientInfo: ClientInfo = {
        socketId: socket.id,
        connectedAt: new Date()
      };
      this.clients.set(socket.id, clientInfo);

      logger.info(`WebSocket客户端连接: ${socket.id} (当前在线: ${this.clients.size})`);

      socket.on('join_room', async (roomId: string) => {
        const room = String(roomId).trim();
        if (!room) return;

        const oldRoom = this.clients.get(socket.id)?.roomId;
        if (oldRoom && oldRoom !== room) {
          socket.leave(oldRoom);
        }

        socket.join(room);
        const info = this.clients.get(socket.id);
        if (info) info.roomId = room;

        logger.info(`客户端 ${socket.id} 加入房间: ${room}`);

        try {
          const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM rooms WHERE id = ? OR room_number = ? LIMIT 1`,
            [room, room]
          );
          
          if (rows.length > 0) {
            socket.emit('room_info', rows[0]);
            
            const [deviceRows] = await pool.query<RowDataPacket[]>(
              `SELECT device_id, device_type, device_name, device_status, last_seen 
               FROM devices WHERE device_id LIKE ? OR device_id = ?`,
              [`R${room}%`, `R${room}`]
            );
            
            if (deviceRows.length > 0) {
              socket.emit('room_devices', deviceRows);
            }
          }
        } catch (error) {
          logger.error('获取房间信息失败:', error);
        }
      });

      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        const info = this.clients.get(socket.id);
        if (info?.roomId === roomId) info.roomId = undefined;
        logger.info(`客户端 ${socket.id} 离开房间: ${roomId}`);
      });

      socket.on('send_message', (data: { roomId?: string; content: string; type?: string }) => {
        const targetRoom = data.roomId || this.clients.get(socket.id)?.roomId;
        if (!targetRoom) {
          socket.emit('error', { message: '未加入任何房间' });
          return;
        }

        const messageData = {
          id: Date.now(),
          sender: socket.id,
          content: data.content,
          type: data.type || 'text',
          timestamp: new Date().toISOString()
        };

        this.io?.to(targetRoom).emit('receive_message', messageData);
        logger.info(`消息发送到房间 ${targetRoom}: [${data.type || 'text'}]`);
      });

      socket.on('control_device', async (data: {
        deviceId: string;
        commandType: string;
        commandValue: string;
      }) => {
        logger.info(`收到设备控制请求: ${data.deviceId}/${data.commandType}=${data.commandValue}`);
        
        const commandId = await mqttService.sendDeviceCommand(
          data.deviceId,
          data.commandType,
          data.commandValue,
          socket.id
        );

        socket.emit('command_sent', {
          command_id: commandId,
          device_id: data.deviceId,
          command_type: data.commandType,
          status: commandId ? 'pending' : 'failed',
          timestamp: new Date().toISOString()
        });
      });

      socket.on('get_room_status', async (roomId: string) => {
        try {
          const [sensorRows] = await pool.query<RowDataPacket[]>(
            `SELECT sensor_type, sensor_value, created_at 
             FROM sensor_data 
             WHERE device_id LIKE ? 
             ORDER BY created_at DESC LIMIT 20`,
            [`R${roomId}%`]
          );

          const [deviceRows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM devices WHERE device_id LIKE ?`,
            [`R${roomId}%`]
          );

          socket.emit('room_status', {
            room_id: roomId,
            sensors: sensorRows,
            devices: deviceRows,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          logger.error('获取房间状态失败:', error);
          socket.emit('error', { message: '获取房间状态失败' });
        }
      });

      socket.on('get_online_devices', async () => {
        try {
          const devices = await mqttService.getOnlineDevices();
          socket.emit('online_devices', devices);
        } catch (error) {
          logger.error('获取在线设备失败:', error);
        }
      });

      socket.on('disconnect', (reason) => {
        this.clients.delete(socket.id);
        logger.info(`WebSocket客户端断开: ${socket.id}, 原因: ${reason} (当前在线: ${this.clients.size})`);
      });

      socket.on('error', (error) => {
        logger.error(`Socket错误 (${socket.id}):`, error.message);
      });

      socket.emit('connected', {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        serverTime: Date.now()
      });
    });

    mqttService.setWebSocket(this);
    logger.info('WebSocket服务已启动');
  }

  emit(event: string, data: any, roomId?: string) {
    if (!this.io) {
      return;
    }

    if (roomId) {
      this.io.to(roomId).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }

  emitToRoom(roomId: string, event: string, data: any) {
    this.emit(event, data, roomId);
  }

  broadcastToAllRooms(event: string, data: any) {
    this.emit(event, data);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getRoomClients(roomId: string): string[] {
    const clients: string[] = [];
    this.clients.forEach((info, socketId) => {
      if (info.roomId === roomId) clients.push(socketId);
    });
    return clients;
  }

  getIO(): Server | null {
    return this.io;
  }

  close() {
    if (this.io) {
      this.io.disconnectSockets(true);
      this.io.close();
      this.io = null;
    }
    this.clients.clear();
    logger.info('WebSocket服务已关闭');
  }
}

export default new WebSocketService();