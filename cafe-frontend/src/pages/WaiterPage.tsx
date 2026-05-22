import { useTranslation } from 'react-i18next';
import { BellRing } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import KanbanGrid, { type ColumnConfig } from '../components/shared/KanbanGrid';
import {useCurrentTime} from "../hooks/useCurrentTime.ts";

const COLUMNS: ColumnConfig[] = [
    { title: 'Ready for Pickup', status: 'READY', badgeClass: 'bg-status-ready' },
    { title: 'Served to Table', status: 'SERVED', badgeClass: 'bg-cafe-secondary text-cafe-text-main' }
];

export default function WaiterPage() {
    const { t } = useTranslation();

    const { orders, updateItemStatus } = useOrders();

    const currentTime = useCurrentTime(60000);

    const servedItemsExpirationTimeInMinutes = 30;

    const waiterItems = orders.flatMap(order =>
        (order.items || [])
            .filter(item => {
                if (item.status === 'READY') return true;

                if (item.status === 'SERVED') {
                    const timeToCompare = item.updatedAt ? new Date(item.updatedAt).getTime() : new Date(order.orderedAt).getTime();
                    const diffMins = (currentTime - timeToCompare) / 60000;

                    return diffMins <= servedItemsExpirationTimeInMinutes;
                }

                return false;
            })
            .map(item => ({
                ...item,
                orderId: order.id,
                createdAt: order.orderedAt
            }))
    );

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden bg-cafe-bg">
            <h1 className="text-3xl font-bold text-cafe-primary mb-6 flex items-center gap-3">
                <BellRing className="size-icon-lg text-cafe-accent" />
                {t('nav.waiter')} Expeditor
            </h1>

            <KanbanGrid
                items={waiterItems}
                columns={COLUMNS}
                currentTime={currentTime}
                onUpdateStatus={updateItemStatus}
                viewContext="waiter"
            />
        </div>
    );
}