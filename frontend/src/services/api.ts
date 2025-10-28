import axios from 'axios';

// URL base do backend (ajuste a porta conforme seu server)
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // ajuste se seu backend estiver em outra porta
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
