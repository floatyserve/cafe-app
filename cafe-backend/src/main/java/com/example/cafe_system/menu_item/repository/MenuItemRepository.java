package com.example.cafe_system.menu_item.repository;

import com.example.cafe_system.menu_item.domain.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}
