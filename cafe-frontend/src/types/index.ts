export type Category = 'MEAL' | 'DRINK' | 'DESSERT';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'PAID';

export interface MenuItem {
    id: number;
    name: string;
    category: Category;
    price: number;
}

export interface OrderItem {
    id: number;
    menuItem: MenuItem;
    quantity: number;
    notes?: string;
}

export interface Order {
    id: number;
    tableNumber: number;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: string;
}