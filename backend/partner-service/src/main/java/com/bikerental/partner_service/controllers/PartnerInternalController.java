package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.PartnerStatusResponseDto;
import com.bikerental.partner_service.services.PartnerInternalServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/internal/partners")
public class PartnerInternalController {
    private final PartnerInternalServices partnerInternalServices;

    public PartnerInternalController(PartnerInternalServices partnerInternalServices) {
        this.partnerInternalServices = partnerInternalServices;
    }

    @GetMapping("{id}/status")
    public ResponseEntity<PartnerStatusResponseDto> getPartnerStatus(@PathVariable Integer id){
        return ResponseEntity.ok(partnerInternalServices.getPartnerStatus(id));
    }
}
