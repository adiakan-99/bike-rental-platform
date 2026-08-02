package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.UploadUrlRequestDTO;
import com.bikerental.customer_service.dto.UploadUrlResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.StorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers/storage")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class StorageController {

	private final StorageService storageService;

	@PostMapping("/upload-url")
	public ResponseEntity<UploadUrlResponseDTO> generateUploadUrl(
			@Valid @RequestBody UploadUrlRequestDTO request,
			Authentication authentication) {

		JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok(
				storageService.generateUploadUrl(jwtUser.getUserId(), request));
	}
}