package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.AdminKycResponseDTO;

import java.util.List;

public interface AdminKycService {

    List<AdminKycResponseDTO> getPendingKycs();

    AdminKycResponseDTO approveKyc(Integer userId,
                                   Integer adminId);

    AdminKycResponseDTO rejectKyc(Integer userId,
                                  Integer adminId);
}
