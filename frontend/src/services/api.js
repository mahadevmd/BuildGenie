import axios from 'axios';
import { 
  getAllComponents as getMockComponents, 
  getComponentById as getMockComponentById, 
  getComponentsByType as getMockComponentsByType,
  getPreBuiltConfigsByCategory as getMockPreBuiltConfigsByCategory
} from '../mock';

const API_URL = '';
const USE_MOCK_DATA = false; // Toggle between mock data and real API

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL, // empty to rely on CRA proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Component API calls
export const componentService = {
  // Get all components
  getAllComponents: async () => {
    if (USE_MOCK_DATA) {
      return getMockComponents();
    }
    
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
    if (USE_MOCK_DATA) {
      return getMockComponentsByType(type);
    }
    
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
    if (USE_MOCK_DATA) {
      return getMockComponentById(id);
    }
    
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