import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function FeedbackItem({ name, category, isLast }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderColor: '#e2e8f0',
      }}
    >
      {/* nome + categoria */}
      <View style={{ flexShrink: 1, paddingRight: 12 }}>
        <Text style={{ fontWeight: '600', fontSize: 15, color: '#0f172a' }}>
          {name}
        </Text>
        <Text style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
          {category}
        </Text>
      </View>

      {/* botão “Ver” */}
      <TouchableOpacity activeOpacity={0.6}>
        <Text style={{ color: '#2563eb', fontSize: 13, fontWeight: '500' }}>
          Ver
        </Text>
      </TouchableOpacity>
    </View>
  );
}
