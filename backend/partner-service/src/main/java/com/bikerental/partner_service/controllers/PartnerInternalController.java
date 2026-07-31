package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.response.PartnerStatusResponseDto;
import com.bikerental.partner_service.services.PartnerInternalServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/ids")
    public ResponseEntity<List<Integer>> getPartnerIdsByCity(@RequestParam("city") String city){
        return ResponseEntity.ok(partnerInternalServices.getPartnerIdsByCity(city));
    }
}
