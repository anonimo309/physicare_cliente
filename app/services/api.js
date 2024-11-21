import axios from 'axios';

// Criar uma instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/', // Substituir pelo IP local ou URL do servidor ao testar no dispositivo
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manipulação de erros, se necessário
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Token expirado');
    }
    return Promise.reject(error);
  }
);

export default api;
