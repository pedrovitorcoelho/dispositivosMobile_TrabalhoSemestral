"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"

export default function VisualizarFeedback() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("home")
  const [carregando, setCarregando] = useState(true)

  // Obter dados do feedback passados por parâmetro
  const { feedbackId, feedback } = route.params || {}

  useEffect(() => {
    if (feedback) {
      setCarregando(false)
    }
  }, [feedback])

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  // Função para formatar data
  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString)
      return (
        data.toLocaleDateString("pt-BR") +
        " às " +
        data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    } catch (error) {
      return "Data não disponível"
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando feedback...</Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  if (!feedback) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Feedback não encontrado</Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} />

          {/* Título do feedback */}
          <View style={styles.headerContainer}>
            <Text style={styles.feedbackTitulo}>{feedback.titulo || "Feedback"}</Text>
            <Text style={styles.feedbackCategoria}>{feedback.tipo || "Feedback"}</Text>
            <Text style={styles.feedbackData}>Enviado em: {formatarData(feedback.dataEnvio)}</Text>
            <Text style={styles.feedbackStatus}>Status: {feedback.status || "Enviado"}</Text>
          </View>

          {/* Conteúdo do feedback */}
          <View style={styles.conteudoContainer}>
            <Text style={styles.conteudoTitulo}>Descrição</Text>
            <Text style={styles.conteudoTexto}>{feedback.descricao || "Sem descrição"}</Text>
          </View>


          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  headerContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  feedbackTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  feedbackCategoria: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  feedbackData: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  feedbackStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A6572",
  },
  conteudoContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  conteudoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A6572",
    marginBottom: 16,
  },
  conteudoTexto: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
