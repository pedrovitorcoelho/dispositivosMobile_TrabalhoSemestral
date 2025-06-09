"use client"

import { useState, useRef, useEffect } from "react"
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
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import BottomNavigation from "../../components/BottomNavigation"
import Header from "../../components/Header"
import StorageService from "../../services/storage-service"
import React from "react"

// Get screen dimensions
const { width, height } = Dimensions.get("window")

export default function CriarQuestionario() {
  const navigation = useNavigation()
  const route = useRoute()
  const scrollViewRef = useRef(null)
  const [activeTab, setActiveTab] = useState("home")

  // Verificar se está em modo de edição
  const modoEdicao = route.params?.modoEdicao || false
  const questionarioParaEditar = route.params?.questionarioParaEditar

  // Estados para o questionário (título definido uma vez)
  const [categoria, setCategoria] = useState("Equipamentos")
  const [titulo, setTitulo] = useState("") // Título digitado uma vez

  // Estados para a pergunta atual sendo criada
  const [pergunta, setPergunta] = useState("")
  const [alternativas, setAlternativas] = useState(["", ""])

  // Estados para controle
  const [showDropdown, setShowDropdown] = useState(false)
  const [perguntas, setPerguntas] = useState([])
  const [perguntaCounter, setPerguntaCounter] = useState(1)
  const [inputHeight, setInputHeight] = useState(0)
  const [salvando, setSalvando] = useState(false)

  // Categorias disponíveis
  const categorias = ["Conteúdos", "Professores", "Estrutura", "Estágios"]

  // MUDANÇA 1: Pré-selecionar categoria se vier dos parâmetros
  useEffect(() => {
    // Se a categoria foi passada como parâmetro, usar ela
    if (route.params?.categoria) {
      setCategoria(route.params.categoria)
      console.log(`🎯 Categoria pré-selecionada: ${route.params.categoria}`)
    }

    // Se está em modo de edição, preencher os dados
    if (modoEdicao && questionarioParaEditar) {
      setTitulo(questionarioParaEditar.titulo)
      setCategoria(questionarioParaEditar.categoria)

      // Converter perguntas para o formato da tela
      const perguntasConvertidas =
        questionarioParaEditar.perguntas?.map((p, index) => ({
          id: index + 1,
          texto: p.texto,
          alternativas: p.alternativas || [],
        })) || []

      setPerguntas(perguntasConvertidas)
      setPerguntaCounter(perguntasConvertidas.length + 1)

      console.log(`✏️ Modo edição ativado para: ${questionarioParaEditar.titulo}`)
    }
  }, [route.params])

  useFocusEffect(
    React.useCallback(() => {
      // Resetar contador de perguntas quando a tela é focada (apenas se não for edição)
      if (!modoEdicao) {
        setPerguntaCounter(1)
      }
    }, [modoEdicao]),
  )

  const handleTabPress = (tab) => {
    setActiveTab(tab)
    navigation.navigate(tab)
  }

  const adicionarAlternativa = () => {
    setAlternativas([...alternativas, ""])
  }

  const atualizarAlternativa = (texto, index) => {
    const novasAlternativas = [...alternativas]
    novasAlternativas[index] = texto
    setAlternativas(novasAlternativas)
  }

  const removerAlternativa = (index) => {
    if (alternativas.length > 2) {
      // Manter pelo menos 2 alternativas
      const novasAlternativas = [...alternativas]
      novasAlternativas.splice(index, 1)
      setAlternativas(novasAlternativas)
    }
  }

  const adicionarPergunta = () => {
    // Validar se o título foi preenchido primeiro
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Por favor, adicione um título para o questionário antes de criar perguntas.")
      return
    }

    // Validar pergunta e alternativas
    if (!pergunta.trim()) {
      Alert.alert("Atenção", "Por favor, escreva uma pergunta.")
      return
    }

    const alternativasValidas = alternativas.filter((alt) => alt.trim())
    if (alternativasValidas.length < 2) {
      Alert.alert("Atenção", "Por favor, adicione pelo menos duas alternativas.")
      return
    }

    // Adicionar a pergunta à lista
    const novaPergunta = {
      id: perguntaCounter,
      texto: pergunta,
      alternativas: alternativasValidas,
    }

    setPerguntas([...perguntas, novaPergunta])
    setPerguntaCounter(perguntaCounter + 1)

    // Limpar apenas os campos da pergunta atual (título permanece)
    setPergunta("")
    setAlternativas(["", ""])

    // Scroll para a pergunta adicionada
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const removerPergunta = (id) => {
    setPerguntas(perguntas.filter((p) => p.id !== id))
  }

  const editarPergunta = (id) => {
    const perguntaParaEditar = perguntas.find((p) => p.id === id)
    if (perguntaParaEditar) {
      setPergunta(perguntaParaEditar.texto)

      // Garantir pelo menos duas alternativas
      const alts = [...perguntaParaEditar.alternativas]
      while (alts.length < 2) {
        alts.push("")
      }

      setAlternativas(alts)
      removerPergunta(id)

      // Scroll para o formulário
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const salvar = async () => {
    // Validar título
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Por favor, adicione um título para o questionário.")
      return
    }

    // Validar se há pelo menos uma pergunta
    if (perguntas.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos uma pergunta ao questionário.")
      return
    }

    try {
      setSalvando(true)

      // Criar o objeto do questionário
      const dadosQuestionario = {
        titulo: titulo.trim(),
        categoria: categoria,
        perguntas: perguntas,
      }

      let resultado

      if (modoEdicao && questionarioParaEditar) {
        // Atualizar questionário existente
        resultado = await StorageService.atualizarQuestionario(questionarioParaEditar.id, dadosQuestionario)
      } else {
        // Criar novo questionário
        resultado = await StorageService.salvarQuestionario(dadosQuestionario)
      }

      if (resultado.sucesso) {
        // Resetar estados para um novo questionário
        setTitulo("")
        setPerguntas([])
        setPerguntaCounter(1)
        setPergunta("")
        setAlternativas(["", ""])

        // VOLTA PARA MEUS QUESTIONÁRIOS COM TOAST (como era antes)
        navigation.navigate("MeusQuestionarios", {
          categoria: categoria,
          novoQuestionario: resultado.questionario,
          showSuccessToast: true,
          questionarioEditado: modoEdicao,
        })
      } else {
        Alert.alert("Erro", resultado.erro)
      }
    } catch (error) {
      Alert.alert("Erro", "Erro interno. Tente novamente.")
    } finally {
      setSalvando(false)
    }
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
          <Text style={styles.title}>{modoEdicao ? "Editar questionário" : "Criar questionário"}</Text>

          {/* Seção de configuração do questionário (preenchida uma vez) */}
          <View style={styles.questionarioConfigSection}>
            {/* Category Dropdown */}
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={styles.dropdownText}>{categoria}</Text>
              <Feather name="chevron-down" size={22} color="#3C4A5D" />
            </TouchableOpacity>

            {/* Dropdown options */}
            {showDropdown && (
              <View style={styles.dropdownOptions}>
                {categorias.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setCategoria(cat)
                      setShowDropdown(false)
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Título do questionário - digitado uma vez */}
            <TextInput
              style={[styles.input, titulo.trim() && styles.inputPreenchido]}
              placeholder="Título do questionário"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor="#A0A0A0"
            />

            {titulo.trim() && <Text style={styles.tituloConfirmacao}>✓ Título definido: "{titulo}"</Text>}
          </View>

          {/* Seção de criação de perguntas */}
          <View style={styles.perguntaSection}>
            <Text style={styles.sectionTitle}>Montar pergunta</Text>

            {/* Campo da pergunta */}
            <TextInput
              style={styles.input}
              placeholder="Escreva uma pergunta"
              value={pergunta}
              onChangeText={setPergunta}
              placeholderTextColor="#A0A0A0"
            />

            {/* Primeira alternativa */}
            <TextInput
              style={styles.input}
              placeholder="Alternativa 1"
              value={alternativas[0]}
              onChangeText={(text) => atualizarAlternativa(text, 0)}
              placeholderTextColor="#A0A0A0"
            />

            {/* Segunda alternativa com botão de adicionar */}
            <View style={styles.alternativaContainer}>
              <TextInput
                style={[styles.input, styles.partialWidthInput]}
                placeholder="Alternativa 2"
                value={alternativas[1]}
                onChangeText={(text) => atualizarAlternativa(text, 1)}
                placeholderTextColor="#A0A0A0"
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout
                  if (height > 0 && height !== inputHeight) {
                    setInputHeight(height)
                  }
                }}
              />
              <TouchableOpacity
                style={[styles.actionButton, { height: inputHeight > 0 ? inputHeight : 54 }]}
                onPress={adicionarAlternativa}
              >
                <Feather name="plus" size={26} color="#3C4A5D" />
              </TouchableOpacity>
            </View>

            {/* Alternativas adicionais */}
            {alternativas.slice(2).map((alt, index) => (
              <View key={index + 2} style={styles.alternativaContainer}>
                <TextInput
                  style={[styles.input, styles.partialWidthInput]}
                  placeholder={`Alternativa ${index + 3}`}
                  value={alt}
                  onChangeText={(text) => atualizarAlternativa(text, index + 2)}
                  placeholderTextColor="#A0A0A0"
                />
                <TouchableOpacity
                  style={[styles.actionButton, { height: inputHeight > 0 ? inputHeight : 54 }]}
                  onPress={() => removerAlternativa(index + 2)}
                >
                  <Feather name="trash-2" size={22} color="#3C4A5D" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Botão adicionar pergunta */}
            <TouchableOpacity style={styles.adicionarButton} onPress={adicionarPergunta}>
              <Text style={styles.adicionarButtonText}>Adicionar pergunta</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de perguntas adicionadas */}
          {perguntas.length > 0 && (
            <View style={styles.perguntasContainer}>
              {perguntas.map((p) => (
                <View key={p.id} style={styles.perguntaCard}>
                  <View style={styles.perguntaHeader}>
                    <Text style={styles.perguntaTitle}>Pergunta {p.id}</Text>
                    <View style={styles.perguntaActions}>
                      <TouchableOpacity style={styles.editarButton} onPress={() => editarPergunta(p.id)}>
                        <Feather name="edit-2" size={16} color="#4A6572" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removerPergunta(p.id)}>
                        <Feather name="x" size={22} color="#3C4A5D" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.perguntaTexto}>{p.texto}</Text>

                  <View style={styles.alternativasLista}>
                    {p.alternativas.map((alt, index) => (
                      <View key={index} style={styles.alternativaItem}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.alternativaTexto}>{alt}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Botão salvar */}
          <TouchableOpacity
            style={[
              styles.salvarButton,
              (!titulo.trim() || perguntas.length === 0 || salvando) && styles.salvarButtonDisabled,
            ]}
            onPress={salvar}
            disabled={!titulo.trim() || perguntas.length === 0 || salvando}
          >
            <Text style={styles.salvarButtonText}>
              {salvando
                ? modoEdicao
                  ? "Salvando alterações..."
                  : "Salvando..."
                : modoEdicao
                  ? `Salvar alterações (${perguntas.length} pergunta${perguntas.length !== 1 ? "s" : ""})`
                  : `Salvar questionário (${perguntas.length} pergunta${perguntas.length !== 1 ? "s" : ""})`}
            </Text>
          </TouchableOpacity>

          <View style={{ height: bottomNavHeight + 20 }} />
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3C4A5D",
    marginBottom: 24,
  },
  questionarioConfigSection: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    position: "relative",
    zIndex: 1000,
  },
  perguntaSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
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
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 14,
    color: "#3C4A5D",
  },
  dropdownOptions: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#3C4A5D",
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
  inputPreenchido: {
    borderColor: "#4A6572",
    backgroundColor: "#F0F8FF",
  },
  tituloConfirmacao: {
    fontSize: 14,
    color: "#4A6572",
    fontWeight: "500",
    marginTop: -8,
    marginBottom: 8,
  },
  alternativaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  partialWidthInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  actionButton: {
    width: 54,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  adicionarButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 8,
    marginBottom: 24,
  },
  adicionarButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C4A5D",
  },
  perguntasContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  perguntaCard: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  perguntaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  perguntaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4A5D",
  },
  perguntaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editarButton: {
    padding: 4,
  },
  perguntaTexto: {
    fontSize: 15,
    color: "#3C4A5D",
    marginBottom: 16,
  },
  alternativasLista: {
    marginBottom: 8,
  },
  alternativaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3C4A5D",
    marginRight: 8,
  },
  alternativaTexto: {
    fontSize: 15,
    color: "#3C4A5D",
  },
  salvarButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#4A6572",
    bottom: 0,
  },
  salvarButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  salvarButtonText: {
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
