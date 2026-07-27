package com.bikerental.auth_service.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

	@Value("${recaptcha.secret}")
	private String recaptchaSecret;

	@Value("${recaptcha.url}")
	private String recaptchaUrl;

	public boolean verifyCaptcha(String captchaToken) {
		if (captchaToken == null || captchaToken.isEmpty()) {
			return false;
		}

		RestTemplate restTemplate = new RestTemplate();

		MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();
		requestParams.add("secret", recaptchaSecret);
		requestParams.add("response", captchaToken);

		try {
			// Send POST request to Google reCAPTCHA Verification Endpoint
			Map<String, Object> response = restTemplate.postForObject(recaptchaUrl, requestParams, Map.class);

			if (response != null && response.containsKey("success")) {
				return (Boolean) response.get("success");
			}
		} catch (Exception e) {
			// Log error appropriately
			return false;
		}

		return false;
	}
}