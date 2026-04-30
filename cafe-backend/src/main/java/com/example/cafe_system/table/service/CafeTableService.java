package com.example.cafe_system.table.service;

import com.example.cafe_system.table.domain.CafeTable;

public interface CafeTableService {
    CafeTable getByNumber(int number);
}
