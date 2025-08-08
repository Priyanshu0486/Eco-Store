# Order Management System - Backend Integration Guide

## Overview
This document outlines the frontend implementation of the Order Management System in `OrderList.jsx` and the required backend API endpoints that need to be implemented for full functionality.

## Frontend Implementation Summary

### Location
- **File**: `frontend/src/pages/OrderList.jsx`
- **Route**: `/admin/orders`
- **Purpose**: Admin interface for managing customer orders

### Key Features Implemented
1. **Order Display Table** with all required columns
2. **Search and Filter** functionality
3. **Status Update** for orders with pending payment status
4. **Real-time Data Fetching** from backend
5. **Error Handling** and user notifications

## Required Backend API Endpoints

### 1. Get All Orders (Admin)
```
GET /api/admin/orders
```

**Purpose**: Fetch all orders for admin management

**Expected Response Format**:
```json
[
  {
    "id": 1,
    "user": {
      "id": "USR001",
      "name": "John Doe",
      "username": "johndoe"
    },
    "orderItems": [
      {
        "id": 1,
        "product": { "name": "Product 1" },
        "quantity": 2
      }
    ],
    "orderDate": "2024-01-15T10:30:00",
    "deliveryDate": "2024-01-20T10:30:00",
    "totalPrice": 2000.00,
    "discount": 200.00,
    "finalPrice": 1800.00,
    "orderStatus": "PENDING",
    "shippingAddress": "123 Main St, City",
    "paymentMethod": "Credit Card",
    "paymentId": "PAY-001",
    "razorpayOrderId": "order_123",
    "paymentStatus": "PENDING"
  }
]
```

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 2. Update Order Status
```
PUT /api/admin/orders/{orderId}/status
```

**Purpose**: Update the order status for a specific order

**Request Body**:
```json
{
  "orderStatus": "SHIPPED"
}
```

**Valid Order Status Values**:
- `PENDING`
- `PLACED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Expected Response**:
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
PUT /api/admin/orders/{orderId}/payment-status
```

**Purpose**: Update the payment status for a specific order

**Request Body**:
```json
{
  "paymentStatus": "PAID"
}
```

**Valid Payment Status Values**:
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

**Expected Response**:
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "order": {
    "id": 1,
    "paymentStatus": "PAID"
  }
}
```

## Frontend Data Transformation

The frontend transforms the backend Order model data as follows:

```javascript
const transformedOrders = data.map(order => ({
  id: order.id,
  userId: order.user?.id || 'N/A',
  userName: order.user?.name || order.user?.username || 'Unknown User',
  orderId: `ORD-${order.id}`,
  orderDate: order.orderDate,
  totalAmount: parseFloat(order.finalPrice || order.totalPrice || 0),
  orderStatus: order.orderStatus || 'PENDING',
  paymentId: order.paymentId || 'N/A',
  paymentMethod: order.paymentMethod || 'N/A',
  paymentStatus: order.paymentStatus || 'PENDING',
  itemsCount: order.orderItems?.length || 0
}));
```

## Security Requirements

### Authentication
- All admin endpoints must require JWT authentication
- Verify admin role/permissions before allowing access
- Include proper error handling for unauthorized access

### Authorization
- Only users with admin privileges should access these endpoints
- Implement role-based access control

## Error Handling

### Expected Error Responses
```json
{
  "error": "Error message",
  "status": 400/401/403/404/500
}
```

### Common Error Scenarios
1. **401 Unauthorized**: Invalid or missing JWT token
2. **403 Forbidden**: User doesn't have admin privileges
3. **404 Not Found**: Order ID doesn't exist
4. **400 Bad Request**: Invalid status values or request format
5. **500 Internal Server Error**: Database or server issues

## Business Logic Requirements

### Order Status Updates
- Only orders with `PENDING` payment status can be edited from the frontend
- Status transitions should follow logical flow:
  - `PENDING` → `PLACED` → `SHIPPED` → `DELIVERED`
  - `CANCELLED` can be set from any status except `DELIVERED`

### Payment Status Updates
- Payment status changes should trigger appropriate business logic
- Consider integration with payment gateways for status verification

## Database Considerations

### Order Model Fields (Reference)
Based on the existing `Order.java` model:
```java
@Entity
@Table(name = "orders")
public class Order {
    private Long id;
    private User user;
    private List<OrderItem> orderItems;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private BigDecimal totalPrice;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String orderStatus;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentId;
    private String razorpayOrderId;
    private String paymentStatus = "PENDING";
}
```

## Testing Recommendations

### API Testing
1. Test all endpoints with valid admin JWT tokens
2. Test unauthorized access scenarios
3. Test invalid order IDs and status values
4. Test concurrent status updates
5. Verify data integrity after updates

### Integration Testing
1. Test frontend-backend communication
2. Verify data transformation accuracy
3. Test error handling and user notifications
4. Test real-time updates after status changes

## Implementation Priority

1. **High Priority**: 
   - GET `/api/admin/orders` endpoint
   - Basic authentication and authorization

2. **Medium Priority**:
   - PUT endpoints for status updates
   - Error handling and validation

3. **Low Priority**:
   - Advanced filtering and sorting
   - Audit logging for status changes

## Additional Notes

- The frontend includes comprehensive error handling and user feedback
- All status updates are immediately reflected in the UI
- The system supports real-time data refresh after updates
- Consider implementing WebSocket connections for real-time order updates across multiple admin sessions

## Contact
For any questions regarding the frontend implementation or API requirements, please refer to this document or contact the frontend development team.
