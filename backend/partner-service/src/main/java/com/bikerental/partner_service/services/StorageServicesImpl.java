package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.request.FileUploadRequestUrlDto;
import com.bikerental.partner_service.dto.response.FileUploadUrlDto;
import com.bikerental.partner_service.exceptions.StorageOperationException;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http;
import io.minio.MinioClient;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class StorageServicesImpl implements StorageServices {
    
    private final MinioClient publicMinioClient;

    @Value("${minio.public-url}")
    private String publicUrl;

    @Value("${minio.bucket-name}")
    private String bucketName;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf", "image/jpg"
    );

    public StorageServicesImpl(@Qualifier("publicMinioClient") MinioClient publicMinioClient) {
        this.publicMinioClient = publicMinioClient;
    }

    @Override
    public FileUploadUrlDto getFileUploadUrl(FileUploadRequestUrlDto requestDto, Integer userId) {
        if (!ALLOWED_CONTENT_TYPES.contains(requestDto.getContentType().toLowerCase())) {
            throw new IllegalArgumentException("Invalid content type. Only JPG, PNG, WEBP, and PDF are allowed.");
        }

        try {
            // Extract extension from original fileName
            String originalFileName = requestDto.getFileName();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // 1. Build a structured object key path: partners/{userId}/{documentType}/{uuid}{ext}
            String folderPath = "partners/" + userId + "/" + requestDto.getDocumentType().toLowerCase();
            String objectKey = folderPath + "/" + UUID.randomUUID().toString() + extension;

            // 2. Build the short-lived Pre-Signed PUT Upload URL (valid for 15 minutes)
            String presignedUrl = publicMinioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.PUT)
                            .bucket(bucketName)
                            .object(objectKey)
                            .expiry(15, TimeUnit.MINUTES)
                            .extraHeaders(Map.of("Content-Type", requestDto.getContentType()))
                            .build()
            );

            // 3. Construct permanent storage path reference to save in PostgreSQL later
            String permanentFileUrl = publicUrl + "/" + bucketName + "/" + objectKey;

            // 4. Return DTO containing both URLs
            return new FileUploadUrlDto(presignedUrl, permanentFileUrl);

        } catch (Exception e) {
            throw new StorageOperationException("Failed to communicate with the storage server to generate upload URL.");
        }
    }

    @Override
    public String getFileDownloadUrl(String permanentFileUrl) {
        try {
            String prefixToRemove = publicUrl + "/" + bucketName + "/";
            String objectKey = permanentFileUrl.replaceAll(prefixToRemove, "");

            return publicMinioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.GET)
                            .bucket(bucketName)
                            .object(objectKey)
                            .expiry(30, TimeUnit.MINUTES)
                            .build()
            );
        } catch (MinioException e) {
            throw new StorageOperationException("Failed to generate download URL.");
        }
    }
}