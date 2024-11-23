import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from "jwt-decode"
import api from './api';

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // Obtém o token do AsyncStorage
    return !!token; // Retorna true se o token existir
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    return token;
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    throw error;
  }
};

// Função para decodificar o token e obter os dados do cliente
export const getUsuarioFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage
      if (!token) {
        throw new Error('Token não encontrado');
      }
      const decoded = jwtDecode.jwtDecode(token).id; // Decodifica o token sem chave secreta
      console.log('Dados decodificados:', decoded);
      return decoded; // Retorna o payload do token
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

// Função para buscar os dados completos do cliente no backend
export const fetchClienteData = async () => {
  try {
    const usuario = await getUsuarioFromToken();
    if (!usuario || !usuario.id) {
      throw new Error('Token inválido ou cliente não encontrado');
    }

    const response = await api.get(`/clientes/${usuario.id}`); // Chama a API para obter dados do cliente
    return response.data; // Retorna os dados do cliente
  } catch (error) {
    console.error('Erro ao buscar os dados do cliente:', error);
    throw error;
  }
};
