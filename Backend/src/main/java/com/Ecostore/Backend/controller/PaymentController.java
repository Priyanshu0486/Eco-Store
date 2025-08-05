package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.model.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(@RequestBody Map<String, Object> request) throws RazorpayException {
        Integer amount = (Integer) request.get("amount");
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // amount in the smallest currency unit (paise)
            orderRequest.put("currency", "INR");

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
            String orderId = razorpayOrder.get("id");
            Integer orderAmount = razorpayOrder.get("amount");

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("amount", orderAmount);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RazorpayException e) {
            System.out.println("Exception while creating Razorpay order: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error creating Razorpay order");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
