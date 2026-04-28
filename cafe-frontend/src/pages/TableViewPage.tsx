import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { MOCK_MENU } from '../data/mockData';
import type { OrderItem, Category } from '../types';

import FloorPlan, { CAFE_TABLES } from '../components/table-view/FloorPlan';
import MenuGrid from '../components/table-view/MenuGrid';
import OrderDrawer from '../components/table-view/OrderDrawer';

export default function TableViewPage() {
    const { orders, handlePayOrder, createNewOrder, removeOrderItem, setOrders } = useOrders();

    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [isOrderingMode, setIsOrderingMode] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category>('DRINK');

    const getActiveOrder = (tableId: number) => orders.find(order => order.tableNumber === tableId && order.status === 'OPEN');
    const activeOrder = selectedTableId ? getActiveOrder(selectedTableId) : null;
    const selectedTableConfig = CAFE_TABLES.find(t => t.id === selectedTableId);

    const handleOpenTable = () => {
        if (selectedTableId && !activeOrder) {
            createNewOrder(selectedTableId);
        }
        setIsOrderingMode(true);
    };

    const handleCheckout = () => {
        if (activeOrder) {
            handlePayOrder(activeOrder.id);
            setSelectedTableId(null);
            setIsOrderingMode(false);
        }
    };

    const handleAddItemToCart = (menuItem: typeof MOCK_MENU[0]) => {
        if (!activeOrder) return;

        const newItem: OrderItem = {
            id: Math.floor(Math.random() * 100000),
            menuItem,
            quantity: 1,
            status: 'PENDING'
        };

        setOrders(prev => prev.map(order =>
            order.id === activeOrder.id
                ? { ...order, items: [...order.items, newItem] }
                : order
        ));
    };

    return (
        <div className="flex h-full overflow-hidden bg-cafe-bg relative">

            <div className="flex-1 p-8 overflow-y-auto transition-all duration-300">
                {!isOrderingMode ? (
                    <FloorPlan
                        selectedTableId={selectedTableId}
                        onSelectTable={setSelectedTableId}
                        getActiveOrder={getActiveOrder}
                    />
                ) : (
                    <MenuGrid
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                        onAddItem={handleAddItemToCart}
                        onBack={() => setIsOrderingMode(false)}
                    />
                )}
            </div>

            <OrderDrawer
                selectedTableId={selectedTableId}
                selectedTableConfig={selectedTableConfig}
                activeOrder={activeOrder}
                isOrderingMode={isOrderingMode}
                onClose={() => {
                    setSelectedTableId(null);
                    setIsOrderingMode(false);
                }}
                onOpenNewOrder={handleOpenTable}
                onAddItems={() => setIsOrderingMode(true)}
                onCheckout={handleCheckout}
                onRemoveItem={removeOrderItem}
            />

        </div>
    );
}