import { Algebra } from "./algebra.js"
import { Escrita } from "./escrita.js"
import { Helpers } from "./helpers.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Comandos } from "./comandos.js"

let opcoesBase = [
        "Domínio",
        "Imagem",
        "Interseção com o eixo x",
        "Interseção com o eixo y",
        "Valores para x",
        "Valores para y",
        "Estudo do sinal",
        "Equações entre funções",
    ],
    opcoesConst = [].concat(opcoesBase),
    opcoesAfim = ["Inclinação", "Raiz"].concat(opcoesBase),
    opcoesQuad = ["Concavidade", "Raízes", "Vértice"].concat(opcoesBase),
    opcoesExp = ["Curva", "Raiz", "Assíntota"].concat(opcoesBase),
    opcoesLog = ["Curva", "Raiz"].concat(opcoesBase)
// opcoesSen = ["Amplitude", "Período"].concat(opcoesBase),
// opcoesCos = ["Amplitude", "Período"].concat(opcoesBase),
// opcoesTan = ["Assíntotas verticais", "Período"].concat(opcoesBase)

/**
 * [FUNÇÃO] Objeto base para as funções envolvendo funções matemáticas, seus estudos e características
 * - Use as funções aqui para montar as funções constantes, afins, quadráticas, etc.
 * @since v6.1.0
 */
