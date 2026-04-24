import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Coffee, ChefHat, GlassWater, Settings, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

function AppLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { t } = useTranslation();

    const navLinks = [
        { name: t('nav.waiter'), path: '/waiter', icon: Coffee },
        { name: t('nav.kitchen'), path: '/kitchen', icon: ChefHat },
        { name: t('nav.bar'), path: '/bar', icon: GlassWater },
    ];

    return (
        <div className="flex h-screen bg-cafe-bg text-cafe-text-main font-sans overflow-hidden">

            <aside className={cn(
                "bg-cafe-surface border-r border-cafe-secondary flex flex-col transition-all duration-300 relative",
                isSidebarOpen ? "w-64" : "w-20 items-center"
            )}>

                <div className={cn(
                    "p-6 w-full border-b border-cafe-secondary/30 flex items-center h-20",
                    isSidebarOpen ? "justify-between" : "justify-center"
                )}>
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="bg-cafe-primary p-2 rounded-lg text-white">
                                <Coffee className="size-icon-lg" />
                            </div>
                            <h1 className="text-xl font-bold text-cafe-primary">
                                Cafe<span className="text-cafe-accent">Flow</span>
                            </h1>
                        </div>
                    )}

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-cafe-text-muted hover:text-cafe-primary transition-colors p-1"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu className="size-icon-lg" />
                    </button>
                </div>

                <nav className="flex-1 w-full p-4 space-y-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 py-3 rounded-xl transition-all font-medium",
                                        isSidebarOpen ? "px-4 w-full" : "justify-center w-12 mx-auto",
                                        isActive
                                            ? "bg-cafe-primary text-white shadow-md"
                                            : "text-cafe-text-muted hover:bg-cafe-surface-hover hover:text-cafe-text-main"
                                    )
                                }
                                title={!isSidebarOpen ? link.name : undefined}
                            >
                                <Icon className="size-icon-base" />
                                {isSidebarOpen && <span>{link.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 w-full border-t border-cafe-secondary/30">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 py-3 rounded-xl transition-all font-medium",
                                isSidebarOpen ? "px-4 w-full" : "justify-center w-12 mx-auto",
                                isActive
                                    ? "bg-cafe-primary text-white shadow-md"
                                    : "text-cafe-text-muted hover:bg-cafe-surface-hover hover:text-cafe-text-main"
                            )
                        }
                    >
                        <Settings className="size-icon-base" />
                        {isSidebarOpen && <span>{t('nav.settings')}</span>}
                    </NavLink>
                </div>
            </aside>

            <main className="flex-1 h-full overflow-y-auto">
                <Outlet />
            </main>

        </div>
    );
}

export default AppLayout;