package com.bikerental.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterResponse {
	private Integer userId;
	private String email;
	private String firstName;
	private String lastName;
	private String phoneNumber;
	private String message;

	/*
	 * public String getMessage() { return message; }
	 * 
	 * public void setMessage(String message) { this.message = message; }
	 */

}
