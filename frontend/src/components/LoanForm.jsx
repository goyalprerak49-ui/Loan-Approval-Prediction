import React, { useState } from 'react';
import { 
  User, Users, Heart, GraduationCap, Briefcase, IndianRupee, 
  CreditCard, ShieldCheck, AlertCircle, Home, Clock, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, RotateCcw, Edit3
} from 'lucide-react';

const PRESETS = {
  prime: {
    gender: 'Male',
    married: 'Yes',
    dependents: '1',
    education: 'Graduate',
    self_employed: 'No',
    applicant_income: 5000,
    coapplicant_income: 1500,
    loan_amount: 120,
    loan_amount_term: 360,
    credit_history: 1.0,
    property_area: 'Semiurban',
  },
  risk: {
    gender: 'Female',
    married: 'No',
    dependents: '0',
    education: 'Not Graduate',
    self_employed: 'Yes',
    applicant_income: 2000,
    coapplicant_income: 0,
    loan_amount: 200,
    loan_amount_term: 360,
    credit_history: 0.0,
    property_area: 'Rural',
  },
  highIncome: {
    gender: 'Male',
    married: 'Yes',
    dependents: '2',
    education: 'Graduate',
    self_employed: 'No',
    applicant_income: 9500,
    coapplicant_income: 3500,
    loan_amount: 250,
    loan_amount_term: 360,
    credit_history: 1.0,
    property_area: 'Urban',
  },
};

const INITIAL_FORM = {
  gender: 'Male',
  married: 'Yes',
  dependents: '0',
  education: 'Graduate',
  self_employed: 'No',
  applicant_income: '',
  coapplicant_income: '0',
  loan_amount: '',
  loan_amount_term: '360',
  credit_history: 1.0,
  property_area: 'Semiurban',
};

