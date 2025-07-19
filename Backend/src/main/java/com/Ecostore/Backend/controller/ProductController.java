package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.dto.ProductRequest;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    // Define endpoints for product operations here
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String category) {
        return productService.getAllProducts(category);
    }
    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // We will uncomment this later for security
    public Product createProduct(@RequestBody ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // We will uncomment this later for security
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest) {
        Product updatedProduct = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // We will uncomment this later for security
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id){
        Product product = productService.getProductById(id);
        if(product != null){
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND) ;
        }

    }
}
