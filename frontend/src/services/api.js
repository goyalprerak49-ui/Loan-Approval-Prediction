import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors cleanly without exposing raw network traces
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        friendlyMessage = 'The request timed out. Please check if the prediction server is responding.';
      } else {
        friendlyMessage = `Unable to connect to prediction service. Please make sure the backend server is running at ${API_BASE_URL}.`;
      }
    } else if (error.response.status === 422) {
      const details = error.response.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        friendlyMessage = `Validation error: ${details.map(d => `${d.field} (${d.message})`).join(', ')}`;
      } else {
        friendlyMessage = error.response.data?.message || 'Invalid input data provided.';
      }
    } else if (error.response.status === 503) {
      friendlyMessage = error.response.data?.detail || 'The Machine Learning model is temporarily unavailable.';
    } else if (error.response.data?.detail) {
      friendlyMessage = error.response.data.detail;
    } else if (error.response.data?.message) {
      friendlyMessage = error.response.data.message;
    }

    const customError = new Error(friendlyMessage);
    customError.status = error.response?.status || 0;
    customError.originalError = error;
    return Promise.reject(customError);
  }
);

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const getModelInfo = async () => {
  const response = await apiClient.get('/model-info');
  return response.data;
};

export const predictLoan = async (loanData) => {
  const response = await apiClient.post('/predict', loanData);
  return response.data;
};

export { API_BASE_URL };
export default apiClient;
