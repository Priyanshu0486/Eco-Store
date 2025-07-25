package com.Ecostore.Backend.service;

import com.Ecostore.Backend.exception.ProductException;
import com.Ecostore.Backend.exception.UserException;
import com.Ecostore.Backend.model.Cart;
import com.Ecostore.Backend.model.CartItem;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.repository.CartItemRepository;
import com.Ecostore.Backend.repository.CartRepository;
import com.Ecostore.Backend.exception.CartItemException;
import com.Ecostore.Backend.repository.ProductRepository;
import com.Ecostore.Backend.request.AddItemRequest;
import com.Ecostore.Backend.request.RemoveItemRequest;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public void addCartItem(Long userId, AddItemRequest req) throws ProductException, UserException{
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            User user = userService.findUserById(userId);
            cart = createCart(user);
        }
        Product product = productRepository.findById(req.getProductId()).orElseThrow(() -> new ProductException("Product not found"));

        CartItem isExist = cartItemRepository.isCartItemExist(cart, product, userId);

        if (isExist == null) {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCart(cart);
            cartItem.setQuantity(req.getQuantity());
            cartItem.setUserId(userId);

            cart.getCartItems().add(cartItem);
            cartRepository.save(cart);
        } else {
            isExist.setQuantity(isExist.getQuantity() + req.getQuantity());
            cartItemRepository.save(isExist);
        }


    }

    @Override
    public void clearCart(Long userId) throws Exception {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new UserException("Cart not found for user " + userId);
        }
        if (!cart.getCartItems().isEmpty()) {
            cart.getCartItems().clear();
            cartRepository.save(cart);
        }
    }

    @Override
    public void removeItemFromCart(Long userId, RemoveItemRequest req) throws Exception {
        Cart cart = cartRepository.findByUserId(userId);
        Product product = productRepository.findById(req.getProductId()).orElseThrow(() -> new ProductException("Product not found"));

        CartItem cartItem = cartItemRepository.isCartItemExist(cart, product, userId);

        if (cartItem == null) {
            throw new Exception("Cart Item not found");
        }

        int newQuantity = cartItem.getQuantity() - req.getQuantity();

        if (newQuantity <= 0) {
            cartItemRepository.deleteById(cartItem.getId());
        } else {
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    public Cart findUserCart(Long userId) throws UserException {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new UserException("Cart not found for user " + userId);
        }
        return cart;
    }
}
