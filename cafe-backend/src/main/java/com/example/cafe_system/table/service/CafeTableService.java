package com.example.cafe_system.table.service;

import com.example.cafe_system.table.domain.CafeTable;

import java.util.List;

public interface CafeTableService {
    CafeTable getByNumber(int number);
    List<CafeTable> getAllTables();
    CafeTable markTableAsOutOfOrder(Long id);
    CafeTable markTableAsActive(Long id);
}
