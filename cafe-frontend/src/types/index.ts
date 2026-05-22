export type Category = 'MEAL' | 'DRINK' | 'DESSERT';

export type OrderState = 'OPEN' | 'PAID';

export type ItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED';

export interface MenuItem {
    id: number;
    name: string;
    category: Category;
    priceInEuros: number;
}

export interface OrderItem {
    id: number;
    menuItemId: number;
    menuItemName: string;
    menuItemCategory: Category;
    priceAtTimeOfOrderInCents: number;
    quantity: number;
    note?: string;
    status: ItemStatus;
    updatedAt?: string;
}

export interface Order {
    id: number;
    tableId: number;
    state: OrderState;
    orderedAt: string;
    paidAt?: string;
    items: OrderItem[];
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
