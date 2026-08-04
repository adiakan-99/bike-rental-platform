package com.bikerental.customer_service.exception;

public class CustomerAlreadyExistsException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -7178615886392775684L;

	public CustomerAlreadyExistsException(Integer userId) {
        super("Customer already exists for user id : " + userId);
    }
}