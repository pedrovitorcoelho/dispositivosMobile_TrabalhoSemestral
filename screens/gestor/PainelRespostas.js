"use client"

import React from "react"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigation from "../../components/BottomNavigation"
import StorageService from "../../services/storage-service"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function PainelRespostas() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("charts")
  const [totalRespostas, setTotalRespostas] = useState(0)
  const [respostasRecentes, setRespostasRecentes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  // Definir as 5 categorias principais (incluindo Feedback)
  const categoriasBase = [
    { nome: "Conteúdos", icon: "file-text", cor: "#4A6572" },
    { nome: "Professores", icon: "users", cor: "#4A6572" },
    { nome: "Estrutura", icon: "grid", cor: "#4A6572" },
    { nome: "Estágios", icon: "briefcase", cor: "#4A6572" },
    { nome: "Feedback", icon: "message-circle", cor: "#4A6572" },
  ]

  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, []),
  )

  useEffect(() => {
    carregarDados()
  }, [])

  // Função para buscar feedbacks do AsyncStorage
  const buscarFeedbacks = async () => {
    try {
      const feedbacksString = await AsyncStorage.getItem("feedbacks_enviados")
      const feedbacks = feedbacksString ? JSON.parse(feedbacksString) : []

      console.log("📝 Feedbacks encontrados:", feedbacks.length)

      // Filtrar apenas feedbacks que têm usuarioId válido
      const feedbacksValidos = feedbacks.filter((feedback) => {
        return feedback.usuarioId && feedback.usuarioId !== null
      })

      console.log("📝 Feedbacks válidos (com usuarioId):", feedbacksValidos.length)

      return feedbacksValidos.map((feedback) => ({
        id: feedback.id,
        tipo: "feedback",
        categoria: "Feedback",
        titulo: feedback.titulo,
        descricao: feedback.descricao,
        dataEnvio: feedback.dataEnvio,
        remetente: feedback.remetente || "aluno",
        nomeUsuario: feedback.nomeUsuario || "Aluno",
        usuarioId: feedback.usuarioId, // Agora sempre terá um ID válido
      }))
    } catch (error) {
      console.error("❌ Erro ao buscar feedbacks:", error)
      return []
    }
  }

  // Função para verificar se um item tem um usuário válido
  const temUsuarioValido = (item) => {
    // Verificar se o usuarioId existe e não é um ID fictício
    if (!item.usuarioId) return false

    const usuarioIdString = String(item.usuarioId || "")
    return usuarioIdString && !usuarioIdString.startsWith("aluno_")
  }

  // Função para buscar nome atualizado do usuário
  const buscarNomeAtualizadoUsuario = async (usuarioId) => {
    try {
      const usuarios = await StorageService.getUsuarios()
      const aluno = usuarios.alunos.find((a) => String(a.id) === String(usuarioId))
      return aluno ? aluno.nome : null
    } catch (error) {
      console.error("❌ Erro ao buscar nome do usuário:", error)
      return null
    }
  }

  const carregarDados = async () => {
    try {
      console.log("🔄 Carregando dados do painel...")

      // Buscar todas as respostas de questionários
      const todasRespostas = await StorageService.getTodasRespostas()
      console.log("📊 Total de respostas de questionários:", todasRespostas.length)

      // Buscar todos os feedbacks
      const todosFeedbacks = await buscarFeedbacks()
      console.log("📝 Total de feedbacks:", todosFeedbacks.length)

      // Combinar respostas e feedbacks
      const todosItens = [...todasRespostas, ...todosFeedbacks]

      // Atualizar total de respostas (questionários + feedbacks)
      setTotalRespostas(todosItens.length)

      // Calcular respostas por categoria
      const respostasPorCategoria = {}

      // Contar respostas de questionários
      todasRespostas.forEach((resposta) => {
        const categoria = resposta.categoria
        if (!respostasPorCategoria[categoria]) {
          respostasPorCategoria[categoria] = 0
        }
        respostasPorCategoria[categoria]++
      })

      // Contar feedbacks
      respostasPorCategoria["Feedback"] = todosFeedbacks.length

      // Preparar dados das categorias
      const categoriasComDados = categoriasBase.map((categoria) => ({
        ...categoria,
        quantidade: respostasPorCategoria[categoria.nome] || 0,
      }))

      setCategorias(categoriasComDados)

      // NOVA LÓGICA: Ordenar todos os itens por data (mais recentes primeiro)
      const itensOrdenados = todosItens.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))

      // Filtrar apenas itens com usuários válidos para exibição
      const itensValidos = itensOrdenados.filter((item) => {
        // Para questionários, verificar se tem usuário válido
        if (item.questionarioTitulo !== undefined) {
          return temUsuarioValido(item)
        }
        // Para feedbacks, agora também mostrar na lista de recentes
        if (item.tipo === "feedback") {
          return temUsuarioValido(item)
        }
        return false
      })

      // Pegar apenas os 3 primeiros (mais recentes)
      const recentes = itensValidos.slice(0, 3)

      // BUSCAR NOMES ATUALIZADOS DOS USUÁRIOS
      console.log("🔄 Buscando nomes atualizados dos usuários...")
      const recentesComNomesAtualizados = await Promise.all(
        recentes.map(async (item) => {
          const nomeAtualizado = await buscarNomeAtualizadoUsuario(item.usuarioId)
          return {
            ...item,
            nomeUsuario: nomeAtualizado || item.nomeUsuario || "Aluno",
          }
        }),
      )

      // Preparar dados para exibição
      const recentesFormatados = recentesComNomesAtualizados.map((item) => {
        const isQuestionario = item.questionarioTitulo !== undefined

        return {
          id: item.id,
          usuarioId: item.usuarioId,
          aluno: item.nomeUsuario || "Aluno",
          questionario: isQuestionario ? item.questionarioTitulo : item.titulo,
          categoria: item.categoria,
          data: new Date(item.dataEnvio).toLocaleDateString("pt-BR"),
          hora: new Date(item.dataEnvio).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          tipo: isQuestionario ? "questionario" : "feedback",
          respostaCompleta: item,
        }
      })

      setRespostasRecentes(recentesFormatados)

      console.log("✅ Dados carregados com sucesso!")
      console.log("📊 Total geral:", todosItens.length)
      console.log("📋 Recentes exibidos:", recentesFormatados.length)
      console.log(
        "👥 Nomes atualizados:",
        recentesFormatados.map((r) => r.aluno),
      )
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
      // Dados de fallback
      setCategorias(categoriasBase.map((cat) => ({ ...cat, quantidade: 0 })))
      setRespostasRecentes([])
      setTotalRespostas(0)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await carregarDados()
    setRefreshing(false)
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  // Função para navegar para detalhes - SEMPRE para DetalhesAluno
  const navegarParaDetalhes = (item) => {
    // Verificar se o ID do usuário é válido
    const usuarioIdString = String(item.usuarioId || "")
    const usuarioId = usuarioIdString && !usuarioIdString.startsWith("aluno_") ? item.usuarioId : null

    console.log(`🔍 Navegando para DetalhesAluno com usuarioId: ${usuarioId}, nome: ${item.aluno}`)

    navigation.navigate("DetalhesAluno", {
      usuarioId: usuarioId,
      nomeAluno: item.aluno,
      respostaDestaque: item.respostaCompleta,
      tipoDestaque: item.tipo,
    })
  }

  // Função para truncar texto se necessário
  const truncateText = (text, maxLength) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Painel de Respostas</Text>
              <Text style={styles.subtitle}>Confira as respostas dos seus questionários</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Feather name="refresh-cw" size={20} color="#4A6572" />
            </TouchableOpacity>
          </View>

          {/* Estatística principal */}
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Total de respostas</Text>
            <Text style={styles.statsNumber}>{totalRespostas}</Text>
            <Text style={styles.statsSubtext}>questionários e feedbacks recebidos</Text>
          </View>

          {/* Cards das categorias - CARROSSEL HORIZONTAL */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Respostas por categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriasCarrossel}
            >
              {categorias.map((categoria, index) => (
                <TouchableOpacity key={index} style={styles.categoriaCardCarrossel}>
                  <View style={styles.categoriaIconContainer}>
                    <Feather name={categoria.icon} size={20} color="#3C4A5D" />
                  </View>
                  <Text style={styles.categoriaQuantidadeCarrossel}>{categoria.quantidade}</Text>
                  <Text style={styles.categoriaNomeCarrossel}>{categoria.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Respostas Recentes */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Respostas recentes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ListaRespostas")}>
                <Text style={styles.verTodosText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {respostasRecentes.length > 0 ? (
              respostasRecentes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.respostaCard}
                  onPress={() => navegarParaDetalhes(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.respostaInfo}>
                    <Text style={styles.respostaAluno}>{item.aluno}</Text>
                    <Text style={styles.respostaQuestionario}>{truncateText(item.questionario, 40)}</Text>
                    <View style={styles.respostaFooter}>
                      <Text style={styles.respostaCategoria}>{item.categoria}</Text>
                      <Text style={styles.respostaData}>
                        {item.data} às {item.hora}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    <Feather name="chevron-right" size={20} color="#C5C5C5" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={48} color="#C5C5C5" />
                <Text style={styles.emptyStateText}>Nenhuma resposta recente</Text>
                <Text style={styles.emptyStateSubtext}>As respostas mais recentes aparecerão aqui</Text>
              </View>
            )}
          </View>

          {/* Spacer para bottom navigation */}
          <View style={{ height: 76 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} navigation={navigation} />
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
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#3C4A5D",
    opacity: 0.8,
  },
  refreshButton: {
    padding: 6,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 20, // Aumentei a margem aqui
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  verTodosText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#2563eb",
  },
  // NOVOS ESTILOS PARA CARROSSEL
  categoriasCarrossel: {
    paddingHorizontal: 0,
    gap: 12,
  },
  categoriaCardCarrossel: {
    width: 80, // Menor que antes
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12, // Menor padding
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  categoriaIconContainer: {
    marginBottom: 8, // Menor margem
  },
  categoriaQuantidadeCarrossel: {
    fontSize: 18, // Menor fonte
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 4,
  },
  categoriaNomeCarrossel: {
    fontSize: 10, // Menor fonte
    color: "#3C4A5D",
    textAlign: "center",
  },
  respostaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  respostaInfo: {
    flex: 1,
  },
  respostaAluno: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3C4A5D",
    marginBottom: 4,
  },
  respostaQuestionario: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  respostaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  respostaCategoria: {
    fontSize: 12,
    color: "#4A6572",
    fontWeight: "500",
  },
  respostaData: {
    fontSize: 12,
    color: "#6B7280",
  },
  chevronContainer: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
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
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
