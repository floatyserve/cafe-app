package com.example.cafe_system.order.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cafe_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
