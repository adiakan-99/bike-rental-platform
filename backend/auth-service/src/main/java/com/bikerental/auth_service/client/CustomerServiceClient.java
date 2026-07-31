package com.bikerental.auth_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bikerental.auth_service.dto.CreateCustomerRequest;

@FeignClient(name = "customer-service", url = "${customer.service.url}")
public interface CustomerServiceClient {

	@PostMapping("/api/v1/internal/customers")
	ResponseEntity<String> createCustomer(@RequestBody CreateCustomerRequest request);

}
