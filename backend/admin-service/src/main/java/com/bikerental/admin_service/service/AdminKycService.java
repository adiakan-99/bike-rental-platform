package com.bikerental.admin_service.service;

import java.util.List;

import com.bikerental.admin_service.admin.DTO.AdminCustomerKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.AdminKycResponseDTO;
import com.bikerental.admin_service.admin.DTO.RejectKycRequestDTO;

public interface AdminKycService {

	public List<AdminKycResponseDTO> getPendingKycs();

	public AdminKycResponseDTO approveKyc(Integer customerId);

	public AdminKycResponseDTO rejectKyc(Integer customerId,
			RejectKycRequestDTO request);
}
