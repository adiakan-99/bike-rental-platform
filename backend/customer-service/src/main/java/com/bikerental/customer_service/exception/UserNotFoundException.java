package com.bikerental.customer_service.exception;

public class UserNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -6547050133503459036L;

	public UserNotFoundException(Integer userId) {
        super("User not found with id : " + userId);
    }
}