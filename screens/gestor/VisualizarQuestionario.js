"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"
import StorageService from "../../services/storage-service"

export default function VisualizarQuestionario() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("documents")
  const [questionario, setQuestionario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const { questionarioId, categoria } = route.params

  useEffect(() => {
    carregarQuestionario()
  }, [questionarioId])

  // 🔧 CORREÇÃO: Sobrescrever o comportamento do botão de voltar
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevenir o comportamento padrão
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        
        // Navegar diretamente para HomeGestor
        navigation.navigate('HomeGestor');
      }
    });

    return unsubscribe;
  }, [navigation]);

  const carregarQuestionario = async () => {
    try {
      setCarregando(true)
      const meusQuestionarios = await StorageService.getMeusQuestionarios()
      const questionarioEncontrado = meusQuestionarios.find((q) => q.id === questionarioId)

      if (questionarioEncontrado) {
        setQuestionario(questionarioEncontrado)
      } else {
        Alert.alert("Erro", "Questionário não encontrado")
        navigation.goBack()
      }
    } catch (error) {
      console.error("Erro ao carregar questionário:", error)
      Alert.alert("Erro", "Erro ao carregar questionário")
      navigation.goBack()
    } finally {
      setCarregando(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  const handleEditar = () => {
    // Navegar para CriarQuestionario com dados do questionário para edição
    navigation.navigate("CriarQuestionarios", {
      modoEdicao: true,
      questionarioParaEditar: questionario,
      categoria: questionario.categoria,
      categoriaPreSelecionada: questionario.categoria,
    })
  }

  const handleExcluir = () => {
    setShowDeleteModal(true)
  }

  const confirmarExclusao = async () => {
    try {
      setExcluindo(true)

      // Implementar exclusão real no StorageService
      const resultado = await StorageService.excluirQuestionario(questionarioId)

      if (resultado.sucesso) {
        setShowDeleteModal(false)
        
        // 🔧 CORREÇÃO: Navegar imediatamente para MeusQuestionarios com toast
        navigation.navigate("MeusQuestionarios", {
          categoria: categoria,
          questionarioExcluido: true,
          showDeleteToast: true,
          mensagemToast: "Questionário excluído com sucesso!"
        });
        
      } else {
        Alert.alert("Erro", resultado.erro || "Erro ao excluir questionário")
      }
    } catch (error) {
      console.error("Erro ao excluir questionário:", error)
      Alert.alert("Erro", "Erro interno ao excluir questionário")
    } finally {
      setExcluindo(false)
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

  if (!questionario) {
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
          {/* 🔧 CORREÇÃO: Modificar o Header para voltar direto para HomeGestor */}
          <Header 
            navigation={navigation} 
            customBackAction={() => navigation.navigate('HomeGestor')}
          />

          {/* Título do questionário */}
          <View style={styles.headerContainer}>
            <Text style={styles.questionarioTitulo}>{questionario.titulo}</Text>
            <Text style={styles.questionarioCategoria}>{questionario.categoria}</Text>

            {/* Botões de ação */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.editarButton} onPress={handleEditar}>
                <Feather name="edit-2" size={18} color="#4A6572" />
                <Text style={styles.editarButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.excluirButton} onPress={handleExcluir}>
                <Feather name="trash-2" size={18} color="#EF4444" />
                <Text style={styles.excluirButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Perguntas do questionário */}
          {questionario.perguntas?.map((pergunta, index) => (
            <View key={pergunta.id || index} style={styles.perguntaContainer}>
              <Text style={styles.perguntaTitulo}>Pergunta {index + 1}</Text>
              <Text style={styles.perguntaTexto}>{pergunta.texto}</Text>

              {/* Alternativas */}
              <View style={styles.opcoesContainer}>
                {pergunta.alternativas?.map((alternativa, altIndex) => (
                  <View key={altIndex} style={styles.opcaoItem}>
                    <View style={styles.radioButton}>
                      <View style={styles.radioButtonInner} />
                    </View>
                    <Text style={styles.opcaoTexto}>{alternativa}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Total de perguntas: {questionario.perguntas?.length || 0}</Text>
            {questionario.dataCriacao && (
              <Text style={styles.infoText}>
                Criado em: {new Date(questionario.dataCriacao).toLocaleDateString("pt-BR")}
              </Text>
            )}
          </View>

          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} navigation={navigation} />
      </View>

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Feather name="trash-2" size={24} color="#EF4444" />
              <Text style={styles.modalTitle}>Excluir questionário</Text>
            </View>

            <Text style={styles.modalText}>
              Tem certeza que deseja excluir o questionário "{questionario?.titulo}"?
            </Text>
            <Text style={styles.modalSubText}>Esta ação não pode ser desfeita.</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={excluindo}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, excluindo && styles.deleteButtonDisabled]}
                onPress={confirmarExclusao}
                disabled={excluindo}
              >
                <Text style={styles.deleteButtonText}>{excluindo ? "Excluindo..." : "Excluir"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  editarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A6572",
    gap: 8,
  },
  editarButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A6572",
  },
  excluirButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF4444",
    gap: 8,
  },
  excluirButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
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
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D5DB",
  },
  opcaoTexto: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  modalText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 24,
  },
  modalSubText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  deleteButtonDisabled: {
    backgroundColor: "#FCA5A5",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
})