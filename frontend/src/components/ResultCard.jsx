import React, { useRef, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Sparkles, TrendingUp, 
  ShieldCheck, AlertCircle, RotateCcw, Info, ArrowUpRight, ArrowDownRight,
  ChevronRight
} from 'lucide-react';

export default function ResultCard({ result, inputData, onReset }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (result && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  if (!result) return null;

  const isApproved = result.loan_status === 'Approved' || result.prediction === 1;
  const approvalPercent = result.approval_probability !== null 
    ? Number((result.approval_probability * 100).toFixed(1))
    : (result.confidence ? Number((result.confidence * 100).toFixed(1)) : 50);
  const rejectionPercent = result.rejection_probability !== null 
    ? Number((result.rejection_probability * 100).toFixed(1))
    : Number((100 - approvalPercent).toFixed(1));

  // Determine risk category & semantic color state
  let decisionCategory = 'approved';
  let riskLevelText = 'Low Risk';
  let riskScoreValue = Math.round(rejectionPercent); // 0-100 default probability

  if (isApproved) {
    if (approvalPercent >= 75) {
      decisionCategory = 'approved';
      riskLevelText = 'Low Risk (Prime)';
    } else {
      decisionCategory = 'review';
      riskLevelText = 'Moderate Risk';
    }
  } else {
    decisionCategory = 'rejected';
    riskLevelText = 'High Default Risk';
  }

  // Financial values from submitted inputData
  const applicantIncome = inputData ? Number(inputData.applicant_income) : 5000;
  const coapplicantIncome = inputData ? Number(inputData.coapplicant_income || 0) : 1500;
  const totalIncome = applicantIncome + coapplicantIncome;
  const loanAmountInThousands = inputData ? Number(inputData.loan_amount) : 120;
  const loanAmountINR = loanAmountInThousands * 1000;
  const loanTermMonths = inputData ? Number(inputData.loan_amount_term) : 360;

  // Approximate Monthly EMI calculation at 8.5% p.a.
  const annualRate = 0.085;
  const monthlyRate = annualRate / 12;
  const emi = loanTermMonths > 0
    ? Math.round((loanAmountINR * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1))
    : 0;
  const emiRatio = totalIncome > 0 ? ((emi / totalIncome) * 100).toFixed(1) : 0;

  // Benchmark dataset approved borrower averages (from Loan_data.csv)
  const benchmarks = {
    income: 5403,
    household: 6972,
    loan: 144, // in thousands
  };

  // Speedometer Gauge Angle: -90 deg (0%) to +90 deg (100%)
  const needleAngle = -90 + (approvalPercent / 100) * 180;

  return (
    <div ref={cardRef} className="result-section-wrap">
      {/* 1. DECISION HERO CARD */}
      <div className={`result-hero-card ${decisionCategory}`}>
        <div className="result-hero-top">
          <div className="decision-badge-block">
            <div className="decision-icon-pill">
              {decisionCategory === 'approved' ? (
                <CheckCircle2 size={32} strokeWidth={2.5} />
              ) : decisionCategory === 'review' ? (
                <AlertTriangle size={32} strokeWidth={2.5} />
              ) : (
                <XCircle size={32} strokeWidth={2.5} />
              )}
            </div>
            <div className="decision-title-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
                  Credit Assessment Decision
                </span>
                <span className="gauge-sub-badge">
                  {riskLevelText}
                </span>
              </div>
              <h2>
                {isApproved ? 'LOAN APPLICATION APPROVED' : 'APPLICATION NOT APPROVED'}
              </h2>
              <p className="decision-subtitle">
                {result.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="fin-btn fin-btn-secondary"
            onClick={onReset}
          >
            <RotateCcw size={15} /> Evaluate Another Profile
          </button>
        </div>

        {/* 2. VISUALIZATION GRID: RADIAL GAUGE + RISK SCALE */}
        <div className="result-graphs-grid">
          {/* Gauge Panel */}
          <div className="gauge-visual-panel">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
              Model Approval Confidence
            </span>

            {/* Speedometer Gauge SVG */}
            <div style={{ position: 'relative', width: '220px', height: '125px', marginTop: '8px' }}>
              <svg width="220" height="125" viewBox="0 0 220 125">
                <defs>
                  <linearGradient id="finGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="75%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 110 A 88 88 0 0 1 198 110"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 22 110 A 88 88 0 0 1 198 110"
                  fill="none"
                  stroke="url(#finGaugeGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* 50% Threshold Marker */}
                <line x1="110" y1="20" x2="110" y2="34" stroke="#0F172A" strokeWidth="2" strokeDasharray="2,2" />
                <circle cx="110" cy="110" r="6" fill="#0F172A" />
                {/* Rotating Needle */}
                <g transform={`rotate(${needleAngle}, 110, 110)`}>
                  <line x1="110" y1="110" x2="110" y2="40" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="110" cy="40" r="3" fill={isApproved ? '#059669' : '#DC2626'} />
                </g>
              </svg>
            </div>

            <div className="gauge-pct-big">
              {approvalPercent}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Probability of Approval
            </div>

            {/* Dual Probability Bar */}
            <div style={{ width: '100%', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: 'var(--success-text)' }}>Approval: {approvalPercent}%</span>
                <span style={{ color: 'var(--danger-text)' }}>Default Risk: {rejectionPercent}%</span>
              </div>
              <div style={{ height: '7px', background: '#FEE2E2', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${approvalPercent}%`, background: 'var(--success)', transition: 'width 0.8s ease' }} />
                <div style={{ width: `${rejectionPercent}%`, background: 'var(--danger)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="risk-scale-card">
            <div>
              <div className="risk-scale-header">
                <span className="risk-scale-title">Underwriting Risk Score</span>
                <span className="risk-scale-score">{riskScoreValue} / 100</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Empirical default likelihood computed by the tuned Logistic Regression classifier.
              </p>

              {/* Horizontal Risk Track */}
              <div className="risk-track-bar">
                <div
                  className="risk-needle-marker"
                  style={{ left: `${Math.min(Math.max(riskScoreValue, 4), 96)}%` }}
                  title={`Risk Score: ${riskScoreValue}/100`}
                />
              </div>

              <div className="risk-labels-row">
                <span style={{ color: 'var(--success-text)' }}>Low Risk (0&ndash;35)</span>
                <span style={{ color: 'var(--warning-text)' }}>Moderate (36&ndash;60)</span>
                <span style={{ color: 'var(--danger-text)' }}>High Risk (61&ndash;100)</span>
              </div>
            </div>

            {/* Quick Underwriting Metric Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-main)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Est. Monthly EMI
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  ₹{emi.toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/mo</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-main)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  EMI-to-Income (DTI)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: Number(emiRatio) <= 50 ? 'var(--success-text)' : 'var(--danger-text)' }}>
                  {emiRatio}% {Number(emiRatio) <= 50 ? '(Healthy)' : '(High)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI EXPLANATION CARD */}
      <div className="ai-explanation-box">
        <div className="ai-sparkle-pill">
          <Sparkles size={17} />
        </div>
        <div className="ai-explanation-content">
          <h4>Why CrediScope AI Reached This Decision</h4>
          <p>
            {isApproved ? (
              <>
                The applicant demonstrates a resilient credit profile characterized by verified bureau repayment compliance (CIBIL 1.0) and sustainable debt-servicing liquidity with a monthly EMI obligation representing {emiRatio}% of household income.
              </>
            ) : (
              <>
                The application exhibits heightened credit risk primarily driven by documented historical delinquency flags on the credit bureau record and elevated loan exposure relative to declared household income.
              </>
            )}
          </p>
        </div>
      </div>

      {/* 4. KEY DECISION FACTORS ("Why this decision?") */}
      <div className="decision-factors-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
              Why this decision? &bull; Key Evaluated Drivers
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Algorithmic weight and impact assessment across the top 4 predictive model dimensions.
            </p>
          </div>
        </div>

        <div className="factors-list">
          {/* Factor 1: Credit History */}
          <div className="factor-item-card">
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-navy)' }}>
                Credit Bureau Record
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {inputData?.credit_history === 1 ? 'Meets guidelines, no defaults' : 'Delinquencies or defaults detected'}
              </div>
            </div>
            <span className={`factor-impact-badge ${inputData?.credit_history === 1 ? 'positive' : 'negative'}`}>
              {inputData?.credit_history === 1 ? 'Strong Positive' : 'High Risk'}
            </span>
          </div>

          {/* Factor 2: Debt-to-Income Capacity */}
          <div className="factor-item-card">
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-navy)' }}>
                Repayment Capacity
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                EMI represents {emiRatio}% of total cash flow
              </div>
            </div>
            <span className={`factor-impact-badge ${Number(emiRatio) <= 50 ? 'positive' : 'negative'}`}>
              {Number(emiRatio) <= 50 ? 'Positive' : 'Debt Burden'}
            </span>
          </div>

          {/* Factor 3: Co-Applicant Buffer */}
          <div className="factor-item-card">
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-navy)' }}>
                Co-Applicant Income
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {coapplicantIncome > 0 ? `+₹${coapplicantIncome.toLocaleString('en-IN')} additional cash flow` : 'Single applicant profile'}
              </div>
            </div>
            <span className={`factor-impact-badge ${coapplicantIncome > 0 ? 'positive' : 'neutral'}`}>
              {coapplicantIncome > 0 ? 'Positive' : 'Neutral'}
            </span>
          </div>

          {/* Factor 4: Property Location */}
          <div className="factor-item-card">
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-navy)' }}>
                Property Classification
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {inputData?.property_area} collateral tier
              </div>
            </div>
            <span className={`factor-impact-badge ${inputData?.property_area === 'Semiurban' ? 'positive' : 'neutral'}`}>
              {inputData?.property_area === 'Semiurban' ? 'Positive' : 'Neutral'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. APPLICANT VS APPROVED BENCHMARK COMPARISON */}
      <div className="benchmark-dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
              Applicant Profile vs Historical Approved Averages
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Comparing this borrower against approved retail loan benchmarks in Indian Rupees (₹).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--brand-accent)', borderRadius: '2px' }} />
              This Applicant
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#94A3B8', borderRadius: '2px' }} />
              Approved Benchmark Average
            </span>
          </div>
        </div>

        {/* Comparison Row 1: Monthly Income */}
        <div className="benchmark-row-item">
          <div className="benchmark-metric-label">
            Primary Applicant Income
          </div>
          <div className="benchmark-bars-pair">
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill applicant"
                  style={{ width: `${Math.min((applicantIncome / 10000) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text">₹{applicantIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill benchmark"
                  style={{ width: `${Math.min((benchmarks.income / 10000) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text" style={{ color: '#94A3B8' }}>₹{benchmarks.income.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Comparison Row 2: Total Household Income */}
        <div className="benchmark-row-item">
          <div className="benchmark-metric-label">
            Total Household Income
          </div>
          <div className="benchmark-bars-pair">
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill applicant"
                  style={{ width: `${Math.min((totalIncome / 12000) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text">₹{totalIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill benchmark"
                  style={{ width: `${Math.min((benchmarks.household / 12000) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text" style={{ color: '#94A3B8' }}>₹{benchmarks.household.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Comparison Row 3: Requested Loan */}
        <div className="benchmark-row-item">
          <div className="benchmark-metric-label">
            Requested Loan Facility
          </div>
          <div className="benchmark-bars-pair">
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill applicant"
                  style={{ width: `${Math.min((loanAmountInThousands / 300) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text">₹{loanAmountINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="benchmark-sub-bar-wrap">
              <div className="benchmark-sub-bar-track">
                <div
                  className="benchmark-sub-bar-fill benchmark"
                  style={{ width: `${Math.min((benchmarks.loan / 300) * 100, 100)}%` }}
                />
              </div>
              <span className="benchmark-val-text" style={{ color: '#94A3B8' }}>₹1,44,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. DECISION SUMMARY TABLE */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '12px' }}>
          Decision Summary & Key Parameters
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Approval Likelihood</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success-text)' }}>{approvalPercent}%</div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Default Risk</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger-text)' }}>{rejectionPercent}%</div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Credit History</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: inputData?.credit_history === 1 ? 'var(--success-text)' : 'var(--danger-text)' }}>
              {inputData?.credit_history === 1 ? 'Verified (1.0)' : 'Defaults (0.0)'}
            </div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Property Trend</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>{inputData?.property_area}</div>
          </div>
        </div>
      </div>

      {/* 7. BANKING DISCLAIMER */}
      <div style={{ padding: '12px 18px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', fontSize: '0.785rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Banking Notice:</strong> This algorithmic credit evaluation is generated using machine learning classification calibrated on historical retail loan portfolios. All financial computations are formatted in <strong>Indian Rupees (₹ INR)</strong>. Final sanction remains subject to KYC verification, physical collateral inspection, and underwriting committee approval.
        </span>
      </div>
    </div>
  );
}
