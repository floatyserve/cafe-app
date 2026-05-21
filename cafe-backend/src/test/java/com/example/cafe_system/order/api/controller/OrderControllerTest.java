package com.example.cafe_system.order.api.controller;

import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.order.api.dto.CreateOrderRequest;
import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.order.mapper.OrderMapper;
import com.example.cafe_system.order.notification.OrderNotificationService;
import com.example.cafe_system.order.service.OrderService;

import com.example.cafe_system.security.service.JwtService;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserDetailsService userService;

    @MockitoBean private OrderService orderService;
    @MockitoBean private OrderMapper orderMapper;
    @MockitoBean private OrderNotificationService notificationService;

    private final Long TABLE_ID = 5L;
    private final Long ORDER_ID = 100L;

    @Nested
    class CreateOrder {

        @Test
        void shouldReturn201Created_WhenRequestIsValid() throws Exception {
            CreateOrderRequest request = new CreateOrderRequest(TABLE_ID);

            Order mockOrder = mock(Order.class);
            OrderDto expectedDto = new OrderDto(ORDER_ID, TABLE_ID, OrderState.OPEN, Instant.now(), null);

            when(orderService.createOrder(TABLE_ID)).thenReturn(mockOrder);
            when(orderMapper.toDto(mockOrder)).thenReturn(expectedDto);

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(ORDER_ID))
                    .andExpect(jsonPath("$.tableId").value(TABLE_ID))
                    .andExpect(jsonPath("$.state").value("OPEN"));
        }

        @Test
        void shouldReturn400BadRequest_WhenTableIdIsNull() throws Exception {
            CreateOrderRequest invalidRequest = new CreateOrderRequest(null);

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn404NotFound_WhenTableDoesNotExist() throws Exception {
            Long nonExistentTableId = 999L;
            CreateOrderRequest request = new CreateOrderRequest(nonExistentTableId);

            when(orderService.createOrder(nonExistentTableId))
                    .thenThrow(new ReferenceNotFoundException("Table not found with id " + nonExistentTableId));

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    class PayOrder {

        @Test
        void shouldReturn200Ok_WhenPaymentIsSuccessful() throws Exception {
            Order mockOrder = mock(Order.class);
            OrderDto paidDto = new OrderDto(ORDER_ID, TABLE_ID, OrderState.PAID, Instant.now(), Instant.now());

            when(orderService.payOrder(ORDER_ID)).thenReturn(mockOrder);
            when(orderMapper.toDto(mockOrder)).thenReturn(paidDto);

            mockMvc.perform(put("/api/orders/{id}/pay", ORDER_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.state").value("PAID"))
                    .andExpect(jsonPath("$.paidAt").exists());
        }

        @Test
        void shouldReturn404NotFound_WhenPayingForNonExistentOrder() throws Exception {
            when(orderService.payOrder(ORDER_ID))
                    .thenThrow(new ReferenceNotFoundException("Order not found"));

            mockMvc.perform(put("/api/orders/{id}/pay", ORDER_ID))
                    .andExpect(status().isNotFound());
        }

        @Test
        void shouldReturn400BadRequest_WhenOrderIsAlreadyPaid() throws Exception {
            when(orderService.payOrder(ORDER_ID))
                    .thenThrow(new BadRequestException("Order is already paid"));

            mockMvc.perform(put("/api/orders/{id}/pay", ORDER_ID))
                    .andExpect(status().isBadRequest());
        }
    }
}