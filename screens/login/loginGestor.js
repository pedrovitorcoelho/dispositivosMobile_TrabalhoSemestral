// ./screens/login/LoginGestor.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, ActivityIndicator
} from 'react-native';

export default function LoginGestor() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    } catch {
      setError('Erro no login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer login como gestor</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu e-mail institucional"
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.button,
          isSubmitting ? styles.buttonDisabled : pressed && styles.buttonPressed,
        ]}
      >
        {isSubmitting
          ? <ActivityIndicator />
          : <Text style={styles.buttonText}>Entrar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white' },
  title: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#94a3b8',
    borderRadius: 8, padding: 12,
    fontSize: 14, color: '#334155',
  },
  inputError: { borderColor: '#ef4444' },
  error: { marginTop: 4, color: '#ef4444', fontSize: 12 },
  button: {
    marginTop: 'auto', paddingVertical: 12,
    borderRadius: 8, alignItems: 'center',
    backgroundColor: '#6b7280',
  },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
