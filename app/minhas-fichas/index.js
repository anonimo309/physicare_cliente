import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getFichaByCliente } from "../services/fichaService";
import { obterProfissionalPorId } from "../services/profissionalService";
import { getUsuarioFromToken } from "../services/authService";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MinhasFichas() {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profissionais, setProfissionais] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const clienteId = await getUsuarioFromToken(token);
        const fichasData = await getFichaByCliente(clienteId);

        // Agora vamos buscar o nome do profissional para cada ficha
        const profissionalData = {};
        for (let ficha of fichasData) {
          console.log(ficha.profissionalId);
          const profissional = await obterProfissionalPorId(ficha.profissionalId._id);
          profissionalData[ficha.profissionalId] = profissional.nome; // Armazena o nome por id
          profissionalData[ficha.dataCriacao] = ficha.dataCriacao; // Armazena a data
        }
        setProfissionais(profissionalData); // Atualiza o estado dos profissionais

        setFichas(fichasData);
      } catch (error) {
        console.error("Erro ao carregar fichas do cliente:", error);
        Alert.alert("Erro", "Não foi possível carregar suas fichas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFichas();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Converte a string para um objeto Date
    console.log(date)
    const day = String(date.getDate()).padStart(2, '0'); // Extrai o dia e adiciona zero à esquerda, se necessário
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Extrai o mês e adiciona zero à esquerda
    const year = date.getFullYear(); // Extrai o ano
    return `${day}/${month}/${year}`; // Retorna a data formatada como DD/MM/AAAA
  };
  

  const renderFicha = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/fichas/${item._id}`) && console.log(item)}
    >
      <Text style={styles.cardTitle}>
  Autor da ficha: {profissionais[item.profissionalId] ? profissionais[item.profissionalId].nome : "Profissional Indefinido"}
</Text>

      {/* Formatar a data de criação */}
      <Text style={styles.cardSubtitle}>
        Criada em: {formatDate(item.data_criacao)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando suas fichas...</Text>
      </View>
    );
  }

  if (fichas.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Minhas Fichas" />
        <Text style={styles.emptyText}>Você ainda não possui fichas cadastradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Minhas Fichas" />
      <FlatList
        data={fichas}
        keyExtractor={(item) => item._id}
        renderItem={renderFicha}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 20,
    width: '40%',
    alignContent: 'center',
    alignSelf: 'center'
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
