"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"

const { width } = Dimensions.get("window")

export default function ListaRespostas() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("charts")

  // Dados mockados para as respostas com a nova coluna Curso
  const respostas = [
    {
      id: 1,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "ADS",
      data: "26/05/2025",
    },
    {
      id: 2,
      aluno: "Pedro Vieira",
      questionario: "Falta de computadores",
      categoria: "FeedBack",
      curso: "Comércio Exterior",
      data: "26/05/2025",
    },
    {
      id: 3,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "Gestão Empresarial",
      data: "26/05/2025",
    },
    {
      id: 4,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "DSM",
      data: "26/05/2025",
    },
    {
      id: 5,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "ADS",
      data: "26/05/2025",
    },
    {
      id: 6,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "Comércio Exterior",
      data: "26/05/2025",
    },
    {
      id: 7,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "Gestão Empresarial",
      data: "26/05/2025",
    },
    {
      id: 8,
      aluno: "Pedro Vieira",
      questionario: "Dúvidas sobre equipamentos",
      categoria: "Equipamentos",
      curso: "DSM",
      data: "26/05/2025",
    },
  ]

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  // Função para truncar texto se necessário
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Component */}
          <Header navigation={navigation} />

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Respostas dos Questionários</Text>
            <Text style={styles.subtitle}>Todas as respostas dos alunos</Text>
          </View>

          {/* Tabela com scroll horizontal */}
          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
              <View style={styles.table}>
                {/* Cabeçalho da tabela */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.alunoColumn]}>Aluno</Text>
                  <Text style={[styles.tableHeaderText, styles.questionarioColumn]}>Questionário</Text>
                  <Text style={[styles.tableHeaderText, styles.categoriaColumn]}>Categoria</Text>
                  <Text style={[styles.tableHeaderText, styles.cursoColumn]}>Curso</Text>
                  <Text style={[styles.tableHeaderText, styles.dataColumn]}>Data</Text>
                </View>

                {/* Linhas da tabela */}
                {respostas.map((resposta) => (
                  <TouchableOpacity
                    key={resposta.id}
                    style={styles.tableRow}
                    onPress={() =>
                      navigation.navigate("DetalhesAluno", { alunoId: resposta.id, alunoNome: resposta.aluno })
                    }
                  >
                    <Text style={[styles.tableRowText, styles.alunoColumn]} numberOfLines={1}>
                      {truncateText(resposta.aluno, 10)}
                    </Text>
                    <Text style={[styles.tableRowText, styles.questionarioColumn]} numberOfLines={1}>
                      {truncateText(resposta.questionario, 12)}
                    </Text>
                    <Text style={[styles.tableRowText, styles.categoriaColumn]} numberOfLines={1}>
                      {truncateText(resposta.categoria, 10)}
                    </Text>
                    <Text style={[styles.tableRowText, styles.cursoColumn]} numberOfLines={1}>
                      {truncateText(resposta.curso, 8)}
                    </Text>
                    <Text style={[styles.tableRowText, styles.dataColumn]}>{resposta.data}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Botão Exportar */}
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Exportar lista de respostas</Text>
          </TouchableOpacity>

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
    marginBottom: 32,
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
  tableContainer: {
    marginBottom: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  horizontalScroll: {
    flex: 1,
  },
  table: {
    minWidth: width * 1.5, // Garante que a tabela seja maior que a tela
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowText: {
    fontSize: 14,
    color: "#6B7280",
  },
  // Definindo larguras fixas para cada coluna
  alunoColumn: {
    width: 100,
    marginRight: 16,
  },
  questionarioColumn: {
    width: 140,
    marginRight: 16,
  },
  categoriaColumn: {
    width: 110,
    marginRight: 16,
  },
  cursoColumn: {
    width: 120,
    marginRight: 16,
  },
  dataColumn: {
    width: 100,
  },
  exportButton: {
    backgroundColor: "#4A6572",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  exportButtonText: {
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
  },
})
