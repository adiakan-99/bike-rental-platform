package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.CustomerRequestDto;
import com.bikerental.customer_service.dto.CustomerResponseDto;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.dto.CreateCustomerRequest;
import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.User;
import com.bikerental.customer_service.enums.AccountStatus;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.exception.CustomerAlreadyExistsException;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.exception.UserNotFoundException;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.service.CustomerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

	private final CustomerRepository customerRepository;

	@Override
	public void createCustomer(CreateCustomerRequest request) {

		if (customerRepository.findByUserId(request.getUserId()).isPresent()) {
			throw new RuntimeException("Customer Profile Already Exists");
		}
    private final UserRepository userRepository;

    @Override
    public CustomerResponseDto createCustomer(CustomerRequestDto request,
                                              Integer userId) {

        if (customerRepository.existsByUserId(userId)) {
            throw new CustomerAlreadyExistsException(userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Customer customer = new Customer();

        customer.setUserId(userId);

        mapRequestToCustomer(customer, request);

        customer.setJoiningDate(OffsetDateTime.now());
        customer.setUpdatedAt(OffsetDateTime.now());

        customer.setAccountStatus(AccountStatus.ACTIVE);
        customer.setKycStatus(KycStatus.NOT_SUBMITTED);

        Customer savedCustomer = customerRepository.save(customer);

        return mapToResponse(savedCustomer, user);
    }

    @Override
    public CustomerResponseDto getCustomerById(Integer userId) {

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return mapToResponse(customer, user);
    }

    @Override
    public List<CustomerResponseDto> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(customer -> {

                    User user = userRepository.findById(customer.getUserId())
                            .orElseThrow(() ->
                                    new UserNotFoundException(customer.getUserId()));

                    return mapToResponse(customer, user);

                }).toList();
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
    @Override
    public CustomerResponseDto updateCustomer(Integer userId,
                                              CustomerRequestDto request) {

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

		mapRequestToCustomer(customer, request);

		customer.setUpdatedAt(OffsetDateTime.now());
        mapRequestToCustomer(customer, request);

        customer.setUpdatedAt(OffsetDateTime.now());

		Customer updatedCustomer = customerRepository.save(customer);
        Customer updatedCustomer = customerRepository.save(customer);

		CustomerResponseDTO customerResponseDTO = mapToDTO(updatedCustomer);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

		return customerResponseDTO;
	}
        return mapToResponse(updatedCustomer, user);
    }

	// check pending
	@Override
	public CustomerResponseDTO deleteCustomer(Integer customerId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new CustomerNotFoundException(customerId));
    @Override
    public CustomerResponseDto deleteCustomer(Integer userId) {

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        CustomerResponseDto response = mapToResponse(customer, user);
		CustomerResponseDTO response = mapToDTO(customer);

		customerRepository.delete(customer);

		return response;
	}
        return response;
    }
    private void mapRequestToCustomer(Customer customer,
                                      CustomerRequestDto request) {

	private CustomerResponseDTO mapToDTO(Customer customer) {
		CustomerResponseDTO response = new CustomerResponseDTO();
        customer.setAddressLine1(request.getAddressLine1());
        customer.setAddressLine2(request.getAddressLine2());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPincode(request.getPincode());
        customer.setEmergencyContact(request.getEmergencyContact());
        customer.setReferralCode(request.getReferralCode());
    }

    private CustomerResponseDto mapToResponse(Customer customer,
                                              User user) {

		response.setCustomerId(customer.getId());
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
        CustomerResponseDto response = new CustomerResponseDto();

        response.setCustomerId(customer.getCustomerId());
        response.setUserId(customer.getUserId());

        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());

        response.setAddressLine1(customer.getAddressLine1());
        response.setAddressLine2(customer.getAddressLine2());
        response.setCity(customer.getCity());
        response.setState(customer.getState());
        response.setPincode(customer.getPincode());

        response.setJoiningDate(customer.getJoiningDate());

        response.setAccountStatus(customer.getAccountStatus());
        response.setKycStatus(customer.getKycStatus());

        return response;
    }
		return response;
	}

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
				.orElseThrow(() -> new UserNotFoundException(userId));

		return mapToDTO(customer);
	}
}