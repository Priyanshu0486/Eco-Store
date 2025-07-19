package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.ProductRequest;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    // Add methods to handle product-related operations, such as fetching products, adding new products, etc.
    public List<Product> getAllProducts(String category) {
        if (category != null && !category.isEmpty()) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findAll();
    }

    // --- Add the following new methods ---

    public Product createProduct(ProductRequest productRequest) {
        Product product = new Product();
        // Map fields from DTO to the new Product entity
        product.setName(productRequest.getName());
        product.setCategory(productRequest.getCategory());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCarbonSaved(productRequest.getCarbonSaved());
        product.setWaterReduced(productRequest.getWaterReduced());
        product.setPlasticItemsAvoided(productRequest.getPlasticItemsAvoided());
        product.setQuantity(productRequest.getQuantity());
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields from the DTO
        product.setName(productRequest.getName());
        product.setCategory(productRequest.getCategory());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCarbonSaved(productRequest.getCarbonSaved());
        product.setWaterReduced(productRequest.getWaterReduced());
        product.setPlasticItemsAvoided(productRequest.getPlasticItemsAvoided());
        product.setQuantity(productRequest.getQuantity());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).get();
    }
}
