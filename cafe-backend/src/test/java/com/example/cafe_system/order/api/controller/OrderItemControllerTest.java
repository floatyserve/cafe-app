package com.example.cafe_system.order.api.controller;

import com.example.cafe_system.order.api.dto.AddOrderItemRequest;
import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.api.dto.OrderItemDto;
import com.example.cafe_system.order.api.dto.UpdateOrderItemStatusRequest;
import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.domain.OrderItem;
import com.example.cafe_system.order.domain.OrderItemStatus;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.order.mapper.OrderItemMapper;
import com.example.cafe_system.order.mapper.OrderMapper;
import com.example.cafe_system.order.notification.OrderNotificationService;
import com.example.cafe_system.order.service.OrderItemService;
import com.example.cafe_system.order.service.OrderService;
import com.example.cafe_system.security.service.JwtService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderItemController.class)
public class OrderItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserDetailsService userService;

    @MockitoBean private OrderItemService orderItemService;
    @MockitoBean private OrderService orderService;
    @MockitoBean private OrderItemMapper orderItemMapper;
    @MockitoBean private OrderMapper orderMapper;
    @MockitoBean private OrderNotificationService notificationService;

    private final Long ORDER_ID = 100L;
    private final Long ITEM_ID = 500L;

    @Nested
    class GetItemsByOrder {

        @Test
        void shouldReturnList() throws Exception {
            OrderItem mockItem = mock(OrderItem.class);
            OrderItemDto expectedDto = new OrderItemDto(
                    ITEM_ID, ORDER_ID, 1L, "Latte", 350, 1, null, OrderItemStatus.PENDING
            );

            when(orderItemService.findByOrderId(ORDER_ID)).thenReturn(List.of(mockItem));
            when(orderItemMapper.toDto(mockItem)).thenReturn(expectedDto);

            mockMvc.perform(get("/api/orders/{orderId}/items", ORDER_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(ITEM_ID));
        }
    }

    @Nested
    class AddItemsToOrder {

        @Test
        void shouldReturn200Ok_AndTriggerNotification() throws Exception {
            List<AddOrderItemRequest> requests = List.of(
                    new AddOrderItemRequest(1L, 2, "Extra hot")
            );

            Order mockOrder = mock(Order.class);
            OrderDto expectedDto = new OrderDto(ORDER_ID, 5L, OrderState.OPEN, Instant.now(), null);

            when(orderService.addItemsToOrder(eq(ORDER_ID), any())).thenReturn(mockOrder);
            when(orderMapper.toDto(mockOrder)).thenReturn(expectedDto);

            mockMvc.perform(post("/api/orders/{orderId}/items", ORDER_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(requests)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(ORDER_ID));

            verify(notificationService).notifyOrderUpdated(expectedDto);
        }
    }

    @Nested
    class UpdateStatus {

        @Test
        void shouldReturn200Ok_AndTriggerNotification() throws Exception {
            UpdateOrderItemStatusRequest request = new UpdateOrderItemStatusRequest(OrderItemStatus.SERVED);

            OrderItem mockItem = mock(OrderItem.class);
            Order mockOrder = mock(Order.class);
            OrderItemDto expectedItemDto = new OrderItemDto(
                    ITEM_ID, ORDER_ID, 1L, "Latte", 350, 1, null, OrderItemStatus.SERVED
            );
            OrderDto expectedOrderDto = new OrderDto(ORDER_ID, 5L, OrderState.OPEN, Instant.now(), null);

            when(orderItemService.updateStatus(ITEM_ID, OrderItemStatus.SERVED)).thenReturn(mockItem);
            when(mockItem.getOrder()).thenReturn(mockOrder);
            when(orderItemMapper.toDto(mockItem)).thenReturn(expectedItemDto);
            when(orderMapper.toDto(mockOrder)).thenReturn(expectedOrderDto);

            mockMvc.perform(patch("/api/order-items/{id}/status", ITEM_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(ITEM_ID))
                    .andExpect(jsonPath("$.status").value("SERVED"));

            verify(notificationService).notifyOrderUpdated(expectedOrderDto);
        }
    }
}
