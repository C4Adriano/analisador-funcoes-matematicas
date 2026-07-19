import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
import { Helpers } from "./helpers.js"
import { tr, trArr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

const BASE_OPTIONS = [
    "analyze.options.domain",
    "analyze.options.range",
    "analyze.options.xIntersection",
    "analyze.options.yIntersection",
    "analyze.options.xValues",
    "analyze.options.yValues",
    "analyze.options.signAnalysis",
    "analyze.options.functionEquations",
]

/**
 * [FUNÇÃO] Objeto base para as funções envolvendo funções matemáticas, seus estudos e características
 * - Use as funções aqui para montar as funções constantes, afins, quadráticas, etc.
 * @since v6.1.0
 */
export const Analyze = {
    /**
     * [FUNÇÃO] Monta uma função constante: ƒ(x) = c
     * @param {string | number} coefC - Coeficiente c da função constante
     * @returns {(string | number)[]} Retorna: [coefC]
     * @since v6.1.0
     */
    constant(coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(0, 0, coefC)

        // Loop
        let limit = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr(BASE_OPTIONS), page)
            option = menuResp[0]
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
                    Helpers.range(`= ${Writing.decimal(coefC)}`, ".", tr("analyze.constantValue"))
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
     * @param {string | number} coefB - Coeficiente b da função afim
     * @param {string | number} coefC - Coeficiente c da função afim
     * @returns {(string | number)[]} Retorna: [coefB, coefC]
     * @since v6.1.0
     */
    affine(coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(0, coefB, coefC)

        // Cálculo
        let root = Helpers.calcRoot(0, coefB, coefC)

        // Loop
        let limit = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr(["analyze.options.slope", "analyze.options.root", ...BASE_OPTIONS]), page)
            option = menuResp[0]
            page = menuResp[1]
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
     * @param {string | number} coefA - Coeficiente a da função quadrática
     * @param {string | number} coefB - Coeficiente b da função quadrática
     * @param {string | number} coefC - Coeficiente c da função quadrática
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    quadratic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC)

        // Cálculo
        let delta = Helpers.calcDelta(coefA, coefB, coefC),
            vertex = Helpers.vertex(coefA, coefB, delta[0])

        // Loop
        let limit = 0
        do {
            // Menu
            menuResp = Ui.menu(
                trArr(["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex", ...BASE_OPTIONS]),
                page
            )
            option = menuResp[0]
            page = menuResp[1]
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
                        tr("analyze.noRoots"),
                        tr("analyze.oneRoot", { x: Writing.decimal(delta[1]) }),
                        tr("analyze.twoRoots", { x1: Writing.decimal(delta[1]), x2: Writing.decimal(delta[2]) })
                    )
                }

                // Vértice
                else if (option == 3) {
                    Ui.display(
                        tr("analyze.vertexPoint", { p1: Writing.decimal(vertex[0]), p2: Writing.decimal(vertex[1]) }),
                        tr("analyze.vertexExp")
                    )
                }

                // Domínio
                else if (option == 4) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 5) {
                    if (coefA > 0) {
                        Helpers.range(`∈ [${Writing.decimal(vertex[1])}, ∞)`, tr("analyze.betweenVertexInfinity"))
                    } else if (coefA < 0) {
                        Helpers.range(`∈ (-∞, ${Writing.decimal(vertex[1])} ]`, tr("analyze.betweenInfinityVertex"))
                    }
                }
            }

            // Página 2
            else if (page == 2) {
                // Interseção com o eixo x
                if (option == 1) {
                    Helpers.showDelta(
                        delta[0],
                        tr("analyze.noIntersectionXAxis"),
                        tr("analyze.oneIntersectionXAxis", { p: Writing.decimal(delta[1]) }),
                        tr("analyze.twoIntersectionsXAxis", {
                            p1: Writing.decimal(delta[1]),
                            p2: Writing.decimal(delta[2]),
                        })
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
     * @param {string | number} coefA - Coeficiente a da função exponencial
     * @param {string | number} coefB - Coeficiente b da função exponencial
     * @param {string | number} coefC - Coeficiente c da função exponencial
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    exponential(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC, true)

        // Cálculo
        let root = Helpers.calcRoot(coefA, coefB, coefC, true)

        // Loop
        let limit = 0
        do {
            // Menu
            menuResp = Ui.menu(
                trArr([
                    "analyze.options.curve",
                    "analyze.options.root",
                    "analyze.options.horizontalAsymptote",
                    ...BASE_OPTIONS,
                ]),
                page
            )
            option = menuResp[0]
            page = menuResp[1]
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
                    Ui.display(tr("analyze.horizontalAsymptote", { y: Writing.decimal(coefC) }), "y = c")
                }

                // Domínio
                else if (option == 4) {
                    Helpers.domain()
                }

                // Imagem
                else if (option == 5) {
                    if (coefB > 0) {
                        Helpers.range(`∈ (${Writing.decimal(coefC)}, ∞)`, tr("analyze.betweenCInfinity"))
                    } else {
                        Helpers.range(`∈ (-∞, ${Writing.decimal(coefC)})`, tr("analyze.betweenInfinityC"))
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
     * @param {string | number} coefA - Coeficiente a da função logarítmica
     * @param {string | number} coefB - Coeficiente b da função logarítmica
     * @param {string | number} coefC - Coeficiente c da função logarítmica
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    logarithmic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, true)

        // Cálculo
        let root = Algebra.round(coefA ** Algebra.division(-coefC, coefB, false))

        // Loop
        let limit = 0
        do {
            // Menu
            menuResp = Ui.menu(trArr(["analyze.options.curve", "analyze.options.root", ...BASE_OPTIONS]), page)
            option = menuResp[0]
            page = menuResp[1]
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
     * @param {string | number} coefA - Coeficiente a da função seno
     * @param {string | number} coefB - Coeficiente b da função seno
     * @param {string | number} coefC - Coeficiente c da função seno
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    sine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "sin")

        // Cálculo
        let root = Algebra.round(Math.asin(Algebra.division(-coefC, coefB)) / coefA)

        // Loop
        let limit = 0
        do {
            menuResp = Ui.menu(trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]), page)
            option = menuResp[0]
            page = menuResp[1]
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
                    const modB = Writing.decimal(Algebra.absolute(coefB) + coefC)
                    Helpers.range(`∈ [${-modB}, ${modB}]`, "", "−|b| + c ≤ y ≤ |b| + c")
                } else if (option == 5) {
                    Helpers.xAxis(root, "arcsin(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`)
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
     * @param {string | number} coefA - Coeficiente a da função cosseno
     * @param {string | number} coefB - Coeficiente b da função cosseno
     * @param {string | number} coefC - Coeficiente c da função cosseno
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    cosine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "cos")

        // Cálculo
        let root = Algebra.round(Math.acos(Algebra.division(-coefC, coefB)) / coefA)

        // Loop
        let limit = 0
        do {
            menuResp = Ui.menu(trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]), page)
            option = menuResp[0]
            page = menuResp[1]
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
                    Helpers.xAxis(root, "arccos(−c / b) / a", "|(−c / b)| > 1, " + tr("analyze.withoutRoot"))
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
     * @param {string | number} coefA - Coeficiente a da função tangente
     * @param {string | number} coefB - Coeficiente b da função tangente
     * @param {string | number} coefC - Coeficiente c da função tangente
     * @returns {(string | number)[]} Retorna: [coefA, coefB, coefC]
     * @since v6.1.0
     */
    tangent(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option = 0,
            page = 1,
            menuResp = [0, 1]

        // Mostra
        Ui.function(coefA, coefB, coefC, false, false, "tan")

        // Cálculo
        let root = Algebra.round(Math.atan(Algebra.division(-coefC, coefB)) / coefA)

        // Loop
        let limit = 0
        do {
            menuResp = Ui.menu(
                trArr(["analyze.options.verticalAsymptote", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            option = menuResp[0]
            page = menuResp[1]
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
