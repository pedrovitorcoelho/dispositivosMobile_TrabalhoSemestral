"use client"

import { useEffect, useRef } from "react"
import { StyleSheet, Text, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function Toast({ visible, message, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide()
        })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Feather name="check" size={20} color="#00a86b" />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100, // Posicionado logo abaixo do header
    left: 22,
    right: 22,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    marginLeft: 12,
    fontSize: 16,
    color: "#00a86b",
    fontWeight: "500",
  },
})