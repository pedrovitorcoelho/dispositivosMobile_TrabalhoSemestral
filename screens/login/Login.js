// screens/login/Login.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';   // ①
import Button from '../../components/button/Button';
import Fatec360SplashScreen from '../splash/Fatec360SplashScreen'; // ajuste caminho se precisar

const Login = () => {
  const navigation = useNavigation();                       // ②

  return (
    <View style={styles.container}>
      <Fatec360SplashScreen />

      <Button
        variant="primary"
        onPress={() => navigation.navigate('LoginGestor')}   // ③
      >
        Entre como gestor
      </Button>

      <Button
        variant="secondary"
        onPress={() => alert('Entrou como aluno')}
      >
        Entre como aluno/professor
      </Button>
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
});

export default Login;
