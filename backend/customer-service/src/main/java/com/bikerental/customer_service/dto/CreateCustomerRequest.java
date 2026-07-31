package com.bikerental.customer_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCustomerRequest {

	@NotNull
	private Integer userId;
}
