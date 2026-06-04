'use client';

import { useState, useEffect, useRef } from 'react';
import AuthForm from '@/components/AuthForm';
import ResponseWindow from '@/components/ResponseWindow';
import DatabaseMonitor from '@/components/DatabaseMonitor';
import WelcomeModal from '@/components/WelcomeModal';
import './page.css';

interface AuthResponse {
  email: string;
  token: string;
  message: string;
}

export default function Home() {
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState('');
  const [dbRefreshTrigger, setDbRefreshTrigger] = useState(0);
  const authFormRef = useRef<{ resetForm: () => void }>(null);

  const handleAuthSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthResponse({
          email: data.email,
          token: data.token,
          message: data.message,
        });

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authEmail', data.email);

        authFormRef.current?.resetForm();

        setDbRefreshTrigger(prev => prev + 1);

        if (!data.isNewUser) {
          setWelcomeEmail(data.email);
          setShowWelcomeModal(true);
        }
      } else {
        alert('Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      alert('Error sending magic link. Please try again.');
    }
  };

  return (
    <main className="magic-link-container">
      <div className="header">
        <h1>MAGIC-LINK</h1>
        <p>Secure Authentication with Magic Links</p>
      </div>

      <div className="content-grid">
        <div className="auth-section">
          <div className="section-title">AUTHENTICATION</div>
          <p className="section-subtitle">enter your email to receive a magic link</p>
          <AuthForm ref={authFormRef} onSubmit={handleAuthSubmit} />
        </div>

        <div className="response-section">
          <div className="section-title">RESPONSE</div>
          <p className="section-subtitle">email and authentication token</p>
          <ResponseWindow authResponse={authResponse} />
        </div>

        <div className="database-section">
          <div className="section-title">DATABASE MONITOR</div>
          <p className="section-subtitle">real-time changes in MAGIC-LINK-DB</p>
          <DatabaseMonitor refreshTrigger={dbRefreshTrigger} />
        </div>
      </div>

      {showWelcomeModal && (
        <WelcomeModal
          email={welcomeEmail}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}
    </main>
  );
}
