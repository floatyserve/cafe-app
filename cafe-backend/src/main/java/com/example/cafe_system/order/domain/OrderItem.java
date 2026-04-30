package com.example.cafe_system.order.domain;

import com.example.cafe_system.menu_item.domain.MenuItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    private int priceAtTimeOfOrderInCents;
    private int quantity;
    private String note;

    @Enumerated(EnumType.STRING)
    private OrderItemStatus status;

    private Instant updatedAt;

    public OrderItem(
            Order order,
            MenuItem menuItem,
            int quantity,
            String note,
            Instant createdAt
    ) {
        this.order = order;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.note = note;
        this.priceAtTimeOfOrderInCents = menuItem.getPriceInCents();
        this.status = OrderItemStatus.PENDING;
        this.updatedAt = createdAt;
    }

    public void updateStatus(OrderItemStatus newStatus, Instant currentTime) {
        this.status = newStatus;
        this.updatedAt = currentTime;
    }
}
