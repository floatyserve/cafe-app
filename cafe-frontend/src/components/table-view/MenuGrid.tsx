import { ChevronLeft, Coffee } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Category, MenuItem } from '../../types';

interface MenuGridProps {
    menuItems: MenuItem[];
    activeCategory: Category;
    onSelectCategory: (category: Category) => void;
    onAddItem: (item: MenuItem) => void;
    onBack: () => void;
}

export default function MenuGrid({ menuItems, activeCategory, onSelectCategory, onAddItem, onBack }: MenuGridProps) {
    return (
        <div className="animate-in slide-in-from-left-8 fade-in duration-300 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-3 bg-cafe-surface border-2 border-cafe-secondary rounded-xl hover:bg-cafe-surface-hover text-cafe-text-muted transition-colors"
                >
                    <ChevronLeft className="size-icon-base" />
                </button>
                <h1 className="text-3xl font-bold text-cafe-primary flex items-center gap-3">
                    <Coffee className="size-icon-lg text-cafe-accent" />
                    Menu
                </h1>
            </div>

            <div className="flex gap-4 mb-6">
                {(['DRINK', 'MEAL', 'DESSERT'] as Category[]).map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "px-6 py-3 rounded-xl font-bold transition-all",
                            activeCategory === category
                                ? "bg-cafe-primary text-white shadow-md"
                                : "bg-cafe-surface border-2 border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-8">
                {menuItems.filter(item => item.category === activeCategory).map(item => (
                    <button
                        key={item.id}
                        onClick={() => onAddItem(item)}
                        className="bg-cafe-surface border-2 border-cafe-secondary rounded-2xl p-4 text-left flex flex-col h-32 hover:border-cafe-primary/50 hover:shadow-md transition-all active:scale-95"
                    >
                        <span className="font-bold text-cafe-text-main text-lg leading-tight mb-auto">{item.name}</span>
                        <span className="font-bold text-cafe-accent">${item.price.toFixed(2)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
