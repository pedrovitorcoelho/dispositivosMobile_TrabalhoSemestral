"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import BottomNavigationAluno from "../../components/BottomNavigationAluno"
import Header from "../../components/Header"
import Toast from "../../components/Toast"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

// Get screen dimensions
const { width, height } = Dimensions.get("window")

export default function EnviarFeedbackAluno() {
  const navigation = useNavigation()
  const scrollViewRef = useRef(null)
  const [activeTab, setActiveTab] = useState("home")

  // Estados para o feedback
  const [tipoFeedback, setTipoFeedback] = useState("Feedback")
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")

  // Estados para controle
  const [showDropdown, setShowDropdown] = useState(false)

  // Estados para o Toast
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const tiposFeedback = ["Feedback"]

  useFocusEffect(
    React.useCallback(() => {
      // Reset form when screen is focused
      setTipoFeedback("Feedback")
      setTitulo("")
      setDescricao("")
    }, []),
  )

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  const selecionarTipoFeedback = (tipo) => {
    setTipoFeedback(tipo)
    setShowDropdown(false)
  }

  const salvarFeedbackNoStorage = async (feedback) => {
    try {
      console.log("💾 === SALVANDO FEEDBACK NO STORAGE ===")
      console.log("📝 Feedback a ser salvo:", JSON.stringify(feedback, null, 2))

      // Buscar feedbacks existentes
      const feedbacksExistentes = await AsyncStorage.getItem("feedbacks_enviados")
      const feedbacks = feedbacksExistentes ? JSON.parse(feedbacksExistentes) : []

      console.log("📊 Feedbacks existentes:", feedbacks.length)

      // Adicionar novo feedback
      feedbacks.push(feedback)

      // Salvar de volta no AsyncStorage
      await AsyncStorage.setItem("feedbacks_enviados", JSON.stringify(feedbacks))

      console.log("✅ Feedback salvo com sucesso! Total de feedbacks:", feedbacks.length)
      console.log("💾 === SALVAMENTO CONCLUÍDO ===")
    } catch (error) {
      console.error("❌ Erro ao salvar feedback:", error)
    }
  }

  const enviarFeedback = async () => {
    // Validar campos obrigatórios
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Por favor, adicione um título para o feedback.")
      return
    }

    if (!descricao.trim()) {
      Alert.alert("Atenção", "Por favor, escreva seu feedback.")
      return
    }

    try {
      console.log("🚀 === INICIANDO ENVIO DE FEEDBACK ===")

      // Buscar usuário logado
      const usuarioLogadoString = await AsyncStorage.getItem("fatec360_usuario_logado")
      if (!usuarioLogadoString) {
        Alert.alert("Erro", "Usuário não está logado.")
        return
      }

      const usuarioLogado = JSON.parse(usuarioLogadoString)
      console.log("👤 Usuário logado:", JSON.stringify(usuarioLogado, null, 2))

      // Criar o objeto do feedback COM DADOS DO USUÁRIO
      const novoFeedback = {
        id: Date.now(),
        tipo: tipoFeedback,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        dataEnvio: new Date().toISOString(),
        remetente: "aluno",
        status: "enviado",
        // DADOS DO USUÁRIO - IMPORTANTE!
        usuarioId: usuarioLogado.id,
        nomeUsuario: usuarioLogado.nome,
        emailUsuario: usuarioLogado.email,
        tipoUsuario: usuarioLogado.tipo,
      }

      console.log("📝 Novo feedback criado:", JSON.stringify(novoFeedback, null, 2))

      // Salvar no AsyncStorage
      await salvarFeedbackNoStorage(novoFeedback)

      // Mostrar toast de sucesso
      setToastMessage("Feedback enviado com sucesso!")
      setShowToast(true)

      // Navegar para HomeAluno após o toast desaparecer (3 segundos)
      setTimeout(() => {
        navigation.navigate("HomeAluno", { feedbackEnviado: true })
      }, 3000)

      console.log("🎉 === ENVIO DE FEEDBACK CONCLUÍDO ===")
    } catch (error) {
      console.error("❌ Erro ao enviar feedback:", error)
      Alert.alert("Erro", "Ocorreu um erro ao enviar o feedback. Tente novamente.")
    }
  }

  const handleToastHide = () => {
    setShowToast(false)
  }

  const bottomNavHeight = 56

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header navigation={navigation} />

          {/* Título da tela */}
          <Text style={styles.title}>Enviar Feedback</Text>

          {/* Formulário de feedback */}
          <View style={styles.feedbackSection}>
            {/* Dropdown de tipo de feedback */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
                <Text style={styles.dropdownText}>{tipoFeedback}</Text>
                <Feather name="chevron-down" size={22} color="#3C4A5D" />
              </TouchableOpacity>

              {/* Dropdown options */}
              {showDropdown && (
                <View style={styles.dropdownOptions}>
                  {tiposFeedback.map((tipo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dropdownOption, tipo === tipoFeedback && styles.dropdownOptionSelected]}
                      onPress={() => selecionarTipoFeedback(tipo)}
                    >
                      <Text
                        style={[styles.dropdownOptionText, tipo === tipoFeedback && styles.dropdownOptionTextSelected]}
                      >
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Campo título do feedback */}
            <TextInput
              style={styles.input}
              placeholder="Título do feedback"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor="#A0A0A0"
            />

            {/* Campo descrição do feedback */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escreva seu feedback"
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor="#A0A0A0"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Spacer para empurrar o botão para baixo */}
          <View style={{ flex: 1, minHeight: 100 }} />

          {/* Botão enviar */}
          <TouchableOpacity
            style={[styles.enviarButton, (!titulo.trim() || !descricao.trim()) && styles.enviarButtonDisabled]}
            onPress={enviarFeedback}
            disabled={!titulo.trim() || !descricao.trim()}
          >
            <Text style={styles.enviarButtonText}>Enviar</Text>
          </TouchableOpacity>

          <View style={{ height: bottomNavHeight + 20 }} />
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigationAluno activeTab={activeTab} onTabPress={handleTabPress} />
      </View>

      {/* Toast Component */}
      <Toast visible={showToast} message={toastMessage} onHide={handleToastHide} />
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
    color: "#3C4A5D",
    marginBottom: 24,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 14,
    color: "#3C4A5D",
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionSelected: {
    backgroundColor: "#F0F8FF",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#3C4A5D",
  },
  dropdownOptionTextSelected: {
    color: "#4A6572",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 14,
    color: "#3C4A5D",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  enviarButton: {
    backgroundColor: "#4A6572",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
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
