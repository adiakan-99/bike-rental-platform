package com.bikerental.auth_service.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test Controller", description = "Endpoint to verify Swagger integration")
public class TestController {

    @GetMapping("/hello")
    @Operation(summary = "Get hello message", description = "Returns a simple greeting to confirm Swagger is scanning endpoints.")
    public String sayHello() {
        return "Hello, Swagger is working!";
    }
}