package com.bikerental.bike_service.client;

import com.bikerental.bike_service.config.FeignClientConfig;
import com.bikerental.bike_service.dto.PartnerStatusDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "partner-service", url = "${partner.service.url}", configuration = FeignClientConfig.class)
public interface PartnerServiceClient {
    @GetMapping("/api/v1/internal/partners/{id}/status")
    PartnerStatusDto getPartnerStatus(@PathVariable("id") Integer id);
}
