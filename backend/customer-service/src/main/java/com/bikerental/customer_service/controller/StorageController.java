package com.bikerental.customer_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.customer.DTO.FileDownloadResponseDTO;
import com.bikerental.customer_service.customer.DTO.UploadUrlRequestDTO;
import com.bikerental.customer_service.customer.DTO.UploadUrlResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.StorageDownloadService;
import com.bikerental.customer_service.service.StorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customers/storage")
@RequiredArgsConstructor
public class StorageController {

	private final StorageService storageService;

	private final StorageDownloadService storageDownloadService;

	@PreAuthorize("hasAnyRole('CUSTOMER','PARTNER')")
	@PostMapping("/upload-url")
	public ResponseEntity<UploadUrlResponseDTO> generateUploadUrl(
			@Valid @RequestBody UploadUrlRequestDTO request,
			Authentication authentication) {

		JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

		return ResponseEntity.ok(
				storageService.generateUploadUrl(jwtUser.getUserId(), request));
	}

	@GetMapping("/downloand-url")
	public ResponseEntity<FileDownloadResponseDTO> getDownloadUrl(
			@RequestParam String objectName) {

		return ResponseEntity
				.ok(storageDownloadService.generateDownloadUrl(objectName));
	}

}