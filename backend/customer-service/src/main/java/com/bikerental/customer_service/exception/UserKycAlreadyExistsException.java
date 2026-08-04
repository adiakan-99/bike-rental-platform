package com.bikerental.customer_service.exception;

public class UserKycAlreadyExistsException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 2546606625600027437L;

	public UserKycAlreadyExistsException(Integer userId) {
        super("KYC already submitted for user id : " + userId);
    }
}