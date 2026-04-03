# 软件设计文档

本目录包含软件设计相关的文档，涵盖后端开发、前端开发、数据库设计、API接口等内容。

## 📚 文档列表

### 1. 需求说明-软件系统需求.md
- **描述**：云端服务器、主控软件、分控软件、前端界面、移动端的软件系统需求
- **内容**：
  - 云端服务器需求（系统架构、后端功能、前端功能、数据库设计）
  - 主控软件需求（系统架构、硬件组成、功能需求）
  - 分控软件需求（分控1、分控2需求）
  - 前端界面需求（Web前端、移动端App）
  - 数据库设计
  - API接口设计

### 2. 三端语音智能体部署指南.md
- **描述**：三端语音智能体的部署指南
- **内容**：
  - 部署方案（本地开发 + Docker部署、云服务器部署）
  - 环境准备
  - 配置说明
  - 启动服务
  - 测试验证
  - 常见问题

---

## 🏗️ 软件架构

### 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         三端语音智能体架构                               │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │  📱 手机客户端  │  │  💻 网页前端   │  │  🖥️ 主控终端   │                  │
│  │  Flutter/App  │  │  Vue3 Web    │  │  ESP32+AI   │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            │                                             │
│                   ┌────────▼────────┐                                   │
│                   │   Node.js 后端   │                                   │
│                   │   (Express.js)   │                                   │
│                   └────────┬─────────┘                                   │
│                            │                                              │
│              ┌─────────────┼─────────────┐                               │
│              ▼             ▼             ▼                               │
│        ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│        │ 🎤 ASR   │  │ 🤖 LLM   │  │ 🔊 TTS   │                         │
│        │ 阿里云    │  │ GLM-4    │  │ 讯飞/阿里 │                         │
│        └──────────┘  │ Function │  └──────────┘                         │
│                       │ Calling  │                                       │
│                       └────┬─────┘                                       │
│                            │                                             │
│                    ┌───────┴───────┐                                     │
│                    │  ⚙️ 工具执行引擎  │                                     │
│                    │  • 设备控制(MQTT)│                                     │
│                    │  • 传感器查询    │                                     │
│                    │  • 天气API      │                                     │
│                    └───────────────┘                                     │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    数据存储层                                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │ │
│  │  │  MySQL   │  │  Redis   │  │  MQTT    │                         │ │
│  │  │  (主库)   │  │  (缓存)   │  │  (消息)   │                         │ │
│  │  └──────────┘  └──────────┘  └──────────┘                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 技术栈

**前端技术栈**：
- Web前端：Vue.js 3 + Ant Design Vue + ECharts
- 移动端：Flutter App
- 状态管理：Pinia
- HTTP客户端：Axios
- WebSocket客户端：Socket.io-client

**后端技术栈**：
- 后端框架：Node.js + Express
- 数据库：MySQL（主数据库）+ Redis（缓存）
- 消息队列：MQTT Broker（Mosquitto）
- 实时通信：WebSocket（Socket.io）
- AI服务：语音识别API（阿里云）、语音合成API（讯飞/阿里）

---

## 📊 数据库设计

### 数据库表结构

#### 设备表（devices）
```sql
CREATE TABLE devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL,
    device_name VARCHAR(50) NOT NULL,
    device_key VARCHAR(50) NOT NULL,
    device_status VARCHAR(20) DEFAULT 'offline',
    firmware_version VARCHAR(20),
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_device_status (device_status)
);
```

#### 传感器数据表（sensor_data）
```sql
CREATE TABLE sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id VARCHAR(50) NOT NULL,
    sensor_type VARCHAR(20) NOT NULL,
    sensor_value VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_created_at (created_at)
);
```

#### 控制指令表（control_commands）
```sql
CREATE TABLE control_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id VARCHAR(50) NOT NULL,
    command_type VARCHAR(20) NOT NULL,
    command_value VARCHAR(50) NOT NULL,
    command_status VARCHAR(20) DEFAULT 'pending',
    created_by VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    executed_at DATETIME,
    INDEX idx_device_id (device_id),
    INDEX idx_created_at (created_at)
);
```

#### 用户表（users）
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 安防事件表（security_events）
```sql
CREATE TABLE security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    event_data TEXT,
    event_level VARCHAR(20) DEFAULT 'info',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_created_at (created_at)
);
```

---

## 🔌 API接口设计

### 设备管理接口

```
GET    /api/v1/devices              # 获取设备列表
GET    /api/v1/devices/:id          # 获取设备详情
POST   /api/v1/devices/:id/control  # 控制设备
DELETE /api/v1/devices/:id          # 删除设备
```

### 数据查询接口

```
GET    /api/v1/sensors/data         # 获取传感器数据
GET    /api/v1/sensors/data/latest  # 获取最新数据
GET    /api/v1/sensors/data/history # 获取历史数据
```

### 用户管理接口

```
POST   /api/v1/auth/login           # 用户登录
POST   /api/v1/auth/logout          # 用户登出
GET    /api/v1/users/profile        # 获取用户信息
PUT    /api/v1/users/profile        # 更新用户信息
```

### 安防管理接口

```
GET    /api/v1/security/status      # 获取安防状态
POST   /api/v1/security/arm         # 启动布防
POST   /api/v1/security/disarm      # 解除布防
GET    /api/v1/security/events      # 获取安防事件
```

---

## 🎤 AI服务

### 语音识别（ASR）
- **识别引擎**：阿里云语音识别API
- **识别功能**：语音转文字、语义理解、意图识别
- **支持的指令**：打开客厅灯、关闭空调、打开门锁、查看温度
- **响应时间**：< 2秒

### 语音合成（TTS）
- **合成引擎**：讯飞/阿里云语音合成API
- **合成功能**：文字转语音、语音播放
- **应用场景**：语音反馈、报警提示、状态播报

### 大语言模型（LLM）
- **模型**：智谱 GLM-4-Flash
- **功能**：自然语言对话、Function Calling、意图识别、上下文理解
- **应用场景**：智能语音助理、复杂指令理解、生活建议

---

## 📱 前端界面

### Web前端界面

**技术栈**：Vue.js 3 + Ant Design Vue + ECharts

**功能模块**：
- 用户登录/登出
- 设备管理
- 传感器数据展示
- 设备控制
- 安防管理
- 数据可视化
- 实时数据推送

### 移动端App

**技术栈**：Flutter

**功能模块**：
- 用户登录/登出
- 设备管理
- 传感器数据查看
- 设备控制
- 安防管理
- 消息推送
- 语音交互

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日
