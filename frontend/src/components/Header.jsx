import React from 'react';
import { Landmark, Bell, User, Cpu, BarChart3, FileCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Treatment */}
        <div className="brand-wrapper" onClick={() => setActiveTab('predict')}>
          <div className="brand-icon-box">
            <Landmark size={20} strokeWidth={2.2} />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">CrediScope</span>
            <span className="brand-badge-ai">AI</span>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="header-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
              onClick={() => setActiveTab('predict')}
            >
              <FileCheck size={16} />
              <span>Prediction</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'model' ? 'active' : ''}`}
              onClick={() => setActiveTab('model')}
            >
              <BarChart3 size={16} />
              <span>Model Insights</span>
            </button>
          </div>
        </nav>

        {/* Right Header Status & Controls */}
        <div className="header-right-actions">
          {/* Backend Status Pulse */}
          <div
            className={`health-status-badge ${backendStatus.isOnline ? 'connected' : 'degraded'}`}
            title={backendStatus.message}
          >
            <span className="status-pulse-dot" />
            <span>{backendStatus.isOnline ? 'Engine Online' : 'Service Offline'}</span>
          </div>

          {/* Minimal Notifications Icon */}
          <button
            type="button"
            className="nav-tab-btn"
            style={{ padding: '6px 8px', borderRadius: '50%' }}
            title="System Diagnostics & Alerts"
            aria-label="System Notifications"
          >
            <Bell size={17} />
          </button>

          {/* Risk Officer Avatar */}
          <div className="user-profile-avatar" title="Retail Credit Underwriter">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
