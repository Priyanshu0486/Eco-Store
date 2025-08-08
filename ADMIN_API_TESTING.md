# Admin Order Management API - Testing Guide

## Overview
This guide provides step-by-step instructions for testing the Admin Order Management API endpoints.

## Prerequisites
1. **Admin User**: You need a user account with `ROLE_ADMIN` role
2. **JWT Token**: Valid JWT token for authentication
3. **Test Orders**: Some existing orders in the database

## API Endpoints

### 1. Get All Orders
```
GET http://localhost:8080/api/admin/orders
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "ROLE_USER"
    },
    "orderItems": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Eco-Friendly Water Bottle",
          "price": 500.00
        },
        "quantity": 2,
        "price": 1000.00
      }
    ],
    "orderDate": "2024-01-15T10:30:00",
    "deliveryDate": null,
    "totalPrice": 1000.00,
    "discount": 100.00,
    "finalPrice": 900.00,
    "orderStatus": "PENDING",
    "shippingAddress": "123 Main St, City, State",
    "paymentMethod": "Credit Card",
    "paymentId": "PAY-001",
    "razorpayOrderId": "order_123",
    "paymentStatus": "PENDING"
  }
]
```

### 2. Update Order Status
```
PUT http://localhost:8080/api/admin/orders/1/status
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderStatus": "SHIPPED"
}
```

**Valid Order Status Values:**
- `PENDING`
- `PLACED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Expected Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "id": 1,
    "orderStatus": "SHIPPED"
  }
}
```

### 3. Update Payment Status
```
PUT http://localhost:8080/api/admin/orders/1/payment-status
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentStatus": "COMPLETED"
}
```

**Valid Payment Status Values:**
- `PENDING`
- `COMPLETED`
- `FAILED`
- `REFUNDED`

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "order": {
    "id": 1,
    "paymentStatus": "COMPLETED"
  }
}
```

## Testing with Postman

### Step 1: Get JWT Token
1. First, login with an admin user account
2. Copy the JWT token from the login response

### Step 2: Test Get All Orders
1. Create a new GET request to `http://localhost:8080/api/admin/orders`
2. Add Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Send the request
4. Verify you get a list of orders

### Step 3: Test Order Status Update
1. Create a new PUT request to `http://localhost:8080/api/admin/orders/1/status`
2. Add Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Add request body with new order status
4. Send the request
5. Verify the response shows success

### Step 4: Test Payment Status Update
1. Create a new PUT request to `http://localhost:8080/api/admin/orders/1/payment-status`
2. Add Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Add request body with new payment status
4. Send the request
5. Verify the response shows success

## Testing with cURL

### Get All Orders
```bash
curl -X GET "http://localhost:8080/api/admin/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Order Status
```bash
curl -X PUT "http://localhost:8080/api/admin/orders/1/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "SHIPPED"}'
```

### Update Payment Status
```bash
curl -X PUT "http://localhost:8080/api/admin/orders/1/payment-status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentStatus": "COMPLETED"}'
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin role required",
  "status": 403
}
```

### 404 Not Found
```json
{
  "error": "Order not found with ID: 999",
  "status": 404
}
```

### 400 Bad Request
```json
{
  "error": "Invalid payment status. Valid values: PENDING, COMPLETED, FAILED, REFUNDED",
  "status": 400
}
```

## Business Logic Validation

### Order Status Transitions
- `PENDING` → `PLACED`, `CANCELLED`
- `PLACED` → `SHIPPED`, `CANCELLED`
- `SHIPPED` → `DELIVERED`, `CANCELLED`
- `DELIVERED` → No transitions allowed
- `CANCELLED` → No transitions allowed

### Edit Restrictions
- Only orders with `PENDING` payment status can have their order status edited
- Payment status can be updated regardless of order status

## Frontend Integration

The frontend `OrderList.jsx` component expects:
1. Orders array from GET `/api/admin/orders`
2. Success/error responses from PUT endpoints
3. Proper error handling for all scenarios

## Troubleshooting

### Common Issues
1. **403 Forbidden**: Make sure your user has `ROLE_ADMIN` role
2. **401 Unauthorized**: Check if JWT token is valid and not expired
3. **404 Not Found**: Verify the order ID exists in the database
4. **400 Bad Request**: Check request body format and status values

### Database Setup
Make sure you have:
1. At least one user with `ROLE_ADMIN` role
2. Some test orders in the database
3. Proper foreign key relationships between User, Order, and OrderItem tables

## Next Steps
After successful API testing:
1. Test the frontend integration with `OrderList.jsx`
2. Verify real-time updates in the admin interface
3. Test error handling scenarios in the UI
4. Consider adding audit logging for status changes
