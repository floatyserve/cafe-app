package com.example.cafe_system.order.service.impl;

import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.menu_item.service.MenuItemService;
import com.example.cafe_system.order.domain.Order;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.order.repository.OrderRepository;
import com.example.cafe_system.order.service.OrderService;
import com.example.cafe_system.order.service.model.AddOrderItemCommand;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.service.CafeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceJpa implements OrderService {

    private final OrderRepository orderRepository;
    private final CafeTableService cafeTableService;
    private final MenuItemService menuItemService;
    private final Clock clock;

    @Override
    public Order createOrder(int cafeTableNumber) {
        CafeTable cafeTable = cafeTableService.getByNumber(cafeTableNumber);

        assertOrderCanBeOpened(cafeTable);

        Order order = new Order(cafeTable, clock.instant());

        return orderRepository.save(order);
    }

    @Override
    public Order addItemsToOrder(Long orderId, List<AddOrderItemCommand> requests) {
        Order currentOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ReferenceNotFoundException("Order with id " + orderId + " not found"));

        if (currentOrder.getState() != OrderState.OPEN) {
            throw new BadRequestException("Cannot add items to order with id " + orderId + " because it is not open");
        }

        for (AddOrderItemCommand request : requests) {
            var menuItem = menuItemService.getActiveMenuItemById(request.menuItemId());

            currentOrder.addOrderItem(menuItem, request.quantity(), request.note(), clock.instant());
        }

        return orderRepository.save(currentOrder);
    }

    private void assertOrderCanBeOpened(CafeTable cafeTable) {
        if (cafeTable.isOutOfOrder()) {
            throw new BadRequestException("Cafe table with number " + cafeTable.getNumber() + " is out of order");
        }

        if (orderRepository.existsByCafeTableAndState(cafeTable, OrderState.OPEN)) {
            throw new BadRequestException("There is already an open order for cafe table with number " + cafeTable.getNumber());
        }
    }
}
