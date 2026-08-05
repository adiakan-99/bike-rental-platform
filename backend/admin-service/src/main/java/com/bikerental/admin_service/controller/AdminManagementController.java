package com.bikerental.admin_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.admin_service.admin.DTO.AdminResponseDTO;
import com.bikerental.admin_service.admin.DTO.CreateAdminRequest;
import com.bikerental.admin_service.client.AuthAdminClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/admins")
@RequiredArgsConstructor
public class AdminManagementController {

	private final AuthAdminClient authAdminClient;

	@GetMapping
	public ResponseEntity<List<AdminResponseDTO>> getAdmins() {

		return ResponseEntity.ok(authAdminClient.getAdmins());

	}

	@PostMapping
	public ResponseEntity<AdminResponseDTO> createAdmin(
			@RequestBody CreateAdminRequest request) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(authAdminClient.createAdmin(request));

	}

}
