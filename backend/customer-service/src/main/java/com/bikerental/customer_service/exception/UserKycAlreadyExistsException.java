package com.bikerental.customer_service.exception;

public class UserKycAlreadyExistsException extends RuntimeException {

    public UserKycAlreadyExistsException(Integer userId) {
        super("KYC already submitted for user id: " + userId);
    }
}