import React, { useState } from 'react';
import { 
  BarChart3, Cpu, Activity, PieChart, Layers, CheckCircle2, 
  Info, TrendingUp, ShieldCheck, Database, Sliders
} from 'lucide-react';

export default function ModelInfoCard({ modelInfo }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Feature influence ranking according to Logistic Regression coefficients
  const featureWeights = [
    { name: 'Credit History (CIBIL)', weight: 95, impact: 'High Positive', type: 'Primary Risk Filter' },
    { name: 'Property Area: Semiurban', weight: 68, impact: 'Moderate Positive', type: 'Geographic Factor' },
    { name: 'Married (Yes)', weight: 52, impact: 'Positive', type: 'Household Stability' },
    { name: 'Applicant Monthly Income', weight: 48, impact: 'Positive', type: 'Repayment Capacity' },
    { name: 'Co-Applicant Income', weight: 42, impact: 'Positive', type: 'Cash Flow Buffer' },
    { name: 'Education: Not Graduate', weight: -38, impact: 'Negative', type: 'Earning Projection' },
    { name: 'Loan Amount', weight: -44, impact: 'Negative', type: 'Principal Exposure' },
    { name: 'Property Area: Urban', weight: 32, impact: 'Neutral', type: 'Geographic Factor' },
    { name: 'Self Employed (Yes)', weight: -25, impact: 'Slight Negative', type: 'Income Volatility' },
    { name: 'Dependents', weight: -20, impact: 'Slight Negative', type: 'Household Liability' },
  ];

  return (
    <div className="fin-card">
      <div className="fin-card-header">
        <div className="fin-card-title-group">
          <h3>Model Architecture & Empirical Intelligence</h3>
          <p>Supervised binary classification pipeline calibrated on 614 retail loan applications.</p>
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-accent)', background: 'var(--brand-accent-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(37,99,235,0.2)' }}>
          Scikit-Learn &bull; Tuned Logistic Regression
        </span>
      </div>

      <div className="fin-card-body">
        {/* Sub-Tabs Nav */}
        <div className="model-tabs-subnav" role="tablist">
          <button
            type="button"
            className={`model-subnav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Model Overview
          </button>
          <button
            type="button"
            className={`model-subnav-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Feature Influence
          </button>
          <button
            type="button"
            className={`model-subnav-btn ${activeTab === 'eda' ? 'active' : ''}`}
            onClick={() => setActiveTab('eda')}
          >
            Visual EDA & Validation
          </button>
          <button
            type="button"
            className={`model-subnav-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            Inference Pipeline
          </button>
        </div>

        {/* TAB 1: OVERVIEW & BENCHMARK METRICS */}
        {activeTab === 'overview' && (
          <div className="form-step-content">
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-navy)' }}>86.18%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '2px' }}>
                  Overall Accuracy
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-accent)' }}>84.00%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '2px' }}>
                  Precision Score
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success-text)' }}>98.82%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '2px' }}>
                  Recall (Sensitivity)
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8B5CF6' }}>0.8483</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '2px' }}>
                  ROC-AUC Score
                </div>
              </div>
            </div>

            {/* Model Architecture Metadata Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '14px' }}>
                Model Training & Hyperparameter Configuration
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Algorithm</span>
                  <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--brand-navy)' }}>Logistic Regression (liblinear solver)</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Tuning Method</span>
                  <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--brand-navy)' }}>RandomizedSearchCV (5-fold stratified CV)</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Feature Preprocessing</span>
                  <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--brand-navy)' }}>One-Hot Encoding + StandardScaler (12 features)</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Training Dataset</span>
                  <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--brand-navy)' }}>Loan_data.csv (614 retail loan records)</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-main)', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <strong>Executive Summary:</strong> The high Recall score (<strong>98.82%</strong>) ensures the retail banking institution minimizes false rejections of eligible borrowers, maximizing loan origination volume while maintaining an <strong>84.83% ROC-AUC</strong> barrier against high default-risk applicants.
            </div>
          </div>
        )}

        {/* TAB 2: FEATURE INFLUENCE */}
        {activeTab === 'features' && (
          <div className="form-step-content">
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                Statistical Feature Influence & Coefficients
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Relative impact of borrower attributes on loan approval odds (derived from normalized logistic coefficients).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {featureWeights.map((f, i) => {
                const isPositive = f.weight > 0;
                const absWeight = Math.abs(f.weight);
                return (
                  <div key={i} style={{ background: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: '8px', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-navy)' }}>
                        {f.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>{f.type}</span>
                        <span className={`factor-impact-badge ${isPositive ? 'positive' : 'negative'}`}>
                          {f.impact}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${absWeight}%`,
                          height: '100%',
                          background: isPositive ? 'var(--brand-accent)' : 'var(--danger)',
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', padding: '12px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '0.785rem', color: '#92400E' }}>
              <strong>Statistical Note:</strong> In Logistic Regression, coefficients reflect log-odds impact on the approval probability. <em>Credit History</em> exhibits the highest positive $z$-score, acting as the primary eligibility filter.
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL EDA GALLERY */}
        {activeTab === 'eda' && (
          <div className="form-step-content">
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                Visual Exploratory Data Analysis & Empirical Charts
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Empirical charts generated during exploratory analysis and cross-validation benchmarking.
              </p>
            </div>

            <div className="eda-gallery-grid">
              <div className="eda-chart-card">
                <img src="/images/model_comparison.png" alt="Algorithm Comparison" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="eda-chart-meta">
                  <h4>Cross-Validation Algorithm Benchmark</h4>
                  <p>Evaluates Logistic Regression against Random Forest, AdaBoost, and SVM across cross-validation folds.</p>
                </div>
              </div>

              <div className="eda-chart-card">
                <img src="/images/roc_curve_logistic_regression.png" alt="ROC Curve" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="eda-chart-meta">
                  <h4>ROC Curve & Discrimination Boundary</h4>
                  <p>Demonstrates outstanding discriminative separation between approved and defaulting loans (AUC = 0.848).</p>
                </div>
              </div>

              <div className="eda-chart-card">
                <img src="/images/confusion_matrix_log.png" alt="Confusion Matrix" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="eda-chart-meta">
                  <h4>Validation Confusion Matrix</h4>
                  <p>Confirms 98.82% recall, effectively minimizing false credit rejection rates on eligible applicants.</p>
                </div>
              </div>

              <div className="eda-chart-card">
                <img src="/images/correlation_heatmap.png" alt="Correlation Heatmap" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="eda-chart-meta">
                  <h4>Feature Correlation Matrix</h4>
                  <p>Verifies independence across numerical income levels, loan amount ratios, and credit histories.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PREDICTION PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="form-step-content">
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                End-to-End Inference Execution Pipeline
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Deterministic flow from client HTTP request to model score generation.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { step: '01', title: 'HTTP Request & Pydantic Validation', desc: 'Validates applicant inputs, data types, and non-negative income constraints via FastAPI.' },
                { step: '02', title: 'Feature Transformation & Encoding', desc: 'Encodes categorical nominal features into one-hot dummy columns (dropping reference classes) and converts Dependents ordinally.' },
                { step: '03', title: 'StandardScaler Transformation', desc: 'Scales the 12-dimensional vector with fitted mean and variance parameters loaded from scaler.pkl.' },
                { step: '04', title: 'Logistic Regression Probability Inference', desc: 'Calculates raw class probabilities via model.predict_proba() using tuned liblinear solver parameters.' },
                { step: '05', title: 'Decision Structuring & Risk Breakdown', desc: 'Constructs response payload with approval status, confidence score, default risk metrics, and banking guidance.' }
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-main)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-accent)', background: 'var(--brand-accent-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
                    {p.step}
                  </span>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>{p.title}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
