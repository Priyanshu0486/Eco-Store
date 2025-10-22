# EcoStore System Design Overview

This document provides a summary of the core backend architecture and business logic for the EcoStore application as discussed on September 5, 2025.

---

## 1. Database Design

The application follows a classic relational database model designed for an e-commerce platform. The schema is centered around three core concepts: **Users**, **Products**, and **Orders**.

### Core Entities and Their Roles

*   **`Users`**: Stores all customer data, including authentication details, personal information, and their `EcoCoin` balance for the loyalty program.
*   **`Products`**: Acts as the product catalog, holding all information about each item, such as name, price, and inventory. It also includes denormalized fields like `rating` and `totalReviewCount` to improve performance by avoiding real-time calculations on product views.
*   **`Orders`**: Tracks every purchase, linking to a user and containing key information like total price, shipping address, and the status of the order and payment.
*   **`OrderItem`**: A join table that connects `Orders` and `Products`, storing transactional details like the quantity and the historical price of a product for a specific order.
*   **`Rating`**: A table to manage the many-to-many relationship between users and products for ratings.
*   **`DiscountCoupon`**: Stores information about promotional discount codes.

### Entity Relationships

The power of the design comes from how these tables are related:

*   **Users and Orders (One-to-Many):** One user can have many orders, but each order belongs to a single user. This is fundamental to tracking a customer's purchase history.

*   **Orders and Products (Many-to-Many):** An order can contain multiple products, and a product can be in many orders. This is managed through the `OrderItem` join table.

*   **Users and Products for Ratings (Many-to-Many):** A user can rate multiple products, and a product can be rated by multiple users. This is handled by the `Rating` table.

### Visual Relationship Diagram

```
+-----------+       +-----------+       +-------------+
|   Users   |       |  Ratings  |       |  Products   |
|-----------|       |-----------|       |-------------|
| id (PK)   |-------< user_id   |       | id (PK)     |
| ...       |       | product_id >------| ...         |
+-----------+       +-----------+       +-------------+
      |                                       |
      | 1                                     | M
      v                                       v
+-----------+       +-------------+       +-------------+
|  Orders   | M     | Order_Item  | M     | (from above)|
|-----------|-------|-------------|-------|  Products   |
| id (PK)   |       | id (PK)     |       |-------------|
| user_id(FK)>------| order_id(FK)|       |             |
| finalPrice|       | product_id(FK) >----|             |
+-----------+       | quantity    |       +-------------+
                    | price       |
                    +-------------+
```

---

## 2. Key Business Logic

### Product Rating Calculation

The system uses an efficient **incremental average** formula to update product ratings without recalculating the entire average each time.

*   **Formula:** `New Average = ((Old Average * Old Count) + New Rating) / (Old Count + 1)`

*   **Example:** If a product has a `4.5` star rating from `10` reviews, and a new user gives it `3` stars:
    1.  **Old Total Score:** `4.5 * 10 = 45`
    2.  **New Total Score:** `45 + 3 = 48`
    3.  **New Review Count:** `10 + 1 = 11`
    4.  **New Average Rating:** `48 / 11 = 4.36`

### The Role of the `order_item` Table

The `order_item` table is crucial for two main reasons:

1.  **Connecting Orders and Products:** It acts as a bridge to resolve the many-to-many relationship, linking specific products to specific orders.

2.  **Storing Transactional Data:** It captures data unique to that transaction, including:
    *   **`quantity`**: The number of units of a product purchased in that specific order.
    *   **`price`**: A historical snapshot of the product's price at the moment of purchase, which is essential for accurate record-keeping as prices may change over time.

In summary, the `orders` table holds the receipt's header (who, when, total cost), while the `order_item` table holds the detailed list of items on that receipt.
