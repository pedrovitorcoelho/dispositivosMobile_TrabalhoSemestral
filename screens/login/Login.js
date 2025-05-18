// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import Button from './components/button/Button';
// import Fatec360SplashScreen from './screens/splash/Fatec360SplashScreen';


// const Login = () => {
//   return (
//     <View style={styles.container}>
//       <Fatec360SplashScreen />
//       <Button variant="primary" onPress={() => alert('Clicou!')}>
//         Entre como gestor
//       </Button>
//       <Button variant="secondary" onPress={() => alert('Clicou!')}>
//         Entre como aluno/professor
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Login;

// Login.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../components/button/Button';
import Fatec360SplashScreen from '../../screens/splash/Fatec360SplashScreen';




const Login = () => {
  return (
    <View style={styles.container}>
    <Fatec360SplashScreen />
      <Button variant="primary" onPress={() => alert('Entrou como gestor')}>
        Entre como gestor
      </Button>
      <Button variant="secondary" onPress={() => alert('Entrou como aluno')}>
        Entre como aluno/professor
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // define fundo branco aqui também
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Login;
