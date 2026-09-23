package com.campuspulse.backend.controller;

import com.campuspulse.backend.service.RedisService;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class ZoneController {

    private final RedisService redisService;
    private final ObjectMapper objectMapper;

    public ZoneController(
            RedisService redisService,
            ObjectMapper objectMapper) {

        this.redisService = redisService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/zones")
    public Map<String, Object> getZones() {

        Map<String, Object> zones = new LinkedHashMap<>();

        zones.put("Library", parseZone("processed:Library"));
        zones.put("Canteen", parseZone("processed:Canteen"));
        zones.put("Lab", parseZone("processed:Lab"));

        return zones;
    }

    private Object parseZone(String key) {

        String value = redisService.getValue(key);

        if (value == null) {
            return null;
        }

        try {
            return objectMapper.readValue(
                    value,
                    new TypeReference<Map<String, Object>>() {}
            );
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Redis data for " + key,
                    e
            );
        }
    }
}