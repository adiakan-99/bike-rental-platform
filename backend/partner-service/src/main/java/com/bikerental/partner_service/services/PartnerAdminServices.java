package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.PartnerApprovalRequestDto;
import com.bikerental.partner_service.dto.PartnerBlockRequestDto;
import com.bikerental.partner_service.dto.PartnerSummaryDto;
import org.springframework.data.domain.Page;

public interface PartnerAdminServices {
    PartnerAdminActionResponseDto approvePartner(Integer partnerId,
                                                 PartnerApprovalRequestDto requestDto,
                                                 Integer adminId);

    Page<PartnerSummaryDto> getPendingPartners(int page, int size);

    Page<PartnerSummaryDto> getAllPartnersFiltered(String city, String accountStatus, String search, int page, int size);

    PartnerAdminActionResponseDto blockPartner(Integer partnerId,
                                               PartnerBlockRequestDto requestDto,
                                               Integer adminId);

    PartnerAdminActionResponseDto unblockPartner(Integer partnerId, Integer adminId);
}
