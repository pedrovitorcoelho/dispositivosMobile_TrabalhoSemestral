// components/Button/Button.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

function Button({ variant = "primary", children, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, styles[variant], style]}
    >
      <Text style={variant === 'primary' ? styles.textPrimary : styles.textSecondary}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px'
  },
  primary: {
    backgroundColor: '#60737E',
  },
  secondary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#60737E',
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: '#60737E',
  },
});

export default Button;
