package com.bikerental.customer_service.service.impl;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.dto.CustomerKycRequestDTO;
import com.bikerental.customer_service.dto.CustomerKycResponseDTO;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.CustomerKyc;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.exception.CustomerAlreadyExistsException;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.repository.CustomerKycRepository;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.service.CustomerKycService;
import com.bikerental.customer_service.service.exception.CustomerKycNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerKycServiceImpl implements CustomerKycService {

	private final CustomerKycRepository customerKycRepository;
	private final CustomerRepository customerRepository;

	@Override
	public CustomerKycResponseDTO createKyc(CustomerKycRequestDTO request,
			Integer userId) {
		// TODO Auto-generated method stub
		Customer customer = customerRepository.findByUserId(userId)
				.orElseThrow(() -> new CustomerNotFoundException(userId));

		if (customerKycRepository
				.existsByCustomerCustomerId(customer.getCustomerId())) {
			throw new CustomerAlreadyExistsException(userId);
		}

		CustomerKyc customerKyc = new CustomerKyc();

		customerKyc.setCustomer(customer);
		
		mapRequestToCustomerKyc(customerKyc, request);

		OffsetDateTime now = OffsetDateTime.now();

		customerKyc.setCreatedAt(now);
		customerKyc.setUpdatedAt(now);

		customerKyc.setKycStatus(KycStatus.SUBMITTED);

		CustomerKyc savedCustomerKyc = customerKycRepository.save(customerKyc);

		return mapToResponseDTO(savedCustomerKyc);
	}

	@Override
	public CustomerKycResponseDTO getMyKyc(Integer userId) {
		// TODO Auto-generated method stub

		Customer customer = customerRepository.findByUserId(userId)
				.orElseThrow(() -> new CustomerNotFoundException(userId));

		CustomerKyc customerKyc = customerKycRepository
				.findByCustomerCustomerId(customer.getCustomerId())
				.orElseThrow(() -> new CustomerKycNotFoundException(
						customer.getCustomerId()));
		return mapToResponseDTO(customerKyc);
	}

	@Override
	public CustomerKycResponseDTO updateKyc(CustomerKycRequestDTO request,
			Integer userId) {
		// TODO Auto-generated method stub

		Customer customer = customerRepository.findByUserId(userId)
				.orElseThrow(() -> new CustomerNotFoundException(userId));

		CustomerKyc customerKyc = customerKycRepository
				.findByCustomerCustomerId(customer.getCustomerId())
				.orElseThrow(() -> new CustomerKycNotFoundException(userId));

		mapRequestToCustomerKyc(customerKyc, request);

		customerKyc.setKycStatus(KycStatus.PENDING);

		customerKyc.setVerifiedBy(null);

		customerKyc.setVerifiedAt(null);

		customerKyc.setUpdatedAt(OffsetDateTime.now());

		CustomerKyc updateKyc = customerKycRepository.save(customerKyc);

		return mapToResponseDTO(customerKyc);

	}

	private void mapRequestToCustomerKyc(CustomerKyc customerKyc,
			CustomerKycRequestDTO request) {
		// TODO Auto-generated method stub

		customerKyc.setDateOfBirth(request.getDateOfBirth());
		customerKyc.setIdType(request.getIdType());
		customerKyc.setIdNumber(request.getIdNumber());
		customerKyc.setIdUploadUrl(request.getIdUploadUrl());
		customerKyc.setDrivingLicenseNumber(request.getDrivingLicenseNumber());
		customerKyc.setDrivingLicenseUrl(request.getDrivingLicenceUrl());
		customerKyc.setLicenseValidTo(request.getLicenseValidTo());
	}

	private CustomerKycResponseDTO mapToResponseDTO(CustomerKyc customerKyc) {

		CustomerKycResponseDTO response = new CustomerKycResponseDTO();

		response.setDateOfBirth(customerKyc.getDateOfBirth());

		response.setIdType(customerKyc.getIdType());

		response.setIdNumber(customerKyc.getIdNumber());

		response.setIdUploadUrl(customerKyc.getIdUploadUrl());

		response.setDrivingLicenseNumber(customerKyc.getDrivingLicenseNumber());

		response.setDrivingLicenceUrl(customerKyc.getDrivingLicenseUrl());

		response.setLicenseValidTo(customerKyc.getLicenseValidTo());

		response.setKycStatus(customerKyc.getKycStatus());

		response.setVerifiedAt(customerKyc.getVerifiedAt());

		response.setCreatedAt(customerKyc.getCreatedAt());

		response.setUpdatedAt(customerKyc.getUpdatedAt());

		return response;
	}

}