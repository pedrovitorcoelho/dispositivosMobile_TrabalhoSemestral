"use client"

import { useState } from "react"
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native"
import QuestionnaireCard from "../../components/QuestionnaireCard"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Toast from "../../components/Toast"
import Header from "../../components/Header"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import StorageService from "../../services/storage-service"
import React from "react"

export default function MeusQuestionariosRespondidos({ route }) {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("documents")
  const [questionarios, setQuestionarios] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)

  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarQuestionariosRespondidos()
    }, []),
  )

  const carregarQuestionariosRespondidos = async () => {
    try {
      setLoading(true)
      console.log("🔄 === CARREGANDO QUESTIONÁRIOS RESPONDIDOS ===")

      // 1. BUSCAR USUÁRIO LOGADO
      const usuarioLogadoString = await AsyncStorage.getItem("fatec360_usuario_logado")
      if (!usuarioLogadoString) {
        console.log("❌ Nenhum usuário logado encontrado")
        return
      }

      const usuario = JSON.parse(usuarioLogadoString)
      console.log("👤 Usuário logado:", JSON.stringify(usuario, null, 2))

      // 2. BUSCAR QUESTIONÁRIOS RESPONDIDOS DO USUÁRIO
      const todasRespostas = await StorageService.getTodasRespostas()
      console.log("📊 Total de respostas no sistema:", todasRespostas.length)

      // Filtrar respostas do usuário logado
      const respostasDoUsuario = todasRespostas.filter((resposta) => {
        const match = String(resposta.usuarioId) === String(usuario.id)
        return match
      })

      console.log("📊 Respostas do usuário:", respostasDoUsuario.length)

      // Formatar questionários para exibição
      const questionariosFormatados = respostasDoUsuario
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .map((resposta) => ({
          id: resposta.id,
          title: resposta.questionarioTitulo || "Questionário",
          category: resposta.categoria || "Geral",
          questionCount: resposta.respostas?.length || 0,
          dataResposta: new Date(resposta.dataEnvio).toLocaleDateString("pt-BR"),
          respostaCompleta: resposta,
        }))

      setQuestionarios(questionariosFormatados)
      console.log("📊 Questionários formatados:", questionariosFormatados.length)

      console.log("✅ === DADOS CARREGADOS COM SUCESSO ===")
    } catch (error) {
      console.error("❌ Erro ao carregar questionários respondidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  const handleQuestionarioPress = (questionario) => {
    navigation.navigate("VisualizarQuestionarioRespondido", {
      questionarioId: questionario.id,
      resposta: questionario.respostaCompleta,
    })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>Meus questionários respondidos</Text>
          <Text style={styles.subtitle}>Esses são todos os questionários que eu já respondi</Text>

          {/* Content */}
          <View style={styles.cardsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Carregando questionários...</Text>
            ) : questionarios.length > 0 ? (
              questionarios.map((questionario) => (
                <QuestionnaireCard
                  key={questionario.id}
                  title={questionario.title}
                  questionCount={questionario.questionCount}
                  category={questionario.category}
                  date={questionario.dataResposta}
                  onPress={() => handleQuestionarioPress(questionario)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Você ainda não respondeu nenhum questionário.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigationAluno activeTab={activeTab} onTabPress={handleTabPress} />
      </View>

      {/* Toast de sucesso */}
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
    padding: 22,
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
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
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
