import api from "./api";
import { getToken } from "./authService";

export const solicitarApoio = async (profissionalId) => {
    try {
      const token = await getToken();
      console.log('solicitar apoio token ', token)
      const response = await api.post(
        '/solicitacoes/solicitar',
        { profissionalId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar apoio:', error);
      throw error.response ? error.response.data : error;
    }
  };
  
  // Obter solicitação por ID
  export const obterSolicitacaoPorId = async (token, id) => {
    try {
      const response = await api.get(`/solicitacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter solicitação por ID:', error);
      throw error.response ? error.response.data : error;
    }
  };
  
  // Listar solicitações por usuário (cliente ou profissional)
  export const listarSolicitacoesPorUsuario = async (usuarioId, token) => {
    try {
      const response = await api.get(`/solicitacoes/usuario/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar solicitações por usuário:', error);
      throw error.response ? error.response.data : error;
    }
  };
  