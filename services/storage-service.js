import AsyncStorage from "@react-native-async-storage/async-storage"

// Chaves para o localStorage
const STORAGE_KEYS = {
  USUARIOS: "fatec360_usuarios",
  QUESTIONARIOS: "fatec360_questionarios",
  RESPOSTAS: "fatec360_respostas",
  FEEDBACKS: "fatec360_feedbacks",
  USUARIO_LOGADO: "fatec360_usuario_logado",
  DATA_VERSION: "fatec360_data_version", // Nova chave para controlar versão
}

// VERSÃO DOS DADOS - INCREMENTE ESTE NÚMERO SEMPRE QUE MODIFICAR OS DADOS INICIAIS
const CURRENT_DATA_VERSION = 5

// Dados de exemplo para a apresentação
// const questionariosExemplo = [
//   {
//     id: "exemplo1",
//     titulo: "Avaliação dos conteúdos do semestre",
//     categoria: "Conteúdos",
//     gestorId: 1,
//     dataCriacao: "2023-06-07T10:00:00.000Z",
//     perguntas: [
//       {
//         texto: "Como você avalia a qualidade dos materiais didáticos?",
//         alternativas: ["Excelente", "Bom", "Regular", "Ruim", "Péssimo"],
//       },
//       {
//         texto: "Os conteúdos abordados são relevantes para sua formação profissional?",
//         alternativas: ["Muito relevantes", "Relevantes", "Neutro", "Pouco relevantes", "Irrelevantes"],
//       },
//       {
//         texto: "A carga horária das disciplinas é adequada para o conteúdo?",
//         alternativas: ["Totalmente adequada", "Adequada", "Neutra", "Pouco adequada", "Inadequada"],
//       },
//     ],
//   },
//   {
//     id: "exemplo2",
//     titulo: "Avaliação dos professores",
//     categoria: "Professores",
//     gestorId: 1,
//     dataCriacao: "2023-06-07T11:30:00.000Z",
//     perguntas: [
//       {
//         texto: "Os professores demonstram domínio do conteúdo?",
//         alternativas: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"],
//       },
//       {
//         texto: "Como você avalia a didática dos professores?",
//         alternativas: ["Excelente", "Boa", "Regular", "Ruim", "Péssima"],
//       },
//       {
//         texto: "Os professores são pontuais e cumprem o horário das aulas?",
//         alternativas: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"],
//       },
//     ],
//   },
//   {
//     id: "exemplo3",
//     titulo: "Avaliação da estrutura física",
//     categoria: "Estrutura",
//     gestorId: 2,
//     dataCriacao: "2023-06-07T14:15:00.000Z",
//     perguntas: [
//       {
//         texto: "Como você avalia as salas de aula?",
//         alternativas: ["Excelentes", "Boas", "Regulares", "Ruins", "Péssimas"],
//       },
//       {
//         texto: "Os laboratórios atendem às necessidades do curso?",
//         alternativas: ["Totalmente", "Em grande parte", "Parcialmente", "Minimamente", "Não atendem"],
//       },
//       {
//         texto: "Como você avalia a biblioteca?",
//         alternativas: ["Excelente", "Boa", "Regular", "Ruim", "Péssima"],
//       },
//     ],
//   },
//   {
//     id: "exemplo4",
//     titulo: "Avaliação de oportunidades de estágio",
//     categoria: "Estágios",
//     gestorId: 2,
//     dataCriacao: "2023-06-07T16:45:00.000Z",
//     perguntas: [
//       {
//         texto: "Como você avalia as oportunidades de estágio divulgadas pela instituição?",
//         alternativas: ["Excelentes", "Boas", "Regulares", "Ruins", "Péssimas"],
//       },
//       {
//         texto: "A instituição oferece suporte adequado para encontrar estágios?",
//         alternativas: ["Totalmente adequado", "Adequado", "Neutro", "Pouco adequado", "Inadequado"],
//       },
//       {
//         texto: "Os estágios disponíveis são relevantes para sua área de formação?",
//         alternativas: ["Muito relevantes", "Relevantes", "Neutros", "Pouco relevantes", "Irrelevantes"],
//       },
//     ],
//   },
// ]

