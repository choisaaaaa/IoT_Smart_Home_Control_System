# Docker部署和访问指南

本指南详细说明如何使用Docker部署智慧酒店物联网控制系统。

## 📋 目录

1. [环境准备](#环境准备)
2. [项目结构说明](#项目结构说明)
3. [Docker Compose配置](#docker-compose配置)
4. [服务启动与管理](#服务启动与管理)
5. [访问与测试](#访问与测试)
6. [常见问题](#常见问题)

---

## 🛠️ 环境准备

### 系统要求

- **操作系统**：Windows 10/11, macOS, Linux (Ubuntu/CentOS)
- **Docker版本**：24.0+
- **Docker Compose版本**：2.20+
- **内存**：至少4GB可用内存
- **存储**：至少20GB可用空间

### 安装Docker

#### Windows/Mac

访问 [Docker Desktop](https://www.docker.com/products/docker-desktop) 下载并安装

#### Linux (Ubuntu)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Linux (CentOS)

```bash
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 验证安装

```bash
docker --version
docker-compose --version
```

---

## 📁 项目结构说明

```
iot-smart-hotel/
├── backend/              # 后端服务
│   ├── src/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── .env.example
│   └── package.json
├── frontend/            # 前端服务
│   ├── docker/
│   │   └── nginx.conf
│   └── package.json
├── docker/              # Docker配置
│   └── docker-compose.yml
└── README.md
```

---

## ⚙️ Docker Compose配置

### docker-compose.yml

```yaml
version: '3.8'

services:
  # 后端服务
  backend:
    build:
      context: ../backend
      dockerfile: docker/Dockerfile
    container_name: iot-smart-hotel-backend
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=iot_user
      - DB_PASSWORD=iot_password
      - DB_NAME=iot_smart_hotel
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - MQTT_HOST=mqtt
      - MQTT_PORT=1883
      - JWT_SECRET=your_jwt_secret_key_here
      - AI_API_KEY=your_glm_api_key
    depends_on:
      - mysql
      - redis
      - mqtt
    restart: unless-stopped
    networks:
      - iot-network
    volumes:
      - ./backend/logs:/app/logs

  # 前端服务
  frontend:
    build:
      context: ../frontend
      dockerfile: docker/Dockerfile
    container_name: iot-smart-hotel-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - iot-network

  # MySQL数据库
  mysql:
    image: mysql:8.0
    container_name: iot-smart-hotel-mysql
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=iot_smart_hotel
      - MYSQL_USER=iot_user
      - MYSQL_PASSWORD=iot_password
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped
    networks:
      - iot-network

  # Redis缓存
  redis:
    image: redis:7.0
    container_name: iot-smart-hotel-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - iot-network

  # MQTT Broker
  mqtt:
    image: eclipse-mosquitto:2.0
    container_name: iot-smart-hotel-mqtt
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mqtt/config:/mosquitto/config
      - ./mqtt/data:/mosquitto/data
      - ./mqtt/log:/mosquitto/log
    restart: unless-stopped
    networks:
      - iot-network

networks:
  iot-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

---

## ▶️ 服务启动与管理

### 启动所有服务

```bash
cd iot-smart-hotel
docker-compose up -d
```

### 查看服务状态

```bash
docker-compose ps
```

### 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f mqtt
```

### 停止服务

```bash
docker-compose down
```

### 重启服务

```bash
docker-compose restart
```

### 停止并删除所有容器

```bash
docker-compose down
```

### 停止并删除所有容器和卷

```bash
docker-compose down -v
```

---

## 🌐 访问与测试

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 后端API | http://localhost:3000 | RESTful API服务 |
| WebSocket | ws://localhost:3001 | WebSocket实时通信 |
| 前端页面 | http://localhost | Vue3前端页面 |
| MySQL | localhost:3306 | MySQL数据库 |
| Redis | localhost:6379 | Redis缓存 |
| MQTT | localhost:1883 | MQTT Broker |

### API测试

#### 健康检查

```bash
curl http://localhost:3000/api/v1/health
```

预期响应：

```json
{
  "code": 200,
  "message": "OK",
  "timestamp": "2026-04-04T12:00:00Z"
}
```

#### 获取设备列表

```bash
curl http://localhost:3000/api/v1/devices
```

#### 登录

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 前端页面

打开浏览器访问：http://localhost

---

## 🐛 常见问题

### 问题1：端口被占用

**错误信息**：
```
Error response from daemon: driver failed programming external connectivity on endpoint xxx
Error: starting container failed: address already in use
```

**解决方法**：

1. 查找占用端口的进程

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. 停止占用端口的进程

```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

3. 或修改docker-compose.yml中的端口映射

### 问题2：数据库连接失败

**错误信息**：
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**解决方法**：

1. 检查MySQL服务状态

```bash
docker-compose ps
docker-compose logs mysql
```

2. 等待MySQL完全启动（可能需要10-30秒）

3. 检查数据库配置

```bash
# 进入容器
docker exec -it iot-smart-hotel-mysql bash

# 测试连接
mysql -u iot_user -p
```

### 问题3：MQTT连接失败

**错误信息**：
```
Error: connect ECONNREFUSED 127.0.0.1:1883
```

**解决方法**：

1. 检查MQTT服务状态

```bash
docker-compose ps
docker-compose logs mqtt
```

2. 确保MQTT配置文件存在

```bash
mkdir -p mqtt/config mqtt/data mqtt/log
```

### 问题4：容器启动失败

**错误信息**：
```
Error response from daemon: container xxx encountered an error
```

**解决方法**：

1. 查看详细日志

```bash
docker-compose logs <service-name>
```

2. 清理并重新构建

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

3. 检查Docker资源限制

```bash
docker system df
docker system prune
```

### 问题5：前端无法访问后端API

**错误信息**：
```
Network Error
CORS policy: No 'Access-Control-Allow-Origin' header
```

**解决方法**：

1. 检查后端CORS配置

```typescript
// backend/src/app.ts
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

2. 检查网络配置

```bash
docker-compose ps
docker network inspect iot-smart-hotel_iot-network
```

### 问题6：数据持久化问题

**问题**：容器重启后数据丢失

**解决方法**：

1. 确保使用了volume挂载

```yaml
volumes:
  mysql-data:/var/lib/mysql
  redis-data:/data
```

2. 备份数据

```bash
docker exec -t mysql mysqldump -u root -p<password> iot_smart_hotel > backup.sql
```

3. 恢复数据

```bash
docker exec -i mysql mysql -u root -p<password> iot_smart_hotel < backup.sql
```

---

## 📊 监控与调试

### 查看容器资源使用

```bash
docker stats
```

### 进入容器

```bash
docker exec -it iot-smart-hotel-backend bash
docker exec -it iot-smart-hotel-mysql bash
docker exec -it iot-smart-hotel-redis bash
```

### 查看文件

```bash
docker exec -it iot-smart-hotel-backend ls -la /app
docker exec -it iot-smart-hotel-backend cat /app/.env
```

### 重启特定服务

```bash
docker-compose restart backend
docker-compose restart mysql
```

---

## 🚀 生产环境部署

生产环境部署建议参考 [Ubuntu云服务器部署指南](./Ubuntu云服务器部署指南.md)

主要差异：

1. 使用真实域名
2. 配置SSL证书
3. 使用Nginx反向代理
4. 配置防火墙规则
5. 启用日志收集
6. 配置监控告警

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日
