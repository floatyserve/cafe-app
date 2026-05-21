package com.example.cafe_system.order.mapper;

import com.example.cafe_system.order.api.dto.OrderItemDto;
import com.example.cafe_system.order.domain.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface OrderItemMapper {
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "menuItemId", source = "menuItem.id")
    @Mapping(target = "menuItemName", source = "menuItem.name")
    OrderItemDto toDto(OrderItem orderItem);
}
