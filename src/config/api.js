/**
 * API Configuration
 * 
 * Centralized API endpoints configuration.
 * Base URL is loaded from environment variable.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const API = {
  BASE_URL: API_BASE_URL,

  // Firm Endpoints
  FIRM: {
    GET_ALL: `${API_BASE_URL}/firm`,
    GET_BY_ID: (id) => `${API_BASE_URL}/firm/${id}`,
    CREATE: `${API_BASE_URL}/firm`,
    UPDATE: (id) => `${API_BASE_URL}/firm/${id}`,
    DELETE: (id) => `${API_BASE_URL}/firm/${id}`,
    COUNT_TOTAL: `${API_BASE_URL}/firm/count/total`,
  },

  // Vehicle Endpoints
  VEHICLE: {
    GET_ALL: `${API_BASE_URL}/vehicle`,
    GET_BY_FIRM: (firmId) => `${API_BASE_URL}/vehicle/byFirm/${firmId}`,
    COUNT_TOTAL: `${API_BASE_URL}/vehicle/count/total`,
    COUNT_BY_FIRM: (firmId) => `${API_BASE_URL}/vehicle/count/firm/${firmId}`,
    CREATE: `${API_BASE_URL}/vehicle`,
    UPDATE: (id) => `${API_BASE_URL}/vehicle/${id}`,
    DELETE: (id) => `${API_BASE_URL}/vehicle/${id}`,
  },

  // Pricing Endpoints
  PRICING: {
    GET_ALL: `${API_BASE_URL}/pricing`,
    GET_BY_ID: (id) => `${API_BASE_URL}/pricing/${id}`,
    CREATE: (firmId) => `${API_BASE_URL}/pricing/${firmId}`,
    UPDATE: (firmId) => `${API_BASE_URL}/pricing/${firmId}`,
    DELETE: (id) => `${API_BASE_URL}/pricing/${id}`,
  },

  // Note Endpoints
  NOTE: {
    GET_ALL: '/note',
    CREATE: '/note',
    UPDATE: (id) => `/note/${id}`,
    DELETE: (id) => `/note/${id}`,
    GET_BY_ID: (id) => `/note/${id}`,
  },

  // Transaction Endpoints (lowercase as per API docs)
  TRANSACTION: {
    CREATE: `${API_BASE_URL}/transaction`,
    GET_BY_ID: (id) => `${API_BASE_URL}/transaction/${id}`,
    GET_ALL: `${API_BASE_URL}/transaction/all`,
    GET_BY_FIRM: (firmId) => `${API_BASE_URL}/transaction/by-firm/${firmId}`,
    UPDATE: (id) => `${API_BASE_URL}/transaction/${id}`,
    DELETE: (id) => `${API_BASE_URL}/transaction/${id}`,

    // Statistics
    TOTAL_TON_TODAY: `${API_BASE_URL}/transaction/total-ton/today`,
    TOTAL_TON_DAILY: `${API_BASE_URL}/transaction/total-ton/daily`,
    TOTAL_TON_WEEKLY: `${API_BASE_URL}/transaction/total-ton/weekly`,
    TODAY_TOTAL: `${API_BASE_URL}/transaction/today/total`,
    TRUCK_LOAD_WEEKLY: `${API_BASE_URL}/transaction/truck-load/weekly`,

    // Reports
    REPORT_PDF: `${API_BASE_URL}/transaction/report/pdf`,
    REPORT_EXCEL: `${API_BASE_URL}/transaction/report/excel`,
  },
};

export default API;
