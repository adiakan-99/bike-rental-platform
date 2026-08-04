package com.bikerental.customer_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.customer.DTO.CustomerKycRequestDTO;
import com.bikerental.customer_service.customer.DTO.CustomerKycResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.CustomerKycService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customers/me/kyc")
@RequiredArgsConstructor
public class CustomerKycController {

	private final CustomerKycService customerKycService;

	@PostMapping
	public ResponseEntity<CustomerKycResponseDTO> submitKyc(
			@Valid @RequestBody CustomerKycRequestDTO request,
			Authentication authentication) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		CustomerKycResponseDTO response = customerKycService.createKyc(request,
				user.getUserId());

		return ResponseEntity.status(HttpStatus.CREATED).body(response);

	}

	@GetMapping("/me/kyc")
	public ResponseEntity<CustomerKycResponseDTO> getMyKyc(
			Authentication authentication) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok(customerKycService.getMyKyc(user.getUserId()));
	}

	@PutMapping
	public ResponseEntity<CustomerKycResponseDTO> updateKyc(
			@Valid @RequestBody CustomerKycRequestDTO request,
			Authentication authentication) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		return ResponseEntity
				.ok(customerKycService.updateKyc(request, user.getUserId()));
	}

}