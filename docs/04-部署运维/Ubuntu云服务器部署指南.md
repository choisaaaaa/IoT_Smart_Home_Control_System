# Ubuntu云服务器部署指南

**适用对象**：团队成员（零基础入门）  
**服务器系统**：Ubuntu 20.04/22.04  
**最后更新**：2026年4月4日

---

## 📚 目录

1. [准备工作](#准备工作)
2. [云服务器购买与配置](#云服务器购买与配置)
3. [SSH远程连接](#ssh远程连接)
4. [Docker安装](#docker安装)
5. [项目部署](#项目部署)
6. [域名与SSL配置](#域名与ssl配置)
7. [服务管理](#服务管理)
8. [数据备份](#数据备份)
9. [常见问题](#常见问题)

---

## 📋 准备工作

### 所需工具

- ✅ 云服务器（推荐：阿里云/腾讯云/华为云）
- ✅ Ubuntu 20.04 或 22.04 系统
- ✅ SSH客户端（Windows: PuTTY/Xshell，Mac/Linux: 终端）
- ✅ 域名（可选，用于绑定网站）

### 推荐云服务器配置

| 配置项 | 推荐配置 | 说明 |
|--------|----------|------|
| CPU | 2核 | 满足系统运行需求 |
| 内存 | 4GB | 满足数据库和缓存需求 |
| 存储 | 50GB SSD | 满足数据存储需求 |
| 带宽 | 5Mbps | 满足远程访问需求 |
| 系统 | Ubuntu 20.04/22.04 | 推荐长期支持版本 |

---

## 🛒 云服务器购买与配置

### 1. 选择云服务商

推荐选择以下云服务商：
- **阿里云**：https://www.aliyun.com
- **腾讯云**：https://cloud.tencent.com
- **华为云**：https://www.huaweicloud.com

### 2. 购买云服务器

#### 阿里云ECS配置示例

```
实例类型：通用型 g7ne
CPU：2核
内存：4GB
系统盘：50GB SSD
公网带宽：5Mbps
操作系统：Ubuntu 20.04 64位
```

#### 腾讯云CVM配置示例

```
实例类型：S3.SMALL1
CPU：2核
内存：4GB
系统盘：50GB SSD
公网带宽：5Mbps
操作系统：Ubuntu 20.04 64位
```

### 3. 配置安全组

**入站规则**：
- SSH (22)：允许来自你的IP
- HTTP (80)：允许所有IP
- HTTPS (443)：允许所有IP
- 自定义端口 (3000, 8080, 3306, 6379, 1883)：根据需要开放

**出站规则**：
- 允许所有IP

### 4. 获取服务器信息

购买完成后，记录以下信息：
- **公网IP地址**：用于SSH连接
- **登录用户名**：Ubuntu系统默认为 `ubuntu`
- **登录密码**：或使用SSH密钥

---

## 🖥️ SSH远程连接

### Windows系统（使用PuTTY）

#### 1. 下载PuTTY
- 访问：https://www.putty.org/
- 下载PuTTY安装包
- 安装PuTTY

#### 2. 连接服务器
1. 打开PuTTY
2. 在"Host Name (or IP address)"中输入服务器公网IP
3. 端口保持默认（22）
4. 点击"Open"
5. 如果提示密钥缓存，点击"是"
6. 输入用户名：`ubuntu`
7. 输入密码（粘贴密码时右键即可）

### Mac/Linux系统

```bash
# 打开终端，输入以下命令
ssh ubuntu@你的服务器公网IP

# 例如：
ssh ubuntu@123.123.123.123
```

### 首次登录后修改密码

```bash
# 修改root密码
sudo passwd root

# 修改ubuntu用户密码
passwd
```

---

## 🐳 Docker安装

### 1. 更新系统

```bash
# 更新软件包列表
sudo apt-get update

# 升级系统
sudo apt-get upgrade -y
```

### 2. 安装Docker

```bash
# 安装必要依赖
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加Docker官方GPG密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加Docker仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新软件包列表
sudo apt-get update

# 安装Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动Docker
sudo systemctl start docker

# 设置Docker开机自启
sudo systemctl enable docker

# 验证安装
sudo docker --version
```

### 3. 配置Docker用户权限

```bash
# 将当前用户添加到docker组
sudo usermod -aG docker $USER

# 重新登录使配置生效
# 退出SSH，重新连接
exit

# 重新连接后，验证
docker --version
```

---

## 📂 项目部署

### 1. 克隆项目

```bash
# 进入工作目录
cd ~

# 克隆项目
git clone https://github.com/choisaaaaa/IoT_Smart_Home_Control_System.git

# 进入项目目录
cd IoT_Smart_Home_Control_System
```

### 2. 配置环境变量

```bash
# 进入后端目录
cd backend

# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件
nano .env
```

**.env文件配置示例**：
```env
# 数据库配置
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=iot_system
MYSQL_USER=root
MYSQL_PASSWORD=your_secure_password

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

# 域名配置（云服务器部署时）
SERVER_HOST=your-domain.com
```

### 3. 启动服务

```bash
# 返回项目根目录
cd ..

# 启动所有服务（后台运行）
sudo docker-compose up -d
```

### 4. 查看服务状态

```bash
# 查看所有服务状态
sudo docker-compose ps
```

**正常输出示例**：
```
NAME                STATUS              PORTS
backend             running             0.0.0.0:3000->3000/tcp
frontend            running             0.0.0.0:8080->8080/tcp
mysql               running             0.0.0.0:3306->3306/tcp
redis               running             0.0.0.0:6379->6379/tcp
mqtt                running             0.0.0.0:1883->1883/tcp
```

---

## 🌐 域名与SSL配置

### 方案1：使用云服务商的负载均衡（推荐）

#### 阿里云SLB配置

1. **购买负载均衡**
   - 选择公网SLB
   - 配置监听规则

2. **配置域名解析**
   - 在域名管理平台添加A记录
   - 指向SLB的公网IP

3. **配置SSL证书**
   - 在阿里云申请免费SSL证书
   - 上传证书到SLB
   - 配置HTTPS监听

### 方案2：使用Nginx反向代理（推荐）

#### 1. 安装Nginx

```bash
# 更新软件包列表
sudo apt-get update

# 安装Nginx
sudo apt-get install -y nginx

# 启动Nginx
sudo systemctl start nginx

# 设置Nginx开机自启
sudo systemctl enable nginx

# 验证安装
nginx -v
```

#### 2. 配置Nginx

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/iot-system
```

**Nginx配置示例**：
```nginx
# HTTP重定向到HTTPS（可选）
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 如果不需要HTTPS，可以在这里配置
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPS配置
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书路径
    ssl_certificate /etc/nginx/ssl/your-domain.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.key;
    
    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 前端服务
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # 后端API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/iot-system /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 4. 配置防火墙

```bash
# 查看防火墙状态
sudo ufw status

# 允许HTTP和HTTPS
sudo ufw allow 'Nginx Full'

# 查看允许的规则
sudo ufw status
```

### 方案3：使用Certbot申请免费SSL证书

```bash
# 安装Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 申请SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按提示操作，Certbot会自动配置SSL

# 设置自动续期
sudo certbot renew --dry-run
```

---

## 🛠️ 服务管理

### 1. 查看服务日志

```bash
# 查看所有服务日志
sudo docker-compose logs

# 查看特定服务日志
sudo docker-compose logs backend
sudo docker-compose logs mysql
sudo docker-compose logs frontend

# 实时查看日志
sudo docker-compose logs -f

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 停止服务

```bash
# 停止所有服务
sudo docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据库数据）
sudo docker-compose down -v
```

### 3. 重启服务

```bash
# 重启所有服务
sudo docker-compose restart

# 重启特定服务
sudo docker-compose restart backend
sudo docker-compose restart mysql
sudo docker-compose restart nginx
```

### 4. 更新服务

```bash
# 拉取最新代码
cd ~/IoT_Smart_Home_Control_System
git pull

# 重新构建并启动服务
sudo docker-compose up -d --build
```

### 5. 查看资源使用情况

```bash
# 查看Docker容器资源使用
sudo docker stats

# 查看系统资源使用
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

---

## 💾 数据备份

### 1. 数据库备份

```bash
# 备份MySQL数据库
sudo docker exec -t mysql mysqldump -u root -p<password> iot_system > backup.sql

# 压缩备份文件
gzip backup.sql

# 移动到安全目录
mv backup.sql.gz ~/backups/

# 创建备份脚本
nano ~/backup.sh
```

**备份脚本示例**：
```bash
#!/bin/bash

# 备份目录
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec -t mysql mysqldump -u root -p<password> iot_system > $BACKUP_DIR/backup_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/backup_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**设置定时备份**：
```bash
# 编辑crontab
crontab -e

# 添加定时任务（每天凌晨2点备份）
0 2 * * * /home/ubuntu/backup.sh
```

### 2. 文件备份

```bash
# 备份项目文件
tar -czf ~/backups/project_$(date +%Y%m%d).tar.gz ~/IoT_Smart_Home_Control_System

# 备份Nginx配置
sudo tar -czf ~/backups/nginx_$(date +%Y%m%d).tar.gz /etc/nginx

# 备份Docker配置
sudo tar -czf ~/backups/docker_$(date +%Y%m%d).tar.gz /var/lib/docker
```

### 3. 远程备份

```bash
# 使用scp备份到本地
scp ubuntu@你的服务器IP:~/backups/backup.sql.gz ~/local_backup/

# 使用rsync同步备份
rsync -avz ubuntu@你的服务器IP:~/backups/ ~/local_backup/
```

---

## 🐛 常见问题

### 问题1：Docker安装失败

**现象**：`sudo apt-get install docker-ce` 失败

**解决方法**：
```bash
# 清理旧的Docker
sudo apt-get remove docker docker-engine docker.io containerd runc

# 更新软件包列表
sudo apt-get update

# 重新安装
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 问题2：服务启动失败

**现象**：`docker-compose up -d` 后某个服务状态为 `exited`

**解决方法**：
```bash
# 查看服务日志
sudo docker-compose logs <service_name>

# 常见原因：
# 1. 端口被占用
# 解决：修改docker-compose.yml中的端口映射
# 2. 环境变量配置错误
# 解决：检查.env文件配置
# 3. 代码错误
# 解决：查看日志，修复代码
```

### 问题3：Nginx无法启动

**现象**：`sudo systemctl start nginx` 失败

**解决方法**：
```bash
# 检查Nginx配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 常见错误：
# 1. 端口被占用
# 解决：修改Nginx配置中的端口
# 2. 配置文件语法错误
# 解决：根据错误提示修改配置
```

### 问题4：防火墙阻止访问

**现象**：无法访问服务器

**解决方法**：
```bash
# 查看防火墙状态
sudo ufw status

# 允许必要端口
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # 后端API
sudo ufw allow 8080/tcp    # 前端

# 重新加载防火墙
sudo ufw reload
```

### 问题5：数据库连接失败

**现象**：后端日志显示"数据库连接失败"

**解决方法**：
```bash
# 检查MySQL服务状态
sudo docker-compose ps mysql

# 查看MySQL日志
sudo docker-compose logs mysql

# 手动连接MySQL测试
sudo docker exec -it mysql mysql -u root -p
```

### 问题6：域名无法解析

**现象**：浏览器无法访问域名

**解决方法**：
```bash
# 检查域名解析
nslookup your-domain.com

# 检查DNS设置
# 在域名管理平台确认A记录已正确配置
# 等待DNS缓存刷新（通常需要几分钟到几小时）
```

### 问题7：SSL证书过期

**现象**：浏览器提示证书过期

**解决方法**：
```bash
# 手动续期证书
sudo certbot renew

# 或使用自动续期
sudo certbot renew --dry-run
```

### 问题8：服务器磁盘空间不足

**现象**：服务无法启动或运行缓慢

**解决方法**：
```bash
# 查看磁盘使用
df -h

# 清理Docker
sudo docker system prune -a

# 清理旧日志
sudo journalctl --vacuum-time=7d

# 清理旧备份
rm -rf ~/backups/backup_*.sql.gz
```

---

## 📖 进阶指南

### 1. 配置监控告警

```bash
# 安装Prometheus + Grafana
sudo docker-compose -f docker-compose.monitoring.yml up -d

# 配置监控指标
# - CPU使用率
# - 内存使用率
# - 磁盘使用率
# - 服务状态
```

### 2. 配置日志收集

```bash
# 使用ELK栈收集日志
sudo docker-compose -f docker-compose.elk.yml up -d

# 配置日志收集
# - Nginx访问日志
# - 应用日志
# - 系统日志
```

### 3. 配置自动部署

```bash
# 创建部署脚本
nano ~/deploy.sh
```

**部署脚本示例**：
```bash
#!/bin/bash

# 拉取最新代码
cd ~/IoT_Smart_Home_Control_System
git pull

# 停止服务
sudo docker-compose down

# 启动服务
sudo docker-compose up -d

# 检查服务状态
sudo docker-compose ps

echo "Deployment completed!"
```

**设置定时部署**：
```bash
# 编辑crontab
crontab -e

# 添加定时任务（每天凌晨3点自动部署）
0 3 * * * /home/ubuntu/deploy.sh
```

### 4. 配置数据库主从复制

```bash
# 创建从数据库
sudo docker-compose -f docker-compose.slave.yml up -d

# 配置主从同步
# - 主数据库：写入
# - 从数据库：读取
```

---

## 📞 技术支持

如有问题，请联系项目负责人或查看项目文档。

**项目负责人**：XXX  
**团队成员**：XXX、XXX、XXX、XXX、XXX、XXX  
**提交日期**：2026年4月4日

---

## 🎓 学习资源

- [Ubuntu官方文档](https://ubuntu.com/server/docs)
- [Docker官方文档](https://docs.docker.com/)
- [Nginx官方文档](https://nginx.org/en/docs/)
- [Certbot官方文档](https://certbot.eff.org/)
