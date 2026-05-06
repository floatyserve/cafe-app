package com.example.cafe_system.table.api.controller;

import com.example.cafe_system.table.api.dto.CafeTableDto;
import com.example.cafe_system.table.mapper.CafeTableMapper;
import com.example.cafe_system.table.service.CafeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class CafeTableController {

    private final CafeTableService cafeTableService;
    private final CafeTableMapper cafeTableMapper;

    @GetMapping
    public List<CafeTableDto> getAllTables() {
        return cafeTableService.getAllTables()
                .stream()
                .map(cafeTableMapper::toDto)
                .toList();
    }

    @PatchMapping("/{id}/out-of-order")
    public CafeTableDto markTableAsOutOfOrder(@PathVariable Long id) {
        return cafeTableMapper.toDto(cafeTableService.markTableAsOutOfOrder(id));
    }

    @PatchMapping("/{id}/active")
    public CafeTableDto markTableAsActive(@PathVariable Long id) {
        return cafeTableMapper.toDto(cafeTableService.markTableAsActive(id));
    }
}
