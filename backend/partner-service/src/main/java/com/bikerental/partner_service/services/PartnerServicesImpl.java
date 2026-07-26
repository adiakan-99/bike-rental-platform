package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.*;
import com.bikerental.partner_service.entities.Partner;
import com.bikerental.partner_service.entities.PartnerDocument;
import com.bikerental.partner_service.entities.PartnerPayoutAccount;
import com.bikerental.partner_service.exceptions.DuplicateResourceException;
import com.bikerental.partner_service.exceptions.ResourceNotFoundException;
import com.bikerental.partner_service.repositories.PartnerDocumentRepository;
import com.bikerental.partner_service.repositories.PartnerPayoutAccountRepository;
import com.bikerental.partner_service.repositories.PartnerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PartnerServicesImpl implements PartnerServices {
    private final PartnerRepository partnerRepository;
    private final PartnerPayoutAccountRepository payoutAccountRepository;
    private final PartnerDocumentRepository documentRepository;
    private final StorageServices storageServices;

    public PartnerServicesImpl(PartnerRepository partnerRepository,
                               PartnerPayoutAccountRepository accountRepository,
                               PartnerDocumentRepository documentRepository,
                               StorageServices storageServices) {
        this.partnerRepository = partnerRepository;
        this.payoutAccountRepository = accountRepository;
        this.documentRepository = documentRepository;
        this.storageServices = storageServices;
    }

    @Override
    @Transactional
    public PartnerCreationResponseDto onboardPartner(PartnerCreationRequestDto partnerCreationRequestDto, Integer userId) {

        if (partnerRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("A partner already exists with userId " + userId);
        }

        Partner objPartner = new Partner();
        BeanUtils.copyProperties(partnerCreationRequestDto, objPartner);
        objPartner.setAccountStatus("ACTIVE");
        objPartner.setApprovalStatus("PENDING");
        objPartner.setCreatedAt(OffsetDateTime.now());
        objPartner.setUpdatedAt(OffsetDateTime.now());
        objPartner.setUserId(userId);

        Partner savedPartner = partnerRepository.save(objPartner);

        PartnerPayoutDto payoutDto = partnerCreationRequestDto.getPayoutAccount();
        PartnerPayoutAccount objPartnerPayoutAccount = new PartnerPayoutAccount();
        BeanUtils.copyProperties(payoutDto, objPartnerPayoutAccount);

        objPartnerPayoutAccount.setCreatedAt(OffsetDateTime.now());
        objPartnerPayoutAccount.setPartner(savedPartner);
        objPartnerPayoutAccount.setIsPrimary(true);

        payoutAccountRepository.save(objPartnerPayoutAccount);

        if (partnerCreationRequestDto.getSellerType().equals("COMMERCIAL_DEALER") && partnerCreationRequestDto.getDocuments() != null) {
            List<PartnerDocument>  partnerDocuments = new ArrayList<>();

            for (PartnerDocumentUploadDto partnerDocumentUploadDto : partnerCreationRequestDto.getDocuments()) {
                PartnerDocument partnerDocument = new PartnerDocument();
                BeanUtils.copyProperties(partnerDocumentUploadDto, partnerDocument);
                partnerDocument.setPartner(savedPartner);
                partnerDocument.setUploadedAt(OffsetDateTime.now());
                partnerDocuments.add(partnerDocument);
            }

            documentRepository.saveAll(partnerDocuments);
        }

        PartnerCreationResponseDto partnerCreationResponseDto = new PartnerCreationResponseDto();
        partnerCreationResponseDto.setPartnerId(savedPartner.getId());
        partnerCreationResponseDto.setSellerType(savedPartner.getSellerType());
        partnerCreationResponseDto.setApprovalStatus(savedPartner.getApprovalStatus());

        return partnerCreationResponseDto;
    }

    @Override
    public PartnerProfileResponseDto getPartnerById(Integer partnerId, Integer authenticatedUserId, List<String> roles) {
        // 1. Fetch Partner
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));

        // 2. Zero-Trust Security Check: Is this user allowed to view this profile?
        boolean isAdmin = roles.contains("ADMIN");
        boolean isOwner = partner.getUserId().equals(authenticatedUserId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to view this partner profile.");
        }

        // 3. Fetch Payout Details
        PartnerPayoutAccount payout = payoutAccountRepository.findByPartnerId(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Payout details missing for partner ID: " + partnerId));

        // 4. Map Entity to DTO (Manual mapping shown here)
        PartnerProfileResponseDto response = new PartnerProfileResponseDto();
        BeanUtils.copyProperties(partner, response);
        // response.setBusinessName(partner.getBusinessName()); // Set other fields...

        PartnerPayoutDto payoutDto = new PartnerPayoutDto();
        payoutDto.setAccountHolder(payout.getAccountHolder());
        payoutDto.setAccountNumber(payout.getAccountNumber());
        payoutDto.setIfsc(payout.getIfsc());
        payoutDto.setBankName(payout.getBankName());

        response.setPayoutAccount(payoutDto);

        return response;
    }

    @Override
    public PartnerPublicDto getPublicPartnerProfile(Integer partnerId) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        if (!"ACTIVE".equals(partner.getAccountStatus()) || !"APPROVED".equals(partner.getApprovalStatus())) {
            throw new ResourceNotFoundException("Partner profile is not publicly available.");
        }

        PartnerPublicDto publicDto = new PartnerPublicDto();

        // You can safely use BeanUtils here because the fields match perfectly!
        BeanUtils.copyProperties(partner, publicDto);
        publicDto.setPartnerId(partner.getId()); // In case ID names differ

        return publicDto;
    }

    @Override
    public List<PartnerDocumentDto> getPartnerDocuments(Integer partnerId, Integer authenticatedUserId, List<String> roles) {
        // 1. Fetch Partner to verify existence AND ownership
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));

        // 2. Zero-Trust Security Check
        boolean isAdmin = roles.contains("ROLE_ADMIN");
        boolean isOwner = partner.getUserId().equals(authenticatedUserId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to view these documents.");
        }

        // 3. Fetch and Map Documents
        List<PartnerDocument> documents = documentRepository.findByPartnerId(partnerId);

        return documents.stream().map(doc -> {
            PartnerDocumentDto dto = new PartnerDocumentDto();
            dto.setDocumentId(doc.getId());
            dto.setDocType(doc.getDocType());

            String secureViewUrl = storageServices.getFileDownloadUrl(doc.getFileUrl());

            dto.setFileUrl(secureViewUrl);
            dto.setExpiresAt(doc.getExpiresAt());
            return dto;
        }).toList();
    }
}
