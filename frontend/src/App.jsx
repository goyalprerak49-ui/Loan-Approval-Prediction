import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import ModelInfoCard from './components/ModelInfoCard';
import { checkHealth, getModelInfo } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    message: 'Checking connection to backend server...',
  });
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const performHealthCheck = async () => {
      try {
        const health = await checkHealth();
        if (isMounted) {
          if (health.status === 'healthy') {
            setBackendStatus({
              isOnline: true,
              message: 'Connected to FastAPI prediction service.',
            });
          } else {
            setBackendStatus({
              isOnline: false,
              message: 'Backend server is running but model artifacts are degraded.',
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus({
            isOnline: false,
            message: 'Unable to connect to prediction service. Please ensure FastAPI server is running on http://127.0.0.1:8000.',
          });
        }
      }
    };

    const fetchInfo = async () => {
      try {
        const info = await getModelInfo();
        if (isMounted) {
          setModelInfo(info);
        }
      } catch (err) {
        // Handled silently for secondary info
      }
    };

    performHealthCheck();
    fetchInfo();

    const interval = setInterval(performHealthCheck, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        {activeTab === 'predict' && (
          <DashboardPage backendStatus={backendStatus} />
        )}

        {activeTab === 'model' && (
          <ModelInfoCard modelInfo={modelInfo} />
        )}
      </main>

      <Footer />
    </div>
  );
}
