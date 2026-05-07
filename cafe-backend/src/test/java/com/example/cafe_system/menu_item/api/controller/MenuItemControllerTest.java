package com.example.cafe_system.menu_item.api.controller;

import com.example.cafe_system.menu_item.api.dto.MenuItemDto;
import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.menu_item.mapper.MenuItemMapper;
import com.example.cafe_system.menu_item.service.MenuItemService;
import com.example.cafe_system.security.service.JwtService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MenuItemController.class)
public class MenuItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserDetailsService userService;

    @MockitoBean private MenuItemService menuItemService;
    @MockitoBean private MenuItemMapper menuItemMapper;

    @Nested
    class GetMenu {

        @Test
        void shouldReturnAllItems_WhenNoCategoryIsProvided() throws Exception {
            MenuItem mockItem = mock(MenuItem.class);
            MenuItemDto expectedDto = new MenuItemDto(1L, "Latte", 450, MenuItemCategory.DRINK, true);

            when(menuItemService.getAllActiveMenuItems()).thenReturn(List.of(mockItem));
            when(menuItemMapper.toDto(mockItem)).thenReturn(expectedDto);

            mockMvc.perform(get("/api/menu"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].name").value("Latte"));

            verify(menuItemService).getAllActiveMenuItems();
            verify(menuItemService, never()).getAllActiveMenuItemsByCategory(any());
        }

        @Test
        void shouldReturnFilteredItems_WhenCategoryIsProvided() throws Exception {
            MenuItem mockItem = mock(MenuItem.class);
            MenuItemDto expectedDto = new MenuItemDto(2L, "Cake", 500, MenuItemCategory.MEAL, true);

            when(menuItemService.getAllActiveMenuItemsByCategory(MenuItemCategory.MEAL)).thenReturn(List.of(mockItem));
            when(menuItemMapper.toDto(mockItem)).thenReturn(expectedDto);

            mockMvc.perform(get("/api/menu").param("category", "MEAL"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].name").value("Cake"));

            verify(menuItemService).getAllActiveMenuItemsByCategory(MenuItemCategory.MEAL);
            verify(menuItemService, never()).getAllActiveMenuItems();
        }

        @Test
        void shouldReturn400BadRequest_WhenCategoryIsInvalid() throws Exception {
            mockMvc.perform(get("/api/menu").param("category", "NOT_A_CATEGORY"))
                    .andExpect(status().isBadRequest());
        }
    }
}