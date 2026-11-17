
package com.campuspulse.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campuspulse.backend.service.RedisService;

@RestController
public class AlertController {

    private final RedisService redisService;

    public AlertController(RedisService redisService) {
        this.redisService = redisService;
    }

    @GetMapping("/api/alerts")
    public String getAlerts() {
        String alert = redisService.getValue("alert:Library");

        if (alert == null || alert.isBlank()) {
            return "[]";
        }

        return alert;
    }
}
