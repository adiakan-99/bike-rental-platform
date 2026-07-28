package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(
            @Valid @RequestBody CustomerRequestDTO request,
            Authentication authentication) {
    
        JwtUser user = (JwtUser) authentication.getPrincipal();
    
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerService.createCustomer(request, user.getUserId()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable Integer userId,
            @Valid @RequestBody CustomerRequestDTO requestDTO) {

        return ResponseEntity.ok(customerService.updateCustomer(userId, requestDTO));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<CustomerResponseDTO> deleteCustomer(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(customerService.deleteCustomer(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerResponseDTO> getMyProfile(
            Authentication authentication) {

        JwtUser user = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                customerService.getCustomerById(user.getUserId())
        );
    }
}
