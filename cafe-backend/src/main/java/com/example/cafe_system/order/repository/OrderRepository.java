package com.example.cafe_system.order.repository;

import com.example.cafe_system.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
