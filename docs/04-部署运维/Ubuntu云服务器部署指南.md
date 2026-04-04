# Ubuntu云服务器部署指南

本指南详细说明如何在Ubuntu云服务器上部署智慧酒店物联网控制系统。

## 📋 目录

1. [云服务器选购与配置](#云服务器选购与配置)
2. [Ubuntu系统初始化](#ubuntu系统初始化)
3. [Docker环境安装](#docker环境安装)
4. [项目部署步骤](#项目部署步骤)
5. [域名与SSL配置](#域名与ssl配置)
6. [Nginx反向代理](#nginx反向代理)
7. [自动化部署](#自动化部署)

---

## ☁️ 云服务器选购与配置

### 推荐云服务商

| 服务商 | 推荐配置 | 月费用 | 备注 |
|--------|----------|--------|------|
| 阿里云 | 2核4G | ¥60-100 | 国内访问快，备案方便 |
| 腾讯云 | 2核4G | ¥60-100 | 国内访问快，备案方便 |
| 华为云 | 2核4G | ¥50-80 | 性价比高 |
| AWS | t3.medium | $15-20 | 国际访问快 |
| DigitalOcean | 2GB RAM | $12 | 简单易用 |

### 推荐配置

| 配置项 | 推荐配置 | 说明 |
|--------|----------|------|
| CPU | 2核 | 满足系统运行需求 |
| 内存 | 4GB | 满足数据库和缓存需求 |
| 存储 | 50GB SSD | 满足数据存储需求 |
| 带宽 | 5Mbps | 满足远程访问需求 |
| 系统 | Ubuntu 22.04 LTS | 稳定可靠 |

---

## 🖥️ Ubuntu系统初始化

### 1. 连接服务器

```bash
ssh root@your_server_ip
```

### 2. 更新系统

```bash
apt update && apt upgrade -y
```

### 3. 创建普通用户

```bash
adduser your_username
usermod -aG sudo your_username
```

### 4. 配置SSH密钥

```bash
# 本地生成密钥
ssh-keygen -t rsa -b 4096

# 复制公钥到服务器
ssh-copy-id your_username@your_server_ip
```

### 5. 配置防火墙

```bash
# 安装UFW
apt install ufw -y

# 允许SSH
ufw allow OpenSSH

# 允许HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 允许自定义端口
ufw allow 3000/tcp
ufw allow 3001/tcp

# 启用防火墙
ufw enable

# 查看状态
ufw status
```

### 6. 配置主机名

```bash
hostnamectl set-hostname iot-smart-hotel
```

### 7. 重启服务器

```bash
reboot
```

---

## 🐳 Docker环境安装

### 1. 卸载旧版本（如有）

```bash
apt remove docker docker-engine docker.io containerd runc
```

### 2. 安装Docker

```bash
# 安装依赖
apt install apt-transport-https ca-certificates curl gnupg lsb-release -y

# 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加Docker仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新包索引
apt update

# 安装Docker
apt install docker-ce docker-ce-cli containerd.io -y

# 验证安装
docker --version
```

### 3. 安装Docker Compose

```bash
# 下载Docker Compose
curl -SL "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 4. 配置Docker

```bash
# 创建Docker配置目录
mkdir -p /etc/docker

# 配置Docker守护进程
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 重启Docker
systemctl restart docker

# 设置开机自启
systemctl enable docker
```

---

## 📦 项目部署步骤

### 1. 克隆项目

```bash
# 切换到普通用户
su - your_username

# 创建项目目录
mkdir -p ~/iot-smart-hotel
cd ~/iot-smart-hotel

# 克隆项目
git clone https://github.com/your-username/iot-smart-hotel.git .
```

### 2. 配置环境变量

```bash
# 后端环境变量
cd backend
cp .env.example .env

# 编辑.env文件
nano .env
```

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_USER=iot_user
DB_PASSWORD=iot_password
DB_NAME=iot_smart_hotel

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379

# MQTT配置
MQTT_HOST=mqtt
MQTT_PORT=1883

# JWT配置
JWT_SECRET=your_jwt_secret_key_here

# AI服务配置
AI_API_KEY=your_glm_api_key
```

### 3. 创建MQTT配置目录

```bash
cd ~/iot-smart-hotel
mkdir -p mqtt/config mqtt/data mqtt/log

# 创建MQTT配置文件
cat > mqtt/config/mosquitto.conf <<EOF
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data/
log_type all
log_dest file /mosquitto/log/mosquitto.log
EOF
```

### 4. 启动服务

```bash
cd ~/iot-smart-hotel
docker-compose up -d
```

### 5. 验证部署

```bash
# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 测试API
curl http://localhost:3000/api/v1/health
```

---

## 🔐 域名与SSL配置

### 1. 购买域名

推荐域名服务商：
- 阿里云域名
- 腾讯云域名
- Cloudflare
- Namecheap

### 2. 配置DNS解析

在域名管理面板添加A记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 服务器IP | 600 |
| A | www | 服务器IP | 600 |

### 3. 安装Certbot

```bash
# 添加Certbot仓库
apt install software-properties-common -y
add-apt-repository universe
add-apt-repository ppa:certbot/certbot
apt update

# 安装Certbot
apt install certbot python3-certbot-nginx -y
```

### 4. 申请SSL证书

```bash
# 停止Nginx
docker-compose stop frontend

# 申请证书
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 证书位置
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### 5. 配置自动续期

```bash
# 测试续期
certbot renew --dry-run

# 添加定时任务
crontab -e

# 添加以下内容
0 3 * * * /usr/bin/certbot renew --quiet
```

---

## 🌐 Nginx反向代理

### 1. 创建Nginx配置

```bash
# 创建配置目录
mkdir -p ~/iot-smart-hotel/nginx/conf.d

# 创建配置文件
cat > ~/iot-smart-hotel/nginx/conf.d/iot-smart-hotel.conf <<EOF
# HTTP重定向到HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Let's Encrypt验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS服务器
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL证书
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 前端服务
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # 后端API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}
EOF
```

### 2. 启动Nginx

```bash
# 创建Nginx容器
docker run -d \
  --name iot-smart-hotel-nginx \
  --network iot-smart-hotel_iot-network \
  -p 80:80 \
  -p 443:443 \
  -v ~/iot-smart-hotel/nginx/conf.d:/etc/nginx/conf.d:ro \
  nginx:alpine
```

### 3. 验证Nginx配置

```bash
# 检查配置
docker exec iot-smart-hotel-nginx nginx -t

# 重新加载配置
docker exec iot-smart-hotel-nginx nginx -s reload
```

---

## 🤖 自动化部署

### 1. 创建部署脚本

```bash
# 创建脚本目录
mkdir -p ~/iot-smart-hotel/scripts

# 创建部署脚本
cat > ~/iot-smart-hotel/scripts/deploy.sh <<'EOF'
#!/bin/bash

echo "🚀 开始部署..."

# 停止服务
echo "🛑 停止服务..."
docker-compose down

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build

# 启动服务
echo "▶️  启动服务..."
docker-compose up -d

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ 部署完成！"
EOF

# 添加执行权限
chmod +x ~/iot-smart-hotel/scripts/deploy.sh
```

### 2. 创建健康检查脚本

```bash
# 创建健康检查脚本
cat > ~/iot-smart-hotel/scripts/health-check.sh <<'EOF'
#!/bin/bash

echo "🔍 检查服务健康状态..."

# 检查后端API
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/health)
if [ "$BACKEND_STATUS" != "200" ]; then
    echo "❌ 后端服务异常: $BACKEND_STATUS"
    docker-compose logs backend
    exit 1
fi

# 检查前端服务
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$FRONTEND_STATUS" != "200" ]; then
    echo "❌ 前端服务异常: $FRONTEND_STATUS"
    docker-compose logs frontend
    exit 1
fi

echo "✅ 所有服务正常运行"
exit 0
EOF

# 添加执行权限
chmod +x ~/iot-smart-hotel/scripts/health-check.sh
```

### 3. 创建定时任务

```bash
# 编辑crontab
crontab -e

# 添加以下内容
# 每小时检查一次健康状态
0 * * * * /home/your_username/iot-smart-hotel/scripts/health-check.sh >> /home/your_username/iot-smart-hotel/scripts/health.log 2>&1

# 每天凌晨3点自动部署（可选）
0 3 * * * /home/your_username/iot-smart-hotel/scripts/deploy.sh >> /home/your_username/iot-smart-hotel/scripts/deploy.log 2>&1
```

### 4. 配置系统监控

```bash
# 安装htop
apt install htop -y

# 安装Docker监控
docker run -d \
  --name cAdvisor \
  --privileged \
  --pid host \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:rw \
  -v /sys:/sys:ro \
  -v /var/lib/docker:/var/lib/docker:ro \
  google/cadvisor:latest \
  -docker_only=true

# 访问监控页面
# http://your_server_ip:8080
```

---

## 📊 监控与告警

### 1. 系统监控

```bash
# 查看系统资源
htop

# 查看Docker资源
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 2. 日志监控

```bash
# 查看应用日志
docker-compose logs -f

# 查看Nginx日志
docker exec iot-smart-hotel-nginx tail -f /var/log/nginx/access.log
docker exec iot-smart-hotel-nginx tail -f /var/log/nginx/error.log
```

### 3. 数据库监控

```bash
# 查看数据库状态
docker exec -it iot-smart-hotel-mysql mysql -u root -p

# 查看数据库大小
docker exec -it iot-smart-hotel-mysql mysql -u root -p -e "SELECT table_schema 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) 'Size (MB)' FROM information_schema.tables GROUP BY table_schema;"
```

---

## 🔒 安全加固

### 1. 配置SSH安全

```bash
# 编辑SSH配置
nano /etc/ssh/sshd_config

# 修改以下配置
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3

# 重启SSH
systemctl restart sshd
```

### 2. 配置防火墙规则

```bash
# 限制SSH访问
ufw limit 2222/tcp

# 限制HTTP/HTTPS访问
ufw allow 80/tcp
ufw allow 443/tcp

# 限制API访问（可选）
ufw allow from your_ip to any port 3000

# 查看规则
ufw status verbose
```

### 3. 定期备份

```bash
# 创建备份脚本
cat > ~/iot-smart-hotel/scripts/backup.sh <<'EOF'
#!/bin/bash

BACKUP_DIR="/home/your_username/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec -t iot-smart-hotel-mysql mysqldump -u root -p<password> iot_smart_hotel > $BACKUP_DIR/db_$DATE.sql

# 压缩备份
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR db_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "✅ 备份完成: backup_$DATE.tar.gz"
EOF

chmod +x ~/iot-smart-hotel/scripts/backup.sh

# 添加定时任务
crontab -e

# 添加以下内容
0 2 * * * /home/your_username/iot-smart-hotel/scripts/backup.sh
```

---

## 🐛 常见问题

### 问题1：端口被占用

**解决方法**：

```bash
# 查找占用端口的进程
lsof -i :3000

# 停止进程
kill -9 <PID>
```

### 问题2：Docker权限问题

**解决方法**：

```bash
# 将用户添加到docker组
usermod -aG docker your_username

# 重新登录
su - your_username
```

### 问题3：SSL证书过期

**解决方法**：

```bash
# 手动续期
certbot renew

# 重启Nginx
docker exec iot-smart-hotel-nginx nginx -s reload
```

### 问题4：服务无法访问

**解决方法**：

```bash
# 检查防火墙
ufw status

# 检查Docker网络
docker network inspect iot-smart-hotel_iot-network

# 检查服务日志
docker-compose logs
```

---

## 📚 相关文档

- [Docker部署和访问指南](./Docker部署和访问指南.md)
- [Docker官方文档](https://docs.docker.com/)
- [Ubuntu官方文档](https://ubuntu.com/server/docs)

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日
