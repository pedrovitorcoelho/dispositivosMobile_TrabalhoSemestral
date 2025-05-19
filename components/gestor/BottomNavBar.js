import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar() {
  const navItems = [
    { id: 1, icon: 'home',          label: 'Home',         active: true  },
    { id: 2, icon: 'bar-chart',     label: 'Estatísticas', active: false },
    { id: 3, icon: 'document-text', label: 'Relatórios',   active: false }
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        // sombra sutil (iOS + Android)
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: Platform.OS === 'ios' ? 12 : 8,
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={item.active ? '#2563eb' : '#94a3b8'}
          />
          <Text
            style={{
              fontSize: 11,
              marginTop: 2,
              color: item.active ? '#2563eb' : '#94a3b8',
              fontWeight: item.active ? '600' : '400',
            }}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
