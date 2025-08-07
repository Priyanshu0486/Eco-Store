package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.ProductRequest;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        List<Product> lastProduct = productRepository.findLastProduct();
        String newId;
        if (lastProduct.isEmpty()) {
            newId = "PI0001";
        } else {
            String lastId = lastProduct.get(0).getId();
            int lastNumber = Integer.parseInt(lastId.substring(2));
            int newNumber = lastNumber + 1;
            newId = String.format("PI%04d", newNumber);
        }

        Product product = new Product();
        product.setId(newId);
        product.setName(productRequest.getName());
        product.setBrand(productRequest.getBrand());
        product.setCategory(productRequest.getCategory());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCarbonSaved(productRequest.getCarbonSaved());
        product.setQuantity(productRequest.getQuantity());
        product.setRating(0.0);
        product.setTotalReviewCount(0);
        product.setDateAdded(LocalDate.now());

        return productRepository.save(product);
    }

    public Product updateProduct(String id, ProductRequest productRequest) {
        Product product = getProductById(id);

        // Update fields from the DTO
        product.setName(productRequest.getName());
        product.setBrand(productRequest.getBrand());
        product.setCategory(productRequest.getCategory());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCarbonSaved(productRequest.getCarbonSaved());
        product.setQuantity(productRequest.getQuantity());
        // Rating and TotalReviewCount are not editable from this form
        // Do not update dateAdded

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }
}
