package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.CustomerKyc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserKycRepository extends JpaRepository<CustomerKyc, Integer> {
    boolean existsById(Integer userId);
}