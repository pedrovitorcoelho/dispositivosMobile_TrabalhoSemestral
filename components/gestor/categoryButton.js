import React from 'react';
import { Pressable, Text, Image } from 'react-native';

export default function CategoryButton({ name, iconSource, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 80,
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: pressed ? '#dbeafe' : '#fff',
        borderColor: '#F3F3F3',
        borderWidth: 1,
        marginHorizontal: 4,
      })}
    >
      <Image
        source={iconSource}
        style={{ width: 32, height: 32, marginBottom: 8 }}
        resizeMode="contain"
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '600',
          color: '#3C4A5D',
        }}
        numberOfLines={2}
      >
        {name}
      </Text>
    </Pressable>
  );
}
