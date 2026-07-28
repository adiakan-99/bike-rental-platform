package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.request.PartnerCreationRequestDto;
import com.bikerental.partner_service.dto.request.PartnerDocumentUpdateRequestDto;
import com.bikerental.partner_service.dto.request.PartnerPayoutRequestDto;
import com.bikerental.partner_service.dto.request.PartnerUpdateRequestDto;
import com.bikerental.partner_service.dto.response.*;

import java.util.List;


public interface PartnerServices {
    PartnerCreationResponseDto onboardPartner(PartnerCreationRequestDto partnerCreationRequestDto, Integer userId);

    PartnerProfileResponseDto getPartnerById(Integer partnerId, Integer authenticatedUserId, List<String> roles);
    List<PartnerDocumentDto> getPartnerDocuments(Integer partnerId, Integer authenticatedUserId, List<String> roles);
    PartnerPublicDto getPublicPartnerProfile(Integer partnerId);

    PartnerProfileResponseDto getMyProfile(Integer authenticatedUserId, List<String> roles);
    List<PartnerDocumentDto> getMyDocuments(Integer authenticatedUserId, List<String> roles);

    PartnerProfileResponseDto updateMyProfile(Integer authenticatedUserId, PartnerUpdateRequestDto requestDto, List<String> roles);

    PartnerDocumentDto updatePartnerDocument(Integer authenticatedUserId, PartnerDocumentUpdateRequestDto requestDto);

    PartnerPayoutResponseDto upsertPartnerPayout(Integer authenticatedUserId, PartnerPayoutRequestDto requestDto);
}
