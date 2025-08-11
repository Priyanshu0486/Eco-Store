package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.LoginRequest;
import com.Ecostore.Backend.dto.SignUpRequest;
import com.Ecostore.Backend.dto.UserUpdateRequest;
import com.Ecostore.Backend.model.Role;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.repository.UserRepository;
import com.Ecostore.Backend.repository.OrderRepository;
import com.Ecostore.Backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private OrderRepository orderRepository;

    public User createUser(SignUpRequest signUpRequest) {
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setDateOfBirth(signUpRequest.getDateOfBirth());
        user.setRole(Role.ROLE_USER); // Default role

        return userRepository.save(user);
    }

    public User authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    public User findUserProfileByJwt(String jwt) {
        String email = jwtUtils.getUserNameFromJwtToken(jwt.substring(7));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User updateUserProfile(Long userId, UserUpdateRequest updateRequest) {
        User user = findUserById(userId);

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().trim().isEmpty()) {
            // Check if the new username is different and if it's already taken
            if (!user.getUsername().equals(updateRequest.getUsername()) && userRepository.existsByUsername(updateRequest.getUsername())) {
                throw new RuntimeException("Error: Username is already taken!");
            }
            user.setUsername(updateRequest.getUsername());
        }

        if (updateRequest.getPhoneNumber() != null && !updateRequest.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }

        return userRepository.save(user);
    }
    
    public String getUserAddress(Long userId) {
        // Find the most recent order for the user
        Optional<Order> latestOrder = orderRepository.findTopByUserIdOrderByOrderDateDesc(userId);
        
        if (latestOrder.isPresent() && latestOrder.get().getShippingAddress() != null) {
            return latestOrder.get().getShippingAddress();
        }
        
        return "No address found"; // Default message if no orders or address
    }
}
