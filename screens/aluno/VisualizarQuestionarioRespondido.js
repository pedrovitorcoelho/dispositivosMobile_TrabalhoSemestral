"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"

export default function VisualizarQuestionarioRespondido() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("home")
  const [carregando, setCarregando] = useState(true)

  // Obter dados da resposta passados por parâmetro
  const { questionarioId, resposta } = route.params || {}

  useEffect(() => {
    if (resposta) {
      setCarregando(false)
    }
  }, [resposta])

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
            <Text style={styles.loadingText}>Carregando questionário...</Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  if (!resposta) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Questionário não encontrado</Text>
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

          {/* Título do questionário */}
          <View style={styles.headerContainer}>
            <Text style={styles.questionarioTitulo}>{resposta.questionarioTitulo || "Questionário"}</Text>
            <Text style={styles.questionarioCategoria}>{resposta.categoria || "Categoria não especificada"}</Text>
            <Text style={styles.questionarioData}>Respondido em: {formatarData(resposta.dataEnvio)}</Text>
          </View>

          {/* Perguntas e respostas */}
          {Array.isArray(resposta.respostas) &&
            resposta.respostas.map((item, index) => (
              <View key={index} style={styles.perguntaContainer}>
                <Text style={styles.perguntaTitulo}>Pergunta {index + 1}</Text>
                <Text style={styles.perguntaTexto}>{item.perguntaTexto || `Pergunta ${index + 1}`}</Text>

                {/* Alternativas */}
                <View style={styles.opcoesContainer}>
                  {Array.isArray(item.alternativas) &&
                    item.alternativas.map((alternativa, altIndex) => (
                      <View
                        key={altIndex}
                        style={[styles.opcaoItem, alternativa === item.respostaTexto && styles.opcaoSelecionada]}
                      >
                        <View
                          style={[
                            styles.radioButton,
                            alternativa === item.respostaTexto && styles.radioButtonSelecionado,
                          ]}
                        >
                          {alternativa === item.respostaTexto && <View style={styles.radioButtonInner} />}
                        </View>
                        <Text
                          style={[
                            styles.opcaoTexto,
                            alternativa === item.respostaTexto && styles.opcaoTextoSelecionado,
                          ]}
                        >
                          {alternativa}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            ))}

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Total de perguntas: {resposta.respostas?.length || 0}</Text>
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
  questionarioTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  questionarioCategoria: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  questionarioData: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
  perguntaContainer: {
    marginBottom: 40,
  },
  perguntaTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A6572",
    marginBottom: 16,
  },
  perguntaTexto: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 24,
  },
  opcoesContainer: {
    gap: 16,
  },
  opcaoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  opcaoSelecionada: {
    backgroundColor: "#EBF8FF",
    borderColor: "#4A6572",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelecionado: {
    borderColor: "#4A6572",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A6572",
  },
  opcaoTexto: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  opcaoTextoSelecionado: {
    color: "#374151",
    fontWeight: "500",
  },
  infoContainer: {
    marginTop: 32,
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
