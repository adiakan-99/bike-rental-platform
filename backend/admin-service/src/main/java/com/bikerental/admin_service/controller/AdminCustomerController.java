package com.bikerental.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.admin_service.admin.DTO.AdminCustomerResponseDTO;
import com.bikerental.admin_service.admin.DTO.AdminDashboardResponseDTO;
import com.bikerental.admin_service.admin.DTO.FileDownloadResponseDTO;
import com.bikerental.admin_service.admin.DTO.UpdateAccountStatusResponse;
import com.bikerental.admin_service.service.AdminCustomerService;
import com.bikerental.admin_service.service.impl.AdminDashboardServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

	private final AdminCustomerService adminCustomerServiceImpl;

	private final AdminDashboardServiceImpl adminDashboardService;

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

	@PutMapping("/{userId}/block")
	public ResponseEntity<UpdateAccountStatusResponse> blockCustomer(
			@PathVariable Integer userId) {

		adminCustomerServiceImpl.blockCustomer(userId);

		return ResponseEntity.ok().build();
	}

	@PutMapping("/{userId}/unblock")
	public ResponseEntity<UpdateAccountStatusResponse> unBlockCustomer(
			@PathVariable Integer userId) {

		adminCustomerServiceImpl.unblockCustomer(userId);

		return ResponseEntity.ok().build();
	}

	@GetMapping("/dashboard")
	public ResponseEntity<AdminDashboardResponseDTO> getDashboard() {
		return ResponseEntity.ok(adminDashboardService.getDashboard());
	}

}
