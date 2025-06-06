"use client"

import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"

// Get screen dimensions
const { width } = Dimensions.get("window")

/* ─────────── dados mock ─────────── */
const categories = [
  { id: "1", key: "conteudos", label: "Conteúdos", icon: "file-text" },
  { id: "2", key: "professores", label: "Professores", icon: "users" },
  { id: "3", key: "estrutura", label: "Estrutura", icon: "grid" },
  { id: "4", key: "estagios", label: "Estágios", icon: "briefcase" },
]

const questionariosRespondidos = [
  { id: "1", titulo: "O que acha dos conteúdos do se...", categoria: "Conteúdos" },
  { id: "2", titulo: "Equipamentos da biblioteca", categoria: "Estrutura" },
  { id: "3", titulo: "Dinâmica de ensino", categoria: "Professores" },
]

const feedbacksEnviados = [
  { id: "1", assunto: "Porta Quebrada", categoria: "FeedBack" },
  { id: "2", assunto: "Falta de professor na matéria", categoria: "FeedBack" },
  { id: "3", assunto: "Ausência de ensino sobre Python", categoria: "FeedBack" },
]

/* ─────────── componente ─────────── */
export default function HomeAluno() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = React.useState("home")

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, Pedro!</Text>
              <Text style={styles.subTitle}>Aluno - Fatec Praia Grande</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={26} color="#3C4A5D" />
            </TouchableOpacity>
          </View>

          {/* Questionários Disponíveis Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Questionários disponíveis</Text>

            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => {
                    // Navegar para lista de questionários da categoria
                    navigation.navigate("QuestionariosDisponiveisAluno", { categoria: category.key })
                  }}
                >
                  <View style={styles.categoryIconContainer}>
                    <Feather name={category.icon} size={26} color="#3C4A5D" />
                  </View>
                  <Text style={styles.categoryText}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Meus Questionários Respondidos Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meus questionários respondidos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de questionários respondidos */}
            {questionariosRespondidos.map((questionario) => (
              <TouchableOpacity key={questionario.id} style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>{questionario.titulo}</Text>
                  <Text style={styles.listItemCategory}>{questionario.categoria}</Text>
                </View>
                <Feather name="chevron-right" size={26} color="#C5C5C5" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Meus Feedbacks Enviados Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meus feedbacks enviados</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de feedbacks enviados */}
            {feedbacksEnviados.map((feedback) => (
              <TouchableOpacity key={feedback.id} style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>{feedback.assunto}</Text>
                  <Text style={styles.listItemCategory}>{feedback.categoria}</Text>
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
        <BottomNavigationAluno activeTab={activeTab} onTabPress={handleTabPress} navigation={navigation} />
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
    padding: 22,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    marginTop: 5,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3C4A5D",
  },
  subTitle: {
    fontSize: 16,
    color: "#3C4A5D",
    opacity: 0.8,
    marginTop: 5,
  },
  notificationButton: {
    padding: 6,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#2563eb",
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
    padding: 8,
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#3C4A5D",
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3C4A5D",
  },
  listItemCategory: {
    fontSize: 13,
    fontWeight: "400",
    color: "#3C4A5D",
    opacity: 0.8,
    marginTop: 3,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
