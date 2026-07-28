package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.UserKyc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserKycRepository extends JpaRepository<UserKyc, Integer> {
    boolean existsById(Integer userId);
}