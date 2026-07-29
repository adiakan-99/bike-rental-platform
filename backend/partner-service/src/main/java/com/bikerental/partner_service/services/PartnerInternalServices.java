package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.response.PartnerStatusResponseDto;

public interface PartnerInternalServices {
    PartnerStatusResponseDto getPartnerStatus(Integer userId);
}
