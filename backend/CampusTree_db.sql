-- ==========================================
-- CampusTree Marketplace Database
-- MySQL 8.0+
-- ==========================================

CREATE DATABASE IF NOT EXISTS CampusTree_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE CampusTree_db;

-- Drop tables in dependency order for easy testing.
-- WARNING: This removes existing data in these tables.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Notification`;
DROP TABLE IF EXISTS `Delivery`;
DROP TABLE IF EXISTS `PaymentDetails`;
DROP TABLE IF EXISTS `MarketplaceOrder`;
DROP TABLE IF EXISTS `Document`;
DROP TABLE IF EXISTS `Service`;
DROP TABLE IF EXISTS `ServiceProvider`;
DROP TABLE IF EXISTS `Student`;
DROP TABLE IF EXISTS `Admin`;
DROP TABLE IF EXISTS `User`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. USER: Shared login and personal details
-- ==========================================

CREATE TABLE `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==========================================
-- 2. ADMIN: Admin-specific information
-- ==========================================

CREATE TABLE `Admin` (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id)
        REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- 3. STUDENT: Student-specific information
-- ==========================================

CREATE TABLE `Student` (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    student_number VARCHAR(30) NOT NULL UNIQUE,
    institution VARCHAR(150) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- 4. SERVICE PROVIDER: Sellers and providers
-- ==========================================

CREATE TABLE `ServiceProvider` (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(150) NOT NULL,
    description TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id)
        REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- 5. SERVICE: All marketplace listings
-- PRODUCT = physical product
-- SERVICE = work offered by a provider
-- ==========================================

CREATE TABLE `Service` (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    listing_type ENUM('PRODUCT', 'SERVICE') NOT NULL,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity_available INT DEFAULT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_service_price CHECK (price >= 0),
    CONSTRAINT chk_service_quantity CHECK (
        quantity_available IS NULL OR quantity_available >= 0
    ),

    FOREIGN KEY (provider_id)
        REFERENCES `ServiceProvider`(provider_id)
);

-- ==========================================
-- 6. DOCUMENT: Uploaded supporting documents
-- ==========================================

CREATE TABLE `Document` (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type VARCHAR(80) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM(
        'PENDING', 'APPROVED', 'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    FOREIGN KEY (user_id)
        REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- 7. MARKETPLACE ORDER: A student's purchase
-- One listing per order keeps the database simple.
-- ==========================================

CREATE TABLE `MarketplaceOrder` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    order_status ENUM(
        'PENDING', 'CONFIRMED', 'PROCESSING',
        'COMPLETED', 'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_order_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_price CHECK (unit_price >= 0),

    FOREIGN KEY (student_id)
        REFERENCES `Student`(student_id),
    FOREIGN KEY (service_id)
        REFERENCES `Service`(service_id)
);

-- ==========================================
-- 8. PAYMENT DETAILS: Payment record per order
-- ==========================================

CREATE TABLE `PaymentDetails` (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM(
        'CARD', 'EFT', 'CASH', 'OTHER'
    ) NOT NULL,
    payment_status ENUM(
        'PENDING', 'PAID', 'FAILED', 'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(150) UNIQUE,
    paid_at DATETIME,

    CONSTRAINT chk_payment_amount CHECK (amount >= 0),

    FOREIGN KEY (order_id)
        REFERENCES `MarketplaceOrder`(order_id)
);

-- ==========================================
-- 9. DELIVERY: Order collection or delivery
-- ==========================================

CREATE TABLE `Delivery` (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    delivery_method ENUM(
        'CAMPUS_PICKUP', 'MEETUP', 'COURIER', 'DIGITAL'
    ) NOT NULL,
    delivery_address VARCHAR(255),
    tracking_number VARCHAR(100) UNIQUE,
    delivery_status ENUM(
        'PENDING', 'PREPARING', 'IN_TRANSIT',
        'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    delivered_at DATETIME,

    FOREIGN KEY (order_id)
        REFERENCES `MarketplaceOrder`(order_id)
);

-- ==========================================
-- 10. NOTIFICATION: Messages for users
-- ==========================================

CREATE TABLE `Notification` (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    notification_type ENUM(
        'ORDER', 'PAYMENT', 'DELIVERY', 'GENERAL'
    ) NOT NULL DEFAULT 'GENERAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

-- ==========================================
-- TEST DATA
-- ==========================================

-- Users: 1 admin, 2 students, 2 providers
-- Passwords below are test placeholders, NOT usable
-- bcrypt hashes. Replace with real bcrypt hashes
-- generated by your Node.js application.

INSERT INTO `User`
    (user_id, full_name, email, password_hash, phone)
VALUES
    (1, 'CampusTree Admin', 'admin@campustree.test',
     'REPLACE_WITH_BCRYPT_HASH', '0711111111'),

    (2, 'Thando Mokoena', 'thando@campustree.test',
     'REPLACE_WITH_BCRYPT_HASH', '0722222222'),

    (3, 'Lebo Nkosi', 'lebo@campustree.test',
     'REPLACE_WITH_BCRYPT_HASH', '0733333333'),

    (4, 'Sipho Dlamini', 'sipho@campustree.test',
     'REPLACE_WITH_BCRYPT_HASH', '0744444444'),

    (5, 'Amahle Ndlovu', 'amahle@campustree.test',
     'REPLACE_WITH_BCRYPT_HASH', '0755555555');

INSERT INTO `Admin` (admin_id, user_id)
VALUES (1, 1);

INSERT INTO `Student`
    (student_id, user_id, student_number, institution)
VALUES
    (1, 2, 'UJ2026001', 'University of Johannesburg'),
    (2, 3, 'UJ2026002', 'University of Johannesburg');

INSERT INTO `ServiceProvider`
    (provider_id, user_id, business_name, description, is_verified)
VALUES
    (1, 4, 'Sipho Tech Store',
     'Affordable electronics and student accessories', TRUE),

    (2, 5, 'Amahle Design Studio',
     'Graphic design and student printing services', TRUE);

-- Products and services
INSERT INTO `Service`
    (service_id, provider_id, title, description,
     listing_type, category, price, quantity_available, image_url)
VALUES
    (1, 1, 'Wireless Mouse',
     'Wireless mouse suitable for laptops',
     'PRODUCT', 'Electronics', 150.00, 20, NULL),

    (2, 1, 'USB Flash Drive 32GB',
     '32GB USB storage device',
     'PRODUCT', 'Electronics', 100.00, 30, NULL),

    (3, 2, 'Assignment Printing',
     'Black-and-white assignment printing service',
     'SERVICE', 'Printing', 2.00, NULL, NULL),

    (4, 2, 'Poster Design',
     'Custom digital poster design for student events',
     'SERVICE', 'Graphic Design', 250.00, NULL, NULL);

-- Orders: one order per purchased listing
INSERT INTO `MarketplaceOrder`
    (order_id, student_id, service_id, quantity,
     unit_price, order_status)
VALUES
    (1, 1, 1, 1, 150.00, 'CONFIRMED'),
    (2, 2, 3, 20, 2.00, 'PENDING'),
    (3, 1, 4, 1, 250.00, 'PROCESSING');

-- Payments
INSERT INTO `PaymentDetails`
    (payment_id, order_id, amount, payment_method,
     payment_status, transaction_reference, paid_at)
VALUES
    (1, 1, 150.00, 'EFT', 'PAID',
     'CT-DEMO-TXN-001', NOW()),

    (2, 2, 40.00, 'CARD', 'PENDING',
     NULL, NULL),

    (3, 3, 250.00, 'CARD', 'PAID',
     'CT-DEMO-TXN-003', NOW());

-- Deliveries / fulfillment
INSERT INTO `Delivery`
    (delivery_id, order_id, delivery_method,
     delivery_address, tracking_number, delivery_status)
VALUES
    (1, 1, 'CAMPUS_PICKUP',
     'UJ Auckland Park Campus',
     'CT-DEMO-DEL-001', 'READY_FOR_PICKUP'),

    (2, 2, 'CAMPUS_PICKUP',
     'UJ Auckland Park Campus',
     NULL, 'PENDING'),

    (3, 3, 'DIGITAL',
     NULL, NULL, 'DELIVERED');

-- Uploaded documents
INSERT INTO `Document`
    (document_id, user_id, document_type, file_url,
     verification_status)
VALUES
    (1, 2, 'STUDENT_CARD',
     '/uploads/demo/student-card-1.pdf', 'APPROVED'),

    (2, 4, 'BUSINESS_PROOF',
     '/uploads/demo/business-proof-1.pdf', 'PENDING');

-- Notifications
INSERT INTO `Notification`
    (notification_id, user_id, message, notification_type)
VALUES
    (1, 2, 'Your wireless mouse order is confirmed.',
     'ORDER'),

    (2, 2, 'Your payment has been received.',
     'PAYMENT'),

    (3, 3, 'Your printing order is awaiting payment.',
     'PAYMENT'),

    (4, 4, 'You have received a new marketplace order.',
     'ORDER'),

    (5, 5, 'Your poster design order is being processed.',
     'ORDER');

-- ==========================================
-- VERIFY THE TEST DATA
-- ==========================================

SELECT * FROM `User`;
SELECT * FROM `Student`;
SELECT * FROM `ServiceProvider`;
SELECT * FROM `Service`;
SELECT * FROM `MarketplaceOrder`;
SELECT * FROM `PaymentDetails`;
SELECT * FROM `Delivery`;
SELECT * FROM `Notification`;