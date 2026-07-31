package com.bikerental.bike_service.client;

import com.bikerental.bike_service.dto.response.BookingConflictResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@FeignClient(name = "booking-service", url = "${booking.service.url}")
public interface BookingServiceClient {
    @GetMapping("/api/v1/bookings/internal/check-conflict")
    BookingConflictResponseDto checkBikeConflict(
            @RequestParam("bikeId") Integer bikeId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    );
}
