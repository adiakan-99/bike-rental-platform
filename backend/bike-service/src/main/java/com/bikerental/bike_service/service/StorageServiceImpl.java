package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.FileUploadRequestUrlDto;
import com.bikerental.bike_service.dto.response.FileUploadUrlDto;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http;
import io.minio.MinioClient;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class StorageServiceImpl implements StorageServices {
    private final MinioClient minioClient;

    private final List<String> ALLOWED_FILE_TYPES = List.of(
            "image/jpg", "image/jpeg", "image/png", "image/bmp", "image/gif", "image/gif", "application/pdf"
    );

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.bucket-name}")
    private String minioBucketName;

    public StorageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public FileUploadUrlDto getFileUploadUrlDto(FileUploadRequestUrlDto requestDto) {
        if (!ALLOWED_FILE_TYPES.contains(requestDto.getContentType())) {
            throw new RuntimeException("Invalid file type.");
        }

        String originalFileName = requestDto.getFileName();
        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String folderPath = "bikes/" + requestDto.getDocumentType().toLowerCase();
        String objectKey = folderPath + "/" + UUID.randomUUID().toString() + extension;

        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.PUT)
                            .bucket(minioBucketName)
                            .object(objectKey)
                            .expiry(15, TimeUnit.MINUTES)
                            .extraHeaders(Map.of("Content-Type", requestDto.getContentType()))
                            .build()
            );

            String permanentFileUrl = minioUrl + "/" + minioBucketName + "/" + objectKey;

            FileUploadUrlDto fileUploadUrlDto = new FileUploadUrlDto();
            fileUploadUrlDto.setUploadUrl(presignedUrl);
            fileUploadUrlDto.setFileUrl(permanentFileUrl);

            return fileUploadUrlDto;
        } catch (MinioException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getFileDownloadUrl(String permanentFileUrl) {
        String prefixToRemove = minioUrl + "/" + minioBucketName + "/";
        String objectKey = permanentFileUrl.replaceAll(prefixToRemove, "");

        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.GET)
                            .bucket(minioBucketName)
                            .object(objectKey)
                            .expiry(1, TimeUnit.DAYS)
                            .build()
            );
        } catch (MinioException e) {
            throw new RuntimeException(e);
        }
    }
}
