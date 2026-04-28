import { Users, Map } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Order } from '../../types';

export const CAFE_TABLES = [
    { id: 1, seats: 2, shape: 'circle' },
    { id: 2, seats: 4, shape: 'square' },
    { id: 4, seats: 4, shape: 'square' },
    { id: 5, seats: 2, shape: 'circle' },
    { id: 7, seats: 2, shape: 'circle' },
    { id: 9, seats: 4, shape: 'square' },
    { id: 12, seats: 6, shape: 'rectangle' },
    { id: 14, seats: 4, shape: 'square' },
];

interface FloorPlanProps {
    selectedTableId: number | null;
    onSelectTable: (id: number) => void;
    getActiveOrder: (tableId: number) => Order | undefined;
}

export default function FloorPlan({ selectedTableId, onSelectTable, getActiveOrder }: FloorPlanProps) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-200">
            <h1 className="text-3xl font-bold text-cafe-primary mb-8 flex items-center gap-3">
                <Map className="size-icon-lg text-cafe-accent" />
                Floor Plan
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {CAFE_TABLES.map((table) => {
                    const isOccupied = !!getActiveOrder(table.id);
                    const isSelected = selectedTableId === table.id;

                    return (
                        <button
                            key={table.id}
                            onClick={() => onSelectTable(table.id)}
                            className={cn(
                                "relative transition-all duration-300 flex flex-col items-center justify-center shadow-sm hover:shadow-md",
                                table.shape === 'circle' ? "rounded-full aspect-square" : "",
                                table.shape === 'square' ? "rounded-2xl aspect-square" : "",
                                table.shape === 'rectangle' ? "rounded-2xl aspect-video col-span-2" : "",
                                isOccupied
                                    ? "bg-cafe-primary text-white border-2 border-cafe-primary"
                                    : "bg-cafe-surface text-cafe-text-main border-2 border-cafe-secondary hover:border-cafe-primary/50",
                                isSelected && "ring-4 ring-cafe-accent ring-offset-4 ring-offset-cafe-bg scale-105"
                            )}
                        >
                            <span className="text-2xl font-bold mb-1">T{table.id}</span>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-medium",
                                isOccupied ? "text-cafe-surface-hover" : "text-cafe-text-muted"
                            )}>
                                <Users className="size-icon-sm" />
                                <span>{table.seats}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}