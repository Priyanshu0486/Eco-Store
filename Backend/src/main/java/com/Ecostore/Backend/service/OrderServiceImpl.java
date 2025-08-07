package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.AddressDto;
import com.Ecostore.Backend.dto.OrderItemDto;
import com.Ecostore.Backend.model.DiscountCoupon;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.OrderItem;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.repository.DiscountCouponRepository;
import com.Ecostore.Backend.repository.OrderRepository;
import com.Ecostore.Backend.repository.ProductRepository;
import com.Ecostore.Backend.request.CreateOrderRequest;
import com.razorpay.Utils;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import com.Ecostore.Backend.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final DiscountCouponRepository discountCouponRepository;
    private final EcoCoinService ecoCoinService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository, DiscountCouponRepository discountCouponRepository, EcoCoinService ecoCoinService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.discountCouponRepository = discountCouponRepository;
        this.ecoCoinService = ecoCoinService;
    }

    @Override
    public Order createOrder(User user, CreateOrderRequest req) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        AddressDto shippingAddress = req.getShippingAddress();
        order.setShippingAddress(shippingAddress.getStreetAddress() + ", " + shippingAddress.getCity() + ", " + shippingAddress.getState() + " - " + shippingAddress.getZipCode());

        order.setOrderStatus("PLACED");
        order.setPaymentMethod(req.getPaymentMethod());

        if ("COD".equalsIgnoreCase(req.getPaymentMethod())) {
            order.setPaymentStatus("PENDING");
        } else if ("RAZORPAY".equalsIgnoreCase(req.getPaymentMethod())) {
            try {
                boolean isSignatureValid = verifyPaymentSignature(req);
                if (isSignatureValid) {
                    order.setPaymentId(req.getPaymentId());
                    order.setRazorpayOrderId(req.getRazorpayOrderId());
                    order.setPaymentStatus("COMPLETED");
                } else {
                    throw new IllegalArgumentException("Payment verification failed: Invalid signature.");
                }
            } catch (RazorpayException e) {
                throw new RuntimeException("Error verifying payment signature", e);
            }
        } else {
             throw new IllegalArgumentException("Unsupported payment method: " + req.getPaymentMethod());
        }

        List<OrderItem> preparedOrderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemDto dto : req.getOrderItems()) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + dto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(dto.getQuantity());
            BigDecimal itemPrice = product.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
            orderItem.setPrice(itemPrice);
            orderItem.setOrder(order);
            preparedOrderItems.add(orderItem);

            totalPrice = totalPrice.add(itemPrice);
        }

        order.setOrderItems(preparedOrderItems);
        order.setTotalPrice(totalPrice);

        BigDecimal discount = BigDecimal.ZERO;

        if (req.getCouponCode() != null && !req.getCouponCode().isEmpty()) {
            String code = req.getCouponCode();
            Optional<DiscountCoupon> couponOpt = discountCouponRepository.findByCode(code);

            if (couponOpt.isPresent()) {
                DiscountCoupon coupon = couponOpt.get();
                if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
                    throw new IllegalArgumentException("Coupon code has expired.");
                }
                if (!coupon.isActive()) {
                    throw new IllegalArgumentException("Coupon code is not active.");
                }

                // Use coupon data from database
                if ("FIXED".equals(coupon.getDiscountType())) {
                    discount = new BigDecimal(coupon.getDiscountAmount().toString());
                } else if ("PERCENTAGE".equals(coupon.getDiscountType())) {
                    discount = totalPrice.multiply(new BigDecimal(coupon.getDiscountPercentage().toString())).divide(new BigDecimal("100"));
                } else {
                    // Fallback for legacy coupons without discountType
                    if ("FLAT50".equals(code)) {
                        discount = new BigDecimal("50.00");
                    } else if (code.startsWith("ECO50-")) {
                        discount = new BigDecimal("50.00");
                    } else if (code.startsWith("ECO150-")) {
                        discount = new BigDecimal("150.00");
                    }
                }

                // The discount cannot be more than the total price
                if (discount.compareTo(totalPrice) > 0) {
                    discount = totalPrice;
                }
            } else {
                // Coupon code not found in database
                throw new IllegalArgumentException("Invalid coupon code.");
            }
        }

        // Add a fixed shipping cost
        BigDecimal shippingCost = new BigDecimal("49.00");
        BigDecimal finalPrice = totalPrice.subtract(discount).add(shippingCost);

        order.setDiscount(discount);
        order.setFinalPrice(finalPrice);

        // Save the order first
        Order savedOrder = orderRepository.save(order);
        
        // Award EcoCoins for successful order (only for completed payments)
        if ("COMPLETED".equals(savedOrder.getPaymentStatus())) {
            try {
                Integer ecoCoinsEarned = ecoCoinService.processEcoCoinEarning(user.getId(), finalPrice);
                System.out.println("EcoCoins awarded: " + ecoCoinsEarned + " for order: " + savedOrder.getId());
            } catch (Exception e) {
                System.err.println("Failed to award EcoCoins for order " + savedOrder.getId() + ": " + e.getMessage());
                // Don't fail the order creation if EcoCoin awarding fails
            }
        }
        
        return savedOrder;
    }

    private boolean verifyPaymentSignature(CreateOrderRequest req) throws RazorpayException {
        String orderId = req.getRazorpayOrderId();
        String paymentId = req.getPaymentId();
        String signature = req.getRazorpaySignature();

        if (orderId == null || paymentId == null || signature == null) {
            throw new IllegalArgumentException("Razorpay payment details are missing.");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", signature);

        return Utils.verifyPaymentSignature(options, this.razorpayKeySecret);
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
        
        // Save the order first
        Order savedOrder = orderRepository.save(order);
        
        // Award EcoCoins for COD payment completion
        try {
            Integer ecoCoinsEarned = ecoCoinService.processEcoCoinEarning(order.getUser().getId(), order.getFinalPrice());
            System.out.println("EcoCoins awarded for COD payment: " + ecoCoinsEarned + " for order: " + savedOrder.getId());
        } catch (Exception e) {
            System.err.println("Failed to award EcoCoins for COD order " + savedOrder.getId() + ": " + e.getMessage());
            // Don't fail the payment completion if EcoCoin awarding fails
        }
        
        return savedOrder;
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