package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.CustomerRequestDto;
import com.bikerental.customer_service.dto.CustomerResponseDto;
import java.util.List;

import com.bikerental.customer_service.dto.CreateCustomerRequest;
import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;

public interface CustomerService {

    CustomerResponseDto createCustomer(CustomerRequestDto request,
                                       Integer userId);
    CustomerResponseDTO createCustomer(CustomerRequestDTO request, Integer userId);
    void createCustomer(CreateCustomerRequest request);

//    CustomerResponseDTO getCustomerById(CustomerRequestDTO request, Integer userId);
    CustomerResponseDto getCustomerById(Integer userId);

    List<CustomerResponseDto> getAllCustomers();

    CustomerResponseDto updateCustomer(Integer userId,
                                       CustomerRequestDto request);

    CustomerResponseDTO  deleteCustomer(Integer userId);


	CustomerResponseDTO getCustomerById(Integer customerId);

	CustomerResponseDTO getCustomerByUserId(Integer userId);
    CustomerResponseDto deleteCustomer(Integer userId);
}