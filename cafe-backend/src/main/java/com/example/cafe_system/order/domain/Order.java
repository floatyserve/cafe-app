package com.example.cafe_system.order.domain;

import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.table.domain.CafeTable;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cafe_order")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_table_id", nullable = false)
    private CafeTable cafeTable;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderState state;

    private Instant orderedAt;
    private Instant paidAt;

    public Order(CafeTable cafeTable, Instant orderedAt) {
        this.cafeTable = cafeTable;
        this.orderedAt = orderedAt;
        this.state = OrderState.OPEN;
    }

    public void addOrderItem(
            MenuItem menuItem,
            int quantity,
            String note,
            Instant currentTime
    ) {
        OrderItem newItem = new OrderItem(this, menuItem, quantity, note, currentTime);

        this.orderItems.add(newItem);
    }

    public void markAsPaid(Instant paidAt) {
        this.state = OrderState.PAID;
        this.paidAt = paidAt;
    }
}
