# Product Requirement Document: Eco-Store Frontend Cart Integration

**Version:** 1.0
**Date:** 2025-07-23
**Author:** Cascade AI

---

### 1. Introduction & Overview

This document outlines the requirements for the frontend components responsible for integrating with the Eco-Store's backend shopping cart system. The primary objective is to create a seamless user experience by replacing the previous `localStorage`-based cart with a system that reflects the persistent, backend-driven state. This ensures that the user's cart is always synchronized with the server.

### 2. Key Features & Components

#### 2.1. API Communication Utility (`src/utils/api.js`)

*   **Description:** A centralized module for handling all HTTP requests to the backend API. It uses Axios and is configured with an interceptor to automatically attach the user's JWT token to the `Authorization` header of every request.
*   **Key Functions:**
    *   `getCart()`: Sends a `GET` request to `/api/cart/` to fetch the user's current cart.
    *   `addItemToCart(item)`: Sends a `PUT` request to `/api/cart/add` with the product ID and quantity to add an item to the cart.

#### 2.2. Global Cart State (`src/contexts/CartContext.jsx`)

*   **Description:** A React Context that serves as the single source of truth for the shopping cart data across the entire application. It abstracts the logic for fetching and updating the cart.
*   **Functionality:**
    *   **Initial State:** The cart is initially empty.
    *   **On-Load Fetching:** When the application loads (or when a user logs in), the context triggers an API call to `getCart()` to populate the cart state from the backend.
    *   **State Synchronization:** It provides an `addItemToCart` function that, when called, first updates the backend via the API and then synchronizes the local state with the response, ensuring the UI always reflects the persistent state.

### 3. Functional Requirements

*   **FR-01: Display Persistent Cart:**
    *   **Description:** The user's cart must be fetched from the backend upon application startup and displayed accurately.

*   **FR-02: Add to Cart Functionality:**
    *   **Description:** Users must be able to click an "Add to Cart" button on a product, which triggers an API call to the backend.
    *   **Feedback:** The UI should provide feedback to the user, confirming that the item has been added to their cart.

*   **FR-03: JWT Token Management:**
    *   **Description:** The application must correctly store the JWT token (e.g., in `localStorage`) upon login and use the `api.js` utility to include it in all authenticated requests to the cart endpoints.

### 4. Technical Requirements

*   **TR-01: State Management:** The application must use React Context for managing the global cart state.
*   **TR-02: Asynchronous Operations:** All interactions with the backend must be handled asynchronously (e.g., using `async/await`) with appropriate loading and error states.
*   **TR-03: Error Handling:** The frontend must gracefully handle potential API errors (e.g., network issues, `401 Unauthorized`, `404 Not Found`) and provide feedback to the user where necessary.

### 5. Out of Scope for This Version

*   UI components for viewing the full cart page.
*   Functionality to remove items from the cart or update their quantities directly from the UI.
*   The checkout process.
