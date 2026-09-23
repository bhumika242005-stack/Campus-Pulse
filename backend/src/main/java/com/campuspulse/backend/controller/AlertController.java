package com.campuspulse.backend.controller;

import com.campuspulse.backend.service.RedisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AlertController {

    private final RedisService redisService;

    public AlertController(RedisService redisService) {
        this.redisService = redisService;
    }

    @GetMapping("/api/alerts")
    public String getAlerts() {
        return redisService.getValue("alert:Library");
    }
}