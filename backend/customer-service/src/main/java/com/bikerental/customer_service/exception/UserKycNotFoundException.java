package com.bikerental.customer_service.exception;

public class UserKycNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 6569653102254947271L;

	public UserKycNotFoundException(Integer userId) {
        super("KYC not found for user id: " + userId);
    }
}