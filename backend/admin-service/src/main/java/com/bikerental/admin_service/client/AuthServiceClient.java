package com.bikerental.admin_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.bikerental.admin_service.admin.DTO.AdminDashboardResponseDTO;
import com.bikerental.admin_service.admin.DTO.UpdateAccountStatusRequest;
import com.bikerental.admin_service.admin.DTO.UserDashboardStatsDTO;
import com.bikerental.admin_service.admin.DTO.UserResponseDTO;
import com.bikerental.admin_service.config.FeignClientConfig;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@FeignClient(name = "auth-service", url = "${auth.service.url}", configuration = FeignClientConfig.class)
public interface AuthServiceClient {

	@GetMapping("/api/v1/internal/users/{userId}")
	UserResponseDTO getUser(@PathVariable Integer userId);

	@PutMapping("/api/v1/internal/users/{id}/status")
	void UpdateAccountStatus(@PathVariable Integer id,
			@RequestBody UpdateAccountStatusRequest request);
	
	@GetMapping("/api/v1/internal/users/dashboard/stats")
	UserDashboardStatsDTO getDashboardStats();	

}
