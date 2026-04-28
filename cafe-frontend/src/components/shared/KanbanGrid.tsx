import type { OrderItem, ItemStatus } from '../../types';
import KanbanItemCard from './KanbanItemCard';
import { cn } from '../../lib/utils';

export interface ColumnConfig {
    title: string;
    status: ItemStatus;
    badgeClass: string;
}

type BoardItem = OrderItem & { orderId: number; createdAt: string };

interface KanbanGridProps {
    items: BoardItem[];
    columns: ColumnConfig[];
    currentTime: number;
    onUpdateStatus: (orderId: number, itemId: number, newStatus: ItemStatus) => void;
    viewContext: 'kitchen' | 'bar' | 'waiter';
}

export default function KanbanGrid({ items, columns, currentTime, onUpdateStatus, viewContext }: KanbanGridProps) {
    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            {columns.map(col => {
                const columnItems = items.filter(item => item.status === col.status);

                return (
                    <div key={col.status} className="flex flex-col bg-cafe-surface-hover/50 rounded-2xl p-4 border border-cafe-secondary/50 overflow-hidden">
                        <h2 className="text-xl font-bold text-cafe-text-main mb-4 flex justify-between items-center">
                            {col.title}
                            <span className={cn("text-white text-sm px-3 py-1 rounded-full", col.badgeClass)}>
                                {columnItems.length}
                            </span>
                        </h2>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {columnItems.map(item => (
                                <KanbanItemCard
                                    key={item.id}
                                    orderId={item.orderId}
                                    item={item}
                                    createdAt={item.createdAt}
                                    currentTime={currentTime}
                                    onUpdateStatus={onUpdateStatus}
                                    viewContext={viewContext}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}