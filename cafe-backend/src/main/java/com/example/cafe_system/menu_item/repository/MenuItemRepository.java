package com.example.cafe_system.menu_item.repository;

import com.example.cafe_system.menu_item.domain.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Optional<MenuItem> findByIdAndActiveTrue(Long id);
    List<MenuItem> findAllByActiveTrue();
}
