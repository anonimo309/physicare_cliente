import api from "./api";

export const getFichaByCliente = async (clienteId) => {
  try {
    const response = await api.get(`/fichas/clientes/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter fichas do cliente:", error);
    throw error;
  }
};

export const getFichaById = async (fichaId) => {
  try {
    const response = await api.get(`/fichas/${fichaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter ficha:", error);
    throw error;
  }
};
