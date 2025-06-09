"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"
import Toast from "../../components/Toast"
import StorageService from "../../services/storage-service"

export default function AvaliacaoQuestionario() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("documents")
  const [respostas, setRespostas] = useState({})
  const [questionario, setQuestionario] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Receber o questionário dos parâmetros da rota
    if (route.params?.questionario) {
      const questionarioRecebido = route.params.questionario
      console.log("📝 Questionário recebido:", questionarioRecebido)

      setQuestionario(questionarioRecebido)

      // Inicializar o objeto de respostas
      const respostasIniciais = {}
      if (questionarioRecebido.perguntas) {
        questionarioRecebido.perguntas.forEach((pergunta, index) => {
          respostasIniciais[index] = null
        })
      }
      setRespostas(respostasIniciais)
    } else {
      // Fallback com dados de exemplo se não receber questionário
      const questionarioExemplo = {
        id: "exemplo",
        titulo: "Questionário de Exemplo",
        categoria: "Conteúdos",
        perguntas: [
          {
            texto: "Como você avalia a qualidade dos computadores do laboratório?",
            alternativas: ["Excelente", "Bom", "Regular", "Ruim"],
          },
          {
            texto: "Os equipamentos atendem às necessidades das aulas práticas?",
            alternativas: ["Sim", "Não", "Parcialmente"],
          },
        ],
      }

      setQuestionario(questionarioExemplo)
      setRespostas({ 0: null, 1: null })
    }
  }, [route.params])

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  const handleRespostaChange = (perguntaIndex, alternativaIndex) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaIndex]: alternativaIndex,
    }))
  }

  const verificarTodasRespondidas = () => {
    if (!questionario?.perguntas) return false

    for (let i = 0; i < questionario.perguntas.length; i++) {
      if (respostas[i] === null || respostas[i] === undefined) {
        return false
      }
    }
    return true
  }

  const handleEnviar = async () => {
    if (!verificarTodasRespondidas()) {
      Alert.alert("Atenção", "Por favor, responda todas as perguntas antes de enviar.")
      return
    }

    try {
      setEnviando(true)
      console.log("🚀 === INICIANDO ENVIO DE RESPOSTA ===")

      // Formatar as respostas para salvar - INCLUINDO TODAS AS ALTERNATIVAS
      const respostasFormatadas = Object.keys(respostas).map((perguntaIndex) => {
        const pergunta = questionario.perguntas[perguntaIndex]
        const alternativaIndex = respostas[perguntaIndex]

        const respostaFormatada = {
          perguntaId: perguntaIndex,
          perguntaTexto: pergunta.texto,
          respostaTexto: pergunta.alternativas[alternativaIndex],
          alternativaIndex: alternativaIndex,
          todasAlternativas: pergunta.alternativas, // SALVAR TODAS AS ALTERNATIVAS
          alternativas: pergunta.alternativas, // DUPLICAR PARA GARANTIR
        }

        console.log("📝 Resposta formatada com alternativas:", respostaFormatada)
        console.log("📝 Alternativas sendo salvas:", pergunta.alternativas)

        return respostaFormatada
      })

      console.log("📤 TODAS as respostas formatadas:", JSON.stringify(respostasFormatadas, null, 2))

      // Obter usuário logado
      const usuarioLogado = await StorageService.getUsuarioLogado()

      // Criar objeto de resposta
      const respostaQuestionario = {
        questionarioId: questionario.id,
        questionarioTitulo: questionario.titulo,
        categoria: questionario.categoria,
        respostas: respostasFormatadas,
      }

      console.log("📤 Objeto de resposta COMPLETO:", JSON.stringify(respostaQuestionario, null, 2))

      // Salvar as respostas usando o StorageService
      const resultado = await StorageService.salvarResposta(respostaQuestionario)

      if (resultado.sucesso) {
        // Verificar se realmente foi salvo
        const todasRespostas = await StorageService.getTodasRespostas()
        console.log("✅ Verificação final - Total de respostas:", todasRespostas.length)
        console.log("✅ Última resposta salva COMPLETA:", JSON.stringify(todasRespostas[0], null, 2))

        // Mostrar toast e navegar de volta após um delay
        setEnviando(false)
        setShowToast(true)

        // Navegar de volta após o toast desaparecer
        setTimeout(() => {
          navigation.navigate("HomeAluno", { respostaEnviada: true })
        }, 3000)
      } else {
        setEnviando(false)
        Alert.alert("Erro", resultado.erro || "Não foi possível enviar suas respostas.")
      }
    } catch (error) {
      console.error("❌ Erro no catch:", error)
      setEnviando(false)
      Alert.alert("Erro", "Não foi possível enviar suas respostas. Tente novamente.")
    }
  }

  if (!questionario) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.loadingText}>Carregando questionário...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} />

          {/* Título do questionário */}
          <View style={styles.questionarioHeader}>
            <Text style={styles.questionarioTitulo}>{questionario.titulo}</Text>
            <Text style={styles.questionarioCategoria}>{questionario.categoria}</Text>
          </View>

          {questionario.perguntas?.map((pergunta, perguntaIndex) => (
            <View key={perguntaIndex} style={styles.perguntaContainer}>
              <Text style={styles.perguntaTitulo}>Pergunta {perguntaIndex + 1}</Text>

              <Text style={styles.perguntaTexto}>{pergunta.texto}</Text>

              <View style={styles.opcoesContainer}>
                {pergunta.alternativas?.map((alternativa, alternativaIndex) => {
                  const isSelected = respostas[perguntaIndex] === alternativaIndex

                  return (
                    <TouchableOpacity
                      key={alternativaIndex}
                      style={[styles.opcaoItem, isSelected && styles.opcaoSelecionada]}
                      onPress={() => handleRespostaChange(perguntaIndex, alternativaIndex)}
                    >
                      <View style={[styles.radioButton, isSelected && styles.radioButtonSelecionado]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={[styles.opcaoTexto, isSelected && styles.opcaoTextoSelecionado]}>{alternativa}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.enviarButton, (!verificarTodasRespondidas() || enviando) && styles.enviarButtonDisabled]}
            onPress={handleEnviar}
            disabled={!verificarTodasRespondidas() || enviando}
          >
            <Text style={styles.enviarButtonText}>{enviando ? "Enviando..." : "Enviar"}</Text>
          </TouchableOpacity>

          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Toast de sucesso */}
      <Toast visible={showToast} message="Questionário enviado com sucesso!" onHide={() => setShowToast(false)} />

      <View style={styles.bottomNavContainer}>
        <BottomNavigationAluno activeTab={activeTab} onTabPress={handleTabPress} />
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
  questionarioHeader: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  questionarioTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  questionarioCategoria: {
    fontSize: 14,
    color: "#6B7280",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
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
    backgroundColor: "#fff",
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
  enviarButton: {
    backgroundColor: "#4A6572",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  enviarButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  enviarButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
