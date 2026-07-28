package com.bikerental.partner_service.repositories;

import com.bikerental.partner_service.entities.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Integer> {
    boolean existsByUserId(Integer userId);

    Optional<Partner> findByUserId(Integer userId);

    Page<Partner> findByApprovalStatus(String approvalStatus, Pageable pageable);

    @Query("Select p from Partner p where " +
            "(:city is null or p.city = :city) AND " +
            "(:accountStatus is null or p.accountStatus = :accountStatus) AND " +
            "(:search IS NULL OR LOWER(p.businessName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Partner> findAllWithFilters(@Param("city")  String city,
                                     @Param("accountStatus") String accountStatus,
                                     @Param("search") String search,
                                     Pageable pageable);
}