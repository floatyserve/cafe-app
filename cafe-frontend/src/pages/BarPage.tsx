import { useTranslation } from 'react-i18next';
import { GlassWater } from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import KanbanGrid, { type ColumnConfig } from '../components/shared/KanbanGrid';
import {useOrders} from "../hooks/useOrders.ts";

const COLUMNS: ColumnConfig[] = [
    { title: 'Pending', status: 'PENDING', badgeClass: 'bg-status-pending' },
    { title: 'Preparing', status: 'PREPARING', badgeClass: 'bg-status-preparing' },
    { title: 'Ready to Serve', status: 'READY', badgeClass: 'bg-status-ready' }
];

export default function BarPage() {
    const { t } = useTranslation();
    const currentTime = useCurrentTime(60000);

    const { orders, updateItemStatus} = useOrders();

    const allBarItems = orders.flatMap(order =>
        (order.items || [])
            .filter(item => (item.menuItem.category === 'DRINK' || item.menuItem.category === 'DESSERT') && item.status !== 'SERVED')
            .map(item => ({ ...item, orderId: order.id, createdAt: order.createdAt }))
    );

    return (
        <div className="flex h-full overflow-hidden bg-cafe-bg">
            <div className="flex-1 p-6 flex flex-col overflow-hidden">
                <h1 className="text-3xl font-bold text-cafe-primary mb-6 flex items-center gap-3">
                    <GlassWater className="size-icon-lg text-cafe-accent" />
                    {t('nav.bar')}
                </h1>

                <KanbanGrid items={allBarItems} columns={COLUMNS} currentTime={currentTime} onUpdateStatus={updateItemStatus} />
            </div>
        </div>
    );
}