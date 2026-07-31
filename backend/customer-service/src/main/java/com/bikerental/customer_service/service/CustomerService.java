package com.bikerental.customer_service.service;

import java.util.List;

import com.bikerental.customer_service.dto.CreateCustomerRequest;
import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;

public interface CustomerService {

    void createCustomer(CreateCustomerRequest request);

//    CustomerResponseDTO getCustomerById(CustomerRequestDTO request, Integer userId);

    CustomerResponseDTO updateCustomer(Integer userId, CustomerRequestDTO request);

    List<CustomerResponseDTO> getAllCustomers();

    CustomerResponseDTO  deleteCustomer(Integer userId);


	CustomerResponseDTO getCustomerById(Integer customerId);

	CustomerResponseDTO getCustomerByUserId(Integer userId);
}