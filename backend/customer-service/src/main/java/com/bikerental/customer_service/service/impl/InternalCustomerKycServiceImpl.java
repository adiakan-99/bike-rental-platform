package com.bikerental.customer_service.service.impl;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.customer.DTO.CustomerKycResponseDTO;
import com.bikerental.customer_service.customer.DTO.RejectKycRequestDTO;
import com.bikerental.customer_service.entity.CustomerKyc;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.repository.CustomerKycRepository;
import com.bikerental.customer_service.service.InternalCustomerKycService;
import com.bikerental.customer_service.service.exception.CustomerKycNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class InternalCustomerKycServiceImpl
		implements
			InternalCustomerKycService {

	private final CustomerKycRepository customerKycRepository;

	@Override
	public List<CustomerKycResponseDTO> getPendingKycs() {
		// TODO Auto-generated method stub
		return customerKycRepository.findByKycStatus(KycStatus.SUBMITTED)
				.stream().map(this::mapToAdminResponse).toList();
	}

	@Override
	public CustomerKycResponseDTO approveKyc(Integer customerId,
			Integer adminId) {
		// TODO Auto-generated method stub
		CustomerKyc kyc = customerKycRepository
				.findByCustomerCustomerId(customerId).orElseThrow(
						() -> new CustomerKycNotFoundException(customerId));

		kyc.setKycStatus(KycStatus.VERIFIED);

		kyc.setVerifiedBy(adminId);

		kyc.setVerifiedAt(OffsetDateTime.now());

		kyc.setUpdatedAt(OffsetDateTime.now());

		CustomerKyc saved = customerKycRepository.save(kyc);

		return mapToAdminResponse(saved);
	}

	@Override
	public CustomerKycResponseDTO rejectKyc(Integer customerId, Integer adminId,
			RejectKycRequestDTO request) {
		// TODO Auto-generated method stub
		CustomerKyc kyc = customerKycRepository
				.findByCustomerCustomerId(customerId).orElseThrow(
						() -> new CustomerKycNotFoundException(customerId));

		kyc.setKycStatus(KycStatus.REJECTED);

		kyc.setVerifiedBy(adminId);

		kyc.setVerifiedAt(OffsetDateTime.now());

		kyc.setUpdatedAt(OffsetDateTime.now());
		
		System.out.println("Reject reason"+ request.getRejectionReason());
		
		kyc.setRejectionReason(request.getRejectionReason());
		

		CustomerKyc saved = customerKycRepository.save(kyc);

		return mapToAdminResponse(saved);
	}

	private CustomerKycResponseDTO mapToAdminResponse(CustomerKyc kyc) {

		CustomerKycResponseDTO response = new CustomerKycResponseDTO();

		response.setCustomerId(kyc.getCustomer().getCustomerId());

		response.setUserId(kyc.getCustomer().getUserId());

		response.setDateOfBirth(kyc.getDateOfBirth());

		response.setIdType(kyc.getIdType());

		response.setIdNumber(kyc.getIdNumber());

		response.setIdUploadUrl(kyc.getIdUploadUrl());

		response.setDrivingLicenseNumber(kyc.getDrivingLicenseNumber());

		response.setDrivingLicenseUrl(kyc.getDrivingLicenseUrl());

		response.setLicenseValidTo(kyc.getLicenseValidTo());

		response.setKycStatus(kyc.getKycStatus());

		response.setVerifiedAt(kyc.getVerifiedAt());

		response.setCreatedAt(kyc.getCreatedAt());

		response.setUpdatedAt(kyc.getUpdatedAt());
		
		response.setRejectionReason(kyc.getRejectionReason());

		return response;
	}

}
