"use client"

import { useState } from "react"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"

export default function DetalhesAluno() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("charts")
  const [expandedQuestionarios, setExpandedQuestionarios] = useState({})
  const [expandedFeedbacks, setExpandedFeedbacks] = useState({})

  // Dados do aluno (normalmente viriam dos parâmetros da rota)
  const aluno = {
    nome: "Pedro Vieira Santos",
    curso: "Análise e Desenvolvimento de Sistemas",
    periodo: "4º Semestre",
    ra: "2021001234",
    email: "pedro.vieira@fatec.sp.gov.br",
  }

  // Dados mockados dos questionários respondidos pelo aluno
  const questionariosRespondidos = [
    {
      id: 1,
      titulo: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      dataResposta: "26/05/2025",
      perguntas: [
        {
          id: 1,
          pergunta: "Como você avalia a qualidade dos computadores do laboratório?",
          resposta: "Ruim",
          alternativas: ["Excelente", "Bom", "Regular", "Ruim"],
        },
        {
          id: 2,
          pergunta: "Os equipamentos atendem às necessidades das aulas práticas?",
          resposta: "Não",
          alternativas: ["Sim", "Não", "Parcialmente"],
        },
        {
          id: 3,
          pergunta: "Qual equipamento você considera mais defasado?",
          resposta: "Computadores",
          alternativas: ["Computadores", "Projetores", "Impressoras", "Rede"],
        },
      ],
    },
    {
      id: 2,
      titulo: "Avaliação da estrutura física",
      categoria: "Estrutura",
      dataResposta: "25/05/2025",
      perguntas: [
        {
          id: 1,
          pergunta: "Como você avalia a limpeza das salas de aula?",
          resposta: "Bom",
          alternativas: ["Excelente", "Bom", "Regular", "Ruim"],
        },
        {
          id: 2,
          pergunta: "A iluminação das salas é adequada?",
          resposta: "Sim",
          alternativas: ["Sim", "Não", "Às vezes"],
        },
        {
          id: 3,
          pergunta: "O que mais precisa melhorar na estrutura?",
          resposta: "Ar condicionado",
          alternativas: ["Ar condicionado", "Mobiliário", "Pintura", "Banheiros"],
        },
      ],
    },
  ]

  // Feedbacks dissertativos (respostas livres do aluno)
  const feedbacks = [
    {
      id: 1,
      assunto: "Problemas com a internet",
      categoria: "FeedBack",
      dataResposta: "24/05/2025",
      texto:
        "Gostaria de relatar que a internet da faculdade tem apresentado muitas instabilidades durante as aulas. Isso tem prejudicado bastante as atividades práticas, especialmente quando precisamos acessar plataformas online ou fazer pesquisas. Seria possível verificar e melhorar a qualidade da conexão? Obrigado pela atenção.",
    },
    {
      id: 2,
      assunto: "Sugestão para biblioteca",
      categoria: "FeedBack",
      dataResposta: "23/05/2025",
      texto:
        "Tenho uma sugestão para melhorar a biblioteca: seria interessante ter mais pontos de energia para carregar notebooks e celulares. Muitas vezes precisamos estudar por longos períodos e os dispositivos descarregam. Também seria legal ter um espaço específico para estudos em grupo, pois às vezes precisamos discutir projetos mas não queremos atrapalhar quem está estudando individualmente.",
    },
  ]

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
      Equipamentos: "#E74C3C",
      Estrutura: "#9C27B0",
      Professores: "#2196F3",
      FeedBack: "#673AB7",
    }
    return colors[categoria] || "#6B7280"
  }

  const getCategoriaIcon = (categoria) => {
    const icons = {
      Equipamentos: "monitor",
      Estrutura: "grid",
      Professores: "users",
      FeedBack: "message-circle",
    }
    return icons[categoria] || "help-circle"
  }

  const totalRespostas = questionariosRespondidos.reduce((total, q) => total + q.perguntas.length, 0)
  const totalCategorias = new Set([
    ...questionariosRespondidos.map((q) => q.categoria),
    ...feedbacks.map((f) => f.categoria),
  ]).size

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
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
})
