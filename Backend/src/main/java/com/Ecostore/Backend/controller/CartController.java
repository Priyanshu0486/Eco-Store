package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.exception.CartItemException;
import com.Ecostore.Backend.exception.ProductException;
import com.Ecostore.Backend.exception.UserException;
import com.Ecostore.Backend.model.Cart;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.request.AddItemRequest;
import com.Ecostore.Backend.request.RemoveItemRequest;
import com.Ecostore.Backend.response.ApiResponse;
import com.Ecostore.Backend.service.CartService;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Cart cart = cartService.findUserCart(user.getId());
        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<ApiResponse> addCartItem(@RequestHeader("Authorization") String jwt, @RequestBody AddItemRequest req) throws UserException, ProductException, CartItemException {
        User user = userService.findUserProfileByJwt(jwt);
        cartService.addCartItem(user.getId(), req);
        return new ResponseEntity<>(new ApiResponse(true, "Item added to cart"), HttpStatus.OK);
    }

    @PutMapping("/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(@RequestHeader("Authorization") String jwt, @RequestBody RemoveItemRequest req) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        cartService.removeItemFromCart(user.getId(), req);
        return new ResponseEntity<>(new ApiResponse(true, "Item removed successfully"), HttpStatus.OK);
    }
}
