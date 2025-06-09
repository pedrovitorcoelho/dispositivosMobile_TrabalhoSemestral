"use client"

import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import AsyncStorage from "@react-native-async-storage/async-storage"
import StorageService from "../../services/storage-service"

// Get screen dimensions
const { width } = Dimensions.get("window")

/* ─────────── dados mock ─────────── */
const categories = [
  { id: "1", key: "conteudos", label: "Conteúdos", icon: "file-text" },
  { id: "2", key: "professores", label: "Professores", icon: "users" },
  { id: "3", key: "estrutura", label: "Estrutura", icon: "grid" },
  { id: "4", key: "estagios", label: "Estágios", icon: "briefcase" },
]

/* ─────────── componente ─────────── */
export default function HomeAluno() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = React.useState("home")

  // Estados para dados reais
  const [usuarioLogado, setUsuarioLogado] = React.useState(null)
  const [questionariosRespondidos, setQuestionariosRespondidos] = React.useState([])
  const [feedbacksEnviados, setFeedbacksEnviados] = React.useState([])
  const [loading, setLoading] = React.useState(true)

    // 🆕 FUNÇÃO PARA PEGAR APENAS O PRIMEIRO NOME
  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "Aluno"
    return nomeCompleto.split(" ")[0]
  }

  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarDadosUsuario()
    }, []),
  )

  const carregarDadosUsuario = async () => {
    try {
      setLoading(true)
      console.log("🔄 === CARREGANDO DADOS DO USUÁRIO NA HOME ===")

      // 1. BUSCAR USUÁRIO LOGADO
      const usuarioLogadoString = await AsyncStorage.getItem("fatec360_usuario_logado")
      if (!usuarioLogadoString) {
        console.log("❌ Nenhum usuário logado encontrado")
        return
      }

      const usuario = JSON.parse(usuarioLogadoString)
      console.log("👤 Usuário logado:", JSON.stringify(usuario, null, 2))
      setUsuarioLogado(usuario)

      // 2. BUSCAR QUESTIONÁRIOS RESPONDIDOS DO USUÁRIO
      const todasRespostas = await StorageService.getTodasRespostas()
      console.log("📊 Total de respostas no sistema:", todasRespostas.length)

      // Filtrar respostas do usuário logado
      const respostasDoUsuario = todasRespostas.filter((resposta) => {
        const match = String(resposta.usuarioId) === String(usuario.id)
        console.log(`Comparando resposta: ${resposta.usuarioId} com ${usuario.id} - Match: ${match}`)
        return match
      })

      console.log("📊 Respostas do usuário:", respostasDoUsuario.length)

      // Formatar questionários para exibição (pegar apenas os 3 mais recentes)
      const questionariosFormatados = respostasDoUsuario
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .slice(0, 3)
        .map((resposta) => ({
          id: resposta.id,
          titulo: resposta.questionarioTitulo || "Questionário",
          categoria: resposta.categoria || "Geral",
          dataResposta: resposta.dataEnvio,
          respostaCompleta: resposta,
        }))

      setQuestionariosRespondidos(questionariosFormatados)
      console.log("📊 Questionários formatados:", questionariosFormatados.length)

      // 3. BUSCAR FEEDBACKS ENVIADOS DO USUÁRIO
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

      // Filtrar feedbacks do usuário logado
      const feedbacksDoUsuario = todosFeedbacks.filter((feedback) => {
        const match = String(feedback.usuarioId) === String(usuario.id)
        console.log(`💬 Comparando feedback: ${feedback.usuarioId} com ${usuario.id} - Match: ${match}`)
        return match
      })

      console.log("💬 Feedbacks do usuário:", feedbacksDoUsuario.length)

      // Formatar feedbacks para exibição (pegar apenas os 3 mais recentes)
      const feedbacksFormatados = feedbacksDoUsuario
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .slice(0, 3)
        .map((feedback) => ({
          id: feedback.id,
          assunto: feedback.titulo || "Feedback",
          categoria: "FeedBack",
          dataEnvio: feedback.dataEnvio,
          feedbackCompleto: feedback,
        }))

      setFeedbacksEnviados(feedbacksFormatados)
      console.log("💬 Feedbacks formatados:", feedbacksFormatados.length)

      console.log("✅ === DADOS CARREGADOS COM SUCESSO ===")
    } catch (error) {
      console.error("❌ Erro ao carregar dados do usuário:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  // Função para navegar para visualização do questionário respondido
  const navegarParaVisualizarQuestionario = (questionario) => {
    console.log("🔍 Navegando para visualizar questionário:", questionario.titulo)
    navigation.navigate("VisualizarQuestionarioRespondido", {
      questionarioId: questionario.id,
      resposta: questionario.respostaCompleta,
    })
  }

  // Função para navegar para visualização do feedback
  const navegarParaVisualizarFeedback = (feedback) => {
    console.log("🔍 Navegando para visualizar feedback:", feedback.assunto)
    navigation.navigate("VisualizarFeedback", {
      feedbackId: feedback.id,
      feedback: feedback.feedbackCompleto,
    })
  }

  // Função para truncar texto se necessário
  const truncateText = (text, maxLength = 35) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              {/* 🔧 ÚNICA ALTERAÇÃO: Aplicando a função getPrimeiroNome */}
              <Text style={styles.greeting}>Olá, {getPrimeiroNome(usuarioLogado?.nome)}!</Text>
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MeusQuestionariosRespondidos")
                }}
              >
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de questionários respondidos REAIS */}
            {loading ? (
              <TouchableOpacity style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>Carregando...</Text>
                  <Text style={styles.listItemCategory}>Aguarde</Text>
                </View>
                <Feather name="chevron-right" size={26} color="#C5C5C5" />
              </TouchableOpacity>
            ) : questionariosRespondidos.length > 0 ? (
              questionariosRespondidos.map((questionario) => (
                <TouchableOpacity
                  key={questionario.id}
                  style={styles.listItem}
                  onPress={() => navegarParaVisualizarQuestionario(questionario)}
                >
                  <View>
                    <Text style={styles.listItemTitle}>{truncateText(questionario.titulo)}</Text>
                    <Text style={styles.listItemCategory}>{questionario.categoria}</Text>
                  </View>
                  <Feather name="chevron-right" size={26} color="#C5C5C5" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="file-text" size={32} color="#C5C5C5" />
                <Text style={styles.emptyStateSubText}>Nenhum questionário respondido ainda</Text>
              </View>
            )}
          </View>

          {/* Meus Feedbacks Enviados Section */}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meus feedbacks enviados</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MeusFeedbacksEnviados")
                }}
              >
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de feedbacks enviados REAIS */}
            {loading ? (
              <TouchableOpacity style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>Carregando...</Text>
                  <Text style={styles.listItemCategory}>Aguarde</Text>
                </View>
                <Feather name="chevron-right" size={26} color="#C5C5C5" />
              </TouchableOpacity>
            ) : feedbacksEnviados.length > 0 ? (
              feedbacksEnviados.map((feedback) => (
                <TouchableOpacity
                  key={feedback.id}
                  style={styles.listItem}
                  onPress={() => navegarParaVisualizarFeedback(feedback)}
                >
                  <View>
                    <Text style={styles.listItemTitle}>{truncateText(feedback.assunto)}</Text>
                    <Text style={styles.listItemCategory}>{feedback.categoria}</Text>
                  </View>
                  <Feather name="chevron-right" size={26} color="#C5C5C5" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={32} color="#C5C5C5" />
                <Text style={styles.emptyStateSubText}>Nenhum feedback enviado ainda</Text>
              </View>
            )}
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
    marginBottom: 32,
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
    marginBottom: 18,
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
  // 🆕 NOVOS ESTILOS PARA EMPTY STATE
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#3C4A5D",
    opacity: 0.6,
    marginTop: 4,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})

