package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.AddressDto;
import com.Ecostore.Backend.dto.OrderItemDto;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.OrderItem;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.repository.OrderRepository;
import com.Ecostore.Backend.repository.ProductRepository;
import com.Ecostore.Backend.request.CreateOrderRequest;
import com.Ecostore.Backend.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Order createOrder(User user, CreateOrderRequest req) {
        // 1. Create the main Order object and set its initial details.
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        // Extract shipping address from the request object
        AddressDto shippingAddress = req.getShippingAddress();
        order.setShippingAddress(shippingAddress.getStreetAddress() + ", " + shippingAddress.getCity() + ", " + shippingAddress.getState() + " - " + shippingAddress.getZipCode());

        order.setOrderStatus("PLACED");
        order.setPaymentMethod(req.getPaymentMethod());

        // --- THIS IS THE NEW LOGIC ---
        // Check the payment method to set the correct payment status.
        if ("COD".equalsIgnoreCase(req.getPaymentMethod())) {
            order.setPaymentStatus("PENDING");
        } else {
            // --- VALIDATION LOGIC ---
            if (req.getPaymentId() == null || req.getPaymentId().isEmpty()) {
                throw new IllegalArgumentException("Payment ID is required for online payments.");
            }
            order.setPaymentStatus("COMPLETED");
            order.setPaymentId(req.getPaymentId());
        }
        // --- END OF NEW LOGIC ---

        // 2. Create an empty list to hold our fully prepared OrderItem entities.
        List<OrderItem> preparedOrderItems = new ArrayList<>();
        double totalPrice = 0.0;

        // 3. Loop through each item DTO from the request.
        for (OrderItemDto dto : req.getOrderItems()) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + dto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(dto.getQuantity());

            double itemPrice = product.getPrice() * dto.getQuantity();
            orderItem.setPrice(itemPrice);
            totalPrice += itemPrice;

            orderItem.setOrder(order);
            preparedOrderItems.add(orderItem);
        }

        // 4. Set the list of prepared items and the final total price on the order.
        order.setOrderItems(preparedOrderItems);
        order.setTotalPrice(totalPrice);

        // 5. Save the complete order to the database.
        return orderRepository.save(order);
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> opt = orderRepository.findById(orderId);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new Exception("Order not found with id: " + orderId);
    }

    // ... Implementations for status changes ...
    private Order updateOrderStatus(Long orderId, String status) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(status);
        if (status.equals("DELIVERED")) {
            order.setDeliveryDate(LocalDateTime.now());
            order.setPaymentStatus("COMPLETED");
        }
        return orderRepository.save(order);
    }

    @Override
    public Order placedOrder(Long orderId) throws Exception {
        return updateOrderStatus(orderId, "PLACED");
    }

    @Override
    public Order confirmedOrder(Long orderId) throws Exception {
        return updateOrderStatus(orderId, "CONFIRMED");
    }

    @Override
    public Order shippedOrder(Long orderId) throws Exception {
        return updateOrderStatus(orderId, "SHIPPED");
    }

    @Override
    public Order deliveredOrder(Long orderId) throws Exception {
        return updateOrderStatus(orderId, "DELIVERED");
    }

    @Override
    public void deleteOrder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        orderRepository.delete(order);
    }

    @Override
    public Order markCodAsPaid(Long orderId) throws Exception {
        Order order = findOrderById(orderId);

        // We should only be able to do this for orders that are actually COD.
        if (!"COD".equalsIgnoreCase(order.getPaymentMethod())) {
            throw new IllegalArgumentException("This order was not placed as Cash on Delivery.");
        }

        // We should only do this for orders where payment is still pending.
        if ("COMPLETED".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new IllegalArgumentException("This order's payment has already been marked as completed.");
        }

        order.setPaymentStatus("COMPLETED");

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order updatePayment(Long orderId, PaymentRequest paymentRequest) throws Exception {
        Order order = findOrderById(orderId);

        order.setPaymentMethod(paymentRequest.getPaymentMethod());
        order.setPaymentId(paymentRequest.getPaymentId());
        order.setPaymentStatus("COMPLETED"); // Once payment details are provided, we mark it as completed.

        return orderRepository.save(order);
    }
}