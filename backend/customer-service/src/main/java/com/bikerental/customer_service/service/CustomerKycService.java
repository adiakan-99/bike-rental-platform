package com.bikerental.customer_service.service;
import com.bikerental.customer_service.dto.CustomerKycRequestDTO;
import com.bikerental.customer_service.dto.CustomerKycResponseDTO;

public interface CustomerKycService {

	CustomerKycResponseDTO createKyc(CustomerKycRequestDTO request,
			Integer userId);

	CustomerKycResponseDTO getMyKyc(Integer userId);

	CustomerKycResponseDTO updateKyc(CustomerKycRequestDTO request,
			Integer userId);
}