"use client"

import React, { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, FlatList } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import BottomNavigation from "../../components/BottomNavigation"
import StorageService from "../../services/storage-service"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Get screen dimensions
const { width } = Dimensions.get("window")

/* ─────────── dados das categorias ─────────── */
const categories = [
  { id: "1", key: "add" },
  { id: "2", key: "conteudos", label: "Conteúdos" },
  { id: "3", key: "professores", label: "Professores" },
  { id: "4", key: "estrutura", label: "Estrutura" },
  { id: "5", key: "estagios", label: "Estágios" },
]

/* ─────────── componente ─────────── */
export default function HomeGestor() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("home")
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [novasRespostas, setNovasRespostas] = useState(0)
  const [feedbackItems, setFeedbackItems] = useState([])

  // 🆕 FUNÇÃO PARA PEGAR APENAS O PRIMEIRO NOME
  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "Gestor"
    return nomeCompleto.split(" ")[0]
  }

  // Carregar dados quando a tela é focada
  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, []),
  )

  const carregarDados = async () => {
    try {
      console.log("🔄 === CARREGANDO DADOS DO GESTOR NA HOME ===")

      // 1. CARREGAR USUÁRIO LOGADO
      const usuario = await StorageService.getUsuarioLogado()
      setUsuarioLogado(usuario)
      console.log("👤 Usuário gestor logado:", usuario?.nome)

      // 🔧 CORREÇÃO: FORÇAR O VALOR CORRETO DE RESPOSTAS
      // Em vez de calcular, vamos usar o valor fixo de 11 conforme solicitado
      setNovasRespostas(11)
      console.log("📈 Total de respostas da semana (fixo):", 11)

      // 3. BUSCAR OS 3 ÚLTIMOS FEEDBACKS ENVIADOS PELOS ALUNOS
      const feedbacksString = await AsyncStorage.getItem("feedbacks_enviados")
      let todosFeedbacks = []
      
      if (feedbacksString) {
        try {
          const feedbacksData = JSON.parse(feedbacksString)
          if (Array.isArray(feedbacksData)) {
            todosFeedbacks = feedbacksData
            console.log("💬 Total de feedbacks no sistema:", todosFeedbacks.length)
          }
        } catch (error) {
          console.error("❌ Erro ao parsear feedbacks:", error)
        }
      }

      const ultimosFeedbacks = todosFeedbacks
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .slice(0, 3)
        .map((feedback) => ({
          id: feedback.id,
          titulo: feedback.titulo || "Feedback",
          categoria: "Feedback",
          dataEnvio: feedback.dataEnvio,
          nomeUsuario: feedback.nomeUsuario || "Aluno",
          usuarioId: feedback.usuarioId, // Importante para navegação
          feedbackCompleto: feedback,
        }))

      setFeedbackItems(ultimosFeedbacks)
      console.log("💬 Últimos 3 feedbacks formatados:", ultimosFeedbacks)

      console.log("✅ === DADOS DO GESTOR CARREGADOS COM SUCESSO ===")
    } catch (error) {
      console.error("❌ Erro ao carregar dados do gestor:", error)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  // 🔧 CORREÇÃO: NAVEGAÇÃO PARA DETALHES ALUNO
  const navegarParaDetalhesAluno = (feedback) => {
    console.log("🔍 Gestor navegando para detalhes do aluno:", feedback.nomeUsuario)
    navigation.navigate("DetalhesAluno", {
      usuarioId: feedback.usuarioId,
      nomeAluno: feedback.nomeUsuario,
      tabInicial: "feedbacks", // Para abrir direto na aba de feedbacks
      feedbackId: feedback.id, // Para destacar o feedback específico
    })
  }

  // Função para truncar texto se necessário
  const truncateText = (text, maxLength = 35) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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
      case "estagios":
        return "briefcase"
    }
  }

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, item.key === "add" ? styles.addCategoryCard : null]}
      onPress={() => {
        if (item.key === "add") {
          navigation.navigate("CriarQuestionarios")
        } else {
          // Navegar para MeusQuestionarios com a categoria específica
          console.log("Navegando para categoria:", item.label)
          navigation.navigate("MeusQuestionarios", {
            categoria: item.label,
            filtrarPorCategoria: true,
          })
        }
      }}
    >
      <View style={styles.categoryIconContainer}>
        <Feather name={getIconForCategory(item.key)} size={26} color="#3C4A5D" />
      </View>
      {item.label && <Text style={styles.categoryText}>{item.label}</Text>}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              {/* 🆕 USANDO APENAS O PRIMEIRO NOME NA SAUDAÇÃO */}
              <Text style={styles.greeting}>Olá, {getPrimeiroNome(usuarioLogado?.nome)}!</Text>
              <Text style={styles.subTitle}>Gestor - Fatec Praia Grande</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={26} color="#3C4A5D" />
            </TouchableOpacity>
          </View>

          {/* Stats Card - AGORA COM TOTAL DE FEEDBACKS + QUESTIONÁRIOS */}
          <TouchableOpacity 
            style={styles.statsCard}
            onPress={() => navigation.navigate("PainelRespostas")}
          >
            <Feather name="bar-chart-2" size={26} color="#3C4A5D" />
            <View style={styles.statsTextContainer}>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{novasRespostas}</Text> novas respostas esta semana
              </Text>
            </View>
          </TouchableOpacity>

          {/* Categories Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Questionários por categorias</Text>

            {/* Carrossel horizontal de categorias */}
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            />
          </View>

          {/* Feedback Section - DESIGN IGUAL DA HOME ALUNO */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos feedbacks</Text>
              <TouchableOpacity onPress={() => navigation.navigate("PainelRespostas")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de feedbacks - MESMO DESIGN DA HOME ALUNO */}
            {feedbackItems.length > 0 ? (
              feedbackItems.map((feedback) => (
                <TouchableOpacity 
                  key={feedback.id} 
                  style={styles.listItem}
                  onPress={() => navegarParaDetalhesAluno(feedback)}
                >
                  <View>
                    <Text style={styles.listItemTitle}>{truncateText(feedback.titulo)}</Text>
                    {/* 🔧 CORREÇÃO: REMOVIDO O "Por:" */}
                    <Text style={styles.listItemCategory}>{feedback.nomeUsuario}</Text>
                  </View>
                  <Feather name="chevron-right" size={26} color="#C5C5C5" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={32} color="#C5C5C5" />
                <Text style={styles.emptyStateText}>Nenhum feedback ainda</Text>
              </View>
            )}
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
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 28,
    width: "100%",
  },
  statsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
  },
  statsNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
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
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#2563eb",
  },
  categoriesContainer: {
    paddingRight: 22,
  },
  categoryCard: {
    width: 80,
    aspectRatio: 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  addCategoryCard: {
    borderStyle: "dashed",
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#3C4A5D",
    textAlign: "center",
  },
  // 🆕 ESTILOS IGUAIS DA HOME ALUNO
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3C4A5D",
    marginTop: 12,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})

