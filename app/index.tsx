import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { loginCliente } from './services/clienteService'; // Importe a função de login
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

export default function Index() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await loginCliente(email, senha);
      console.log('Login bem-sucedido:', response);

      // Armazenar o token no AsyncStorage
      await AsyncStorage.setItem('token', response.token); // Supondo que a resposta contenha o campo "token"

      Alert.alert('Login bem-sucedido');
      router.push('/home'); // Navega para a página inicial após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.physicareTitle}>Physicare</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Login" onPress={handleLogin} />
          <View style={styles.registerButtonContainer}>
            <Text
              style={styles.registerButtonText}
              onPress={() => router.push('/register')}
            >
              Registrar-se
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  physicareTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40, // Espaço do topo
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '40%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  registerButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  registerButtonText: {
    fontSize: 16,
    color: '#1E90FF', // Cor azul para o texto
    textDecorationLine: 'underline', // Efeito de sublinhado no texto
  },
});
