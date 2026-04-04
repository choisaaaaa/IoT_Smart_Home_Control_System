# 智慧酒店物联网控制系统 - 软件设计文档

本目录包含软件设计相关的文档，涵盖整体架构选型、后端开发、前端开发、环境部署等内容。

## 📚 文档列表

### 1. 01-整体架构选型.md
- **描述**：系统整体架构设计和技术栈选型
- **内容**：
  - 三层架构 + 云端协同设计
  - 技术栈详细选型（前端/后端/嵌入式/DevOps）
  - 项目目录结构说明
  - 通信架构设计
  - 安全架构设计
  - 性能指标设计
  - 部署架构设计

### 2. 02-后端开发教程.md
- **描述**：后端服务开发完整教程
- **内容**：
  - 环境准备（Node.js/MySQL/Redis/MQTT）
  - 项目初始化和配置
  - 数据库设计和表结构
  - MQTT服务开发
  - 认证授权（JWT）
  - WebSocket服务
  - AI服务集成（GLM-4/ASR/TTS）
  - 数据可视化（ECharts）
  - 测试（单元测试/API测试）
  - Docker部署
  - 开发规范

### 3. 03-前端开发教程.md
- **描述**：Web前端和移动端开发完整教程
- **内容**：
  - 环境准备（Node.js/Vue 3）
  - 项目初始化和配置
  - UI组件库配置（Ant Design Vue）
  - WebSocket集成
  - API服务集成
  - 数据可视化（ECharts）
  - 移动端适配
  - 主题定制
  - 测试（单元测试/E2E测试）
  - Docker部署
  - 开发规范

### 4. 04-环境部署教程.md
- **描述**：完整环境部署教程
- **内容**：
  - 开发环境部署（本地开发环境）
  - Docker环境部署（容器化部署）
  - 云服务器部署（Ubuntu云服务器）
  - CI/CD持续集成/持续部署
  - 监控与日志管理
  - 安全加固
  - 运维手册
  - 常见问题解决方案

### 5. 05-技术栈与目录结构.md
- **描述**：详细的技术栈说明和项目目录结构
- **内容**：
  - 前端技术栈详解
  - 后端技术栈详解
  - 嵌入式技术栈详解
  - DevOps技术栈详解
  - 完整项目目录结构
  - 通信协议设计（MQTT/HTTP/WebSocket）
  - 数据库设计
  - 安全设计
  - 部署架构
  - 开发流程和规范
  - 常用命令参考

---

## 🏗️ 软件架构

### 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         智慧酒店三层架构                                │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                  🖥️ 前台电脑端（管理员）                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │ │
│  │  │ GUI工作台     │  │ 🤖酒店管家   │  │ MQTT客户端   │             │ │
│  │  │ (酒店管理)    │  │ (AI语音/工单)│  │ (WiFi/有线)  │             │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │ │
│  └─────────┼────────────────┼────────────────┼─────────────────────────┘ │
│            │                │                │                           │
│            └────────────────┼────────────────┘                           │
│                             │ USB串口                                    │
│  ┌──────────────────────────┼──────────────────────────────────────────┐ │
│  │                 🔌 前台管理端硬件（USB外设）                         │ │
│  │  ┌──────┐ ┌────┐ ┌──────┐ ┌────┐ ┌─────┐ ┌──────┐                 │ │
│  │  │RFID  │ │RGB │ │ 按键  │ │蜂鸣 │ │RS485│ │ UART │                 │ │
│  │  │RC522 │ │灯带 │ │+SOS  │ │器   │ │模块 │ │扩展口│                 │ │
│  │  └──┬───┘ └────┘ └──────┘ └────┘ └──┬──┘ └──┬───┘                 │ │
│  └─────┼────┴────┘ └──────┘ └────┘ └──┬──┘ └──┬───┘                 │ │
│        │                               │        │                       │ │
│  ┌─────▼───────┐  ┌───────────────────▼────────▼───────┐             │ │
│  │  🏢 楼控     │  │  🛏️ 客房端                          │             │ │
│  │  楼层管理    │  │  客房控制                            │             │ │
│  └─────────────┘  └─────────────────────────────────────┘             │ │
│                                                                         │ │
└─────────────────────────────────────────────────────────────────────────┘ │
                                    ↕ MQTT/API                            │
