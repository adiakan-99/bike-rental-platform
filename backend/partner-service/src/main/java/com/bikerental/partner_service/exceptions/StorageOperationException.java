package com.bikerental.partner_service.exceptions;

public class StorageOperationException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = -7590433346011335257L;

	public StorageOperationException(String message) {
        super(message);
    }
}
