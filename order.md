# 🌿 EcoStore Orders Module - Spring Boot Backend

This module is a part of the **EcoStore** project — a sustainable eCommerce platform built with the goal of promoting eco-friendly shopping habits. The `orders` module handles everything related to placing and managing orders using **Spring Boot**, **JPA**, and **MySQL**.

---

## 📦 Features

- Create and store new orders
- Store multiple order items per order
- Track order status (Pending, Shipped, Delivered, etc.)
- Store eco-packaging preferences
- Calculate eco score (mocked for now)
- Get all orders placed by a specific user

---

## 🏗️ Tech Stack

| Layer      | Tech          |
|------------|---------------|
| Backend    | Spring Boot   |
| ORM        | Spring Data JPA |
| Database   | MySQL         |
| Java Ver.  | Java 17+      |
| Build Tool | Maven         |

---

## 🛠️ How It Works

### 🔁 Order Flow:

1. Frontend sends a POST request with order + order items
2. Backend saves order details into the `orders` table
3. Order items are saved in the `order_items` table (linked by foreign key)
4. Response returns full order details (can be extended)

---

## 🗃️ Database Tables

### `orders`

| Column Name        | Type            | Description                              |
|--------------------|-----------------|------------------------------------------|
| `order_id`         | BIGINT (PK)     | Auto-generated order ID                  |
| `user_id`          | BIGINT          | ID of the user placing the order         |
| `order_date`       | DATETIME        | When the order was placed                |
| `status`           | VARCHAR(20)     | `Pending`, `Shipped`, `Delivered`, etc.  |
| `total_amount`     | DECIMAL(10,2)   | Total cost of the order                  |
| `payment_method`   | VARCHAR(20)     | `COD`, `UPI`, etc.                       |
| `payment_status`   | VARCHAR(20)     | `Paid`, `Unpaid`                         |
| `shipping_address` | TEXT            | Address where the order will be delivered|
| `packaging_type`   | VARCHAR(30)     | e.g., `eco-friendly`, `plastic-free`     |
| `eco_score`        | FLOAT           | Eco impact score (mocked logic)          |
| `expected_delivery`| DATE            | Estimated delivery date                  |
| `created_at`       | TIMESTAMP       | Auto-filled at time of order creation    |

---

### `order_items`

| Column Name     | Type            | Description                             |
|-----------------|-----------------|-----------------------------------------|
| `order_item_id` | BIGINT (PK)     | Unique ID per order item                |
| `order_id`      | BIGINT (FK)     | Reference to `orders` table             |
| `product_id`    | BIGINT          | Product being ordered                   |
| `quantity`      | INT             | Quantity of the product                 |
| `price`         | DECIMAL(10,2)   | Price per unit at order time            |

---

## 🎯 API Endpoints

### `POST /api/orders`
Create a new order with items.

### `GET /api/orders`
Get all orders placed by a specific user.

### `GET /api/orders/{orderId}`
Get a specific order by ID.

### `PUT /api/orders/{orderId}`
Update an existing order.

### `DELETE /api/orders/{orderId}`
Delete an order.

**Request Body:**
```json
{
  "userId": 101,
  "shippingAddress": "Bangalore, India",
  "paymentMethod": "UPI",
  "packagingType": "eco-friendly",
  "items": [
    { "productId": 1, "quantity": 2, "price": 299.99 },
    { "productId": 3, "quantity": 1, "price": 149.00 }
  ]
}
