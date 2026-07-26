package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.UserKycRequestDto;
import com.bikerental.customer_service.dto.UserKycResponseDto;
import com.bikerental.customer_service.entity.User;
import com.bikerental.customer_service.entity.UserKyc;
import com.bikerental.customer_service.repository.UserKycRepository;
import com.bikerental.customer_service.repository.UserRepository;
import com.bikerental.customer_service.service.UserKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class UserKycServiceImpl implements UserKycService {

    private final UserKycRepository userKycRepository;
    private final UserRepository userRepository;

    @Override
    public UserKycResponseDto createKyc(UserKycRequestDto request, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User Not Found"));

        if(userKycRepository.existsById(userId)) {
            throw new RuntimeException("KYC already submitted for this user");
        }
            UserKyc userKyc = new UserKyc();

            userKyc.setUser(user);
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

            UserKyc savedKyc = userKycRepository.save(userKyc);

            UserKycResponseDto response = new UserKycResponseDto();

            response.setUserId(savedKyc.getUserId());
            response.setDateOfBirth(savedKyc.getDateOfBirth());
            response.setIdType(savedKyc.getIdType());
            response.setIdNumber(savedKyc.getIdNumber());
            response.setIdUploadUrl(savedKyc.getIdUploadUrl());
            response.setDrivingLicenseNumber(savedKyc.getDrivingLicenseNumber());
            response.setDrivingLicenceUrl(savedKyc.getDrivingLicenceUrl());
            response.setLicenseValidTo(savedKyc.getLicenseValidTo());
            response.setKycStatus(savedKyc.getKycStatus());
            response.setCreatedAt(savedKyc.getCreatedAt());
            response.setUpdatedAt(savedKyc.getUpdatedAt());

            return response;
    }
}