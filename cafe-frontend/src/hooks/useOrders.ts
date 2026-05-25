import { useOrdersContext } from '../context/OrdersContext';

export function useOrders() {
    return useOrdersContext();
}
