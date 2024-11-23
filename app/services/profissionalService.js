import api from './api'; // Configuração do Axios

// Listar todos os profissionais
export const listarProfissionais = async () => {
  try {
    const response = await api.get('/profissionais');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar profissionais:', error);
    throw error.response ? error.response.data : error;
  }
};

// Obter profissional por ID
export const obterProfissionalPorId = async id => {
  try {
    const response = await api.get(`/profissionais/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter profissional por ID:', error);
    throw error.response ? error.response.data : error;
  }
};
