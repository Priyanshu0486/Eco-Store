package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.dto.UserUpdateRequest;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserUpdateRequest updateRequest) {
        User user = userService.findUserProfileByJwt(jwt);
        User updatedUser = userService.updateUserProfile(user.getId(), updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
    
    @GetMapping("/address")
    public ResponseEntity<String> getUserAddress(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        String address = userService.getUserAddress(user.getId());
        return ResponseEntity.ok(address);
    }
}
