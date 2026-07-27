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
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + partnerId));

        boolean isAdmin = roles.contains("ADMIN");
        boolean isOwner = partner.getUserId().equals(authenticatedUserId);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to view this partner profile.");
        }

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
    public PartnerProfileResponseDto getMyProfile(Integer authenticatedUserId, List<String> roles) {
        Partner partner = partnerRepository.findByUserId(authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + authenticatedUserId));

        return this.getPartnerById(partner.getId(), authenticatedUserId, roles);
    }

    @Override
    public List<PartnerDocumentDto> getMyDocuments(Integer authenticatedUserId, List<String> roles) {
        Partner partner = partnerRepository.findByUserId(authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with ID: " + authenticatedUserId));

        return this.getPartnerDocuments(partner.getId(), authenticatedUserId, roles);
    }

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<String>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        emptyNames.add("panNumber");
        emptyNames.add("gstNumber");
        emptyNames.add("udyamNumber");

        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    @Override
    public PartnerProfileResponseDto updateMyProfile(Integer authenticatedUserId, PartnerUpdateRequestDto requestDto, List<String> roles) {
        Partner objPartner = partnerRepository.findByUserId(authenticatedUserId).orElseThrow(() -> new AccessDeniedException("Access denied"));

        BeanUtils.copyProperties(objPartner, requestDto, getNullPropertyNames(requestDto));

        boolean critcalKycChanged = false;

        if (requestDto.getPanNumber() != null && !requestDto.getPanNumber().equals(objPartner.getPanNumber())) {
            critcalKycChanged = true;
            objPartner.setPanNumber(requestDto.getPanNumber());
        }

        if (requestDto.getGstNumber() != null && !requestDto.getGstNumber().equals(objPartner.getGstNumber())) {
            critcalKycChanged = true;
            objPartner.setGstNumber(requestDto.getGstNumber());
        }

        if (requestDto.getUdyamNumber() != null && !requestDto.getUdyamNumber().equals(objPartner.getUdyamNumber())) {
            critcalKycChanged = true;
            objPartner.setUdyamNumber(requestDto.getUdyamNumber());
        }

        if (objPartner.getApprovalStatus().equals("REJECTED")) {
            objPartner.setApprovalStatus("PENDING");
            objPartner.setRejectionReason(null);
        } else if (objPartner.getApprovalStatus().equals("APPROVED") && critcalKycChanged) {
            objPartner.setApprovalStatus("PENDING");

            // auth service client to revoke partner privilege
        }

        partnerRepository.save(objPartner);
        return this.getPartnerById(objPartner.getId(), authenticatedUserId, roles);
    }

    @Override
    @Transactional
    public PartnerDocumentDto updatePartnerDocument(Integer authenticatedUserId, PartnerDocumentUpdateRequestDto requestDto) {
        Partner objPartner = partnerRepository.findByUserId(authenticatedUserId).orElseThrow(() -> new AccessDeniedException("Access denied"));

        PartnerDocument document = documentRepository.findByPartnerIdAndDocType(objPartner.getId(), requestDto.getDocType())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        document.setFileUrl(requestDto.getFileUrl());

        if (objPartner.getApprovalStatus().equals("APPROVED") || objPartner.getApprovalStatus().equals("REJECTED")) {
            objPartner.setApprovalStatus("PENDING");
            objPartner.setRejectionReason(null);

            // auth service client to revoke partner privileges
        }

        documentRepository.save(document);
        partnerRepository.save(objPartner);

        PartnerDocumentDto responseDto = new PartnerDocumentDto();
        BeanUtils.copyProperties(objPartner, responseDto);

        return responseDto;
    }

    @Override
    @Transactional
    public PartnerPayoutResponseDto upsertPartnerPayout(Integer authenticatedUserId, PartnerPayoutRequestDto requestDto) {
        Partner objPartner = partnerRepository.findByUserId(authenticatedUserId).orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        PartnerPayoutAccount payoutAccount = payoutAccountRepository.findByPartnerId(objPartner.getId())
                .orElse(new PartnerPayoutAccount());

        BeanUtils.copyProperties(objPartner, payoutAccount, getNullPropertyNames(requestDto));
        payoutAccount.setPartner(objPartner);
        payoutAccount.setIsPrimary(true);
        payoutAccount.setCreatedAt(OffsetDateTime.now());

        PartnerPayoutAccount savedAccount = payoutAccountRepository.save(payoutAccount);

        String rawAcc = payoutAccount.getAccountNumber();
        String masked = rawAcc.length() > 4 ? "XXXX-XXXX-" + rawAcc.substring(rawAcc.length() - 4) : "XXXX";

        PartnerPayoutResponseDto responseDto = new PartnerPayoutResponseDto();
        BeanUtils.copyProperties(payoutAccount, responseDto);
        responseDto.setMaskedAccountNumber(masked);

        return responseDto;
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
