package com.example.cafe_system.order.api.controller;

import com.example.cafe_system.order.api.dto.AddOrderItemRequest;
import com.example.cafe_system.order.api.dto.CreateOrderRequest;
import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.mapper.OrderMapper;
import com.example.cafe_system.order.notification.OrderNotificationService;
import com.example.cafe_system.order.service.OrderService;
import com.example.cafe_system.order.service.model.AddOrderItemCommand;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper mapper;
    private final OrderNotificationService orderNotificationService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody @Valid CreateOrderRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        mapper.toDto(
                                orderService.createOrder(request.cafeTableId())
                        )
                );
    }

    @PostMapping("/{id}/items")
    public OrderDto addItemsToOrder(
            @PathVariable Long id,
            @RequestBody @Valid List<AddOrderItemRequest> requests
    ) {
        var commands = requests.stream()
                .map(req -> new AddOrderItemCommand(req.menuItemId(), req.quantity(), req.note()))
                .toList();

        OrderDto updatedOrder = mapper.toDto(orderService.addItemsToOrder(id, commands));

        orderNotificationService.notifyOrderUpdated(updatedOrder);

        return updatedOrder;
    }

    @PutMapping("/{id}/pay")
    public OrderDto payOrder(@PathVariable Long id) {
        return mapper.toDto(orderService.payOrder(id));
    }
}
