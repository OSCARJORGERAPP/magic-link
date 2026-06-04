'use client';

import React from 'react';
import './WelcomeModal.css';

interface WelcomeModalProps {
  email: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ email, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>WELCOME BACK</h2>
        </div>

        <div className="modal-body">
          <p className="welcome-message">
            Welcome back, <strong>{email}</strong>!
          </p>
          <p className="subtext">
            A magic link has been sent to your email address. Click the link or use the token provided to authenticate.
          </p>
        </div>

        <div className="modal-footer">
          <button className="close-button" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
