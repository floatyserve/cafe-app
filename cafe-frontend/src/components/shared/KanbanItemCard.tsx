import { useTranslation } from 'react-i18next';
import { RotateCcw, Clock, Check } from 'lucide-react';
import type { OrderItem, ItemStatus, Category } from '../../types';
import { cn } from '../../lib/utils';

const CARD_STYLES: Record<ItemStatus, string> = {
    PENDING: "bg-cafe-surface border-cafe-secondary/50",
    PREPARING: "bg-status-preparing/10 border-status-preparing/50",
    READY_TO_SERVE: "bg-status-ready/10 border-status-ready/50",
    SERVED: "bg-cafe-surface-hover opacity-60 grayscale border-cafe-secondary/50"
};

const PRIMARY_BTN_BASE = "flex-1 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2";
const UNDO_BTN_BASE = "p-3 border-2 border-cafe-secondary rounded-lg text-cafe-text-muted hover:bg-cafe-surface-hover transition-all flex justify-center items-center";

interface KanbanItemCardProps {
    orderId: number;
    item: OrderItem;
    createdAt: string;
    currentTime: number;
    onUpdateStatus: (orderId: number, itemId: number, newStatus: ItemStatus) => void;
    viewContext?: 'kitchen' | 'bar' | 'waiter';
}

export default function KanbanItemCard({ orderId, item, createdAt, currentTime, onUpdateStatus, viewContext = 'waiter' }: KanbanItemCardProps) {
    const { t } = useTranslation();

    const start = new Date(createdAt).getTime();
    const diffMins = Math.floor((currentTime - start) / 60000);
    const timeText = diffMins < 1 ? t('kanban.justNow') : t('kanban.minutesAgo', { count: diffMins });
    const isUrgent = diffMins >= 15;

    const CATEGORY_VERBS: Record<Category, { start: string, undo: string }> = {
        MEAL: { start: t('kanban.actions.cook'), undo: t('kanban.actions.undoCooking') },
        DRINK: { start: t('kanban.actions.prepare'), undo: t('kanban.actions.undoPreparing') },
        DESSERT: { start: t('kanban.actions.prepare'), undo: t('kanban.actions.undoPreparing') }
    };

    const verbs = CATEGORY_VERBS[item.menuItemCategory];

    return (
        <div className={cn(
            "flex flex-col p-4 rounded-xl border-2 shadow-sm transition-all",
            CARD_STYLES[item.status]
        )}>
            <div className="flex justify-between items-center border-b border-cafe-secondary/50 pb-2 mb-3">
                <span className="font-bold text-cafe-primary">{t('kanban.order', { id: orderId })}</span>

                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md transition-colors",
                    isUrgent && item.status !== 'READY_TO_SERVE' && item.status !== 'SERVED'
                        ? "bg-status-urgent-bg text-status-urgent-text"
                        : "bg-cafe-surface-hover text-cafe-text-muted"
                )}>
                    <Clock className="size-icon-sm" />
                    <span>{timeText}</span>
                </div>
            </div>

            <div className="flex gap-2 text-cafe-text-main font-medium text-lg mb-1">
                <span className="text-cafe-accent font-bold">{item.quantity}x</span>
                <span className={(item.status === 'READY_TO_SERVE' || item.status === 'SERVED') ? "line-through opacity-60" : ""}>
                    {item.menuItemName}
                </span>
            </div>

            {item.note && (
                <p className="text-sm text-cafe-text-muted italic mb-3 border-l-2 border-cafe-secondary pl-2">
                    * {item.note}
                </p>
            )}

            <div className="flex gap-2 mt-auto pt-4">
                {item.status === 'PENDING' && (
                    <button
                        onClick={() => onUpdateStatus(orderId, item.id, 'PREPARING')}
                        className={cn(PRIMARY_BTN_BASE, "bg-status-pending")}
                    >
                        {verbs.start}
                    </button>
                )}

                {item.status === 'PREPARING' && (
                    <>
                        <button
                            onClick={() => onUpdateStatus(orderId, item.id, 'PENDING')}
                            className={UNDO_BTN_BASE}
                            title={t('kanban.actions.undoPending')}
                        >
                            <RotateCcw className="size-icon-base" />
                        </button>
                        <button
                            onClick={() => onUpdateStatus(orderId, item.id, 'READY_TO_SERVE')}
                            className={cn(PRIMARY_BTN_BASE, "bg-status-preparing")}
                        >
                            <Check className="size-icon-sm" /> {t('kanban.actions.done')}
                        </button>
                    </>
                )}

                {item.status === 'READY_TO_SERVE' && (
                    <>
                        {viewContext === 'kitchen' ? (
                            <button
                                onClick={() => onUpdateStatus(orderId, item.id, 'PREPARING')}
                                className="flex-1 border-2 border-cafe-secondary text-cafe-text-muted font-bold py-3 rounded-lg hover:bg-cafe-surface-hover flex justify-center items-center gap-2 transition-colors"
                            >
                                <RotateCcw className="size-icon-sm" /> {verbs.undo}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => onUpdateStatus(orderId, item.id, 'PREPARING')}
                                    className={UNDO_BTN_BASE}
                                    title={verbs.undo}
                                >
                                    <RotateCcw className="size-icon-base" />
                                </button>
                                <button
                                    onClick={() => onUpdateStatus(orderId, item.id, 'SERVED')}
                                    className={cn(PRIMARY_BTN_BASE, "bg-status-ready")}
                                >
                                    {t('kanban.actions.serve')}
                                </button>
                            </>
                        )}
                    </>
                )}

                {item.status === 'SERVED' && (
                    <button
                        onClick={() => onUpdateStatus(orderId, item.id, 'READY_TO_SERVE')}
                        className="flex-1 border-2 border-cafe-secondary text-cafe-text-muted font-bold py-3 rounded-lg hover:bg-cafe-surface-hover flex justify-center items-center gap-2 transition-colors"
                    >
                        <RotateCcw className="size-icon-sm" /> {t('kanban.actions.undoServing')}
                    </button>
                )}
            </div>
        </div>
    );
}