export default function LoanForm({ onSubmit, isLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Populate preset profile & advance to Review step for 1-click evaluation
  const applyPreset = (key) => {
    setFormData(PRESETS[key]);
    setErrors({});
    setCurrentStep(4);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCreditChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      credit_history: val,
    }));
  };

  // Step-by-step validations
  const validateStep = (step) => {
    const errs = {};

    if (step === 2) {
      if (formData.applicant_income === '' || isNaN(formData.applicant_income)) {
        errs.applicant_income = 'Applicant income is required.';
      } else if (Number(formData.applicant_income) < 0) {
        errs.applicant_income = 'Income cannot be negative.';
      }

      if (formData.coapplicant_income === '' || isNaN(formData.coapplicant_income)) {
        errs.coapplicant_income = 'Co-applicant income must be a valid number.';
      } else if (Number(formData.coapplicant_income) < 0) {
        errs.coapplicant_income = 'Co-applicant income cannot be negative.';
      }
    }

    if (step === 3) {
      if (formData.loan_amount === '' || isNaN(formData.loan_amount)) {
        errs.loan_amount = 'Loan amount is required.';
      } else if (Number(formData.loan_amount) <= 0) {
        errs.loan_amount = 'Loan amount must be greater than 0.';
      }

      if (formData.loan_amount_term === '' || isNaN(formData.loan_amount_term)) {
        errs.loan_amount_term = 'Loan term is required.';
      } else if (Number(formData.loan_amount_term) <= 0) {
        errs.loan_amount_term = 'Loan term must be greater than 0.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setCurrentStep(1);
  };

  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateStep(2) || !validateStep(3)) {
      setCurrentStep(2);
      return;
    }

    const payload = {
      gender: formData.gender,
      married: formData.married,
      dependents: formData.dependents,
      education: formData.education,
      self_employed: formData.self_employed,
      applicant_income: Number(formData.applicant_income),
      coapplicant_income: Number(formData.coapplicant_income || 0),
      loan_amount: Number(formData.loan_amount),
      loan_amount_term: Number(formData.loan_amount_term),
      credit_history: Number(formData.credit_history),
      property_area: formData.property_area,
    };

    onSubmit(payload);
  };

  return (
    <div className="fin-card">
      <div className="fin-card-header">
        <div className="fin-card-title-group">
          <h3>Retail Credit Application Workbench</h3>
          <p>Guided assessment pipeline calibrated against historical banking risk models.</p>
        </div>

        {/* Quick Profiles Bar */}
        <div className="presets-chips-row">
          <span className="presets-tag-label" style={{ marginRight: '4px' }}>
            <Sparkles size={14} color="var(--brand-accent)" /> Presets:
          </span>
          <button
            type="button"
            className="preset-card-chip"
            onClick={() => applyPreset('prime')}
            title="Load prime borrower profile (₹50k income, clean credit)"
          >
            <span>Prime (₹50k)</span>
          </button>
          <button
            type="button"
            className="preset-card-chip"
            onClick={() => applyPreset('risk')}
            title="Load subprime profile (₹20k income, past defaults)"
          >
            <span>Credit Risk</span>
          </button>
          <button
            type="button"
            className="preset-card-chip"
            onClick={() => applyPreset('highIncome')}
            title="Load high income profile (₹95k income)"
          >
            <span>High Earner</span>
          </button>
        </div>
      </div>

      <div className="fin-card-body">
        {/* Horizontal Progress Stepper */}
        <div className="stepper-container" role="tablist">
          <button
            type="button"
            className={`stepper-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-num-bubble">
              {currentStep > 1 ? <CheckCircle2 size={15} /> : '01'}
            </div>
            <div className="step-text-wrap">
              <span className="step-title">Applicant</span>
              <span className="step-desc">Demographics</span>
            </div>
          </button>

          <button
            type="button"
            className={`stepper-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            onClick={() => { if (validateStep(1)) setCurrentStep(2); }}
          >
            <div className="step-num-bubble">
              {currentStep > 2 ? <CheckCircle2 size={15} /> : '02'}
            </div>
            <div className="step-text-wrap">
              <span className="step-title">Financial</span>
              <span className="step-desc">Income & Credit</span>
            </div>
          </button>

          <button
            type="button"
            className={`stepper-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}
            onClick={() => { if (validateStep(2)) setCurrentStep(3); }}
          >
            <div className="step-num-bubble">
              {currentStep > 3 ? <CheckCircle2 size={15} /> : '03'}
            </div>
            <div className="step-text-wrap">
              <span className="step-title">Loan Details</span>
              <span className="step-desc">Facility & Collateral</span>
            </div>
          </button>

          <button
            type="button"
            className={`stepper-item ${currentStep === 4 ? 'active' : ''}`}
            onClick={() => { if (validateStep(2) && validateStep(3)) setCurrentStep(4); }}
          >
            <div className="step-num-bubble">04</div>
            <div className="step-text-wrap">
              <span className="step-title">Review</span>
              <span className="step-desc">Confirm & Run AI</span>
            </div>
          </button>
        </div>

        {/* STEP 1: APPLICANT DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div className="form-step-content">
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                Applicant Demographics
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Personal identity and household status for credit profile indexing.
              </p>
            </div>

            <div className="form-inputs-grid">
              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="gender">
                  <span>Gender</span>
                  <span className="fin-field-hint">Identity</span>
                </label>
                <div className="fin-input-wrap">
                  <select
                    id="gender"
                    name="gender"
                    className="fin-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="married">
                  <span>Marital Status</span>
                  <span className="fin-field-hint">Legal status</span>
                </label>
                <select
                  id="married"
                  name="married"
                  className="fin-select"
                  value={formData.married}
                  onChange={handleChange}
                >
                  <option value="Yes">Married (Yes)</option>
                  <option value="No">Unmarried (No)</option>
                </select>
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="dependents">
                  <span>Number of Dependents</span>
                  <span className="fin-field-hint">Family size</span>
                </label>
                <select
                  id="dependents"
                  name="dependents"
                  className="fin-select"
                  value={formData.dependents}
                  onChange={handleChange}
                >
                  <option value="0">0 Dependents</option>
                  <option value="1">1 Dependent</option>
                  <option value="2">2 Dependents</option>
                  <option value="3+">3+ Dependents</option>
                </select>
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="education">
                  <span>Educational Qualification</span>
                  <span className="fin-field-hint">Academic</span>
                </label>
                <select
                  id="education"
                  name="education"
                  className="fin-select"
                  value={formData.education}
                  onChange={handleChange}
                >
                  <option value="Graduate">Graduate</option>
                  <option value="Not Graduate">Not Graduate</option>
                </select>
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="self_employed">
                  <span>Employment Classification</span>
                  <span className="fin-field-hint">Income source</span>
                </label>
                <select
                  id="self_employed"
                  name="self_employed"
                  className="fin-select"
                  value={formData.self_employed}
                  onChange={handleChange}
                >
                  <option value="No">Salaried Employee (No)</option>
                  <option value="Yes">Self-Employed / Business (Yes)</option>
                </select>
              </div>
            </div>

            <div className="step-actions-bar">
              <button type="button" className="fin-btn fin-btn-secondary" onClick={handleReset}>
                <RotateCcw size={15} /> Reset
              </button>
              <button type="button" className="fin-btn fin-btn-primary" onClick={nextStep}>
                Next: Financial Capacity <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL PROFILE & CREDIT HISTORY */}
        {currentStep === 2 && (
          <div className="form-step-content">
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                Financial Capacity & Bureau Records
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Monthly household cash flow and verified credit bureau repayment history.
              </p>
            </div>

            <div className="form-inputs-grid" style={{ marginBottom: '24px' }}>
              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="applicant_income">
                  <span>Applicant Monthly Income <strong style={{ color: 'var(--danger)' }}>*</strong></span>
                  <span className="fin-field-hint">₹ INR</span>
                </label>
                <div className="fin-input-wrap">
                  <span className="fin-input-icon">₹</span>
                  <input
                    id="applicant_income"
                    name="applicant_income"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="e.g. 5000"
                    className={`fin-input has-icon ${errors.applicant_income ? 'error' : ''}`}
                    value={formData.applicant_income}
                    onChange={handleChange}
                  />
                </div>
                {errors.applicant_income && (
                  <span className="fin-error-hint"><AlertCircle size={13} /> {errors.applicant_income}</span>
                )}
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="coapplicant_income">
                  <span>Co-Applicant Monthly Income</span>
                  <span className="fin-field-hint">Optional (₹)</span>
                </label>
                <div className="fin-input-wrap">
                  <span className="fin-input-icon">₹</span>
                  <input
                    id="coapplicant_income"
                    name="coapplicant_income"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="e.g. 1500"
                    className={`fin-input has-icon ${errors.coapplicant_income ? 'error' : ''}`}
                    value={formData.coapplicant_income}
                    onChange={handleChange}
                  />
                </div>
                {errors.coapplicant_income && (
                  <span className="fin-error-hint"><AlertCircle size={13} /> {errors.coapplicant_income}</span>
                )}
              </div>
            </div>

            {/* Credit Bureau Interactive Selection Cards */}
            <div className="fin-field-group" style={{ marginBottom: '16px' }}>
              <label className="fin-field-label">
                <span>Credit History Verification (CIBIL / Experian) <strong style={{ color: 'var(--danger)' }}>*</strong></span>
                <span className="fin-field-hint">Bureau Record</span>
              </label>

              <div className="selectable-cards-grid">
                <div
                  className={`selectable-card ${formData.credit_history === 1.0 ? 'selected' : ''}`}
                  onClick={() => handleCreditChange(1.0)}
                >
                  <input
                    type="radio"
                    className="selectable-card-radio"
                    checked={formData.credit_history === 1.0}
                    onChange={() => handleCreditChange(1.0)}
                  />
                  <div className="selectable-card-content">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="var(--success)" />
                      1.0 &mdash; Meets Credit Guidelines
                    </h4>
                    <p>Clean repayment track record, no 90+ DPD defaults in bureau records.</p>
                  </div>
                </div>

                <div
                  className={`selectable-card ${formData.credit_history === 0.0 ? 'selected' : ''}`}
                  onClick={() => handleCreditChange(0.0)}
                >
                  <input
                    type="radio"
                    className="selectable-card-radio"
                    checked={formData.credit_history === 0.0}
                    onChange={() => handleCreditChange(0.0)}
                  />
                  <div className="selectable-card-content">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={16} color="var(--danger)" />
                      0.0 &mdash; Past Defaults / Subprime
                    </h4>
                    <p>History of non-payment, previous write-offs, or delinquent bureau status.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions-bar">
              <button type="button" className="fin-btn fin-btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back: Applicant
              </button>
              <button type="button" className="fin-btn fin-btn-primary" onClick={nextStep}>
                Next: Loan Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOAN DETAILS & PROPERTY */}
        {currentStep === 3 && (
          <div className="form-step-content">
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                Loan Requirements & Property Area
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                Target borrowing facility, repayment amortization period, and real estate location.
              </p>
            </div>

            <div className="form-inputs-grid">
              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="loan_amount">
                  <span>Loan Amount (in ₹ Thousands) <strong style={{ color: 'var(--danger)' }}>*</strong></span>
                  <span className="fin-field-hint">e.g. 120 = ₹1.2 Lakhs</span>
                </label>
                <div className="fin-input-wrap">
                  <span className="fin-input-icon">₹</span>
                  <input
                    id="loan_amount"
                    name="loan_amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 120"
                    className={`fin-input has-icon ${errors.loan_amount ? 'error' : ''}`}
                    value={formData.loan_amount}
                    onChange={handleChange}
                  />
                </div>
                {errors.loan_amount && (
                  <span className="fin-error-hint"><AlertCircle size={13} /> {errors.loan_amount}</span>
                )}
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="loan_amount_term">
                  <span>Amortization Term (Months) <strong style={{ color: 'var(--danger)' }}>*</strong></span>
                  <span className="fin-field-hint">Standard: 360 (30 yrs)</span>
                </label>
                <select
                  id="loan_amount_term"
                  name="loan_amount_term"
                  className={`fin-select ${errors.loan_amount_term ? 'error' : ''}`}
                  value={formData.loan_amount_term}
                  onChange={handleChange}
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="84">84 Months (7 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                  <option value="180">180 Months (15 Years)</option>
                  <option value="240">240 Months (20 Years)</option>
                  <option value="300">300 Months (25 Years)</option>
                  <option value="360">360 Months (30 Years)</option>
                  <option value="480">480 Months (40 Years)</option>
                </select>
                {errors.loan_amount_term && (
                  <span className="fin-error-hint"><AlertCircle size={13} /> {errors.loan_amount_term}</span>
                )}
              </div>

              <div className="fin-field-group">
                <label className="fin-field-label" htmlFor="property_area">
                  <span>Property Location Classification</span>
                  <span className="fin-field-hint">Geography</span>
                </label>
                <select
                  id="property_area"
                  name="property_area"
                  className="fin-select"
                  value={formData.property_area}
                  onChange={handleChange}
                >
                  <option value="Semiurban">Semiurban (Highest historical approval trend)</option>
                  <option value="Urban">Urban (High collateral liquidity)</option>
                  <option value="Rural">Rural (Agrarian / Tier-3 zone)</option>
                </select>
              </div>
            </div>

            <div className="step-actions-bar">
              <button type="button" className="fin-btn fin-btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back: Financial
              </button>
              <button type="button" className="fin-btn fin-btn-primary" onClick={nextStep}>
                Review Application <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM BEFORE RUNNING PREDICTION */}
        {currentStep === 4 && (
          <div className="form-step-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '2px' }}>
                  Application Summary & Review
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                  Confirm applicant parameters prior to algorithmic risk evaluation.
                </p>
              </div>
              <button
                type="button"
                className="fin-btn fin-btn-secondary"
                style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem' }}
                onClick={() => setCurrentStep(1)}
              >
                <Edit3 size={13} /> Edit Parameters
              </button>
            </div>

            <div className="review-summary-card">
              <div className="review-grid">
                <div className="review-item">
                  <div className="review-item-label">Applicant Profile</div>
                  <div className="review-item-val" style={{ fontSize: '0.95rem' }}>
                    {formData.gender} &bull; {formData.married === 'Yes' ? 'Married' : 'Single'} &bull; {formData.dependents} Dep
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    {formData.education} &bull; {formData.self_employed === 'Yes' ? 'Self-Employed' : 'Salaried'}
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-item-label">Household Income</div>
                  <div className="review-item-val" style={{ color: 'var(--brand-navy)' }}>
                    ₹{(Number(formData.applicant_income || 0) + Number(formData.coapplicant_income || 0)).toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Primary: ₹{Number(formData.applicant_income || 0).toLocaleString('en-IN')} | Co-app: ₹{Number(formData.coapplicant_income || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-item-label">Credit Bureau Record</div>
                  <div className="review-item-val" style={{ color: formData.credit_history === 1.0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {formData.credit_history === 1.0 ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    {formData.credit_history === 1.0 ? 'Meets Guidelines (1.0)' : 'Past Delinquencies (0.0)'}
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-item-label">Requested Facility</div>
                  <div className="review-item-val" style={{ color: 'var(--brand-accent)' }}>
                    ₹{(Number(formData.loan_amount || 0) * 1000).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Term: {formData.loan_amount_term} Mo &bull; Area: {formData.property_area}
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions-bar">
              <button type="button" className="fin-btn fin-btn-secondary" onClick={() => setCurrentStep(3)}>
                <ArrowLeft size={16} /> Back: Loan Details
              </button>
              <button
                type="button"
                className="fin-btn fin-btn-cta"
                disabled={isLoading}
                onClick={handleFinalSubmit}
                style={{ padding: '0 28px' }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Analyzing Application...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>Analyze Loan Application &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
