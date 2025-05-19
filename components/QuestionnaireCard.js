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
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardContent: {
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
})
