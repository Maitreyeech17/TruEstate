import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch transactions with filters, search, sort, and pagination
 */
export const getTransactions = async (params) => {
  try {
    const response = await api.get('/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Fetch filter options for dropdowns
 */
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/transactions/options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

/**
 * Fetch single transaction by ID
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

/**
 * Fetch analytics summary
 */
export const getAnalytics = async () => {
  try {
    const response = await api.get('/transactions/analytics/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export default api;