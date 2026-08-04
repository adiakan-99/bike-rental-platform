package com.bikerental.customer_service.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.customer.DTO.CustomerResponseDTO;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.service.InternalCustomerService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InternalCustomerServiceImpl implements InternalCustomerService {

	private final CustomerRepository customerRepository;

	@Override
	public List<CustomerResponseDTO> getAllCustomers() {
		// TODO Auto-generated method stub

		List<Customer> customers = customerRepository.findAll();

		return customers.stream().map(this::mapToResponse).toList();
	}

	private CustomerResponseDTO mapToResponse(Customer customer) {

		CustomerResponseDTO response = new CustomerResponseDTO();

		response.setAddressLine1(customer.getAddressLine1());

		response.setAddressLine2(customer.getAddressLine2());

		response.setCity(customer.getCity());

		response.setCreatedAt(customer.getCreatedAt());

		response.setCustomerId(customer.getCustomerId());

		response.setEmergencyContact(customer.getEmergencyContact());

		response.setPincode(customer.getPincode());

		response.setReferralCode(customer.getReferralCode());

		response.setState(customer.getState());

		response.setUpdatedAt(customer.getUpdatedAt());

		response.setUserId(customer.getUserId());

		return response;

	}

}