// Estrutura inicial dos dados - DADOS ATUALIZADOS - MODIFIQUE AQUI E INCREMENTE A VERSÃO ACIMA
const INITIAL_DATA = {
  usuarios: {
    gestores: [
      { id: 1, nome: "Gestor Admin", email: "gestor@fatec.sp.gov.br" },
      { id: 2, nome: "Coordenador Silva", email: "coordenador@fatec.sp.gov.br" },
    ],
    alunos: [
      {
        id: 1,
        nome: "Carlos Eduardo Santos",
        email: "carlos@fatec.sp.gov.br",
        curso: "Análise e Desenvolvimento de Sistemas",
        periodo: "5º Semestre",
        ra: "2023000001",
      },
      {
        id: 2,
        nome: "Ana Paula Oliveira",
        email: "ana@fatec.sp.gov.br",
        curso: "Análise e Desenvolvimento de Sistemas",
        periodo: "3º Semestre",
        ra: "2023000002",
      },
      {
        id: 3,
        nome: "Pedro Vitor Rodrigues Coelho",
        email: "pedro@fatec.sp.gov.br",
        curso: "Análise e Desenvolvimento de Sistemas",
        periodo: "5º Semestre",
        ra: "2023000003",
      },
      {
        id: 4,
        nome: "Mariana Silva Rodrigues",
        email: "mariana@fatec.sp.gov.br",
        curso: "Análise e Desenvolvimento de Sistemas",
        periodo: "7º Semestre",
        ra: "2023000004",
      },
    ],
  },
  questionarios: {},
  respostas: [],
  feedbacks: [],
}

class StorageService {
  // ========== INICIALIZAÇÃO COM CONTROLE DE VERSÃO MELHORADO ==========
  async inicializarDados() {
    try {
      console.log("🔄 === INICIALIZANDO DADOS COM CONTROLE DE VERSÃO MELHORADO ===")

      // Verificar versão atual dos dados
      const versaoAtual = await AsyncStorage.getItem(STORAGE_KEYS.DATA_VERSION)
      const versaoSalva = versaoAtual ? Number.parseInt(versaoAtual) : 0

      console.log(`📊 Versão dos dados salva: ${versaoSalva}`)
      console.log(`📊 Versão atual do código: ${CURRENT_DATA_VERSION}`)

      // SEMPRE forçar atualização se a versão mudou
      if (versaoSalva < CURRENT_DATA_VERSION) {
        console.log("🔄 Versão desatualizada! Forçando atualização dos dados...")
        await this.forcarAtualizacaoCompleta()
      } else {
        console.log("✅ Dados já estão na versão mais recente")
        // Mesmo assim, verificar se os dados existem
        await this.verificarEGarantirDados()
      }
    } catch (error) {
      console.error("❌ Erro ao inicializar dados:", error)
      // Em caso de erro, forçar atualização
      await this.forcarAtualizacaoCompleta()
    }
  }

