"use client"

import React from "react"
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import QuestionnaireCard from "../../components/QuestionnaireCard";
import BottomNavigation from "../../components/BottomNavigation";

export default function MeusQuestionarios({ navigation }) {
  const [activeTab, setActiveTab] = React.useState("documents")

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    // In a real app, you would navigate to the appropriate screen
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5c6670" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#5c6670" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Equipamentos</Text>
        <Text style={styles.subtitle}>Meus questionários criados sobre equipamentos</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <QuestionnaireCard
          title="Equipamentos da biblioteca"
          questionCount={5}
          onPress={() => {
            // Handle card press
          }}
        />

        {/* Spacer to push the button to the bottom */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Create Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.buttonText}>Criar novo questionário</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: "row",
  },
  notificationButton: {
    padding: 8,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  spacer: {
    flex: 1,
    minHeight: 200, // Ensure there's space to scroll
  },
  buttonContainer: {
    padding: 16,
  },
  createButton: {
    backgroundColor: "#5c6670",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})
