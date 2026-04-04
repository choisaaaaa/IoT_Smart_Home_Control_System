CREATE DATABASE IF NOT EXISTS iot_hotel_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iot_hotel_system;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS security_events;
DROP TABLE IF EXISTS control_commands;
DROP TABLE IF EXISTS sensor_data;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS maintenance_tickets;
DROP TABLE IF EXISTS delivery_orders;
DROP TABLE IF EXISTS member_coupons;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS users;

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    hotel_address VARCHAR(255) DEFAULT NULL,
    hotel_phone VARCHAR(20) DEFAULT NULL,
    hotel_star INT DEFAULT 3,
    total_rooms INT DEFAULT 0,
    occupied_rooms INT DEFAULT 0,
    occupancy_rate DECIMAL(5,2) DEFAULT 0.00,
    logo VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_hotel_name (hotel_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    room_name VARCHAR(100) DEFAULT NULL,
    room_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    room_status VARCHAR(20) NOT NULL DEFAULT 'available',
    floor INT DEFAULT 1,
    area DECIMAL(6,2) DEFAULT NULL,
    bed_type VARCHAR(20) DEFAULT 'single',
    max_guests INT DEFAULT 1,
    description TEXT DEFAULT NULL,
    facilities JSON DEFAULT NULL,
    images JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_room_number (room_number),
    INDEX idx_room_status (room_status),
    INDEX idx_room_type (room_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_number VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_id_number VARCHAR(50) DEFAULT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guest_count INT DEFAULT 1,
    special_requests VARCHAR(255) DEFAULT NULL,
    payment_method VARCHAR(20) DEFAULT 'balance',
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deposit DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    check_in_time DATETIME DEFAULT NULL,
    check_out_time DATETIME DEFAULT NULL,
    cancelled_at DATETIME DEFAULT NULL,
    UNIQUE KEY uk_booking_number (booking_number),
    INDEX idx_room_id (room_id),
    INDEX idx_status (status),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_check_out_date (check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_no VARCHAR(50) NOT NULL,
    order_type VARCHAR(20) NOT NULL DEFAULT 'booking',
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'wechat',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_no VARCHAR(100) DEFAULT NULL,
    paid_at DATETIME DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_payment_no (payment_no),
    INDEX idx_order (order_type, order_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    id_number VARCHAR(50) DEFAULT NULL,
    member_level VARCHAR(20) NOT NULL DEFAULT 'standard',
    points INT NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_spent DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_stays INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_phone (phone),
    INDEX idx_member_level (member_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_name VARCHAR(100) NOT NULL,
    coupon_type VARCHAR(20) NOT NULL DEFAULT 'discount',
    discount_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    min_amount DECIMAL(10,2) DEFAULT 0.00,
    total_count INT NOT NULL DEFAULT 0,
    received_count INT NOT NULL DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_valid (valid_from, valid_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE member_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    coupon_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unused',
    used_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member (member_id),
    INDEX idx_coupon (coupon_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE delivery_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    item_category VARCHAR(50) NOT NULL DEFAULT 'food',
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    note VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    UNIQUE KEY uk_order_no (order_no),
    INDEX idx_room_id (room_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE maintenance_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_no VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    fault_type VARCHAR(50) NOT NULL DEFAULT 'other',
    fault_description TEXT DEFAULT NULL,
    photos JSON DEFAULT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    repair_description TEXT DEFAULT NULL,
    repair_cost DECIMAL(10,2) DEFAULT 0.00,
    UNIQUE KEY uk_ticket_no (ticket_no),
    INDEX idx_room_id (room_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_type VARCHAR(20) NOT NULL DEFAULT 'booking',
    member_id INT DEFAULT NULL,
    score INT NOT NULL DEFAULT 5,
    content TEXT DEFAULT NULL,
    photos JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order (order_id, order_type),
    INDEX idx_member_id (member_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    device_type VARCHAR(20) NOT NULL,
    device_name VARCHAR(50) NOT NULL,
    device_key VARCHAR(50) NOT NULL,
    device_status VARCHAR(20) NOT NULL DEFAULT 'offline',
    firmware_version VARCHAR(20) DEFAULT NULL,
    last_seen DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_device_id (device_id),
    INDEX idx_device_type (device_type),
    INDEX idx_device_status (device_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    sensor_type VARCHAR(20) NOT NULL,
    sensor_value VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_created_at (created_at),
    INDEX idx_device_sensor (device_id, sensor_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE control_commands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    command_type VARCHAR(20) NOT NULL,
    command_value VARCHAR(50) NOT NULL,
    command_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_by VARCHAR(50) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    executed_at DATETIME DEFAULT NULL,
    INDEX idx_device_id (device_id),
    INDEX idx_created_at (created_at),
    INDEX idx_command_status (command_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    permissions JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_username (username),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE security_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    event_data TEXT DEFAULT NULL,
    event_level VARCHAR(20) NOT NULL DEFAULT 'info',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_id (device_id),
    INDEX idx_created_at (created_at),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hotels (hotel_name, hotel_address, hotel_phone, hotel_star, total_rooms, occupied_rooms, occupancy_rate, description) 
VALUES ('智联酒店', '北京市朝阳区科技园路88号', '010-12345678', 5, 200, 87, 43.50, '智慧酒店物联网控制系统示范酒店，提供智能化客房体验');

INSERT INTO rooms (room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities) VALUES
('101', 'standard', '标准单人房A', 299.00, 'available', 1, 25.00, 'single', 1, '舒适的标准单人房，配备齐全', '["WiFi","电视","空调","电话","迷你吧"]'),
('102', 'standard', '标准单人房B', 299.00, 'occupied', 1, 25.00, 'single', 1, '安静的标准单人房', '["WiFi","电视","空调","电话"]'),
('103', 'deluxe', '豪华大床房A', 499.00, 'available', 1, 35.00, 'king', 2, '宽敞的豪华大床房', '["WiFi","电视","空调","电话","迷你吧","浴缸"]'),
('201', 'deluxe', '豪华大床房B', 499.00, 'available', 2, 38.00, 'king', 2, '景观豪华大床房', '["WiFi","电视","空调","电话","迷你吧","浴缸","阳台"]'),
('202', 'suite', '行政套房A', 899.00, 'cleaning', 2, 55.00, 'king', 3, '尊享行政套房', '["WiFi","电视","空调","电话","迷你吧","浴缸","客厅","办公区"]'),
('203', 'suite', '行政套房B', 999.00, 'available', 2, 60.00, 'twin', 3, '总统级行政套房', '["WiFi","电视","空调","电话","迷你吧","浴缸","客厅","办公区","厨房"]'),
('301', 'presidential', '总统套房', 2999.00, 'reserved', 3, 120.00, 'king', 4, '顶级总统套房，尽享奢华', '["WiFi","电视","空调","电话","迷你吧","浴缸","客厅","办公区","厨房","餐厅","私人泳池"]'),
('302', 'standard', '标准双人房A', 399.00, 'available', 3, 28.00, 'double', 2, '温馨的标准双人房', '["WiFi","电视","空调","电话"]'),
('303', 'standard', '标准双人房B', 399.00, 'maintenance', 3, 28.00, 'double', 2, '标准双人房', '["WiFi","电视","空调","电话"]');

INSERT INTO devices (device_id, device_type, device_name, device_key, device_status, firmware_version, last_seen) VALUES
('MAIN001', 'main', '前台管理端-01', 'key_main_001_secure', 'online', 'v2.1.0', NOW()),
('SUB1F01', 'sub1', '楼控终端-1F', 'key_sub1_f01_secure', 'online', 'v1.5.2', NOW()),
('SUB1F02', 'sub1', '楼控终端-2F', 'key_sub1_f02_secure', 'online', 'v1.5.2', NOW()),
('SUB1F03', 'sub1', '楼控终端-3F', 'key_sub1_f03_secure', 'offline', 'v1.5.1', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('R101', 'sub2', '客房控制器-101', 'key_room_101_secure', 'online', 'v1.3.0', NOW()),
('R102', 'sub2', '客房控制器-102', 'key_room_102_secure', 'online', 'v1.3.0', NOW()),
('R103', 'sub2', '客房控制器-103', 'key_room_103_secure', 'error', 'v1.2.9', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('R201', 'sub2', '客房控制器-201', 'key_room_201_secure', 'online', 'v1.3.0', NOW()),
('R202', 'sub2', '客房控制器-202', 'key_room_202_secure', 'offline', 'v1.3.0', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO users (username, password, email, role, permissions) VALUES
('admin', '$2a$10$N9qo8uLOickg2ZARZ5XpSOp/VOJJPYJZTqPqIwMf8KFNhFqXjQK7m', 'admin@iot-hotel.com', 'admin', '["read","write","delete","manage_users","manage_devices","view_reports"]'),
('staff01', '$2a$10$N9qo8uLOickg2ZARZ5XpSOp/VOJJPYJZTqPqIwMf8KFNhFqXjQK7m', 'staff01@iot-hotel.com', 'staff', '["read","write","manage_bookings","manage_rooms"]');

INSERT INTO members (phone, password, name, member_level, points, balance, total_spent, total_stays) VALUES
('13800138000', '$2a$10$N9qo8uLOickg2ZARZ5XpSOp/VOJJPYJZTqPqIwMf8KFNhFqXjQK7m', '张三', 'gold', 2500, 128.50, 5860.00, 8),
('13900139000', '$2a$10$N9qo8uLOickg2ZARZ5XpSOp/VOJJPYJZTqPqIwMf8KFNhFqXjQK7m', '李四', 'platinum', 8500, 520.00, 25680.00, 22);

INSERT INTO bookings (booking_number, room_id, guest_name, guest_phone, check_in_date, check_out_date, guest_count, payment_method, total_price, status) VALUES
('BK20260404001', 2, '王五', '13700137000', '2026-04-04', '2026-04-06', 1, 'alipay', 598.00, 'checked_in'),
('BK20260404002', 5, '赵六', '13600136000', '2026-04-05', '2026-04-08', 2, 'wechat', 1797.00, 'confirmed'),
('BK20260404003', 7, '钱七', '13500135000', '2026-04-06', '2026-04-09', 2, 'credit_card', 8997.00, 'confirmed');

INSERT INTO coupons (coupon_name, coupon_type, discount_value, min_amount, total_count, received_count, valid_from, valid_to) VALUES
('新用户专享满减券', 'discount', 50.00, 300.00, 5000, 1200, '2026-01-01', '2026-12-31'),
('会员日8折券', 'percentage', 20.00, 500.00, 2000, 800, '2026-04-01', '2026-06-30'),
('免费升级套房券', 'free', 0.00, 1500.00, 100, 25, '2026-03-01', '2026-09-30');

INSERT INTO delivery_orders (order_no, room_id, item_category, item_name, quantity, note, status) VALUES
('DLV20260404001', 2, 'beverage', '矿泉水', 2, '送到房间', 'processing'),
('DLV20260404002', 2, 'food', '方便面', 1, '', 'pending');

INSERT INTO maintenance_tickets (ticket_no, room_id, fault_type, fault_description, priority, status) VALUES
('MT20260404001', 9, 'air_conditioner', '空调不制冷，温度设定26度但实际出热风', 'high', 'pending');

SET FOREIGN_KEY_CHECKS = 1;