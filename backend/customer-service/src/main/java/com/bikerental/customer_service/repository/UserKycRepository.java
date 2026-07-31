package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.UserKyc;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.entity.CustomerKyc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserKycRepository extends JpaRepository<UserKyc, Integer> {

    boolean existsByUserId(Integer userId);
public interface UserKycRepository extends JpaRepository<CustomerKyc, Integer> {
    boolean existsById(Integer userId);

    List<UserKyc> findByKycStatus(KycStatus kycStatus);
}