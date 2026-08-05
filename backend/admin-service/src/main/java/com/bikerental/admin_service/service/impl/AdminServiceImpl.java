package com.bikerental.admin_service.service.impl;

import org.springframework.stereotype.Service;

import com.bikerental.admin_service.admin.DTO.AddRoleRequest;
import com.bikerental.admin_service.client.AuthServiceClient;
import com.bikerental.admin_service.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final AuthServiceClient authServiceClient;

	@Override
	public void promoteAdmin(Integer userId) {
		// TODO Auto-generated method stub

		AddRoleRequest request = new AddRoleRequest();

		request.setRole("ADMIN");

		authServiceClient.addRole(userId, request);

	}

	@Override
	public void demoteAdmin(Integer userId) {
		// TODO Auto-generated method stub

		authServiceClient.removeRole(userId, "ADMIN");

	}

}
