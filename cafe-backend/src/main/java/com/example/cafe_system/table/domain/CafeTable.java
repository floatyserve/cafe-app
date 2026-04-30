package com.example.cafe_system.table.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "cafe_table")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CafeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int number;

    private int capacity;

    @Enumerated(EnumType.STRING)
    private CafeTableStatus status;

    public CafeTable(int number, int capacity) {
        this.number = number;
        this.capacity = capacity;
        this.status = CafeTableStatus.ACTIVE;
    }

    public boolean isOutOfOrder(){
        return status == CafeTableStatus.OUT_OF_ORDER;
    }
}
