package com.bikerental.bike_service.service;

import com.bikerental.bike_service.client.BookingServiceClient;
import com.bikerental.bike_service.client.PartnerServiceClient;
import com.bikerental.bike_service.dto.PartnerStatusDto;
import com.bikerental.bike_service.dto.request.*;
import com.bikerental.bike_service.dto.response.*;
import com.bikerental.bike_service.entity.Bike;
import com.bikerental.bike_service.entity.BikeDetails;
import com.bikerental.bike_service.entity.BikeImage;
import com.bikerental.bike_service.entity.Insurance;
import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import com.bikerental.bike_service.repository.BikeRepository;
import com.bikerental.bike_service.repository.InsuranceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BikeServicesImpl implements BikeServices {
    private final BikeRepository bikeRepository;
    private final InsuranceRepository insuranceRepository;
    private final PartnerServiceClient partnerServiceClient;
    private final StorageServices storageServices;
    private final BookingServiceClient bookingServiceClient;

    public BikeServicesImpl(BikeRepository bikeRepository,
                            InsuranceRepository insuranceRepository,
                            PartnerServiceClient partnerServiceClient,
                            StorageServices storageServices,
                            BookingServiceClient bookingServiceClient) {
        this.bikeRepository = bikeRepository;
        this.insuranceRepository = insuranceRepository;
        this.partnerServiceClient = partnerServiceClient;
        this.storageServices = storageServices;
        this.bookingServiceClient = bookingServiceClient;
    }

    @Override
    @Transactional
    public FleetListingDto createBikeListing(Integer userId, BikeListingRequestDto requestDto) {
        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);

        if (partner == null || !partner.getAccountStatus().equals("ACTIVE") || !partner.getApprovalStatus().equals("APPROVED")) {
            throw new AccessDeniedException("User with user id: " + userId + " is not approved or not active");
        }

        Integer partnerId = partner.getPartnerId();

        if (bikeRepository.existsByRegistrationNumber(requestDto.getRegistrationNumber())) {
            throw new IllegalArgumentException("A bike with the registration number " + requestDto.getRegistrationNumber() + " already exists");
        }

        InsuranceRequestDto  insuranceRequestDto = requestDto.getInsurance();
        Insurance insurance = new Insurance();
        BeanUtils.copyProperties(insuranceRequestDto, insurance);

        Insurance savedInsurance = insuranceRepository.save(insurance);

        Bike bike = new Bike();
        BeanUtils.copyProperties(requestDto, bike);

        bike.setInsurance(savedInsurance);
        bike.setPartnerId(partnerId);
        bike.setApprovalStatus(ApprovalStatus.PENDING);
        bike.setBikeStatus(BikeStatus.INACTIVE);

        BikeDetailsRequestDto detailsDto = requestDto.getBikeDetails();
        if (detailsDto != null) {
            BikeDetails bikeDetails = new BikeDetails();
            BeanUtils.copyProperties(detailsDto, bikeDetails);
            bikeDetails.setBike(bike);
            bike.setBikeDetails(bikeDetails);
        }

        if (requestDto.getImages() != null) {
            List<BikeImageRequestDto> imagesRequest = requestDto.getImages();
            List<BikeImage> images = new ArrayList<>();

            for (BikeImageRequestDto imageRequest : imagesRequest) {
                BikeImage bikeImage = new BikeImage();
                BeanUtils.copyProperties(imageRequest, bikeImage);
                bikeImage.setBike(bike);
                images.add(bikeImage);
            }

            bike.setBikeImages(images);
        }

        Bike saveBike = bikeRepository.save(bike);

        return mapToFleetListingDto(saveBike);
    }

    @Override
    @Transactional
    public FleetListingDto updateBikeListing(Integer userId, Integer bikeId, BikeListingRequestDto requestDto) {
        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);

        if (partner == null || !partner.getAccountStatus().equals("ACTIVE") || !partner.getApprovalStatus().equals("APPROVED")) {
            throw new AccessDeniedException("User with user id: " + userId + " is not approved or not active");
        }

        Integer partnerId = partner.getPartnerId();

        Bike existingBike = bikeRepository.findByBikeIdAndPartnerIdAndDeletedAtIsNull(bikeId, partnerId)
                .orElseThrow(() -> new IllegalArgumentException("Bike with bike id " + bikeId + " does not exist"));

        if (!existingBike.getRegistrationNumber().equals(requestDto.getRegistrationNumber())) {
            if (bikeRepository.existsByRegistrationNumber(requestDto.getRegistrationNumber())) {
                throw new IllegalArgumentException("Bike with the registration number " + requestDto.getRegistrationNumber() + " already exists");
            }
        }

        BeanUtils.copyProperties(requestDto, existingBike, "bikeId", "partnerId", "insurance", "bikeDetails", "bikeImages", "createdAt", "approvedBy", "approvedAt", "rejectionReason");

        existingBike.setApprovalStatus(ApprovalStatus.PENDING);

        existingBike.setRejectionReason(null);

        Insurance insurance = existingBike.getInsurance();
        if (insurance != null && requestDto.getInsurance() != null) {
            BeanUtils.copyProperties(insurance, existingBike, "insuranceId");
            insuranceRepository.save(insurance);
        }

        BikeDetailsRequestDto detailsDto = requestDto.getBikeDetails();

        if (detailsDto != null) {
            BikeDetails bikeDetails = existingBike.getBikeDetails();
            if (bikeDetails == null) {
                bikeDetails = new BikeDetails();
                bikeDetails.setBike(existingBike);
                existingBike.setBikeDetails(bikeDetails);
            }

            BeanUtils.copyProperties(detailsDto, bikeDetails, "bikeDetailsId");
        }

        if (requestDto.getImages() != null) {
            if (existingBike.getBikeImages() != null) {
                existingBike.getBikeImages().clear();
            } else {
                existingBike.setBikeImages(new ArrayList<>());
            }

            for (BikeImageRequestDto imageRequest : requestDto.getImages()) {
                BikeImage bikeImage = new BikeImage();
                BeanUtils.copyProperties(imageRequest, bikeImage,  "bikeImageId");
                bikeImage.setBike(existingBike);
                existingBike.getBikeImages().add(bikeImage);
            }
        }

        Bike savedBike = bikeRepository.save(existingBike);

        return mapToFleetListingDto(savedBike);
    }

    @Override
    @Transactional
    public FleetListingDto updateOperationalDetails(Integer userId, Integer bikeId, BikeOperationalUpdateDto requestDto) {

        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);
        if (partner == null || !partner.getAccountStatus().equals("ACTIVE") || !partner.getApprovalStatus().equals("APPROVED")) {
            throw new AccessDeniedException("User is not approved or active");
        }

        Bike bike = bikeRepository.findByBikeIdAndPartnerIdAndDeletedAtIsNull(bikeId, partner.getPartnerId())
                .orElseThrow(() -> new IllegalArgumentException("Bike not found or unauthorized"));

        if (requestDto.getHourlyRate() != null) {
            bike.setHourlyRate(requestDto.getHourlyRate());
        }
        if (requestDto.getSecurityDeposit() != null) {
            bike.setSecurityDeposit(requestDto.getSecurityDeposit());
        }
        if (requestDto.getBikeStatus() != null) {
            bike.setBikeStatus(requestDto.getBikeStatus());
        }
        if (requestDto.getAdditionalServices() != null) {
            bike.setAdditionalServices(requestDto.getAdditionalServices());
        }

        Bike savedBike = bikeRepository.save(bike);
        return mapToFleetListingDto(savedBike);
    }

    @Override
    public FleetListingDto updateBikeStatus(Integer userId, Integer bikeId, BikeStatusUpdateDto requestDto) {
        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);

        if (partner == null || !partner.getAccountStatus().equals("ACTIVE")) {
            throw new AccessDeniedException("User is not approved or active");
        }

        Bike bike = bikeRepository.findById(bikeId)
                .orElseThrow(() -> new IllegalArgumentException("Bike not found"));

        bike.setBikeStatus(requestDto.getBikeStatus());

        Bike savedBike = bikeRepository.save(bike);
        return mapToFleetListingDto(savedBike);
    }

    @Override
    public void deleteBikeListing(Integer userId, Integer bikeId) {
        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);

        if  (partner == null || !partner.getAccountStatus().equals("ACTIVE")) {
            throw new AccessDeniedException("User is not approved or active");
        }

        Bike bike = bikeRepository.findById(bikeId)
                .orElseThrow(() -> new IllegalArgumentException("Bike not found"));

        bike.setDeletedAt(LocalDateTime.now());
        bike.setBikeStatus(BikeStatus.INACTIVE);
        bikeRepository.save(bike);
    }

    @Override
    public List<FleetListingDto> getPartnerFleetListing(Integer userId) {
        PartnerStatusDto partner = partnerServiceClient.getPartnerStatus(userId);

        if (partner == null || !partner.getAccountStatus().equals("ACTIVE")) {
            throw new AccessDeniedException("User is not approved or active");
        }

        List<Bike> partnerBikes = bikeRepository.findByPartnerIdAndDeletedAtIsNull(partner.getPartnerId());

        return partnerBikes.stream()
                .map(this::mapToFleetListingDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PendingBikeDto> getPendingBikeList(Pageable pageable) {
        Page<Bike> pendingBikesPage = bikeRepository.findByApprovalStatusAndDeletedAtIsNull(ApprovalStatus.PENDING, pageable);

        return pendingBikesPage.map(bike -> {
            InsuranceRequestDto insuranceRequestDto = null;
            if (bike.getInsurance() != null) {
                insuranceRequestDto = new InsuranceRequestDto();
                BeanUtils.copyProperties(bike.getInsurance(), insuranceRequestDto);
            }

            List<BikeImageRequestDto> imageRequestDtos = null;

            if (bike.getBikeImages() != null) {
                imageRequestDtos = bike.getBikeImages().stream().map(img -> {
                    BikeImageRequestDto imageRequestDto = new BikeImageRequestDto();
                    BeanUtils.copyProperties(img, imageRequestDto);
                    imageRequestDto.setImageUrl(storageServices.getFileDownloadUrl(img.getImageUrl()));
                    return imageRequestDto;
                }).toList();
            }

            return PendingBikeDto.builder()
                    .bikeId(bike.getBikeId())
                    .partnerId(bike.getPartnerId())
                    .registrationNumber(bike.getRegistrationNumber())
                    .manufacturer(bike.getManufacturer())
                    .model(bike.getModel())
                    .category(bike.getBikeDetails() != null ? bike.getBikeDetails().getBikeCategory() : null)
                    .hourlyRate(bike.getHourlyRate())
                    .securityDeposit(bike.getSecurityDeposit())
                    .rcUploadUrl(storageServices.getFileDownloadUrl(bike.getRcUploadUrl()))
                    .pucUploadUrl(storageServices.getFileDownloadUrl(bike.getPucUploadUrl()))
                    .approvalStatus(bike.getApprovalStatus())
                    .createdAt(bike.getCreatedAt())
                    .registrationExpiry(bike.getRegistrationExpiry())
                    .pucExpiry(bike.getPucExpiry())
                    .insurance(insuranceRequestDto)
                    .images(imageRequestDtos)
                    .build();
        });
    }

    @Override
    public BikeAdminActionResponseDto reviewBikeListing(Integer userId, Integer bikeId, BikeAdminReviewRequestDto requestDto) {
        Bike bike = bikeRepository.findById(bikeId)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new IllegalArgumentException("Bike not found"));

        if (bike.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new IllegalArgumentException("Only bikes with approval status PENDING can be reviewed");
        }

        String message;
        if (requestDto.getApprovalStatus() == ApprovalStatus.APPROVED) {
            bike.setApprovalStatus(ApprovalStatus.APPROVED);
            bike.setApprovedBy(userId);
            bike.setApprovedAt(LocalDateTime.now());
            bike.setBikeStatus(BikeStatus.AVAILABLE);
            bike.setRejectionReason(null);

            message = "Bike Listing approved successfully";
        } else {
            bike.setApprovalStatus(ApprovalStatus.REJECTED);
            bike.setBikeStatus(BikeStatus.INACTIVE);
            bike.setRejectionReason(requestDto.getAdminRemarks());
            message = "Bike Listing rejected";
        }

        Bike savedBike = bikeRepository.save(bike);
        return BikeAdminActionResponseDto.builder()
                .bikeId(savedBike.getBikeId())
                .registrationNumber(savedBike.getRegistrationNumber())
                .approvalStatus(savedBike.getApprovalStatus())
                .bikeStatus(savedBike.getBikeStatus())
                .approvedBy(savedBike.getApprovedBy())
                .approvedAt(savedBike.getApprovedAt())
                .rejectionReason(savedBike.getRejectionReason())
                .message(message)
                .build();
    }

    @Override
    public Page<BikeCardDto> browseBike(String city, String manufacturer, String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        List<Integer> partnerIdsInCity = null;

        if (city != null && !city.trim().isEmpty()) {
            try {
                partnerIdsInCity = partnerServiceClient.getPartnerIdsByCity(city);

                if (partnerIdsInCity == null || partnerIdsInCity.isEmpty()) {
                    return Page.empty(pageable);
                }
            } catch (Exception e) {
                return Page.empty(pageable);
            }
        }

        Page<Bike> bikePage = bikeRepository.searchBikes(partnerIdsInCity, manufacturer, category, minPrice, maxPrice, pageable);

        return bikePage.map(bike -> {
            String primaryImageUrl = null;
            if (bike.getBikeImages() != null && !bike.getBikeImages().isEmpty()) {
                var primaryImage = bike.getBikeImages().stream()
                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                        .findFirst()
                        .orElse(bike.getBikeImages().get(0));

                if (primaryImage.getImageUrl() != null) {
                    primaryImageUrl = storageServices.getFileDownloadUrl(primaryImage.getImageUrl());
                }
            }

            String categoryStr = bike.getBikeDetails() != null ? bike.getBikeDetails().getBikeCategory() : "PETROL";
            Integer engineCc = bike.getBikeDetails() != null ? bike.getBikeDetails().getEngineCc() : null;
            String transmission = bike.getBikeDetails() != null ? bike.getBikeDetails().getTransmission() : "MANUAL";

            return BikeCardDto.builder()
                    .id(bike.getBikeId())
                    .model(bike.getManufacturer() + " " + bike.getModel())
                    .manufacturer(bike.getManufacturer())
                    .category(categoryStr)
                    .engineCc(engineCc)
                    .fuelType("PETROL") // Default or map if stored in specs
                    .transmission(transmission)
                    .hourlyRate(bike.getHourlyRate())
                    .deposit(bike.getSecurityDeposit())
                    .primaryImageUrl(primaryImageUrl)
                    .dealerId(bike.getPartnerId())
                    .badge("VERIFIED")
                    .instant(true)
                    .build();
        });
    }

    @Override
    public BikeDetailDto getBikeDetailById(Integer bikeId) {
        Bike bike = bikeRepository.findByBikeIdAndApprovalStatusAndBikeStatusAndDeletedAtIsNull(
                bikeId, ApprovalStatus.APPROVED, BikeStatus.AVAILABLE
        ).orElseThrow(() -> new IllegalArgumentException("No bike with id " + bikeId));

        return mapToBikeDetailDto(bike);
    }

    @Override
    public BikeAvailabilityResponseDto getBikeAvailabilityById(Integer bikeId, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Invalid start date " + startDate + " and end date " + endDate);
        }

        Optional<Bike> bikeOpt = bikeRepository.findByBikeIdAndApprovalStatusAndBikeStatusAndDeletedAtIsNull(bikeId, ApprovalStatus.APPROVED, BikeStatus.AVAILABLE);

        if (bikeOpt.isEmpty()) {
            return BikeAvailabilityResponseDto.builder()
                    .bikeId(bikeId)
                    .available(false)
                    .build();
        }

        boolean isAvailable = true;

        try {
            BookingConflictResponseDto conflictResponseDto = bookingServiceClient.checkBikeConflict(bikeId, startDate, endDate);
            if (conflictResponseDto != null && conflictResponseDto.getHasConflict()) {
                isAvailable = false;
            }
        } catch (Exception e) {
            throw new RuntimeException("Booking service failed", e);
        }

        return BikeAvailabilityResponseDto.builder()
                .bikeId(bikeId)
                .available(isAvailable)
                .build();
    }

    @Override
    public List<BikeDetailDto> compareBikes(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        if (ids.size() > 4) {
            throw new IllegalArgumentException("You can compare a maximum of 4 bikes!");
        }

        List<Bike> bikes = bikeRepository.findByBikeIdInAndApprovalStatusAndBikeStatusAndDeletedAtIsNull(
                ids,
                ApprovalStatus.APPROVED,
                BikeStatus.AVAILABLE
        );

        Map<Integer, Bike> bikeMap = bikes.stream()
                .collect(Collectors.toMap(Bike::getBikeId, b -> b));

        return ids.stream()
                .filter(bikeMap::containsKey)
                .map(id -> mapToBikeDetailDto(bikeMap.get(id)))
                .collect(Collectors.toList());
    }

    @Override
    public InternalBikeDetailsDto getInternalBikeDetailById(Integer bikeId) {
        Bike bike = bikeRepository.findById(bikeId)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new IllegalArgumentException("No bike with id " + bikeId));

        boolean isBookable = bike.getBikeStatus() == BikeStatus.AVAILABLE
                && bike.getApprovalStatus() == ApprovalStatus.APPROVED;

        return InternalBikeDetailsDto.builder()
                .bikeId(bikeId)
                .hourlyRate(bike.getHourlyRate())
                .securityDeposit(bike.getSecurityDeposit())
                .partnerId(bike.getPartnerId())
                .bikeStatus(bike.getBikeStatus())
                .approvalStatus(bike.getApprovalStatus())
                .isBookable(isBookable)
                .build();
    }

    private BikeDetailDto mapToBikeDetailDto(Bike bike) {
        BikeDetails bikeDetails = bike.getBikeDetails();


        List<BikeImageResponseDto> images = new ArrayList<>();
        if (bike.getBikeImages() != null && !bike.getBikeImages().isEmpty()) {
            images = bike.getBikeImages().stream()
                    .sorted(Comparator.comparing(BikeImage::getDisplayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .map(img -> BikeImageResponseDto.builder()
                            .imageUrl(storageServices.getFileDownloadUrl(img.getImageUrl()))
                            .displayOrder(img.getDisplayOrder())
                            .isPrimary(img.getIsPrimary())
                            .build())
                    .collect(Collectors.toList());
        }
        List<String> includedItems = new ArrayList<>();
        Map<String, Object> additionalServices = bike.getAdditionalServices();
        if (additionalServices != null && additionalServices.containsKey("includedItems")) {
            Object itemsObj = additionalServices.get("includedItems");
            if (itemsObj instanceof List<?>) {
                for (Object item : (List<?>) itemsObj) {
                    if (item != null) includedItems.add(item.toString());
                }
            }
        }

        List<String> rentalTerms = List.of(
                "Original Driving License required at vehicle pickup",
                "Govt ID proof (Aadhaar / Passport) mandatory",
                "Fuel is not included; return at the same level",
                "Speed limit is 80 km/h; penalty applicable for overspeeding"
        );

        return BikeDetailDto.builder()
                .bikeId(bike.getBikeId())
                .name(bike.getManufacturer() + " " + bike.getModel())
                .manufacturer(bike.getManufacturer())
                .model(bike.getModel())
                .bikeCategory(bikeDetails != null ? bikeDetails.getBikeCategory() : null)
                .bikeType(bikeDetails != null ? bikeDetails.getBikeType() : null)
                .engineCc(bikeDetails != null ? bikeDetails.getEngineCc() : null)
                .transmission(bikeDetails != null ? bikeDetails.getTransmission() : null)
                .seatingCapacity(bikeDetails != null ? bikeDetails.getSeatingCapacity() : null)
                .yearOfManufacture(bikeDetails != null ? bikeDetails.getYearOfManufacture() : null)
                .color(bikeDetails != null ? bikeDetails.getColor() : null)
                .hourlyRate(bike.getHourlyRate())
                .securityDeposit(bike.getSecurityDeposit())
                .partnerId(bike.getPartnerId())
                .imageUrls(images)
                .additionalSpecs(bikeDetails != null ? bikeDetails.getAdditionalSpecs() : null)
                .additionalServices(additionalServices)
                .includedItems(includedItems)
                .rentalTerms(rentalTerms)
                .build();
    }

    private FleetListingDto mapToFleetListingDto(Bike bike) {
        FleetListingDto responseDto = new FleetListingDto();
        BeanUtils.copyProperties(bike, responseDto);

        if (bike.getRcUploadUrl() != null) {
            responseDto.setRcUploadUrl(storageServices.getFileDownloadUrl(bike.getRcUploadUrl()));
        }
        if (bike.getPucUploadUrl() != null) {
            responseDto.setPucUploadUrl(storageServices.getFileDownloadUrl(bike.getPucUploadUrl()));
        }

        // Map enums explicitly if your Response DTO exposes them as enums or strings
        responseDto.setBikeStatus(bike.getBikeStatus());
        responseDto.setApprovalStatus(bike.getApprovalStatus());

        // Map nested Insurance
        if (bike.getInsurance() != null) {
            InsuranceRequestDto insDto = new InsuranceRequestDto();
            BeanUtils.copyProperties(bike.getInsurance(), insDto);
            responseDto.setInsurance(insDto);
        }

        // Map nested BikeDetails
        if (bike.getBikeDetails() != null) {
            BikeDetailsRequestDto detailsDto = new BikeDetailsRequestDto();
            BeanUtils.copyProperties(bike.getBikeDetails(), detailsDto);
            responseDto.setBikeDetails(detailsDto);
        }

        // Map image gallery list
        if (bike.getBikeImages() != null) {
            var imageDtos = bike.getBikeImages().stream().map(img -> {
                BikeImageRequestDto imgDto = new BikeImageRequestDto();
                BeanUtils.copyProperties(img, imgDto);

                if (img.getImageUrl() != null) {
                    imgDto.setImageUrl(storageServices.getFileDownloadUrl(img.getImageUrl()));
                }

                return imgDto;
            }).collect(Collectors.toList());
            responseDto.setImages(imageDtos);
        }

        return responseDto;
    }
}
