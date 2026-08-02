package com.bikerental.customer_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bikerental.customer_service.entity.CustomerKyc;
import com.bikerental.customer_service.enums.KycStatus;

public interface CustomerKycRepository
		extends
			JpaRepository<CustomerKyc, Integer> {

	Optional<CustomerKyc> findByCustomerCustomerId(Integer customerId);

	boolean existsByCustomerCustomerId(Integer customerId);

	boolean existsByIdNumber(String idNumber);

	List<CustomerKyc> findByKycStatus(KycStatus kycStatus);
}