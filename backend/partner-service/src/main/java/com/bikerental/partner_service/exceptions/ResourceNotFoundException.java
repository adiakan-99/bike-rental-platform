package com.bikerental.partner_service.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = -8082619340541607875L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}
