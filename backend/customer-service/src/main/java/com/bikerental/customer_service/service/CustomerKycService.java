package com.bikerental.customer_service.service;
import java.util.List;

import com.bikerental.customer_service.customer.DTO.CustomerKycRequestDTO;
import com.bikerental.customer_service.customer.DTO.CustomerKycResponseDTO;
import com.bikerental.customer_service.customer.DTO.RejectKycRequestDTO;

public interface CustomerKycService {

	CustomerKycResponseDTO createKyc(CustomerKycRequestDTO request,
			Integer customerId);

	CustomerKycResponseDTO getMyKyc(Integer customerId);

	CustomerKycResponseDTO updateKyc(CustomerKycRequestDTO request,
			Integer customerId);

}