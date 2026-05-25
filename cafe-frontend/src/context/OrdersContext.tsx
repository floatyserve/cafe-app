import React, {createContext, useContext, useState, useEffect, useCallback, useRef} from 'react';
import type {Order, ItemStatus, OrderItem} from '../types';
import {orderService, type AddOrderItemRequest} from '../api';
import {createStompClient} from '../lib/websocket';

interface OrdersContextType {
    orders: Order[];
    handlePayOrder: (orderId: number) => Promise<void>;
    createNewOrder: (tableId: number) => Promise<Order>;
    addItemsToOrder: (orderId: number, items: AddOrderItemRequest[]) => Promise<Order>;
    updateItemStatus: (orderId: number, itemId: number, status: ItemStatus) => Promise<void>;
    fetchOrderItems: (orderId: number) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({children}: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const isInitialized = useRef(false);

    const fetchOrderItems = useCallback(async (orderId: number) => {
        try {
            const items = await orderService.getOrderItems(orderId);
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? {...order, items} : order
            ));
        } catch (error) {
            console.error(`Failed to fetch items for order ${orderId}:`, error);
        }
    }, []);

    const handleOrderUpdate = useCallback((order: Order) => {
        setOrders(prevOrders => {
            const exists = prevOrders.some(o => o.id === order.id);
            if (exists) {
                return prevOrders.map(o => o.id === order.id
                    ? {...o, ...order, items: o.items || []}
                    : o
                );
            }

            fetchOrderItems(order.id);
            return [...prevOrders, {...order, items: []}];
        });
    }, [fetchOrderItems]);

    const handleItemUpdate = useCallback((item: OrderItem) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id !== item.orderId) return order;

            const items = order.items || [];
            const isExisting = items.some(i => i.id === item.id);
            const updatedItems = isExisting
                ? items.map(i => i.id === item.id ? item : i)
                : [...items, item];

            return {...order, items: updatedItems};
        }));
    }, []);

    const handleWsMessage = useCallback((_topic: string, data: any) => {
        if (data.hasOwnProperty('tableId')) {
            handleOrderUpdate(data as Order);
        } else if (data.hasOwnProperty('menuItemName')) {
            handleItemUpdate(data as OrderItem);
        }
    }, [handleOrderUpdate, handleItemUpdate]);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const initializeOrders = async () => {
            try {
                const activeOrders = await orderService.getActiveOrders();
                setOrders(activeOrders.map(o => ({...o, items: []})));
                activeOrders.forEach(order => fetchOrderItems(order.id));
            } catch (error) {
                console.error('Failed to initialize orders:', error);
            }
        };

        initializeOrders();
    }, [fetchOrderItems]);

    useEffect(() => {
        const stompClient = createStompClient(handleWsMessage);
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [handleWsMessage]);

    const handlePayOrder = async (orderId: number) => {
        try {
            await orderService.payOrder(orderId);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Failed to pay order:', error);
        }
    };

    const createNewOrder = async (tableId: number) => {
        try {
            const newOrder = await orderService.createOrder(tableId);
            setOrders(prevOrders => [...prevOrders, {...newOrder, items: []}]);
            return newOrder;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    };

    const addItemsToOrder = async (orderId: number, items: AddOrderItemRequest[]) => {
        try {
            const updatedOrder = await orderService.addItemsToOrder(orderId, items);
            await fetchOrderItems(orderId);
            return updatedOrder;
        } catch (error) {
            console.error('Failed to add items to order:', error);
            throw error;
        }
    };

    const updateItemStatus = async (orderId: number, itemId: number, status: ItemStatus) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id !== orderId) return order;
            const updatedItems = (order.items || []).map(item =>
                item.id === itemId ? {...item, status} : item
            );
            return {...order, items: updatedItems};
        }));

        try {
            await orderService.updateItemStatus(itemId, status);
        } catch (error) {
            console.error('Failed to update item status:', error);
        }
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            handlePayOrder,
            createNewOrder,
            addItemsToOrder,
            updateItemStatus,
            fetchOrderItems
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrdersContext() {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrdersContext must be used within an OrdersProvider');
    }
    return context;
}
