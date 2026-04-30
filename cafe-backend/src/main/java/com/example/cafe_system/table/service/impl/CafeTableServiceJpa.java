package com.example.cafe_system.table.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.repository.CafeTableRepository;
import com.example.cafe_system.table.service.CafeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CafeTableServiceJpa implements CafeTableService {
    private final CafeTableRepository cafeTableRepository;

    @Override
    public CafeTable getByNumber(int number) {
        return cafeTableRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ReferenceNotFoundException("Cafe table with number " + number + " not found")
                );
    }
}
