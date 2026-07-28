package com.bikerental.customer_service.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Integer customerId) {
        super("Customer not found with id: " + customerId);
    }
}