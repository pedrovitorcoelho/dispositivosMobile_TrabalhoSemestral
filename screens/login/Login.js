// screens/login/Login.js
import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';   // ①
import Fatec360SplashScreen from '../splash/Fatec360SplashScreen'; // ajuste caminho se precisar

const Login = () => {
  const navigation = useNavigation();                       // ②

  return (
    <View style={styles.container}>
      <Fatec360SplashScreen />

      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => navigation.navigate('LoginGestor')}   // ③
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Entre como gestor</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('LoginAluno')}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Entre como aluno</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -50, // Para ficar um pouco mais pra cima
  },
  // 🆕 ESTILOS DOS BOTÕES SEGUINDO O PADRÃO EXATO
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4A6572',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4A6572',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#4A6572',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;