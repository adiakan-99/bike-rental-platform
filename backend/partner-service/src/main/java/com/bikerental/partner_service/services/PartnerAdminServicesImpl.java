package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.PartnerApprovalRequestDto;
import com.bikerental.partner_service.dto.PartnerBlockRequestDto;
import com.bikerental.partner_service.entities.Partner;
import com.bikerental.partner_service.exceptions.ResourceNotFoundException;
import com.bikerental.partner_service.repositories.PartnerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Service
public class PartnerAdminServicesImpl implements PartnerAdminServices {

    private final PartnerRepository partnerRepository;

    public PartnerAdminServicesImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    @Transactional
    public PartnerAdminActionResponseDto approvePartner(Integer partnerId, PartnerApprovalRequestDto requestDto, Integer adminId) {
        Partner objPartner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));

        if (!objPartner.getApprovalStatus().equals("PENDING")) {
            throw new IllegalStateException("Approval status is not PENDING");
        }

        objPartner.setApprovalStatus(requestDto.getApprovalStatus());
        objPartner.setApprovedBy(adminId);
        objPartner.setApprovedAt(OffsetDateTime.now());

        String message;

        if (requestDto.getApprovalStatus().equals("APPROVED")) {
            objPartner.setRejectionReason(null);

            message = "Partner approved by admin";
        } else {
            objPartner.setRejectionReason(requestDto.getAdminRemarks());
            message = "Partner rejected by admin";
        }

        partnerRepository.save(objPartner);

        PartnerAdminActionResponseDto responseDto = new PartnerAdminActionResponseDto();
        responseDto.setPartnerId(objPartner.getId());
        responseDto.setActionTaken("PROFILE_" + requestDto.getApprovalStatus());
        responseDto.setNewApprovalStatus(objPartner.getApprovalStatus());
        responseDto.setMessage(message);
        responseDto.setNewAccountStatus(objPartner.getAccountStatus());
        responseDto.setTimestamp(LocalDateTime.now());

        return responseDto;
    }

    @Override
    public PartnerAdminActionResponseDto blockPartner(Integer partnerId, PartnerBlockRequestDto requestDto, Integer adminId) {
        return null;
    }

    @Override
    public PartnerAdminActionResponseDto unblockPartner(Integer partnerId, Integer adminId) {
        return null;
    }
}
