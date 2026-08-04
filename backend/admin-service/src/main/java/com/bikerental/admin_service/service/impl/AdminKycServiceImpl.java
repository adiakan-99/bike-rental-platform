package com.bikerental.admin_service.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bikerental.admin_service.admin.DTO.AdminCustomerKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.AdminKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.RejectKycRequestDTO;
import com.bikerental.admin_service.admin.DTO.UserResponseDTO;
import com.bikerental.admin_service.client.AuthServiceClient;
import com.bikerental.admin_service.client.CustomerServiceClient;
import com.bikerental.admin_service.service.AdminKycService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminKycServiceImpl implements AdminKycService {

	private final CustomerServiceClient customerServiceClient;

	private final AuthServiceClient authServiceClient;

	@Override
	public List<AdminKycResponseDTO> getPendingKycs() {
		// TODO Auto-generated method stub
		List<AdminCustomerKycResponseDTO> kycs = customerServiceClient
				.getPendingKycs();

		return kycs.stream().map(this::buildAdminResponse).toList();
	}

	@Override
	public AdminKycResponseDTO approveKyc(Integer customerId) {
		// TODO Auto-generated method stub

		AdminCustomerKycResponseDTO kyc = customerServiceClient
				.approveKyc(customerId);

		return buildAdminResponse(kyc);
	}

	@Override
	public AdminKycResponseDTO rejectKyc(Integer customerId,
			RejectKycRequestDTO request) {
		// TODO Auto-generated method stub
		System.out.println("rejextion reason " + request.getRejectionReason());

		AdminCustomerKycResponseDTO kyc = customerServiceClient
				.rejectKyc(customerId, request);

		return buildAdminResponse(kyc);
	}

	private AdminKycResponseDTO buildAdminResponse(
			AdminCustomerKycResponseDTO kyc) {

		UserResponseDTO user = authServiceClient.getUser(kyc.getUserId());

		AdminKycResponseDTO response = new AdminKycResponseDTO();

		// Auth service data
		response.setUserId(kyc.getUserId());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());

		response.setVerifiedBy(kyc.getVerifiedBy());

		// Customer service KYC data
		response.setCustomerId(kyc.getCustomerId());
		response.setDateOfBirth(kyc.getDateOfBirth());
		response.setIdType(kyc.getIdType());
		response.setIdNumber(kyc.getIdNumber());
		response.setIdUploadUrl(kyc.getIdUploadUrl());
		response.setDrivingLicenseNumber(kyc.getDrivingLicenseNumber());
		response.setDrivingLicenseUrl(kyc.getDrivingLicenseUrl());
		response.setLicenseValidTo(kyc.getLicenseValidTo());
		response.setKycStatus(kyc.getKycStatus());
		response.setVerifiedAt(kyc.getVerifiedAt());
		response.setRejectionReason(kyc.getRejectionReason());

		return response;
	}

}
