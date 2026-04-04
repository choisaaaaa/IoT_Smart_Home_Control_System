# 智慧酒店物联网控制系统 - 项目总结

## 📋 项目概述

智慧酒店物联网控制系统是一个基于物联网技术的酒店管理平台，实现了酒店前台管理、楼层控制和客房端的三-tier架构，支持云协同工作。

## 🎯 技术栈

### 后端技术

- **Node.js 20.x**: 运行环境
- **Express.js 4.18.2**: Web框架
- **TypeScript 5.3.3**: 类型安全
- **MySQL 8.0**: 关系型数据库
- **Redis 7.x**: 缓存和会话管理
- **MQTT**: 物联网设备通信
- **WebSocket**: 实时通信
- **JWT**: 用户认证
- **Winston**: 日志管理

### 前端技术

- **Vue.js 3.x**: 前端框架
- **Element Plus**: UI组件库
- **TypeScript**: 类型安全
- **Vite**: 构建工具

### DevOps

- **Docker**: 容器化部署
- **Docker Compose**: 多容器编排
- **Git**: 版本控制

## 📁 项目结构

```
IoT_Smart_Hotel_System/
├── backend/                      # 后端服务
│   └── iot-hotel-backend/
│       ├── src/
│       │   ├── config/          # 配置文件
│       │   │   ├── app.ts
│       │   │   ├── database.ts
│       │   │   ├── index.ts
│       │   │   ├── mqtt.ts
│       │   │   └── redis.ts
│       │   ├── controllers/     # 控制器层
│       │   │   ├── hotel.controller.ts
│       │   │   ├── room.controller.ts
│       │   │   ├── booking.controller.ts
│       │   │   ├── payment.controller.ts
│       │   │   ├── member.controller.ts
│       │   │   ├── coupon.controller.ts
│       │   │   ├── delivery.controller.ts
│       │   │   ├── maintenance.controller.ts
│       │   │   └── review.controller.ts
│       │   ├── services/        # 服务层
│       │   │   ├── hotel.service.ts
│       │   │   ├── room.service.ts
│       │   │   ├── booking.service.ts
│       │   │   ├── payment.service.ts
│       │   │   ├── member.service.ts
│       │   │   ├── coupon.service.ts
│       │   │   ├── delivery.service.ts
│       │   │   ├── maintenance.service.ts
│       │   │   └── review.service.ts
│       │   ├── models/          # 数据模型
│       │   │   ├── hotel.model.ts
│       │   │   ├── room.model.ts
│       │   │   ├── booking.model.ts
│       │   │   ├── payment.model.ts
│       │   │   ├── member.model.ts
│       │   │   ├── coupon.model.ts
│       │   │   ├── delivery.model.ts
│       │   │   ├── maintenance.model.ts
│       │   │   └── review.model.ts
│       │   ├── routes/          # 路由
│       │   │   ├── v1/
│       │   │   │   ├── hotels.ts
│       │   │   │   ├── rooms.ts
│       │   │   │   ├── bookings.ts
│       │   │   │   ├── payments.ts
│       │   │   │   ├── members.ts
│       │   │   │   ├── coupons.ts
│       │   │   │   ├── delivery.ts
│       │   │   │   ├── maintenance.ts
│       │   │   │   └── reviews.ts
│       │   │   └── index.ts
│       │   ├── middleware/      # 中间件
│       │   │   ├── auth.ts
│       │   │   └── error.ts
│       │   ├── utils/           # 工具函数
│       │   │   ├── jwt.ts
│       │   │   ├── logger.ts
│       │   │   └── password.ts
│       │   ├── types/           # 类型定义
│       │   │   └── index.ts
│       │   ├── app.ts           # 应用入口
│       │   └── server.ts        # 服务器入口
│       ├── docs/                # 文档
│       │   ├── 项目结构说明.md
│       │   ├── 数据库配置说明.md
│       │   ├── 启动指南.md
│       │   └── 完整部署指南.md
│       ├── .env                 # 环境变量
│       ├── .env.example         # 环境变量示例
│       ├── .gitignore           # Git忽略文件
│       ├── tsconfig.json        # TypeScript配置
│       ├── package.json         # 项目配置
│       └── README.md            # 项目说明
├── docker/                      # Docker配置
│   ├── docker-compose.yml       # Docker Compose配置
│   ├── mysql/
│   │   └── init/
│   │       └── schema.sql      # 数据库初始化脚本
│   ├── mqtt/
│   │   └── mosquitto.conf      # MQTT配置
│   └── README.md                # Docker部署指南
├── docs/                        # 项目文档
│   ├── 01-项目概述/
│   ├── 02-需求分析/
│   ├── 03-软件设计/
│   │   ├── API接口文档.md
│   │   └── 数据库设计文档.md
│   └── 04-部署运维/
└── README.md                    # 项目总览
```

## 🗄️ 数据库设计

### 主要表结构

1. **hotels** - 酒店信息表
2. **rooms** - 房间信息表
3. **bookings** - 预订表
4. **payments** - 支付表
5. **members** - 会员表
6. **coupons** - 优惠券表
7. **member_coupons** - 会员优惠券关联表
8. **delivery_orders** - 送物订单表
9. **maintenance_tickets** - 报修工单表
10. **reviews** - 服务评价表
11. **devices** - 设备表
12. **sensor_data** - 传感器数据表
13. **control_commands** - 控制指令表
14. **users** - 用户表
15. **security_events** - 安防事件表
16. **device_auth** - 设备认证表
17. **system_logs** - 系统日志表
18. **network_config** - 配网记录表

