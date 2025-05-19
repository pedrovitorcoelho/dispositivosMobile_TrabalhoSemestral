// App.js (raiz do projeto)
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeGestor   from './screens/gestor/HomeGestor'; 

import Fatec360SplashScreen from './screens/splash/Fatec360SplashScreen';
import Login from './screens/login/Login';
import LoginGestor from './screens/login/loginGestor';    // ①  novo import  (note o “l” minúsculo)

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
