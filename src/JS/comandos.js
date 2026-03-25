import { config, versao } from "./config.js"
import { escrita } from "./escrita.js"
import { state } from "./state.js"
import { ui } from "./ui.js"
import { teste } from "./teste.js"

export const comandos = {
    /**
     * Processa um comando slash
     * @param {string} bruto Texto digitado pelo usuário
     * @returns Ação a executar, ou null se não for comando
     */
    processar(bruto = "") {
        if (bruto[0] != "/") { 
            return (null)
        }

        let partes = escrita.semAcentos(bruto.slice(1).toLowerCase()).split(" ")
        let cmd = partes[0]

        // Ajuda
        if (["ajuda", "help", "a", "h", "cmd", "cmds", "c"].includes(cmd)) {
            return (comandos.ajuda())
        }

        // Configurações
        else if (["config", "configuracoes", "conf", "settings", "cfg"].includes(cmd)) {
            return ("config")
        }

        // Sair
        else if (["sair", "exit", "//", "ex", "out"].includes(cmd)) {
            return ("sair")
        }

        // Navegação
        else if (["inicio", "start"].includes(cmd)) {
            return ("inicio")
        }

        else if (["rever", "review"].includes(cmd)) {
            return ("rever")
        }

        else if (["alterar", "change"].includes(cmd)) {
            return ("alterar")
        }

        else if (["historico", "history"].includes(cmd)) {
            return ("historico")
        }

        // Versão
        else if (["versao", "version", "v"].includes(cmd)) {
            return (comandos.versao())
        }

        // Confiugrações
        else if (["unicode"].includes(cmd)) {
            return (comandos.alterar("unicode"))
        }

        else if (["explicar", "explicacoes", "explain"].includes(cmd)) {
            return (comandos.alterar("explicacoes"))
        }

        else if (["acentos", "accents", "acento", "accent"].includes(cmd)) {
            return (comandos.alterar("acentos"))
        }

        // Teste
        else if (cmd == "teste") {
            if (partes[1] == "1234") {
                teste.rodar()
            } else {
                ui.erro("Senha inválida", String(partes[1]) + " não é uma senha válida")
            }
            return (null)
        }

        // Inválido
        else {
            ui.erro("Comando inválido", String(cmd) + " não é um comando válido\nDigite “/help” para ver todos os comandos")
            return (null)
        }
    },

    ajuda() {
        ui.aviso(
            "Comandos disponíveis:" + "\n" +
            "/ajuda, /help — mostra essa mensagem" + "\n" +
            "/config — abre as configurações" + "\n" +
            "/inicio — volta ao menu principal" + "\n" +
            "/rever — mostra os coeficientes atuais" + "\n" +
            "/alterar — muda os coeficientes" + "\n" +
            "/historico — abre o histórico" + "\n" +
            "/versao — mostra a versão" + "\n" +
            "/unicode — alterna Unicode" + "\n" +
            "/acentos — alterna acentos" + "\n" +
            "/explicar — alterna explicações" + "\n" +
            "/sair — sai do programa"
        )
        return (null)
    },

    versao() {
        ui.aviso("Mathematical Function Analyzer / Analisador de Funções Matemáticas\n" + versao + " — Adriano Lima 2025 - 2026")
        return (null)
    },

    alterar(nome = "") {
        config[nome] = !config[nome]
        ui.aviso(escrita.itemConfig("Alterado: “" + nome + "”", nome))
        return (null)
    },

    nomes() {
        return (["config", "sair", "inicio", "rever", "historico", "alterar", null])
    }
}