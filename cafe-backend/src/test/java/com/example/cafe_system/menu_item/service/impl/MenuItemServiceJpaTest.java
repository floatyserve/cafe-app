package com.example.cafe_system.menu_item.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.menu_item.repository.MenuItemRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MenuItemServiceJpaTest {

    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private MenuItemServiceJpa menuItemService;

    @Nested
    class GetActiveMenuItemById {
        MenuItem menuItem = mock(MenuItem.class);

        @Test
        void shouldReturnActiveMenuItemById() {
            when(menuItemRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(menuItem));

            MenuItem result = menuItemService.getActiveMenuItemById(1L);

            assertEquals(menuItem, result);
        }

        @Test
        void shouldThrowException_WhenItemIsNotFound() {
            when(menuItemRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.empty());

            assertThrows(ReferenceNotFoundException.class,
                    () -> menuItemService.getActiveMenuItemById(1L));
        }
    }

    @Nested
    class GetAllActiveMenuItems {
        MenuItem menuItem = mock(MenuItem.class);

        @Test
        void shouldReturnAllActiveMenuItems() {
            when(menuItemRepository.findAllByActiveTrue()).thenReturn(List.of(menuItem));

            List<MenuItem> result = menuItemService.getAllActiveMenuItems();

            assertEquals(1, result.size());
            assertEquals(menuItem, result.getFirst());
        }

        @Test
        void shouldReturnEmptyList_WhenNoActiveMenuItems() {
            when(menuItemRepository.findAllByActiveTrue()).thenReturn(List.of());

            List<MenuItem> result = menuItemService.getAllActiveMenuItems();

            assertTrue(result.isEmpty());
        }
    }

    @Nested
    class GetAllActiveMenuItemsByCategory {

        @Test
        void shouldReturnAllActiveMenuItemsByCategory() {
            MenuItem drink1 = mock(MenuItem.class);
            MenuItem drink2 = mock(MenuItem.class);
            List<MenuItem> expectedDrinks = List.of(drink1, drink2);

            when(menuItemRepository.findAllByCategoryAndActiveTrue(MenuItemCategory.DRINK))
                    .thenReturn(expectedDrinks);

            List<MenuItem> result = menuItemService.getAllActiveMenuItemsByCategory(MenuItemCategory.DRINK);

            assertEquals(2, result.size());
            assertEquals(expectedDrinks, result);
        }

        @Test
        void shouldReturnEmptyList_WhenNoActiveMenuItemsInCategory() {
            when(menuItemRepository.findAllByCategoryAndActiveTrue(MenuItemCategory.DESSERT))
                    .thenReturn(List.of());

            List<MenuItem> result = menuItemService.getAllActiveMenuItemsByCategory(MenuItemCategory.DESSERT);

            assertTrue(result.isEmpty());
        }
    }
}
