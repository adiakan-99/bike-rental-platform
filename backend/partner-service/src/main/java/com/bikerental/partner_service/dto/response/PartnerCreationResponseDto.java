package com.bikerental.partner_service.dto.response;

import lombok.Data;

import java.io.Serializable;

/**
 * DTO for {@link com.bikerental.partner_service.entities.Partner}
 */
@Data
public class PartnerCreationResponseDto implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 4321444828336596501L;
	private Integer partnerId;
    private String sellerType;
    private String approvalStatus;
}