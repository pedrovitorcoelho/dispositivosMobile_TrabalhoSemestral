"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BottomNavigation from "../../components/BottomNavigation"

const { width } = Dimensions.get("window")

export default function PainelRespostas() {
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState("charts")
    const [selectedUserType, setSelectedUserType] = useState("Alunos")

    // Dados mockados para o gráfico
    const chartData = [
        { categoria: "Atletica", valor: 2, cor: "#4A90E2" },
        { categoria: "Caixa Norris", valor: 8, cor: "#7ED321" },
        { categoria: "Canteiros", valor: 9, cor: "#F5A623" },
        { categoria: "Coordenação", valor: 13, cor: "#FF6B35" },
        { categoria: "Equipamentos", valor: 12, cor: "#E74C3C" },
        { categoria: "Estágios", valor: 12, cor: "#E91E63" },
        { categoria: "Estrutura", valor: 14, cor: "#9C27B0" },
        { categoria: "Feedback", valor: 15, cor: "#673AB7" },
        { categoria: "Professores", valor: 17, cor: "#2196F3" },
    ]

    // Dados mockados para respostas recentes
    const respostasRecentes = [
        {
            id: 1,
            aluno: "Pedro Vieira",
            questionario: "Dúvidas sobre equipamentos",
            categoria: "Equipamentos",
            data: "26/05/2025",
        },
        {
            id: 2,
            aluno: "Maria Santos",
            questionario: "Avaliação da estrutura",
            categoria: "Estrutura",
            data: "26/05/2025",
        },
    ]

    const handleTabPress = (tab) => {
        setActiveTab(tab)
    }

    const maxValue = Math.max(...chartData.map((item) => item.valor))
    const chartHeight = 200

    // Função para truncar texto se necessário
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Título */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Painel de Respostas</Text>
                        <Text style={styles.subtitle}>Confira as respostas dos seus questionários</Text>
                    </View>

                    {/* Tabs de tipo de usuário */}
                    <View style={styles.userTypeTabs}>
                        <TouchableOpacity
                            style={[styles.userTypeTab, selectedUserType === "Alunos" && styles.userTypeTabActive]}
                            onPress={() => setSelectedUserType("Alunos")}
                        >
                            <Text style={[styles.userTypeTabText, selectedUserType === "Alunos" && styles.userTypeTabTextActive]}>
                                Alunos
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.userTypeTab, selectedUserType === "Professores" && styles.userTypeTabActive]}
                            onPress={() => setSelectedUserType("Professores")}
                        >
                            <Text
                                style={[styles.userTypeTabText, selectedUserType === "Professores" && styles.userTypeTabTextActive]}
                            >
                                Professores
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Estatística principal */}
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsLabel}>Respostas totais</Text>
                        <Text style={styles.statsNumber}>125</Text>
                    </View>

                    {/* Gráfico */}
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Distribuição das respostas por categorias</Text>

                        <View style={styles.chart}>
                            {/* Eixo Y */}
                            <View style={styles.yAxis}>
                                {[20, 15, 10, 5, 0].map((value) => (
                                    <View key={value} style={styles.yAxisItem}>
                                        <Text style={styles.yAxisText}>{value}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Área do gráfico com linhas de grade e barras */}
                            <View style={styles.chartArea}>
                                {/* Linhas de grade horizontais */}
                                <View style={styles.gridLinesContainer}>
                                    {[20, 15, 10, 5, 0].map((value) => (
                                        <View key={value} style={styles.gridLineHorizontal} />
                                    ))}
                                </View>

                                {/* Barras */}
                                <View style={styles.barsContainer}>
                                    {chartData.map((item, index) => {
                                        const barHeight = (item.valor / maxValue) * chartHeight
                                        return (
                                            <View key={index} style={styles.barContainer}>
                                                <View style={styles.barWrapper}>
                                                    <View style={[styles.bar, { height: barHeight, backgroundColor: item.cor }]} />
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>

                                {/* Labels das categorias */}
                                <View style={styles.labelsContainer}>
                                    {chartData.map((item, index) => (
                                        <View key={index} style={styles.labelContainer}>
                                            <Text style={styles.barLabel}>{item.categoria}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Respostas Recentes */}
                    <View style={styles.recentContainer}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>Respostas Recentes</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("ListaRespostas")}>
                                <Text style={styles.verTodosText}>Ver todos</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cabeçalho da tabela */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, styles.alunoColumn]}>Aluno</Text>
                            <Text style={[styles.tableHeaderText, styles.questionarioColumn]}>Questionário</Text>
                            <Text style={[styles.tableHeaderText, styles.categoriaColumn]}>Categoria</Text>
                            <Text style={[styles.tableHeaderText, styles.dataColumn]}>Data</Text>
                        </View>

                        {/* Linhas da tabela */}
                        {respostasRecentes.map((resposta) => (
                            <TouchableOpacity key={resposta.id} style={styles.tableRow}>
                                <Text style={[styles.tableRowText, styles.alunoColumn]} numberOfLines={1}>
                                    {truncateText(resposta.aluno, 12)}
                                </Text>
                                <Text style={[styles.tableRowText, styles.questionarioColumn]} numberOfLines={1}>
                                    {truncateText(resposta.questionario, 15)}
                                </Text>
                                <Text style={[styles.tableRowText, styles.categoriaColumn]} numberOfLines={1}>
                                    {truncateText(resposta.categoria, 12)}
                                </Text>
                                <Text style={[styles.tableRowText, styles.dataColumn]}>{resposta.data}</Text>
                            </TouchableOpacity>
                        ))}
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
    userTypeTabs: {
        flexDirection: "row",
        marginBottom: 32,
    },
    userTypeTab: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: "#F3F4F6",
    },
    userTypeTabActive: {
        backgroundColor: "#4A6572",
    },
    userTypeTabText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#6B7280",
    },
    userTypeTabTextActive: {
        color: "#FFFFFF",
    },
    statsContainer: {
        marginBottom: 32,
    },
    statsLabel: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 4,
    },
    statsNumber: {
        fontSize: 32,
        fontWeight: "600",
        color: "#374151",
    },
    chartContainer: {
        marginBottom: 32,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 24,
    },
    chart: {
        flexDirection: "row",
        height: 320, // Aumentado para acomodar labels
    },
    yAxis: {
        width: 30,
        height: 200,
        justifyContent: "space-between",
        paddingRight: 8,
    },
    yAxisItem: {
        height: 40,
        justifyContent: "center",
    },
    yAxisText: {
        fontSize: 12,
        color: "#6B7280",
        textAlign: "right",
    },
    chartArea: {
        flex: 1,
        position: "relative",
    },
    gridLinesContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        justifyContent: "space-between",
    },
    gridLineHorizontal: {
        height: 1,
        backgroundColor: "#E5E7EB",
        width: "100%",
    },
    barsContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 200,
        paddingHorizontal: 4,
    },
    barContainer: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 1,
    },
    barWrapper: {
        height: 200,
        justifyContent: "flex-end",
        width: "80%",
    },
    bar: {
        width: "100%",
        borderRadius: 2,
        minHeight: 2,
    },
    labelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginTop: 40, // Espaço maior para separar das barras
    },
    labelContainer: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 1,
    },
    barLabel: {
        fontSize: 10,
        color: "#6B7280",
        textAlign: "center",
        transform: [{ rotate: "-45deg" }],
        width: 100,
    },
    recentContainer: {
        marginBottom: 24,
    },
    recentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
    },
    verTodosText: {
        fontSize: 13,
        fontWeight: "400",
        color: "#2563eb",
    },
    tableHeader: {
        flexDirection: "row",
        paddingVertical: 12,
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
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    tableRowText: {
        fontSize: 14,
        color: "#6B7280",
    },
    alunoColumn: {
        flex: 1,
    },
    questionarioColumn: {
        flex: 1.2,
    },
    categoriaColumn: {
        flex: 1,
    },
    dataColumn: {
        flex: 1,
    },
    bottomNavContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
    },
})
