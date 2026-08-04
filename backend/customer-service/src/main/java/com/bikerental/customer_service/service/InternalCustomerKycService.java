package com.bikerental.customer_service.service;

import java.util.List;

import com.bikerental.customer_service.customer.DTO.CustomerKycResponseDTO;
import com.bikerental.customer_service.customer.DTO.CustomerResponseDTO;
import com.bikerental.customer_service.customer.DTO.RejectKycRequestDTO;

public interface InternalCustomerKycService {

	List<CustomerKycResponseDTO> getPendingKycs();

	CustomerKycResponseDTO approveKyc(Integer customerId, Integer adminId);

	CustomerKycResponseDTO rejectKyc(Integer customerId, Integer adminId,
			RejectKycRequestDTO request);

}
