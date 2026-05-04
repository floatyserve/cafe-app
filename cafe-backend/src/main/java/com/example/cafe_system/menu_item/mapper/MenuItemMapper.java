package com.example.cafe_system.menu_item.mapper;

import com.example.cafe_system.menu_item.api.dto.MenuItemDto;
import com.example.cafe_system.menu_item.domain.MenuItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface MenuItemMapper {
    @Mapping(target = "priceInEuros", expression = "java(entity.getPriceInCents() / 100.0)")
    MenuItemDto toDto(MenuItem entity);
}
