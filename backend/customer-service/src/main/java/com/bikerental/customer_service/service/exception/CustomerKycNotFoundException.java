package com.bikerental.customer_service.service.exception;

public class CustomerKycNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5442067774876414002L;

	public CustomerKycNotFoundException(Integer customerId) {
		super("Customer not found for Customer Id" + customerId);
	}

}
