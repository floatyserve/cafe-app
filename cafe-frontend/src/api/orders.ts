import api from './axios';
import type {Order} from '../types';

export interface AddOrderItemRequest {
    menuItemId: number;
    quantity: number;
    note?: string;
}

export const orderService = {
    createOrder: async (cafeTableId: number): Promise<Order> => {
        const response = await api.post<Order>('/orders', {cafeTableId});
        return response.data;
    },

    addItemsToOrder: async (orderId: number, items: AddOrderItemRequest[]): Promise<Order> => {
        const response = await api.post<Order>(`/orders/${orderId}/items`, items);
        return response.data;
    },

    payOrder: async (orderId: number): Promise<Order> => {
        const response = await api.put<Order>(`/orders/${orderId}/pay`);
        return response.data;
    },

    getActiveOrders: async (): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },

    updateItemStatus: async (itemId: number, status: string): Promise<void> => {
        await api.patch(`/order-items/${itemId}/status`, { status });
    }
};
