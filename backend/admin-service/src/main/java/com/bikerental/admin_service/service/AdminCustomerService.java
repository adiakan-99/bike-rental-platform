package com.bikerental.admin_service.service;

import java.util.List;

import com.bikerental.admin_service.admin.DTO.AdminCustomerResponseDTO;

public interface AdminCustomerService {

	List<AdminCustomerResponseDTO> getAllCustomers();

	String getDownloadUrl(String objectName);
}
