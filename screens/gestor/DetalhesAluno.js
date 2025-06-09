"use client"

import { useState } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import StorageService from "../../services/storage-service"

export default function DetalhesAluno() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("charts")
  const [expandedQuestionarios, setExpandedQuestionarios] = useState({})
  const [expandedFeedbacks, setExpandedFeedbacks] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para armazenar dados do aluno
  const [aluno, setAluno] = useState(null)
  const [questionariosRespondidos, setQuestionariosRespondidos] = useState([])
  const [feedbacks, setFeedbacks] = useState([])

  // Parâmetros da navegação
  const { usuarioId, nomeAluno } = route.params || {}

  // Função para debug - exibe todos os dados no AsyncStorage
  const debugAllData = async () => {
    try {
      console.log("🔍 === DEBUGGING ALL DATA ===")

      // Usar o debug do StorageService
      await StorageService.debugAsyncStorage()

      console.log("🔍 === DEBUG COMPLETE ===")
    } catch (error) {
      console.error("❌ Erro no debug:", error)
    }
  }

  // Recarregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      // Executar debug para ver todos os dados
      debugAllData().then(() => {
        // Depois carregar os dados do aluno
        carregarDadosAluno()
      })
    }, [usuarioId]),
  )

  const carregarDadosAluno = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 === CARREGANDO DADOS DO ALUNO ===")
      console.log("🔍 ID do aluno recebido:", usuarioId)
      console.log("🔍 Nome do aluno recebido:", nomeAluno)

      // 1. VERIFICAR SE ESTAMOS EM MODO GESTOR OU ALUNO
      const usuarioLogadoString = await AsyncStorage.getItem("fatec360_usuario_logado")
      if (!usuarioLogadoString) {
        throw new Error("Nenhum usuário logado encontrado")
      }

      const usuarioLogado = JSON.parse(usuarioLogadoString)
      console.log("👤 Usuário logado:", JSON.stringify(usuarioLogado, null, 2))

      // Determinar qual ID de aluno usar
      let idAlunoParaExibir
      let nomeAlunoParaExibir

      if (usuarioLogado.tipo === "gestor") {
        // Se for gestor, usar o ID do aluno passado por parâmetro
        if (!usuarioId) {
          throw new Error("ID do aluno não fornecido para o gestor")
        }
        idAlunoParaExibir = usuarioId
        nomeAlunoParaExibir = nomeAluno
        console.log("👨‍💼 Modo gestor: Exibindo dados do aluno ID:", idAlunoParaExibir)
      } else {
        // Se for aluno, usar o ID do próprio usuário logado
        idAlunoParaExibir = usuarioLogado.id
        nomeAlunoParaExibir = usuarioLogado.nome
        console.log("👨‍🎓 Modo aluno: Exibindo dados do próprio usuário ID:", idAlunoParaExibir)
      }

      // 2. BUSCAR DADOS DO ALUNO - FORÇAR ATUALIZAÇÃO
      console.log("🔄 Forçando busca atualizada dos usuários...")
      const usuarios = await StorageService.getUsuarios()
      console.log("👥 Total de alunos no sistema:", usuarios.alunos.length)

      // Buscar aluno pelo ID (convertendo para string para garantir)
      let alunoEncontrado = null
      if (usuarios && usuarios.alunos && Array.isArray(usuarios.alunos)) {
        for (const a of usuarios.alunos) {
          console.log(
            `Comparando aluno: ${a.id} (${typeof a.id}) com ${idAlunoParaExibir} (${typeof idAlunoParaExibir})`,
          )
          // Converter ambos para string para comparação segura
          if (String(a.id) === String(idAlunoParaExibir)) {
            alunoEncontrado = a
            console.log("✅ Aluno encontrado:", JSON.stringify(alunoEncontrado, null, 2))
            break
          }
        }
      }

      // Se não encontrou o aluno pelo ID, tentar pelo nome
      if (!alunoEncontrado && nomeAlunoParaExibir) {
        console.log("🔍 Tentando encontrar aluno pelo nome:", nomeAlunoParaExibir)
        alunoEncontrado = usuarios.alunos.find(
          (a) => a.nome && nomeAlunoParaExibir && a.nome.toLowerCase() === nomeAlunoParaExibir.toLowerCase(),
        )

        if (alunoEncontrado) {
          console.log("✅ Aluno encontrado pelo nome:", JSON.stringify(alunoEncontrado, null, 2))
          idAlunoParaExibir = alunoEncontrado.id
        }
      }

      // Se ainda não encontrou, usar dados básicos
      if (!alunoEncontrado) {
        console.log("⚠️ Aluno não encontrado, usando dados básicos")
        setAluno({
          nome: nomeAlunoParaExibir || "Aluno",
          curso: "Análise e Desenvolvimento de Sistemas",
          periodo: "Não informado",
          ra: "Não informado",
          email: "Não informado",
        })
      } else {
        // Usar dados do aluno encontrado - DADOS ATUALIZADOS
        console.log("✅ Usando dados do aluno encontrado")

        // Formatar o RA corretamente - usar o RA real, não o ID
        const raFormatado = alunoEncontrado.ra || `2023${String(alunoEncontrado.id).padStart(6, "0")}`

        const dadosAluno = {
          nome: alunoEncontrado.nome || "Nome não informado",
          curso: alunoEncontrado.curso || "Análise e Desenvolvimento de Sistemas",
          periodo: alunoEncontrado.periodo || "Período não informado",
          ra: raFormatado,
          email: alunoEncontrado.email || "Email não informado",
        }

        console.log("📋 Dados finais do aluno:", JSON.stringify(dadosAluno, null, 2))
        setAluno(dadosAluno)
      }

      // 🆕 3. BUSCAR TODOS OS QUESTIONÁRIOS EXISTENTES NO SISTEMA PRIMEIRO
      console.log("📋 === BUSCANDO QUESTIONÁRIOS EXISTENTES ===")
      let questionariosExistentes = []
      
      try {
        questionariosExistentes = await StorageService.getMeusQuestionarios()
        console.log("📋 Total de questionários existentes no sistema:", questionariosExistentes.length)
        console.log("📋 Lista de questionários existentes:", questionariosExistentes.map(q => ({
          id: q.id,
          titulo: q.titulo,
          categoria: q.categoria
        })))
      } catch (error) {
        console.error("❌ Erro ao buscar questionários existentes:", error)
        questionariosExistentes = []
      }

      // Criar um Set com os IDs e títulos dos questionários existentes para busca rápida
      const questionariosValidosIds = new Set()
      const questionariosValidosTitulos = new Set()
      
      questionariosExistentes.forEach(q => {
        if (q.id) questionariosValidosIds.add(String(q.id))
        if (q.titulo) questionariosValidosTitulos.add(q.titulo.toLowerCase().trim())
      })

      console.log("📋 IDs válidos:", Array.from(questionariosValidosIds))
      console.log("📋 Títulos válidos:", Array.from(questionariosValidosTitulos))

      // 4. BUSCAR QUESTIONÁRIOS RESPONDIDOS
      const respostasString = await AsyncStorage.getItem("fatec360_respostas")
      let todasRespostas = []

      if (respostasString) {
        try {
          const respostasData = JSON.parse(respostasString)
          if (Array.isArray(respostasData)) {
            todasRespostas = respostasData
          } else {
            console.log("⚠️ Formato de respostas não é um array:", respostasData)
          }
        } catch (error) {
          console.error("❌ Erro ao parsear respostas:", error)
        }
      }

      console.log("📊 Total de respostas no sistema:", todasRespostas.length)

      // Filtrar respostas do aluno específico
      const respostasDoAluno = todasRespostas.filter((resposta) => {
        const match = String(resposta.usuarioId) === String(idAlunoParaExibir)
        console.log(`Comparando resposta: ${resposta.usuarioId} com ${idAlunoParaExibir} - Match: ${match}`)
        return match
      })

      console.log("📊 Respostas do aluno:", respostasDoAluno.length)

      // 🆕 5. FILTRAR APENAS RESPOSTAS DE QUESTIONÁRIOS QUE AINDA EXISTEM
      if (respostasDoAluno.length > 0) {
        console.log("🔍 === FILTRANDO RESPOSTAS DE QUESTIONÁRIOS EXISTENTES ===")
        
        const respostasValidas = respostasDoAluno.filter((resposta) => {
          // Verificar por ID do questionário
          const idValido = resposta.questionarioId && questionariosValidosIds.has(String(resposta.questionarioId))
          
          // Verificar por título do questionário
          const tituloValido = resposta.questionarioTitulo && 
            questionariosValidosTitulos.has(resposta.questionarioTitulo.toLowerCase().trim())
          
          const questionarioExiste = idValido || tituloValido
          
          console.log(`🔍 Verificando resposta:`)
          console.log(`   - ID: ${resposta.questionarioId} (válido: ${idValido})`)
          console.log(`   - Título: "${resposta.questionarioTitulo}" (válido: ${tituloValido})`)
          console.log(`   - Questionário existe: ${questionarioExiste}`)
          
          if (!questionarioExiste) {
            console.log(`❌ REMOVENDO resposta de questionário excluído: "${resposta.questionarioTitulo}"`)
          } else {
            console.log(`✅ MANTENDO resposta de questionário existente: "${resposta.questionarioTitulo}"`)
          }
          
          return questionarioExiste
        })

        console.log(`📊 Respostas válidas (questionários existentes): ${respostasValidas.length} de ${respostasDoAluno.length}`)

        // Formatar apenas questionários válidos
        if (respostasValidas.length > 0) {
          const questionariosFormatados = respostasValidas.map((resposta) => {
            return {
              id: resposta.id,
              titulo: resposta.questionarioTitulo || "Questionário",
              categoria: resposta.categoria || "Geral",
              dataEnvio: resposta.dataEnvio,
              dataResposta: new Date(resposta.dataEnvio).toLocaleDateString("pt-BR"),
              perguntas: Array.isArray(resposta.respostas)
                ? resposta.respostas.map((r, index) => ({
                    id: index + 1,
                    pergunta: r.perguntaTexto || `Pergunta ${index + 1}`,
                    resposta: r.respostaTexto || "Sem resposta",
                    alternativas: Array.isArray(r.alternativas) ? r.alternativas : ["Opção 1", "Opção 2", "Opção 3"],
                  }))
                : [],
            }
          })

          // Ordenar do mais recente para o mais antigo
          questionariosFormatados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))

          setQuestionariosRespondidos(questionariosFormatados)
          console.log("📊 Questionários formatados (apenas existentes):", questionariosFormatados.length)
        } else {
          setQuestionariosRespondidos([])
          console.log("📊 Nenhum questionário válido encontrado - todos foram excluídos")
        }
      } else {
        setQuestionariosRespondidos([])
        console.log("📊 Nenhuma resposta encontrada para este aluno")
      }

      // 6. BUSCAR FEEDBACKS - FILTRADOS POR USUÁRIO (mantém a lógica original)
      console.log("💬 === BUSCANDO FEEDBACKS DO USUÁRIO ===")
      const feedbacksString = await AsyncStorage.getItem("feedbacks_enviados")
      let todosFeedbacks = []

      if (feedbacksString) {
        try {
          const feedbacksData = JSON.parse(feedbacksString)
          if (Array.isArray(feedbacksData)) {
            todosFeedbacks = feedbacksData
            console.log("💬 Total de feedbacks no sistema:", todosFeedbacks.length)
          }
        } catch (error) {
          console.error("❌ Erro ao parsear feedbacks:", error)
        }
      }

      // FILTRAR FEEDBACKS APENAS DO USUÁRIO ESPECÍFICO
      const feedbacksDoUsuario = todosFeedbacks.filter((feedback) => {
        const match = String(feedback.usuarioId) === String(idAlunoParaExibir)
        console.log(
          `💬 Comparando feedback: usuarioId=${feedback.usuarioId} com ${idAlunoParaExibir} - Match: ${match}`,
        )
        return match
      })

      console.log("💬 Feedbacks do usuário específico:", feedbacksDoUsuario.length)

      // Formatar feedbacks APENAS DO USUÁRIO
      if (feedbacksDoUsuario.length > 0) {
        const feedbacksFormatados = feedbacksDoUsuario.map((feedback) => {
          return {
            id: feedback.id,
            assunto: feedback.titulo || "Feedback",
            categoria: "Feedback",
            dataEnvio: feedback.dataEnvio,
            dataResposta: new Date(feedback.dataEnvio).toLocaleDateString("pt-BR"),
            texto: feedback.descricao || "Sem detalhes",
          }
        })

        // Ordenar do mais recente para o mais antigo
        feedbacksFormatados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))

        setFeedbacks(feedbacksFormatados)
        console.log("💬 Feedbacks formatados do usuário:", feedbacksFormatados.length)
      } else {
        setFeedbacks([])
        console.log("💬 Nenhum feedback encontrado para este usuário")
      }

      console.log("✅ === DADOS CARREGADOS COM SUCESSO ===")
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
      setError(error.message)

      // Definir dados básicos em caso de erro
      setAluno({
        nome: nomeAluno || "Erro ao carregar",
        curso: "Erro ao carregar",
        periodo: "Erro ao carregar",
        ra: "Erro ao carregar",
        email: "Erro ao carregar",
      })
      setQuestionariosRespondidos([])
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  const toggleQuestionario = (questionarioId) => {
    setExpandedQuestionarios((prev) => ({
      ...prev,
      [questionarioId]: !prev[questionarioId],
    }))
  }

  const toggleFeedback = (feedbackId) => {
    setExpandedFeedbacks((prev) => ({
      ...prev,
      [feedbackId]: !prev[feedbackId],
    }))
  }

  const getCategoriaColor = (categoria) => {
    const colors = {
      Estrutura: "#9C27B0",
      Professores: "#2196F3",
      Feedback: "#673AB7",
      Conteúdos: "#4A90E2",
      Estágios: "#FF6B35",
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
    }
    return icons[categoria] || "help-circle"
  }

  const totalRespostas = questionariosRespondidos.reduce((total, q) => total + q.perguntas.length, 0)

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.loadingText}>Carregando dados do aluno...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Feather name="alert-circle" size={48} color="#FF6B35" />
        <Text style={styles.errorText}>Erro: {error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Component */}
          <Header navigation={navigation} />

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Detalhes do Aluno</Text>
            <Text style={styles.subtitle}>Respostas e informações completas</Text>
          </View>

          {/* Card com informações do aluno */}
          <View style={styles.alunoCard}>
            <View style={styles.alunoHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {aluno.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </Text>
              </View>
              <View style={styles.alunoInfo}>
                <Text style={styles.alunoNome}>{aluno.nome}</Text>
                <Text style={styles.alunoCurso}>{aluno.curso}</Text>
              </View>
            </View>

            <View style={styles.alunoDetalhes}>
              <View style={styles.detalheItem}>
                <Feather name="book" size={16} color="#6B7280" />
                <Text style={styles.detalheLabel}>Período:</Text>
                <Text style={styles.detalheValor}>{aluno.periodo}</Text>
              </View>
              <View style={styles.detalheItem}>
                <Feather name="hash" size={16} color="#6B7280" />
                <Text style={styles.detalheLabel}>RA:</Text>
                <Text style={styles.detalheValor}>{aluno.ra}</Text>
              </View>
              <View style={styles.detalheItem}>
                <Feather name="mail" size={16} color="#6B7280" />
                <Text style={styles.detalheLabel}>E-mail:</Text>
                <Text style={styles.detalheValor}>{aluno.email}</Text>
              </View>
            </View>
          </View>

          {/* Estatísticas rápidas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{questionariosRespondidos.length}</Text>
              <Text style={styles.statLabel}>Questionários</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalRespostas}</Text>
              <Text style={styles.statLabel}>Respostas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{feedbacks.length}</Text>
              <Text style={styles.statLabel}>Feedbacks</Text>
            </View>
          </View>

          {/* Lista de questionários respondidos com accordion */}
          {questionariosRespondidos.length > 0 && (
            <View style={styles.questionariosContainer}>
              <Text style={styles.sectionTitle}>Questionários Respondidos</Text>

              {questionariosRespondidos.map((questionario) => (
                <View key={questionario.id} style={styles.questionarioCard}>
                  {/* Header do questionário - clicável para expandir/recolher */}
                  <TouchableOpacity
                    style={styles.questionarioHeader}
                    onPress={() => toggleQuestionario(questionario.id)}
                  >
                    <View style={styles.questionarioTitleContainer}>
                      <View style={styles.questionarioTitleRow}>
                        <Text style={styles.questionarioTitulo}>{questionario.titulo}</Text>
                        <Feather
                          name={expandedQuestionarios[questionario.id] ? "chevron-up" : "chevron-down"}
                          size={20}
                          color="#6B7280"
                        />
                      </View>
                      <View style={styles.questionarioMeta}>
                        <View
                          style={[styles.categoriaTag, { backgroundColor: getCategoriaColor(questionario.categoria) }]}
                        >
                          <Feather name={getCategoriaIcon(questionario.categoria)} size={12} color="#fff" />
                          <Text style={styles.categoriaText}>{questionario.categoria}</Text>
                        </View>
                        <Text style={styles.dataResposta}>{questionario.dataResposta}</Text>
                      </View>
                      <Text style={styles.perguntasCount}>
                        {questionario.perguntas.length} pergunta{questionario.perguntas.length !== 1 ? "s" : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Perguntas e respostas - só aparecem quando expandido */}
                  {expandedQuestionarios[questionario.id] && (
                    <View style={styles.perguntasContainer}>
                      {questionario.perguntas.map((pergunta, index) => (
                        <View key={pergunta.id} style={styles.perguntaItem}>
                          <View style={styles.perguntaHeader}>
                            <Text style={styles.perguntaNumero}>Pergunta {index + 1}</Text>
                          </View>

                          <Text style={styles.perguntaTexto}>{pergunta.pergunta}</Text>

                          <View style={styles.alternativasContainer}>
                            {pergunta.alternativas.map((alternativa, altIndex) => (
                              <View
                                key={altIndex}
                                style={[
                                  styles.alternativaItem,
                                  alternativa === pergunta.resposta && styles.alternativaSelecionada,
                                ]}
                              >
                                <View
                                  style={[
                                    styles.radioButton,
                                    alternativa === pergunta.resposta && styles.radioButtonSelecionado,
                                  ]}
                                >
                                  {alternativa === pergunta.resposta && <View style={styles.radioButtonInner} />}
                                </View>
                                <Text
                                  style={[
                                    styles.alternativaTexto,
                                    alternativa === pergunta.resposta && styles.alternativaTextoSelecionado,
                                  ]}
                                >
                                  {alternativa}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Feedbacks Dissertativos com Accordion */}
          {feedbacks.length > 0 && (
            <View style={styles.feedbacksContainer}>
              <Text style={styles.sectionTitle}>Feedbacks Enviados</Text>

              {feedbacks.map((feedback) => (
                <View key={feedback.id} style={styles.feedbackCard}>
                  {/* Header do feedback - clicável para expandir/recolher */}
                  <TouchableOpacity style={styles.feedbackHeader} onPress={() => toggleFeedback(feedback.id)}>
                    <View style={styles.feedbackTitleContainer}>
                      <View style={styles.feedbackTitleRow}>
                        <Text style={styles.feedbackAssunto}>{feedback.assunto}</Text>
                        <Feather
                          name={expandedFeedbacks[feedback.id] ? "chevron-up" : "chevron-down"}
                          size={20}
                          color="#6B7280"
                        />
                      </View>
                      <View style={styles.feedbackMeta}>
                        <View style={[styles.categoriaTag, { backgroundColor: getCategoriaColor(feedback.categoria) }]}>
                          <Feather name={getCategoriaIcon(feedback.categoria)} size={12} color="#fff" />
                          <Text style={styles.categoriaText}>{feedback.categoria}</Text>
                        </View>
                        <Text style={styles.dataResposta}>{feedback.dataResposta}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Conteúdo do feedback - só aparece quando expandido */}
                  {expandedFeedbacks[feedback.id] && (
                    <View style={styles.feedbackContent}>
                      <Text style={styles.feedbackTexto}>{feedback.texto}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Estado vazio quando não há dados REAIS */}
          {questionariosRespondidos.length === 0 && feedbacks.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color="#C5C5C5" />
              <Text style={styles.emptyStateText}>Nenhuma atividade encontrada</Text>
              <Text style={styles.emptyStateSubtext}>
                Este aluno ainda não respondeu questionários nem enviou feedbacks
              </Text>
            </View>
          )}

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

// Estilos permanecem os mesmos...
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
  errorText: {
    fontSize: 16,
    color: "#FF6B35",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#4A6572",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  alunoCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  alunoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A6572",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  alunoCurso: {
    fontSize: 14,
    color: "#6B7280",
  },
  alunoDetalhes: {
    gap: 12,
  },
  detalheItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detalheLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    minWidth: 60,
  },
  detalheValor: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A6572",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  feedbacksContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  feedbackHeader: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  feedbackTitleContainer: {
    gap: 12,
  },
  feedbackTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackAssunto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  feedbackMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feedbackContent: {
    padding: 20,
  },
  feedbackTexto: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  questionariosContainer: {
    marginBottom: 24,
  },
  questionarioCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  questionarioHeader: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  questionarioTitleContainer: {
    gap: 8,
  },
  questionarioTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionarioTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  questionarioMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  perguntasCount: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
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
  dataResposta: {
    fontSize: 14,
    color: "#6B7280",
  },
  perguntasContainer: {
    padding: 20,
    gap: 24,
  },
  perguntaItem: {
    gap: 12,
  },
  perguntaHeader: {
    marginBottom: 8,
  },
  perguntaNumero: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6572",
  },
  perguntaTexto: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  alternativasContainer: {
    gap: 8,
    marginTop: 8,
  },
  alternativaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  alternativaSelecionada: {
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
  alternativaTexto: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  alternativaTextoSelecionado: {
    color: "#374151",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginTop: 20,
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

