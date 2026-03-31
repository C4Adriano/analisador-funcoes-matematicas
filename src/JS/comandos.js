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
            return Comandos.ajuda()
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
    ajuda() {
        Ui.aviso(
            "Comandos disponíveis:" +
                "\n" +
                "/ajuda, /help — mostra essa mensagem" +
                "\n" +
                "/config — abre as configurações" +
                "\n" +
                "/inicio — volta ao menu principal" +
                "\n" +
                "/rever — mostra os coeficientes atuais" +
                "\n" +
                "/alterar — muda os coeficientes" +
                "\n" +
                "/historico — abre o histórico" +
                "\n" +
                "/versao — mostra a versão" +
                "\n" +
                "/unicode — alterna Unicode" +
                "\n" +
                "/acentos — alterna acentos" +
                "\n" +
                "/explicar — alterna explicações" +
                "\n" +
                "/sair — sai do programa",
        )
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
