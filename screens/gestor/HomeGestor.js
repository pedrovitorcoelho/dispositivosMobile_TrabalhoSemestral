"use client"

import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import BottomNavigation from "../../components/BottomNavigation"

// Get screen dimensions
const { width } = Dimensions.get("window")

/* ─────────── dados mock ─────────── */
const categories = [
  { id: "1", key: "add" },
  { id: "2", key: "estrutura", label: "Estrutura" },
  { id: "3", key: "professores", label: "Professores" },
  { id: "4", key: "conteudos", label: "Conteúdos" },
]

const feedbackItems = [
  { id: "1", name: "Camila Silva", category: "Conteúdos" },
  { id: "2", name: "Rogério Santos", category: "Estrutura" },
  { id: "3", name: "Sandra Lima", category: "Professores" },
]

/* ─────────── componente ─────────── */
export default function HomeGestor() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = React.useState("home")

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  // Map your category keys to icon names for Feather icons
  const getIconForCategory = (key) => {
    switch (key) {
      case "add":
        return "plus"
      case "conteudos":
        return "file-text"
      case "professores":
        return "users"
      case "estrutura":
        return "grid"
      default:
        return "help-circle"
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, Rafael!</Text>
              <Text style={styles.subTitle}>Gestor - Fatec Praia Grande</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={26} color="#3C4A5D" />
            </TouchableOpacity>
          </View>

          {/* Stats Card */}
          <TouchableOpacity style={styles.statsCard}>
            <Feather name="bar-chart-2" size={26} color="#3C4A5D" />
            <View style={styles.statsTextContainer}>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>35</Text> novas respostas esta semana
              </Text>
            </View>
          </TouchableOpacity>

          {/* Categories Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Questionários por categorias</Text>

            <View style={styles.categoriesContainer}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.categoryCard, c.key === "add" ? styles.addCategoryCard : null]}
                  onPress={() => {
                    if (c.key === "add") {
                      navigation.navigate("CriarQuestionarios")
                    } else {
                      navigation.navigate("MeusQuestionarios", { categoria: "placeholder" })
                    }
                  }}
                >
                  <View style={styles.categoryIconContainer}>
                    <Feather name={getIconForCategory(c.key)} size={26} color="#3C4A5D" />
                  </View>
                  {c.label && <Text style={styles.categoryText}>{c.label}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Feedback Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.feedbackHeader}>
              <Text style={styles.sectionTitle}>Últimos feedbacks</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Feedback Items */}
            {feedbackItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.feedbackItem}>
                <View>
                  <Text style={styles.feedbackName}>{item.name}</Text>
                  <Text style={styles.feedbackCategory}>{item.category}</Text>
                </View>
                <Feather name="chevron-right" size={26} color="#C5C5C5" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Add a little extra space at the bottom */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} navigation={navigation} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 22, // Slightly increased padding
    paddingBottom: 90, // Extra padding to account for bottom navigation
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24, // Slightly increased margin
    marginTop: 5, // Small top margin
  },
  greeting: {
    fontSize: 18, // Slightly increased font size
    fontWeight: "600", // Bold
    color: "#3C4A5D",
  },
  subTitle: {
    fontSize: 16, // Slightly increased font size
    color: "#3C4A5D",
    opacity: 0.8,
    marginTop: 5, // Slightly increased margin
  },
  notificationButton: {
    padding: 6, // Slightly increased padding
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14, // Slightly increased padding
    paddingHorizontal: 18, // Slightly increased padding
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 28, // Slightly increased margin
    width: "100%",
  },
  statsTextContainer: {
    flex: 1,
    marginLeft: 12, // Slightly increased margin
  },
  statsText: {
    fontSize: 16, // Slightly increased font size
    fontWeight: "600", // SemiBold
    color: "#3C4A5D",
  },
  statsNumber: {
    fontSize: 16, // Slightly increased font size
    fontWeight: "600", // SemiBold
    color: "#3C4A5D",
  },
  sectionContainer: {
    marginBottom: 28, // Slightly increased margin
  },
  sectionTitle: {
    fontSize: 16, // Slightly increased font size
    fontWeight: "600", // SemiBold
    color: "#3C4A5D",
    marginBottom: 16, // Slightly increased margin
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "23%",
    aspectRatio: 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    padding: 8, // Slightly increased padding
  },
  addCategoryCard: {
    borderStyle: "dashed",
  },
  categoryIconContainer: {
    marginBottom: 12, // Slightly increased margin
  },
  categoryText: {
    fontSize: 12, // Slightly increased font size
    color: "#3C4A5D",
    textAlign: "center",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12, // Slightly increased margin
  },
  seeAllText: {
    fontSize: 13, // Slightly increased font size
    fontWeight: "400", // Regular
    color: "#2563eb",
  },
  feedbackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16, // Slightly increased padding
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  feedbackName: {
    fontSize: 14, // Slightly increased font size
    fontWeight: "500", // SemiBold
    color: "#3C4A5D",
  },
  feedbackCategory: {
    fontSize: 13, // Slightly increased font size
    fontWeight: "400", // Regular
    color: "#3C4A5D",
    opacity: 0.8,
    marginTop: 3, // Slightly increased margin
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
