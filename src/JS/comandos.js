import { Config, resetarConfig, salvarConfig, VERSAO } from "./config.js"
import { Escrita } from "./escrita.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Teste } from "./teste.js"

/**
 * Processamento de comandos do usuário
 * - Use o comando "/help" para ver todos os comandos disponíveis
 */
export const Comandos = {
    /**
     * Processa um comando slash
     * @param {string} bruto Texto digitado pelo usuário
     * @returns {string | null} Ação a executar, ou null se não for comando
     * @since v6.1.0
     */
    processar(bruto = "") {
        if (bruto[0] != "/") {
            return null
        }

        let partes = Escrita.semAcentos(bruto.slice(1).toLowerCase()).split(" "), // Partes do comando
            cmd = partes[0] // Comando em si

        // === Ajuda ===
        if (["ajuda", "help", "a", "h", "cmd", "cmds", "c"].includes(cmd)) {
            return Comandos.ajuda(partes[1] || "")
        }

        // === Resetar ===
        else if (["resetar", "reset", "restaurar", "restore"].includes(cmd)) {
            resetarConfig()
            Ui.aviso("Configurações restauradas para os valores padrão.")
            return null
        }

        // === Configurações ===
        else if (["config", "configuracoes", "conf", "settings", "cfg"].includes(cmd)) {
            if (partes[1] != undefined) {
                let canonico = Comandos.resolverCmd(partes[1])
                if (canonico != null && Config[canonico] != undefined) {
                    return Comandos.alterar(canonico)
                }
                Ui.erro("Configuração inválida", "/" + partes[1] + " não é uma configuração válida")
                return null
            }
            State.tipo = "config"
            return "config"
        }

        // === Sair ===
        else if (["sair", "exit", "//", "ex", "out"].includes(cmd)) {
            State.tipo = "sair"
            return "sair"
        } else if (["end"].includes(cmd)) {
            return "end"
        }

        // === Navegação ===
        else if (["inicio", "start"].includes(cmd)) {
            State.tipo = "inicio"
            return "inicio"
        } else if (["rever", "review"].includes(cmd)) {
            State.tipo = "rever"
            return "rever"
        } else if (["alterar", "change"].includes(cmd)) {
            State.tipo = "alterar"
            return "alterar"
        } else if (["historico", "history"].includes(cmd)) {
            State.tipo = "historico"
            return "historico"
        }

        // === Versão ===
        else if (["versao", "version", "v"].includes(cmd)) {
            return Comandos.versao()
        }

        // === Atalhos de configuração ===
        else if (["unicode"].includes(cmd)) {
            return Comandos.alterar("unicode")
        } else if (["explicar", "explicacoes", "explain"].includes(cmd)) {
            return Comandos.alterar("explicacoes")
        } else if (["acentos", "accents", "acento", "accent"].includes(cmd)) {
            return Comandos.alterar("acentos")
        } else if (["debug", "dbg"].includes(cmd)) {
            return Comandos.alterar("debug")
        } else if (["capitalizar", "capitalizadas", "capitalize", "capitalized", "cap"].includes(cmd)) {
            return Comandos.alterar("capitalizadas")
        } else if (["maiusculas", "maiuscula", "uppercase", "upper"].includes(cmd)) {
            return Comandos.alterar("maiusculas")
        } else if (["minusculas", "minuscula", "lowercase", "lower"].includes(cmd)) {
            return Comandos.alterar("minusculas")
        } else if (["decimal", "separador", "separator", "sep"].includes(cmd)) {
            return Comandos.alterar("separadorDecimal")
        } else if (["multiplos", "multiplo", "multiples", "multi"].includes(cmd)) {
            return Comandos.alterar("multiSimples")
        } else if (["confirmar", "confirmacoes", "confirm", "confirmations", "confent", "confinp"].includes(cmd)) {
            return Comandos.alterar("confirmacoesEntrada")
        } else if (["confirmarsaida", "confirmsaida", "confirmexit", "confsaida", "confexit"].includes(cmd)) {
            return Comandos.alterar("confirmacoesSaida")
        } else if (["erros", "erro", "errors", "error", "err"].includes(cmd)) {
            return Comandos.alterar("erros")
        } else if (["funcao", "mostrarfuncao", "function", "showfunction", "func"].includes(cmd)) {
            return Comandos.alterar("mostrarFuncao")
        } else if (["graus", "grau", "degrees", "degree", "deg"].includes(cmd)) {
            return Comandos.alterar("graus")
        }

        // === Teste ===
        else if (cmd == "teste") {
            if (partes[1] == "1234") {
                Teste.rodar()
            } else {
                Ui.erro("Senha inválida", String(partes[1]) + " não é uma senha válida")
            }
            return null
        }

        // === Inválido ===
        else {
            Ui.erro(
                "Comando inválido",
                String(cmd) + " não é um comando válido\nDigite “/help” para ver todos os comandos",
            )
            return null
        }
    },

    listaCmds() {
        return {
            ajuda: {
                curta: "mostra essa mensagem",
                longa: "Exibe a lista de todos os comandos disponíveis.\nUso: /ajuda [comando]",
                variacoes: ["help", "a", "h", "cmd", "cmds", "c"],
            },
            config: {
                curta: "abre as configurações",
                longa: "Abre o menu de configurações do programa.",
                variacoes: ["configuracoes", "conf", "settings", "cfg"],
            },
            resetar: {
                curta: "restaura as configurações",
                longa: "Remove as configurações salvas e restaura os valores padrão.",
                variacoes: ["reset", "restaurar", "restore"],
            },
            inicio: {
                curta: "volta ao menu principal",
                longa: "Retorna ao menu inicial de seleção de função.",
                variacoes: ["start"],
            },
            rever: {
                curta: "mostra os coeficientes atuais",
                longa: "Exibe os coeficientes inseridos na sessão atual.",
                variacoes: ["review"],
            },
            alterar: {
                curta: "muda os coeficientes",
                longa: "Permite alterar os coeficientes sem reiniciar a análise.",
                variacoes: ["change"],
            },
            historico: {
                curta: "abre o histórico",
                longa: "Exibe o histórico de funções analisadas na sessão.",
                variacoes: ["history"],
            },
            versao: {
                curta: "mostra a versão",
                longa: "Exibe a versão atual do programa e informações de autoria.",
                variacoes: ["version", "v"],
            },
            unicode: {
                curta: "alterna Unicode",
                longa: "Ativa ou desativa o uso de caracteres Unicode na saída.",
                variacoes: [],
            },
            acentos: {
                curta: "alterna acentos",
                longa: "Ativa ou desativa acentos nas mensagens exibidas.",
                variacoes: ["accents", "acento", "accent"],
            },
            explicar: {
                curta: "alterna explicações",
                longa: "Ativa ou desativa as explicações detalhadas dos resultados.",
                variacoes: ["explicacoes", "explain"],
            },
            capitalizar: {
                curta: "alterna capitalização",
                longa: "Ativa ou desativa a capitalização das primeiras letras.",
                variacoes: ["capitalizadas", "capitalize", "capitalized", "cap"],
            },
            maiusculas: {
                curta: "alterna maiúsculas",
                longa: "Ativa ou desativa a exibição em maiúsculas.",
                variacoes: ["maiuscula", "uppercase", "upper"],
            },
            minusculas: {
                curta: "alterna minúsculas",
                longa: "Ativa ou desativa a exibição em minúsculas.",
                variacoes: ["minuscula", "lowercase", "lower"],
            },
            decimal: {
                curta: "alterna separador decimal",
                longa: "Alterna o separador decimal entre ponto e vírgula.",
                variacoes: ["separador", "separator", "sep"],
            },
            multiplos: {
                curta: "alterna múltiplos simples",
                longa: "Ativa ou desativa a simplificação de múltiplos.",
                variacoes: ["multiplo", "multiples", "multi"],
            },
            confirmar: {
                curta: "alterna confirmações de entrada",
                longa: "Ativa ou desativa as confirmações ao inserir dados.",
                variacoes: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
            },
            confirmarsaida: {
                curta: "alterna confirmações de saída",
                longa: "Ativa ou desativa a confirmação ao sair do programa.",
                variacoes: ["confirmsaida", "confirmexit", "confsaida", "confexit"],
            },
            erros: {
                curta: "alterna exibição de erros",
                longa: "Ativa ou desativa a exibição de mensagens de erro.",
                variacoes: ["erro", "errors", "error", "err"],
            },
            funcao: {
                curta: "alterna exibição da função",
                longa: "Ativa ou desativa a exibição da função analisada.",
                variacoes: ["mostrarfuncao", "function", "showfunction", "func"],
            },
            graus: {
                curta: "alterna modo graus",
                longa: "Alterna entre graus e radianos nos cálculos.",
                variacoes: ["grau", "degrees", "degree", "deg"],
            },
            debug: {
                curta: "alterna modo debug",
                longa: "Ativa ou desativa o modo de depuração.",
                variacoes: ["dbg"],
            },
            teste: {
                curta: "executa testes",
                longa: "Executa a bateria de testes internos do programa.",
                variacoes: [],
            },
            sair: {
                curta: "sai do programa",
                longa: "Encerra o programa. Confirmação pode ser solicitada.",
                variacoes: ["exit", "//", "ex", "out"],
            },
        }
    },

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

    ajuda(especifico = "") {
        let cmds = Comandos.listaCmds()

        if (especifico != "") {
            let canonico = Comandos.resolverCmd(especifico)

            if (canonico != null) {
                Ui.aviso("/" + canonico + " — " + cmds[canonico].longa)
                return null
            }

            Ui.erro("Comando desconhecido", "/" + especifico + " não é um comando válido")
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
     * Exibe a versão do programa
     * @returns {null}
     * @since v6.1.0
     */
    versao() {
        Ui.aviso("Analisador de Funções Matemáticas\n" + VERSAO + " — Adriano Lima 2025 - 2026")
        return null
    },

    /**
     * Altera uma configuração do programa
     * @param {string} nome Nome em config
     * @returns {null}
     * @since v6.1.0
     */
    alterar(nome = "") {
        Config[nome] = !Config[nome]

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
     * Retorna uma lista com os nomes dos comandos disponíveis
     * @returns {string[]}
     * @since v6.1.0
     */
    nomes() {
        return ["config", "sair", "inicio", "rever", "historico", "alterar"]
    },
}
