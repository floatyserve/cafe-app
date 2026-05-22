import { useState, useEffect, useCallback } from 'react';
import type { Order, ItemStatus } from '../types';
import { orderService, type AddOrderItemRequest } from '../api';
import { createStompClient } from '../lib/websocket';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);

    const handleWsMessage = useCallback((_topic: string, updatedOrder: unknown) => {
        setOrders(prev => {
            const order = updatedOrder as Order;
            const index = prev.findIndex(o => o.id === order.id);
            if (index !== -1) {
                const newOrders = [...prev];
                newOrders[index] = order;
                return newOrders;
            } else {
                return [...prev, order];
            }
        });
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getActiveOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch initial orders:', error);
            }
        };

        fetchOrders();

        const stompClient = createStompClient(handleWsMessage);
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [handleWsMessage]);

    const handlePayOrder = async (orderId: number) => {
        try {
            const updatedOrder = await orderService.payOrder(orderId);
            setOrders(prev => prev.map(order =>
                order.id === orderId ? updatedOrder : order
            ));
        } catch (error) {
            console.error('Failed to pay order:', error);
        }
    };

    const createNewOrder = async (tableId: number) => {
        try {
            const newOrder = await orderService.createOrder(tableId);
            setOrders(prev => [...prev, newOrder]);
            return newOrder;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    };

    const addItemsToOrder = async (orderId: number, items: AddOrderItemRequest[]) => {
        try {
            const updatedOrder = await orderService.addItemsToOrder(orderId, items);
            setOrders(prev => prev.map(order =>
                order.id === orderId ? updatedOrder : order
            ));
            return updatedOrder;
        } catch (error) {
            console.error('Failed to add items to order:', error);
            throw error;
        }
    };

    const updateItemStatus = async (_orderId: number, itemId: number, status: ItemStatus) => {
        try {
            await orderService.updateItemStatus(itemId, status);
        } catch (error) {
            console.error('Failed to update item status:', error);
        }
    };

    return {
        orders,
        handlePayOrder,
        createNewOrder,
        addItemsToOrder,
        updateItemStatus,
        setOrders
    };
}
