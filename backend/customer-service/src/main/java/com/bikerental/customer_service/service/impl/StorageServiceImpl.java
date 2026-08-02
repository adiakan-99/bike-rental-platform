package com.bikerental.customer_service.service.impl;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bikerental.customer_service.dto.UploadUrlRequestDTO;
import com.bikerental.customer_service.dto.UploadUrlResponseDTO;
import com.bikerental.customer_service.service.StorageService;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http.Method;
import io.minio.MinioClient;

@Service
public class StorageServiceImpl implements StorageService {

	private final MinioClient publicMinioClient;
	
	public StorageServiceImpl(
			@Qualifier("publicMinioClient") MinioClient publiMinioClient) {
		this.publicMinioClient = publiMinioClient;
	}

	@Value("${minio.bucket-name}")
	private String bucketName;

	@Override
	public UploadUrlResponseDTO generateUploadUrl(Integer userId,
			UploadUrlRequestDTO request) {

		try {

			String objectName = "customer/" + userId + "/"
					+ request.getDocumentType() + "/" + UUID.randomUUID() + "-"
					+ request.getFileName();

			GetPresignedObjectUrlArgs args = GetPresignedObjectUrlArgs.builder()
					.method(Method.PUT).bucket(bucketName).object(objectName)
					.expiry(15, TimeUnit.MINUTES).build();

			String url = publicMinioClient.getPresignedObjectUrl(args);

			return new UploadUrlResponseDTO(url, objectName);

		} catch (Exception e) {

			e.printStackTrace();

			throw new RuntimeException("Failed to generate upload url");
		}
	}

}