import { useTranslation } from 'react-i18next';
import { Users, Map } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Order, Table } from '../../types';

interface FloorPlanProps {
    tables: Table[];
    selectedTableId: number | null;
    onSelectTable: (id: number) => void;
    getActiveOrder: (tableId: number) => Order | undefined;
}

const MAX_CAPACITY_SMALL = 2;
const MAX_CAPACITY_MEDIUM = 4;

const getTableShapeClasses = (capacity: number): string => {
    if (capacity <= MAX_CAPACITY_SMALL) return "rounded-full aspect-square";
    if (capacity <= MAX_CAPACITY_MEDIUM) return "rounded-2xl aspect-square";
    return "rounded-2xl aspect-video col-span-2";
};

const getTableColorClasses = (isOccupied: boolean, isOutOfOrder: boolean): string => {
    if (isOutOfOrder) return "bg-cafe-surface text-cafe-text-muted border-2 border-cafe-secondary border-dashed opacity-60";
    if (isOccupied) return "bg-table-occupied-bg text-cafe-text-main border-2 border-table-occupied-border hover:opacity-80";
    return "bg-table-free-bg text-cafe-text-main border-2 border-table-free-border hover:opacity-80";
};

export default function FloorPlan({ tables, selectedTableId, onSelectTable, getActiveOrder }: FloorPlanProps) {
    const { t } = useTranslation();

    return (
        <div className="animate-in fade-in zoom-in-95 duration-200">
            <h1 className="text-3xl font-bold text-cafe-primary mb-8 flex items-center gap-3">
                <Map className="size-icon-lg text-cafe-accent" />
                {t('floorPlan.title')}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {tables.map((table) => {
                    const isOccupied = !!getActiveOrder(table.id);
                    const isSelected = selectedTableId === table.id;

                    return (
                        <button
                            key={table.id}
                            onClick={() => onSelectTable(table.id)}
                            className={cn(
                                "relative transition-all duration-300 flex flex-col items-center justify-center shadow-sm",
                                getTableShapeClasses(table.capacity),
                                getTableColorClasses(isOccupied, table.outOfOrder),
                                isSelected && "ring-4 ring-cafe-accent ring-offset-4 ring-offset-cafe-bg scale-105 shadow-md"
                            )}
                        >
                            <span className="text-2xl font-bold mb-1">T{table.number}</span>
                            <div className="flex items-center gap-1 text-sm font-medium opacity-80">
                                <Users className="size-icon-sm" />
                                <span>{table.capacity}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}