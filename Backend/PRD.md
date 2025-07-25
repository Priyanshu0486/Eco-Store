# Product Requirement Document: Eco-Store Shopping Cart

**Version:** 1.0
**Date:** 2025-07-23
**Author:** Cascade AI

---

### 1. Introduction & Overview

This document outlines the requirements for the shopping cart feature of the Eco-Store e-commerce platform. The primary goal is to provide users with a persistent, secure, and intuitive shopping cart that is tightly integrated with the existing user and product systems. This feature transitions the cart management from a temporary, frontend-only state (using `localStorage`) to a robust, backend-driven system, ensuring data consistency and a seamless user experience across sessions and devices.

### 2. User Roles & Personas

*   **Authenticated User:** A registered and logged-in customer of the Eco-Store. This is the only user role that can interact with the persistent shopping cart.

### 3. Functional Requirements

#### 3.1. Core Cart Operations

*   **FR-01: Persistent Cart Creation:**
    *   **Description:** A user's shopping cart shall be persistent across sessions.
    *   **Details:** A cart entity shall be automatically created in the database for a user the first time they attempt to add an item. A user will have one and only one cart associated with their account.

*   **FR-02: Add Item to Cart:**
    *   **Description:** An authenticated user must be able to add any available product to their shopping cart.
    *   **Details:**
        *   If the product does not already exist in the cart, it is added as a new line item with the specified quantity.
        *   If the product already exists, its quantity is incremented by the newly added amount.

*   **FR-03: View Cart:**
    *   **Description:** An authenticated user must be able to view the contents of their shopping cart.
    *   **Details:** The cart view shall display all items, including the product details (name, image, price) and the quantity for each item.

#### 3.2. Technical & System Requirements

*   **FR-04: Backend-Driven State:**
    *   **Description:** The backend database shall be the single source of truth for the cart's state.
    *   **Details:** The frontend will no longer rely on `localStorage` for cart management. It will fetch cart data on load and send updates to the backend for any modifications.

*   **FR-05: Secure API Endpoints:**
    *   **Description:** All API endpoints related to cart operations must be secure.
    *   **Details:** Endpoints require a valid JSON Web Token (JWT) in the `Authorization` header for access. The user's identity is derived from this token.

### 4. API Endpoints

The following RESTful API endpoints have been implemented to support the cart functionality:

*   **`GET /api/cart/`**
    *   **Description:** Fetches the authenticated user's cart.
    *   **Authentication:** Required (JWT).
    *   **Success Response (200 OK):** A JSON object representing the user's `Cart`, including a list of `CartItem` objects.
    *   **Error Response (404 Not Found):** If the user exists but has no cart (e.g., an error state).

*   **`PUT /api/cart/add`**
    *   **Description:** Adds an item to the authenticated user's cart.
    *   **Authentication:** Required (JWT).
    *   **Request Body:** `{"productId": <Long>, "quantity": <int>}`
    *   **Success Response (200 OK):** A confirmation message string.
    *   **Error Responses:**
        *   `401 Unauthorized`: If the user token is invalid.
        *   `404 Not Found`: If the specified `productId` does not exist.

### 5. Data Model (ERD Compliance)

The implementation strictly follows the provided ERD.

*   **`Cart` Entity:**
    *   `id`: Primary Key
    *   `user`: One-to-One relationship with the `User` entity.
    *   `cartItems`: One-to-Many relationship with the `CartItem` entity.

*   **`CartItem` Entity:**
    *   `id`: Primary Key
    *   `cart`: Many-to-One relationship with the `Cart` entity.
    *   `product`: Many-to-One relationship with the `Product` entity.
    *   `quantity`: Integer representing the quantity of the product.
    *   `userId`: The ID of the user who owns the cart.

### 6. Error Handling

*   **`UserException`:** Thrown for user-related errors (e.g., user not found from JWT).
*   **`ProductException`:** Thrown for product-related errors (e.g., attempting to add a non-existent product to the cart).
*   The controller layer catches these exceptions and translates them into appropriate HTTP status codes and error messages for the client.

### 7. Out of Scope for This Version

*   Removing items from the cart.
*   Updating the quantity of an item directly in the cart (e.g., changing quantity from 2 to 5).
*   The checkout and order placement process.
*   Applying discounts or coupons to the cart.
