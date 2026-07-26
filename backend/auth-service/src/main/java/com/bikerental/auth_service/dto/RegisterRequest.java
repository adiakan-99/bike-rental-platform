package com.bikerental.auth_service.dto;

import com.bikerental.auth_service.enums.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 8, max = 20, message = "Password must be between 8 and 20 Characters")
	private String password;

	@NotBlank(message = "Phone Number is Required")
	@Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain 10 digits")
	private String phoneNumber;

	@NotBlank(message = "First Name is Required")
	@Size(min = 3, max = 100, message = "First Name must be between 3 and 100 Characters")
	private String firstName;

	@NotBlank(message = "Last Name is Required")
	@Size(min = 3, max = 100, message = "Last Name must be between 3 and 100 Characters")
	private String lastName;

	private Gender gender;

	private String captchaToken;

	/*
	 * public String getEmail() { return email; }
	 * 
	 * public void setEmail(String email) { this.email = email; }
	 * 
	 * public String getPassword() { return password; }
	 * 
	 * public void setPassword(String password) { this.password = password; }
	 * 
	 * public String getPhoneNumber() { return phoneNumber; }
	 * 
	 * public void setPhoneNumber(String phoneNumber) { this.phoneNumber =
	 * phoneNumber; }
	 * 
	 * public String getFirstName() { return firstName; }
	 * 
	 * public void setFirstName(String firstName) { this.firstName = firstName; }
	 * 
	 * public String getLastName() { return lastName; }
	 * 
	 * public void setLastName(String lastName) { this.lastName = lastName; }
	 * 
	 * public Gender getGender() { return gender; }
	 * 
	 * public void setGender(Gender gender) { this.gender = gender; }
	 */
}
