package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.AdminKycResponseDto;
import com.bikerental.customer_service.entity.Customer;
import com.bikerental.customer_service.entity.User;
import com.bikerental.customer_service.entity.UserKyc;
import com.bikerental.customer_service.enums.KycStatus;
import com.bikerental.customer_service.exception.CustomerNotFoundException;
import com.bikerental.customer_service.exception.UserKycNotFoundException;
import com.bikerental.customer_service.exception.UserNotFoundException;
import com.bikerental.customer_service.repository.CustomerRepository;
import com.bikerental.customer_service.repository.UserKycRepository;
import com.bikerental.customer_service.repository.UserRepository;
import com.bikerental.customer_service.service.AdminKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminKycServiceImpl implements AdminKycService {

    private final UserKycRepository userKycRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Override
    public List<AdminKycResponseDto> getPendingKycs() {

        return userKycRepository.findByKycStatus(KycStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminKycResponseDto approveKyc(Integer userId,
                                          Integer adminId) {

        UserKyc userKyc = userKycRepository.findById(userId)
                .orElseThrow(() -> new UserKycNotFoundException(userId));

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

        userKyc.setKycStatus(KycStatus.VERIFIED);
        userKyc.setVerifiedBy(adminId);
        userKyc.setVerifiedAt(OffsetDateTime.now());
        userKyc.setUpdatedAt(OffsetDateTime.now());

        customer.setKycStatus(KycStatus.VERIFIED);

        userKycRepository.save(userKyc);
        customerRepository.save(customer);

        return mapToResponse(userKyc);
    }

    @Override
    public AdminKycResponseDto rejectKyc(Integer userId,
                                         Integer adminId) {

        UserKyc userKyc = userKycRepository.findById(userId)
                .orElseThrow(() -> new UserKycNotFoundException(userId));

        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException(userId));

        userKyc.setKycStatus(KycStatus.REJECTED);
        userKyc.setVerifiedBy(adminId);
        userKyc.setVerifiedAt(OffsetDateTime.now());
        userKyc.setUpdatedAt(OffsetDateTime.now());

        customer.setKycStatus(KycStatus.REJECTED);

        userKycRepository.save(userKyc);
        customerRepository.save(customer);

        return mapToResponse(userKyc);
    }

    private AdminKycResponseDto mapToResponse(UserKyc userKyc) {

        User user = userRepository.findById(userKyc.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(userKyc.getUserId()));

        AdminKycResponseDto response = new AdminKycResponseDto();

        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());

        response.setDateOfBirth(userKyc.getDateOfBirth());
        response.setIdType(userKyc.getIdType());
        response.setIdNumber(userKyc.getIdNumber());
        response.setIdUploadUrl(userKyc.getIdUploadUrl());

        response.setDrivingLicenseNumber(userKyc.getDrivingLicenseNumber());
        response.setDrivingLicenceUrl(userKyc.getDrivingLicenceUrl());
        response.setLicenseValidTo(userKyc.getLicenseValidTo());

        response.setKycStatus(userKyc.getKycStatus());
        response.setVerifiedBy(userKyc.getVerifiedBy());
        response.setVerifiedAt(userKyc.getVerifiedAt());
        response.setCreatedAt(userKyc.getCreatedAt());

        return response;
    }
}