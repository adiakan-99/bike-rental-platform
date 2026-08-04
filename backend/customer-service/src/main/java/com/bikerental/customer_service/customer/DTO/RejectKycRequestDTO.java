package com.bikerental.customer_service.customer.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectKycRequestDTO {

	@NotBlank
	@Size(max = 500)
	@JsonProperty("rejectionReason")
	private String rejectionReason;

}
