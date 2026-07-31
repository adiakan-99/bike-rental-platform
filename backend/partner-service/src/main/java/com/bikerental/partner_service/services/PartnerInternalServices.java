package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.response.PartnerStatusResponseDto;

import java.util.List;

public interface PartnerInternalServices {
    PartnerStatusResponseDto getPartnerStatus(Integer userId);
    List<Integer> getPartnerIdsByCity(String city);
}
