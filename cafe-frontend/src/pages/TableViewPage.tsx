import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { MOCK_MENU, CAFE_TABLES } from '../data/mockData';
import type { OrderItem, Category, DraftItem, Table } from '../types'; // Ensure Table is imported

import FloorPlan from '../components/table-view/FloorPlan';
import MenuGrid from '../components/table-view/MenuGrid';
import OrderDrawer from '../components/table-view/OrderDrawer';

export default function TableViewPage() {
    const { orders, handlePayOrder, createNewOrder, setOrders } = useOrders();

    const [tables, setTables] = useState<Table[]>(CAFE_TABLES);

    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [isOrderingMode, setIsOrderingMode] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category>('DRINK');
    const [draftItems, setDraftItems] = useState<DraftItem[]>([]);

    const getActiveOrder = (tableId: number) => orders.find(order => order.tableNumber === tableId && order.status === 'OPEN');

    const selectedTable = tables.find(t => t.id === selectedTableId);
    const activeOrder = selectedTableId ? getActiveOrder(selectedTableId) : null;

    const handleToggleTableStatus = () => {
        if (!selectedTableId) return;

        setTables(prevTables => prevTables.map(table =>
            table.id === selectedTableId
                ? { ...table, outOfOrder: !table.outOfOrder }
                : table
        ));
    };

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
            setDraftItems([]);
        }
    };

    const handleAddItemToCart = (menuItem: typeof MOCK_MENU[0]) => {
        if (!activeOrder) return;

        setDraftItems(prev => {
            const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
            if (existingItem) {
                return prev.map(item =>
                    item.menuItem.id === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, {
                tempId: Math.random().toString(36).substr(2, 9),
                menuItem,
                quantity: 1
            }];
        });
    };

    const handleRemoveDraftItem = (tempId: string) => {
        setDraftItems(prev =>
            prev.map(item =>
                item.tempId === tempId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const handleSendToKitchen = () => {
        if (!activeOrder || draftItems.length === 0) return;

        const newOrderItems: OrderItem[] = draftItems.map(draft => ({
            id: Math.floor(Math.random() * 100000),
            menuItem: draft.menuItem,
            quantity: draft.quantity,
            status: 'PENDING',
            updatedAt: Date.now()
        }));

        setOrders(prev => prev.map(order =>
            order.id === activeOrder.id
                ? { ...order, items: [...order.items, ...newOrderItems] }
                : order
        ));

        setDraftItems([]);
        setIsOrderingMode(false);
    };

    const handleCloseDrawer = () => {
        setSelectedTableId(null);
        setIsOrderingMode(false);
        setDraftItems([]);
    };

    return (
        <div className="flex h-full overflow-hidden bg-cafe-bg relative">

            <div className="flex-1 p-8 overflow-y-auto transition-all duration-300">
                {!isOrderingMode ? (
                    <FloorPlan
                        tables={tables}
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
                selectedTableConfig={selectedTable}
                isTableOutOfOrder={selectedTable?.outOfOrder || false}
                activeOrder={activeOrder}
                isOrderingMode={isOrderingMode}
                draftItems={draftItems}
                onSendToKitchen={handleSendToKitchen}
                onRemoveDraftItem={handleRemoveDraftItem}
                onClose={handleCloseDrawer}
                onOpenNewOrder={handleOpenTable}
                onAddItems={() => setIsOrderingMode(true)}
                onCheckout={handleCheckout}
                onChangeTableStatus={handleToggleTableStatus}
            />

        </div>
    );
}