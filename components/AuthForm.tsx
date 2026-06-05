'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { validateEmail } from '@/lib/validation';
import './AuthForm.css';

interface AuthFormProps {
  onSubmit: (email: string) => void;
  onInputClick?: () => void;
}

const AuthForm = forwardRef<{ resetForm: () => void }, AuthFormProps>(
  ({ onSubmit, onInputClick }, ref) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        setEmail('');
        setError('');
      },
    }));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!email.trim()) {
        setError('Please enter an email address');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      try {
        await onSubmit(email);
      } finally {
        setIsLoading(false);
      }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) setError('');
    };

    const handleInputClick = () => {
      setEmail('');
      setError('');
      onInputClick?.();
    };

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onClick={handleInputClick}
            placeholder="Enter your email address"
            className={`email-input ${error ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="email"
            suppressHydrationWarning
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
          suppressHydrationWarning
        >
          {isLoading ? 'Sending...' : 'SEND MAGIC LINK'}
        </button>
      </form>
    );
  }
);

AuthForm.displayName = 'AuthForm';

export default AuthForm;
