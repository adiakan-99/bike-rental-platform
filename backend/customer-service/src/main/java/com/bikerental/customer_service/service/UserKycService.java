package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.UserKycRequestDto;
import com.bikerental.customer_service.dto.UserKycResponseDto;

public interface UserKycService {

    UserKycResponseDto createKyc(UserKycRequestDto request, Integer userId);

}