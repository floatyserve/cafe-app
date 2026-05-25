import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { tableService, menuService } from '../api';
import { cn } from '../lib/utils';
import type { Category, DraftItem, Table, MenuItem } from '../types';

import FloorPlan from '../components/table-view/FloorPlan';
import MenuGrid from '../components/table-view/MenuGrid';
import OrderDrawer from '../components/table-view/OrderDrawer';

export default function TableViewPage() {
    const { orders, handlePayOrder, createNewOrder, addItemsToOrder, fetchOrderItems } = useOrders();

    const [tables, setTables] = useState<Table[]>([]);
    const [menuCache, setMenuCache] = useState<Partial<Record<Category, MenuItem[]>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuLoading, setIsMenuLoading] = useState(false);

    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [isOrderingMode, setIsOrderingMode] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category>('DRINK');
    const [draftItems, setDraftItems] = useState<DraftItem[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const tablesData = await tableService.getAllTables();
                setTables(tablesData);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTables();
    }, []);

    useEffect(() => {
        if (!isOrderingMode) return;

        const fetchMenuCategory = async () => {
            if (menuCache[activeCategory]) return;

            setIsMenuLoading(true);
            try {
                const data = await menuService.getMenu(activeCategory);
                setMenuCache(prev => ({ ...prev, [activeCategory]: data }));
            } catch (error) {
                console.error(`Failed to fetch menu for ${activeCategory}:`, error);
            } finally {
                setIsMenuLoading(false);
            }
        };

        fetchMenuCategory();
    }, [activeCategory, isOrderingMode]);

    const getActiveOrder = (tableId: number) => {
        return orders.find(order => {
            return Number(order.tableId) === Number(tableId) && order.state === 'OPEN';
        });
    };

    const selectedTable = tables.find(t => t.id === selectedTableId);
    const activeOrder = selectedTableId ? getActiveOrder(selectedTableId) : null;

    useEffect(() => {
        if (activeOrder && !activeOrder.items) {
            fetchOrderItems(activeOrder.id);
        }
    }, [activeOrder?.id, activeOrder?.items, fetchOrderItems]);

    const handleToggleTableStatus = async () => {
        if (!selectedTableId || !selectedTable) return;

        try {
            const updatedTable = selectedTable.outOfOrder 
                ? await tableService.markAsActive(selectedTableId)
                : await tableService.markAsOutOfOrder(selectedTableId);
            
            setTables(prev => prev.map(t => t.id === selectedTableId ? updatedTable : t));
        } catch (error) {
            console.error('Failed to update table status:', error);
        }
    };

    const handleOpenTable = async () => {
        if (selectedTableId && !activeOrder) {
            setIsOrderingMode(true);
            try {
                await createNewOrder(selectedTableId);
            } catch (error) {
                console.error('Failed to open table:', error);
                setIsOrderingMode(false);
            }
        } else {
            setIsOrderingMode(true);
        }
    };

    const handleCheckout = async () => {
        if (activeOrder) {
            try {
                await handlePayOrder(activeOrder.id);
                setSelectedTableId(null);
                setIsOrderingMode(false);
                setDraftItems([]);
            } catch (error) {
                console.error('Checkout failed:', error);
            }
        }
    };

    const handleAddItemToCart = (menuItem: MenuItem) => {
        if (!selectedTableId || !isOrderingMode) return;

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

    const handleUpdateDraftItemNote = (tempId: string, note: string) => {
        setDraftItems(prev =>
            prev.map(item =>
                item.tempId === tempId
                    ? { ...item, note }
                    : item
            )
        );
    };

    const handleSendToKitchen = async () => {
        if (!activeOrder || draftItems.length === 0) return;

        const itemsToSend = draftItems.map(draft => ({
            menuItemId: draft.menuItem.id,
            quantity: draft.quantity,
            note: draft.note || ''
        }));

        try {
            await addItemsToOrder(activeOrder.id, itemsToSend);
            setDraftItems([]);
            setIsOrderingMode(false);
        } catch (error) {
            console.error('Failed to send items to kitchen:', error);
        }
    };

    const handleCloseDrawer = () => {
        setSelectedTableId(null);
        setIsOrderingMode(false);
        setDraftItems([]);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-cafe-bg">
                <div className="size-12 border-4 border-cafe-primary/30 border-t-cafe-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden bg-cafe-bg">
            <div className={cn(
                "flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300",
                selectedTableId ? "mr-96 lg:mr-0" : ""
            )}>
                {!isOrderingMode ? (
                    <FloorPlan
                        tables={tables}
                        selectedTableId={selectedTableId}
                        onSelectTable={setSelectedTableId}
                        getActiveOrder={getActiveOrder}
                    />
                ) : (
                    <MenuGrid
                        menuItems={menuCache[activeCategory] || []}
                        activeCategory={activeCategory}
                        isLoading={isMenuLoading}
                        onSelectCategory={setActiveCategory}
                        onAddItem={handleAddItemToCart}
                        onBack={() => setIsOrderingMode(false)}
                    />
                )}
            </div>

            <div className={cn(
                "fixed inset-y-0 right-0 z-50 lg:relative lg:z-0 transition-transform duration-300 transform shadow-2xl lg:shadow-none",
                selectedTableId ? "translate-x-0" : "translate-x-full lg:hidden"
            )}>
                <OrderDrawer
                    selectedTableId={selectedTableId}
                    selectedTableConfig={selectedTable}
                    isTableOutOfOrder={selectedTable?.outOfOrder || false}
                    activeOrder={activeOrder}
                    isOrderingMode={isOrderingMode}
                    draftItems={draftItems}
                    onSendToKitchen={handleSendToKitchen}
                    onRemoveDraftItem={handleRemoveDraftItem}
                    onUpdateDraftItemNote={handleUpdateDraftItemNote}
                    onClose={handleCloseDrawer}
                    onOpenNewOrder={handleOpenTable}
                    onAddItems={() => setIsOrderingMode(true)}
                    onCheckout={handleCheckout}
                    onChangeTableStatus={handleToggleTableStatus}
                />
            </div>
        </div>
    );
}
