package com.bikerental.admin_service.service;

import java.util.List;

import com.bikerental.admin_service.admin.DTO.AdminCustomerResponseDTO;
import com.bikerental.admin_service.admin.DTO.UpdateAccountStatusResponse;

public interface AdminCustomerService {

	List<AdminCustomerResponseDTO> getAllCustomers();

	String getDownloadUrl(String objectName);

	UpdateAccountStatusResponse blockCustomer(Integer userId);

	UpdateAccountStatusResponse unblockCustomer(Integer userId);
}
