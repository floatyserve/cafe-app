import { useTranslation } from 'react-i18next';
import { GlassWater, CreditCard } from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import KanbanGrid, { type ColumnConfig } from '../components/shared/KanbanGrid';
import { calculateOrderTotal } from '../lib/utils';
import {useOrders} from "../hooks/useOrders.ts";

const COLUMNS: ColumnConfig[] = [
    { title: 'Pending', status: 'PENDING', badgeClass: 'bg-status-pending' },
    { title: 'Preparing', status: 'PREPARING', badgeClass: 'bg-status-preparing' },
    { title: 'Ready to Serve', status: 'READY', badgeClass: 'bg-status-ready' }
];

export default function BarPage() {
    const { t } = useTranslation();
    const currentTime = useCurrentTime(60000);

    const { orders, updateItemStatus, handlePayOrder } = useOrders();

    const allBarItems = orders.flatMap(order =>
        order.items
            .filter(item => (item.menuItem.category === 'DRINK' || item.menuItem.category === 'DESSERT') && item.status !== 'SERVED')
            .map(item => ({ ...item, orderId: order.id, createdAt: order.createdAt }))
    );

    const openOrders = orders.filter(order => order.status === 'OPEN');

    return (
        <div className="flex h-full overflow-hidden bg-cafe-bg">
            <div className="flex-1 p-6 flex flex-col overflow-hidden">
                <h1 className="text-3xl font-bold text-cafe-primary mb-6 flex items-center gap-3">
                    <GlassWater className="size-icon-lg text-cafe-accent" />
                    {t('nav.bar')}
                </h1>

                <KanbanGrid items={allBarItems} columns={COLUMNS} currentTime={currentTime} onUpdateStatus={updateItemStatus} />
            </div>

            <div className="w-80 bg-cafe-surface border-l border-cafe-secondary flex flex-col overflow-hidden">
                <div className="p-6 border-b border-cafe-secondary/50 bg-cafe-primary text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CreditCard className="size-icon-base" />
                        Checkout tables
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {openOrders.length === 0 ? (
                        <p className="text-cafe-text-muted text-center mt-10">No open tables.</p>
                    ) : (
                        openOrders.map(order => (
                            <div key={order.id} className="bg-cafe-bg border border-cafe-secondary rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-cafe-primary text-lg">Table {order.tableNumber}</span>
                                    <span className="font-bold text-cafe-accent">${calculateOrderTotal(order).toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => handlePayOrder(order.id)}
                                    className="w-full bg-cafe-primary hover:bg-cafe-primary/90 text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
                                >
                                    <CreditCard className="size-icon-sm" /> Pay Order
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}