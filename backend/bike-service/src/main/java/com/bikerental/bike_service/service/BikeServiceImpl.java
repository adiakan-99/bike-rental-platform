package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.BikeCreateRequestDTO;
import com.bikerental.bike_service.dto.response.BikeResponseDTO;
import com.bikerental.bike_service.entity.Bike;
import com.bikerental.bike_service.entity.BikeDetail;
import com.bikerental.bike_service.entity.Insurance;
import com.bikerental.bike_service.repository.BikeDetailRepository;
import com.bikerental.bike_service.repository.BikeRepository;
import com.bikerental.bike_service.repository.InsuranceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@Transactional
public class BikeServiceImpl implements BikeService {

    private final BikeRepository bikeRepository;
    private final InsuranceRepository insuranceRepository;
    private final BikeDetailRepository bikeDetailRepository;


    public BikeServiceImpl(BikeRepository bikeRepository,
                           InsuranceRepository insuranceRepository,
                           BikeDetailRepository bikeDetailRepository) {
        this.bikeRepository = bikeRepository;
        this.insuranceRepository = insuranceRepository;
        this.bikeDetailRepository = bikeDetailRepository;
    }

    @Override
    public BikeResponseDTO createBike(BikeCreateRequestDTO request) {

        // Temporary: use dummy insurance record
        Insurance insurance = insuranceRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Insurance record not found"));

        Bike bike = new Bike();

        // Temporary until JWT authentication is implemented
        bike.setPartnerId(1);

        // Basic Bike Information
        bike.setModel(request.getModelName());
        bike.setManufacturer(request.getManufacturer());
        bike.setRegistrationNumber(request.getRegistrationNumber());

        // Pricing
        bike.setHourlyRate(request.getHourlyRate());
        bike.setSecurityDeposit(request.getSecurityDeposit());

        // Documents
        bike.setRcUploadUrl(request.getDocuments().getRcCertificateUrl());
        bike.setPucUploadUrl(request.getDocuments().getPucUrl());

        bike.setRegistrationExpiry(
                request.getDocuments().getRcExpiryDate());

        bike.setPucExpiry(
                request.getDocuments().getPucExpiryDate());

        // Insurance
        bike.setInsurance(insurance);

        // Default Values
        bike.setBikeStatus("DRAFT");
        bike.setApprovalStatus("PENDING_APPROVAL");
        bike.setCreatedAt(OffsetDateTime.now());

        // Save
        Bike savedBike = bikeRepository.save(bike);

        //bikeDetails start

        BikeDetail bikeDetail = new BikeDetail();

        bikeDetail.setBike(savedBike);

        bikeDetail.setBikeCategory(
                request.getBikeDetail().getCategory());

        bikeDetail.setBikeType(
                request.getBikeDetail().getFuelType());

        bikeDetail.setEngineCc(
                request.getBikeDetail().getEngineCC());

        bikeDetail.setTransmission(
                request.getBikeDetail().getTransmission());

        bikeDetail.setYearOfManufacture(
                request.getBikeDetail().getManufacturingYear());

        bikeDetail.setSeatingCapacity(
                request.getBikeDetail().getSeatingCapacity());

        bikeDetail.setColor(
                request.getBikeDetail().getColor());
        
        bikeDetailRepository.save(bikeDetail);
        //bikeDetails end

        // Response
        BikeResponseDTO response = new BikeResponseDTO();
        response.setBikeId(savedBike.getId());
        response.setModelName(savedBike.getModel());
        response.setManufacturer(savedBike.getManufacturer());
        response.setRegistrationNumber(savedBike.getRegistrationNumber());
        response.setPricePerDay(savedBike.getHourlyRate());
        response.setBikeStatus(savedBike.getBikeStatus());
        response.setApprovalStatus(savedBike.getApprovalStatus());

        return response;
    }
}