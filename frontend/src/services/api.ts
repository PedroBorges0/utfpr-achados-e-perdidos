// src/services/api.ts
import axios from 'axios';

// A URL base do seu Backend (Express)
const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;