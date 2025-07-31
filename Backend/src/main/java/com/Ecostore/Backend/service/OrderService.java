package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.AddressDto;
import com.Ecostore.Backend.dto.OrderItemDto;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.request.CreateOrderRequest;
import com.Ecostore.Backend.request.PaymentRequest;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, CreateOrderRequest req);

    Order findOrderById(Long orderId) throws Exception;

    List<Order> usersOrderHistory(Long userId);

    Order placedOrder(Long orderId) throws Exception;

    Order confirmedOrder(Long orderId) throws Exception;

    Order shippedOrder(Long orderId) throws Exception;

    Order deliveredOrder(Long orderId) throws Exception;

    void deleteOrder(Long orderId) throws Exception;

    Order markCodAsPaid(Long orderId) throws Exception;

    List<Order> getAllOrders();

    Order updatePayment(Long orderId, PaymentRequest paymentRequest) throws Exception;
}