  // ========== VERIFICAR E GARANTIR QUE OS DADOS EXISTEM ==========
  async verificarEGarantirDados() {
    try {
      console.log("🔍 === VERIFICANDO SE OS DADOS EXISTEM ===")

      const usuarios = await AsyncStorage.getItem(STORAGE_KEYS.USUARIOS)
      const questionarios = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONARIOS)

      if (!usuarios || !questionarios) {
        console.log("⚠️ Dados faltando, forçando atualização...")
        await this.forcarAtualizacaoCompleta()
      } else {
        console.log("✅ Todos os dados necessários existem")
      }
    } catch (error) {
      console.error("❌ Erro ao verificar dados:", error)
      await this.forcarAtualizacaoCompleta()
    }
  }

  // ========== FUNÇÃO PARA FORÇAR ATUALIZAÇÃO COMPLETA ==========
  async forcarAtualizacaoCompleta() {
    try {
      console.log("🔄 === FORÇANDO ATUALIZAÇÃO COMPLETA DOS DADOS ===")

      // Preservar dados importantes antes de atualizar
      const usuarioLogado = await AsyncStorage.getItem(STORAGE_KEYS.USUARIO_LOGADO)
      const respostasExistentes = await AsyncStorage.getItem(STORAGE_KEYS.RESPOSTAS)
      const feedbacksExistentes = await AsyncStorage.getItem("feedbacks_enviados")

      console.log("💾 Dados preservados:")
      console.log("👤 Usuário logado:", usuarioLogado ? "✅" : "❌")
      console.log("📊 Respostas:", respostasExistentes ? "✅" : "❌")
      console.log("💬 Feedbacks:", feedbacksExistentes ? "✅" : "❌")

      // SEMPRE atualizar dados de usuários com os novos valores
      console.log("🔄 Atualizando dados de usuários...")
      await AsyncStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(INITIAL_DATA.usuarios))
      console.log("✅ Usuários atualizados com novos dados")

      // Atualizar questionários se necessário
      const questionariosExistentes = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONARIOS)
      if (!questionariosExistentes) {
        const questionariosIniciais = {
          1: questionariosExemplo.filter((q) => q.gestorId === 1),
          2: questionariosExemplo.filter((q) => q.gestorId === 2),
        }
        await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONARIOS, JSON.stringify(questionariosIniciais))
        console.log("✅ Questionários inicializados")
      } else {
        console.log("✅ Questionários já existem, mantendo")
      }

      // Inicializar respostas se não existirem
      if (!respostasExistentes) {
        await AsyncStorage.setItem(STORAGE_KEYS.RESPOSTAS, JSON.stringify(INITIAL_DATA.respostas))
        console.log("✅ Respostas inicializadas")
      } else {
        console.log("✅ Respostas preservadas")
      }

      // Inicializar feedbacks se não existirem
      if (!feedbacksExistentes) {
        await AsyncStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_DATA.feedbacks))
        console.log("✅ Feedbacks inicializados")
      } else {
        console.log("✅ Feedbacks preservados")
      }

      // Restaurar usuário logado se existia
      if (usuarioLogado) {
        await AsyncStorage.setItem(STORAGE_KEYS.USUARIO_LOGADO, usuarioLogado)
        console.log("✅ Usuário logado restaurado")
      }

      // Atualizar versão dos dados
      await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION.toString())
      console.log(`✅ Versão atualizada para: ${CURRENT_DATA_VERSION}`)

      console.log("🎉 === ATUALIZAÇÃO COMPLETA FINALIZADA ===")
      return true
    } catch (error) {
      console.error("❌ Erro ao forçar atualização:", error)
      return false
    }
  }

  // ========== FUNÇÃO PARA LIMPAR E RECRIAR TUDO ==========
  async limparERecriarDados() {
    try {
      console.log("🗑️ === LIMPANDO E RECRIANDO TODOS OS DADOS ===")

      // Limpar tudo
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS))
      await AsyncStorage.removeItem("feedbacks_enviados")

      // Recriar dados do zero
      await AsyncStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(INITIAL_DATA.usuarios))

      const questionariosIniciais = {
        1: questionariosExemplo.filter((q) => q.gestorId === 1),
        2: questionariosExemplo.filter((q) => q.gestorId === 2),
      }
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONARIOS, JSON.stringify(questionariosIniciais))
      await AsyncStorage.setItem(STORAGE_KEYS.RESPOSTAS, JSON.stringify(INITIAL_DATA.respostas))
      await AsyncStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_DATA.feedbacks))
      await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION.toString())

      console.log("✅ Todos os dados foram limpos e recriados!")
      return true
    } catch (error) {
      console.error("❌ Erro ao limpar e recriar dados:", error)
      return false
    }
  }

  // ========== USUÁRIOS ==========
