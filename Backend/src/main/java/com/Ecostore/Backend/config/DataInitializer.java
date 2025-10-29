package com.Ecostore.Backend.config;

import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.model.Role;
import com.Ecostore.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create a default admin user if one doesn't exist
        if (!userRepository.existsByEmail("admin@ecostore.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@ecostore.com");
            admin.setPassword(passwordEncoder.encode("root"));
            admin.setPhoneNumber("1234567890"); // Default phone
            admin.setDateOfBirth(LocalDate.of(1990, 1, 1)); // Default DOB
            admin.setRole(Role.ROLE_ADMIN);

            userRepository.save(admin);
            System.out.println("Created default admin user.");
        }
        if (!userRepository.existsByEmail("user@ecostore.com")) {
            User demoUser = new User();
            demoUser.setUsername("demoUser");
            demoUser.setEmail("user@ecostore.com");
            demoUser.setPassword(passwordEncoder.encode("user@123"));
            demoUser.setPhoneNumber("1234567890"); // Default phone
            demoUser.setDateOfBirth(LocalDate.of(1990, 1, 1)); // Default DOB
            demoUser.setRole(Role.ROLE_USER);

            userRepository.save(demoUser);
            System.out.println("Created demo user.");
        }
    }
}
