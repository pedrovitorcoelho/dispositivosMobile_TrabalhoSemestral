"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"
import QuestionnaireCard from "../../components/QuestionnaireCard"

export default function QuestionariosDisponiveisAluno() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("documents")

  // Estado para armazenar os questionários disponíveis
  const [questionarios, setQuestionarios] = useState([
    {
      id: 1,
      title: "Sua opinião sobre os conteúdos de Economia",
      questionCount: 5,
      category: "Conteúdos",
    },
    {
      id: 2,
      title: "Dê nota para os conteúdos de Cálculo I",
      questionCount: 2,
      category: "Conteúdos",
    },
  ])

  // Estado para armazenar a categoria atual
  const [categoria, setCategoria] = useState("Conteúdos")

  useEffect(() => {
    // Verificar se há uma categoria específica nos parâmetros da rota
    if (route.params?.categoria) {
      setCategoria(route.params.categoria)

      // Aqui você poderia fazer uma chamada à API para buscar questionários
      // específicos da categoria selecionada
      // fetchQuestionariosPorCategoria(route.params.categoria)
    }
  }, [route.params])

  // Função simulada para buscar questionários por categoria
  const fetchQuestionariosPorCategoria = (categoria) => {
    // Em um app real, isso seria uma chamada à API
    console.log(`Buscando questionários da categoria: ${categoria}`)

    // Simulando dados diferentes por categoria
    if (categoria === "Equipamentos") {
      setQuestionarios([
        {
          id: 3,
          title: "Avaliação dos equipamentos do laboratório",
          questionCount: 8,
          category: "Equipamentos",
        },
        {
          id: 4,
          title: "Feedback sobre os computadores da biblioteca",
          questionCount: 3,
          category: "Equipamentos",
        },
      ])
    } else {
      // Manter os questionários padrão de "Conteúdos"
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    // Em um app real, você navegaria para a tela apropriada
  }

  const abrirQuestionario = (questionario) => {
    // Navegar para a tela de responder questionário
    navigation.navigate("AvaliacaoQuestionarioAluno", { questionario })
  }

  const criarNovoQuestionario = () => {
    // Navegar para a tela de criar questionário
    navigation.navigate("CriarQuestionarios", { categoria })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header com botão de voltar */}
          <Header navigation={navigation} />

          {/* Title Section */}
          <Text style={styles.title}>{categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()}</Text>
          <Text style={styles.subtitle}>Esses são os questionários disponíveis sobre {categoria.toLowerCase()}!</Text>

          {/* Lista de questionários disponíveis */}
          <View style={styles.cardsContainer}>
            {questionarios.map((questionario) => (
              <QuestionnaireCard
                key={questionario.id}
                title={questionario.title}
                questionCount={questionario.questionCount}
                onPress={() => abrirQuestionario(questionario)}
              />
            ))}
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
