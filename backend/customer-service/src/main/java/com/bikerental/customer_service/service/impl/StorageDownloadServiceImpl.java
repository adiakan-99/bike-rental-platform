package com.bikerental.customer_service.service.impl;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bikerental.customer_service.customer.DTO.FileDownloadResponseDTO;
import com.bikerental.customer_service.service.StorageDownloadService;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http.Method;
import io.minio.MinioClient;
import io.minio.errors.MinioException;

@Service
public class StorageDownloadServiceImpl implements StorageDownloadService {

	private final MinioClient publicMinioClient;

	@Value("${minio.bucket-name}")
	private String bucketName;

	public StorageDownloadServiceImpl(
			@Qualifier("publicMinioClient") MinioClient publicMinioClient) {
		this.publicMinioClient = publicMinioClient;
	}

	@Override
	public FileDownloadResponseDTO generateDownloadUrl(String objectName) {
		// TODO Auto-generated method stub

		try {
			String downloadUrl = publicMinioClient.getPresignedObjectUrl(
					GetPresignedObjectUrlArgs.builder().method(Method.GET)
							.bucket(bucketName).object(objectName)
							.expiry(30, TimeUnit.MINUTES).build());

			return new FileDownloadResponseDTO(downloadUrl);
		} catch (MinioException e) {
			// TODO Auto-generated catch block
			throw new RuntimeException("Failed to generate Download URL");
		}

	}

}
