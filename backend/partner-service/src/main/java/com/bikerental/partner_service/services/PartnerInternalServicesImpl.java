package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.response.PartnerStatusResponseDto;
import com.bikerental.partner_service.entities.Partner;
import com.bikerental.partner_service.exceptions.ResourceNotFoundException;
import com.bikerental.partner_service.repositories.PartnerRepository;
import org.springframework.stereotype.Service;

@Service
public class PartnerInternalServicesImpl implements PartnerInternalServices {
    PartnerRepository partnerRepository;

    public PartnerInternalServicesImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    public PartnerStatusResponseDto getPartnerStatus(Integer partnerId) {
        Partner objPartner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner with id: " + partnerId + " not found."));

        PartnerStatusResponseDto partnerStatusResponseDto = new PartnerStatusResponseDto();
        partnerStatusResponseDto.setPartnerId(objPartner.getId());
        partnerStatusResponseDto.setAccountStatus(objPartner.getAccountStatus());
        partnerStatusResponseDto.setApprovalStatus(objPartner.getApprovalStatus());

        return partnerStatusResponseDto;
    }
}