┌─────────────────────────────────────────────────────────────────────────┐ │
│                    📱 手机端（住客/员工）                               │ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │ │
│  │ 客房服务      │  │ 联系前台     │  │ 设备控制      │                 │ │
│  │ (送物/报修)   │  │ (通话/消息)  │  │ (灯光/空调)   │                 │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                 │ │
│         │                  │                  │                          │ │
│         └──────────────────┼──────────────────┘                          │ │
│                            │                                             │ │
│                   ┌────────▼────────┐                                   │ │
│                   │   Node.js 后端   │                                   │ │
│                   │   (Express.js)   │                                   │ │
│                   └────────┬─────────┘                                   │ │
│                            │                                              │ │
│              ┌─────────────┼─────────────┐                               │ │
│              ▼             ▼             ▼                               │ │
│        ┌──────────┐  ┌──────────┐  ┌──────────┐                         │ │
│        │  MySQL   │  │  Redis   │  │  MQTT    │                         │ │
│        │  (主库)   │  │  (缓存)   │  │  (消息)   │                         │ │
│        └──────────┘  └──────────┘  └──────────┘                         │ │
│              │                                                           │ │
│              ▼                                                           │ │
│        ┌──────────┐                                                      │ │
│        │  AI服务   │                                                      │ │
│        │ (GLM-4)  │                                                      │ │
│        └──────────┘                                                      │ │
│                                                                          │ │
│  ┌───────────────────────────────────────────────────────────────────┐ │ │
│  │                    数据存储层                                       │ │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │ │ │
│  │  │  MySQL   │  │  Redis   │  │  MQTT    │                         │ │ │
│  │  │  (主库)   │  │  (缓存)   │  │  (消息)   │                         │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘                         │ │ │
│  └───────────────────────────────────────────────────────────────────┘ │ │
└─────────────────────────────────────────────────────────────────────────┘ │
```

### 技术栈

**前端技术栈**：
- Web前端：Vue.js 3 + TypeScript + Ant Design Vue + ECharts
- 移动端：Vue.js PWA / Capacitor
- 状态管理：Pinia
- HTTP客户端：Axios
- WebSocket客户端：Socket.io-client

**后端技术栈**：
- 后端框架：Node.js 20.x LTS + Express + TypeScript
- 数据库：MySQL 8.0（主数据库）+ Redis 7.0（缓存）
- 消息队列：MQTT Broker（Mosquitto 2.0）
- 实时通信：WebSocket（Socket.io）
- AI服务：智谱GLM-4-Flash（大语言模型）、阿里云ASR（语音识别）、讯飞TTS（语音合成）

**嵌入式技术栈**：
- 主控芯片：ESP32-WROOM-32（楼控/客房端）、ESP32-S2-MINI（前台管理端）
- 开发环境：Arduino IDE / ESP-IDF / PlatformIO
- 通信协议：MQTT / HTTP / WebSocket / USB串口

**DevOps技术栈**：
- 容器化：Docker 24.0 + Docker Compose
- 反向代理：Nginx 1.25+
- 进程管理：PM2 5.3+
- 版本控制：Git 2.44+
- CI/CD：GitHub Actions

---

## 📊 数据库设计

### 数据库表结构

#### 用户表（users）
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 设备表（devices）
```sql
CREATE TABLE devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL,
    device_name VARCHAR(50) NOT NULL,
    device_key VARCHAR(50) NOT NULL,
    device_status VARCHAR(20) DEFAULT 'offline',
    firmware_version VARCHAR(20),
    last_seen DATETIME,
    room_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_device_status (device_status),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 传感器数据表（sensor_data）
