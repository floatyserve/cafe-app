import { useState } from 'react';
import type { Order, ItemStatus } from '../types';
import { MOCK_ORDERS } from '../data/mockData';

export function useOrders() {
    // this useState will be replaced by a WebSocket listener or React Query
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const updateItemStatus = (orderId: number, itemId: number, newStatus: ItemStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, items: order.items.map(i => i.id === itemId ? { ...i, status: newStatus } : i) }
                : order
        ));
    };

    const handlePayOrder = (orderId: number) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: 'PAID' } : order
        ));
    };

    const createNewOrder = (tableId: number) => {
        const newOrder: Order = {
            id: Math.floor(Math.random() * 10000), // Mock ID generator
            tableNumber: tableId,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            items: []
        };
        setOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const removeOrderItem = (orderId: number, itemId: number) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, items: order.items.filter(item => item.id !== itemId) }
                : order
        ));
    };

    return {
        orders,
        updateItemStatus,
        handlePayOrder,
        createNewOrder,
        removeOrderItem,
        setOrders
    };
}