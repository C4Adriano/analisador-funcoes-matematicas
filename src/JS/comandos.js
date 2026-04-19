import { Config, resetarConfig, salvarConfig, VERSAO } from "./config.js"
import { Escrita } from "./escrita.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Teste } from "./teste.js"

/**
 * [JS] Processamento de comandos do usuário
 * - Use o comando "/help" para ver todos os comandos disponíveis
 * @since v6.1.0
 */
export const Comandos = {
    /**
     * [JS] Processa um comando slash
     * @param {string} bruto - Texto digitado pelo usuário
     * @returns {string | null} - Ação a executar, ou null se não for comando
     * @since v6.1.0
     */
    processar(bruto = "") {
        if (bruto[0] != "/") return null

        let partes = Escrita.semAcentos(bruto.slice(1).toLowerCase()).split(" "),
            cmd = partes[0],
            arg = Comandos.parseBool(partes[1] || ""),
            canonico = Comandos.resolverCmd(cmd),
            cmds = Comandos.listaCmds()

        if (canonico === null) {
            let sugestao = Comandos.sugerirCmd(cmd)

            if (sugestao.tipo === "sugestao") {
                let resposta = Ui.confirmar(
                    "Você quis dizer: “/" + sugestao.canonico + "”?",
                    "Comando não reconhecido: “/" +
                        cmd +
                        "”\nA sugestão mais próxima é “" +
                        sugestao.canonico +
                        "” (distância " +
                        sugestao.distancia +
                        ")\nDeseja executar essa sugestão?",
                )
                if (resposta === 1) {
                    return Comandos.processar("/" + sugestao.canonico + " " + (partes[1] || ""))
                }
                return null
            }

            Ui.erro("Comando inválido", cmd + " não é um comando válido\nDigite “/help” para ver todos os comandos")
            return null
        }

        return cmds[canonico].acao(arg, partes)
    },

    /**
     * [JS] Calcula a distância de Levenshtein entre duas strings
     * @param {string} errado - A string digitada pelo usuário
     * @param {string} correto - A string de um comando conhecido
     * @returns {number}
     * @since v6.1.0
     */
    levenshtein(errado = "", correto = "") {
        let linhas = correto.length + 1,
            colunas = errado.length + 1,
            matriz = [],
            linha = 0,
            coluna = 0

        for (linha = 0; linha < linhas; linha++) {
            matriz[linha] = [linha]
        }
        for (coluna = 0; coluna < colunas; coluna++) {
            matriz[0][coluna] = coluna
        }

        for (linha = 1; linha < linhas; linha++) {
            for (coluna = 1; coluna < colunas; coluna++) {
                if (correto[linha - 1] == errado[coluna - 1]) {
                    matriz[linha][coluna] = matriz[linha - 1][coluna - 1]
                } else {
                    matriz[linha][coluna] =
                        1 +
                        Math.min(matriz[linha - 1][coluna], matriz[linha][coluna - 1], matriz[linha - 1][coluna - 1])
                }
            }
        }

        return matriz[linhas - 1][colunas - 1]
    },

    /**
     * [JS] Sugere um comando baseado no digitado pelo usuário usando distância de Levenshtein
     * @param {string} digitado - O digitado pelo usuário
     * @returns {object} - A sugestão de comando
     * @since v6.1.0
     */
    sugerirCmd(digitado = "") {
        const LIMITE = 3
        let cmds = Comandos.listaCmds(),
            chaves = Object.keys(cmds),
            melhor = "",
            menorDist = Infinity,
            i = 0,
            j = 0,
            candidatos = [],
            dist = 0

        for (i = 0; i < chaves.length; i++) {
            // Testa a chave canônica + todas as variações
            candidatos = [chaves[i]].concat(cmds[chaves[i]].variacoes)

            for (j = 0; j < candidatos.length; j++) {
                dist = Comandos.levenshtein(digitado, candidatos[j])
                if (dist < menorDist) {
                    menorDist = dist
                    melhor = chaves[i] // sempre salva o canônico
                }
            }
        }

        if (menorDist === 0) return { tipo: "exato", canonico: melhor, distancia: 0 }
        if (menorDist <= LIMITE) return { tipo: "sugestao", canonico: melhor, distancia: menorDist }
        return { tipo: "desconhecido", canonico: "", distancia: -1 }
    },

    /**
     * [JS] Retorna a lista de comandos disponíveis
     * @returns {object} - Lista de comandos com suas descrições, variações e ações
     * @since v6.1.0
     */
    listaCmds() {
        return {
            ajuda: {
                curta: "mostra essa mensagem",
                longa: "Exibe a lista de todos os comandos disponíveis.\nUso: /ajuda [comando]",
                variacoes: ["help", "a", "h", "cmd", "cmds", "c"],
                acao(arg, partes) {
                    return Comandos.ajuda(partes[1] || "")
                },
            },
            config: {
                curta: "abre as configurações",
                longa: "Abre o menu de configurações do programa.",
                variacoes: ["configuracoes", "conf", "settings", "cfg"],
                acao(arg, partes) {
                    if (partes[1] != undefined) {
                        let canonico = Comandos.resolverCmd(partes[1])
                        if (canonico != null && Config[canonico] != undefined) {
                            return Comandos.alterar(canonico, arg)
                        }
                        Ui.erro("Configuração inválida", "“" + partes[1] + "” não é uma configuração válida")
                        return null
                    }
                    State.tipo = "config"
                    return "config"
                },
            },
            resetar: {
                curta: "restaura as configurações",
                longa: "Remove as configurações salvas e restaura os valores padrão.",
                variacoes: ["reset", "restaurar", "restore"],
                acao() {
                    resetarConfig()
                    Ui.aviso("Configurações restauradas para os valores padrão.")
                    return null
                },
            },
            inicio: {
                curta: "volta ao menu principal",
                longa: "Retorna ao menu inicial de seleção de função.",
                variacoes: ["start"],
                acao() {
                    State.tipo = "inicio"
                    return "inicio"
                },
            },
            rever: {
                curta: "mostra os coeficientes atuais",
                longa: "Exibe os coeficientes inseridos na sessão atual.",
                variacoes: ["review"],
                acao() {
                    State.tipo = "rever"
                    return "rever"
                },
            },
            alterar: {
                curta: "muda os coeficientes",
                longa: "Permite alterar os coeficientes sem reiniciar a análise.",
                variacoes: ["change"],
                acao() {
                    State.tipo = "alterar"
                    return "alterar"
                },
            },
            historico: {
                curta: "abre o histórico",
                longa: "Exibe o histórico de funções analisadas na sessão.",
                variacoes: ["history"],
                acao() {
                    State.tipo = "historico"
                    return "historico"
                },
            },
            versao: {
                curta: "mostra a versão",
                longa: "Exibe a versão atual do programa e informações de autoria.",
                variacoes: ["version", "v"],
                acao() {
                    return Comandos.versao()
                },
            },
            unicode: {
                curta: "alterna Unicode",
                longa: "Ativa ou desativa o uso de caracteres Unicode na saída.",
                variacoes: [],
                acao(arg) {
                    return Comandos.alterar("unicode", arg)
                },
            },
            acentos: {
                curta: "alterna acentos",
                longa: "Ativa ou desativa acentos nas mensagens exibidas.",
                variacoes: ["accents", "acento", "accent"],
                acao(arg) {
                    return Comandos.alterar("acentos", arg)
                },
            },
            explicar: {
                curta: "alterna explicações",
                longa: "Ativa ou desativa as explicações detalhadas dos resultados.",
                variacoes: ["explicacoes", "explain"],
                acao(arg) {
                    return Comandos.alterar("explicacoes", arg)
                },
            },
            capitalizar: {
                curta: "alterna capitalização",
                longa: "Ativa ou desativa a capitalização das primeiras letras.",
                variacoes: ["capitalizadas", "capitalize", "capitalized", "cap"],
                acao(arg) {
                    return Comandos.alterar("capitalizadas", arg)
                },
            },
            maiusculas: {
                curta: "alterna maiúsculas",
                longa: "Ativa ou desativa a exibição em maiúsculas.",
                variacoes: ["maiuscula", "uppercase", "upper"],
                acao(arg) {
                    return Comandos.alterar("maiusculas", arg)
                },
            },
            minusculas: {
                curta: "alterna minúsculas",
                longa: "Ativa ou desativa a exibição em minúsculas.",
                variacoes: ["minuscula", "lowercase", "lower"],
                acao(arg) {
                    return Comandos.alterar("minusculas", arg)
                },
            },
            decimal: {
                curta: "alterna separador decimal",
                longa: "Alterna o separador decimal entre ponto e vírgula.",
                variacoes: ["separador", "separator", "sep"],
                acao(arg) {
                    return Comandos.alterar("separadorDecimal", arg)
                },
            },
            multiplos: {
                curta: "alterna múltiplos simples",
                longa: "Ativa ou desativa a simplificação de múltiplos.",
                variacoes: ["multiplo", "multiples", "multi"],
                acao(arg) {
                    return Comandos.alterar("multiSimples", arg)
                },
            },
            confirmar: {
                curta: "alterna confirmações de entrada",
                longa: "Ativa ou desativa as confirmações ao inserir dados.",
                variacoes: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
                acao(arg) {
                    return Comandos.alterar("confirmacoesEntrada", arg)
                },
            },
            confirmarsaida: {
                curta: "alterna confirmações de saída",
                longa: "Ativa ou desativa a confirmação ao sair do programa.",
                variacoes: ["confirmsaida", "confirmexit", "confsaida", "confexit"],
                acao(arg) {
                    return Comandos.alterar("confirmacoesSaida", arg)
                },
            },
            erros: {
                curta: "alterna exibição de erros",
                longa: "Ativa ou desativa a exibição de mensagens de erro.",
                variacoes: ["erro", "errors", "error", "err"],
                acao(arg) {
                    return Comandos.alterar("erros", arg)
                },
            },
            funcao: {
                curta: "alterna exibição da função",
                longa: "Ativa ou desativa a exibição da função analisada.",
                variacoes: ["mostrarfuncao", "function", "showfunction", "func"],
                acao(arg) {
                    return Comandos.alterar("mostrarFuncao", arg)
                },
            },
            graus: {
                curta: "alterna modo graus",
                longa: "Alterna entre graus e radianos nos cálculos.",
                variacoes: ["grau", "degrees", "degree", "deg"],
                acao(arg) {
                    return Comandos.alterar("graus", arg)
                },
            },
            debug: {
                curta: "alterna modo debug",
                longa: "Ativa ou desativa o modo de depuração.",
                variacoes: ["dbg"],
                acao(arg) {
                    return Comandos.alterar("debug", arg)
                },
            },
            teste: {
                curta: "executa testes",
                longa: "Executa a bateria de testes internos do programa.",
                variacoes: [],
                acao(arg, partes) {
                    if (partes[1] == "1234") {
                        Teste.rodar()
                    } else {
                        Ui.erro("Senha inválida", "“" + String(partes[1]) + "” não é uma senha válida")
                    }
                    return null
                },
            },
            sair: {
                curta: "sai do programa",
                longa: "Encerra o programa. Confirmação pode ser solicitada.",
                variacoes: ["exit", "//", "ex", "out"],
                acao() {
                    State.tipo = "sair"
                    return "sair"
                },
            },
        }
    },

    /**
     * [JS] Resolve um comando específico para seu nome canônico
     * @param {string} especifico - Comando específico
     * @returns {string | null} - Nome canônico do comando, ou null se não for encontrado
     * @since v6.1.0
     */
    resolverCmd(especifico = "") {
        let cmds = Comandos.listaCmds(),
            chavesCmd = Object.keys(cmds),
            canonico = especifico,
            i = 0

        while (i < chavesCmd.length && canonico == especifico) {
            if (cmds[chavesCmd[i]].variacoes.includes(especifico)) {
                canonico = chavesCmd[i]
            }
            i++
        }

        return cmds[canonico] != undefined ? canonico : null
    },

    /**
     * [JS] Converte um texto em um valor booleano
     * @param {string} texto - Texto
     * @returns {boolean | null} - Se é parecido com um valor booeano verdadeiro, falso ou se não é reconhecido
     * @since v6.1.0
     */
    parseBool(texto = "") {
        if (["true", "1", "sim", "yes", "on", "ativo"].includes(texto)) {
            return true
        }
        if (["false", "0", "nao", "no", "off", "inativo"].includes(texto)) {
            return false
        }
        return null
    },

    /**
     * [JS] Exibe ajuda sobre um comando específico
     * @param {string} especifico - Específico
     * @returns {boolean | null} - Se o comando foi encontrado
     * @since v6.1.0
     */
    ajuda(especifico = "") {
        let cmds = Comandos.listaCmds()

        if (especifico != "") {
            let canonico = Comandos.resolverCmd(especifico)

            if (canonico != null) {
                Ui.aviso("/" + canonico + " — " + cmds[canonico].longa)
                return null
            }

            Ui.erro("Comando desconhecido", "“/" + especifico + "” não é um comando válido")
            return null
        }

        let chaves = Object.keys(cmds),
            total = Math.ceil(chaves.length / 7),
            pagina = 1,
            resposta = 0

        do {
            if (pagina < 1) {
                pagina = 1
            } else if (pagina > total) {
                pagina = total
            }

            let inicio = (pagina - 1) * 7,
                fim = Math.min(inicio + 7, chaves.length),
                menu = "=== Ajuda ===\nPágina " + String(pagina) + "/" + String(total) + "\n"

            for (let i = inicio; i < fim; i++) {
                menu += "\n/" + chaves[i] + " — " + cmds[chaves[i]].curta
            }

            menu += "\n----------------\n8 = Anterior | 9 = Próxima | 0 = Voltar"

            resposta = Ui.intervalo(menu, "", 0, 9, 0, true)

            if (resposta == 8) {
                pagina--
            } else if (resposta == 9) {
                pagina++
            }
        } while (resposta != 0)

        return null
    },

    /**
     * [JS] Exibe a versão do programa
     * @returns {null}
     * @since v6.1.0
     */
    versao() {
        Ui.aviso("Analisador de Funções Matemáticas\n" + VERSAO + " — Adriano Lima 2025 - 2026")
        return null
    },

    /**
     * [JS] Altera uma configuração do programa
     * @param {string} nome - Nome da configuração
     * @param {any} valor - Novo valor para a configuração
     * @returns {null}
     * @since v6.1.0
     */
    alterar(nome = "", valor = null) {
        if (valor != null) {
            Config[nome] = valor
        } else {
            Config[nome] = !Config[nome]
        }

        if (nome == "capitalizadas" && Config.capitalizadas) {
            Config.maiusculas = false
            Config.minusculas = false
        } else if (nome == "maiusculas" && Config.maiusculas) {
            Config.capitalizadas = false
            Config.minusculas = false
        } else if (nome == "minusculas" && Config.minusculas) {
            Config.capitalizadas = false
            Config.maiusculas = false
        }

        salvarConfig()
        Ui.aviso(Escrita.itemConfig("Alterado: “" + nome + "”", nome))
        return null
    },

    /**
     * [JS] Retorna uma lista com os nomes dos comandos disponíveis
     * @returns {string[]} - Lista de nomes canônicos dos comandos disponíveis
     * @since v6.1.0
     */
    nomes() {
        return ["config", "sair", "inicio", "rever", "historico", "alterar"]
    },
}
