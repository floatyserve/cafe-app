package com.example.cafe_system.menu_item.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int priceInCents;

    @Enumerated(EnumType.STRING)
    private MenuItemCategory category;

    private boolean active;

    public MenuItem(String name, int priceInCents, MenuItemCategory category) {
        this.name = name;
        this.priceInCents = priceInCents;
        this.category = category;
        this.active = true;
    }

    public void deactivate(){
        this.active = false;
    }
}
