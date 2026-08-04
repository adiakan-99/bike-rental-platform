package com.bikerental.customer_service.service.impl;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.customer.DTO.CreateCustomerRequest;
import com.bikerental.customer_service.customer.DTO.CustomerRequestDTO;
import com.bikerental.customer_service.customer.DTO.CustomerResponseDTO;
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
	public void createCustomer(CreateCustomerRequest request) {

		if (customerRepository.existsByUserId(request.getUserId())) {
			throw new CustomerAlreadyExistsException(request.getUserId());
		}

		Customer customer = new Customer();

		customer.setUserId(request.getUserId());

		OffsetDateTime now = OffsetDateTime.now();

		customer.setCreatedAt(now);
		customer.setUpdatedAt(now);

		customerRepository.save(customer);

	}

	@Override
	public CustomerResponseDTO getCustomerById(Integer customerId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));

		return mapToDTO(customer);
	}

	@Override
	public List<CustomerResponseDTO> getAllCustomers() {
		List<Customer> customers = customerRepository.findAll();

		return customers.stream().map(this::mapToDTO).toList();
	}

	@Override
	public CustomerResponseDTO updateCustomer(Integer userId,
			CustomerRequestDTO request) {
		Customer customer = customerRepository.findByUserId(userId)
				.orElseThrow(() -> new CustomerNotFoundException(userId));

		mapRequestToCustomer(customer, request);

		customer.setUpdatedAt(OffsetDateTime.now());

		Customer updatedCustomer = customerRepository.save(customer);

		CustomerResponseDTO customerResponseDTO = mapToDTO(updatedCustomer);

		return customerResponseDTO;
	}

	// check pending
	@Override
	public CustomerResponseDTO deleteCustomer(Integer customerId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));

		CustomerResponseDTO response = mapToDTO(customer);

		customerRepository.delete(customer);

		return response;
	}

	private CustomerResponseDTO mapToDTO(Customer customer) {
		CustomerResponseDTO response = new CustomerResponseDTO();

		response.setCustomerId(customer.getCustomerId());
		response.setUserId(customer.getUserId());
		response.setAddressLine1(customer.getAddressLine1());
		response.setAddressLine2(customer.getAddressLine2());
		response.setCity(customer.getCity());
		response.setState(customer.getState());
		response.setPincode(customer.getPincode());
		response.setEmergencyContact(customer.getEmergencyContact());
		response.setReferralCode(customer.getReferralCode());
		response.setUpdatedAt(customer.getUpdatedAt());
		response.setCreatedAt(customer.getCreatedAt());

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

	@Override
	public CustomerResponseDTO getCustomerByUserId(Integer userId) {
		// TODO Auto-generated method stub
		Customer customer = customerRepository.findByUserId(userId)
				.orElseThrow(() -> new CustomerNotFoundException(userId));

		return mapToDTO(customer);
	}
}