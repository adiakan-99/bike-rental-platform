package com.bikerental.auth_service.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaServiceImpl implements CaptchaService {

	@Value("${captcha.secret-key}")
	private String secretKey;

	@Value("${captcha.verify-url}")
	private String verifyUrl;

	private final RestTemplate restTemplate = new RestTemplate();

	public boolean verifyCaptcha(String captchaToken) {

		if (captchaToken == null || captchaToken.isEmpty()) {
			return false;
		}

		MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();
		requestParams.add("secret", secretKey);
		requestParams.add("response", captchaToken);

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(
				requestParams, headers);

		Map response = restTemplate.postForObject(verifyUrl, request,
				Map.class);

		return Boolean.TRUE.equals(response.get("success"));

	}
}