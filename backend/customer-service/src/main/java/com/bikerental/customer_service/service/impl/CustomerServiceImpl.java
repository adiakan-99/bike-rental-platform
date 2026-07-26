package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.User;
import com.bikerental.customer_service.exception.CustomerAlreadyExistsException;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.exception.UserNotFoundException;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.repository.UserRepository;
import com.bikerental.customer_service.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    @Override
    public CustomerResponseDTO createCustomer(CustomerRequestDTO request, Integer userId) {
        if (customerRepository.findByUserId(userId).isPresent()) {
            throw new CustomerAlreadyExistsException(userId);
        }
        User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));

        Customer customer = new Customer();

        customer.setUserId(userId);
        mapRequestToCustomer(customer, request);

        customer.setJoiningDate(OffsetDateTime.now());
        customer.setUpdatedAt(OffsetDateTime.now());
        customer.setAccountStatus("ACTIVE");

        Customer savedCustomer = customerRepository.save(customer);

        return mapToResponse(savedCustomer, user);
    }

    @Override
    public CustomerResponseDTO getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        User user = userRepository.findById(customer.getUserId())
                .orElseThrow(() -> new UserNotFoundException(customer.getUserId()));

        return mapToResponse(customer, user);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return List.of();
    }

    @Override
    public CustomerResponseDTO updateCustomer(Integer id, CustomerRequestDTO request) {
        return null;
    }

    @Override
    public void deleteCustomer(Integer id) {

    }

    private CustomerResponseDTO mapToResponse(Customer customer, User user) {

        CustomerResponseDTO response = new CustomerResponseDTO();

        response.setCustomerId(customer.getId());
        response.setUserId(customer.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAddressLine1(customer.getAddressLine1());
        response.setCity(customer.getCity());
        response.setState(customer.getState());
        response.setPincode(customer.getPincode());
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
