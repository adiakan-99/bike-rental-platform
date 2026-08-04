package com.bikerental.admin_service.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.admin_service.admin.DTO.AdminCustomerDTO;
import com.bikerental.admin_service.admin.DTO.AdminCustomerResponseDTO;
import com.bikerental.admin_service.admin.DTO.FileDownloadResponseDTO;
import com.bikerental.admin_service.admin.DTO.UserResponseDTO;
import com.bikerental.admin_service.client.AuthServiceClient;
import com.bikerental.admin_service.client.CustomerServiceClient;
import com.bikerental.admin_service.client.StorageServiceClient;
import com.bikerental.admin_service.enums.AccountStatus;
import com.bikerental.admin_service.service.AdminCustomerService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCustomerServiceImpl implements AdminCustomerService {

	private final AuthServiceClient authServiceClient;

	private final CustomerServiceClient customerServiceClient;

	private final StorageServiceClient storageServiceClient;

	@Override
	public List<AdminCustomerResponseDTO> getAllCustomers() {
		// TODO Auto-generated method stub

		List<AdminCustomerDTO> customers = customerServiceClient
				.getAllCustomers();

		return customers.stream().map(this::mapResponse).toList();
	}

	private AdminCustomerResponseDTO mapResponse(AdminCustomerDTO customer) {

		AdminCustomerResponseDTO response = new AdminCustomerResponseDTO();

		// Customer service data
		response.setCustomerId(customer.getCustomerId());
		response.setUserId(customer.getUserId());

		response.setAddressLine1(customer.getAddressLine1());
		response.setAddressLine2(customer.getAddressLine2());
		response.setCity(customer.getCity());
		response.setState(customer.getState());
		response.setPincode(customer.getPincode());
		response.setEmergencyContact(customer.getEmergencyContact());
		response.setReferralCode(customer.getReferralCode());

		response.setCreatedAt(customer.getCreatedAt());
		response.setUpdatedAt(customer.getUpdatedAt());

		// Auth service data
		try {

			UserResponseDTO user = authServiceClient
					.getUser(customer.getUserId());

			response.setFirstName(user.getFirstName());
			response.setLastName(user.getLastName());
			response.setEmail(user.getEmail());
			response.setPhoneNumber(user.getPhoneNumber());
			response.setAccountStatus(user.getAccountStatus());

		} catch (Exception e) {

			// Data inconsistency protection
			response.setFirstName("Unknown");
			response.setLastName("User");
			response.setEmail("N/A");
			response.setPhoneNumber("N/A");
			response.setAccountStatus(AccountStatus.INACTIVE);
		}

		return response;
	}

	@Override
	public String getDownloadUrl(String objectName) {
		// TODO Auto-generated method stub
		 
		System.out.println("OBJECT Name in admin:" + objectName);
		
		return storageServiceClient.getDownloadUrl(objectName).getDownloadUrl();
	}

}
