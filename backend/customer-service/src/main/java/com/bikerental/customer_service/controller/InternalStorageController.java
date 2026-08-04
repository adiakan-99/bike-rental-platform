package com.bikerental.customer_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.customer.DTO.FileDownloadResponseDTO;
import com.bikerental.customer_service.service.StorageDownloadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/storage")
@RequiredArgsConstructor
public class InternalStorageController {

	private final StorageDownloadService storageDownloadService;

	@GetMapping("/download-url")
	public FileDownloadResponseDTO getDownloadUrl(
			@RequestParam String objectName) {

		return storageDownloadService.generateDownloadUrl(objectName);

	}

}
