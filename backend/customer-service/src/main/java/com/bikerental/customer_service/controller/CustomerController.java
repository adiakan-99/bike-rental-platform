package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.CustomerRequestDto;
import com.bikerental.customer_service.dto.CustomerResponseDto;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.customer_service.dto.CustomerRequestDTO;
import com.bikerental.customer_service.dto.CustomerResponseDTO;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.CustomerService;
import jakarta.annotation.PostConstruct;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000",
		"http://localhost:5173"}, allowCredentials = "true")
public class CustomerController {

	private final CustomerService customerService;

    private final CustomerService customerService;

	@GetMapping("/me")
	public ResponseEntity<CustomerResponseDTO> getMyProfile(
			Authentication authentication) {
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
    @PostMapping
    public ResponseEntity<CustomerResponseDto> createCustomer(
            @Valid @RequestBody CustomerRequestDto request,
            Authentication authentication) {

        JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

        CustomerResponseDto response =
                customerService.createCustomer(request, jwtUser.getUserId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerResponseDto> getMyProfile(
            Authentication authentication) {

        JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                customerService.getCustomerById(jwtUser.getUserId())
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CustomerResponseDto> getCustomerById(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                customerService.getCustomerById(userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponseDto>> getAllCustomers() {

        return ResponseEntity.ok(
                customerService.getAllCustomers()
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<CustomerResponseDto> updateCustomer(
            @PathVariable Integer userId,
            @Valid @RequestBody CustomerRequestDto request) {

        return ResponseEntity.ok(
                customerService.updateCustomer(userId, request)
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<CustomerResponseDto> deleteCustomer(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(customerService.deleteCustomer(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerResponseDTO> getMyProfile(
            Authentication authentication) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

		return ResponseEntity
				.ok(customerService.getCustomerByUserId(user.getUserId()));
	}

	@PutMapping("/me")
	public ResponseEntity<CustomerResponseDTO> updateMyProfile(
			Authentication authentication,
			@Valid @RequestBody CustomerRequestDTO requestDTO) {

		JwtUser user = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                customerService.deleteCustomer(userId)
        );
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("TEST API HIT");
        return "Customer Controller Working";
    }
		return ResponseEntity.ok(
				customerService.updateCustomer(user.getUserId(), requestDTO));
	}

	@GetMapping("/all")
	public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {

		return ResponseEntity.ok(customerService.getAllCustomers());
	}

}