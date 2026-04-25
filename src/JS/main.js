import { Algebra } from "./algebra.js"
import { Analisar } from "./analisar.js"
import { loadConfig, Config, DEFAULT_CONFIG, saveConfig, VERSION } from "./config.js"
import { Error } from "./erro.js"
import { Escrita } from "./escrita.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Comandos } from "./comandos.js"

console.log(
    "" +
        "====================================================" +
        "\n" +
        "Mathematical Function Analyzer / Analisador de Funções Matemáticas — " +
        VERSION +
        "\n" +
        "All rights reserved / Todos os direitos reservados © Adriano Lima 2025 — 2026" +
        "\n" +
        "====================================================",
)

// Carregar as configurações
loadConfig()

// Introdução
Ui.exibir(
    "Bem-vindo ao Analisador de Funções Matemáticas!",
    "Este programa analisa funções do tipo constante, afim, quadrática, exponencial e logarítmica — identificando suas propriedades e características. Para começar, informe os dados da função quando solicitado.",
)

// === OBJETOS GLOBAIS ===
// Para alterar o HTML também, conforme a língua
document.title = Config.linguagem == "en" ? "Mathematical Function Analyzer" : "Analisador de Funções Matemáticas"
document.querySelector("h1").textContent = Config.linguagem == "en" ? "Mathematics" : "Matemática"
document.documentElement.lang = Config.linguagem

let subType = 0,
    loopSub = false,
    escolha = 0,
    pagina = 1

;((State.globalA = Algebra.variaveis("a")),
    (State.globalB = Algebra.variaveis("b")),
    (State.globalC = Algebra.variaveis("c")))

