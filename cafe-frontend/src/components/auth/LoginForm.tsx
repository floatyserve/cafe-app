import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../api';
import LoginFormInput from './LoginFormInput';

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.login({ username, password });
      localStorage.setItem('token', data.token);
      navigate('/waiter');
    } catch (err: any) {
      setError(t('auth.error'));
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cafe-surface border border-cafe-secondary rounded-3xl p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-status-urgent-bg text-status-urgent-text p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-status-urgent-text/10">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <LoginFormInput
          label={t('auth.username')}
          type="text"
          value={username}
          onChange={setUsername}
          icon={User}
          placeholder="Enter your username"
        />

        <LoginFormInput
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={setPassword}
          icon={Lock}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cafe-primary hover:bg-cafe-primary/90 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('auth.signIn')}...</span>
            </div>
          ) : (
            t('auth.signIn')
          )}
        </button>
      </form>
    </div>
  );
}
