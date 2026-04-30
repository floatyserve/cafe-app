package com.example.cafe_system.menu_item.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.repository.MenuItemRepository;
import com.example.cafe_system.menu_item.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuItemServiceJpa implements MenuItemService {

    private final MenuItemRepository menuItemRepository;

    @Override
    public MenuItem getActiveMenuItemById(Long id) {
        return menuItemRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new ReferenceNotFoundException("Active menu item with id " + id + " not found")
                );
    }

    @Override
    public List<MenuItem> getAllActiveMenuItems() {
        return menuItemRepository.findAllByActiveTrue();
    }
}
