package com.example.cafe_system.order.service.impl;

import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.service.MenuItemService;
import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.order.repository.OrderRepository;
import com.example.cafe_system.order.service.model.AddOrderItemCommand;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.service.CafeTableService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceJpaTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CafeTableService cafeTableService;
    @Mock private MenuItemService menuItemService;
    @Mock private Clock clock;

    @InjectMocks
    private OrderServiceJpa orderService;

    private final Instant FIXED_TIME = Instant.parse("2026-05-04T12:00:00Z");

    @Nested
    class CreateOrder {

        @Test
        void shouldCreateAndSaveOrder_WhenTableIsAvailable() {
            CafeTable table = mock(CafeTable.class);

            when(table.isOutOfOrder()).thenReturn(false);

            when(cafeTableService.getByNumber(4)).thenReturn(table);
            when(orderRepository.existsByCafeTableAndState(table, OrderState.OPEN)).thenReturn(false);
            when(clock.instant()).thenReturn(FIXED_TIME);

            Order savedOrder = mock(Order.class);
            when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

            Order result = orderService.createOrder(4);

            assertNotNull(result);
            ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
            verify(orderRepository).save(orderCaptor.capture());

            Order capturedOrder = orderCaptor.getValue();
            assertEquals(table, capturedOrder.getCafeTable());
        }

        @Test
        void shouldThrowBadRequest_WhenTableIsOutOfOrder() {
            CafeTable table = mock(CafeTable.class);
            when(table.getNumber()).thenReturn(4);
            when(table.isOutOfOrder()).thenReturn(true);

            when(cafeTableService.getByNumber(4)).thenReturn(table);

            assertThrows(BadRequestException.class, () -> orderService.createOrder(4));
            verify(orderRepository, never()).save(any());
        }

        @Test
        void shouldThrowBadRequest_WhenTableAlreadyHasOpenOrder() {
            CafeTable table = mock(CafeTable.class);
            when(table.getNumber()).thenReturn(4);
            when(table.isOutOfOrder()).thenReturn(false);

            when(cafeTableService.getByNumber(4)).thenReturn(table);
            when(orderRepository.existsByCafeTableAndState(table, OrderState.OPEN)).thenReturn(true);

            assertThrows(BadRequestException.class, () -> orderService.createOrder(4));
            verify(orderRepository, never()).save(any());
        }
    }

    @Nested
    class AddItemsToOrder {

        @Test
        void shouldAddItemsAndSave_WhenOrderIsOpen() {
            Order order = mock(Order.class);
            when(order.getState()).thenReturn(OrderState.OPEN);

            MenuItem menuItem = mock(MenuItem.class);
            AddOrderItemCommand command = new AddOrderItemCommand(1L, 2, "Extra hot");

            when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
            when(menuItemService.getActiveMenuItemById(1L)).thenReturn(menuItem);
            when(clock.instant()).thenReturn(FIXED_TIME);
            when(orderRepository.save(order)).thenReturn(order);

            Order result = orderService.addItemsToOrder(100L, List.of(command));

            assertNotNull(result);
            verify(order).addOrderItem(menuItem, 2, "Extra hot", FIXED_TIME);
            verify(orderRepository).save(order);
        }

        @Test
        void shouldThrowReferenceNotFound_WhenOrderDoesNotExist() {
            when(orderRepository.findById(100L)).thenReturn(Optional.empty());

            assertThrows(ReferenceNotFoundException.class,
                    () -> orderService.addItemsToOrder(100L, List.of()));

            verify(orderRepository, never()).save(any());
        }

        @Test
        void shouldThrowBadRequest_WhenOrderIsNotOpen() {
            Order order = mock(Order.class);
            when(order.getState()).thenReturn(OrderState.PAID);

            when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

            assertThrows(BadRequestException.class,
                    () -> orderService.addItemsToOrder(100L, List.of()));

            verify(orderRepository, never()).save(any());
        }
    }
}