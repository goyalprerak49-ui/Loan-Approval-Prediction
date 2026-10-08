import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-main)', padding: '24px 16px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: 'var(--text-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--brand-accent)" />
          <strong style={{ color: 'var(--brand-navy)' }}>CrediScope AI</strong> &bull; AI-Powered Credit Intelligence
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span>Prediction Engine &bull; Model Insights &bull; API Health</span>
          <span style={{ color: 'var(--border-hover)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={14} /> Built for intelligent retail lending decisions
          </span>
        </div>
      </div>
    </footer>
  );
}
