package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.PartnerStatusResponseDto;

public interface PartnerInternalServices {
    PartnerStatusResponseDto getPartnerStatus(Integer partnerId);
}
