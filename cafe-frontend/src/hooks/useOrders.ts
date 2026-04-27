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


    return {
        orders,
        updateItemStatus,
        handlePayOrder,
        setOrders
    };
}