```sql
CREATE TABLE sensor_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50) NOT NULL,
    sensor_type VARCHAR(20) NOT NULL,
    sensor_value VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 控制指令表（control_commands）
```sql
CREATE TABLE control_commands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50) NOT NULL,
    command_type VARCHAR(20) NOT NULL,
    command_value VARCHAR(50) NOT NULL,
    command_status VARCHAR(20) DEFAULT 'pending',
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    executed_at DATETIME,
    INDEX idx_device_id (device_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 房间表（rooms）
```sql
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id VARCHAR(20) UNIQUE NOT NULL,
    room_name VARCHAR(50) NOT NULL,
    room_type VARCHAR(20),
    floor VARCHAR(10),
    status VARCHAR(20) DEFAULT 'empty',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_room_id (room_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔌 通信协议设计

### MQTT协议

```
iot/smart/home/
├── cmd/                     # 控制指令
│   ├── device/{device_id}/set    # 设备控制
│   ├── room/{room_id}/set        # 房间控制
│   └── broadcast                 # 广播指令
├── status/                  # 设备状态
│   ├── device/{device_id}        # 设备状态上报
│   ├── sensor/{device_id}        # 传感器数据
│   └── room/{room_id}            # 房间状态
├── event/                   # 事件通知
│   ├── alarm/{device_id}         # 报警事件
│   └── error/{device_id}         # 错误事件
└── system/                  # 系统消息
    ├── heartbeat                 # 心跳消息
    └── config                    # 配置更新
```

### API接口设计

#### 设备管理接口

```
GET    /api/v1/devices              # 获取设备列表
GET    /api/v1/devices/:id          # 获取设备详情
POST   /api/v1/devices/:id/control  # 控制设备
DELETE /api/v1/devices/:id          # 删除设备
```

#### 数据查询接口

```
GET    /api/v1/sensors/data         # 获取传感器数据
GET    /api/v1/sensors/data/latest  # 获取最新数据
GET    /api/v1/sensors/data/history # 获取历史数据
```

#### 用户管理接口

```
POST   /api/v1/auth/login           # 用户登录
POST   /api/v1/auth/logout          # 用户登出
GET    /api/v1/users/profile        # 获取用户信息
PUT    /api/v1/users/profile        # 更新用户信息
```

#### AI服务接口

```
POST   /api/v1/ai/chat              # AI对话
POST   /api/v1/ai/recognize         # 意图识别
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

**技术栈**：Vue.js 3 + TypeScript + Ant Design Vue + ECharts

**功能模块**：
- 用户登录/登出
- 设备管理
- 传感器数据展示
- 设备控制
- 安防管理
- 数据可视化
- 实时数据推送

### 移动端App

**技术栈**：Vue.js PWA / Capacitor

**功能模块**：
- 用户登录/登出
- 设备管理
- 传感器数据查看
- 设备控制
- 安防管理
- 消息推送
- 语音交互

---

## 📂 项目结构

### 后端项目结构

```
iot-smart-hotel-backend/
├── src/                           # 源代码
│   ├── config/                    # 配置文件
│   ├── controllers/               # 控制器
│   ├── services/                  # 业务逻辑层
│   ├── models/                    # 数据模型
│   ├── routes/                    # 路由
│   ├── middleware/                # 中间件
│   ├── utils/                     # 工具函数
│   ├── app.ts                     # 应用入口
│   └── server.ts                  # 服务器启动
├── sql/                           # SQL脚本
├── tests/                         # 测试文件
├── docker/                        # Docker配置
└── README.md                      # 项目说明
```

### Web前端项目结构

```
iot-smart-hotel-web/
├── src/                           # 源代码
│   ├── assets/                    # 静态资源
│   ├── components/                # 公共组件
│   ├── views/                     # 页面组件
│   ├── router/                    # 路由配置
│   ├── stores/                    # 状态管理
│   ├── services/                  # API服务
│   ├── utils/                     # 工具函数
│   ├── types/                     # TypeScript类型定义
│   ├── App.vue                    # 根组件
│   └── main.ts                    # 应用入口
├── public/                        # 公共文件
├── docker/                        # Docker配置
└── README.md                      # 项目说明
```

### 嵌入式项目结构

```
iot-smart-hotel-embedded/
├──前台管理端/                      # 前台管理端固件
├──楼控/                           # 楼控固件
├──客房端/                          # 客房端固件
└── README.md                      # 嵌入式项目说明
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/iot-smart-hotel.git
cd iot-smart-hotel
```

### 2. 开发环境部署

```bash
# 后端
cd backend
npm install
cp .env.example .env
npm run dev

# 前端
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Docker部署

```bash
cd docker
docker-compose up -d
```

---

## 📖 相关文档

本项目还包含以下相关文档：

1. **01-系统架构/需求说明-整体需求.md**
   - 项目概述
   - 系统架构
   - 设备角色定义
   - 通信架构
   - 功能概述
   - 成本控制
   - 开发周期
   - 技术栈
   - 性能指标
   - 安全性要求

2. **01-系统架构/需求说明-软件系统需求.md**
   - 云端服务器需求
   - 后端服务需求
   - 前端界面需求
   - API接口设计
   - 数据库设计

3. **02-硬件设计/三层硬件架构设计说明.md**
   - 硬件架构设计
   - 设备硬件组成
   - 硬件选型
   - 硬件成本

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日  
**适用项目**：智慧酒店物联网控制系统  
**架构设计**："前台管理端-楼控-客房端"三层架构 + 云端协同
