package com.bikerental.customer_service.exception;

public class CustomerNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4510290241919629255L;

	public CustomerNotFoundException(Integer userId) {
		super("Customer not found for user id : " + userId);
	}
}