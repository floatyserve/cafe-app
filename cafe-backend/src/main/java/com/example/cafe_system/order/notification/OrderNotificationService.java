package com.example.cafe_system.order.notification;

import com.example.cafe_system.common.WebSocketDestinations;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyOrderUpdated(Object orderDto) {
        messagingTemplate.convertAndSend(WebSocketDestinations.KITCHEN_TOPIC, orderDto);
        messagingTemplate.convertAndSend(WebSocketDestinations.BAR_TOPIC, orderDto);
    }
}
