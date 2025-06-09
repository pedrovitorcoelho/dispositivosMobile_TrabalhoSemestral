"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import QuestionnaireCard from "../../components/QuestionnaireCard"
import BottomNavigation from "../../components/BottomNavigation"
import Toast from "../../components/Toast"
import Header from "../../components/Header"
import StorageService from "../../services/storage-service"
import React from "react"

export default function MeusQuestionarios() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("documents")
  const [questionarios, setQuestionarios] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [categoria, setCategoria] = useState("Equipamentos")

  // Carregar questionários quando a tela é focada
  useFocusEffect(
    React.useCallback(() => {
      carregarQuestionarios()
    }, [route.params?.categoria]),
  )

  useEffect(() => {
    // Verificar se há uma categoria específica nos parâmetros da rota
    if (route.params?.categoria) {
      setCategoria(route.params.categoria)
      console.log(`🎯 Categoria definida: ${route.params.categoria}`)
    }

    // Verificar se há um novo questionário nos parâmetros da rota
    if (route.params?.novoQuestionario) {
      const novoQuestionario = route.params.novoQuestionario

      console.log(`✅ Novo questionário recebido:`, novoQuestionario)
      console.log(`📂 Categoria do questionário: ${novoQuestionario.categoria}`)

      // Mostrar toast de sucesso se solicitado
      if (route.params.showSuccessToast) {
        setShowToast(true)
      }

      // NÃO LIMPAR os parâmetros da rota - deixar para o Header detectar
      // navigation.setParams({ novoQuestionario: null, showSuccessToast: false })

      // Recarregar questionários para mostrar o novo
      setTimeout(() => {
        carregarQuestionarios()
      }, 100)
    }
  }, [route.params])

  const carregarQuestionarios = async () => {
    try {
      // Carregar questionários do localStorage
      const meusQuestionarios = await StorageService.getMeusQuestionarios()

      // Determinar qual categoria usar para filtrar
      const categoriaAtual = route.params?.categoria || categoria

      // SEMPRE filtrar por categoria - cada tela mostra apenas sua categoria
      const questionariosFiltrados = meusQuestionarios
        .filter((questionario) => {
          // Filtrar apenas questionários da categoria atual
          return questionario.categoria === categoriaAtual
        })
        .map((questionario) => ({
          id: questionario.id,
          title: questionario.titulo,
          questionCount: questionario.perguntas?.length || 0,
          categoria: questionario.categoria,
        }))

      setQuestionarios(questionariosFiltrados)

      console.log(`📂 Categoria: ${categoriaAtual}`)
      console.log(`📊 Questionários encontrados: ${questionariosFiltrados.length}`)
      console.log(
        "📋 Questionários:",
        questionariosFiltrados.map((q) => `${q.title} (${q.categoria})`),
      )
    } catch (error) {
      console.error("Erro ao carregar questionários:", error)
      // Em caso de erro, não mostrar dados mock para evitar confusão
      setQuestionarios([])
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    // In a real app, you would navigate to the appropriate screen
  }

  // Função para obter o subtítulo baseado na categoria
  const getSubtitle = () => {
    const categoriaAtual = route.params?.categoria || categoria
    return `Meus questionários criados sobre ${categoriaAtual.toLowerCase()}`
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header - EXATAMENTE como na tela CriarQuestionario */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>{categoria}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>

          {/* Content */}
          <View style={styles.cardsContainer}>
            {questionarios.length > 0 ? (
              questionarios.map((questionario) => (
                <QuestionnaireCard
                  key={questionario.id}
                  title={questionario.title}
                  questionCount={questionario.questionCount}
                  onPress={() => {
                    // Navegar para visualizar questionário
                    navigation.navigate("VisualizarQuestionario", {
                      questionarioId: questionario.id,
                      categoria: questionario.categoria,
                    })
                  }}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhum questionário criado ainda</Text>
                <Text style={styles.emptyStateSubText}>
                  {route.params?.categoria
                    ? `Crie questionários sobre ${categoria.toLowerCase()}`
                    : "Crie seu primeiro questionário"}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Create Button */}
      {/* Create Button - fixo acima da BottomNavigation */}
      <TouchableOpacity
        style={styles.createButtonFixed}
        onPress={() =>
          navigation.navigate("CriarQuestionarios", {
            categoria: route.params?.categoria || categoria,
            categoriaPreSelecionada: route.params?.categoria || categoria, // Nova prop para pré-selecionar
          })
        }
      >
        <Text style={styles.buttonText}>Criar novo questionário</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} navigation={navigation} />
      </View>

      {/* Toast de sucesso - AGORA como overlay absoluto */}
      {showToast && (
        <Toast visible={showToast} message="Questionário salvo com sucesso!" onHide={() => setShowToast(false)} />
      )}
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
    padding: 22, // EXATAMENTE como na tela CriarQuestionario
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  createButtonFixed: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 88, // 56 da BottomNavigation + 32 de espaço
    backgroundColor: "#4A6572",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    zIndex: 10,
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
