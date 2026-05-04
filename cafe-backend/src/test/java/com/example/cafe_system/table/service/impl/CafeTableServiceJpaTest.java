package com.example.cafe_system.table.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.repository.CafeTableRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CafeTableServiceJpaTest {
    @Mock private CafeTableRepository cafeTableRepository;

    @InjectMocks
    CafeTableServiceJpa cafeTableServiceJpa;

    @Nested
    class GetByNumber {
        @Test
        void shouldReturnCafeTableByNumber() {
            CafeTable cafeTable = mock(CafeTable.class);

            when(cafeTableRepository.findByNumber(1)).thenReturn(Optional.of(cafeTable));

            CafeTable result = cafeTableServiceJpa.getByNumber(1);

            assertEquals(cafeTable, result);
        }

        @Test
        void shouldThrowReferenceNotFoundException_WhenTableNotFound() {
            when(cafeTableRepository.findByNumber(1)).thenReturn(Optional.empty());

            assertThrows( ReferenceNotFoundException.class,
                    () -> cafeTableServiceJpa.getByNumber(1));
        }
    }
}
