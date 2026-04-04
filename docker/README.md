# 智慧酒店物联网控制系统 - Docker部署指南

## 🐳 Docker部署

本项目支持使用Docker进行快速部署，包括MySQL、Redis、MQTT和后端服务。

## 📦 Docker Compose配置

### 目录结构

```
docker/
├── docker-compose.yml          # Docker Compose配置
├── mysql/
│   └── init/
│       └── schema.sql         # 数据库初始化脚本
├── mqtt/
│   └── mosquitto.conf         # MQTT配置
└── README.md
```

### 配置说明

#### 1. MySQL配置

- **镜像**: mysql:8.0
- **端口**: 3306
- **数据库**: iot_hotel_system
- **用户名**: iot_user
- **密码**: iot_password

#### 2. Redis配置

- **镜像**: redis:7-alpine
- **端口**: 6379

#### 3. MQTT配置

- **镜像**: eclipse-mosquitto:2.0
- **端口**: 1883 (MQTT), 9001 (WebSocket)
- **匿名访问**: 允许

#### 4. 后端服务配置

- **端口**: 3000
- **环境变量**: 从docker-compose.yml读取

## 🚀 快速部署

### 1. 克隆项目

```bash
git clone https://github.com/your-username/iot-smart-hotel.git
cd iot-smart-hotel
```

### 2. 构建并启动服务

```bash
cd docker
docker-compose up -d
```

### 3. 查看服务状态

```bash
docker-compose ps
```

### 4. 查看日志

```bash
# 所有服务日志
docker-compose logs -f

# 单个服务日志
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f mqtt
```

### 5. 停止服务

```bash
docker-compose down
```

### 6. 重启服务

```bash
docker-compose restart
```

## 📊 访问服务

### 后端API

```
http://localhost:3000/api/v1/health
```

### 数据库连接

```
Host: localhost
Port: 3306
Database: iot_hotel_system
User: iot_user
Password: iot_password
```

### Redis连接

```
Host: localhost
Port: 6379
```

### MQTT连接

```
Host: localhost
Port: 1883
WebSocket Port: 9001
```

## 🔧 开发模式

### 1. 启动服务

```bash
cd docker
docker-compose up -d
```

### 2. 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入MySQL容器
docker-compose exec mysql sh

# 进入Redis容器
docker-compose exec redis sh

# 进入MQTT容器
docker-compose exec mqtt sh
```

### 3. 执行SQL脚本

```bash
docker-compose exec mysql mysql -u iot_user -piot_password iot_hotel_system < /docker-entrypoint-initdb.d/schema.sql
```

## 🐳 单独部署

### 1. 启动MySQL

```bash
docker run -d \
  --name iot-mysql \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=iot_hotel_system \
  -e MYSQL_USER=iot_user \
  -e MYSQL_PASSWORD=iot_password \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

### 2. 启动Redis

```bash
docker run -d \
  --name iot-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 3. 启动MQTT

```bash
docker run -d \
  --name iot-mqtt \
  -p 1883:1883 \
  -p 9001:9001 \
  -v $(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf \
  eclipse-mosquitto:2.0
```

### 4. 构建并启动后端

```bash
cd ../backend/iot-hotel-backend
docker build -t iot-hotel-backend .
docker run -d \
  --name iot-backend \
  -p 3000:3000 \
  --env-file .env \
  --link iot-mysql:mysql \
  --link iot-redis:redis \
  --link iot-mqtt:mqtt \
  iot-hotel-backend
```

## 📝 常见问题

### Q1: 端口冲突

```bash
# 查看端口占用
docker-compose ps

# 停止服务
docker-compose down

# 修改端口配置后重新启动
docker-compose up -d
```

### Q2: 数据库连接失败

```bash
# 检查MySQL容器状态
docker-compose ps mysql

# 查看MySQL日志
docker-compose logs mysql

# 重新初始化数据库
docker-compose down
docker volume rm docker_mysql-data
docker-compose up -d
```

### Q3: 服务无法启动

```bash
# 查看服务日志
docker-compose logs backend

# 重新构建服务
docker-compose down
docker-compose up -d --build
```

## 🔐 安全加固

### 1. 修改默认密码

编辑 `docker-compose.yml` 文件，修改默认密码：

```yaml
environment:
  - MYSQL_ROOT_PASSWORD=your_root_password
  - MYSQL_PASSWORD=your_password
```

### 2. 禁用匿名访问

编辑 `mqtt/mosquitto.conf` 文件：

```
allow_anonymous false
password_file /mosquitto/config/passwd
```

### 3. 配置SSL证书

```bash
# 生成SSL证书
openssl req -new -x509 -days 365 -nodes -out /mosquitto/config/cert.pem -keyout /mosquitto/config/key.pem

# 配置SSL
listener 8883
certfile /mosquitto/config/cert.pem
keyfile /mosquitto/config/key.pem
```

## 📊 监控与日志

### 1. 查看容器资源使用

```bash
docker stats
```

### 2. 查看容器详细信息

```bash
docker inspect iot-hotel-backend
docker inspect iot-hotel-mysql
docker inspect iot-hotel-redis
docker inspect iot-hotel-mqtt
```

### 3. 清理Docker资源

```bash
# 清理未使用的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理未使用的卷
docker volume prune
```

## 🔄 更新与升级

### 1. 更新镜像

```bash
docker-compose pull
docker-compose up -d
```

### 2. 重新构建

```bash
docker-compose down
docker-compose up -d --build
```

### 3. 数据库迁移

```bash
# 备份数据库
docker-compose exec mysql mysqldump -u iot_user -piot_password iot_hotel_system > backup.sql

# 执行迁移脚本
docker-compose exec mysql mysql -u iot_user -piot_password iot_hotel_system < migration.sql

# 恢复数据
docker-compose exec mysql mysql -u iot_user -piot_password iot_hotel_system < backup.sql
```

---

**版本**: v1.0.0  
**最后更新**: 2026年4月4日
