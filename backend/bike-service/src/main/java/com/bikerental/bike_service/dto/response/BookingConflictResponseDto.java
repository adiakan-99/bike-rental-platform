package com.bikerental.bike_service.dto.response;

import lombok.Data;

@Data
public class BookingConflictResponseDto {
    private Boolean hasConflict;
    private int overlappingBookingCount;
}
