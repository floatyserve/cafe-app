export type Category = 'MEAL' | 'DRINK' | 'DESSERT';

export type OrderState = 'OPEN' | 'PAID';

export type ItemStatus = 'PENDING' | 'PREPARING' | 'READY_TO_SERVE' | 'SERVED';

export interface MenuItem {
    id: number;
    name: string;
    category: Category;
    priceInEuros: number;
}

export interface OrderItem {
    id: number;
    orderId: number;
    menuItemId: number;
    menuItemName: string;
    menuItemCategory: Category;
    priceAtTimeOfOrderInCents: number;
    quantity: number;
    note?: string;
    updatedAt: string;
    status: ItemStatus;
}

export interface Order {
    id: number;
    tableId: number;
    state: OrderState;
    orderedAt: string;
    paidAt?: string;
    items?: OrderItem[];
}

export interface DraftItem {
    tempId: string;
    menuItem: MenuItem;
    quantity: number;
}

export interface Table {
    id: number;
    number: number;
    capacity: number;
    outOfOrder: boolean;
}
