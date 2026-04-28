import { X, ShoppingBag, Plus, CreditCard, Trash2 } from 'lucide-react';
import { cn, calculateOrderTotal } from '../../lib/utils';
import type { Order } from '../../types';

interface OrderDrawerProps {
    selectedTableId: number | null;
    selectedTableConfig: { seats: number } | undefined;
    activeOrder: Order | undefined | null;
    isOrderingMode: boolean;
    onClose: () => void;
    onOpenNewOrder: () => void;
    onAddItems: () => void;
    onCheckout: () => void;
    onRemoveItem: (orderId: number, itemId: number) => void;
}

export default function OrderDrawer({
                                        selectedTableId,
                                        selectedTableConfig,
                                        activeOrder,
                                        isOrderingMode,
                                        onClose,
                                        onOpenNewOrder,
                                        onAddItems,
                                        onCheckout,
                                        onRemoveItem
                                    }: OrderDrawerProps) {
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
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-cafe-text-muted uppercase tracking-wider mb-4">Current Order</h3>
                                    <ul className="space-y-4">
                                        {activeOrder.items.map((item) => (
                                            <li key={item.id} className="flex justify-between items-start">
                                                <div className="flex gap-2">
                                                    <span className="font-bold text-cafe-accent">{item.quantity}x</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-cafe-text-main font-medium">{item.menuItem.name}</span>
                                                        <span className="text-xs text-cafe-text-muted">{item.status}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-cafe-text-muted font-medium">
                                                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                                                    </span>

                                                    {item.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => onRemoveItem(activeOrder.id, item.id)}
                                                            className="text-cafe-text-muted/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 className="size-icon-sm" />
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    <div className="border-t border-cafe-secondary/50 pt-4 flex justify-between items-center text-xl mb-4">
                                        <span className="font-bold text-cafe-text-main">Total</span>
                                        <span className="font-bold text-cafe-primary">${calculateOrderTotal(activeOrder).toFixed(2)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {!isOrderingMode && (
                                            <button
                                                onClick={onAddItems}
                                                className="bg-cafe-surface-hover hover:bg-cafe-secondary/30 text-cafe-text-main border-2 border-cafe-secondary font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                                            >
                                                <Plus className="size-icon-sm" /> Add Items
                                            </button>
                                        )}
                                        <button
                                            onClick={onCheckout}
                                            className={cn(
                                                "bg-cafe-primary hover:bg-cafe-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm",
                                                isOrderingMode ? "col-span-2" : ""
                                            )}
                                        >
                                            <CreditCard className="size-icon-sm" /> Checkout
                                        </button>
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