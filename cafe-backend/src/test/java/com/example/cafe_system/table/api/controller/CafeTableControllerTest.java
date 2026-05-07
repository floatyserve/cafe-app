package com.example.cafe_system.table.api.controller;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.security.service.JwtService;
import com.example.cafe_system.table.api.dto.CafeTableDto;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.mapper.CafeTableMapper;
import com.example.cafe_system.table.service.CafeTableService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CafeTableController.class)
public class CafeTableControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserDetailsService userService;

    @MockitoBean private CafeTableService cafeTableService;
    @MockitoBean private CafeTableMapper cafeTableMapper;

    private final Long TABLE_ID = 1L;

    @Nested
    class GetAllTables {

        @Test
        void shouldReturnListOfTables() throws Exception {
            CafeTable mockTable = mock(CafeTable.class);
            CafeTableDto expectedDto = new CafeTableDto(TABLE_ID, 4, 4, false);

            when(cafeTableService.getAllTables()).thenReturn(List.of(mockTable));
            when(cafeTableMapper.toDto(mockTable)).thenReturn(expectedDto);

            mockMvc.perform(get("/api/tables"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(TABLE_ID.intValue()))
                    .andExpect(jsonPath("$[0].number").value(4));
        }
    }

    @Nested
    class MarkTableAsOutOfOrder {

        @Test
        void shouldReturn200Ok_AndUpdatedTableDto() throws Exception {
            CafeTable mockTable = mock(CafeTable.class);
            CafeTableDto expectedDto = new CafeTableDto(TABLE_ID, 4, 4, true);

            when(cafeTableService.markTableAsOutOfOrder(TABLE_ID)).thenReturn(mockTable);
            when(cafeTableMapper.toDto(mockTable)).thenReturn(expectedDto);

            mockMvc.perform(patch("/api/tables/{id}/out-of-order", TABLE_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.outOfOrder").value(true));
        }

        @Test
        void shouldReturn404NotFound_WhenTableDoesNotExist() throws Exception {
            when(cafeTableService.markTableAsOutOfOrder(TABLE_ID))
                    .thenThrow(new ReferenceNotFoundException("Table not found"));

            mockMvc.perform(patch("/api/tables/{id}/out-of-order", TABLE_ID))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    class MarkTableAsActive {

        @Test
        void shouldReturn200Ok_AndUpdatedTableDto() throws Exception {
            CafeTable mockTable = mock(CafeTable.class);
            CafeTableDto expectedDto = new CafeTableDto(TABLE_ID, 4, 4, false);

            when(cafeTableService.markTableAsActive(TABLE_ID)).thenReturn(mockTable);
            when(cafeTableMapper.toDto(mockTable)).thenReturn(expectedDto);

            mockMvc.perform(patch("/api/tables/{id}/active", TABLE_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.outOfOrder").value(false));
        }
    }
}