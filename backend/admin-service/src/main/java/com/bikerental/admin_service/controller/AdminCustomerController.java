package com.bikerental.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.admin_service.admin.DTO.AdminCustomerResponseDTO;
import com.bikerental.admin_service.admin.DTO.FileDownloadResponseDTO;
import com.bikerental.admin_service.service.AdminCustomerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

	private final AdminCustomerService adminCustomerServiceImpl;

	@GetMapping
	public ResponseEntity<List<AdminCustomerResponseDTO>> getAllCustomers() {

		return ResponseEntity.ok(adminCustomerServiceImpl.getAllCustomers());
	}

	@GetMapping("storage/download-url")
	public ResponseEntity<FileDownloadResponseDTO> getDownloadUrl(
			@RequestParam String objectName) {

		String url = adminCustomerServiceImpl.getDownloadUrl(objectName);

		return ResponseEntity.ok(new FileDownloadResponseDTO(url));

	}

}
