package com.example.cafe_system.order.repository;

import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.table.domain.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByCafeTableAndState(CafeTable cafeTable, OrderState state);

    List<Order> findByState(OrderState state);
}
