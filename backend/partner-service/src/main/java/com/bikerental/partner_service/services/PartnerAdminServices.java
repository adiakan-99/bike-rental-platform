package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.PartnerApprovalRequestDto;
import com.bikerental.partner_service.dto.PartnerBlockRequestDto;

public interface PartnerAdminServices {
    PartnerAdminActionResponseDto approvePartner(Integer partnerId,
                                                 PartnerApprovalRequestDto requestDto,
                                                 Integer adminId);

    PartnerAdminActionResponseDto blockPartner(Integer partnerId,
                                               PartnerBlockRequestDto requestDto,
                                               Integer adminId);

    PartnerAdminActionResponseDto unblockPartner(Integer partnerId, Integer adminId);
}
