package com.example.cafe_system.table.repository;

import com.example.cafe_system.table.domain.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeTableRepository extends JpaRepository<CafeTable, Long> {
}
