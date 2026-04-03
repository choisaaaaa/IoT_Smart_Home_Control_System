# 物联网智能家居控制系统 - API接口文档

## 📋 文档概述

### 文档说明
本文档描述物联网智能家居控制系统的API接口设计，包括RESTful API、WebSocket API、认证方式、错误码等内容。

### 适用范围
- 后端API开发
- 前端API调用
- API测试
- API文档维护

### 文档版本
- **v1.0.0** - 2024年1月
  - 初始版本

---

## 📡 API概览

### API基路径
```
/api/v1
```

### API版本
- **v1** - 第一版API

### 请求格式
- **Content-Type**: `application/json`
- **Accept**: `application/json`

### 响应格式
- **Content-Type**: `application/json`

### 认证方式
- **JWT Token**: JSON Web Token认证
- **设备认证**: 设备ID + 设备密钥

---

## 🔐 认证接口

### 1. 用户登录

**接口说明**：用户登录，获取JWT Token

**请求方式**：`POST`

**请求路径**：`/auth/login`

**请求头**：
```
Content-Type: application/json
```

**请求体**：
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 604800,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**错误码**：
- `401` - 用户名或密码错误
- `404` - 用户不存在

---

### 2. 用户登出

**接口说明**：用户登出，使Token失效

**请求方式**：`POST`

**请求路径**：`/auth/logout`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**：
```json
{}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 3. 刷新Token

**接口说明**：刷新JWT Token

**请求方式**：`POST`

**请求路径**：`/auth/refresh`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <refresh_token>
```

**请求体**：
```json
{}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 604800
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

## 📱 用户管理接口

### 1. 获取用户信息

**接口说明**：获取当前用户信息

**请求方式**：`GET`

**请求路径**：`/users/profile`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 2. 更新用户信息

**接口说明**：更新当前用户信息

**请求方式**：`PUT`

**请求路径**：`/users/profile`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "email": "newemail@example.com"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "newemail@example.com",
    "role": "admin",
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-18 00:00:00"
  }
}
```

**错误码**：
- `401` - Token无效或已过期
- `400` - 请求参数错误

---

### 3. 修改密码

**接口说明**：修改当前用户密码

**请求方式**：`PUT`

**请求路径**：`/users/password`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "old_password": "password123",
  "new_password": "newpassword123"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

**错误码**：
- `401` - Token无效或已过期
- `400` - 旧密码错误
- `400` - 新密码不符合要求

---

## 📡 设备管理接口

### 1. 获取设备列表

**接口说明**：获取所有设备列表

**请求方式**：`GET`

**请求路径**：`/devices`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?page=1&limit=10&type=main
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "device_id": "MAIN001",
        "device_type": "main",
        "device_name": "主控中心",
        "device_status": "online",
        "firmware_version": "v1.0.0",
        "last_seen": "2024-01-18 10:00:00",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-18 10:00:00"
      },
      {
        "id": 2,
        "device_id": "SUB1001",
        "device_type": "sub1",
        "device_name": "环境监测分控",
        "device_status": "online",
        "firmware_version": "v1.0.0",
        "last_seen": "2024-01-18 10:00:00",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-18 10:00:00"
      },
      {
        "id": 3,
        "device_id": "SUB2001",
        "device_type": "sub2",
        "device_name": "安防管理分控",
        "device_status": "offline",
        "firmware_version": "v1.0.0",
        "last_seen": "2024-01-17 10:00:00",
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-17 10:00:00"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 2. 获取设备详情

**接口说明**：获取指定设备详情

**请求方式**：`GET`

**请求路径**：`/devices/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "device_id": "MAIN001",
    "device_type": "main",
    "device_name": "主控中心",
    "device_key": "key_main_001",
    "device_status": "online",
    "firmware_version": "v1.0.0",
    "last_seen": "2024-01-18 10:00:00",
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-18 10:00:00"
  }
}
```

**错误码**：
- `401` - Token无效或已过期
- `404` - 设备不存在

---

### 3. 控制设备

**接口说明**：向设备发送控制指令

**请求方式**：`POST`

**请求路径**：`/devices/:id/control`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "command_type": "light_on",
  "command_value": "1"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "指令下发成功",
  "data": {
    "id": 1,
    "device_id": "MAIN001",
    "command_type": "light_on",
    "command_value": "1",
    "command_status": "pending",
    "created_by": "admin",
    "created_at": "2024-01-18 10:00:00",
    "executed_at": null
  }
}
```

**错误码**：
- `401` - Token无效或已过期
- `404` - 设备不存在
- `400` - 请求参数错误

---

### 4. 注册设备

**接口说明**：设备注册到系统

**请求方式**：`POST`

**请求路径**：`/devices/register`

**请求头**：
```
Content-Type: application/json
```

**请求体**：
```json
{
  "device_id": "MAIN001",
  "device_type": "main",
  "device_name": "主控中心",
  "device_key": "key_main_001",
  "firmware_version": "v1.0.0"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "device_id": "MAIN001",
    "device_type": "main",
    "device_name": "主控中心",
    "device_status": "offline",
    "firmware_version": "v1.0.0",
    "created_at": "2024-01-18 10:00:00",
    "updated_at": "2024-01-18 10:00:00"
  }
}
```

**错误码**：
- `400` - 设备ID已存在
- `400` - 请求参数错误

---

### 5. 删除设备

**接口说明**：删除指定设备

**请求方式**：`DELETE`

**请求路径**：`/devices/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误码**：
- `401` - Token无效或已过期
- `404` - 设备不存在

