package com.bikerental.partner_service.exceptions;

public class DuplicateResourceException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = -1425682387814989374L;

	public DuplicateResourceException() {
    }

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicateResourceException(Throwable cause) {
        super(cause);
    }
}
