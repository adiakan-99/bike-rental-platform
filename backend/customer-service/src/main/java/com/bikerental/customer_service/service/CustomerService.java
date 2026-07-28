package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {

    //CustomerResponseDTO createCustomer(CustomerRequestDTO request, Integer userId);

    CustomerResponseDTO getCustomerById(Integer userId);

    CustomerResponseDTO updateCustomer(Integer userId, CustomerRequestDTO request);

    List<CustomerResponseDTO> getAllCustomers();

    CustomerResponseDTO  deleteCustomer(Integer userId);
}