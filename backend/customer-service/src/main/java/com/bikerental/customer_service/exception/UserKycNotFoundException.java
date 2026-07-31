package com.bikerental.customer_service.exception;

public class UserKycNotFoundException extends RuntimeException {

    public UserKycNotFoundException(Integer userId) {
        super("KYC not found for user id: " + userId);
    }
}