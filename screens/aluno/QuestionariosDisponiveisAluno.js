"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"
import QuestionnaireCard from "../../components/QuestionnaireCard"
import StorageService from "../../services/storage-service"

export default function QuestionariosDisponiveisAluno() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("documents")

  // Estado para armazenar os questionários disponíveis
  const [questionarios, setQuestionarios] = useState([])
  const [loading, setLoading] = useState(true)

  // Estado para armazenar a categoria atual
  const [categoria, setCategoria] = useState("Conteúdos")

  // Mapear as chaves de categoria para nomes de exibição
  const categoriasMap = {
    conteudos: "Conteúdos",
    professores: "Professores",
    estrutura: "Estrutura",
    estagios: "Estágios",
  }

  useEffect(() => {
    // Verificar se há uma categoria específica nos parâmetros da rota
    if (route.params?.categoria) {
      const categoriaParam = route.params.categoria
      const categoriaDisplay = categoriasMap[categoriaParam] || categoriaParam
      setCategoria(categoriaDisplay)

      console.log(`🎯 Categoria recebida: ${categoriaParam} -> ${categoriaDisplay}`)
    }

    // Carregar questionários da categoria
    carregarQuestionarios()
  }, [route.params])

  // Função para buscar questionários reais do StorageService
  const carregarQuestionarios = async () => {
    try {
      setLoading(true)

      // Buscar TODOS os questionários criados pelos gestores
      const todosQuestionarios = await StorageService.getTodosQuestionarios()

      // Determinar qual categoria usar
      const categoriaParam = route.params?.categoria
      const categoriaDisplay = categoriaParam ? categoriasMap[categoriaParam] || categoriaParam : categoria

      // Filtrar questionários por categoria
      const questionariosFiltrados = todosQuestionarios
        .filter((q) => q.categoria === categoriaDisplay)
        .map((q) => ({
          id: q.id,
          title: q.titulo,
          questionCount: q.perguntas?.length || 0,
          category: q.categoria,
          questionarioCompleto: q, // Guardar o questionário completo para passar adiante
        }))

      console.log(`📊 Encontrados ${questionariosFiltrados.length} questionários na categoria ${categoriaDisplay}`)

      setQuestionarios(questionariosFiltrados)
    } catch (error) {
      console.error("❌ Erro ao carregar questionários:", error)

      // Em caso de erro, usar dados de exemplo para a apresentação
      const dadosExemplo = [
        {
          id: "exemplo1",
          title: "Avaliação dos conteúdos do semestre",
          questionCount: 3,
          category: "Conteúdos",
        },
        {
          id: "exemplo2",
          title: "Qualidade dos materiais didáticos",
          questionCount: 2,
          category: "Conteúdos",
        },
      ]

      setQuestionarios(dadosExemplo)
    } finally {
      setLoading(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    // Em um app real, você navegaria para a tela apropriada
  }

  const abrirQuestionario = (questionario) => {
    // Navegar para a tela de responder questionário passando o questionário completo
    navigation.navigate("AvaliacaoQuestionarioAluno", {
      questionario: questionario.questionarioCompleto || {
        id: questionario.id,
        titulo: questionario.title,
        categoria: questionario.category,
        perguntas: [], // Fallback para dados de exemplo
      },
    })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header com botão de voltar */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>{categoria}</Text>
          <Text style={styles.subtitle}>Esses são os questionários disponíveis sobre {categoria.toLowerCase()}!</Text>

          {/* Lista de questionários disponíveis */}
          <View style={styles.cardsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando questionários...</Text>
              </View>
            ) : questionarios.length > 0 ? (
              questionarios.map((questionario) => (
                <QuestionnaireCard
                  key={questionario.id}
                  title={questionario.title}
                  questionCount={questionario.questionCount}
                  onPress={() => abrirQuestionario(questionario)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={48} color="#C5C5C5" />
                <Text style={styles.emptyStateText}>Nenhum questionário disponível</Text>
                <Text style={styles.emptyStateSubText}>
                  Não há questionários sobre {categoria.toLowerCase()} para responder no momento
                </Text>
              </View>
            )}
          </View>
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
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: "80%",
  },
  createButton: {
    backgroundColor: "#4A6572",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
})
