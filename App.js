// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import Button from './components/button/Button';
// import Fatec360SplashScreen from './screens/splash/Fatec360SplashScreen';


// const App = () => {
//   return (
//     <View style={styles.container}>
//       <Fatec360SplashScreen />
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

// export default App;

// App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';  // IMPORTAÇÃO CORRETA AQUI
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Fatec360SplashScreen from './screens/splash/Fatec360SplashScreen';
import Login from './screens/login/Login';

const Stack = createNativeStackNavigator();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showSplash ? (
            <Stack.Screen name="Splash" component={Fatec360SplashScreen} />
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;