export const Analisar = {
    /**
     * [FUNÇÃO] Monta uma função constante: ƒ(x) = c
     * @param {number} coefC - Coeficiente c da função constante
     * @returns {number[]} - Retorna: [coefC]
     * @since v6.1.0
     */
    constante(coefC = State.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        Ui.funcao(0, 0, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = Ui.menu(opcoesConst, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]
            if (Comandos.nomes().includes(menuResp[0])) {
                opcao = 0
                pagina = 1
            }

            // Página 1
            if (pagina == 1) {
                // Domínio
                if (opcao == 1) {
                    Helpers.dominio()
                }

                // Imagem
                else if (opcao == 2) {
                    Helpers.imagem("= " + Escrita.decimal(coefC), ".", "A função só tem esse valor de y, pois y = c")
                }

                // Interseção com o eixo x
                else if (opcao == 3) {
                    Helpers.eixoX("0", coefC)
                }

                // Interseção com o eixo y
                else if (opcao == 4) {
                    Helpers.eixoY(coefC, "c", "c")
                }

                // Valores para x
                else if (opcao == 5) {
                    Helpers.valoresX(0, 0, coefC)
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Valores para y
                if (opcao == 1) {
                    Helpers.valoresY(0, 0, coefC)
                }

                // Estudo do sinal
                else if (opcao == 2) {
                    Helpers.sinal(0, 0, coefC)
                }

                // Equações
                else if (opcao == 3) {
                    opcao = Helpers.equacoes(true, 0, 0, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                Ui.funcao(0, 0, coefC, false, false, 0, true)
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return [coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função afim: ƒ(x) = bx + c
     * @param {number} coefB - Coeficiente b da função afim
     * @param {number} coefC - Coeficiente c da função afim
     * @returns {number[]} - Retorna: [coefB, coefC]
     * @since v6.1.0
     */
    afim(coefB = State.globalB, coefC = State.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        Ui.funcao(0, coefB, coefC)

        // Cálculo
        let raiz = Helpers.calcRaiz(0, coefB, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = Ui.menu(opcoesAfim, pagina)
            pagina = menuResp[1]
            opcao = menuResp[0]
            if (Comandos.nomes().includes(menuResp[0])) {
                opcao = 0
                pagina = 1
            }

            // Página 1
            if (pagina == 1) {
                // Inclinação
                if (opcao == 1) {
                    Helpers.curva(0, coefB)
                }

                // Raiz
                else if (opcao == 2) {
                    Helpers.exibRaiz(raiz, "(−c) / b")
                }

                // Domínio
                else if (opcao == 3) {
                    Helpers.dominio()
                }

                // Imagem
                else if (opcao == 4) {
                    Helpers.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    Helpers.eixoX(raiz, "(−c) / b")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    Helpers.eixoY(coefC, "bx + c", "c")
                }

                // Valores para x
                else if (opcao == 2) {
                    Helpers.valoresX(0, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 3) {
                    Helpers.valoresY(0, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    Helpers.sinal(0, coefB, coefC)
                }

                // Equações
                else if (opcao == 5) {
                    opcao = Helpers.equacoes(true, 0, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                Ui.funcao(0, coefB, coefC, false, false, 0, true)
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return [coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função quadrática: ƒ(x) = ax² + bx + c
     * @param {number} coefA - Coeficiente a da função quadrática
     * @param {number} coefB - Coeficiente b da função quadrática
     * @param {number} coefC - Coeficiente c da função quadrática
     * @returns {number[]} - Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    quadratica(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        Ui.funcao(coefA, coefB, coefC)

        // Cálculo
        let delta = Helpers.calcDelta(coefA, coefB, coefC),
            vertice = Helpers.vertice(coefA, coefB, delta[0])

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = Ui.menu(opcoesQuad, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]
            if (Comandos.nomes().includes(menuResp[0])) {
                opcao = 0
                pagina = 1
            }

            // Página 1
            if (pagina == 1) {
                // Concavidade
                if (opcao == 1) {
                    Helpers.curva(coefA)
                }

                // Raízes
                else if (opcao == 2) {
                    Helpers.exibDelta(
                        delta[0],
                        "Não há raízes reais.",
                        "Raiz real: x₁ = x₂ = " + Escrita.decimal(delta[1]),
                        "Raízes reais: x₁ = " + Escrita.decimal(delta[1]) + ", x₂ = " + Escrita.decimal(delta[2]),
                    )
                }

                // Vértice
                else if (opcao == 3) {
                    Ui.exibir(
                        "Vértice: (" + Escrita.decimal(vertice[0]) + ", " + Escrita.decimal(vertice[1]) + ")",
                        "Ponto mais baixo (ou mais alto, conforme a concavidade) da função. Ponto (-b / (2 · a), -Δ / (4 · a))",
                    )
                }

                // Domínio
                else if (opcao == 4) {
                    Helpers.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefA > 0) {
                        Helpers.imagem("∈ [" + Escrita.decimal(vertice[1]) + ", ∞)", " entre o vértice e o ∞.")
                    } else if (coefA < 0) {
                        Helpers.imagem("∈ (-∞, " + Escrita.decimal(vertice[1]) + "]", " entre -∞ e o vértice.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    Helpers.exibDelta(
                        delta[0],
                        "Não há interseção com o eixo x.",
                        "Interseção com o eixo x: (" + Escrita.decimal(delta[1]) + ", 0)",
                        "Interseções com o eixo x: (" +
                            Escrita.decimal(delta[1]) +
                            ", 0) e (" +
                            Escrita.decimal(delta[2]) +
                            ", 0)",
                    )
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    Helpers.eixoY(coefC, "ax² + bx + c", "c")
                }

                // Valores para x
                else if (opcao == 3) {
                    Helpers.valoresX(coefA, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 4) {
                    Helpers.valoresY(coefA, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    Helpers.sinal(coefA, coefB, coefC)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    opcao = Helpers.equacoes(true, coefA, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                Ui.funcao(coefA, coefB, coefC, false, false, 0, true)
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função exponencial: ƒ(x) = b × aˣ + c
     * @param {number} coefA - Coeficiente a da função exponencial
     * @param {number} coefB - Coeficiente b da função exponencial
     * @param {number} coefC - Coeficiente c da função exponencial
     * @returns {number[]} - Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    exponencial(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        Ui.funcao(coefA, coefB, coefC, true)

        // Cálculo
        let raiz = Helpers.calcRaiz(coefA, coefB, coefC, true)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = Ui.menu(opcoesExp, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]
            if (Comandos.nomes().includes(menuResp[0])) {
                opcao = 0
                pagina = 1
            }

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    Helpers.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    Helpers.exibRaiz(raiz, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Assíntota
                else if (opcao == 3) {
                    Ui.exibir("Assíntota horizontal: y = " + Escrita.decimal(coefC), "y = c")
                }

                // Domínio
                else if (opcao == 4) {
                    Helpers.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefB > 0) {
                        Helpers.imagem("∈ (" + Escrita.decimal(coefC) + ", ∞)", " entre c e ∞, exceto o próprio c.")
                    } else {
                        Helpers.imagem("∈ (-∞, " + Escrita.decimal(coefC) + ")", " entre -∞ e c, exceto o próprio c.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    Helpers.eixoX(raiz, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    Helpers.eixoY(coefB + coefC, "b × aˣ + c", "b + c")
                }

                // Valores para x
                else if (opcao == 3) {
                    Helpers.valoresX(coefA, coefB, coefC, true)
                }

                // Valores para y
                else if (opcao == 4) {
                    Helpers.valoresY(coefA, coefB, coefC, true)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    Helpers.sinal(coefA, coefB, coefC, true)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    Helpers.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                Ui.funcao(coefA, coefB, coefC, true, false, 0, true)
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta a função logarítmica: b × logₐ(x) + c
     * @param {number} coefA - Coeficiente a da função logarítmica
     * @param {number} coefB - Coeficiente b da função logarítmica
     * @param {number} coefC - Coeficiente c da função logarítmica
     * @returns {number[]} - Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    logaritmica(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        Ui.funcao(coefA, coefB, coefC, false, true)

        // Cálculo
        let raiz = Algebra.arredonda(coefA ** Algebra.divisao(-coefC, coefB, false))

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = Ui.menu(opcoesLog, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]
            if (Comandos.nomes().includes(menuResp[0])) {
                opcao = 0
                pagina = 1
            }

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    Helpers.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    Helpers.exibRaiz(raiz, "a⁽⁻ᶜ⁄ᵇ⁾")
                }

                // Domínio
                else if (opcao == 3) {
                    Helpers.dominio("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Imagem
                else if (opcao == 4) {
                    Helpers.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    Helpers.eixoX(raiz, "a⁽⁻ᶜ⁄ᵇ⁾")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    Helpers.eixoY("∄", "b × logₐ(x) + c", " x = 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Valores para x
                else if (opcao == 2) {
                    Helpers.valoresX(coefA, coefB, coefC, false, true)
                }

                // Valores para y
                else if (opcao == 3) {
                    Helpers.valoresY(coefA, coefB, coefC, false, true)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    Helpers.sinal(coefA, coefB, coefC, false, true)
                }

                // Equações
                else if (opcao == 5) {
                    Helpers.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                Ui.funcao(coefA, coefB, coefC, false, true, 0, true)
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return [coefA, coefB, coefC]
    },

    /*
    seno(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        ui.funcao(coefA, coefB, coefC, false, false, 1)
    },

    cosseno(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        ui.funcao(coefA, coefB, coefC, false, false, 2)
    },

    tangente(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0,
            pagina = 1,
            menuResp = [0, ""]

        // Mostra
        ui.funcao(coefA, coefB, coefC, false, false, 3)
    }, */
}
