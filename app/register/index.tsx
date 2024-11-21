import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerCliente } from '../services/clienteService'; // Importe a função de registro
import { useRouter } from 'expo-router';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const clienteData = { nome, email, senha };
      const response = await registerCliente(clienteData);
      console.log('Registro bem-sucedido:', response);
      Alert.alert('Registro bem-sucedido', 'Você pode fazer login agora');
      // Redirecionar para a tela de login
      router.push('/');
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      Alert.alert('Erro', 'Houve um erro ao tentar registrar');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.physicareTitle}>Physicare</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Registrar-se</Text>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
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
          <Button title="Registrar" onPress={handleRegister} />
          <View style={styles.registerButtonContainer}>
            <Text
              style={styles.registerButtonText}
              onPress={() => router.push('/')}
            >
              Já tem uma conta? Faça login
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
    marginTop: 40, // Space from the top
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
    color: '#1E90FF', // Blue color
    textDecorationLine: 'underline', // Text underline effect
  },
});
