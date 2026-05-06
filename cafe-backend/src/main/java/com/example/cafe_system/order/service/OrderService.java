package com.example.cafe_system.order.service;

import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.service.model.AddOrderItemCommand;

import java.util.List;

public interface OrderService {
    Order createOrder(int cafeTableNumber);

    Order addItemsToOrder(Long orderId, List<AddOrderItemCommand> requests);

    Order payOrder(Long orderId);
}
