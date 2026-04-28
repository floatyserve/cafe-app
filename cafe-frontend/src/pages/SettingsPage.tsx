import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import { Moon, Sun, Monitor, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const THEME_OPTIONS = [
    { id: 'light', icon: Sun, label: 'settings.theme.light' },
    { id: 'dark', icon: Moon, label: 'settings.theme.dark' },
    { id: 'system', icon: Monitor, label: 'settings.theme.system' }
] as const;

const LANG_OPTIONS = [
    { id: 'en', label: 'English' },
    { id: 'sk', label: 'Slovenčina' }
] as const;

const getActiveStyles = (isActive: boolean) =>
    isActive
        ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
        : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover";

export default function SettingsPage() {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-cafe-primary mb-8">
                {t('settings.title')}
            </h1>

            <div className="space-y-6">

                <section className="bg-cafe-surface border border-cafe-secondary rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Monitor className="text-cafe-accent size-icon-base" />
                        {t('settings.appearance')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {THEME_OPTIONS.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setTheme(id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                                    getActiveStyles(theme === id)
                                )}
                            >
                                <Icon className="size-icon-lg mb-2" />
                                <span className="font-medium">{t(label)}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="bg-cafe-surface border border-cafe-secondary rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="text-cafe-accent size-icon-base" />
                        {t('settings.language')}
                    </h2>

                    <div className="flex gap-4">
                        {LANG_OPTIONS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => i18n.changeLanguage(id)}
                                className={cn(
                                    "px-6 py-3 rounded-xl border-2 font-medium transition-all",
                                    getActiveStyles(i18n.language === id)
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}