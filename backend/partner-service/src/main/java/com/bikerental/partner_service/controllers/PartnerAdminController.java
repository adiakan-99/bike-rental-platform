package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.PartnerApprovalRequestDto;
import com.bikerental.partner_service.services.PartnerAdminServices;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/partners/admin")
public class PartnerAdminController {
    private PartnerAdminServices partnerAdminServices;

    public PartnerAdminController(PartnerAdminServices partnerAdminServices) {
        this.partnerAdminServices = partnerAdminServices;
    }

    private Integer getAuthenticatedAdminId() {
        return (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PutMapping("/review/{id}")
    public ResponseEntity<PartnerAdminActionResponseDto> approvePartner(@PathVariable Integer id,
                                                                        @Valid @RequestBody PartnerApprovalRequestDto requestDto) {
        Integer adminId = getAuthenticatedAdminId();

        PartnerAdminActionResponseDto responseDto = partnerAdminServices.approvePartner(id, requestDto, adminId);

        return ResponseEntity.ok(responseDto);
    }
}
