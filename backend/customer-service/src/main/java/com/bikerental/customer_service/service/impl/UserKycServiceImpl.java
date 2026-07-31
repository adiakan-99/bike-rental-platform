package com.bikerental.customer_service.service.impl;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.bikerental.customer_service.dto.UserKycRequestDto;
import com.bikerental.customer_service.dto.UserKycResponseDto;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.UserKyc;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.exception.UserKycAlreadyExistsException;
import com.bikerental.customer_service.exception.UserKycNotFoundException;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.CustomerKyc;
import com.bikerental.customer_service.repository.UserKycRepository;
import com.bikerental.customer_service.service.UserKycService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserKycServiceImpl implements UserKycService {

    private final UserKycRepository userKycRepository;

    private final CustomerRepository customerRepository;

    @Override
    public UserKycResponseDto createKyc(UserKycRequestDto request,
                                        Integer userId) {

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));
    public UserKycResponseDto createKyc(UserKycRequestDto request, Integer customerId) {
        Customer customer = userRepository.findById(customerId)
                .orElseThrow(()-> new RuntimeException("User Not Found"));

        if(userKycRepository.existsById(customerId)) {
            throw new RuntimeException("KYC already submitted for this user");
        if (userKycRepository.existsByUserId(userId)) {
            throw new UserKycAlreadyExistsException(userId);
        }

        UserKyc userKyc = new UserKyc();
            CustomerKyc userKyc = new CustomerKyc();

        userKyc.setUserId(userId);

        userKyc.setDateOfBirth(request.getDateOfBirth());
        userKyc.setIdType(request.getIdType());
        userKyc.setIdNumber(request.getIdNumber());
        userKyc.setIdUploadUrl(request.getIdUploadUrl());

        userKyc.setDrivingLicenseNumber(request.getDrivingLicenseNumber());
        userKyc.setDrivingLicenceUrl(request.getDrivingLicenceUrl());
        userKyc.setLicenseValidTo(request.getLicenseValidTo());

            userKyc.setKycStatus("PENDING");
            userKyc.setCreatedAt(OffsetDateTime.now());
            userKyc.setUpdatedAt(OffsetDateTime.now());

            CustomerKyc savedKyc = userKycRepository.save(userKyc);
        userKyc.setKycStatus(KycStatus.PENDING);

        userKyc.setCreatedAt(OffsetDateTime.now());
        userKyc.setUpdatedAt(OffsetDateTime.now());

        UserKyc savedKyc = userKycRepository.save(userKyc);

        // Update customer table
        customer.setKycStatus(KycStatus.PENDING);
        customerRepository.save(customer);

        return mapToResponse(savedKyc);
    }

    @Override
    public UserKycResponseDto getKyc(Integer userId) {

        UserKyc userKyc = userKycRepository.findById(userId)
                .orElseThrow(() -> new UserKycNotFoundException(userId));

        return mapToResponse(userKyc);
    }

    @Override
    public UserKycResponseDto updateKyc(UserKycRequestDto request,
                                        Integer userId) {

        UserKyc userKyc = userKycRepository.findById(userId)
                .orElseThrow(() -> new UserKycNotFoundException(userId));

        userKyc.setDateOfBirth(request.getDateOfBirth());
        userKyc.setIdType(request.getIdType());
        userKyc.setIdNumber(request.getIdNumber());
        userKyc.setIdUploadUrl(request.getIdUploadUrl());

        userKyc.setDrivingLicenseNumber(request.getDrivingLicenseNumber());
        userKyc.setDrivingLicenceUrl(request.getDrivingLicenceUrl());
        userKyc.setLicenseValidTo(request.getLicenseValidTo());

        // Reset status when customer updates KYC
        userKyc.setKycStatus(KycStatus.PENDING);
        userKyc.setVerifiedBy(null);
        userKyc.setVerifiedAt(null);
        userKyc.setUpdatedAt(OffsetDateTime.now());

        UserKyc updatedKyc = userKycRepository.save(userKyc);

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

        customer.setKycStatus(KycStatus.PENDING);
        customerRepository.save(customer);

        return mapToResponse(updatedKyc);
    }

    private UserKycResponseDto mapToResponse(UserKyc userKyc) {

        UserKycResponseDto response = new UserKycResponseDto();

        response.setUserId(userKyc.getUserId());

        response.setDateOfBirth(userKyc.getDateOfBirth());
        response.setIdType(userKyc.getIdType());
        response.setIdNumber(userKyc.getIdNumber());
        response.setIdUploadUrl(userKyc.getIdUploadUrl());

        response.setDrivingLicenseNumber(userKyc.getDrivingLicenseNumber());
        response.setDrivingLicenceUrl(userKyc.getDrivingLicenceUrl());
        response.setLicenseValidTo(userKyc.getLicenseValidTo());

        response.setKycStatus(userKyc.getKycStatus());

        response.setCreatedAt(userKyc.getCreatedAt());
        response.setUpdatedAt(userKyc.getUpdatedAt());

        return response;
    }
}