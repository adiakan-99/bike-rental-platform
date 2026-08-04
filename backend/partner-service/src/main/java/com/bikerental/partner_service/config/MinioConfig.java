package com.bikerental.partner_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;
@Configuration
public class MinioConfig {

	@Value("${minio.internal-url}")
	private String internalUrl;

	@Value("${minio.public-url}")
	private String publicUrl;

	@Value("${minio.access-key}")
	private String accessKey;

	@Value("${minio.secret-key}")
	private String secretKey;

	@Bean
	public MinioClient minioClient() {
		return MinioClient.builder().endpoint(internalUrl)
				.credentials(accessKey, secretKey).build();
	}

	@Bean
	public MinioClient publicMinioClient() {
		return MinioClient.builder().endpoint(publicUrl)
				.credentials(accessKey, secretKey).build();
	}
}
