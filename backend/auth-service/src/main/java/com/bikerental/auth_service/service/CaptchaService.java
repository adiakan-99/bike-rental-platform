package com.bikerental.auth_service.service;

public interface CaptchaService {

	boolean verifyCaptcha(String token);

}
