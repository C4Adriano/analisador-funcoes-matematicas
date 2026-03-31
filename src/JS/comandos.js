import { Config, VERSAO } from "./config.js"
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

        // === Configurações ===
        else if (["config", "configuracoes", "conf", "settings", "cfg"].includes(cmd)) {
            State.tipo = "config"
            return "config"
        }

        // === Sair ===
        else if (["sair", "exit", "//", "ex", "out"].includes(cmd)) {
            State.tipo = "sair"
            return "sair"
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

    /**
     * Exibe a ajuda com todos os comandos disponíveis
     * @returns {null}
     * @since v6.1.0
     */
    ajuda(especifico = "") {
        let cmds = {
            ajuda: {
                curta: "mostra essa mensagem",
                longa: "Exibe a lista de todos os comandos disponíveis.\nUso: /ajuda [comando]",
            },
            config: { curta: "abre as configurações", longa: "Abre o menu de configurações do programa." },
            inicio: { curta: "volta ao menu principal", longa: "Retorna ao menu inicial de seleção de função." },
            rever: {
                curta: "mostra os coeficientes atuais",
                longa: "Exibe os coeficientes inseridos na sessão atual.",
            },
            alterar: {
                curta: "muda os coeficientes",
                longa: "Permite alterar os coeficientes sem reiniciar a análise.",
            },
            historico: { curta: "abre o histórico", longa: "Exibe o histórico de funções analisadas na sessão." },
            versao: { curta: "mostra a versão", longa: "Exibe a versão atual do programa e informações de autoria." },
            unicode: { curta: "alterna Unicode", longa: "Ativa ou desativa o uso de caracteres Unicode na saída." },
            acentos: { curta: "alterna acentos", longa: "Ativa ou desativa acentos nas mensagens exibidas." },
            explicar: {
                curta: "alterna explicações",
                longa: "Ativa ou desativa as explicações detalhadas dos resultados.",
            },
            capitalizar: {
                curta: "alterna capitalização",
                longa: "Ativa ou desativa a capitalização das primeiras letras.",
            },
            maiusculas: { curta: "alterna maiúsculas", longa: "Ativa ou desativa a exibição em maiúsculas." },
            minusculas: { curta: "alterna minúsculas", longa: "Ativa ou desativa a exibição em minúsculas." },
            decimal: {
                curta: "alterna separador decimal",
                longa: "Alterna o separador decimal entre ponto e vírgula.",
            },
            multiplos: { curta: "alterna múltiplos simples", longa: "Ativa ou desativa a simplificação de múltiplos." },
            confirmar: {
                curta: "alterna confirmações de entrada",
                longa: "Ativa ou desativa as confirmações ao inserir dados.",
            },
            confirmarsaida: {
                curta: "alterna confirmações de saída",
                longa: "Ativa ou desativa a confirmação ao sair do programa.",
            },
            erros: { curta: "alterna exibição de erros", longa: "Ativa ou desativa a exibição de mensagens de erro." },
            funcao: { curta: "alterna exibição da função", longa: "Ativa ou desativa a exibição da função analisada." },
            graus: { curta: "alterna modo graus", longa: "Alterna entre graus e radianos nos cálculos." },
            debug: { curta: "alterna modo debug", longa: "Ativa ou desativa o modo de depuração." },
            teste: { curta: "executa testes", longa: "Executa a bateria de testes internos do programa." },
            sair: { curta: "sai do programa", longa: "Encerra o programa. Confirmação pode ser solicitada." },
        }

        if (especifico != "" && cmds[especifico] != undefined) {
            Ui.aviso("/" + especifico + " — " + cmds[especifico].longa)
            return null
        }

        if (especifico != "") {
            Ui.erro("Comando desconhecido", "/" + especifico + " não é um comando válido")
            return null
        }
        let linhas = [],
            chaves = Object.keys(cmds)
        for (let i = 0; i < chaves.length; i++) {
            let cmd = chaves[i]
            linhas.push("/" + cmd + " — " + cmds[cmd].curta)
        }

        Ui.aviso("Comandos disponíveis:\n" + linhas.join("\n"))
        return null
    },

    /**
     * Exibe a versão do programa
     * @returns {null}
     * @since v6.1.0
     */
    versao() {
        Ui.aviso(
            "Mathematical Function Analyzer / Analisador de Funções Matemáticas\n" +
                VERSAO +
                " — Adriano Lima 2025 - 2026",
        )
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