## 🔌 API接口

### 1. 酒店管理接口

- `GET /api/v1/hotels` - 获取酒店信息
- `PUT /api/v1/hotels` - 更新酒店信息

### 2. 房间管理接口

- `GET /api/v1/rooms` - 获取房间列表
- `GET /api/v1/rooms/:id` - 获取房间详情
- `POST /api/v1/rooms` - 创建房间
- `PUT /api/v1/rooms/:id` - 更新房间
- `DELETE /api/v1/rooms/:id` - 删除房间

### 3. 预订管理接口

- `GET /api/v1/bookings` - 获取预订列表
- `GET /api/v1/bookings/:id` - 获取预订详情
- `POST /api/v1/bookings` - 创建预订
- `PUT /api/v1/bookings/:id/confirm` - 确认预订
- `PUT /api/v1/bookings/:id/checkin` - 办理入住
- `PUT /api/v1/bookings/:id/checkout` - 办理退房
- `PUT /api/v1/bookings/:id/cancel` - 取消预订

### 4. 支付管理接口

- `GET /api/v1/payments` - 获取支付列表
- `GET /api/v1/payments/:id` - 获取支付详情
- `POST /api/v1/payments` - 创建支付订单
- `PUT /api/v1/payments/:id/pay` - 支付

### 5. 会员管理接口

- `GET /api/v1/members` - 获取会员列表
- `GET /api/v1/members/:id` - 获取会员详情
- `POST /api/v1/members` - 注册会员
- `PUT /api/v1/members/:id` - 更新会员信息
- `POST /api/v1/members/login` - 会员登录

### 6. 优惠券管理接口

- `GET /api/v1/coupons` - 获取优惠券列表
- `GET /api/v1/coupons/:id` - 获取优惠券详情
- `POST /api/v1/coupons` - 创建优惠券
- `PUT /api/v1/coupons/:id` - 更新优惠券
- `DELETE /api/v1/coupons/:id` - 删除优惠券
- `POST /api/v1/coupons/:id/receive` - 领取优惠券

### 7. 送物订单接口

- `GET /api/v1/delivery` - 获取送物订单列表
- `GET /api/v1/delivery/:id` - 获取送物订单详情
- `POST /api/v1/delivery` - 创建送物订单
- `PUT /api/v1/delivery/:id/complete` - 完成送物订单

### 8. 报修工单接口

- `GET /api/v1/maintenance` - 获取报修工单列表
- `GET /api/v1/maintenance/:id` - 获取报修工单详情
- `POST /api/v1/maintenance` - 创建报修工单
- `PUT /api/v1/maintenance/:id/assign` - 分配维修人员
- `PUT /api/v1/maintenance/:id/complete` - 完成报修工单

### 9. 服务评价接口

- `GET /api/v1/reviews` - 获取评价列表
- `GET /api/v1/reviews/:id` - 获取评价详情
- `POST /api/v1/reviews` - 创建评价

## 🚀 启动方式

### 本地开发

```bash
cd backend/iot-hotel-backend
npm install
cp .env.example .env
npm run dev
```

### Docker部署

```bash
cd docker
docker-compose up -d
```

## 🔐 安全特性

1. **JWT认证**: 使用JSON Web Token进行用户认证
2. **密码加密**: 使用bcryptjs进行密码哈希
3. **SQL注入防护**: 使用参数化查询
4. **XSS防护**: 使用Helmet中间件
5. **CORS配置**: 限制跨域请求
6. **速率限制**: 防止DDoS攻击
7. **设备认证**: 使用设备ID和设备密钥进行设备认证

## 📊 性能优化

1. **数据库连接池**: 使用mysql2连接池提高性能
2. **Redis缓存**: 缓存常用数据
3. **Gzip压缩**: 使用compression中间件
4. **异步处理**: 使用async/await提高性能
5. **分页查询**: 支持大数据量查询
6. **索引优化**: 为常用查询字段添加索引

## 🐛 错误处理

1. **全局错误处理**: 统一错误处理中间件
2. **日志记录**: 使用Winston记录日志
3. **错误响应**: 统一错误响应格式
4. **异常捕获**: 捕获异步异常

## 📝 开发规范

1. **代码风格**: 遵循ESLint规则
2. **类型安全**: 使用TypeScript
3. **命名规范**: 驼峰命名、帕斯卡命名等
4. **注释规范**: 添加必要的注释
5. **提交规范**: 遵循Conventional Commits

## 📚 文档

1. [项目结构说明](./docs/项目结构说明.md)
2. [数据库配置说明](./docs/数据库配置说明.md)
3. [启动指南](./docs/启动指南.md)
4. [完整部署指南](./docs/完整部署指南.md)
5. [Docker配置说明](./docs/Docker配置说明.md)

## 🔮 未来计划

1. **前端开发**: 实现Vue.js前端界面
2. **设备管理**: 实现设备配网和控制
3. **数据分析**: 实现数据统计和分析
4. **AI服务**: 集成AI客服和推荐系统
5. **移动端**: 开发移动端应用
6. **微服务**: 拆分为微服务架构

## 📞 联系方式

- **邮箱**: support@iot-hotel.com
- **电话**: 400-123-4567
- **官网**: https://www.iot-hotel.com

---

**版本**: v2.0.0  
**最后更新**: 2026年4月4日
