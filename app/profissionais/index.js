import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking
} from "react-native";
import { getUsuarioFromToken, getToken } from "../services/authService";
import { listarProfissionais } from "../services/profissionalService";
import {
  solicitarApoio,
  listarSolicitacoesPorUsuario,
} from "../services/solicitacaoService";

import { getFichaByCliente } from "../services/fichaService";
import Header from "../../components/Header";
import { useRouter } from "expo-router";

export default function ListaProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const usuario = await getUsuarioFromToken();
        setUsuarioId(usuario);

        if (!usuario) throw new Error("Usuário não encontrado");

        // Busca profissionais e solicitações
        const profissionaisData = await listarProfissionais();
        const solicitacoes = await listarSolicitacoesPorUsuario(usuario, token);

        // Associa as solicitações aos profissionais
        const profissionaisComEstado = profissionaisData.map((profissional) => {
          const solicitacao = solicitacoes.find(
            (sol) => sol.profissionalId === profissional._id
          );
          return { ...profissional, solicitacao: solicitacao || null };
        });

        setProfissionais(profissionaisComEstado);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao buscar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSolicitarApoio = async (profissionalId) => {
    try {
      await solicitarApoio(profissionalId);
      Alert.alert("Sucesso", "Solicitação enviada com sucesso.");

      const updatedProfissionais = profissionais.map((prof) =>
        prof._id === profissionalId
          ? { ...prof, solicitacao: { status: "Pendente" } }
          : prof
      );
      setProfissionais(updatedProfissionais);
    } catch (error) {
      console.error("Erro ao solicitar apoio:", error);
      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    }
  };

  const handleContato = (profissional) => {
    const whatsappURL = `https://wa.me/${profissional.telefone}`;
    Linking.openURL(whatsappURL).catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.")
    );
  };

  const handleVisualizarFicha = async (profissional) => {
    try {
      const clienteId = await getUsuarioFromToken(); 
      const fichas = await getFichaByCliente(clienteId);
  
      const ficha = fichas.find((f) => f.profissionalId._id === profissional._id);
  
      if (!ficha) {
        Alert.alert("Erro", "Nenhuma ficha associada a este profissional.");
        return;
      }
  
      // Redireciona para a página de ficha com o ID encontrado
      router.push(`/fichas/${ficha._id}`);
    } catch (error) {
      console.error("Erro ao visualizar ficha:", error);
      Alert.alert("Erro", "Não foi possível carregar a ficha.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Erro: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Lista de Profissionais</Text>
      <FlatList
        data={profissionais}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.specialty}>{item.especialidade}</Text>
            <View style={styles.buttonContainer}>
              {item.solicitacao?.status === "Pendente" ? (
                <TouchableOpacity
                  style={[styles.apoioButton, styles.disabledButton]}
                  disabled={true}
                >
                  <Text style={styles.buttonText}>Solicitação Pendente</Text>
                </TouchableOpacity>
              ) : item.solicitacao?.status === "Aceito" ? (
                <>
                  <TouchableOpacity
                    style={styles.visualizarFichaButton}
                    onPress={() => handleVisualizarFicha(item)}
                  >
                    <Text style={styles.buttonText}>Visualizar Ficha</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.contatoButton}
                    onPress={() => handleContato(item)}
                  >
                    <Text style={styles.buttonText}>Contato</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.apoioButton}
                  onPress={() => handleSolicitarApoio(item._id)}
                >
                  <Text style={styles.buttonText}>Solicitar Apoio</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '40%',
    alignSelf: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 5,
  },
  specialty: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  apoioButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  contatoButton: {
    backgroundColor: "#03dac5",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: "#d1d1d1",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  visualizarFichaButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
});
