import { useTranslation } from 'react-i18next';
import { ChefHat } from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import KanbanGrid, { type ColumnConfig } from '../components/shared/KanbanGrid';
import {useOrders} from "../hooks/useOrders.ts";

export default function KitchenPage() {
    const { t } = useTranslation();

    const COLUMNS: ColumnConfig[] = [
        { title: t('kanban.columns.pending'), status: 'PENDING', badgeClass: 'bg-status-pending' },
        { title: t('kanban.columns.cooking'), status: 'PREPARING', badgeClass: 'bg-status-preparing' },
        { title: t('kanban.columns.readyExpeditor'), status: 'READY_TO_SERVE', badgeClass: 'bg-status-ready' }
    ];

    const currentTime = useCurrentTime(60000);
    const { orders, updateItemStatus } = useOrders();


    const allKitchenItems = orders.flatMap(order =>
        (order.items || [])
            .filter(item => item.menuItemCategory === 'MEAL' && item.status !== 'SERVED')
            .map(item => ({ ...item, orderId: order.id, createdAt: order.orderedAt }))
    );

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden bg-cafe-bg">
            <h1 className="text-3xl font-bold text-cafe-primary mb-6 flex items-center gap-3">
                <ChefHat className="size-icon-lg text-cafe-accent" />
                {t('nav.kitchen')}
            </h1>

            <KanbanGrid
                items={allKitchenItems}
                columns={COLUMNS}
                currentTime={currentTime}
                onUpdateStatus={updateItemStatus}
                viewContext="kitchen"
            />
        </div>
    );
}