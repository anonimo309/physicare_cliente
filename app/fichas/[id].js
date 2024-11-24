import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getFichaById } from "../services/fichaService";
import Header from "../../components/Header";

export default function VisualizarFicha() {
  const { id } = useLocalSearchParams(); // Captura o ID da rota
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        if (!id) {
          throw new Error("ID da ficha não fornecido."); // Verifica se o ID existe
        }
        const fichaData = await getFichaById(id);
        setFicha(fichaData);
      } catch (error) {
        console.error("Erro ao carregar a ficha:", error);
        Alert.alert("Erro", "Não foi possível carregar a ficha.");
      } finally {
        setLoading(false);
      }
    };

    fetchFicha();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Carregando ficha...</Text>
      </View>
    );
  }

  if (!ficha) {
    return (
      <View style={styles.container}>
        <Header title="Visualizar Ficha" />
        <Text style={styles.errorText}>Erro: Ficha não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Visualizar Ficha" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Profissional:</Text>
        <Text style={styles.value}>{ficha.profissionalId?.nome || "Não informado"}</Text>

        <Text style={styles.label}>Data de Criação:</Text>
        <Text style={styles.value}>
          {new Date(ficha.data_criacao).toLocaleDateString() || "Não informado"}
        </Text>

        <Text style={styles.label}>Exercícios:</Text>
        {Array.isArray(ficha.exercicios) && ficha.exercicios.length > 0 ? (
          ficha.exercicios.map((exercicio, index) => (
            <View key={index} style={styles.exercicioCard}>
              <Text style={styles.value}>Nome: {exercicio.nome}</Text>
              <Text style={styles.value}>Séries: {exercicio.series}</Text>
              <Text style={styles.value}>Repetições: {exercicio.repeticoes}</Text>
              <Text style={styles.value}>Intensidade: {exercicio.intensidade}</Text>
              <Text style={styles.value}>Frequência: {exercicio.frequencia}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>Nenhum exercício cadastrado.</Text>
        )}
      </ScrollView>
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
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  exercicioCard: {
    marginTop: 10,  
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
});
