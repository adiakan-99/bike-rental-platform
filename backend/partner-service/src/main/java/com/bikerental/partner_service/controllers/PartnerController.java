package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.*;
import com.bikerental.partner_service.services.PartnerServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partners")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerServices partnerServices;

    private Integer getAuthenticatedUserId() {
        return (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private List<String> getAuthenticatedUserRoles() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }

    @PostMapping("/profile")
    public ResponseEntity<PartnerCreationResponseDto> onboardPartner(@Valid @RequestBody PartnerCreationRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        PartnerCreationResponseDto responseDto = partnerServices.onboardPartner(requestDto, userId);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerProfileResponseDto> getPartnerById(@PathVariable Integer id) {
        Integer userId = getAuthenticatedUserId();
        List<String> roles = getAuthenticatedUserRoles();

        return ResponseEntity.ok(partnerServices.getPartnerById(id, userId, roles));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<PartnerDocumentDto>> getPartnerDocuments(@PathVariable Integer id) {
        Integer userId = getAuthenticatedUserId();
        List<String> roles = getAuthenticatedUserRoles();

        return ResponseEntity.ok(partnerServices.getPartnerDocuments(id, userId, roles));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PartnerPublicDto> getPublicPartnerProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(partnerServices.getPublicPartnerProfile(id));
    }

    @GetMapping("/me")
    public ResponseEntity<PartnerProfileResponseDto> getMyProfile() {
        Integer userId = getAuthenticatedUserId();
        List<String> roles = getAuthenticatedUserRoles();

        return ResponseEntity.ok(partnerServices.getMyProfile(userId, roles));
    }

    @GetMapping("/me/documents")
    public ResponseEntity<List<PartnerDocumentDto>> getMyDocuments() {
        Integer userId = getAuthenticatedUserId();
        List<String> roles = getAuthenticatedUserRoles();

        return ResponseEntity.ok(partnerServices.getMyDocuments(userId, roles));
    }

    @PutMapping("/me")
    public ResponseEntity<PartnerProfileResponseDto> updateMyProfile(
            @Valid @RequestBody PartnerUpdateRequestDto requestDto) {

        Integer userId = getAuthenticatedUserId();
        List<String> roles = getAuthenticatedUserRoles();

        return ResponseEntity.ok(partnerServices.updateMyProfile(userId, requestDto, roles));
    }

    @PutMapping("/me/documents")
    public ResponseEntity<PartnerDocumentDto> updateMyDocuments(
            @Valid @RequestBody PartnerDocumentUpdateRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.ok(partnerServices.updatePartnerDocument(userId, requestDto));
    }

    @PutMapping("/me/payout")
    public ResponseEntity<PartnerPayoutResponseDto> updatePartnerPayout(
            @Valid @RequestBody PartnerPayoutRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();
        return ResponseEntity.ok(partnerServices.upsertPartnerPayout(userId, requestDto));
    }
}
