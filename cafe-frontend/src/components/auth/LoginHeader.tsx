import { Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LoginHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center bg-cafe-primary p-4 rounded-2xl text-white shadow-lg mb-4">
        <Coffee className="size-8" />
      </div>
      <h1 className="text-3xl font-bold text-cafe-primary">
        Cafe<span className="text-cafe-accent">Flow</span>
      </h1>
      <p className="text-cafe-text-muted mt-2 font-medium">{t('auth.welcome')}</p>
      <p className="text-cafe-text-muted text-sm">{t('auth.subtitle')}</p>
    </div>
  );
}
