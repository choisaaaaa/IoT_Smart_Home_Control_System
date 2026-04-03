# 部署运维文档

本目录包含部署和运维相关的文档，涵盖部署方案、运维管理、监控告警等内容。

## 📚 文档列表

### 1. 三端语音智能体部署指南.md
- **描述**：三端语音智能体的部署指南
- **内容**：
  - 部署方案（本地开发 + Docker部署、云服务器部署）
  - 环境准备
  - 配置说明
  - 启动服务
  - 测试验证
  - 常见问题

---

## 🚀 部署方案

### 方案1：本地开发 + Docker部署（推荐）

**适合场景**：开发阶段，环境隔离，易于调试

#### 部署步骤

```bash
# 1. 克隆项目
git clone https://github.com/choisaaaaa/IoT_Smart_Home_Control_System.git
cd IoT_Smart_Home_Control_System

# 2. 配置环境变量
cd backend
cp .env.example .env
# 编辑 .env 文件，填写 API Keys

# 3. 启动所有服务
cd ..
docker-compose up -d

# 4. 查看服务状态
docker-compose ps

# 5. 访问后端 API
curl http://localhost:3000/api/v1/health
```

#### 服务列表

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端服务 | 3000 | Node.js后端API服务 |
| 前端服务 | 8080 | Vue3前端服务 |
| MySQL | 3306 | MySQL数据库服务 |
| Redis | 6379 | Redis缓存服务 |
| MQTT Broker | 1883 | MQTT消息 broker服务 |
| WebSocket | 3001 | WebSocket实时通信服务 |

---

### 方案2：云服务器部署（比赛演示）

**适合场景**：比赛演示，远程访问，环境一致

#### 部署步骤

```bash
# 1. 在云服务器上执行
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 2. 克隆项目
git clone https://github.com/choisaaaaa/IoT_Smart_Home_Control_System.git
cd IoT_Smart_Home_Control_System

# 3. 配置环境变量
cd backend
cp .env.example .env
# 编辑 .env 文件，填写 API Keys

# 4. 启动服务
cd ..
docker-compose up -d

# 5. 配置 Nginx 反向代理（可选）
# 参考部署指南第 2.6 节

# 6. 获取服务器公网 IP
curl ifconfig.me
```

#### 云服务器配置

| 配置项 | 推荐配置 | 说明 |
|--------|----------|------|
| CPU | 2核 | 满足系统运行需求 |
| 内存 | 4GB | 满足数据库和缓存需求 |
| 存储 | 50GB | 满足数据存储需求 |
| 带宽 | 5Mbps | 满足远程访问需求 |

---

## ⚙️ 运维管理

### 服务管理

#### 启动服务
```bash
docker-compose up -d
```

#### 停止服务
```bash
docker-compose down
```

#### 查看服务状态
```bash
docker-compose ps
```

#### 查看服务日志
```bash
docker-compose logs -f
```

#### 重启服务
```bash
docker-compose restart
```

---

### 数据库管理

#### 备份数据库
```bash
docker exec -t mysql mysqldump -u root -p<password> iot_system > backup.sql
```

#### 恢复数据库
```bash
docker exec -i mysql mysql -u root -p<password> iot_system < backup.sql
```

#### 清空数据库
```bash
docker exec -i mysql mysql -u root -p<password> -e "DROP DATABASE iot_system; CREATE DATABASE iot_system;"
```

---

### 监控告警

#### 系统监控
- **CPU使用率**：监控系统CPU使用率
- **内存使用率**：监控系统内存使用率
- **磁盘使用率**：监控系统磁盘使用率
- **网络流量**：监控系统网络流量

#### 服务监控
- **后端服务**：监控后端服务状态
- **前端服务**：监控前端服务状态
- **数据库服务**：监控数据库服务状态
- **缓存服务**：监控缓存服务状态
- **MQTT服务**：监控MQTT服务状态

#### 告警方式
- **邮件告警**：通过邮件发送告警信息
- **短信告警**：通过短信发送告警信息
- **微信告警**：通过微信发送告警信息

---

## 🔒 安全管理

### 数据安全
- **数据加密**：敏感数据加密存储
- **传输加密**：使用TLS/SSL加密传输
- **访问控制**：基于角色的访问控制
- **审计日志**：记录所有操作日志

### 设备安全
- **设备认证**：设备ID + 设备密钥认证
- **权限管理**：基于角色的权限管理
- **异常检测**：检测异常设备行为
- **远程锁定**：异常设备远程锁定

---

## 📊 性能优化

### 数据库优化
- **索引优化**：优化数据库索引
- **查询优化**：优化数据库查询
- **缓存优化**：优化Redis缓存
- **分表分库**：大数据量时分表分库

### 服务优化
- **负载均衡**：使用Nginx负载均衡
- **CDN加速**：前端资源CDN加速
- **压缩传输**：启用GZIP压缩
- **连接池**：优化数据库连接池

---

## 🐛 常见问题

### 问题1：服务启动失败
**原因**：端口被占用
**解决**：修改端口配置或停止占用端口的服务

### 问题2：数据库连接失败
**原因**：数据库服务未启动或配置错误
**解决**：检查数据库服务状态和配置

### 问题3：MQTT连接失败
**原因**：MQTT服务未启动或配置错误
**解决**：检查MQTT服务状态和配置

### 问题4：API响应慢
**原因**：数据库查询慢或网络延迟
**解决**：优化数据库查询或检查网络状况

---

**文档版本**：v1.0.0  
**最后更新**：2026年4月4日
