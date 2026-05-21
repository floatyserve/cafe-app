package com.example.cafe_system.order.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.order.domain.OrderItem;
import com.example.cafe_system.order.domain.OrderItemStatus;
import com.example.cafe_system.order.repository.OrderItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderItemServiceJpaTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private Clock clock;

    @InjectMocks
    private OrderItemServiceJpa orderItemService;

    private final Instant NOW = Instant.parse("2026-05-21T10:00:00Z");

    @BeforeEach
    void setUp() {
        lenient().when(clock.instant()).thenReturn(NOW);
        lenient().when(clock.getZone()).thenReturn(ZoneId.of("UTC"));
    }

    @Test
    void updateStatus_ShouldUpdateStatusAndReturnItem() {
        Long id = 1L;
        OrderItemStatus newStatus = OrderItemStatus.PREPARING;
        OrderItem mockItem = mock(OrderItem.class);

        when(orderItemRepository.findById(id)).thenReturn(Optional.of(mockItem));
        when(orderItemRepository.save(mockItem)).thenReturn(mockItem);

        OrderItem result = orderItemService.updateStatus(id, newStatus);

        assertThat(result).isEqualTo(mockItem);
        verify(mockItem).updateStatus(newStatus, NOW);
        verify(orderItemRepository).save(mockItem);
    }

    @Test
    void updateStatus_ShouldThrowException_WhenItemNotFound() {
        Long id = 999L;
        when(orderItemRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderItemService.updateStatus(id, OrderItemStatus.SERVED))
                .isInstanceOf(ReferenceNotFoundException.class)
                .hasMessageContaining("Order item with id 999 not found");

        verify(orderItemRepository, never()).save(any());
    }
}
