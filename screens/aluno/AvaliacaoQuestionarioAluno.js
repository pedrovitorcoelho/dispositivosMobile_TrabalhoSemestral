"use client"

import { useState } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"

"use client"



export default function AvaliacaoQuestionario() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("documents")
  const [respostas, setRespostas] = useState({})

  const questionario = {
    perguntas: [
      {
        id: 1,
        titulo: "Pergunta 1",
        texto: "Como você avalia a qualidade dos computadores do laboratório?",
        opcoes: [
          { id: "excelente", texto: "Excelente" },
          { id: "bom", texto: "Bom" },
          { id: "regular", texto: "Regular" },
          { id: "ruim", texto: "Ruim" },
        ],
      },
      {
        id: 2,
        titulo: "Pergunta 2",
        texto: "Os equipamentos atendem às necessidades das aulas práticas?",
        opcoes: [
          { id: "sim", texto: "Sim" },
          { id: "nao", texto: "Não" },
          { id: "parcialmente", texto: "Parcialmente" },
        ],
      },
    ],
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  const handleRespostaChange = (perguntaId, opcaoId) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: opcaoId,
    }))
  }

  const handleEnviar = () => {
    const perguntasRespondidas = Object.keys(respostas).length
    const totalPerguntas = questionario.perguntas.length

    if (perguntasRespondidas < totalPerguntas) {
      alert("Por favor, responda todas as perguntas antes de enviar.")
      return
    }

    console.log("Respostas enviadas:", respostas)
    alert("Questionário enviado com sucesso!")
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} />

          {questionario.perguntas.map((pergunta) => (
            <View key={pergunta.id} style={styles.perguntaContainer}>
              <Text style={styles.perguntaTitulo}>{pergunta.titulo}</Text>

              <Text style={styles.perguntaTexto}>{pergunta.texto}</Text>

              <View style={styles.opcoesContainer}>
                {pergunta.opcoes.map((opcao) => {
                  const isSelected = respostas[pergunta.id] === opcao.id

                  return (
                    <TouchableOpacity
                      key={opcao.id}
                      style={[styles.opcaoItem, isSelected && styles.opcaoSelecionada]}
                      onPress={() => handleRespostaChange(pergunta.id, opcao.id)}
                    >
                      <View style={[styles.radioButton, isSelected && styles.radioButtonSelecionado]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={[styles.opcaoTexto, isSelected && styles.opcaoTextoSelecionado]}>{opcao.texto}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.enviarButton} onPress={handleEnviar}>
            <Text style={styles.enviarButtonText}>Enviar</Text>
          </TouchableOpacity>

          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

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
