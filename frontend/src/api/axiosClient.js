import axios from 'axios';

// Generate a random UUID-like correlation ID for client tracking
export const generateCorrelationId = () => {
  return 'cid-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
};

// Ensure API base URL correctly points to /api prefix in both local and deployed environments
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`)
  : '/api';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Correlation ID and Admin JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    // Attach Correlation ID if not present
    if (!config.headers['X-Correlation-ID']) {
      config.headers['X-Correlation-ID'] = generateCorrelationId();
    }
    
    // Attach JWT Bearer Token for admin actions
    const token = localStorage.getItem('taxigo_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: capture and report unexpected frontend API failures
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const correlationId = error.config?.headers?.['X-Correlation-ID'] || 'unknown';

    // If unauthenticated on admin routes, clear token
    if (status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('taxigo_admin_token');
      localStorage.removeItem('taxigo_admin_user');
      window.location.href = '/admin/login';
    }

    // Report client error to backend if 500 or network fail (excluding loop on client-error endpoint)
    if ((!status || status >= 500) && !error.config?.url?.includes('/client-error')) {
      try {
        axios.post(`${baseURL}/admin/system-logs/client-error`, {
          module: 'frontend_client',
          endpoint: error.config?.url || 'network',
          error_message: error.message || 'Network request failed',
          stack_trace: error.stack,
          user_agent: navigator.userAgent
        }).catch(() => {});
      } catch (e) {
        // Silently prevent recursive error loops
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
