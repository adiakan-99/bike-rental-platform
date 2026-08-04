package com.bikerental.customer_service.service;

import java.util.List;

import com.bikerental.customer_service.customer.DTO.CustomerResponseDTO;

public interface InternalCustomerService {

	List<CustomerResponseDTO> getAllCustomers();

}
