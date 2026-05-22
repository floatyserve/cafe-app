import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {Order, OrderItem} from "../types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateOrderTotal(order: Order): number {
    return (order.items || []).reduce((sum, item) => sum + (item.priceAtTimeOfOrderInCents * item.quantity), 0) / 100;
}

export function aggregateOrderItems(items: OrderItem[]) {
    const aggregated = items.reduce((acc, item) => {
        const key = `${item.menuItemId}-${item.status}-${item.priceAtTimeOfOrderInCents}`;
        
        if (acc[key]) {
            acc[key].quantity += item.quantity;
        } else {
            acc[key] = { ...item };
        }
        return acc;
    }, {} as Record<string, OrderItem>);

    return Object.values(aggregated);
}