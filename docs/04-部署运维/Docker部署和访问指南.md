# Docker部署和访问指南

**适用对象**：团队成员（零基础入门）  
**最后更新**：2026年4月4日

---

## 📚 目录

1. [什么是Docker？](#什么是docker)
2. [安装Docker](#安装docker)
3. [项目结构说明](#项目结构说明)
4. [快速开始](#快速开始)
5. [容器访问指南](#容器访问指南)
6. [开发说明](#开发说明)
7. [云服务器部署](#云服务器部署)
8. [常见问题](#常见问题)

---

## 🐳 什么是Docker？

Docker是一个容器化平台，可以把应用程序和它的依赖打包在一起，让应用在任何地方都能运行。

**简单理解**：
- Docker就像一个"集装箱"
- 把不同的服务（后端、数据库、Redis等）分别装进不同的"集装箱"
- 每个"集装箱"独立运行，互不干扰
- 只需要一个命令就能启动所有服务

**优势**：
- ✅ 环境一致：开发、测试、生产环境完全一致
- ✅ 易于部署：一个命令启动所有服务
- ✅ 隔离性好：各服务之间互不影响
- ✅ 资源占用少：比虚拟机更轻量

---

## 📦 安装Docker

### Windows系统

#### 1. 下载Docker Desktop
- 访问：https://www.docker.com/products/docker-desktop
- 点击"Download for Windows"
- 下载Docker Desktop安装包

#### 2. 安装Docker
- 双击安装包，按照提示安装
- 安装完成后重启电脑
- 打开Docker Desktop，等待启动完成

#### 3. 验证安装
```bash
# 打开PowerShell或CMD，输入以下命令
docker --version
docker-compose --version
```

如果显示版本号，说明安装成功！

### macOS系统

#### 1. 下载Docker Desktop
- 访问：https://www.docker.com/products/docker-desktop
- 点击"Download for Mac"
- 下载Docker Desktop安装包

#### 2. 安装Docker
- 双击安装包，将Docker拖到Applications文件夹
- 打开Docker，等待启动完成

#### 3. 验证安装
```bash
# 打开终端，输入以下命令
docker --version
docker-compose --version
```

### Linux系统（Ubuntu）

```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc

# 安装Docker
sudo apt-get update
sudo apt-get install docker.io

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

---

## 📂 项目结构说明

```
IoT_Smart_Home_Control_System/
├── backend/              # 后端服务
│   ├── src/             # 源代码
│   ├── .env.example     # 环境变量示例
│   └── Dockerfile       # 后端Docker配置
├── frontend/            # 前端服务
│   ├── src/            # 源代码
│   └── Dockerfile      # 前端Docker配置
├── docker-compose.yml   # Docker编排配置
└── README.md            # 项目说明
```

### 各服务说明

| 服务 | 端口 | 说明 | 访问地址 |
|------|------|------|----------|
| 后端服务 | 3000 | Node.js后端API | http://localhost:3000 |
| 前端服务 | 8080 | Vue3前端界面 | http://localhost:8080 |
| MySQL | 3306 | 数据库服务 | localhost:3306 |
| Redis | 6379 | 缓存服务 | localhost:6379 |
| MQTT Broker | 1883 | MQTT消息服务 | localhost:1883 |
| WebSocket | 3001 | WebSocket服务 | ws://localhost:3001 |

---

## 🚀 快速开始

### 第一步：克隆项目

```bash
# 打开PowerShell或终端，输入以下命令
git clone https://github.com/choisaaaaa/IoT_Smart_Home_Control_System.git
cd IoT_Smart_Home_Control_System
```

### 第二步：配置环境变量

```bash
# 进入后端目录
cd backend

# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件（使用记事本或VS Code）
# 填写必要的API Keys（如阿里云ASR、讯飞TTS等）
```

**.env文件示例**：
```env
# 数据库配置
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=iot_system
MYSQL_USER=root
MYSQL_PASSWORD=your_password

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379

# MQTT配置
MQTT_HOST=mqtt
MQTT_PORT=1883

# AI服务配置
ALIYUN_ASR_ACCESS_KEY=your_access_key
ALIYUN_ASR_SECRET=your_secret
IFLYTEK_TTS_API_KEY=your_api_key
ZHIPU_AI_API_KEY=your_api_key
```

### 第三步：启动所有服务

```bash
# 返回项目根目录
cd ..

# 启动所有服务（后台运行）
docker-compose up -d
```

**启动成功后，你会看到类似输出**：
```
Creating network "iot_system_default" with the default driver
Creating iot_system_mysql_1    ... done
Creating iot_system_redis_1    ... done
Creating iot_system_mqtt_1     ... done
Creating iot_system_backend_1  ... done
Creating iot_system_frontend_1 ... done
```

### 第四步：查看服务状态

```bash
# 查看所有服务状态
docker-compose ps
```

**输出示例**：
```
NAME                STATUS              PORTS
backend             running             0.0.0.0:3000->3000/tcp
frontend            running             0.0.0.0:8080->8080/tcp
mysql               running             0.0.0.0:3306->3306/tcp
redis               running             0.0.0.0:6379->6379/tcp
mqtt                running             0.0.0.0:1883->1883/tcp
```

### 第五步：访问系统

- **前端界面**：打开浏览器，访问 http://localhost:8080
- **后端API**：访问 http://localhost:3000/api/v1/health
- **数据库**：使用Navicat等工具连接 localhost:3306

---

## 📡 容器访问指南

### 查看容器日志

```bash
# 查看所有容器日志
docker-compose logs

# 查看特定容器日志
docker-compose logs backend
docker-compose logs mysql
docker-compose logs frontend

# 实时查看日志（按Ctrl+C退出）
docker-compose logs -f
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据库数据）
docker-compose down -v
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
docker-compose restart mysql
```

### 进入容器内部

```bash
# 进入后端容器
docker-compose exec backend bash

# 进入数据库容器
docker-compose exec mysql bash

# 进入Redis容器
docker-compose exec redis bash

# 退出容器
exit
```

### 容器间通信

**在Docker中，容器之间可以通过服务名称互相访问**：

| 服务名称 | 说明 | 访问方式 |
|----------|------|----------|
| backend | 后端服务 | http://backend:3000 |
| frontend | 前端服务 | http://frontend:8080 |
| mysql | 数据库服务 | mysql:3306 |
| redis | Redis服务 | redis:6379 |
| mqtt | MQTT服务 | mqtt:1883 |

**示例**：
```bash
# 在后端容器中访问MySQL
mysql -h mysql -u root -p

# 在后端容器中访问Redis
redis-cli -h redis

# 在后端容器中访问MQTT
mosquitto_sub -h mqtt -t "test"
```

---

## 💻 开发说明

### 修改代码后如何生效？

#### 方案1：使用Docker Compose挂载卷（推荐）

项目已经配置了挂载卷，修改代码后会自动同步到容器中。

```bash
# 修改代码后，重启服务即可
docker-compose restart backend
docker-compose restart frontend
```

#### 方案2：重新构建容器

```bash
# 重新构建并启动服务
docker-compose up -d --build
```

### 查看容器资源使用情况

```bash
# 查看所有容器的资源使用情况
docker stats

# 查看特定容器的资源使用情况
docker stats backend
```

### 备份数据库

```bash
# 备份MySQL数据库
docker exec -t mysql mysqldump -u root -p<password> iot_system > backup.sql

# 恢复MySQL数据库
docker exec -i mysql mysql -u root -p<password> iot_system < backup.sql
```

### 清理Docker

```bash
# 停止所有容器
docker-compose down

# 删除所有未使用的容器
docker container prune

# 删除所有未使用的镜像
docker image prune -a

# 删除所有未使用的数据卷
docker volume prune
```

---

## 🐛 常见问题

### 问题1：服务启动失败

**现象**：`docker-compose up -d` 后某个服务状态为 `exited`

**解决方法**：

```bash
# 查看服务日志
docker-compose logs <service_name>

# 常见原因：
# 1. 端口被占用
# 解决：修改docker-compose.yml中的端口映射
# 2. 环境变量配置错误
# 解决：检查.env文件配置
# 3. 代码错误
# 解决：查看日志，修复代码
```

### 问题2：前端无法连接后端

**现象**：前端页面显示"连接失败"

**解决方法**：

```bash
# 1. 检查后端服务是否正常
docker-compose ps backend

# 2. 查看后端日志
docker-compose logs backend

# 3. 检查后端是否监听正确端口
docker-compose exec backend netstat -tuln
```

### 问题3：数据库连接失败

**现象**：后端日志显示"数据库连接失败"

**解决方法**：

```bash
# 1. 检查MySQL服务是否正常
docker-compose ps mysql

# 2. 查看MySQL日志
docker-compose logs mysql

# 3. 检查数据库配置
docker-compose exec backend cat .env

# 4. 手动连接MySQL测试
docker-compose exec mysql mysql -u root -p
```

### 问题4：端口被占用

**现象**：启动时提示"端口已被占用"

**解决方法**：

```bash
# 1. 查看哪些进程占用了端口
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# 2. 修改docker-compose.yml中的端口映射
# 将 3000:3000 改为 3001:3000
```

### 问题5：容器无法访问外网

**现象**：容器内无法访问互联网

**解决方法**：

```bash
# 检查Docker网络配置
docker network ls

# 重启Docker服务
# Windows：重启Docker Desktop
# Linux：sudo systemctl restart docker
```

### 问题6：数据丢失

**现象**：重启后数据丢失

**解决方法**：

```bash
# 使用数据卷持久化数据
# 在docker-compose.yml中配置volumes

# 示例：
volumes:
  mysql-data:
    driver: local
  redis-data:
    driver: local

# 在服务中挂载数据卷
mysql:
  volumes:
    - mysql-data:/var/lib/mysql
```

---

## ☁️ 云服务器部署

### 本地开发 vs 云服务器部署

| 对比项 | 本地开发 | 云服务器部署 |
|--------|----------|--------------|
| 适用场景 | 个人开发、测试 | 团队协作、正式部署 |
| 访问方式 | localhost | 域名/IP地址 |
| 数据持久化 | 本地文件系统 | Docker数据卷 |
| 网络访问 | 仅本地 | 公网访问 |
| SSL证书 | 无需 | 需要配置 |
| 域名绑定 | 无需 | 需要配置 |

### 云服务器部署步骤

#### 1. 准备云服务器

**推荐配置**：
- CPU：2核
- 内存：4GB
- 存储：50GB SSD
- 带宽：5Mbps
- 系统：Ubuntu 20.04/22.04

**购买渠道**：
- 阿里云：https://www.aliyun.com
- 腾讯云：https://cloud.tencent.com
- 华为云：https://www.huaweicloud.com

#### 2. SSH远程连接

**Windows系统（使用PuTTY）**：
1. 下载PuTTY：https://www.putty.org/
2. 输入服务器公网IP
3. 连接并登录

**Mac/Linux系统**：
```bash
ssh ubuntu@你的服务器公网IP
```

#### 3. 安装Docker

```bash
# 更新系统
sudo apt-get update
sudo apt-get upgrade -y

# 安装Docker
sudo apt-get install -y docker.io

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

#### 4. 部署项目

```bash
# 克隆项目
git clone https://github.com/choisaaaaa/IoT_Smart_Home_Control_System.git
cd IoT_Smart_Home_Control_System

# 配置环境变量
cd backend
cp .env.example .env
nano .env

# 返回项目根目录
cd ..

# 启动所有服务
sudo docker-compose up -d
```

#### 5. 配置域名和SSL

**使用Nginx反向代理**：

```bash
# 安装Nginx
sudo apt-get install -y nginx

# 配置Nginx
sudo nano /etc/nginx/sites-available/iot-system
```

**Nginx配置示例**：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**启用配置**：
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/iot-system /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

**配置防火墙**：
```bash
# 允许HTTP和HTTPS
sudo ufw allow 'Nginx Full'

# 查看状态
sudo ufw status
```

#### 6. 配置SSL证书（可选）

```bash
# 安装Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 申请SSL证书
sudo certbot --nginx -d your-domain.com

# 按提示操作，Certbot会自动配置SSL
```

### 访问云服务器部署的系统

- **前端界面**：http://your-domain.com 或 https://your-domain.com
- **后端API**：http://your-domain.com/api/v1/health
- **数据库**：通过云服务器安全组配置访问

### 云服务器部署注意事项

1. **安全组配置**：
   - 开放必要端口（80、443、22）
   - 限制数据库端口（3306）仅内网访问

2. **数据备份**：
   - 定期备份MySQL数据库
   - 定期备份项目文件

3. **监控告警**：
   - 监控服务器资源使用情况
   - 监控服务运行状态

4. **自动部署**：
   - 配置Git webhook实现自动部署
   - 使用CI/CD工具简化部署流程

### 常见问题

**Q：云服务器部署后无法访问？**

A：检查以下几点：
1. 安全组是否开放了对应端口
2. 防火墙是否允许访问
3. Nginx配置是否正确
4. 域名解析是否生效

**Q：如何更新云服务器上的项目？**

A：
```bash
# SSH连接服务器
ssh ubuntu@你的服务器IP

# 进入项目目录
cd ~/IoT_Smart_Home_Control_System

# 拉取最新代码
git pull

# 重新构建并启动服务
sudo docker-compose up -d --build
```

**Q：如何查看云服务器上的服务日志？**

A：
```bash
# 查看所有服务日志
sudo docker-compose logs -f

# 查看特定服务日志
sudo docker-compose logs backend
sudo docker-compose logs mysql
```

---

## 📖 进阶指南

### 自定义网络配置

```yaml
# docker-compose.yml
networks:
  app-network:
    driver: bridge

services:
  backend:
    networks:
      - app-network
  mysql:
    networks:
      - app-network
```

### 环境变量管理

```bash
# 创建环境变量文件
cp .env.example .env.production

# 使用特定环境变量启动
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 日志收集

```bash
# 查看所有容器日志
docker-compose logs -f | grep "error"

# 导出日志
docker-compose logs > logs.txt
```

---

## 🎓 学习资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Docker中文文档](https://yeasy.gitbook.io/docker_practice/)

---

## 📞 技术支持

如有问题，请联系项目负责人或查看项目文档。

**项目负责人**：XXX  
**团队成员**：XXX、XXX、XXX、XXX、XXX、XXX  
**提交日期**：2026年4月4日
