package com.bikerental.admin_service.service.impl;

import org.springframework.stereotype.Service;

import com.bikerental.admin_service.admin.DTO.AdminDashboardResponseDTO;
import com.bikerental.admin_service.admin.DTO.CustomerDashboardStatsDTO;
import com.bikerental.admin_service.admin.DTO.UserDashboardStatsDTO;
import com.bikerental.admin_service.client.AuthServiceClient;
import com.bikerental.admin_service.client.CustomerServiceClient;
import com.bikerental.admin_service.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

	private final AuthServiceClient authServiceClient;

	private final CustomerServiceClient customerServiceClient;

	@Override
	public AdminDashboardResponseDTO getDashboard() {

		UserDashboardStatsDTO auth = authServiceClient.getDashboardStats();

		CustomerDashboardStatsDTO cust = customerServiceClient
				.getDashboardStats();

		AdminDashboardResponseDTO response = new AdminDashboardResponseDTO();

		response.setTotalUsers(auth.getTotalUsers());

		response.setBlockedUsers(auth.getBlockedUsers());

		response.setTotalCustomers(cust.getTotalCustomers());

		response.setPendingKyc(cust.getPendingKyc());

		response.setVerifiedKyc(cust.getVerifiedKyc());

		response.setRejectedKyc(cust.getRejectedKyc());

		return response;
	}

}
