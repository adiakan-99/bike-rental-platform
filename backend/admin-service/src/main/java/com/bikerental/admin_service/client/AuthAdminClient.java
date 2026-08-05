package com.bikerental.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.bikerental.admin_service.admin.DTO.AdminResponseDTO;
import com.bikerental.admin_service.admin.DTO.CreateAdminRequest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@FeignClient(name = "auth-service", url = "${auth.service.url}", contextId = "authAdminClient")
public interface AuthAdminClient {

	@PostMapping("/api/v1/internal/admins")
	AdminResponseDTO createAdmin(@RequestBody CreateAdminRequest request);

	@GetMapping("/api/v1/internal/admins")
	List<AdminResponseDTO> getAdmins();

}
