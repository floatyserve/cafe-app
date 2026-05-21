package com.example.cafe_system.order.service;

import com.example.cafe_system.order.domain.OrderItem;
import com.example.cafe_system.order.domain.OrderItemStatus;

import java.util.List;

public interface OrderItemService {
    OrderItem updateStatus(Long id, OrderItemStatus status);

    List<OrderItem> findByOrderId(Long orderId);
}
