import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {Order} from "../types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateOrderTotal(order: Order): number {
    return (order.items || []).reduce((sum, item) => sum + (item.priceAtTimeOfOrderInCents * item.quantity), 0) / 100;
}