---

## 📊 传感器数据接口

### 1. 获取传感器数据

**接口说明**：获取传感器数据

**请求方式**：`GET`

**请求路径**：`/sensors/data`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?device_id=SUB1001&sensor_type=temperature&start_time=2024-01-18%2000:00:00&end_time=2024-01-18%2023:59:59&page=1&limit=100
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 10,
    "page": 1,
    "limit": 100,
    "items": [
      {
        "id": 1,
        "device_id": "SUB1001",
        "sensor_type": "temperature",
        "sensor_value": "25.5",
        "created_at": "2024-01-18 10:00:00"
      },
      {
        "id": 2,
        "device_id": "SUB1001",
        "sensor_type": "humidity",
        "sensor_value": "65",
        "created_at": "2024-01-18 10:00:00"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 2. 获取最新传感器数据

**接口说明**：获取最新传感器数据

**请求方式**：`GET`

**请求路径**：`/sensors/data/latest`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?device_id=SUB1001
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "device_id": "SUB1001",
    "data": [
      {
        "sensor_type": "temperature",
        "sensor_value": "25.5",
        "created_at": "2024-01-18 10:00:00"
      },
      {
        "sensor_type": "humidity",
        "sensor_value": "65",
        "created_at": "2024-01-18 10:00:00"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 3. 获取传感器历史数据

**接口说明**：获取传感器历史数据

**请求方式**：`GET`

**请求路径**：`/sensors/data/history`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?device_id=SUB1001&sensor_type=temperature&start_time=2024-01-18%2000:00:00&end_time=2024-01-18%2023:59:59
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "device_id": "SUB1001",
    "sensor_type": "temperature",
    "data": [
      {
        "sensor_value": "25.5",
        "created_at": "2024-01-18 10:00:00"
      },
      {
        "sensor_value": "26.0",
        "created_at": "2024-01-18 11:00:00"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

## 🛡️ 安防管理接口

### 1. 获取安防状态

**接口说明**：获取安防系统状态

**请求方式**：`GET`

**请求路径**：`/security/status`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "armed": false,
    "last_arm_time": null,
    "last_disarm_time": "2024-01-18 10:00:00",
    "devices": [
      {
        "device_id": "SUB2001",
        "device_name": "安防管理分控",
        "status": "online"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 2. 启动布防

**接口说明**：启动安防布防

**请求方式**：`POST`

**请求路径**：`/security/arm`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "布防成功",
  "data": {
    "armed": true,
    "arm_time": "2024-01-18 10:00:00"
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 3. 解除布防

**接口说明**：解除安防布防

**请求方式**：`POST`

**请求路径**：`/security/disarm`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "解除布防成功",
  "data": {
    "armed": false,
    "disarm_time": "2024-01-18 10:00:00"
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 4. 获取安防事件

**接口说明**：获取安防事件列表

**请求方式**：`GET`

**请求路径**：`/security/events`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?page=1&limit=10&level=critical
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "device_id": "SUB2001",
        "event_type": "intrusion",
        "event_data": {"sensor": "motion", "location": "living_room"},
        "event_level": "critical",
        "created_at": "2024-01-18 10:00:00"
      },
      {
        "id": 2,
        "device_id": "SUB2001",
        "event_type": "door_open",
        "event_data": {"sensor": "door", "location": "front_door"},
        "event_level": "info",
        "created_at": "2024-01-18 09:00:00"
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

## 🔌 WebSocket接口

### 1. 连接WebSocket

**接口说明**：建立WebSocket连接

**请求方式**：`WebSocket`

**请求路径**：`ws://localhost:3001/api/v1/ws`

**连接参数**：
```
?token=<jwt_token>
```

**响应示例**：
```json
{
  "type": "connected",
  "data": {
    "message": "连接成功"
  }
}
```

---

### 2. 订阅设备状态

**请求示例**：
```json
{
  "type": "subscribe",
  "data": {
    "topic": "device/status",
    "device_id": "MAIN001"
  }
}
```

**响应示例**：
```json
{
  "type": "device_status",
  "data": {
    "device_id": "MAIN001",
    "device_status": "online",
    "timestamp": "2024-01-18 10:00:00"
  }
}
```

---

### 3. 订阅传感器数据

**请求示例**：
```json
{
  "type": "subscribe",
  "data": {
    "topic": "sensor/data",
    "device_id": "SUB1001"
  }
}
```

**响应示例**：
```json
{
  "type": "sensor_data",
  "data": {
    "device_id": "SUB1001",
    "data": [
      {
        "sensor_type": "temperature",
        "sensor_value": "25.5",
        "timestamp": "2024-01-18 10:00:00"
      }
    ]
  }
}
```

---

### 4. 订阅安防事件

**请求示例**：
```json
{
  "type": "subscribe",
  "data": {
    "topic": "security/event"
  }
}
```

**响应示例**：
```json
{
  "type": "security_event",
  "data": {
    "id": 1,
    "device_id": "SUB2001",
    "event_type": "intrusion",
    "event_level": "critical",
    "created_at": "2024-01-18 10:00:00"
  }
}
```

---

## 📦 设备认证接口

### 1. 设备认证

**接口说明**：设备认证，获取Token

**请求方式**：`POST`

**请求路径**：`/devices/auth`

**请求头**：
```
Content-Type: application/json
```

**请求体**：
```json
{
  "device_id": "MAIN001",
  "device_key": "key_main_001"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "认证成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**错误码**：
- `401` - 设备ID或密钥错误

---

### 2. 设备心跳

**接口说明**：设备发送心跳，保持连接

**请求方式**：`POST`

**请求路径**：`/devices/heartbeat`

**请求头**：
```
Content-Type: application/json
Authorization: Bearer <device_token>
```

**请求体**：
```json
{
  "device_id": "MAIN001",
  "firmware_version": "v1.0.0",
  "battery_level": 95,
  "signal_strength": -65
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "心跳成功",
  "data": null
}
```

**错误码**：
- `401` - Token无效或已过期

---

## 📊 统计接口

### 1. 获取设备统计

**接口说明**：获取设备统计信息

**请求方式**：`GET`

**请求路径**：`/stats/devices`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 3,
    "online": 2,
    "offline": 1,
    "by_type": {
      "main": 1,
      "sub1": 1,
      "sub2": 1
    }
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

### 2. 获取传感器统计

**接口说明**：获取传感器数据统计

**请求方式**：`GET`

**请求路径**：`/stats/sensors`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
```
?device_id=SUB1001&start_time=2024-01-18%2000:00:00&end_time=2024-01-18%2023:59:59
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "device_id": "SUB1001",
    "time_range": {
      "start": "2024-01-18 00:00:00",
      "end": "2024-01-18 23:59:59"
    },
    "statistics": [
      {
        "sensor_type": "temperature",
        "min": 22.5,
        "max": 28.0,
        "avg": 25.3,
        "count": 144
      },
      {
        "sensor_type": "humidity",
        "min": 55,
        "max": 75,
        "avg": 65.2,
        "count": 144
      }
    ]
  }
}
```

**错误码**：
- `401` - Token无效或已过期

---

## 📡 MQTT接口

### 1. 设备上报数据

**Topic**：`device/{device_id}/data`

**消息格式**：
```json
{
  "device_id": "SUB1001",
  "data": [
    {
      "sensor_type": "temperature",
      "sensor_value": "25.5",
      "timestamp": "2024-01-18 10:00:00"
    }
  ]
}
```

---

### 2. 设备接收指令

**Topic**：`device/{device_id}/command`

**消息格式**：
```json
{
  "command_id": 1,
  "device_id": "SUB1001",
  "command_type": "light_on",
  "command_value": "1",
  "created_at": "2024-01-18 10:00:00"
}
```

---

### 3. 设备状态更新

**Topic**：`device/{device_id}/status`

**消息格式**：
```json
{
  "device_id": "MAIN001",
  "device_status": "online",
  "firmware_version": "v1.0.0",
  "timestamp": "2024-01-18 10:00:00"
}
```

---

## 🔍 错误码说明

### 通用错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或Token无效 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |

### 认证错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户名或密码错误 |
| 1002 | Token已过期 |
| 1003 | Token无效 |
| 1004 | 设备ID或密钥错误 |

### 参数错误码

| 错误码 | 说明 |
|--------|------|
| 2001 | 设备ID不存在 |
| 2002 | 传感器类型不存在 |
| 2003 | 指令类型不存在 |
| 2004 | 时间范围无效 |

---

## 📝 请求示例

### cURL示例

```bash
# 用户登录
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# 获取设备列表
curl -X GET http://localhost:3000/api/v1/devices \
  -H "Authorization: Bearer <token>"

# 控制设备
curl -X POST http://localhost:3000/api/v1/devices/1/control \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"command_type":"light_on","command_value":"1"}'
```

---

## 📚 相关文档

- [数据库设计文档](./数据库设计文档.md)
- [系统架构文档](./01-系统架构/README.md)
- [部署运维文档](./04-部署运维/README.md)

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日  
**适用项目**：物联网智能家居控制系统
