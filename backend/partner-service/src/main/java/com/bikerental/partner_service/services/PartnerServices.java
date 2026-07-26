package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.*;

import java.util.List;


public interface PartnerServices {
    // 1. Onboarding
    PartnerCreationResponseDto onboardPartner(PartnerCreationRequestDto partnerCreationRequestDto, Integer userId);

    // 2. Data Retrieval
    PartnerProfileResponseDto getPartnerById(Integer partnerId, Integer authenticatedUserId, List<String> roles);
    List<PartnerDocumentDto> getPartnerDocuments(Integer partnerId, Integer authenticatedUserId, List<String> roles);
    PartnerPublicDto getPublicPartnerProfile(Integer partnerId);

}
