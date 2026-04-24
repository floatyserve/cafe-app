import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import { Moon, Sun, Monitor, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

function SettingsPage() {
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
                        <button
                            onClick={() => setTheme('light')}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                                theme === 'light'
                                    ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
                                    : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                            )}
                        >
                            <Sun className="size-icon-lg mb-2" />
                            <span className="font-medium">{t('settings.theme.light')}</span>
                        </button>

                        <button
                            onClick={() => setTheme('dark')}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                                theme === 'dark'
                                    ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
                                    : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                            )}
                        >
                            <Moon className="size-icon-lg mb-2" />
                            <span className="font-medium">{t('settings.theme.dark')}</span>
                        </button>

                        <button
                            onClick={() => setTheme('system')}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                                theme === 'system'
                                    ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
                                    : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                            )}
                        >
                            <Monitor className="size-icon-lg mb-2" />
                            <span className="font-medium">{t('settings.theme.system')}</span>
                        </button>
                    </div>
                </section>

                <section className="bg-cafe-surface border border-cafe-secondary rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="text-cafe-accent size-icon-base" />
                        {t('settings.language')}
                    </h2>

                    <div className="flex gap-4">
                        <button
                            onClick={() => i18n.changeLanguage('en')}
                            className={cn(
                                "px-6 py-3 rounded-xl border-2 font-medium transition-all",
                                i18n.language === 'en'
                                    ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
                                    : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                            )}
                        >
                            English
                        </button>

                        <button
                            onClick={() => i18n.changeLanguage('sk')}
                            className={cn(
                                "px-6 py-3 rounded-xl border-2 font-medium transition-all",
                                i18n.language === 'sk'
                                    ? "border-cafe-primary bg-cafe-primary/5 text-cafe-primary"
                                    : "border-cafe-secondary text-cafe-text-muted hover:bg-cafe-surface-hover"
                            )}
                        >
                            Slovenčina
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default SettingsPage;