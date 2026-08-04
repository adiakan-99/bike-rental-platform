package com.bikerental.customer_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.customer.DTO.CreateCustomerRequest;
import com.bikerental.customer_service.customer.DTO.CustomerKycResponseDTO;
import com.bikerental.customer_service.customer.DTO.CustomerResponseDTO;
import com.bikerental.customer_service.customer.DTO.RejectKycRequestDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.CustomerService;
import com.bikerental.customer_service.service.InternalCustomerKycService;
import com.bikerental.customer_service.service.InternalCustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/customers")
@RequiredArgsConstructor
public class InternalCustomerController {

	private final CustomerService customerService;

	private final InternalCustomerKycService internalCustomerKycService;

	private final InternalCustomerService internalCustomerService;

	@PostMapping
	public ResponseEntity<String> createCustomer(
			@Valid @RequestBody CreateCustomerRequest request) {

		customerService.createCustomer(request);

		return ResponseEntity.ok("Customer created succesfully");
	}

	@GetMapping("/kyc/pending")
	public ResponseEntity<List<CustomerKycResponseDTO>> getPendingKycs() {

		return ResponseEntity.ok(internalCustomerKycService.getPendingKycs());

	}

	@PutMapping("/{customerId}/kyc/approve")
	public ResponseEntity<CustomerKycResponseDTO> approveKyc(
			@PathVariable Integer customerId, Authentication authentication) {
		JwtUser admin = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok((internalCustomerKycService
				.approveKyc(customerId, admin.getUserId())));
	}

	@PutMapping("/{customerId}/kyc/reject")
	public ResponseEntity<CustomerKycResponseDTO> rejectKyc(
			@PathVariable Integer customerId,
			@Valid @RequestBody RejectKycRequestDTO request,
			Authentication authentication) {

		JwtUser admin = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok(internalCustomerKycService
				.rejectKyc(customerId, admin.getUserId(), request));
	}

	@GetMapping("/")
	public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {

		return ResponseEntity.ok(internalCustomerService.getAllCustomers());

	}
}
