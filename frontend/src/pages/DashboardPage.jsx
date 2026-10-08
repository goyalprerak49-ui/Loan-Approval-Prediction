import React, { useState, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import LoanForm from '../components/LoanForm';
import ResultCard from '../components/ResultCard';
import EmptyState from '../components/EmptyState';
import StatusBanner from '../components/StatusBanner';
import { predictLoan } from '../services/api';

export default function DashboardPage({ backendStatus }) {
  const [result, setResult] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef(null);

  const handleStartApplication = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictLoan(formData);
      setResult(response);
      setSubmittedData(formData);
    } catch (err) {
      setError(err.message || 'Failed to obtain loan prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubmittedData(null);
    setError(null);
    handleStartApplication();
  };

  return (
    <div>
      {/* 1. Hero Section with capability statistics */}
      <HeroSection onStartApplication={handleStartApplication} />

      {/* 2. System Status Alerts */}
      <StatusBanner
        error={error || (!backendStatus.isOnline ? backendStatus.message : null)}
        onDismiss={() => setError(null)}
      />

      {/* 3. Guided Multi-Step Form Workbench */}
      <div ref={formRef}>
        <LoanForm
          onSubmit={handlePredict}
          isLoading={isLoading}
        />
      </div>

      {/* 4. Real Prediction Result or Professional Empty State */}
      {result ? (
        <ResultCard
          result={result}
          inputData={submittedData}
          onReset={handleReset}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
