# 智慧酒店物联网控制系统 - 后端Docker配置

## 📁 Docker配置文件

本目录包含后端服务的Docker配置文件。

## 📦 配置文件

### 1. Dockerfile

Docker镜像构建文件，包含Node.js 20-alpine运行环境。

### 2. .dockerignore

Docker构建时忽略的文件列表。

## 🚀 构建镜像

```bash
docker build -t iot-hotel-backend .
```

## 🐳 运行容器

```bash
docker run -d \
  --name iot-hotel-backend \
  -p 3000:3000 \
  --env-file .env \
  --link iot-hotel-mysql:mysql \
  --link iot-hotel-redis:redis \
  --link iot-hotel-mqtt:mqtt \
  iot-hotel-backend
```

## 🔧 环境变量

```env
NODE_ENV=development
DB_HOST=mysql
DB_PORT=3306
DB_USER=iot_user
DB_PASSWORD=iot_password
DB_NAME=iot_hotel_system
REDIS_URL=redis://redis:6379
MQTT_HOST=mqtt
MQTT_PORT=1883
JWT_SECRET=iot_hotel_system_jwt_secret_2024
```

## 📊 访问服务

```
http://localhost:3000/api/v1/health
```

---

**版本**: v1.0.0  
**最后更新**: 2026年4月4日
