package com.bikerental.customer_service.service.impl;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.exception.CustomerAlreadyExistsException;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.service.CustomerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

	private final CustomerRepository customerRepository;

	@Override
	public CustomerResponseDTO createCustomer(CustomerRequestDTO request,
			Integer userId) {
		if (customerRepository.findByUserId(userId).isPresent()) {
			throw new CustomerAlreadyExistsException(userId);
		}

		Customer customer = new Customer();
		customer.setUserId(userId);
		mapRequestToCustomer(customer, request);

		customer.setJoiningDate(OffsetDateTime.now());
		customer.setUpdatedAt(OffsetDateTime.now());
		customer.setAccountStatus("ACTIVE");

		Customer savedCustomer = customerRepository.save(customer);

		return mapToResponse(savedCustomer);
	}

	@Override
	public CustomerResponseDTO getCustomerById(Integer customerId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));

		return mapToResponse(customer);
	}

	@Override
	public List<CustomerResponseDTO> getAllCustomers() {
		List<Customer> customers = customerRepository.findAll();

		return customers.stream().map(this::mapToResponse).toList();
	}

	@Override
	public CustomerResponseDTO updateCustomer(Integer customerId,
			CustomerRequestDTO request) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));

		mapRequestToCustomer(customer, request);
		customer.setUpdatedAt(OffsetDateTime.now());

		Customer updatedCustomer = customerRepository.save(customer);

		return mapToResponse(updatedCustomer);
	}

	@Override
	public CustomerResponseDTO deleteCustomer(Integer customerId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));

		CustomerResponseDTO response = mapToResponse(customer);

		customerRepository.delete(customer);

		return response;
	}

	private CustomerResponseDTO mapToResponse(Customer customer) {
		CustomerResponseDTO response = new CustomerResponseDTO();

		response.setCustomerId(customer.getId());
		response.setUserId(customer.getUserId());
		response.setAddressLine1(customer.getAddressLine1());
		response.setAddressLine2(customer.getAddressLine2());
		response.setCity(customer.getCity());
		response.setState(customer.getState());
		response.setPincode(customer.getPincode());
		response.setEmergencyContact(customer.getEmergencyContact());
		response.setReferralCode(customer.getReferralCode());
		response.setAccountStatus(customer.getAccountStatus());
		response.setJoiningDate(customer.getJoiningDate());

		return response;
	}

	private void mapRequestToCustomer(Customer customer,
			CustomerRequestDTO request) {
		customer.setAddressLine1(request.getAddressLine1());
		customer.setAddressLine2(request.getAddressLine2());
		customer.setCity(request.getCity());
		customer.setState(request.getState());
		customer.setPincode(request.getPincode());
		customer.setEmergencyContact(request.getEmergencyContact());
		customer.setReferralCode(request.getReferralCode());
	}
}