"use client"

import { useState } from "react"
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native"
import QuestionnaireCard from "../../components/QuestionnaireCard"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Toast from "../../components/Toast"
import Header from "../../components/Header"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

export default function MeusFeedbacksEnviados({ route }) {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("documents")
  const [feedbacks, setFeedbacks] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)

  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarFeedbacksEnviados()
    }, []),
  )

  const carregarFeedbacksEnviados = async () => {
    try {
      setLoading(true)
      console.log("🔄 === CARREGANDO FEEDBACKS ENVIADOS ===")

      // 1. BUSCAR USUÁRIO LOGADO
      const usuarioLogadoString = await AsyncStorage.getItem("fatec360_usuario_logado")
      if (!usuarioLogadoString) {
        console.log("❌ Nenhum usuário logado encontrado")
        return
      }

      const usuario = JSON.parse(usuarioLogadoString)
      console.log("👤 Usuário logado:", JSON.stringify(usuario, null, 2))

      // 2. BUSCAR FEEDBACKS ENVIADOS DO USUÁRIO
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
        return match
      })

      console.log("💬 Feedbacks do usuário:", feedbacksDoUsuario.length)

      // Formatar feedbacks para exibição
      const feedbacksFormatados = feedbacksDoUsuario
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .map((feedback) => ({
          id: feedback.id,
          title: feedback.titulo || "Feedback",
          category: "Feedback",
          questionCount: 1, // Para compatibilidade com o componente QuestionnaireCard
          dataEnvio: new Date(feedback.dataEnvio).toLocaleDateString("pt-BR"),
          feedbackCompleto: feedback,
        }))

      setFeedbacks(feedbacksFormatados)
      console.log("💬 Feedbacks formatados:", feedbacksFormatados.length)

      console.log("✅ === DADOS CARREGADOS COM SUCESSO ===")
    } catch (error) {
      console.error("❌ Erro ao carregar feedbacks enviados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  const handleFeedbackPress = (feedback) => {
    navigation.navigate("VisualizarFeedback", {
      feedbackId: feedback.id,
      feedback: feedback.feedbackCompleto,
    })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>Meus feedbacks enviados</Text>
          <Text style={styles.subtitle}>Esses são todos os feedbacks que eu já enviei</Text>

          {/* Content */}
          <View style={styles.cardsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Carregando feedbacks...</Text>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <QuestionnaireCard
                  key={feedback.id}
                  title={feedback.title}
                  questionCount={feedback.questionCount}
                  category={feedback.category}
                  date={feedback.dataEnvio}
                  onPress={() => handleFeedbackPress(feedback)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Você ainda não enviou nenhum feedback.</Text>
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
        <Toast visible={showToast} message="Feedback enviado com sucesso!" onHide={() => setShowToast(false)} />
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