async fazerLogin(email, tipoUsuario) {
  try {
    console.log(`🔐 Tentando login com email: ${email}, tipo: ${tipoUsuario}`)

    const usuarios = await this.getUsuarios()
    const listaUsuarios = tipoUsuario === "gestor" ? usuarios.gestores : usuarios.alunos

    // Encontrar o usuário pelo email (case insensitive)
    const usuario = listaUsuarios.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (usuario) {
      console.log(`✅ Usuário encontrado:`, JSON.stringify(usuario))
      const usuarioLogado = { ...usuario, tipo: tipoUsuario }

      // Limpar qualquer usuário anterior
      await AsyncStorage.removeItem(STORAGE_KEYS.USUARIO_LOGADO)

      // Salvar o novo usuário
      await AsyncStorage.setItem(STORAGE_KEYS.USUARIO_LOGADO, JSON.stringify(usuarioLogado))

      // Verificar se foi salvo corretamente
      const verificacao = await AsyncStorage.getItem(STORAGE_KEYS.USUARIO_LOGADO)
      console.log(`🔍 Verificação do usuário salvo:`, verificacao)

      return { sucesso: true, usuario: usuarioLogado }
    }

    console.log(`❌ Usuário não encontrado para o email: ${email}`)
    return { sucesso: false, erro: "Email não encontrado" }
  } catch (error) {
    console.error(`❌ Erro ao fazer login:`, error)
    return { sucesso: false, erro: "Erro ao fazer login" }
  }
}


  async getUsuarioLogado() {
    try {
      const usuario = await AsyncStorage.getItem(STORAGE_KEYS.USUARIO_LOGADO)
      return usuario ? JSON.parse(usuario) : null
    } catch (error) {
      return null
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USUARIO_LOGADO)
      return true
    } catch (error) {
      return false
    }
  }

  async getUsuarios() {
    try {
      console.log("👥 === BUSCANDO USUÁRIOS ===")
      const usuarios = await AsyncStorage.getItem(STORAGE_KEYS.USUARIOS)

      if (!usuarios) {
        console.log("⚠️ Nenhum usuário encontrado, retornando dados iniciais")
        return INITIAL_DATA.usuarios
      }

      const dadosUsuarios = JSON.parse(usuarios)
      console.log("👥 Dados de usuários carregados:", JSON.stringify(dadosUsuarios, null, 2))

      // Verificar se os dados têm a estrutura correta
      if (!dadosUsuarios.alunos || !Array.isArray(dadosUsuarios.alunos)) {
        console.log("⚠️ Estrutura de dados inválida, retornando dados iniciais")
        return INITIAL_DATA.usuarios
      }

      return dadosUsuarios
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error)
      return INITIAL_DATA.usuarios
    }
  }

  // ========== MÉTODOS PARA COMPATIBILIDADE ==========
  getAlunos() {
    return this.getUsuarios().then((usuarios) => usuarios.alunos)
  }

  async getAlunoById(id) {
    const usuarios = await this.getUsuarios()
    const aluno = usuarios.alunos.find((aluno) => aluno.id === id)
    console.log(`🔍 Buscando aluno ID ${id}:`, aluno)
    return aluno
  }

  async addAluno(aluno) {
    const usuarios = await this.getUsuarios()
    aluno.id = this.getNextId(usuarios.alunos)
    usuarios.alunos.push(aluno)
    await AsyncStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
    return aluno
  }

  async updateAluno(id, updatedAluno) {
    const usuarios = await this.getUsuarios()
    const index = usuarios.alunos.findIndex((aluno) => aluno.id === id)
    if (index !== -1) {
      usuarios.alunos[index] = { ...usuarios.alunos[index], ...updatedAluno }
      await AsyncStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
      return usuarios.alunos[index]
    }
    return null
  }

  async deleteAluno(id) {
    const usuarios = await this.getUsuarios()
    usuarios.alunos = usuarios.alunos.filter((aluno) => aluno.id !== id)
    await AsyncStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
  }

  getNextId(lista) {
    if (lista.length === 0) {
      return 1
    }
    const ids = lista.map((item) => item.id)
    return Math.max(...ids) + 1
  }

  // ========== QUESTIONÁRIOS ==========
  async salvarQuestionario(questionario) {
    try {
      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado || usuarioLogado.tipo !== "gestor") {
        return { sucesso: false, erro: "Apenas gestores podem criar questionários" }
      }

      const questionarios = await this.getQuestionarios()
      const gestorId = usuarioLogado.id

      if (!questionarios[gestorId]) {
        questionarios[gestorId] = []
      }

      const novoQuestionario = {
        ...questionario,
        id: Date.now(),
        gestorId: gestorId,
        dataCriacao: new Date().toISOString(),
      }

      questionarios[gestorId].push(novoQuestionario)
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONARIOS, JSON.stringify(questionarios))

      return { sucesso: true, questionario: novoQuestionario }
    } catch (error) {
      return { sucesso: false, erro: "Erro ao salvar questionário" }
    }
  }

  async atualizarQuestionario(questionarioId, dadosAtualizados) {
    try {
      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado || usuarioLogado.tipo !== "gestor") {
        return { sucesso: false, erro: "Apenas gestores podem editar questionários" }
      }

      const questionarios = await this.getQuestionarios()
      const gestorId = usuarioLogado.id

      if (!questionarios[gestorId]) {
        return { sucesso: false, erro: "Questionário não encontrado" }
      }

      const index = questionarios[gestorId].findIndex((q) => q.id === questionarioId)
      if (index === -1) {
        return { sucesso: false, erro: "Questionário não encontrado" }
      }

      // Manter dados originais importantes
      const questionarioOriginal = questionarios[gestorId][index]
      const questionarioAtualizado = {
        ...dadosAtualizados,
        id: questionarioOriginal.id,
        gestorId: questionarioOriginal.gestorId,
        dataCriacao: questionarioOriginal.dataCriacao,
        dataAtualizacao: new Date().toISOString(),
      }

      questionarios[gestorId][index] = questionarioAtualizado
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONARIOS, JSON.stringify(questionarios))

      return { sucesso: true, questionario: questionarioAtualizado }
    } catch (error) {
      return { sucesso: false, erro: "Erro ao atualizar questionário" }
    }
  }

  async excluirQuestionario(questionarioId) {
    try {
      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado || usuarioLogado.tipo !== "gestor") {
        return { sucesso: false, erro: "Apenas gestores podem excluir questionários" }
      }

      const questionarios = await this.getQuestionarios()
      const gestorId = usuarioLogado.id

      if (!questionarios[gestorId]) {
        return { sucesso: false, erro: "Questionário não encontrado" }
      }

      const index = questionarios[gestorId].findIndex((q) => q.id === questionarioId)
      if (index === -1) {
        return { sucesso: false, erro: "Questionário não encontrado" }
      }

      // Remover o questionário da lista
      questionarios[gestorId].splice(index, 1)
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONARIOS, JSON.stringify(questionarios))

      return { sucesso: true }
    } catch (error) {
      return { sucesso: false, erro: "Erro ao excluir questionário" }
    }
  }

  async getQuestionarios() {
    try {
      const questionarios = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONARIOS)
      return questionarios ? JSON.parse(questionarios) : {}
    } catch (error) {
      return {}
    }
  }

  async getMeusQuestionarios() {
    try {
      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado) return []

      const questionarios = await this.getQuestionarios()
      return questionarios[usuarioLogado.id] || []
    } catch (error) {
      return []
    }
  }

  async getTodosQuestionarios() {
    try {
      const questionarios = await this.getQuestionarios()
      const todosQuestionarios = []

      // Verificar se há questionários no AsyncStorage
      const temQuestionariosNoStorage = Object.values(questionarios).some(
        (array) => Array.isArray(array) && array.length > 0,
      )

      // Se não houver questionários no storage, retornar os exemplos
      if (!temQuestionariosNoStorage) {
        console.log("📝 Usando questionários de exemplo")
        return questionariosExemplo
      }

      // Caso contrário, retornar os questionários do storage
      Object.values(questionarios).forEach((gestorQuestionarios) => {
        if (Array.isArray(gestorQuestionarios)) {
          todosQuestionarios.push(...gestorQuestionarios)
        }
      })

      return todosQuestionarios
    } catch (error) {
      console.error("❌ Erro ao buscar todos os questionários:", error)
      // Em caso de erro, retornar os exemplos
      return questionariosExemplo
    }
  }

  // ========== RESPOSTAS (COM LOGS DETALHADOS) ==========
  async salvarResposta(resposta) {
    try {
      console.log("🚀 === INICIANDO SALVAMENTO DE RESPOSTA ===")
      console.log("📝 Dados da resposta recebida:", JSON.stringify(resposta, null, 2))

      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado) {
        console.log("❌ Usuário não logado")
        return { sucesso: false, erro: "Usuário não logado" }
      }

      console.log("👤 Usuário logado:", JSON.stringify(usuarioLogado, null, 2))

      // Buscar respostas existentes
      const respostasExistentes = await this.getTodasRespostas()
      console.log("📊 Respostas existentes antes de salvar:", respostasExistentes.length)

      const novaResposta = {
        id: Date.now().toString(),
        questionarioId: resposta.questionarioId,
        questionarioTitulo: resposta.questionarioTitulo,
        categoria: resposta.categoria,
        usuarioId: usuarioLogado.id,
        nomeUsuario: usuarioLogado.nome,
        tipoUsuario: usuarioLogado.tipo,
        dataEnvio: new Date().toISOString(),
        respostas: resposta.respostas,
      }

      console.log("📝 Nova resposta criada:", JSON.stringify(novaResposta, null, 2))

      // Adicionar à lista
      const todasRespostas = [...respostasExistentes, novaResposta]
      console.log("📊 Total de respostas após adicionar:", todasRespostas.length)

      // Salvar no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.RESPOSTAS, JSON.stringify(todasRespostas))
      console.log("💾 Dados salvos no AsyncStorage com sucesso!")

      // Verificar se foi salvo corretamente
      const verificacao = await AsyncStorage.getItem(STORAGE_KEYS.RESPOSTAS)
      const dadosVerificacao = JSON.parse(verificacao)
      console.log("✅ Verificação - Total de respostas salvas:", dadosVerificacao.length)

      console.log("🎉 === SALVAMENTO CONCLUÍDO COM SUCESSO ===")

      return { sucesso: true, resposta: novaResposta }
    } catch (error) {
      console.error("❌ === ERRO NO SALVAMENTO ===")
      console.error("❌ Erro detalhado:", error)
      return { sucesso: false, erro: "Erro ao salvar resposta" }
    }
  }

  async getTodasRespostas() {
    try {
      console.log("🔍 === BUSCANDO TODAS AS RESPOSTAS ===")

      const respostasString = await AsyncStorage.getItem(STORAGE_KEYS.RESPOSTAS)
      console.log("📊 Dados brutos do AsyncStorage:", respostasString)

      let respostasArray = []

      if (respostasString) {
        const dadosParsed = JSON.parse(respostasString)
        console.log("📊 Dados após parse:", typeof dadosParsed, Array.isArray(dadosParsed))

        // Verificar se é um array ou objeto (dados antigos)
        if (Array.isArray(dadosParsed)) {
          respostasArray = dadosParsed
          console.log("✅ Dados já estão no formato array")
        } else if (typeof dadosParsed === "object" && dadosParsed !== null) {
          // Converter objeto antigo para array
          console.log("🔄 Convertendo dados antigos de objeto para array...")
          respostasArray = []
          Object.values(dadosParsed).forEach((questionarioRespostas) => {
            if (Array.isArray(questionarioRespostas)) {
              respostasArray.push(...questionarioRespostas)
            }
          })
          // Salvar no novo formato
          await AsyncStorage.setItem(STORAGE_KEYS.RESPOSTAS, JSON.stringify(respostasArray))
          console.log("✅ Dados convertidos e salvos no novo formato")
        }
      } else {
        console.log("📊 Nenhum dado encontrado no AsyncStorage")
      }

      console.log("📊 Total de respostas encontradas:", respostasArray.length)
      console.log("📊 Respostas:", JSON.stringify(respostasArray, null, 2))

      // Garantir que é um array e ordenar por data
      if (Array.isArray(respostasArray)) {
        const respostasOrdenadas = respostasArray.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        console.log("✅ === BUSCA CONCLUÍDA ===")
        return respostasOrdenadas
      } else {
        console.log("⚠️ Dados não são um array, retornando array vazio")
        return []
      }
    } catch (error) {
      console.error("❌ === ERRO NA BUSCA ===")
      console.error("❌ Erro detalhado:", error)
      return []
    }
  }

  async getRespostasPorCategoria(categoria) {
    try {
      const todasRespostas = await this.getTodasRespostas()
      return todasRespostas.filter((resposta) => resposta.categoria === categoria)
    } catch (error) {
      console.error(`❌ Erro ao buscar respostas da categoria ${categoria}:`, error)
      return []
    }
  }

  // ========== FEEDBACKS ==========
  async salvarFeedback(feedback) {
    try {
      const usuarioLogado = await this.getUsuarioLogado()
      if (!usuarioLogado) {
        return { sucesso: false, erro: "Usuário não logado" }
      }

      const feedbacks = await this.getFeedbacks()

      const novoFeedback = {
        ...feedback,
        id: Date.now(),
        usuarioId: usuarioLogado.id,
        nomeUsuario: usuarioLogado.nome,
        tipoUsuario: usuarioLogado.tipo,
        dataEnvio: new Date().toISOString(),
      }

      feedbacks.push(novoFeedback)
      await AsyncStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks))

      return { sucesso: true, feedback: novoFeedback }
    } catch (error) {
      return { sucesso: false, erro: "Erro ao salvar feedback" }
    }
  }

  async getFeedbacks() {
    try {
      const feedbacks = await AsyncStorage.getItem(STORAGE_KEYS.FEEDBACKS)
      return feedbacks ? JSON.parse(feedbacks) : []
    } catch (error) {
      return []
    }
  }

  // ========== UTILITÁRIOS ==========
  async limparTodosDados() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS))
      await AsyncStorage.removeItem("feedbacks_enviados")
      console.log("🗑️ Todos os dados foram limpos!")
      return true
    } catch (error) {
      console.error("❌ Erro ao limpar dados:", error)
      return false
    }
  }

  // ========== DEBUG ==========
  async debugAsyncStorage() {
    try {
      console.log("🔍 === DEBUG ASYNC STORAGE ===")

      const versao = await AsyncStorage.getItem(STORAGE_KEYS.DATA_VERSION)
      console.log("📊 Versão dos dados:", versao || "Não definida")

      const usuarios = await AsyncStorage.getItem(STORAGE_KEYS.USUARIOS)
      console.log("👥 Usuários:", usuarios ? "✅ Existe" : "❌ Não existe")
      if (usuarios) {
        const dadosUsuarios = JSON.parse(usuarios)
        console.log("👥 Conteúdo dos usuários:", JSON.stringify(dadosUsuarios, null, 2))
      }

      const questionarios = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONARIOS)
      console.log("📝 Questionários:", questionarios ? "✅ Existe" : "❌ Não existe")

      const respostas = await AsyncStorage.getItem(STORAGE_KEYS.RESPOSTAS)
      console.log("📊 Respostas:", respostas ? "✅ Existe" : "❌ Não existe")

      const usuarioLogado = await AsyncStorage.getItem(STORAGE_KEYS.USUARIO_LOGADO)
      console.log("👤 Usuário logado:", usuarioLogado ? "✅ Existe" : "❌ Não existe")

      console.log("🔍 === FIM DEBUG ===")
    } catch (error) {
      console.error("❌ Erro no debug:", error)
    }
  }
}

// EXPORTAÇÃO CORRETA
export default new StorageService()