// Código principal
do {
    // Variáveis globais
    if (State.askCoeffs) {
        State.globalA = Algebra.variaveis("a")
        State.globalB = Algebra.variaveis("b")
        State.globalC = Algebra.variaveis("c")
    }

    // Salva histórico
    if (
        State.globalA != State.funcAtual[0] ||
        State.globalB != State.funcAtual[1] ||
        State.globalC != State.funcAtual[2]
    ) {
        ;((State.funcAtual = [State.globalA, State.globalB, State.globalC]),
            State.history.push(State.funcAtual.slice()))
        if (State.history.length > 9) {
            State.history.shift()
        }
    }

    // Tipo de função
    if (!State.keepType || State.type == "inicio") {
        State.type = Ui.entrada(
            "=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair",
            "",
            true,
            0,
            true,
        )
    }

    State.keepType = false
    State.askCoeffs = false
    State.loop = false

    if (
        (0 <= State.type && State.type <= 2) ||
        (6 <= State.type && State.type <= 9) ||
        Comandos.nomes().includes(State.type)
    ) {
        // Polinomiais
        if (State.type == 1) {
            // Incógnitas
            if (!isFinite(State.globalA) || !isFinite(State.globalB) || !isFinite(State.globalC)) {
                State.coefficients = Algebra.incognita(State.globalA, State.globalB, State.globalC)
                State.globalA = Algebra.arredonda(State.coefficients[0])
                State.globalB = Algebra.arredonda(State.coefficients[1])
                State.globalC = Algebra.arredonda(State.coefficients[2])
            }

            // Números
            if (isFinite(State.globalA) && isFinite(State.globalB) && isFinite(State.globalC)) {
                if (State.globalA == 0 && State.globalB == 0) {
                    Analisar.constante(State.globalC)
                } else if (State.globalA == 0 && State.globalB != 0) {
                    Analisar.afim(State.globalB, State.globalC)
                } else if (State.globalA != 0) {
                    Analisar.quadratica(State.globalA, State.globalB, State.globalC)
                }
            }
        }

        // Não polinomial
        else if (State.type == 2) {
            // Loop do menu
            do {
                subType = Ui.entrada(
                    "=== Menu ===\nO que queres?\n1 = Função exponencial\n2 = Função logarítmica\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar",
                    "",
                    true,
                    0,
                    true,
                )

                loopSub = false

                if (
                    (0 <= subType && subType <= 2) ||
                    (6 <= subType && subType <= 9) ||
                    Comandos.nomes().includes(subType)
                ) {
                    // Exponencial
                    if (subType == 1) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.incognita(State.globalA, State.globalB, State.globalC, true)
                            State.globalA = Algebra.arredonda(State.coefficients[0])
                            State.globalB = Algebra.arredonda(State.coefficients[1])
                            State.globalC = Algebra.arredonda(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA > 0 && State.globalA != 1 && State.globalB != 0) {
                                Analisar.exponencial(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunc("exponencial")

                                if (State.globalA == 1) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (State.globalA < 0) {
                                Error.invalidFunc("exponencial")

                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subType == 2) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.incognita(
                                State.globalA,
                                State.globalB,
                                State.globalC,
                                false,
                                true,
                            )
                            State.globalA = Algebra.arredonda(State.coefficients[0])
                            State.globalB = Algebra.arredonda(State.coefficients[1])
                            State.globalC = Algebra.arredonda(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA > 0 && State.globalA != 1 && State.globalB != 0) {
                                Analisar.logaritmica(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunc("logarítmica")
                                if (State.globalA == 1) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (State.globalA < 0) {
                                Error.invalidFunc("logarítmica")
                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subType && subType <= 9) || Comandos.nomes().includes(subType)) {
                        State.type = subType
                        State.loop = true
                        if (subType != "sair") {
                            State.keepType = true
                        }
                    }

                    // Voltar
                    else if (subType == 0) {
                        State.loop = true
                    }
                }

                // Error
                else {
                    loopSub = true
                }
            } while (loopSub)
        }

        // Histórico
        else if (State.type == 6 || State.type == "historico") {
            State.loop = true

            // Error de histórico
            if (State.history.length == 1) {
                Ui.exibir(
                    "Não há histórico o suficiente para mudanças.",
                    "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função.",
                )
            } else {
                let mensagem = "=== Histórico ===\nO que queres?\n",
                    resposta = 0,
                    opcao = 1

                // Mostra histórico
                for (let func = State.history.length - 1; func >= 0; func--) {
                    mensagem +=
                        String(opcao) +
                        " ⇒ “a” = " +
                        Escrita.decimal(State.history[func][0]) +
                        "; “b” = " +
                        Escrita.decimal(State.history[func][1]) +
                        "; “c” = " +
                        Escrita.decimal(State.history[func][2]) +
                        "\n"
                    opcao++
                }

                // Escolha
                resposta = Ui.intervalo(mensagem, "", 0, State.history.length - 1)

                // Restaura função
                let indice = State.history.length - 1 - resposta
                ;((State.globalA = State.history[indice][0]),
                    (State.globalB = State.history[indice][1]),
                    (State.globalC = State.history[indice][2]))
                if (
                    State.globalA != State.funcAtual[0] ||
                    State.globalB != State.funcAtual[1] ||
                    State.globalC != State.funcAtual[2]
                ) {
                    State.funcAtual = [State.globalA, State.globalB, State.globalC]
                }
            }
        }

        // Configurações
        else if (State.type == 7 || State.type == "config") {
            pagina = 1
            // Loop
            do {
                State.type = -1
                State.loop = true

                // Menu de configurações
                let opcoesConfig = [
                    Escrita.itemConfig("Caracteres Unicode", "unicode"),
                    Escrita.itemConfig("Explicações", "explicacoes"),
                    Escrita.itemConfig("Acentos", "acentos"),
                    Escrita.itemConfig("Capitalizadas", "capitalizadas"),
                    Escrita.itemConfig("Maiúsculas", "maiusculas"),
                    Escrita.itemConfig("Minúsculas", "minusculas"),

                    Escrita.itemConfig("Ponto decimal", "separadorDecimal"),
                    Escrita.itemConfig("Multiplicação simples", "multiSimples"),
                    Escrita.itemConfig("Confirmações de entrada", "confirmacoesEntrada"),
                    Escrita.itemConfig("Confirmações de saída", "confirmacoesSaida"),
                    Escrita.itemConfig("Mensagens de erro", "erros"),
                    Escrita.itemConfig("Mostrar função", "mostrarFuncao"),

                    Escrita.itemConfig("Casas decimais", "casasDecimais"),
                    Escrita.itemConfig("Precisão do log", "logPrecisao"),
                    Escrita.itemConfig("Precisão da divisão", "divPrecisao"),
                    Escrita.itemConfig("Limite de interações", "limiteInteracoes"),
                    Escrita.itemConfig("Linguagem", "linguagem"),
                ]

                // Preenche com separadores
                while (opcoesConfig.length % 6 != 0 || opcoesConfig.length == 0) {
                    opcoesConfig.push("---")
                }
                let total = Math.ceil(opcoesConfig.length / 6),
                    opcao = 1

                // Controla página
                if (pagina < 1) {
                    pagina = 1
                } else if (pagina > total) {
                    pagina = total
                }

                // Mostra opções
                let texto =
                    "=== Configurações ===\nPágina " +
                    String(pagina) +
                    "/" +
                    String(total) +
                    "\nObs.: Configurações não são salvas ao fechar"
                while (opcao <= 6) {
                    texto += "\n" + String(opcao) + " = " + String(opcoesConfig[opcao - 1 + 6 * (pagina - 1)])
                    opcao++
                }
                opcao = 1
                texto += "\n----------------\n7 = Restaurar padrão | 8 = Anterior | 9 = Próxima | 0 = Voltar"

                // Escolha
                escolha = Ui.intervalo(texto, "", 0, 9, 0, true)
                if (escolha == 7) {
                    // Padrão
                    if (JSON.stringify(Config) == JSON.stringify(DEFAULT_CONFIG)) {
                        Ui.aviso("Todas as configurações já estão na forma padrão.", "Não há necessidade de restaurar.")
                    } else {
                        let mensagem = "Voltar às configurações padrão?\nConfigurações afetadas:\n",
                            chaves = Object.keys(Config)

                        // Mostra configurações afetadas
                        for (let i = 0; i < chaves.length; i++) {
                            mensagem += Config[chaves[i]] != DEFAULT_CONFIG[chaves[i]] ? chaves[i] + ", " : ""
                        }

                        // Remove última vírgula e espaço
                        mensagem = mensagem.slice(0, -2)

                        // Confirmação
                        if (
                            Ui.aviso(
                                mensagem,
                                "Obs.₁: Isso irá afetar todas as configurações acima\nObs.₂: Essa alteração é permanente",
                                true,
                            )
                        ) {
                            for (let i = 0; i < chaves.length; i++) {
                                Config[chaves[i]] = DEFAULT_CONFIG[chaves[i]]
                            }
                        }
                    }
                } else if (escolha == 8) {
                    // -1
                    escolha = -1
                    pagina -= 1
                } else if (escolha == 9) {
                    // +1
                    escolha = -1
                    pagina += 1
                } else if (escolha == "config") {
                    escolha = -1
                } else if (escolha == "sair") {
                    escolha = 0
                    State.type = "sair"
                }

                // Página 1
                if (pagina == 1) {
                    // Unicode
                    if (escolha == 1) {
                        Config.unicode = Ui.confirmar(
                            Escrita.itemConfig("Ativar caracteres Unicode?", "unicode"),
                            "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações",
                        )
                    }

                    // Explicações
                    else if (escolha == 2) {
                        Config.explicacoes = Ui.confirmar(
                            Escrita.itemConfig("Ativar explicações?", "explicacoes"),
                            "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c",
                        )
                    }

                    // Acentos
                    else if (escolha == 3) {
                        Config.acentos = Ui.confirmar(
                            Escrita.itemConfig("Ativar acentos?", "acentos"),
                            "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação",
                        )
                    }

                    // Capitalizadas
                    else if (escolha == 4) {
                        Config.capitalizadas = Ui.confirmar(
                            Escrita.itemConfig("Ativar letras capitalizadas?", "capitalizadas"),
                            "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas\nObs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”",
                        )
                        if (Config.capitalizadas) {
                            Config.minusculas = false
                            Config.maiusculas = false
                        } else if (!Config.maiusculas && !Config.minusculas) {
                            Config.capitalizadas = true
                        }
                    }

                    // Maiúsculas
                    else if (escolha == 5) {
                        Config.maiusculas = Ui.confirmar(
                            Escrita.itemConfig("Ativar todas as letras maiúsculas?", "maiusculas"),
                            "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”",
                        )
                        if (Config.maiusculas) {
                            Config.capitalizadas = false
                            Config.minusculas = false
                        } else if (!Config.minusculas && !Config.capitalizadas) {
                            Config.capitalizadas = true
                        }
                    }

                    // Minúsculas
                    else if (escolha == 6) {
                        Config.minusculas = Ui.confirmar(
                            Escrita.itemConfig("Ativar todas as letras minúsculas?", "minusculas"),
                            "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”",
                        )
                        if (Config.minusculas) {
                            Config.capitalizadas = false
                            Config.maiusculas = false
                        } else if (!Config.maiusculas && !Config.capitalizadas) {
                            Config.capitalizadas = true
                        }
                    }
                }

                // Página 2
                else if (pagina == 2) {
                    // Ponto decimal
                    if (escolha == 1) {
                        Config.separadorDecimal = Ui.confirmar(
                            Escrita.itemConfig("Alterar ponto decimal?", "separadorDecimal"),
                            "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: " +
                                Escrita.decimal(123.456) +
                                "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”",
                        )
                    }

                    // Multiplicação simples
                    else if (escolha == 2) {
                        Config.multiSimples = Ui.confirmar(
                            Escrita.itemConfig("Alterar para multiplicação simples?", "multiSimples"),
                            "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em “*”\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”",
                        )
                    }

                    // Confirmações de entrada
                    else if (escolha == 3) {
                        Config.confirmacoesEntrada = Ui.confirmar(
                            Escrita.itemConfig("Ativar confirmações de entrada?", "confirmacoesEntrada"),
                            "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada",
                        )
                    }

                    // Confirmações de saída
                    else if (escolha == 4) {
                        Config.confirmacoesSaida = Ui.confirmar(
                            Escrita.itemConfig("Ativar confirmações de saída?", "confirmacoesSaida"),
                            "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa",
                        )
                    }

                    // Errors
                    else if (escolha == 5) {
                        Config.erros = Ui.confirmar(
                            Escrita.itemConfig("Ativar mensagens de erro?", "erros"),
                            "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo",
                        )
                    }

                    // Função
                    else if (escolha == 6) {
                        Config.mostrarFuncao = Ui.confirmar(
                            Escrita.itemConfig("Ativar exibição da função?", "mostrarFuncao"),
                            "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)",
                        )
                    }
                }

                // Página 3
                else if (pagina == 3) {
                    // Casas decimais
                    if (escolha == 1) {
                        Config.casasDecimais = Ui.intervalo(
                            Escrita.itemConfig("Quantas casas decimais?", "casasDecimais"),
                            "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas\nObs.₂: Os números já digitados serão arredondados para o novo número de casas decimais",
                            3,
                            10,
                        )

                        // Arredonda novamente
                        if (State.globalA != "a") {
                            State.globalA = Algebra.arredonda(State.globalA)
                        }
                        if (State.globalB != "b") {
                            State.globalB = Algebra.arredonda(State.globalB)
                        }
                        if (State.globalC != "c") {
                            State.globalC = Algebra.arredonda(State.globalC)
                        }
                    }

                    // Precisão do log
                    else if (escolha == 2) {
                        Config.logPrecisao = Ui.intervalo(
                            Escrita.itemConfig("Qual a precisão do log?", "logPrecisao"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20,
                        )
                    }

                    // Precisão da divisão
                    else if (escolha == 3) {
                        Config.divPrecisao = Ui.intervalo(
                            Escrita.itemConfig("Qual a precisão da divisão?", "divPrecisao"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20,
                        )
                    }

                    // Limite de interações
                    else if (escolha == 4) {
                        Config.limiteInteracoes = Ui.intervalo(
                            Escrita.itemConfig("Qual o limite de interações?", "limiteInteracoes"),
                            "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                            100,
                            10000,
                        )
                    }

                    // Línguagem
                    else if (escolha == 5) {
                        let pergunta = Ui.intervalo(
                                Escrita.itemConfig("Qual língua?", "linguagem") +
                                    "\n1 = Português Brasileiro\n2 = Inglês",
                                "Obs.: Isso irá alterar a língua do sistema inteiro.",
                                1,
                                2,
                                0,
                            ),
                            lingua = pergunta == 1 ? "pt-br" : "en"
                        if (lingua != Config.linguagem) {
                            if (Ui.confirmar("Tu queres alterar a língua para: " + lingua, "")) {
                                if (lingua == "pt-br") {
                                    Config.separadorDecimal = true
                                    Config.acentos = true
                                } else if (lingua == "en") {
                                    Config.separadorDecimal = false
                                    Config.acentos = false
                                }

                                Config.linguagem = lingua

                                // Para alterar o HTML também, conforme a língua
                                document.title =
                                    Config.linguagem == "en"
                                        ? "Mathematical Function Analyzer"
                                        : "Analisador de Funções Matemáticas"
                                document.querySelector("h1").textContent =
                                    Config.linguagem == "en" ? "Mathematics" : "Matemática"
                                document.documentElement.lang = Config.linguagem
                            }
                        }
                    }

                    /* Comandos
                    else if (escolha == 6) {
                    } */
                }

                // Salvar as configurações
                saveConfig()
            } while (escolha != 0)
        }

        // Rever
        else if (State.type == 8 || State.type == "rever") {
            Ui.exibir(
                "Valores:\n“a” = " +
                    Escrita.decimal(State.globalA) +
                    "\n“b” = " +
                    Escrita.decimal(State.globalB) +
                    "\n“c” = " +
                    Escrita.decimal(State.globalC),
            )
            State.loop = true
        }

        // Mudar
        else if (State.type == 9 || State.type == "alterar") {
            State.loop = true
            State.askCoeffs = true
        }

        // Sair
        else if (State.type == 0 || State.type == "sair") {
            if (Config.confirmacoesSaida) {
                State.loop = !Ui.confirmar("Tu queres sair?", "Obs.: Configurações poderão voltar ao padrão caso saias")
            } else {
                State.loop = false
            }
        }
    }

    // Error
    else {
        State.loop = true
    }
} while (State.loop)
