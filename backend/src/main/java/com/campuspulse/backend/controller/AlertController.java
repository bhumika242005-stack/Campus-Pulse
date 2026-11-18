
package com.campuspulse.backend.controller;

import com.campuspulse.backend.service.RedisService;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@RestController
public class AlertController {

    private final RedisService redisService;
    private final ObjectMapper objectMapper;

    public AlertController(
            RedisService redisService,
            ObjectMapper objectMapper
    ) {
        this.redisService = redisService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/alerts")
    public List<Map<String, Object>> getAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();

        addAlert(alerts, "alert:Library");
        addAlert(alerts, "alert:Canteen");
        addAlert(alerts, "alert:Lab");

        return alerts;
    }

    private void addAlert(
            List<Map<String, Object>> alerts,
            String key
    ) {
        String value = redisService.getValue(key);

        if (value == null) {
            return;
        }

        try {
            alerts.add(objectMapper.readValue(
                value,
                new TypeReference<Map<String, Object>>() {}
            ));
        } catch (Exception e) {
            throw new RuntimeException(
                "Failed to parse alert data for " + key, e
            );
        }
    }
}
