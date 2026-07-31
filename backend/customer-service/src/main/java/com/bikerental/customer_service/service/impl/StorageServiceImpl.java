package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.FileUploadRequestDto;
import com.bikerental.customer_service.dto.FileUploadResponseDto;
import com.bikerental.customer_service.service.StorageService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    @Override
    public FileUploadResponseDto generateUploadUrl(FileUploadRequestDto request) {

        try {

            String extension = "";

            if (request.getFileName().contains(".")) {
                extension = request.getFileName()
                        .substring(request.getFileName().lastIndexOf("."));
            }

            String objectName = "kyc/"
                    + UUID.randomUUID()
                    + extension;

            String uploadUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.PUT)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(10, TimeUnit.MINUTES)
                            .build()
            );

            String fileUrl = minioUrl
                    + "/"
                    + bucketName
                    + "/"
                    + objectName;

            return new FileUploadResponseDto(uploadUrl, fileUrl);

        } catch (Exception e) {
            throw new RuntimeException("Unable to generate upload URL", e);
        }
    }
}