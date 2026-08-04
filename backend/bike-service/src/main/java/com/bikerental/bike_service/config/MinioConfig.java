package com.bikerental.bike_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

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
	@Primary
	public MinioClient internalMinioClient() {

		return MinioClient.builder().endpoint(internalUrl)
				.credentials(accessKey, secretKey).build();
	}

	@Bean(name = "publicMinioClient")
	public MinioClient publicMinioClient() {

		return MinioClient.builder().endpoint(publicUrl)
				.credentials(accessKey, secretKey).region("us-east-1").build();
	}
}