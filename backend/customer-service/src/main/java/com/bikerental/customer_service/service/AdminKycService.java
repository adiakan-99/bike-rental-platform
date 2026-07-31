package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.AdminKycResponseDto;

import java.util.List;

public interface AdminKycService {

    List<AdminKycResponseDto> getPendingKycs();

    AdminKycResponseDto approveKyc(Integer userId,
                                   Integer adminId);

    AdminKycResponseDto rejectKyc(Integer userId,
                                  Integer adminId);
}
