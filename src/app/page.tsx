'use client';

import { initData, miniApp } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import { validateInitData } from '@/utils/initDataApi';
import { useStartParam } from '@/utils/startParam';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export default function Home() {
  const startParam = useStartParam();
  const [validationStatus, setValidationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // Get user info from init data
    if (initData.user()) {
      setUsername(initData.user()?.username || initData.user()?.first_name || 'User');
    }

    // Validate init data on mount
    validateInitData().then(({ valid, user }) => {
      if (valid) {
        setValidationStatus('success');
        const tgUser = user as TelegramUser | undefined;
        if (tgUser?.username) {
          setUsername(tgUser.username);
        }
      } else {
        setValidationStatus('error');
      }
    });
  }, []);

  const handleTestButton = () => {
    alert('Telegram Mini App is working! 🎉');
  };

  return (
    <main
      style={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '400px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Welcome to Telegram Mini App! 👋
        </h1>
        <p style={{ opacity: 0.7, marginBottom: '24px' }}>
          {username ? `Hello, ${username}!` : 'Hello!'}
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
          This is a minimal Telegram Mini App starter with authentication and theme support.
        </p>
      </div>

      <button
        onClick={handleTestButton}
        style={{
          padding: '16px 32px',
          fontSize: '1rem',
          fontWeight: '600',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          background: 'var(--tg-theme-button-color, #3390ec)',
          color: 'var(--tg-theme-button-text-color, #ffffff)',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Test Mini App 🚀
      </button>

      <div style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '16px' }}>
        <div>
          Auth Status:{' '}
          <span
            style={{
              color:
                validationStatus === 'success'
                  ? '#4caf50'
                  : validationStatus === 'error'
                  ? '#f44336'
                  : '#ff9800',
            }}
          >
            {validationStatus === 'success' ? '✓ Validated' : validationStatus === 'error' ? '✗ Failed' : '⋯ Checking'}
          </span>
        </div>
        {startParam && (
          <div style={{ marginTop: '8px' }}>
            Start Param: <code>{startParam}</code>
          </div>
        )}
      </div>
    </main>
  );
}
