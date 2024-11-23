import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/home')}>
        <Text style={styles.link}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profissionais')}>
        <Text style={styles.link}>Profissionais</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/fichas')}>
        <Text style={styles.link}>Minhas Fichas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/conta')}>
        <Text style={styles.link}>Minha Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginHorizontal: 15,
  },
});
