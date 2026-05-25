package com.example.cafe_system.table.service.impl;

import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.repository.CafeTableRepository;
import com.example.cafe_system.table.service.CafeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CafeTableServiceJpa implements CafeTableService {
    private final CafeTableRepository cafeTableRepository;

    @Override
    public CafeTable getById(Long id) {
        return cafeTableRepository.findById(id)
                .orElseThrow(() ->
                        new ReferenceNotFoundException("Cafe table with id " + id + " not found")
                );
    }

    @Override
    public List<CafeTable> getAllTables() {
        return cafeTableRepository.findAll(Sort.by("number"));
    }

    @Override
    @Transactional
    public CafeTable markTableAsOutOfOrder(Long id) {
        CafeTable table = getById(id);
        table.markAsOutOfOrder();
        return cafeTableRepository.save(table);
    }

    @Override
    @Transactional
    public CafeTable markTableAsActive(Long id) {
        CafeTable table = getById(id);
        table.markAsActive();
        return cafeTableRepository.save(table);
    }


}
