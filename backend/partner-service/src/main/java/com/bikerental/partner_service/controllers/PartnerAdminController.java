package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.response.PartnerAdminActionResponseDto;
import com.bikerental.partner_service.dto.request.PartnerApprovalRequestDto;
import com.bikerental.partner_service.dto.request.PartnerBlockRequestDto;
import com.bikerental.partner_service.dto.response.PartnerSummaryDto;
import com.bikerental.partner_service.services.PartnerAdminServices;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/partners/admin")
public class PartnerAdminController {
    private final PartnerAdminServices partnerAdminServices;

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

    @GetMapping("/pending")
    public ResponseEntity<Page<PartnerSummaryDto>>  getPendingPartners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(partnerAdminServices.getPendingPartners(page, size));
    }

    @GetMapping
    public ResponseEntity<Page<PartnerSummaryDto>> getAllPartners(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String accountStatus,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(partnerAdminServices.getAllPartnersFiltered(city, accountStatus, search, page, size));
    }

    @PostMapping("/{id}/block")
    public ResponseEntity<PartnerAdminActionResponseDto>  blockPartner(@PathVariable("id") int partnerId,
                                                                       @Valid PartnerBlockRequestDto requestDto) {
        Integer adminId = getAuthenticatedAdminId();
        PartnerAdminActionResponseDto responseDto = partnerAdminServices.blockPartner(partnerId, requestDto, adminId);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/{id}/unblock")
    public ResponseEntity<PartnerAdminActionResponseDto> unblockPartner(@PathVariable("id") int partnerId) {
        Integer adminId = getAuthenticatedAdminId();

        return ResponseEntity.ok(partnerAdminServices.unblockPartner(partnerId, adminId));
    }
}
