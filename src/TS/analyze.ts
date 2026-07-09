import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
import { Helpers } from "./helpers.js"
import { tr, trArr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

import type { CommandsNames, Numeric } from "./values.js"

const BASE_OPTIONS: [string, string][] = [
    ["Domínio", "Domain"],
    ["Imagem", "Range"],
    ["Interseção com o eixo x", "X‐axis intersection"],
    ["Interseção com o eixo y", "Y‐axis intersection"],
    ["Valores para x", "X values"],
    ["Valores para y", "Y values"],
    ["Estudo do sinal", "Sign analysis"],
    ["Equações entre funções", "Function equations"],
]

/**
 * [FUNÇÃO] Objeto base para as funções envolvendo funções matemáticas, seus estudos e características
 * - Use as funções aqui para montar as funções constantes, afins, quadráticas, etc.
 * @since v6.1.0
 */
export const Analyze = {
    /**
     * [FUNÇÃO] Monta uma função constante: ƒ(x) = c
     * @param coefC - Coeficiente c da função constante
     * @returns Retorna: [coefC]
     * @since v6.1.0
     */
    constant(coefC: Numeric = State.globalC as Numeric): Numeric[] {
        let option: Numeric = 0,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(0, 0, coefC)

        // Loop
        let limit: Numeric = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr(BASE_OPTIONS.slice()), page)
            option = menuResp[0] as Numeric
            page = menuResp[1]
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                // Domínio
                if (option == 1) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 2) {
                    Helpers.range(
                        "= " + Writing.decimal(coefC),
                        ".",
                        "y = c ⇒ ƒ(x) " + tr("assume apenas esse valor", "takes only this value")
                    )
                }

                // Interseção com o eixo x
                else if (option == 3) {
                    Helpers.xAxis(0, String(coefC))
                }

                // Interseção com o eixo y
                else if (option == 4) {
                    Helpers.yAxis(coefC, "c", "c")
                }

                // Valores para x
                else if (option == 5) {
                    Helpers.xValues(0, 0, coefC)
                }
            }

            // Página 2
            else if (page == 2) {
                // Valores para y
                if (option == 1) {
                    Helpers.yValues(0, 0, coefC)
                }

                // Estudo do sinal
                else if (option == 2) {
                    Helpers.sign(0, 0, coefC)
                }

                // Equações
                else if (option == 3) {
                    option = Helpers.equations(true, 0, 0, coefC)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(0, 0, coefC, false, false, "", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função afim: ƒ(x) = bx + c
     * @param coefB - Coeficiente b da função afim
     * @param coefC - Coeficiente c da função afim
     * @returns Retorna: [coefB, coefC]
     * @since v6.1.0
     */
    affine(coefB: Numeric = State.globalB as Numeric, coefC: Numeric = State.globalC as Numeric): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(0, coefB, coefC)

        // Cálculo
        let root: Numeric = Helpers.calcRoot(0, coefB, coefC) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr([["Inclinação", "Slope"], ["Raiz", "Root"], ...BASE_OPTIONS]), page)
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                // Inclinação
                if (option == 1) {
                    Helpers.curve(0, coefB)
                }

                // Raiz
                else if (option == 2) {
                    Helpers.showRoot(root, "(−c) / b")
                }

                // Domínio
                else if (option == 3) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 4) {
                    Helpers.range()
                }

                // Interseção com o eixo x
                else if (option == 5) {
                    Helpers.xAxis(root, "(−c) / b")
                }
            }

            // Página 2
            else if (page == 2) {
                // Interseção com o eixo y
                if (option == 1) {
                    Helpers.yAxis(coefC, "bx + c", "c")
                }

                // Valores para x
                else if (option == 2) {
                    Helpers.xValues(0, coefB, coefC)
                }

                // Valores para y
                else if (option == 3) {
                    Helpers.yValues(0, coefB, coefC)
                }

                // Estudo do sinal
                else if (option == 4) {
                    Helpers.sign(0, coefB, coefC)
                }

                // Equações
                else if (option == 5) {
                    option = Helpers.equations(true, 0, coefB, coefC)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(0, coefB, coefC, false, false, "", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função quadrática: ƒ(x) = ax² + bx + c
     * @param coefA - Coeficiente a da função quadrática
     * @param coefB - Coeficiente b da função quadrática
     * @param coefC - Coeficiente c da função quadrática
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    quadratic(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC)

        // Cálculo
        let delta: Numeric[] = Helpers.calcDelta(coefA, coefB, coefC),
            vertex: Numeric[] = Helpers.vertex(coefA, coefB, delta[0])

        // Loop
        let limit: Numeric = 0
        do {
            // Menu
            menuResp = Ui.menu(
                trArr([["Concavidade", "Concavity"], ["Raízes", "Roots"], ["Vértice", "Vertex"], ...BASE_OPTIONS]),
                page
            )
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                // Concavidade
                if (option == 1) {
                    Helpers.curve(coefA)
                }

                // Raízes
                else if (option == 2) {
                    Helpers.showDelta(
                        delta[0],
                        tr("Não há raízes reais.", "There are no real roots"),
                        tr("Raiz real: ", "Real root: ") + "x₁ = x₂ = " + Writing.decimal(delta[1]),
                        tr("Raízes reais: ", "Real roots: ") +
                            "x₁ = " +
                            Writing.decimal(delta[1]) +
                            ", x₂ = " +
                            Writing.decimal(delta[2])
                    )
                }

                // Vértice
                else if (option == 3) {
                    Ui.display(
                        tr("Vértice: ", "Vertex: ") +
                            "(" +
                            Writing.decimal(vertex[0]) +
                            ", " +
                            Writing.decimal(vertex[1]) +
                            ")",
                        tr(
                            "Ponto mais baixo (ou mais alto, conforme a concavidade) da função.",
                            "Lowest (or highest, depending on concavity) point of the function"
                        ) +
                            "\n" +
                            tr("Ponto: ", "Point: ") +
                            "(-b / (2 · a), -Δ / (4 · a))"
                    )
                }

                // Domínio
                else if (option == 4) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 5) {
                    if (coefA > 0) {
                        Helpers.range(
                            "∈ [" + Writing.decimal(vertex[1]) + ", ∞)",
                            tr(" entre o vértice e o ∞.", " between the vertex and the ∞.")
                        )
                    } else if (coefA < 0) {
                        Helpers.range(
                            "∈ (-∞, " + Writing.decimal(vertex[1]) + "]",
                            tr(" entre -∞ e o vértice.", " between the -∞ and the vertex")
                        )
                    }
                }
            }

            // Página 2
            else if (page == 2) {
                // Interseção com o eixo x
                if (option == 1) {
                    Helpers.showDelta(
                        delta[0],
                        tr("Não há interseção com o eixo x.", "There is no intersection with the x‐axis"),
                        tr("Interseção com o eixo x: ", "Intersection with the x‐axis: ") +
                            "(" +
                            Writing.decimal(delta[1]) +
                            ", 0)",
                        tr("Interseções com o eixo x: ", "Intersections with the x‐axis: ") +
                            "(" +
                            Writing.decimal(delta[1]) +
                            ", 0), (" +
                            Writing.decimal(delta[2]) +
                            ", 0)"
                    )
                }

                // Interseção com o eixo y
                else if (option == 2) {
                    Helpers.yAxis(coefC, "ax² + bx + c", "c")
                }

                // Valores para x
                else if (option == 3) {
                    Helpers.xValues(coefA, coefB, coefC)
                }

                // Valores para y
                else if (option == 4) {
                    Helpers.yValues(coefA, coefB, coefC)
                }

                // Estudo do sinal
                else if (option == 5) {
                    Helpers.sign(coefA, coefB, coefC)
                }
            }

            // Página 3
            else if (page == 3) {
                // Equações
                if (option == 1) {
                    option = Helpers.equations(true, coefA, coefB, coefC)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta uma função exponencial: ƒ(x) = b × aˣ + c
     * @param coefA - Coeficiente a da função exponencial
     * @param coefB - Coeficiente b da função exponencial
     * @param coefC - Coeficiente c da função exponencial
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    exponential(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC, true)

        // Cálculo
        let root: Numeric = Helpers.calcRoot(coefA, coefB, coefC, true) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            // Menu
            menuResp = Ui.menu(
                trArr([["Curva", "Curve"], ["Raiz", "Root"], ["Assíntota", "Asymptote"], ...BASE_OPTIONS]),
                page
            )
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                // Curva
                if (option == 1) {
                    Helpers.curve(coefA, coefB, false)
                }

                // Raiz
                else if (option == 2) {
                    Helpers.showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Assíntota
                else if (option == 3) {
                    Ui.display(
                        tr("Assíntota horizontal: ", "Horizontal asymptote: ") + "y = " + Writing.decimal(coefC),
                        "y = c"
                    )
                }

                // Domínio
                else if (option == 4) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 5) {
                    if (coefB > 0) {
                        Helpers.range(
                            "∈ (" + Writing.decimal(coefC) + ", ∞)",
                            tr(" entre c e ∞, exceto o próprio c.", " between c and ∞, excluding c itself")
                        )
                    } else {
                        Helpers.range(
                            "∈ (-∞, " + Writing.decimal(coefC) + ")",
                            tr(" entre -∞ e c, exceto o próprio c.", " between -∞ and c, excluding c itself")
                        )
                    }
                }
            }

            // Página 2
            else if (page == 2) {
                // Interseção com o eixo x
                if (option == 1) {
                    Helpers.xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Interseção com o eixo y
                else if (option == 2) {
                    Helpers.yAxis(coefB + coefC, "b × aˣ + c", "b + c")
                }

                // Valores para x
                else if (option == 3) {
                    Helpers.xValues(coefA, coefB, coefC, true)
                }

                // Valores para y
                else if (option == 4) {
                    Helpers.yValues(coefA, coefB, coefC, true)
                }

                // Estudo do sinal
                else if (option == 5) {
                    Helpers.sign(coefA, coefB, coefC, true)
                }
            }

            // Página 3
            else if (page == 3) {
                // Equações
                if (option == 1) {
                    Helpers.equations(false)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, true, false, "", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta a função logarítmica: b × logₐ(x) + c
     * @param coefA - Coeficiente a da função logarítmica
     * @param coefB - Coeficiente b da função logarítmica
     * @param coefC - Coeficiente c da função logarítmica
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    logarithmic(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, true)

        // Cálculo
        let root: Numeric = Algebra.round(coefA ** Algebra.division(-coefC, coefB, false)) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr([["Curva", "Curve"], ["Raiz", "Root"], ...BASE_OPTIONS]), page)
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                // Curva
                if (option == 1) {
                    Helpers.curve(coefA, coefB, false)
                }

                // Raiz
                else if (option == 2) {
                    Helpers.showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾")
                }

                // Domínio
                else if (option == 3) {
                    Helpers.domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Imagem
                else if (option == 4) {
                    Helpers.range()
                }

                // Interseção com o eixo x
                else if (option == 5) {
                    Helpers.xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾")
                }
            }

            // Página 2
            else if (page == 2) {
                // Interseção com o eixo y
                if (option == 1) {
                    Helpers.yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Valores para x
                else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, true)
                }

                // Valores para y
                else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, true)
                }

                // Estudo do sinal
                else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, true)
                }

                // Equações
                else if (option == 5) {
                    Helpers.equations(false)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, true, "", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta a função seno: b × sin(a · x) + c
     * @param coefA - Coeficiente a da função seno
     * @param coefB - Coeficiente b da função seno
     * @param coefC - Coeficiente c da função seno
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    sine(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "sin")

        // Cálculo
        let root: Numeric = Algebra.round(Math.asin(Algebra.division(-coefC, coefB)) / coefA) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            menuResp = Ui.menu(trArr([["Amplitude", "Amplitude"], ["Período", "Period"], ...BASE_OPTIONS]), page)
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                if (option == 1) {
                    Helpers.amplitude(coefB)
                } else if (option == 2) {
                    Helpers.showPeriod(coefA)
                } else if (option == 3) {
                    Helpers.domain()
                } else if (option == 4) {
                    Helpers.range(
                        "∈ [" +
                            Writing.decimal(-Algebra.absolute(coefB) + coefC) +
                            ", " +
                            Writing.decimal(Algebra.absolute(coefB) + coefC) +
                            "]",
                        "",
                        "−|b| + c ≤ y ≤ |b| + c"
                    )
                } else if (option == 5) {
                    Helpers.xAxis(
                        root,
                        "arcsin(−c / b) / a",
                        "|(−c / b)| > 1, " + tr("sem raiz real", "without real root")
                    )
                }
            }

            // Página 2
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefC, "b × sin(a · x) + c", "c")
                } else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "sin")
                } else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "sin")
                } else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "sin")
                } else if (option == 5) {
                    Helpers.equations(false)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "sin", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta a função cosseno: b × cos(a · x) + c
     * @param coefA - Coeficiente a da função cosseno
     * @param coefB - Coeficiente b da função cosseno
     * @param coefC - Coeficiente c da função cosseno
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    cosine(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "cos")

        // Cálculo
        let root: Numeric = Algebra.round(Math.acos(Algebra.division(-coefC, coefB)) / coefA) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            menuResp = Ui.menu(trArr([["Amplitude", "Amplitude"], ["Período", "Period"], ...BASE_OPTIONS]), page)
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                if (option == 1) {
                    Helpers.amplitude(coefB)
                } else if (option == 2) {
                    Helpers.showPeriod(coefA)
                } else if (option == 3) {
                    Helpers.domain()
                } else if (option == 4) {
                    Helpers.range(
                        "∈ [" +
                            Writing.decimal(-Algebra.absolute(coefB) + coefC) +
                            ", " +
                            Writing.decimal(Algebra.absolute(coefB) + coefC) +
                            "]",
                        "",
                        "−|b| + c ≤ y ≤ |b| + c"
                    )
                } else if (option == 5) {
                    Helpers.xAxis(
                        root,
                        "arccos(−c / b) / a",
                        "|(−c / b)| > 1, " + tr("sem raiz real", "without real root")
                    )
                }
            }

            // Página 2
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefB + coefC, "b × cos(a · x) + c", "b + c")
                } else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "cos")
                } else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "cos")
                } else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "cos")
                } else if (option == 5) {
                    Helpers.equations(false)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "cos", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },

    /**
     * [FUNÇÃO] Monta a função tangente: b × tan(a · x) + c
     * @param coefA - Coeficiente a da função tangente
     * @param coefB - Coeficiente b da função tangente
     * @param coefC - Coeficiente c da função tangente
     * @returns Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    tangent(
        coefA: Numeric = State.globalA as Numeric,
        coefB: Numeric = State.globalB as Numeric,
        coefC: Numeric = State.globalC as Numeric
    ): Numeric[] {
        let option: Numeric,
            page: Numeric = 1,
            menuResp: [Numeric | CommandsNames, Numeric]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "tan")

        // Cálculo
        let root: Numeric = Algebra.round(Math.atan(Algebra.division(-coefC, coefB)) / coefA) as Numeric

        // Loop
        let limit: Numeric = 0
        do {
            menuResp = Ui.menu(
                trArr([["Assíntotas verticais", "Vertical asymptotes"], ["Período", "Period"], ...BASE_OPTIONS]),
                page
            )
            option = menuResp[0] as Numeric
            page = menuResp[1] as Numeric
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0
                page = 1
            }

            // Página 1
            if (page == 1) {
                if (option == 1) {
                    Helpers.verticalAsymptotes(coefA)
                } else if (option == 2) {
                    Helpers.showPeriod(coefA, true)
                } else if (option == 3) {
                    Helpers.domain()
                } else if (option == 4) {
                    Helpers.range()
                } else if (option == 5) {
                    Helpers.xAxis(root, "arctan(−c / b) / a")
                }
            }

            // Página 2
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefC, "b × tan(a · x) + c", "c")
                } else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "tan")
                } else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "tan")
                } else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "tan")
                } else if (option == 5) {
                    Helpers.equations(false)
                }
            }

            // Rever
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "tan", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)

        return [coefA, coefB, coefC]
    },
}
