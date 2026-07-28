package com.bikerental.partner_service.services;

import com.bikerental.partner_service.client.AuthServiceClient;
import com.bikerental.partner_service.dto.request.internal.UserAddRoleRequestDto;
import com.bikerental.partner_service.dto.request.internal.UserStatusUpdateRequestDto;
import com.bikerental.partner_service.dto.response.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.request.PartnerApprovalRequestDto;
import com.bikerental.partner_service.dto.request.PartnerBlockRequestDto;
import com.bikerental.partner_service.dto.response.PartnerSummaryDto;
import com.bikerental.partner_service.entities.Partner;
import com.bikerental.partner_service.exceptions.ResourceNotFoundException;
import com.bikerental.partner_service.repositories.PartnerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Service
public class PartnerAdminServicesImpl implements PartnerAdminServices {

    private final PartnerRepository partnerRepository;
    private final AuthServiceClient authServiceClient;

    public PartnerAdminServicesImpl(PartnerRepository partnerRepository,
                                    AuthServiceClient authServiceClient) {
        this.partnerRepository = partnerRepository;
        this.authServiceClient = authServiceClient;
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

            UserAddRoleRequestDto dto = new UserAddRoleRequestDto();
            dto.setRole("PARTNER");

            authServiceClient.addUserRole(objPartner.getUserId(), dto);

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
    @Transactional
    public PartnerAdminActionResponseDto blockPartner(Integer partnerId, PartnerBlockRequestDto requestDto, Integer adminId) {
        Partner objPartner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));


        if (objPartner.getAccountStatus().equals("SUSPENDED")) {
            throw new IllegalStateException("Account status is already SUSPENDED");
        }

        if (objPartner.getApprovalStatus().equals("PENDING")) {
            throw new IllegalStateException("Can't block a pending partner");
        }

        objPartner.setAccountStatus("SUSPENDED");
        objPartner.setRejectionReason("Blocked by admin: " + requestDto.getBlockReason());

        partnerRepository.save(objPartner);

        // invoke auth service method
        authServiceClient.deleteUserRole(objPartner.getUserId(), "PARTNER");
        UserStatusUpdateRequestDto dto = new UserStatusUpdateRequestDto();
        dto.setAccountStatus("BLOCKED");

        authServiceClient.updateUserStatus(objPartner.getUserId(), dto);

        PartnerAdminActionResponseDto responseDto = new PartnerAdminActionResponseDto();
        responseDto.setPartnerId(objPartner.getId());
        responseDto.setActionTaken("PROFILE_SUSPENDED");
        responseDto.setNewApprovalStatus(objPartner.getApprovalStatus());
        responseDto.setNewAccountStatus(objPartner.getAccountStatus());
        responseDto.setTimestamp(LocalDateTime.now());
        responseDto.setMessage("Blocked by admin: " + requestDto.getBlockReason());

        return responseDto;
    }

    @Override
    public Page<PartnerSummaryDto> getPendingPartners(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Partner> partnerPage = partnerRepository.findByApprovalStatus("PENDING", pageable);

        return partnerPage.map(partner -> {
            PartnerSummaryDto responseDto = new PartnerSummaryDto();
            BeanUtils.copyProperties(partner, responseDto);
            responseDto.setPartnerId(partner.getId());
            return responseDto;
        });
    }

    @Override
    public Page<PartnerSummaryDto> getAllPartnersFiltered(String city, String accountStatus, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Partner> partnerPage = partnerRepository.findAllWithFilters(city, accountStatus, search, pageable);

        return partnerPage.map(partner -> {
            PartnerSummaryDto responseDto = new PartnerSummaryDto();
            BeanUtils.copyProperties(partner, responseDto);
            responseDto.setPartnerId(partner.getId());
            return responseDto;
        });
    }

    @Override
    @Transactional
    public PartnerAdminActionResponseDto unblockPartner(Integer partnerId, Integer adminId) {
        Partner objPartner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));

        if (!objPartner.getAccountStatus().equals("SUSPENDED")) {
            throw new IllegalStateException("Account status is not SUSPENDED");
        }

        objPartner.setAccountStatus("ACTIVE");
        objPartner.setRejectionReason(null);

        partnerRepository.save(objPartner);

        // call to the auth service
        UserStatusUpdateRequestDto statusUpdateRequestDto = new UserStatusUpdateRequestDto();
        statusUpdateRequestDto.setAccountStatus("ACTIVE");
        authServiceClient.updateUserStatus(objPartner.getUserId(), statusUpdateRequestDto);
        UserAddRoleRequestDto addRoleRequestDto = new UserAddRoleRequestDto();
        addRoleRequestDto.setRole("PARTNER");
        authServiceClient.addUserRole(objPartner.getUserId(), addRoleRequestDto);

        PartnerAdminActionResponseDto responseDto = new PartnerAdminActionResponseDto();
        responseDto.setPartnerId(objPartner.getId());
        responseDto.setActionTaken("PROFILE_ACTIVATED");
        responseDto.setNewApprovalStatus(objPartner.getApprovalStatus());
        responseDto.setNewAccountStatus(objPartner.getAccountStatus());
        responseDto.setMessage("Partner account activated by admin");
        responseDto.setTimestamp(LocalDateTime.now());

        return responseDto;
    }
}
