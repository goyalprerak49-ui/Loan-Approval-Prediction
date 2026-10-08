import React from 'react';

export default function StatusBanner({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="alert-banner error" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div style={{ flex: 1 }}>
        <strong>Application Notice: </strong> {error}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold', fontSize: '1.1rem' }}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
}
