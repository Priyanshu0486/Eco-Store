package com.Ecostore.Backend.repository;

import com.Ecostore.Backend.model.DiscountCoupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscountCouponRepository extends JpaRepository<DiscountCoupon, Long> {

    Optional<DiscountCoupon> findByCode(String code);
}
