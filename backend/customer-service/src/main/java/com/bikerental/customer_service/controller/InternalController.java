package com.bikerental.customer_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.dto.CreateCustomerRequest;
import com.bikerental.customer_service.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/customers")
@RequiredArgsConstructor
public class InternalController {

	private final CustomerService customerService;

	@PostMapping
	public ResponseEntity<String> createCustomer(
			@Valid @RequestBody CreateCustomerRequest request) {

		customerService.createCustomer(request);

		return ResponseEntity.ok("Customer created succesfully");
	}
}
