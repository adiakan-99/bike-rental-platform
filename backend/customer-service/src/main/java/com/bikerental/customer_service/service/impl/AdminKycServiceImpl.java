//package com.bikerental.customer_service.service.impl;
//
//
//import java.time.OffsetDateTime;
//import java.util.List;
//
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.bikerental.customer_service.dto.AdminKycResponseDTO;
//import com.bikerental.customer_service.entity.Customer;
//import com.bikerental.customer_service.entity.CustomerKyc;
//import com.bikerental.customer_service.enums.KycStatus;
//import com.bikerental.customer_service.exception.CustomerNotFoundException;
//import com.bikerental.customer_service.exception.UserKycNotFoundException;
//import com.bikerental.customer_service.repository.CustomerRepository;
//import com.bikerental.customer_service.repository.CustomerKycRepository;
//import com.bikerental.customer_service.service.AdminKycService;
//
//import lombok.RequiredArgsConstructor;
//
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class AdminKycServiceImpl implements AdminKycService {
//
//
//    private final CustomerKycRepository userKycRepository;
//
//    private final CustomerRepository customerRepository;
//
//
//
//    @Override
//    public List<AdminKycResponseDTO> getPendingKycs() {
//
//        return userKycRepository
//                .findByKycStatus(KycStatus.PENDING)
//                .stream()
//                .map(this::mapToResponse)
//                .toList();
//    }
//
//
//
//    @Override
//    public AdminKycResponseDTO approveKyc(
//            Integer userId,
//            Integer adminId) {
//
//
//        Customer customer =
//                customerRepository.findByUserId(userId)
//                .orElseThrow(
//                    () -> new CustomerNotFoundException(userId)
//                );
//
//
//        CustomerKyc kyc =
//                userKycRepository
//                .findByCustomerId(customer.getId())
//                .orElseThrow(
//                    () -> new UserKycNotFoundException(userId)
//                );
//
//
//        kyc.setKycStatus(KycStatus.VERIFIED);
//
//        kyc.setVerifiedBy(adminId);
//
//        kyc.setVerifiedAt(
//                OffsetDateTime.now()
//        );
//
//        kyc.setUpdatedAt(
//                OffsetDateTime.now()
//        );
//
//
//        customer.setKycStatus(
//                KycStatus.VERIFIED
//        );
//
//
//        userKycRepository.save(kyc);
//
//        customerRepository.save(customer);
//
//
//        return mapToResponse(kyc);
//    }
//
//
//
//
//    @Override
//    public AdminKycResponseDTO rejectKyc(
//            Integer userId,
//            Integer adminId) {
//
//
//        Customer customer =
//                customerRepository.findByUserId(userId)
//                .orElseThrow(
//                    () -> new CustomerNotFoundException(userId)
//                );
//
//
//        CustomerKyc kyc =
//                userKycRepository
//                .findByCustomerId(customer.getId())
//                .orElseThrow(
//                    () -> new UserKycNotFoundException(userId)
//                );
//
//
//
//        kyc.setKycStatus(
//                KycStatus.REJECTED
//        );
//
//
//        kyc.setVerifiedBy(adminId);
//
//        kyc.setVerifiedAt(
//                OffsetDateTime.now()
//        );
//
//        kyc.setUpdatedAt(
//                OffsetDateTime.now()
//        );
//
//
//
//        customer.setKycStatus(
//                KycStatus.REJECTED
//        );
//
//
//        userKycRepository.save(kyc);
//
//        customerRepository.save(customer);
//
//
//        return mapToResponse(kyc);
//    }
//
//
//
//    private AdminKycResponseDTO mapToResponse(
//            CustomerKyc kyc) {
//
//
//        AdminKycResponseDTO response =
//                new AdminKycResponseDTO();
//
//
//        response.setCustomerId(
//                kyc.getCustomerId()
//        );
//
//
//        response.setDateOfBirth(
//                kyc.getDateOfBirth()
//        );
//
//        response.setIdType(
//                kyc.getIdType()
//        );
//
//        response.setIdNumber(
//                kyc.getIdNumber()
//        );
//
//
//        response.setIdUploadUrl(
//                kyc.getIdUploadUrl()
//        );
//
//
//        response.setDrivingLicenseNumber(
//                kyc.getDrivingLicenseNumber()
//        );
//
//
//        response.setDrivingLicenceUrl(
//                kyc.getDrivingLicenceUrl()
//        );
//
//
//        response.setLicenseValidTo(
//                kyc.getLicenseValidTo()
//        );
//
//
//        response.setKycStatus(
//                kyc.getKycStatus()
//        );
//
//
//        response.setVerifiedBy(
//                kyc.getVerifiedBy()
//        );
//
//
//        response.setVerifiedAt(
//                kyc.getVerifiedAt()
//        );
//
//
//        response.setCreatedAt(
//                kyc.getCreatedAt()
//        );
//
//
//        return response;
//    }
//}