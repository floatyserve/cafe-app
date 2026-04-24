import { RotateCcw, Clock } from 'lucide-react';
import type { OrderItem, ItemStatus } from '../../types';
import { cn } from '../../lib/utils';

const CARD_STYLES: Record<ItemStatus, string> = {
    PENDING: "bg-cafe-surface border-cafe-secondary/50",
    PREPARING: "bg-status-preparing/10 border-status-preparing/50",
    READY: "bg-status-ready/10 border-status-ready/50",
    SERVED: "hidden"
};

const PRIMARY_BTN_BASE = "flex-1 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity";
const UNDO_BTN_BASE = "p-3 border-2 border-cafe-secondary rounded-lg text-cafe-text-muted hover:bg-cafe-surface-hover transition-all flex justify-center items-center";

interface KitchenItemCardProps {
    orderId: number;
    item: OrderItem;
    createdAt: string;
    currentTime: number;
    onUpdateStatus: (orderId: number, itemId: number, newStatus: ItemStatus) => void;
}

export default function KitchenItemCard({ orderId, item, createdAt, currentTime, onUpdateStatus }: KitchenItemCardProps) {

    const start = new Date(createdAt).getTime();
    const diffMins = Math.floor((currentTime - start) / 60000);
    const timeText = diffMins < 1 ? 'Just now' : `${diffMins}m`;
    const isUrgent = diffMins >= 15;

    return (
        <div className={cn(
            "flex flex-col p-4 rounded-xl border-2 shadow-sm transition-all",
            CARD_STYLES[item.status]
        )}>
            <div className="flex justify-between items-center border-b border-cafe-secondary/50 pb-2 mb-3">
                <span className="font-bold text-cafe-primary">Order #{orderId}</span>

                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md transition-colors",
                    isUrgent && item.status !== 'READY'
                        ? "bg-status-urgent-bg text-status-urgent-text"
                        : "bg-cafe-surface-hover text-cafe-text-muted"
                )}>
                    <Clock className="size-icon-sm" />
                    <span>{timeText}</span>
                </div>
            </div>

            <div className="flex gap-2 text-cafe-text-main font-medium text-lg mb-1">
                <span className="text-cafe-accent font-bold">{item.quantity}x</span>
                <span className={item.status === 'READY' ? "line-through opacity-60" : ""}>
                    {item.menuItem.name}
                </span>
            </div>

            {item.notes && (
                <p className="text-sm text-cafe-text-muted italic mb-3 border-l-2 border-cafe-secondary pl-2">
                    * {item.notes}
                </p>
            )}

            <div className="flex gap-2 mt-auto pt-4">
                {item.status === 'PENDING' && (
                    <button
                        onClick={() => onUpdateStatus(orderId, item.id, 'PREPARING')}
                        className={cn(PRIMARY_BTN_BASE, "bg-status-pending")}
                    >
                        Cook
                    </button>
                )}

                {item.status === 'PREPARING' && (
                    <>
                        <button
                            onClick={() => onUpdateStatus(orderId, item.id, 'PENDING')}
                            className={UNDO_BTN_BASE}
                            title="Undo to Pending"
                        >
                            <RotateCcw className="size-icon-base" />
                        </button>
                        <button
                            onClick={() => onUpdateStatus(orderId, item.id, 'READY')}
                            className={cn(PRIMARY_BTN_BASE, "bg-status-preparing")}
                        >
                            Done
                        </button>
                    </>
                )}

                {item.status === 'READY' && (
                    <button
                        onClick={() => onUpdateStatus(orderId, item.id, 'PREPARING')}
                        className="flex-1 border-2 border-status-ready/50 text-status-ready font-bold py-3 rounded-lg hover:bg-status-ready/10 flex justify-center items-center gap-2 transition-colors"
                    >
                        <RotateCcw className="size-icon-sm" /> Undo to Cooking
                    </button>
                )}
            </div>
        </div>
    );
}