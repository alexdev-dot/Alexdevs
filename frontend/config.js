// Configuration for API endpoints
// This file handles different environments (development vs production)

const API_CONFIG = {
    // In development, use localhost
    development: {
        baseURL: 'http://localhost:5000',
        socketURL: 'http://localhost:5000'
    },
    // In production, use relative URLs (same domain)
    production: {
        baseURL: '',  // Empty string means relative to current domain
        socketURL: ''  // Empty string means relative to current domain
    }
};

// Detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:';

const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// Export configuration
window.API_CONFIG = config;

// Helper function to get full API URL
window.getApiUrl = function(endpoint) {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return config.baseURL ? `${config.baseURL}/${cleanEndpoint}` : `/${cleanEndpoint}`;
};

// Helper function to get Socket.IO URL
window.getSocketUrl = function() {
    return config.socketURL || '';
};
