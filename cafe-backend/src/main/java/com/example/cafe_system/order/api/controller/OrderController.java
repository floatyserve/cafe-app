package com.example.cafe_system.order.api.controller;

import com.example.cafe_system.order.api.dto.CreateOrderRequest;
import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.mapper.OrderMapper;
import com.example.cafe_system.order.service.OrderService;
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

    @GetMapping
    public List<OrderDto> getAllOpenOrders() {
        return orderService.getAllOpenOrders()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

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

    @PutMapping("/{id}/pay")
    public OrderDto payOrder(@PathVariable Long id) {
        return mapper.toDto(orderService.payOrder(id));
    }
}
