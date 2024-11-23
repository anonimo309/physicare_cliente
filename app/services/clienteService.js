import api from './api'; // Importa a configuração do Axios

// Registro de cliente
export const registerCliente = async clienteData => {
  try {
    const response = await api.post('/clientes/register', clienteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    throw error.response ? error.response.data : error;
  }
};

// Login do cliente
export const loginCliente = async (email, senha) => {
  try {
    const response = await api.post('/clientes/login', { email, senha });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error.response ? error.response.data : error;
  }
};

// Atualizar informações do cliente autenticado
export const updateCliente = async (token, clienteData) => {
  try {
    const response = await api.put('/clientes/me', clienteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error.response ? error.response.data : error;
  }
};

// Deletar cliente autenticado
export const deleteCliente = async token => {
  try {
    const response = await api.delete('/clientes/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error.response ? error.response.data : error;
  }
};

// Listar todos os clientes
export const listarClientes = async () => {
  try {
    const response = await api.get('/clientes/');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    throw error.response ? error.response.data : error;
  }
};

// Obter cliente por ID
export const obterClientePorId = async id => {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    throw error.response ? error.response.data : error;
  }
};
