package com.example.cafe_system.order.api.controller;

import com.example.cafe_system.order.api.dto.AddOrderItemRequest;
import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.api.dto.OrderItemDto;
import com.example.cafe_system.order.api.dto.UpdateOrderItemStatusRequest;
import com.example.cafe_system.order.mapper.OrderItemMapper;
import com.example.cafe_system.order.mapper.OrderMapper;
import com.example.cafe_system.order.notification.OrderNotificationService;
import com.example.cafe_system.order.service.OrderItemService;
import com.example.cafe_system.order.service.OrderService;
import com.example.cafe_system.order.service.model.AddOrderItemCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;
    private final OrderService orderService;
    private final OrderItemMapper orderItemMapper;
    private final OrderMapper orderMapper;
    private final OrderNotificationService orderNotificationService;

    @GetMapping("/api/orders/{orderId}/items")
    public List<OrderItemDto> getItemsByOrder(@PathVariable Long orderId) {
        return orderItemService.findByOrderId(orderId)
                .stream()
                .map(orderItemMapper::toDto)
                .toList();
    }

    @PostMapping("/api/orders/{orderId}/items")
    public OrderDto addItemsToOrder(
            @PathVariable Long orderId,
            @RequestBody @Valid List<AddOrderItemRequest> requests
    ) {
        var commands = requests.stream()
                .map(req -> new AddOrderItemCommand(req.menuItemId(), req.quantity(), req.note()))
                .toList();

        var updatedOrder = orderService.addItemsToOrder(orderId, commands);
        var orderDto = orderMapper.toDto(updatedOrder);
        
        orderNotificationService.notifyOrderUpdated(orderDto);
        
        return orderDto;
    }

    @PatchMapping("/api/order-items/{id}/status")
    public OrderItemDto updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateOrderItemStatusRequest request
    ) {
        var updatedItem = orderItemService.updateStatus(id, request.status());

        orderNotificationService.notifyOrderUpdated(orderMapper.toDto(updatedItem.getOrder()));
        
        return orderItemMapper.toDto(updatedItem);
    }
}
