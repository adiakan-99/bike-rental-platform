package com.bikerental.admin_service.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.admin_service.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminUserController {

	private final AdminService adminService;

	@PutMapping("/users/{id}/promote")
	public ResponseEntity<?> promote(@PathVariable Integer id) {

		adminService.promoteAdmin(id);

		return ResponseEntity.ok(Map.of("message", "User promoted to ADMIN"));
	}

	@PutMapping("/users/{id}/demote")
	public ResponseEntity<?> demote(@PathVariable Integer id) {

		adminService.demoteAdmin(id);

		return ResponseEntity.ok(Map.of("message", "Admin role removed"));
	}

}
