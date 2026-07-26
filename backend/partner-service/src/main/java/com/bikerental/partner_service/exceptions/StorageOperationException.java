package com.bikerental.partner_service.exceptions;

public class StorageOperationException extends RuntimeException {
    public StorageOperationException(String message) {
        super(message);
    }
}
