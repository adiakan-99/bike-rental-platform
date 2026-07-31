package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.Bike;
import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Integer> {
    List<Bike> findByPartnerIdAndDeletedAtIsNull(Integer partnerId);
    boolean existsByRegistrationNumber(String registrationNumber);
    Optional<Bike> findByBikeIdAndPartnerIdAndDeletedAtIsNull(Integer bikeId, Integer partnerId);
    Page<Bike> findByApprovalStatusAndDeletedAtIsNull(ApprovalStatus approvalStatus, Pageable pageable);
    @Query("SELECT b FROM Bike b JOIN b.bikeDetails d WHERE " +
            "b.approvalStatus = com.bikerental.bike_service.enums.ApprovalStatus.APPROVED AND " +
            "b.bikeStatus = com.bikerental.bike_service.enums.BikeStatus.AVAILABLE AND " +
            "b.deletedAt IS NULL AND " +
            "(:partnerIds IS NULL OR b.partnerId IN :partnerIds) AND " +
            "(:excludedBikeIds IS NULL OR b.bikeId NOT IN :excludedBikeIds) AND " + // 🔑 Exclude booked bikes
            "(:manufacturer IS NULL OR LOWER(b.manufacturer) = LOWER(:manufacturer)) AND " +
            "(:category IS NULL OR LOWER(d.bikeCategory) = LOWER(:category)) AND " +
            "(:minPrice IS NULL OR b.hourlyRate >= :minPrice) AND " +
            "(:maxPrice IS NULL OR b.hourlyRate <= :maxPrice)")
    Page<Bike> searchBikes(
            @Param("partnerIds") List<Integer> partnerIds,
            @Param("excludedBikeIds") List<Integer> excludedBikeIds,
            @Param("manufacturer") String manufacturer,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
    Optional<Bike> findByBikeIdAndApprovalStatusAndBikeStatusAndDeletedAtIsNull(
            Integer bikeId,
            ApprovalStatus approvalStatus,
            BikeStatus bikeStatus
    );

    List<Bike> findByBikeIdInAndApprovalStatusAndBikeStatusAndDeletedAtIsNull(
            List<Integer> bikeIds,
            ApprovalStatus approvalStatus,
            BikeStatus bikeStatus
    );
}