package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.response.PartnerStatusResponseDto;
import com.bikerental.partner_service.entities.Partner;
import com.bikerental.partner_service.exceptions.ResourceNotFoundException;
import com.bikerental.partner_service.repositories.PartnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartnerInternalServicesImpl implements PartnerInternalServices {
    PartnerRepository partnerRepository;

    public PartnerInternalServicesImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    public PartnerStatusResponseDto getPartnerStatus(Integer userId) {
        Partner objPartner = partnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner with user id: " + userId + " not found."));

        PartnerStatusResponseDto partnerStatusResponseDto = new PartnerStatusResponseDto();
        partnerStatusResponseDto.setPartnerId(objPartner.getId());
        partnerStatusResponseDto.setAccountStatus(objPartner.getAccountStatus());
        partnerStatusResponseDto.setApprovalStatus(objPartner.getApprovalStatus());

        return partnerStatusResponseDto;
    }

    @Override
    public List<Integer> getPartnerIdsByCity(String city) {
        if (city == null || city.isEmpty()) {
            throw new ResourceNotFoundException("City cannot be null or empty.");
        }

        return partnerRepository.findActiveApprovedPartnerIdsByCity(city);
    }
}
