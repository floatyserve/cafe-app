import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChefHat } from 'lucide-react';
import type { Order, ItemStatus } from '../types';
import { MOCK_ORDERS } from '../data/mockData';
import KitchenItemCard from '../components/kitchen/KitchenItemCard';
import { useCurrentTime } from '../hooks/useCurrentTime';

interface ColumnConfig {
    title: string;
    status: ItemStatus;
    badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
    { title: 'Pending', status: 'PENDING', badgeClass: 'bg-status-pending' },
    { title: 'Cooking', status: 'PREPARING', badgeClass: 'bg-status-preparing' },
    { title: 'Ready for Expeditor', status: 'READY', badgeClass: 'bg-status-ready' }
];

export default function KitchenPage() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const currentTime = useCurrentTime(60000);

    const updateItemStatus = (orderId: number, itemId: number, newStatus: ItemStatus) => {
        setOrders(prev => prev.map(order => {
            if (order.id !== orderId) return order;
            return {
                ...order,
                items: order.items.map(item =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                )
            };
        }));
    };

    const allKitchenItems = orders.flatMap(order =>
        order.items
            .filter(item => item.menuItem.category === 'MEAL' && item.status !== 'SERVED')
            .map(item => ({
                ...item,
                orderId: order.id,
                createdAt: order.createdAt
            }))
    );

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden bg-cafe-bg">
            <h1 className="text-3xl font-bold text-cafe-primary mb-6 flex items-center gap-3">
                <ChefHat className="size-icon-lg text-cafe-accent" />
                {t('nav.kitchen')}
            </h1>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {COLUMNS.map(col => {
                    const columnItems = allKitchenItems.filter(item => item.status === col.status);

                    return (
                        <div key={col.status} className="flex flex-col bg-cafe-surface-hover/50 rounded-2xl p-4 border border-cafe-secondary/50 overflow-hidden">
                            <h2 className="text-xl font-bold text-cafe-text-main mb-4 flex justify-between items-center">
                                {col.title}
                                <span className={`text-white text-sm px-3 py-1 rounded-full ${col.badgeClass}`}>
                                    {columnItems.length}
                                </span>
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {columnItems.map(item => (
                                    <KitchenItemCard
                                        key={item.id}
                                        orderId={item.orderId}
                                        item={item}
                                        createdAt={item.createdAt}
                                        currentTime={currentTime}
                                        onUpdateStatus={updateItemStatus}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}