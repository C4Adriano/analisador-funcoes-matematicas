import { algebra } from "./algebra.js"
import { analisar } from "./analisar.js"
import { config, configPadrao, versao } from "./config.js"
import { erro } from "./erro.js"
import { escrita } from "./escrita.js"
import { state } from "./state.js"
import { ui } from "./ui.js"
import { comandos } from "./comandos.js"

console.log("" +
"====================================================" + "\n" +
"Mathematical Function Analyzer / Analisador de Funções Matemáticas — " + versao + "\n" +
"All rights reserved / Todos os direitos reservados © Adriano Lima 2025 — 2026" + "\n" +
"===================================================="
)

// === OBJETOS GLOBAIS ===
// Para alterar o HTML também, conforme a língua
document.title = ((config.linguagem == "en") ? "Mathematical Function Analyzer" : "Analisador de Funções Matemáticas")
document.querySelector("h1").textContent = ((config.linguagem == "en") ? "Mathematics" : "Matemática")
document.documentElement.lang = config.linguagem

let subtipo = 0, escolha = 0, pagina = 1, total = 1, opcao = 1

state.globalA = algebra.variaveis("a"), state.globalB = algebra.variaveis("b"), state.globalC = algebra.variaveis("c")

// Código principal
do {
    // Variáveis globais
    if (state.pedirCoefs) {
        state.globalA = algebra.variaveis("a")
        state.globalB = algebra.variaveis("b")
        state.globalC = algebra.variaveis("c")
    }

    // Salva histórico
    if ((state.globalA != state.funcAtual[0]) || (state.globalB != state.funcAtual[1]) || (state.globalC != state.funcAtual[2])) {
        state.funcAtual = [state.globalA, state.globalB, state.globalC], state.historico.push(state.funcAtual.slice())
        if (state.historico.length > 9) {
            state.historico.shift()
        }
    }

    // Tipo de função
    if ((!state.manterTipo) || (state.tipo == "inicio")) {
        state.tipo = ui.entrada("=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair", "", true, 0, true)
    }

    state.manterTipo = false
    state.pedirCoefs = false
    state.loop = false

    if (((((0 <= state.tipo) && (state.tipo <= 2)) || ((6 <= state.tipo) && (state.tipo <= 9))))) { //  || (comandos.nomes().includes(state.tipo)))) {
        // Polinomiais
        if (state.tipo == 1) {
            // Incógnitas
            if ((!isFinite(state.globalA)) || (!isFinite(state.globalB)) || (!isFinite(state.globalC))) {
                state.coeficientes = algebra.incognita(state.globalA, state.globalB, state.globalC)
                state.globalA = algebra.arredonda(state.coeficientes[0])
                state.globalB = algebra.arredonda(state.coeficientes[1])
                state.globalC = algebra.arredonda(state.coeficientes[2])
            }

            // Números
            if ((isFinite(state.globalA)) && (isFinite(state.globalB)) && (isFinite(state.globalC))) {
                if ((state.globalA == 0) && (state.globalB == 0)) {
                    analisar.constante(state.globalC)
                } else if ((state.globalA == 0) && (state.globalB != 0)) {
                    analisar.afim(state.globalB, state.globalC)
                } else if (state.globalA != 0) {
                    analisar.quadratica(state.globalA, state.globalB, state.globalC)
                }
            }
        }

        // Não polinomial
        else if (state.tipo == 2) {
            // Loop do menu
            do {
                subtipo = ui.entrada("=== Menu ===\nO que queres?\n1 = Função exponencial\n2 = Função logarítmica\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar", "", true, 0, true)

                state.loopSub = false

                if ((((0 <= subtipo) && (subtipo <= 2)) || ((6 <= subtipo) && (subtipo <= 9)))) { //  || (comandos.nomes().includes(subtipo))) {
                    // Exponencial
                    if (subtipo == 1) {
                        // Incógnitas
                        if ((state.globalA == "a") || (state.globalB == "b") || (state.globalC == "c")) {
                            state.coeficientes = algebra.incognita(state.globalA, state.globalB, state.globalC, true)
                            state.globalA = algebra.arredonda(state.coeficientes[0])
                            state.globalB = algebra.arredonda(state.coeficientes[1])
                            state.globalC = algebra.arredonda(state.coeficientes[2])
                        }

                        // Números
                        if ((state.globalA != "a") && (state.globalB != "b") && (state.globalC != "c")) {
                            if (((state.globalA > 0) && (state.globalA != 1)) && (state.globalB != 0)) {
                                analisar.exponencial(state.globalA, state.globalB, state.globalC)
                            }

                            // Constante
                            else if ((state.globalA == 0) || (state.globalA == 1) || (state.globalB == 0)) {
                                erro.funcaoConstante("exponencial")

                                if (state.globalA == 1) {
                                    state.globalC += state.globalB
                                }
                                state.globalA = 0
                                state.globalB = 0
                                state.tipo = 1
                                state.manterTipo = true
                                state.loop = true
                            }

                            // Erro de base
                            else if (state.globalA < 0) {
                                erro.funcaoInvalida("exponencial")

                                state.pedirCoefs = true
                                state.loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subtipo == 2) {
                        // Incógnitas
                        if ((state.globalA == "a") || (state.globalB == "b") || (state.globalC == "c")) {
                            state.coeficientes = algebra.incognita(state.globalA, state.globalB, state.globalC, false, true)
                            state.globalA = algebra.arredonda(state.coeficientes[0])
                            state.globalB = algebra.arredonda(state.coeficientes[1])
                            state.globalC = algebra.arredonda(state.coeficientes[2])
                        }

                        // Números
                        if ((state.globalA != "a") && (state.globalB != "b") && (state.globalC != "c")) {
                            if (((state.globalA > 0) && (state.globalA != 1)) && (state.globalB != 0)) {
                                analisar.logaritmica(state.globalA, state.globalB, state.globalC)
                            }

                            // Constante
                            else if ((state.globalA == 0) || (state.globalA == 1) || (state.globalB == 0)) {
                                erro.funcaoConstante("logarítmica")
                                if (state.globalA == 1) {
                                    state.globalC += state.globalB
                                }
                                state.globalA = 0
                                state.globalB = 0
                                state.tipo = 1
                                state.manterTipo = true
                                state.loop = true
                            }

                            // Erro de base
                            else if (state.globalA < 0) {
                                erro.funcaoInvalida("logarítmica")
                                state.pedirCoefs = true
                                state.loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subtipo) && (subtipo <= 9)) { //  || (comandos.nomes().includes(subtipo))) {
                        state.tipo = subtipo
                        state.loop = true
                        if (subtipo != "sair") {
                            state.manterTipo = true
                        }
                    }

                    // Voltar
                    else if (subtipo == 0) {
                        state.loop = true
                    }
                }

                // Erro
                else {
                    state.loopSub = true
                }
            } while (state.loopSub)
        }

        // Histórico
        else if ((state.tipo == 6)) { //  || (state.tipo == "historico")) {
            state.loop = true

            // Erro de histórico
            if (state.historico.length == 1) {
                ui.exibir("Não há histórico o suficiente para mudanças.", "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função.")
            } else {
                let mensagem = "=== Histórico ===\nO que queres?\n", resposta = 0, opcao = 1

                // Mostra histórico
                for (let func = state.historico.length - 1; func >= 0; func--) {
                    mensagem += String(opcao) + " ⇒ “a” = " + escrita.decimal(state.historico[func][0]) + "; “b” = " + escrita.decimal(state.historico[func][1]) + "; “c” = " + escrita.decimal(state.historico[func][2]) + "\n"
                    opcao++
                }

                // Escolha
                resposta = ui.intervalo(mensagem, "", 0, state.historico.length - 1)

                // Restaura função
                let indice = state.historico.length - 1 - resposta
                state.globalA = state.historico[indice][0], state.globalB = state.historico[indice][1], state.globalC = state.historico[indice][2]
                if ((state.globalA != state.funcAtual[0]) || (state.globalB != state.funcAtual[1]) || (state.globalC != state.funcAtual[2])) {
                    state.funcAtual = [state.globalA, state.globalB, state.globalC]
                }
            }
        }

        // Configurações
        else if ((state.tipo == 7)) { //  || (state.tipo == "config")) {
            pagina = 1
            // Loop
            do {
                state.tipo = -1
                state.loop = true

                // Menu de configurações
                let opcoesConfig = [
                    escrita.itemConfig("Caracteres Unicode", "unicode"),
                    escrita.itemConfig("Explicações", "explicacoes"),
                    escrita.itemConfig("Acentos", "acentos"),
                    escrita.itemConfig("Capitalizadas", "capitalizadas"),
                    escrita.itemConfig("Maiúsculas", "maiusculas"),
                    escrita.itemConfig("Minúsculas", "minusculas"),

                    escrita.itemConfig("Ponto decimal", "separadorDecimal"),
                    escrita.itemConfig("Multiplicação simples", "multiSimples"),
                    escrita.itemConfig("Confirmações de entrada", "confirmacoesEntrada"),
                    escrita.itemConfig("Confirmações de saída", "confirmacoesSaida"),
                    escrita.itemConfig("Mensagens de erro", "erros"),
                    escrita.itemConfig("Mostrar função", "mostrarFuncao"),

                    escrita.itemConfig("Casas decimais", "casasDecimais"),
                    escrita.itemConfig("Precisão do log", "logPrecisao"),
                    escrita.itemConfig("Precisão da divisão", "divPrecisao"),
                    escrita.itemConfig("Limite de interações", "limiteInteracoes"),
                    escrita.itemConfig("Linguagem", "linguagem")
                ]

                // Preenche com separadores
                while (((opcoesConfig.length % 6) != 0) || (opcoesConfig.length == 0)) {
                    opcoesConfig.push("---")
                }
                total = Math.ceil(opcoesConfig.length / 6)

                // Controla página
                if (pagina < 1) {
                    pagina = 1
                } else if (pagina > total) {
                    pagina = total
                }

                // Mostra opções
                let texto = "=== Configurações ===\nPágina " + String(pagina) + "/" + String(total) + "\nObs.: Configurações não são salvas ao fechar"
                while (opcao <= 6) {
                    texto += "\n" + String(opcao) + " = " + String(opcoesConfig[(opcao - 1) + (6 * (pagina - 1))])
                    opcao++
                }
                opcao = 1
                texto += "\n----------------\n7 = Restaurar padrão | 8 = Anterior | 9 = Próxima | 0 = Voltar"

                // Escolha
                escolha = ui.intervalo(texto, "", 0, 9, 0, true)
                if (escolha == 7) { // Padrão
                    if (JSON.stringify(config) == JSON.stringify(configPadrao)) {
                        ui.aviso("Todas as configurações já estão na forma padrão.", "Não há necessidade de restaurar.")
                    } else {
                        let mensagem = "Voltar às configurações padrão?\nConfigurações afetadas:\n", arrayConfig = Object.keys(config)

                        // Mostra configurações afetadas
                        for (let i = 0; i < arrayConfig.length; i++) {
                            mensagem += (config[arrayConfig[i]] != configPadrao[arrayConfig[i]]) ? arrayConfig[i] + ", " : ""
                        }

                        // Remove última vírgula e espaço
                        mensagem = mensagem.slice(0, -2)

                        // Confirmação
                        if (ui.aviso(mensagem, "Obs.₁: Isso irá afetar todas as configurações acima\nObs.₂: Essa alteração é permanente", true)) {
                            config = JSON.parse(JSON.stringify(configPadrao))
                        }
                    }
                } else if (escolha == 8) { // -1
                    escolha = -1
                    pagina -= 1
                } else if (escolha == 9) { // +1
                    escolha = -1
                    pagina += 1
                } else if (escolha == "config") {
                    escolha = -1
                } else if (escolha == "sair") {
                    escolha = 0
                    state.tipo = "sair"
                }

                // Página 1
                if (pagina == 1) {
                    // Unicode
                    if (escolha == 1) {
                        config.unicode = ui.confirmar(escrita.itemConfig("Ativar caracteres Unicode?", "unicode"), "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações")
                    }

                    // Explicações
                    else if (escolha == 2) {
                        config.explicacoes = ui.confirmar(escrita.itemConfig("Ativar explicações?", "explicacoes"), "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c")
                    }

                    // Acentos
                    else if (escolha == 3) {
                        config.acentos = ui.confirmar(escrita.itemConfig("Ativar acentos?", "acentos"), "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação")
                    }

                    // Capitalizadas
                    else if (escolha == 4) {
                        config.capitalizadas = ui.confirmar(escrita.itemConfig("Ativar letras capitalizadas?", "capitalizadas"), "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas\nObs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”")
                        if (config.capitalizadas) {
                            config.minusculas = false
                            config.maiusculas = false
                        } else if ((!config.maiusculas) && (!config.minusculas)) {
                            config.capitalizadas = true
                        }
                    }

                    // Maiúsculas
                    else if (escolha == 5) {
                        config.maiusculas = ui.confirmar(escrita.itemConfig("Ativar todas as letras maiúsculas?", "maiusculas"), "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”")
                        if (config.maiusculas) {
                            config.capitalizadas = false
                            config.minusculas = false
                        } else if ((!config.minusculas) && (!config.capitalizadas)) {
                            config.capitalizadas = true
                        }
                    }

                    // Minúsculas
                    else if (escolha == 6) {
                        config.minusculas = ui.confirmar(escrita.itemConfig("Ativar todas as letras minúsculas?", "minusculas"), "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”")
                        if (config.minusculas) {
                            config.capitalizadas = false
                            config.maiusculas = false
                        } else if ((!config.maiusculas) && (!config.capitalizadas)) {
                            config.capitalizadas = true
                        }
                    }
                }

                // Página 2
                else if (pagina == 2) {
                    // Ponto decimal
                    if (escolha == 1) {
                        config.separadorDecimal = ui.confirmar(escrita.itemConfig("Alterar ponto decimal?", "separadorDecimal"), "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: " + escrita.decimal(123.456) + "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”")
                    }

                    // Multiplicação simples
                    else if (escolha == 2) {
                        config.multiSimples = ui.confirmar(escrita.itemConfig("Alterar para multiplicação simples?", "multiSimples"), "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em “*”\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”")
                    }

                    // Confirmações de entrada
                    else if (escolha == 3) {
                        config.confirmacoesEntrada = ui.confirmar(escrita.itemConfig("Ativar confirmações de entrada?", "confirmacoesEntrada"), "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada")
                    }

                    // Confirmações de saída
                    else if (escolha == 4) {
                        config.confirmacoesSaida = ui.confirmar(escrita.itemConfig("Ativar confirmações de saída?", "confirmacoesSaida"), "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa")
                    }

                    // Erros
                    else if (escolha == 5) {
                        config.erros = ui.confirmar(escrita.itemConfig("Ativar mensagens de erro?", "erros"), "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo")
                    }

                    // Função
                    else if (escolha == 6) {
                        config.mostrarFuncao = ui.confirmar(escrita.itemConfig("Ativar exibição da função?", "mostrarFuncao"), "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)")
                    }
                }

                // Página 3
                else if (pagina == 3) {
                    // Casas decimais
                    if (escolha == 1) {
                        config.casasDecimais = ui.intervalo(escrita.itemConfig("Quantas casas decimais?", "casasDecimais"), "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas\nObs.₂: Os números já digitados serão arredondados para o novo número de casas decimais", 3, 10)

                        // Arredonda novamente
                        if (state.globalA != "a") {
                            state.globalA = algebra.arredonda(state.globalA)
                        }
                        if (state.globalB != "b") {
                            state.globalB = algebra.arredonda(state.globalB)
                        }
                        if (state.globalC != "c") {
                            state.globalC = algebra.arredonda(state.globalC)
                        }
                    }

                    // Precisão do log
                    else if (escolha == 2) {
                        config.logPrecisao = ui.intervalo(escrita.itemConfig("Qual a precisão do log?", "logPrecisao"), "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”", 1e-12, 1e-6, 20)
                    }

                    // Precisão da divisão
                    else if (escolha == 3) {
                        config.divPrecisao = ui.intervalo(escrita.itemConfig("Qual a precisão da divisão?", "divPrecisao"), "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”", 1e-12, 1e-6, 20)
                    }

                    // Limite de interações
                    else if (escolha == 4) {
                        config.limiteInteracoes = ui.intervalo(escrita.itemConfig("Qual o limite de interações?", "limiteInteracoes"), "Obs.₁: Isso irá afetar todos os state.loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar state.loops infinitos no código, caso algo dê errado", 100, 10000)
                    }

                    // Línguagem
                    else if (escolha == 5) {
                        let pergunta = ui.intervalo(escrita.itemConfig("Qual língua?", "linguagem") + "\n1 = Português Brasileiro\n2 = Inglês", "Obs.: Isso irá alterar a língua do sistema inteiro.", 1, 2, 0),
                        lingua = ((pergunta == 1) ? "pt-br" : "en")
                        if (lingua != config.linguagem) {
                            if (ui.confirmar("Tu queres alterar a língua para: " + lingua, "")) {
                                if (lingua == "pt-br") {
                                    config.separadorDecimal = true
                                    config.acentos = true
                                } else if (lingua == "en") {
                                    config.separadorDecimal = false
                                    config.acentos = false
                                }

                                config.linguagem = lingua

                                // Para alterar o HTML também, conforme a língua
                                document.title = ((config.linguagem == "en") ? "Mathematical Function Analyzer" : "Analisador de Funções Matemáticas")
                                document.querySelector("h1").textContent = ((config.linguagem == "en") ? "Mathematics" : "Matemática")
                                document.documentElement.lang = config.linguagem
                            }
                        }
                    }

                    // Comandos
                    else if (escolha == 6) {

                    }
                }
            } while (escolha != 0)
        }

        // Rever
        else if ((state.tipo == 8)) { //  || (state.tipo == "rever")) {
            ui.exibir("Valores:\n“a” = " + escrita.decimal(state.globalA) + "\n“b” = " + escrita.decimal(state.globalB) + "\n“c” = " + escrita.decimal(state.globalC))
            state.loop = true
        }

        // Mudar
        else if ((state.tipo == 9)) { //  || (state.tipo == "alterar")) {
            state.loop = true
            state.pedirCoefs = true
        }

        // Sair
        else if ((state.tipo == 0)) { // || (state.tipo == "sair")) {
            if (config.confirmacoesSaida) {
                state.loop = !(ui.confirmar("Tu queres sair?", "Obs.: Configurações voltarão ao padrão caso saias"))
            } else {
                state.loop = false
            }
        }
    }

    // Erro
    else {
        state.loop = true
    }
} while (state.loop)
