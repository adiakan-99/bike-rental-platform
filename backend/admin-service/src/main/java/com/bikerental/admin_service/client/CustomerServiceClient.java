package com.bikerental.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bikerental.admin_service.admin.DTO.AdminCustomerDTO;
import com.bikerental.admin_service.admin.DTO.AdminCustomerKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.RejectKycRequestDTO;
import com.bikerental.admin_service.config.FeignClientConfig;

@FeignClient(name = "customer-service", url = "${customer.service.url}", configuration = FeignClientConfig.class, contextId = "customerClient")
public interface CustomerServiceClient {

	@GetMapping("/api/v1/internal/customers/kyc/pending")
	List<AdminCustomerKycResponseDTO> getPendingKycs();

	@PutMapping("/api/v1/internal/customers/{customerId}/kyc/approve")
	AdminCustomerKycResponseDTO approveKyc(@PathVariable Integer customerId);

	@PutMapping("/api/v1/internal/customers/{customerId}/kyc/reject")
	AdminCustomerKycResponseDTO rejectKyc(@PathVariable Integer customerId,
			@RequestBody RejectKycRequestDTO request);

	@GetMapping("/api/v1/internal/customers/")
	List<AdminCustomerDTO> getAllCustomers();
	

}
