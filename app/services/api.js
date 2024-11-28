import axios from 'axios';

// Define o baseURL dependendo do ambiente
const baseURL = process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:5000'; // padrão local

if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  // Se estiver no ambiente React Native (emulador ou dispositivo)
  axios.defaults.baseURL = process.env.REACT_APP_API_URL_EMULADOR || 'http://10.0.2.2:5000';
} else {
  // Se estiver no navegador (web)
  axios.defaults.baseURL = baseURL;
}

const api = axios.create({
  baseURL: axios.defaults.baseURL, // A baseURL será configurada dinamicamente
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
