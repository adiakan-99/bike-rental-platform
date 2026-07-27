package com.bikerental.auth_service.enums;

public enum PartnerStatus {
	NOT_APPLIED,

	PENDING,  // while registering

	APPROVED,	// admin approves // also asing partner role // must check kyc status what to do

	REJECTED,	// admin rejects

	SUSPENDED	// admin can suspend it 

}