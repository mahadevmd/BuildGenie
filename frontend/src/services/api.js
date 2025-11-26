import axios from 'axios';

// Use deployed backend base URL in production; fall back to proxy in dev
const API_URL_RAW = (process.env.REACT_APP_API_BASE || '').trim();
const normalizeBaseUrl = (u) => {
  const trimmed = (u || '').trim();
  if (!trimmed) return '';
  // Remove trailing slashes
  const withoutTrailing = trimmed.replace(/\/+$/, '');
  // If the base ends with '/api' exactly, strip it to avoid '/api/api/...'
  return withoutTrailing.replace(/\/api\/?$/i, '');
};
const API_URL = normalizeBaseUrl(API_URL_RAW);
// Detect Capacitor Android to provide sensible dev fallback when API_URL is empty
let IS_ANDROID = false;
try {
  const cap = typeof window !== 'undefined' ? window.Capacitor : undefined;
  const platform = cap?.getPlatform ? cap.getPlatform() : cap?.platform;
  if (platform) {
    IS_ANDROID = platform === 'android';
  } else {
    // Fallback: detect via URL scheme and user agent when Capacitor global isn't ready yet
    const isCapacitorScheme = typeof window !== 'undefined' && window.location?.protocol === 'capacitor:';
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
    IS_ANDROID = isCapacitorScheme && ua.includes('android');
  }
} catch { /* noop */ }
const ANDROID_DEV_BASE = (process.env.REACT_APP_ANDROID_API_BASE || '').trim() || 'http://10.0.2.2:8080';

// Create axios instance with base URL
const apiClient = axios.create({
  // In Android WebView, CRA dev proxy is not available. Use 10.0.2.2 fallback when empty.
  baseURL: API_URL || (IS_ANDROID ? ANDROID_DEV_BASE : undefined),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to check if a token looks like a JWT (has 2 dots → 3 parts)
const isJwtToken = (token) => typeof token === 'string' && token.split('.').length === 3;

// Attach JWT token from localStorage to every request, but only if valid JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};

  // Only attach Authorization if token is a real JWT
  if (token && isJwtToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Ensure we don't leak a non-JWT mock token on requests
    if (config.headers.Authorization) delete config.headers.Authorization;
  }
  return config;
}, (error) => Promise.reject(error));

// Basic 401 handling: clear auth on unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      } catch { /* noop */ }
    }
    return Promise.reject(error);
  }
);

// Component API calls
export const componentService = {
  // Get all components
  getAllComponents: async () => {
    try {
      const response = await apiClient.get('/api/v1/components');
      return response.data;
    } catch (error) {
      console.error('Error fetching components:', error);
      throw error;
    }
  },
  
  // Get components by type
  getComponentsByType: async (type) => {
    try {
      const response = await apiClient.get('/api/v1/components', { params: { type } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} components:`, error);
      throw error;
    }
  },
  
  // Get component by ID
  getComponentById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/components/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching component with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Save a new component
  saveComponent: async (component) => {
    try {
      const response = await apiClient.post('/api/v1/components', component);
      return response.data;
    } catch (error) {
      console.error('Error saving component:', error);
      throw error;
    }
  },
  
  // Update an existing component
  updateComponent: async (id, component) => {
    try {
      const response = await apiClient.put(`/api/v1/components/${id}`, component);
      return response.data;
    } catch (error) {
      console.error(`Error updating component with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a component
  deleteComponent: async (id) => {
    try {
      await apiClient.delete(`/api/v1/components/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting component with ID ${id}:`, error);
      throw error;
    }
  }
};

// Build API calls (for future implementation)
export const buildService = {
  // Get builds by category
  getBuildsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/api/builds/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching builds by category ${category}:`, error);
      throw error;
    }
  },
  // Get all pre-built configurations
  getPreBuiltConfigurations: async () => {
    try {
      const response = await apiClient.get('/api/builds/prebuilt');
      return response.data;
    } catch (error) {
      console.error('Error fetching pre-built configurations:', error);
      throw error;
    }
  },

  // Get pre-built configurations by category
  getPreBuiltConfigsByCategory: async (category) => {
    try {
      // Use permitted endpoint and filter client-side by category
      const response = await apiClient.get('/api/builds/prebuilt');
      const builds = Array.isArray(response.data)
        ? response.data.filter(b => (String(b.category || '').toLowerCase() === String(category || '').toLowerCase()))
        : [];
      return builds;
    } catch (error) {
      console.error(`Error fetching ${category} pre-built configurations:`, error);
      throw error;
    }
  },
  // Save a custom build
  saveBuild: async (build) => {
    try {
      const response = await apiClient.post('/api/builds', build);
      return response.data;
    } catch (error) {
      console.error('Error saving build:', error);
      throw error;
    }
  },
  
  // Get build by ID
  getBuildById: async (id) => {
    try {
      const response = await apiClient.get(`/api/builds/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching build with ID ${id}:`, error);
      throw error;
    }
  },

  // Update a saved build
  updateBuild: async (id, build) => {
    try {
      const response = await apiClient.put(`/api/builds/${id}`, build);
      return response.data;
    } catch (error) {
      console.error(`Error updating build with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a saved build
  deleteBuild: async (id) => {
    try {
      await apiClient.delete(`/api/builds/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting build with ID ${id}:`, error);
      throw error;
    }
  },

  // Get saved builds
  getSavedBuilds: async () => {
    try {
      const response = await apiClient.get('/api/builds');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved builds:', error);
      throw error;
    }
  }
};

// Forecast API calls
export const forecastService = {
  predict: async (request) => {
    try {
      const response = await apiClient.post('/api/forecast', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI prediction:', error);
      throw error;
    }
  }
};

export default {
  componentService,
  buildService,
  forecastService
};

// Export client for use in AuthContext and other modules
export { apiClient };
