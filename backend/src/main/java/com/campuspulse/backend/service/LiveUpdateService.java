package com.campuspulse.backend.service;

import com.campuspulse.backend.websocket.CampusWebSocketHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class LiveUpdateService {

    private final RedisService redisService;
    private final CampusWebSocketHandler webSocketHandler;

    public LiveUpdateService(
            RedisService redisService,
            CampusWebSocketHandler webSocketHandler) {

        this.redisService = redisService;
        this.webSocketHandler = webSocketHandler;
    }

    @Scheduled(fixedRate = 2000)
    public void sendLiveUpdates() {

        String library = redisService.getValue("processed:Library");
        String canteen = redisService.getValue("processed:Canteen");
        String lab = redisService.getValue("processed:Lab");

        String message = "{"
                + "\"Library\":" + (library == null ? "null" : library) + ","
                + "\"Canteen\":" + (canteen == null ? "null" : canteen) + ","
                + "\"Lab\":" + (lab == null ? "null" : lab)
                + "}";

        webSocketHandler.broadcast(message);
    }
}