"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import QuestionnaireCard from "../../components/QuestionnaireCard"
import BottomNavigation from "../../components/BottomNavigation"
import Toast from "../../components/Toast"
import Header from '../../components/Header';

export default function MeusQuestionarios({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("documents")
  const [questionarios, setQuestionarios] = useState([
    {
      id: 1,
      title: "Equipamentos da biblioteca",
      questionCount: 5,
    },
    {
      id: 2,
      title: "Equipamentos do laboratório de química",
      questionCount: 5,
    },
  ])
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Verificar se há um novo questionário nos parâmetros da rota
    if (route.params?.novoQuestionario) {
      const novoQuestionario = route.params.novoQuestionario

      // Verificar se o questionário já existe na lista para evitar duplicação
      const questionarioExistente = questionarios.find((q) => q.id === novoQuestionario.id)

      if (!questionarioExistente) {
        // Adicionar o novo questionário à lista
        setQuestionarios((prevQuestionarios) => [
          ...prevQuestionarios,
          {
            id: novoQuestionario.id,
            title: novoQuestionario.titulo,
            questionCount: novoQuestionario.numPerguntas,
          },
        ])
      }

      // Mostrar toast de sucesso se solicitado
      if (route.params.showSuccessToast) {
        setShowToast(true)
      }

      // Limpar os parâmetros da rota para evitar duplicação ao navegar de volta
      navigation.setParams({ novoQuestionario: null, showSuccessToast: false })
    }
  }, [route.params])

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    // In a real app, you would navigate to the appropriate screen
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header - EXATAMENTE como na tela CriarQuestionario */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>Equipamentos</Text>
          <Text style={styles.subtitle}>Meus questionários criados sobre equipamentos</Text>

          {/* Content */}
          <View style={styles.cardsContainer}>
            {questionarios.map((questionario) => (
              <QuestionnaireCard
                key={questionario.id}
                title={questionario.title}
                questionCount={questionario.questionCount}
                onPress={() => {
                  // Handle card press
                }}
              />
            ))}
          </View>

          

        </ScrollView>
      </SafeAreaView>

      {/* Create Button */}
          {/* Create Button - fixo acima da BottomNavigation */}
          <TouchableOpacity
            style={styles.createButtonFixed}
            onPress={() => navigation.navigate("CriarQuestionarios")}
          >
            <Text style={styles.buttonText}>Criar novo questionário</Text>
          </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
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