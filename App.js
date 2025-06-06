// App.js (raiz do projeto)
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeGestor   from './screens/gestor/HomeGestor'; 
import Fatec360SplashScreen from './screens/splash/Fatec360SplashScreen';
import Login from './screens/login/Login';
import LoginGestor from './screens/login/loginGestor';    // ①  novo import  (note o “l” minúsculo)
import CriarQuestionarios from './screens/gestor/CriarQuestionarios'; // novo import
import MeusQuestionarios from './screens/gestor/MeusQuestionarios';
import QuestionarioCriado from './screens/gestor/QuestionarioCriado';
import PainelRespostas from './screens/gestor/PainelRespostas';
import ListaRespostas from './screens/gestor/ListaRespostas';
import DetalhesAluno from './screens/gestor/DetalhesAluno';
import HomeAluno from './screens/aluno/HomeAluno';
import LoginAluno from './screens/login/LoginAluno'
import AvaliacaoQuestionarioAluno from './screens/aluno/AvaliacaoQuestionarioAluno';
import EnviarFeedbackAluno from './screens/aluno/EnviarFeedBackAluno';
import QuestionariosDisponiveisAluno from './screens/aluno/QuestionariosDisponiveisAluno';
import MeusQuestionariosRespondidos from './screens/aluno/MeusQuestionariosRespondidos';


// se preferir, escreva LoginGestor.js com inicial maiúscula e então:
// import LoginGestor from './screens/login/LoginGestor';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Fatec360SplashScreen />; // apenas mostra a splash por 5 segundos
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showSplash ? (
            <Stack.Screen
              name="Splash"
              component={Fatec360SplashScreen}
            />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen
                name="LoginGestor"   // ②  nova rota
                component={LoginGestor}
              />

              <Stack.Screen name="HomeGestor"  component={HomeGestor} />
              <Stack.Screen name="CriarQuestionarios" component={CriarQuestionarios} />
              <Stack.Screen name="MeusQuestionarios" component={MeusQuestionarios} />
              <Stack.Screen name="QuestionarioCriado" component={QuestionarioCriado} />
              <Stack.Screen name="PainelRespostas" component={PainelRespostas} />
              <Stack.Screen name="ListaRespostas" component={ListaRespostas} />
              <Stack.Screen name="DetalhesAluno" component={DetalhesAluno} />
              <Stack.Screen name="HomeAluno" component={HomeAluno} />
              <Stack.Screen name="LoginAluno" component={LoginAluno} />
              <Stack.Screen name="AvaliacaoQuestionarioAluno" component={AvaliacaoQuestionarioAluno} />
              <Stack.Screen name="EnviarFeedBackAluno" component={EnviarFeedbackAluno} />
              <Stack.Screen name="QuestionariosDisponiveisAluno" component={QuestionariosDisponiveisAluno} />
              <Stack.Screen name="MeusQuestionariosRespondidos" component={MeusQuestionariosRespondidos} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});
