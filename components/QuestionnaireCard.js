"use client"

import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

export default function QuestionnaireCard({ title, questionCount, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{questionCount} perguntas</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3C4A5D",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
})
