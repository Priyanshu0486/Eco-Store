package com.Ecostore.Backend.service;

import com.Ecostore.Backend.exception.ProductException;
import com.Ecostore.Backend.exception.UserException;
import com.Ecostore.Backend.model.Cart;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.request.AddItemRequest;
import com.Ecostore.Backend.request.RemoveItemRequest;

public interface CartService {
    public Cart createCart(User user);

    public void addCartItem(Long userId, AddItemRequest req) throws ProductException, UserException;

    public void removeItemFromCart(Long userId, RemoveItemRequest req) throws Exception;

    public void clearCart(Long userId) throws Exception;

    public void removeCartItemById(Long userId, Long cartItemId) throws Exception;

    public Cart findUserCart(Long userId) throws UserException;
}
