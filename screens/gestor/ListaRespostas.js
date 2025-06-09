"use client"

import React, { useState } from "react"
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"
import AsyncStorage from "@react-native-async-storage/async-storage"
import StorageService from "../../services/storage-service"

export default function PainelRespostas() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("charts")
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filtroAtivo, setFiltroAtivo] = useState("todos") // todos, questionarios, feedbacks
  const [expandedItems, setExpandedItems] = useState({})
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false)

  // Estados para dados
  const [questionariosRespondidos, setQuestionariosRespondidos] = useState([])
  const [feedbacksEnviados, setFeedbacksEnviados] = useState([])
  const [usuarios, setUsuarios] = useState([])

  // Carregar dados quando a tela é focada
  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, []),
  )

  const carregarDados = async () => {
    try {
      setLoading(true)
      console.log("🔄 === CARREGANDO DADOS DO PAINEL ===")

      // 1. CARREGAR USUÁRIOS PARA MAPEAR NOMES
      const usuariosData = await StorageService.getUsuarios()
      setUsuarios(usuariosData.alunos || [])

      // 2. CARREGAR QUESTIONÁRIOS RESPONDIDOS
      const respostasString = await AsyncStorage.getItem("fatec360_respostas")
      let todasRespostas = []
      
      if (respostasString) {
        try {
          const respostasData = JSON.parse(respostasString)
          if (Array.isArray(respostasData)) {
            todasRespostas = respostasData
          }
        } catch (error) {
          console.error("❌ Erro ao parsear respostas:", error)
        }
      }

      // Formatar questionários respondidos
      const questionariosFormatados = todasRespostas.map((resposta) => {
        const usuario = usuariosData.alunos.find(u => String(u.id) === String(resposta.usuarioId))
        
        return {
          id: resposta.id,
          tipo: "questionario",
          titulo: resposta.questionarioTitulo || "Questionário",
          categoria: resposta.categoria || "Geral",
          dataEnvio: resposta.dataEnvio,
          dataFormatada: new Date(resposta.dataEnvio).toLocaleDateString("pt-BR"),
          horaFormatada: new Date(resposta.dataEnvio).toLocaleTimeString("pt-BR", { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          nomeUsuario: usuario?.nome || "Usuário não encontrado",
          usuarioId: resposta.usuarioId,
          totalPerguntas: Array.isArray(resposta.respostas) ? resposta.respostas.length : 0,
          respostas: resposta.respostas || []
        }
      })

      // Ordenar por data (mais recente primeiro)
      questionariosFormatados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
      setQuestionariosRespondidos(questionariosFormatados)

      // 3. CARREGAR FEEDBACKS ENVIADOS
      const feedbacksString = await AsyncStorage.getItem("feedbacks_enviados")
      let todosFeedbacks = []
      
      if (feedbacksString) {
        try {
          const feedbacksData = JSON.parse(feedbacksString)
          if (Array.isArray(feedbacksData)) {
            todosFeedbacks = feedbacksData
          }
        } catch (error) {
          console.error("❌ Erro ao parsear feedbacks:", error)
        }
      }

      // Formatar feedbacks
      const feedbacksFormatados = todosFeedbacks.map((feedback) => {
        const usuario = usuariosData.alunos.find(u => String(u.id) === String(feedback.usuarioId))
        
        return {
          id: feedback.id,
          tipo: "feedback",
          titulo: feedback.titulo || "Feedback",
          categoria: "Feedback",
          dataEnvio: feedback.dataEnvio,
          dataFormatada: new Date(feedback.dataEnvio).toLocaleDateString("pt-BR"),
          horaFormatada: new Date(feedback.dataEnvio).toLocaleTimeString("pt-BR", { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          nomeUsuario: usuario?.nome || feedback.nomeUsuario || "Usuário não encontrado",
          usuarioId: feedback.usuarioId,
          descricao: feedback.descricao || "Sem descrição"
        }
      })

      // Ordenar por data (mais recente primeiro)
      feedbacksFormatados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
      setFeedbacksEnviados(feedbacksFormatados)

      console.log("✅ Dados carregados:", {
        questionarios: questionariosFormatados.length,
        feedbacks: feedbacksFormatados.length
      })

    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Função para filtrar e buscar dados
  const getDadosFiltrados = () => {
    let dados = []
    
    // Combinar dados baseado no filtro
    if (filtroAtivo === "todos") {
      dados = [...questionariosRespondidos, ...feedbacksEnviados]
    } else if (filtroAtivo === "questionarios") {
      dados = questionariosRespondidos
    } else if (filtroAtivo === "feedbacks") {
      dados = feedbacksEnviados
    }

    // Aplicar busca por texto
    if (searchText.trim()) {
      dados = dados.filter(item => 
        item.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.nomeUsuario.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // Ordenar por data (mais recente primeiro)
    dados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))

    return dados
  }

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const navegarParaDetalhesAluno = (item) => {
    navigation.navigate("DetalhesAluno", {
      usuarioId: item.usuarioId,
      nomeAluno: item.nomeUsuario
    })
  }

  const getCategoriaColor = (categoria) => {
    const colors = {
      Estrutura: "#9C27B0",
      Professores: "#2196F3",
      Feedback: "#673AB7",
      Conteúdos: "#4A90E2",
      Estágios: "#FF6B35",
      Geral: "#6B7280"
    }
    return colors[categoria] || "#6B7280"
  }

  const getCategoriaIcon = (categoria) => {
    const icons = {
      Estrutura: "grid",
      Professores: "users",
      Feedback: "message-circle",
      Conteúdos: "file-text",
      Estágios: "briefcase",
      Geral: "help-circle"
    }
    return icons[categoria] || "help-circle"
  }

  const getContadorFiltro = (filtro) => {
    if (filtro === "questionarios") return questionariosRespondidos.length
    if (filtro === "feedbacks") return feedbacksEnviados.length
    return questionariosRespondidos.length + feedbacksEnviados.length
  }

  const dadosFiltrados = getDadosFiltrados()

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Header navigation={navigation} />

          {/* Título e estatísticas */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Total de Respostas</Text>
            <Text style={styles.subtitle}>
              {dadosFiltrados.length} {dadosFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </Text>
          </View>

          {/* Barra de busca */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por título, aluno ou categoria..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Feather name="x" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filtros */}
          <View style={styles.filtrosContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.filtroButton, filtroAtivo === "todos" && styles.filtroButtonActive]}
                onPress={() => setFiltroAtivo("todos")}
              >
                <Text style={[styles.filtroText, filtroAtivo === "todos" && styles.filtroTextActive]}>
                  Todos ({getContadorFiltro("todos")})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filtroButton, filtroAtivo === "questionarios" && styles.filtroButtonActive]}
                onPress={() => setFiltroAtivo("questionarios")}
              >
                <Text style={[styles.filtroText, filtroAtivo === "questionarios" && styles.filtroTextActive]}>
                  Questionários ({getContadorFiltro("questionarios")})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filtroButton, filtroAtivo === "feedbacks" && styles.filtroButtonActive]}
                onPress={() => setFiltroAtivo("feedbacks")}
              >
                <Text style={[styles.filtroText, filtroAtivo === "feedbacks" && styles.filtroTextActive]}>
                  Feedbacks ({getContadorFiltro("feedbacks")})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Lista de itens */}
          {dadosFiltrados.length > 0 ? (
            <View style={styles.listaContainer}>
              {dadosFiltrados.map((item) => (
                <View key={`${item.tipo}-${item.id}`} style={styles.itemCard}>
                  {/* Header do item */}
                  <TouchableOpacity
                    style={styles.itemHeader}
                    onPress={() => toggleExpanded(`${item.tipo}-${item.id}`)}
                  >
                    <View style={styles.itemHeaderLeft}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitulo}>{item.titulo}</Text>
                        <View style={[styles.tipoTag, { 
                          backgroundColor: item.tipo === "questionario" ? "#EBF8FF" : "#F3E8FF" 
                        }]}>
                          <Feather 
                            name={item.tipo === "questionario" ? "file-text" : "message-circle"} 
                            size={12} 
                            color={item.tipo === "questionario" ? "#2563EB" : "#7C3AED"} 
                          />
                          <Text style={[styles.tipoText, { 
                            color: item.tipo === "questionario" ? "#2563EB" : "#7C3AED" 
                          }]}>
                            {item.tipo === "questionario" ? "Questionário" : "Feedback"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.itemMeta}>
                        <View style={[styles.categoriaTag, { backgroundColor: getCategoriaColor(item.categoria) }]}>
                          <Feather name={getCategoriaIcon(item.categoria)} size={12} color="#fff" />
                          <Text style={styles.categoriaText}>{item.categoria}</Text>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.usuarioInfo}
                          onPress={() => navegarParaDetalhesAluno(item)}
                        >
                          <Feather name="user" size={14} color="#6B7280" />
                          <Text style={styles.usuarioNome}>{item.nomeUsuario}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.itemDataInfo}>
                        <Text style={styles.itemData}>{item.dataFormatada} às {item.horaFormatada}</Text>
                        {item.tipo === "questionario" && (
                          <Text style={styles.itemDetalhes}>
                            {item.totalPerguntas} pergunta{item.totalPerguntas !== 1 ? 's' : ''} respondida{item.totalPerguntas !== 1 ? 's' : ''}
                          </Text>
                        )}
                      </View>
                    </View>

                    <Feather
                      name={expandedItems[`${item.tipo}-${item.id}`] ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>

                  {/* Conteúdo expandido */}
                  {expandedItems[`${item.tipo}-${item.id}`] && (
                    <View style={styles.itemContent}>
                      {item.tipo === "questionario" ? (
                        <View style={styles.questionarioContent}>
                          <Text style={styles.contentTitle}>Respostas:</Text>
                          {item.respostas.map((resposta, index) => (
                            <View key={index} style={styles.respostaItem}>
                              <Text style={styles.perguntaTexto}>
                                {index + 1}. {resposta.perguntaTexto}
                              </Text>
                              <Text style={styles.respostaTexto}>
                                ✓ {resposta.respostaTexto}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View style={styles.feedbackContent}>
                          <Text style={styles.contentTitle}>Descrição:</Text>
                          <Text style={styles.feedbackTexto}>{item.descricao}</Text>
                        </View>
                      )}

                      <TouchableOpacity
                        style={styles.verDetalhesButton}
                        onPress={() => navegarParaDetalhesAluno(item)}
                      >
                        <Feather name="external-link" size={16} color="#4A6572" />
                        <Text style={styles.verDetalhesText}>Ver perfil do aluno</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color="#C5C5C5" />
              <Text style={styles.emptyStateText}>Nenhum resultado encontrado</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchText ? 
                  "Tente ajustar sua busca ou filtros" : 
                  "Ainda não há questionários respondidos ou feedbacks enviados"
                }
              </Text>
            </View>
          )}

          {/* Spacer para bottom navigation */}
          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={(tab) => setActiveTab(tab)} navigation={navigation} />
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
  titleContainer: {
    marginBottom: 24,
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
  },
  filtrosContainer: {
    marginBottom: 24,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  filtroButtonActive: {
    backgroundColor: "#4A6572",
    borderColor: "#4A6572",
  },
  filtroText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filtroTextActive: {
    color: "#fff",
  },
  listaContainer: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  itemHeaderLeft: {
    flex: 1,
    gap: 12,
  },
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  tipoTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tipoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoriaTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  usuarioInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  usuarioNome: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  itemDataInfo: {
    gap: 4,
  },
  itemData: {
    fontSize: 14,
    color: "#6B7280",
  },
  itemDetalhes: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  itemContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  questionarioContent: {
    gap: 16,
  },
  respostaItem: {
    gap: 8,
  },
  perguntaTexto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  respostaTexto: {
    fontSize: 14,
    color: "#6B7280",
    paddingLeft: 16,
  },
  feedbackContent: {
    gap: 12,
  },
  feedbackTexto: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  verDetalhesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  verDetalhesText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A6572",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3C4A5D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
})

