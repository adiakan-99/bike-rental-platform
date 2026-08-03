package com.bikerental.customer_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000",
		"http://localhost:5173"}, allowCredentials = "true")
public class CustomerController {

	private final CustomerService customerService;

	@GetMapping("/me")
	public ResponseEntity<CustomerResponseDTO> getMyProfile(
			Authentication authentication) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		return ResponseEntity
				.ok(customerService.getCustomerByUserId(user.getUserId()));
	}

	@PutMapping("/me")
	public ResponseEntity<CustomerResponseDTO> updateMyProfile(
			Authentication authentication,
			@Valid @RequestBody CustomerRequestDTO requestDTO) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok(
				customerService.updateCustomer(user.getUserId(), requestDTO));
	}

	@GetMapping("/all")
	public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {

		return ResponseEntity.ok(customerService.getAllCustomers());
	}

}