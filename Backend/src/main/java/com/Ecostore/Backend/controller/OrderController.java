package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.request.CreateOrderRequest;
import com.Ecostore.Backend.request.PaymentRequest;
import com.Ecostore.Backend.service.OrderService;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.createOrder(user, req);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> usersOrderHistory(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        List<Order> orders = orderService.usersOrderHistory(user.getId());

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> findOrderById(
            @PathVariable("id") Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Note: You might add extra security here to ensure the user owns this order or is an admin.
        Order order = orderService.findOrderById(orderId);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin")
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Note: We would add admin role validation here in a real app.
        List<Order> orders = orderService.getAllOrders();

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/admin/{orderId}/confirmed")
    public ResponseEntity<Order> confirmedOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Order order = orderService.confirmedOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/admin/{orderId}/shipped")
    public ResponseEntity<Order> shippedOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Order order = orderService.shippedOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/admin/{orderId}/delivered")
    public ResponseEntity<Order> deliveredOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Order order = orderService.deliveredOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{orderId}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        orderService.deleteOrder(orderId);
        return new ResponseEntity<>("Order deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/admin/{orderId}/payment")
    public ResponseEntity<Order> updateOrderPayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // We could add validation here to ensure the user owns the order.
        Order order = orderService.updatePayment(orderId, req);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/admin/{orderId}/cod-paid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> markCodPaymentAsCompleted(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Order order = orderService.markCodAsPaid(orderId);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}