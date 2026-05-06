package com.example.cafe_system.table.mapper;

import com.example.cafe_system.table.api.dto.CafeTableDto;
import com.example.cafe_system.table.domain.CafeTable;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface CafeTableMapper {
    CafeTableDto toDto(CafeTable entity);
}
