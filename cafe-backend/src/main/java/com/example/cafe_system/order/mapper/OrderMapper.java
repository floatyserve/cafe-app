package com.example.cafe_system.order.mapper;

import com.example.cafe_system.order.api.dto.OrderDto;
import com.example.cafe_system.order.domain.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface OrderMapper {
    @Mapping(target = "cafeTableNumber", source = "cafeTable.number")
    OrderDto toDto(Order order);
}
