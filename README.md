# 智联酒店 - 智慧酒店物联网控制系统

**管理端 · 前台端 · 客户端** 三端协同 | AI 客房管家 | IoT 设备实时监控

[功能介绍](#-系统架构) · [快速开始](#-快速开始) · [开发指南](#-开发指南) · [部署文档](#-部署文档)


---

## 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    客户端 (Guest)                      │
│   客房预订 / 在线入住 / AI管家 / 送物 / 联系前台       │
├─────────────────────────────────────────────────────┤
│                    前台端 (Reception)                   │
│   入住退房 / 工单处理 / 送物管理 / 预订 / 余量 / 报表    │
├─────────────────────────────────────────────────────┤
│                    管理端 (Admin)                       │
│   设备监控 / 房间编辑 / 酒店信息 / 账单报表             │
├──────────┬──────────┬────────────────────────────────┤
│  前端     │          │         后端                     │
│ Vue3+Vite│  HTTP/WS │  Node.js + Express              │
│ Pinia    │ ──────>  │  MySQL 8.0  MQTT  WebSocket      │
│ ECharts  │          │                                  │
└──────────┴──────────┴────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Docker Compose   │
                    │  MySQL(3307)       │
                    │  Mosquitto(1883)   │
                    └───────────────────┘
```

### 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Vue 3 + TypeScript + Vite、Ant Design Vue 4、Pinia、ECharts、Socket.io-client |
| **后端** | Node.js 20 + Express + TypeScript、MySQL 2/promise、JWT 认证 |
| **实时通信** | MQTT（Mosquitto）、WebSocket（Socket.io）|
| **容器化** | Docker Compose（MySQL + MQTT）|

---

## 快速开始

### 环境要求

- **Node.js** >= 18.x（推荐 20.x）
- **npm** >= 9.x 或 **pnpm** >= 8.x
- **Docker & Docker Compose**（用于 MySQL + MQTT）
- **Git**

### 第一步：克隆项目

```bash
git clone <仓库地址> IoT_Smart_Hotel_System
cd IoT_Smart_Hotel_System
```

### 第二步：启动基础设施（Docker）

```bash
cd docker
docker-compose up -d
```

启动后：
- **MySQL**: `localhost:3307`（root / iot_hotel_password）
- **MQTT Broker**: `localhost:1883`（无需认证）

数据库将自动执行 `docker/mysql/init/schema.sql` 初始化表结构。

### 第三步：配置并启动后端

```bash
cd backend/iot-hotel-backend

# 复制环境变量模板
cp .env.example .env

# 安装依赖
npm install

# 类型检查（可选，确认无 TS 错误）
npx tsc --noEmit

# 启动开发服务器
npm run dev
```

后端运行在 **http://localhost:3000**，API 前缀为 `/api/v1`。

### 第四步：启动前端

```bash
cd frontend/iot-hotel-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端运行在 **http://localhost:5173**（端口可能因占用自动递增）。

### 第五步：验证

浏览器打开前端地址，默认跳转至**管理端仪表盘**。侧边栏底部可切换三端：

| 入口 | 地址 | 说明 |
|------|------|------|
| 管理端 | `/admin/dashboard` | 设备监控、信息编辑、账单报表 |
| 前台端 | `/reception/dashboard` | 入住退房、工单、送物、预订等 |
| 客户端 | `/guest/booking` | 预订入住、AI管家、客房服务 |

---

## 开发指南

### 项目目录结构

```
IoT_Smart_Hotel_System/
├── backend/iot-hotel-backend/        # 后端服务
│   ├── src/
│   │   ├── controllers/               # 控制层（路由处理）
│   │   ├── services/                  # 业务逻辑层
│   │   ├── models/                    # 数据模型
│   │   ├── routes/v1/                 # RESTful API 路由
│   │   ├── middleware/                # 中间件（JWT/CORS/日志）
│   │   ├── config/                    # 配置（DB/MQTT/Redis）
│   │   ├── types/                     # TypeScript 类型定义
│   │   └── utils/                     # 工具函数
│   ├── database/init.sql              # 数据库初始化脚本
│   ├── docker-compose.yml             # 本地开发用 Docker 服务
│   └── .env.example                   # 环境变量模板
│
├── frontend/iot-hotel-web/            # 前端应用
│   ├── src/
│   │   ├── api/                       # Axios API 封装
│   │   ├── components/layout/         # AdminLayout / ReceptionLayout / GuestLayout
│   │   ├── views/admin/               # 管理端页面（5个）
│   │   ├── views/reception/           # 前台端页面（7个）
│   │   ├── views/guest/               # 客户端页面（3个）
│   │   ├── stores/                    # Pinia 状态管理
│   │   ├── types/                     # 共享类型定义
│   │   ├── router/                    # Vue Router 三端路由
│   │   └── utils/websocket.ts         # WebSocket 连接工具
│   └── vite.config.ts                 # Vite 配置（含代理）
│
├── docker/                            # 生产级 Docker 配置
├── docs/                              # 项目文档
├── hardware/                          # ESP32 硬件固件
├── .editorconfig                      # 统一编码风格
├── .gitignore                         # Git 忽略规则
└── README.md                          # 本文件
```

### 编码规范

项目已配置 `.editorconfig`，所有团队成员安装 EditorConfig 插件即可自动生效：

| 规则 | 值 |
|------|-----|
| 缩进 | 2 空格 |
| 字符集 | UTF-8 |
| 换行符 | LF |
| 文件末尾 | 自动换行 |

### 分支策略

```
main ← develop ← feature/* ← 你的分支
```

- **main**: 生产分支，受保护
- **develop**: 日常开发主分支
- **feature/xxx**: 功能分支，完成后提 PR 合并

### Git 提交规范

```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | chore
scope: backend | frontend | admin | reception | guest | config | docs
```

### 详细协作文档

→ 查看 [协同开发指南](./docs/05-项目管理/协同开发指南.md)

---

## 部署文档

### 本地开发部署

→ 查看 [跨平台开发环境配置指南](./docs/04-部署运维/跨平台开发环境配置指南.md)

### 云服务器部署（Ubuntu）

→ 查看 [Ubuntu云服务器部署指南](./docs/04-部署运维/Ubuntu云服务器部署指南.md)

### Docker 一键部署

→ 查看 [Docker部署和访问指南](./docs/04-部署运维/Docker部署和访问指南.md)

### 后端详细文档

| 文档 | 路径 |
|------|------|
| 项目结构说明 | `backend/iot-hotel-backend/docs/项目结构说明.md` |
| 启动指南 | `backend/iot-hotel-backend/docs/启动指南.md` |
| 完整部署指南 | `backend/iot-hotel-backend/docs/完整部署指南.md` |
| Docker 配置说明 | `backend/iot-hotel-backend/docs/Docker配置说明.md` |
| 数据库设计 | `docs/03-软件设计/数据库设计文档.md` |
| API 接口文档 | `docs/03-软件设计/API接口文档.md` |

---

## 核心功能清单

### 管理端 (`/admin`)
- 总览仪表盘 — 设备在线率、房间状态、酒店信息概览
- 设备监控 — IoT 设备卡片列表、在线/离线状态、发送指令
- 房间信息管理 — 房间 CRUD、房型配置
- 酒店信息编辑 — 名称、星级、地址等编辑
- 账单报表 — 收入统计、账单明细、导出打印

### 前台端 (`/reception`)
- 前台总览 — 今日入住/退房、在住客人、待处理事项
- 入住退房 — 线下办理入住表单、退房结算列表
- 预订管理 — 预订列表、确认/入住/取消操作
- 客房余量 — 表格视图 + 楼层平面图双模式
- 工单处理 — 维修/清洁/服务工单、优先级、状态流转
- 客房送物 — 送物订单创建与配送跟踪
- 账单报表 — 营收统计、账单明细、收款

### 客户端 (`/guest`)
- 客房预订 — 预订表单 + 热门房型推荐
- 在线办理入住 — 四步流程（验证 → 填信息 → 确认 → 完成）
- 客房服务 — AI 管家聊天 / 送物请求 / 联系前台 / 更多服务

---

## 常见问题

### Q: 前端页面报 "Failed to fetch dynamically imported module"
A: 检查 `.vue` 文件的模板闭合标签是否正确（应为 `</template>` 而非 `</a-template>`），或重启 Vite 开发服务器。

### Q: 后端 IDE 显示大量类型错误
A: 执行 **"TypeScript: Restart TS Server"**（Ctrl+Shift+P），确保 `node_modules/@types/` 已被索引。

### Q: MySQL 端口冲突（3306 被占用）
A: Docker Compose 已将 MySQL 映射到 **3307** 端口，`.env` 中需设置 `DB_PORT=3307`。

### Q: 前端代理不生效
A: Vite 代理在 `vite.config.ts` 中配置，仅对 `dev` 模式生效。生产环境需使用 Nginx 反向代理。

### Q: 移植到别的电脑上密码会变吗？
A: **不会变。** 密码写死在配置文件中，跟电脑无关。迁移步骤：

```bash
# 1. 拷贝整个项目文件夹到新电脑
# 2. 启动 Docker Desktop
# 3. 启动服务
cd backend/iot-hotel-backend
docker-compose up -d
```

MySQL 自动以相同密码创建，本地开发默认凭证：

| 配置项 | 值 | 文件 |
|--------|-----|------|
| 用户名 | `root` | `.env` |
| 密码 | `IotHotel2026` | `.env` |
| 端口 | `3307`（映射） | `.env` + `docker-compose.yml` |
| 数据库 | `iot_hotel_system` | `.env` |

> ⚠️ 若新电脑 **3307 端口被占用**，修改 `.env` 的 `DB_PORT` 和 `docker-compose.yml` 的端口映射即可，密码不受影响。

---

## 版本信息

| 项目 | 版本 |
|------|------|
| 后端 | v2.0.0 |
| 前端 | v1.0.0 |
| 更新日期 | 2026-04-04 |

---
