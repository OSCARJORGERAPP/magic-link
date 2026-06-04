'use client';

import React, { useState } from 'react';
import './ResponseWindow.css';

interface AuthResponse {
  email: string;
  token: string;
  message: string;
}

interface ResponseWindowProps {
  authResponse: AuthResponse | null;
}

const ResponseWindow: React.FC<ResponseWindowProps> = ({ authResponse }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="response-window">
      {authResponse ? (
        <div className="response-content">
          <div className="response-field">
            <label className="field-label">EMAIL</label>
            <div className="field-value">
              <span>{authResponse.email}</span>
              <button
                className="copy-button"
                onClick={() => handleCopy(authResponse.email, 'email')}
                title="Copy email"
              >
                {copiedField === 'email' ? '✓' : '⋮⋮'}
              </button>
            </div>
          </div>

          <div className="response-field">
            <label className="field-label">TOKEN (JWT)</label>
            <div className="field-value">
              <span className="token-text">{authResponse.token}</span>
              <button
                className="copy-button"
                onClick={() => handleCopy(authResponse.token, 'token')}
                title="Copy token"
              >
                {copiedField === 'token' ? '✓' : '⋮⋮'}
              </button>
            </div>
          </div>

          <div className="response-field">
            <label className="field-label">MESSAGE</label>
            <div className="field-value message-value">
              {authResponse.message}
            </div>
          </div>
        </div>
      ) : (
        <div className="response-placeholder">
          <p>Submit your email to see authentication response</p>
        </div>
      )}
    </div>
  );
};

export default ResponseWindow;
