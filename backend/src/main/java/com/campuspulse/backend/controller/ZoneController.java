
package com.campuspulse.backend.controller;

import com.campuspulse.backend.service.RedisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class ZoneController {

    private final RedisService redisService;

    public ZoneController(RedisService redisService) {
        this.redisService = redisService;
    }

    @GetMapping("/api/zones")
    public Map<String, Integer> getZones() {

        Map<String, Integer> zones = new LinkedHashMap<>();

        zones.put("Library", getOccupancy("Library"));
        zones.put("Canteen", getOccupancy("Canteen"));
        zones.put("Lab", getOccupancy("Lab"));

        return zones;
    }

    private Integer getOccupancy(String zone) {

        String value = redisService.getValue("zone:" + zone);

        // No processed events yet means initial occupancy is zero.
        if (value == null || value.isBlank()) {
            return 0;
        }

        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                "Invalid occupancy value in Redis for zone: " + zone,
                e
            );
        }
    }
}
