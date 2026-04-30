import { X, ShoppingBag, Plus, CreditCard, Trash2, ChefHat } from 'lucide-react';
import { cn, calculateOrderTotal } from '../../lib/utils';
import type { Order, DraftItem } from '../../types';



interface OrderDrawerProps {
    selectedTableId: number | null;
    selectedTableConfig: { seats: number } | undefined;
    activeOrder: Order | undefined | null;
    isOrderingMode: boolean;

    draftItems: DraftItem[];
    onSendToKitchen: () => void;
    onRemoveDraftItem: (tempId: string) => void;

    onClose: () => void;
    onOpenNewOrder: () => void;
    onAddItems: () => void;
    onCheckout: () => void;
}

export default function OrderDrawer({
                                        selectedTableId,
                                        selectedTableConfig,
                                        activeOrder,
                                        isOrderingMode,
                                        draftItems = [], // Default to empty array
                                        onSendToKitchen,
                                        onRemoveDraftItem,
                                        onClose,
                                        onOpenNewOrder,
                                        onAddItems,
                                        onCheckout
                                    }: OrderDrawerProps) {

    const draftTotal = draftItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const orderTotal = activeOrder ? calculateOrderTotal(activeOrder) : 0;
    const grandTotal = orderTotal + draftTotal;

    return (
        <div className={cn(
            "w-96 bg-cafe-surface border-l border-cafe-secondary flex flex-col shadow-2xl transition-transform duration-300 absolute right-0 top-0 h-full z-10",
            selectedTableId ? "translate-x-0" : "translate-x-full"
        )}>
            {selectedTableId && (
                <>
                    <div className="p-6 border-b border-cafe-secondary/50 flex justify-between items-center bg-cafe-primary text-white">
                        <div>
                            <h2 className="text-2xl font-bold">Table {selectedTableId}</h2>
                            <p className="text-cafe-surface-hover text-sm">{selectedTableConfig?.seats} Seats</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="size-icon-base" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {!activeOrder ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-cafe-surface-hover rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-10 h-10 text-cafe-text-muted" />
                                </div>
                                <h3 className="text-xl font-bold text-cafe-text-main">Table is available</h3>
                                <p className="text-cafe-text-muted text-sm px-4">
                                    Guests have just sat down? Open a new ticket to start adding items.
                                </p>
                                <button
                                    onClick={onOpenNewOrder}
                                    className="mt-4 bg-cafe-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-cafe-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <Plus className="size-icon-sm" /> Open New Order
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto pr-2">

                                    {activeOrder.items.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-cafe-text-muted uppercase tracking-wider mb-4">Sent to Kitchen</h3>
                                            <ul className="space-y-4">
                                                {activeOrder.items.map((item) => (
                                                    <li key={item.id} className="flex justify-between items-start opacity-75">
                                                        <div className="flex gap-2">
                                                            <span className="font-bold text-cafe-text-muted">{item.quantity}x</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-cafe-text-main font-medium">{item.menuItem.name}</span>
                                                                <span className="text-xs font-bold text-status-ready">{item.status}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-cafe-text-muted font-medium">
                                                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {draftItems.length > 0 && (
                                        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-xl border border-orange-200 dark:border-orange-900/50">
                                            <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <ChefHat className="size-icon-sm" /> Unsent Items
                                            </h3>
                                            <ul className="space-y-3">
                                                {draftItems.map((item) => (
                                                    <li key={item.tempId} className="flex justify-between items-center">
                                                        <div className="flex gap-2">
                                                            <span className="font-bold text-orange-500">{item.quantity}x</span>
                                                            <span className="text-cafe-text-main font-bold">{item.menuItem.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-cafe-text-main font-bold">
                                                                ${(item.menuItem.price * item.quantity).toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={() => onRemoveDraftItem(item.tempId)}
                                                                className="text-red-400 hover:text-red-600 p-1 rounded-md transition-colors"
                                                            >
                                                                <Trash2 className="size-icon-sm" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 bg-cafe-surface">
                                    <div className="border-t border-cafe-secondary/50 pt-4 flex justify-between items-center text-xl mb-4">
                                        <span className="font-bold text-cafe-text-main">Total</span>
                                        <span className="font-bold text-cafe-primary">${grandTotal.toFixed(2)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {isOrderingMode ? (
                                            <button
                                                onClick={onSendToKitchen}
                                                disabled={draftItems.length === 0}
                                                className={cn(
                                                    "col-span-2 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm text-lg",
                                                    draftItems.length > 0
                                                        ? "bg-status-preparing hover:bg-status-preparing/90 hover:scale-[1.02]"
                                                        : "bg-cafe-secondary cursor-not-allowed opacity-50"
                                                )}
                                            >
                                                <ChefHat className="size-icon-base" />
                                                {draftItems.length > 0 ? "Send to Kitchen" : "Select items..."}
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={onAddItems}
                                                    className="bg-cafe-surface-hover hover:bg-cafe-secondary/30 text-cafe-text-main border-2 border-cafe-secondary font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                                                >
                                                    <Plus className="size-icon-sm" /> Add Items
                                                </button>
                                                <button
                                                    onClick={onCheckout}
                                                    className="bg-cafe-primary hover:bg-cafe-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
                                                >
                                                    <CreditCard className="size-icon-sm" /> Checkout
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}