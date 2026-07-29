package com.bikerental.bike_service.service;

import com.bikerental.bike_service.client.PartnerServiceClient;
import com.bikerental.bike_service.dto.PartnerStatusDto;
import com.bikerental.bike_service.dto.request.BikeDetailsRequestDto;
import com.bikerental.bike_service.dto.request.BikeImageRequestDto;
import com.bikerental.bike_service.dto.request.BikeListingRequestDto;
import com.bikerental.bike_service.dto.request.InsuranceRequestDto;
import com.bikerental.bike_service.dto.response.FleetListingDto;
import com.bikerental.bike_service.entity.Bike;
import com.bikerental.bike_service.entity.BikeDetails;
import com.bikerental.bike_service.entity.BikeImage;
import com.bikerental.bike_service.entity.Insurance;
import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import com.bikerental.bike_service.repository.BikeDetailRepository;
import com.bikerental.bike_service.repository.BikeImageRepository;
import com.bikerental.bike_service.repository.BikeRepository;
import com.bikerental.bike_service.repository.InsuranceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BikeServicesImpl implements BikeServices {
    private final BikeRepository bikeRepository;
    private final BikeDetailRepository bikeDetailRepository;
    private final InsuranceRepository insuranceRepository;
    private final BikeImageRepository bikeImageRepository;
    private final PartnerServiceClient partnerServiceClient;

    public BikeServicesImpl(BikeRepository bikeRepository,
                            BikeDetailRepository bikeDetailRepository,
                            InsuranceRepository insuranceRepository,
                            BikeImageRepository bikeImageRepository,
                            PartnerServiceClient partnerServiceClient) {
        this.bikeRepository = bikeRepository;
        this.bikeDetailRepository = bikeDetailRepository;
        this.insuranceRepository = insuranceRepository;
        this.bikeImageRepository = bikeImageRepository;
        this.partnerServiceClient = partnerServiceClient;
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

    private FleetListingDto mapToFleetListingDto(Bike bike) {
        FleetListingDto responseDto = new FleetListingDto();
        BeanUtils.copyProperties(bike, responseDto);

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
                return imgDto;
            }).collect(Collectors.toList());
            responseDto.setImages(imageDtos);
        }

        return responseDto;
    }
}
