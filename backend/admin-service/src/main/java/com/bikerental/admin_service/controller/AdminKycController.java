package com.bikerental.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.admin_service.admin.DTO.AdminCustomerKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.AdminKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.RejectKycRequestDTO;
import com.bikerental.admin_service.service.AdminKycService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/kyc")
@RequiredArgsConstructor
public class AdminKycController {

	private final AdminKycService adminKycService;

	@GetMapping("/pending")
	public ResponseEntity<List<AdminKycResponseDTO>> getPendingKycs() {

		return ResponseEntity.ok(adminKycService.getPendingKycs());
	}

	@PutMapping("/customers/{customerId}/approve")
	public ResponseEntity<AdminKycResponseDTO> approveKyc(
			@PathVariable Integer customerId) {

		return ResponseEntity.ok(adminKycService.approveKyc(customerId));

	}

	@PutMapping("/customers/{customerId}/reject")
	public ResponseEntity<AdminKycResponseDTO> rejectKyc(
			@PathVariable Integer customerId,
			@Valid @RequestBody RejectKycRequestDTO request) {

		return ResponseEntity
				.ok(adminKycService.rejectKyc(customerId, request));
	}
}