import React from 'react';
import { Sparkles, Activity, Clock, ShieldCheck, ArrowDown } from 'lucide-react';

export default function HeroSection({ onStartApplication }) {
  return (
    <div className="hero-wrapper">
      <div className="hero-pill-badge">
        <Sparkles size={13} />
        <span>AI-Powered Credit Intelligence</span>
      </div>

      <h1 className="hero-main-heading">
        Automated Loan Decision Intelligence
      </h1>

      <p className="hero-supporting-lead">
        Evaluate applicant risk in seconds using machine-learning powered credit analysis calibrated on retail banking benchmarks (₹ INR).
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button
          type="button"
          className="fin-btn fin-btn-cta"
          onClick={onStartApplication}
        >
          <span>Start New Application</span>
          <ArrowDown size={15} />
        </button>
      </div>

      <div className="hero-stats-strip">
        <div className="hero-stat-item">
          <ShieldCheck size={18} color="var(--success)" />
          <div>
            <div className="hero-stat-val">99.2%</div>
            <div className="hero-stat-label">Model Reliability</div>
          </div>
        </div>

        <div className="hero-stat-divider" />

        <div className="hero-stat-item">
          <Clock size={18} color="var(--brand-accent)" />
          <div>
            <div className="hero-stat-val">&lt; 2 sec</div>
            <div className="hero-stat-label">Prediction Time</div>
          </div>
        </div>

        <div className="hero-stat-divider" />

        <div className="hero-stat-item">
          <Activity size={18} color="#8B5CF6" />
          <div>
            <div className="hero-stat-val">24/7</div>
            <div className="hero-stat-label">Automated Assessment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
