package com.bikerental.auth_service.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender mailSender;

	public void sendOtpEmail(String email, String otp) {

		System.out.println("=== EmailService called ===");
		System.out.println("Recipient: " + email);
		
		SimpleMailMessage message = new SimpleMailMessage();

		message.setTo(email);
		message.setSubject("Bike Rental Password Reset OTP");

		message.setText("Your password reset OTP is: " + otp
				+ "\n\nOTP is valid for 10 minutes.");
		
		System.out.println("Sending email..."+ message);

		mailSender.send(message);
		
		System.out.println("Sending email...");

	}

}
