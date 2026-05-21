package com.example.cafe_system.order.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.order.domain.OrderItem;
import com.example.cafe_system.order.domain.OrderItemStatus;
import com.example.cafe_system.order.repository.OrderItemRepository;
import com.example.cafe_system.order.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderItemServiceJpa implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final Clock clock;

    @Override
    public OrderItem updateStatus(Long id, OrderItemStatus status) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ReferenceNotFoundException("Order item with id " + id + " not found"));

        orderItem.updateStatus(status, clock.instant());

        return orderItemRepository.save(orderItem);
    }

    @Override
    public List<OrderItem> findByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
