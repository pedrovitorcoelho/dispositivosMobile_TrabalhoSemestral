import React, { useState } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  Pressable,
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { height } = Dimensions.get('window');

export default function LoginGestor() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');
    if (!email) {
      setError('Por favor, digite seu e-mail institucional');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um e-mail válido');
      return;
    }
    try {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 1000)); // simula API
      console.log('Login OK:', email);
      navigation.replace('HomeGestor');
    } catch {
      setError('Erro no login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#3C4A5D" />
        </TouchableOpacity>
        
        {/* Title and Input - Positioned at the top */}
        <View style={styles.topContent}>
          {/* Title */}
          <Text style={styles.title}>Fazer login como gestor</Text>

          {/* Email Input */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail institucional"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, error && styles.inputError]}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        
        {/* Spacer to push button to bottom */}
        <View style={styles.spacer} />
        
        {/* Login Button - Always at the bottom */}
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.button,
            isSubmitting ? styles.buttonDisabled : pressed && styles.buttonPressed,
          ]}
        >
          {isSubmitting
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
    // Changed from space-between to flex-start to position content at top
    justifyContent: 'flex-start'
  },
  backButton: {
    padding: 5,
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  topContent: {
    // No margin top to keep it close to the back button
    marginTop: 0,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#3C4A5D', 
    marginBottom: 20 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    borderRadius: 8, 
    padding: 16,
    fontSize: 14, 
    color: '#3C4A5D',
  },
  inputError: { 
    borderColor: '#ef4444' 
  },
  error: { 
    marginTop: 4, 
    color: '#ef4444', 
    fontSize: 12 
  },
  // Spacer to push button to bottom
  spacer: {
    flex: 1
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8, 
    alignItems: 'center',
    backgroundColor: '#4A6572',
    // Ensure button stays at bottom
    marginTop: 'auto'
  },
  buttonPressed: { 
    opacity: 0.8 
  },
  buttonDisabled: { 
    backgroundColor: '#9ca3af' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});