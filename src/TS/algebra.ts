import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Error } from "./error.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

import type { Value, Numeric, Variable, Precision, Places, ValueArray, TrigonometricFunction } from "./values.js"

/**
 * [NUMÉRICO] Objeto base para as funções envolvendo algebra
 * - Use as funções daqui para fazer cálculos, arredondar números, pedir variáveis e pontos, etc.
 * @since v6.1.0
 */
export const Algebra = {
    /**
     * [NUMÉRICO] Arredonda um número
     * @param number - Número
     * @param places - Casas decimais
     * @returns Número arredondado
     * @since v6.1.0
     */
    round(number: Value = 0, places: Places = Config.decimalPlaces): Value {
        if (!isFinite(places) || places < 0 || !Number.isInteger(places)) {
            Ui.error("[Algebra.round] 'places' inválido: " + places, "Usando padrão: " + Config.decimalPlaces, true)
            places = Config.decimalPlaces
        }

        number = Writing.decimal(number, true)

        if (typeof number == "number" && isFinite(number)) {
            number = Math.round(number * 10 ** places) / 10 ** places
            if (number == 0) {
                number = 0
            }
        }

        return number
    },

    /**
     * [UI] Pede uma variável
     * @param name - Nome da variável
     * @returns Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     * @since v6.1.0
     */
    variables(name: Variable = "x"): Value {
        if (typeof name != "string" || name.trim() == "") {
            Ui.error("[Algebra.variables] 'name' inválido:" + name, "Usando 'x'", true)
            name = "x"
        }

        let value = Ui.input(
            name + " = ",
            tr(
                "Digite “" + name + "” caso queira que “" + name + "” seja uma incógnita.",
                "Type “" + name + "” if you want “" + name + "” to be an unknown variable."
            )
        )

        value = Writing.decimal(value, true)
        if (typeof value == "number" && isFinite(value)) {
            return Algebra.round(value)
        }

        return name
    },

    /**
     * [UI] Pede um(ns) ponto(s)
     * @param type - Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @since v6.1.0
     */
    point(type: Numeric = 1): ValueArray {
        if (type != 1 && type != 2 && type != 3) {
            console.warn("[Algebra.point] 'type' inválido:", type, "— usando 1")
            type = 1
        }

        let array: ValueArray = [],
            x1: Value,
            y1: Value,
            x2: Value,
            y2: Value,
            x3: Value,
            y3: Value

        // Pergunta
        x1 = Ui.input("x₁ = ", "", true)
        y1 = Ui.input("y₁ = ", "", true)
        array.push(x1, y1)

        if (type == 2 || type == 3) {
            x2 = Ui.input("x₂ = ", "", true)
            y2 = Ui.input("y₂ = ", "", true)
            array.push(x2, y2)

            if (type == 3) {
                x3 = Ui.input("x₃ = ", "", true)
                y3 = Ui.input("y₃ = ", "", true)
                array.push(x3, y3)
            }
        }

        return array
    },

    /**
     * [UI] Vê se as funções têm pontos de encontro
     * @param func1 - Primeira função [a, b, c]
     * @param func2 - Segunda função [a, b, c]
     * @since v6.1.0
     */
    equations(func1: ValueArray = [0, 0, 0], func2: ValueArray = [0, 0, 0]): void {
        if (!Array.isArray(func1) || func1.length != 3) {
            Ui.error("[Algebra.equations] 'func1' inválido: " + func1, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!Array.isArray(func2) || func2.length != 3) {
            Ui.error("[Algebra.equations] 'func2' inválido: " + func2, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }
        if (!func1.every(value => typeof value == "number" && isFinite(value))) {
            Ui.error("[Algebra.equations] 'func1' contém valores inválidos: " + func1, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!func2.every(value => typeof value == "number" && isFinite(value))) {
            Ui.error("[Algebra.equations] 'func2' contém valores inválidos: " + func2, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }

        let coefA: Numeric = 0,
            coefB: Numeric = 0,
            coefC: Numeric = 0,
            x: Numeric = 0

        if (func1.every(value => typeof value == "number") && func2.every(value => typeof value == "number")) {
            const [a1 = 0, b1 = 0, c1 = 0]: ValueArray = func1
            const [a2 = 0, b2 = 0, c2 = 0]: ValueArray = func2
            coefA = a1 - a2
            coefB = b1 - b2
            coefC = c1 - c2
        }

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                Ui.display(
                    tr(
                        "As funções coincidem: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ",
                        "The functions are identical: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ"
                    ),
                    tr(
                        "Porque as funções são iguais em todos os pontos, elas coincidem.",
                        "The functions coincide at every point."
                    )
                )
            } else if (coefC != 0) {
                Ui.display(
                    tr(
                        "As funções nunca se encontrarão: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ",
                        "The functions are distinct: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ"
                    ),
                    tr(
                        "As funções são distintas: não há ponto de interseção.",
                        "The functions are distinct: there is no intersection point."
                    )
                )
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = Algebra.division(-coefC, coefB)
            Ui.display(
                tr("As funções se encontram em: ", "The functions coincide at: ") + "x = " + Writing.decimal(x),
                "x = −c / b"
            )
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = Helpers.calcDelta(coefA, coefB, coefC)
            Helpers.showDelta(
                delta[0],
                tr(
                    "As funções não possuem pontos de interseção reais",
                    "The functions have no real intersection points"
                ),
                tr("As funções se encontram em: ", "The functions intersect at: ") + "x = " + Writing.decimal(delta[1]),
                tr("As funções se encontram em: ", "The functions intersect at: ") +
                    "x₁ = " +
                    Writing.decimal(delta[1]) +
                    ", x₂ = " +
                    Writing.decimal(delta[2])
            )
        }
    },

    /**
     * [NUMÉRICO] Descobre quais são as incógnitas
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Se é exponencial
     * @param funcLog - Se é logarítmica
     * @param funcTrig - Se é trigonométrica, e qual (sin, cos, tan)
     * @returns Retorna os coeficientes em formato de array numérico [a, b, c]
     * @since v6.1.0
     */
    unknown(
        coefA: Value,
        coefB: Value,
        coefC: Value,
        funcExp: boolean = false,
        funcLog: boolean = false,
        funcTrig: TrigonometricFunction = ""
    ) {
        let repeat: boolean = false,
            points: ValueArray,
            denominator: Numeric,
            diff1: Numeric,
            diff2: Numeric,
            term1: Numeric,
            term2: Numeric,
            term3: Numeric,
            term4: Numeric

        if (funcExp || funcLog) {
            // Valida
            if (coefA == 0 || coefA == 1 || coefB == 0) {
                if (typeof coefA == "number" && !isFinite(coefA)) {
                    coefA = 0
                }
                if (typeof coefB == "number" && !isFinite(coefB)) {
                    coefB = 0
                }
                if (typeof coefC == "number" && !isFinite(coefC)) {
                    coefC = 0
                }

                return [coefA, coefB, coefC]
            }
        }

        // Mostra
        Ui.function(coefA, coefB, coefC, funcExp, funcLog, funcTrig)

        // Loop
        let limit = 0
        do {
            repeat = false

            // Polinomial
            if (!funcExp && !funcLog) {
                // Constante
                if (coefA == 0 && coefB == 0) {
                    points = Algebra.point()

                    coefC = Checks.numericPoint(points, 1)
                }

                // Afim
                else if (coefA == 0 && coefB != 0) {
                    // Únicas
                    if (
                        (typeof coefB == "string" && typeof coefC == "number") ||
                        (typeof coefC == "string" && typeof coefB == "number")
                    ) {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        if (typeof coefC == "string") {
                            const b = coefB as Numeric
                            coefC = x1 - b * x0
                        } else if (typeof coefB == "string") {
                            if (x0 != 0) {
                                coefB = Algebra.division(x1 - coefC, x0)
                            } else {
                                Error.divZero("x ≠ 0")
                                repeat = true
                            }
                        }
                    }

                    // Duplas
                    else if (typeof coefB == "string" && typeof coefC == "string") {
                        points = Algebra.point(2)
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)
                        const x2 = Checks.numericPoint(points, 2)
                        const x3 = Checks.numericPoint(points, 3)

                        if (x0 != x2 && (x0 != 0 || x2 != 0)) {
                            coefB = Algebra.division(x3 - x1, x2 - x0)
                            coefC = x1 - coefB * x0
                        } else {
                            Error.divZero("x ≠ 0 ∧ x₁ ≠ x₂")
                            repeat = true
                        }
                    }
                }

                // Quadrática
                else if (coefA != 0) {
                    // Únicas

                    // a
                    if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "number") {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        if (x0 != 0) {
                            coefA = Algebra.division(x1 - coefB * x0 - coefC, x0 * x0)
                        } else {
                            Error.divZero("x ≠ 0")
                            repeat = true
                        }
                    }

                    // b
                    else if (typeof coefB == "string" && typeof coefA == "number" && typeof coefC == "number") {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        if (x0 != 0) {
                            coefB = Algebra.division(x1 - coefA * (x0 * x0) - coefC, x0)
                        } else {
                            Error.divZero("x ≠ 0")
                            repeat = true
                        }
                    }

                    // c
                    else if (typeof coefC == "string" && typeof coefB == "number" && typeof coefA == "number") {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        coefC = x1 - coefA * (x0 * x0) - coefB * x0
                    }

                    // Duplas

                    // a, b
                    else if (typeof coefA == "string" && typeof coefB == "string" && typeof coefC == "number") {
                        points = Algebra.point(2)
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)
                        const x2 = Checks.numericPoint(points, 2)
                        const x3 = Checks.numericPoint(points, 3)

                        if (x0 != 0 && x0 != x2) {
                            denominator = x0 * x2 * (x0 - x2)
                            coefA = Algebra.division((x1 - coefC) * x2 - (x3 - coefC) * x0, denominator)
                            coefB = Algebra.division((x3 - coefC) * x0 * x0 - (x1 - coefC) * x2 * x2, denominator)
                        } else {
                            Error.divZero("x ≠ 0 ∧ x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // a, c
                    else if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "string") {
                        points = Algebra.point(2)
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)
                        const x2 = Checks.numericPoint(points, 2)
                        const x3 = Checks.numericPoint(points, 3)

                        denominator = x0 * x0 - x2 * x2
                        if (denominator != 0) {
                            coefA = Algebra.division(x1 - coefB * x0 - (x3 - coefB * x2), denominator)
                            coefC = x1 - coefA * (x0 * x0) - coefB * x0
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // b, c
                    else if (typeof coefA == "number" && typeof coefB == "string" && typeof coefC == "string") {
                        points = Algebra.point(2)
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)
                        const x2 = Checks.numericPoint(points, 2)
                        const x3 = Checks.numericPoint(points, 3)

                        if (x0 != x2) {
                            coefB = Algebra.division(x3 - coefA * x2 * x2 - (x1 - coefA * x0 * x0), x2 - x0)
                            coefC = x1 - coefA * (x0 * x0) - coefB * x0
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // Triplas
                    else if (typeof coefA == "string" && typeof coefB == "string" && typeof coefC == "string") {
                        points = Algebra.point(3)
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)
                        const x2 = Checks.numericPoint(points, 2)
                        const x3 = Checks.numericPoint(points, 3)
                        const x4 = Checks.numericPoint(points, 4)
                        const x5 = Checks.numericPoint(points, 5)

                        diff1 = x3 - x1
                        diff2 = x5 - x1
                        term1 = x2 * x2 - x0 * x0
                        term2 = x2 - x0
                        term3 = x4 * x4 - x0 * x0
                        term4 = x4 - x0
                        denominator = term1 * term4 - term2 * term3

                        if (denominator != 0) {
                            coefA = Algebra.division(diff1 * term4 - term2 * diff2, denominator)
                            coefB = Algebra.division(term1 * diff2 - diff1 * term3, denominator)
                            coefC = x1 - coefA * (x0 * x0) - coefB * x0
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repeat = true
                        }
                    }
                }
            }

            // Exponencial
            else if (funcExp) {
                // Únicas

                // a
                if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "number") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefA = Algebra.round(Algebra.division(x1 - coefC, coefB, false) ** Algebra.division(1, x0, false))
                }

                // b
                else if (typeof coefB == "string" && typeof coefA == "number" && typeof coefC == "number") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefB = Algebra.division(x1 - coefC, coefA ** x0)
                }

                // c
                else if (typeof coefC == "string" && typeof coefB == "number" && typeof coefA == "number") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefC = x1 - coefB * coefA ** x0
                }

                // Duplas

                // a, b
                else if (typeof coefA == "string" && typeof coefB == "string" && typeof coefC == "number") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    const a = Algebra.round(
                        Algebra.division(x1 - coefC, x3 - coefC, false) ** Algebra.division(1, x0 - x2, false)
                    ) as Numeric
                    coefA = a
                    coefB = Algebra.division(x1 - coefC, a ** x0)
                }

                // a, c
                else if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "string") {
                    // pontoExp = algebra.ponto(2)

                    Ui.warning(
                        tr(
                            "Não posso ainda descobrir o valor de a e c quando tenho somente o b",
                            "I cannot yet determine the value of a and c when I only have b"
                        ),
                        tr("Em construção.", "Under construction.")
                    )
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if (typeof coefA == "number" && typeof coefB == "string" && typeof coefC == "string") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    const b = Algebra.division(x3 - x1, coefA ** x2 - coefA ** x0)
                    coefB = b
                    coefC = x1 - b * coefA ** x0
                }
            }

            // Logarítmica
            else if (funcLog) {
                // Únicas

                // a
                if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "number") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefA = Algebra.round(x0 ** Algebra.division(coefB, x1 - coefC, false)) as Numeric
                }

                // b
                else if (typeof coefA == "number" && typeof coefB == "string" && typeof coefC == "number") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefB = Algebra.division(x1 - coefC, Algebra.log(x0, coefA))
                }

                // c
                else if (typeof coefA == "number" && typeof coefB == "number" && typeof coefC == "string") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefC = x1 - Number(Algebra.round(coefB * Algebra.log(x0, coefA)))
                }

                // Duplas

                // a, b
                else if (typeof coefA == "string" && typeof coefB == "string" && typeof coefC == "number") {
                    // pontoLog = algebra.ponto(2)

                    Ui.warning(
                        tr(
                            "Não posso ainda descobrir o valor de a e b quando tenho somente o c",
                            "I cannot yet determine the value of a and b when I only have c"
                        ),
                        tr("Em construção.", "Under construction.")
                    )
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if (typeof coefA == "string" && typeof coefB == "number" && typeof coefC == "string") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    const a = Algebra.round(
                        Algebra.division(x0, x2, false) ** Algebra.division(coefB, x1 - x3, false)
                    ) as Numeric
                    coefA = a
                    coefC = x1 - coefB * Algebra.log(x0, a)
                }

                // b, c
                else if (typeof coefA == "number" && typeof coefB == "string" && typeof coefC == "string") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    coefB = Algebra.division(x1 - x3, Algebra.log(x0, coefA) - Algebra.log(x2, coefA))
                    coefC = x1 - coefB * Algebra.log(x0, coefA)
                }
            }

            // Erro
            if (!isFinite(Number(coefA)) || !isFinite(Number(coefB)) || !isFinite(Number(coefC))) {
                Error.divZero("Valores inválidos.")
                if (
                    Ui.confirm(
                        tr(
                            "Queres mudar os valores dos coeficientes?",
                            "Do you want to change the coefficients values?"
                        ),
                        tr(
                            "Se quiser alterar os valores dos pontos, escolha “Cancelar”",
                            "If you want to change the point values, chose “Cancel”"
                        )
                    )
                ) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    State.askCoeffs = true
                    State.loop = true
                    repeat = false
                } else {
                    if (!isFinite(Number(coefA))) {
                        coefA = "a"
                    }
                    if (!isFinite(Number(coefB))) {
                        coefB = "b"
                    }
                    if (!isFinite(Number(coefC))) {
                        coefC = "c"
                    }
                    repeat = true
                }
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                repeat = false
            }
        } while (repeat)

        return [coefA, coefB, coefC]
    },

    /**
     * [NUMÉRICO] Log de x na base
     * @param x - Número
     * @param base - Base
     * @param precision - Casas decimais
     * @returns Resultado
     * @since v6.1.0
     */
    log(x: Numeric = 1, base: Numeric = Math.E, precision: Precision = Config.logPrecision): Numeric {
        let y = x > 1 ? 1 : -1,
            number: Numeric,
            delta: Numeric,
            lnX: Numeric,
            lnBase: Numeric

        // Valida
        if (x <= 0 || base <= 0 || base == 1) {
            Error.invalidLog("log", "x > 0 ∧ base > 0, base ≠ 1")
            return NaN
        }

        number = Algebra.ln(base)
        delta = Algebra.division(base ** y - x, base ** y * number, false)

        // Mudança de base
        if (base < 1) {
            lnX = Algebra.ln(x)
            lnBase = Algebra.ln(base)
            if (!isFinite(lnX) || !isFinite(lnBase) || lnBase == 0) {
                return NaN
            }

            return Algebra.division(lnX, lnBase)
        }

        // Loop
        let limit = 0
        while (Algebra.absolute(delta) > precision && limit < Config.interactionLimit) {
            delta = Algebra.division(base ** y - x, base ** y * number, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y) as Numeric
    },

    /**
     * [NUMÉRICO] Log de x na base E
     * @param x - Número
     * @param precision - Casas decimais
     * @returns Resultado
     * @since v6.1.0
     */
    ln(x: Numeric = 1, precision: Precision = Config.logPrecision): Numeric {
        let y = x > 1 ? 1 : -1,
            base = Math.E,
            delta = Algebra.division(base ** y - x, base ** y, false)

        // Valida
        if (x <= 0) {
            Error.invalidLog("ln", "x > 0")
            return NaN
        }

        // Loop
        let limit = 0
        while (Algebra.absolute(delta) > precision && limit < Config.interactionLimit) {
            delta = Algebra.division(base ** y - x, base ** y, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y) as Numeric
    },

    /**
     * [NUMÉRICO] Divide dois números
     * @param numerator - Parte de cima da fração
     * @param denominator - Parte de baixo da fração
     * @param round - Se irá arredondar
     * @param precision - Precisão do arredondamento
     * @returns Resultado
     * @since v6.1.0
     */
    division(
        numerator: Numeric = 0,
        denominator: Numeric = 1,
        round: boolean = true,
        precision: Precision = Config.divPrecision
    ): Numeric {
        let result: Numeric

        numerator = Number(Writing.decimal(numerator, true))
        denominator = Number(Writing.decimal(denominator, true))

        // Valida
        if (denominator == 0 || !isFinite(numerator) || !isFinite(denominator)) {
            Ui.error(
                "[Algebra.division] Entrada inválida.",
                "numerator: " + String(numerator) + "denominator: " + String(denominator),
                true
            )
            return NaN
        }

        // Denominador pequeno
        if (Algebra.absolute(denominator) <= precision) {
            Ui.error("[Algebra.division] Denominador próximo de zero.", String(denominator), true)
            return NaN
        }

        result = numerator / denominator

        // Infinito
        if (!isFinite(result)) {
            return NaN
        }

        // Arredonda
        if (round) {
            return Algebra.round(result) as Numeric
        }

        return result
    },

    /**
     * [NUMÉRICO] Calcula o valor absoluto de um número
     * @param number - Número
     * @param round - Se irá arredondar
     * @param places - Casas decimais
     * @returns Número absoluto
     * @since v6.1.0
     */
    absolute(number: Numeric = 0, round: boolean = true, places: Places = Config.decimalPlaces): Numeric {
        number = Writing.decimal(number, true) as Numeric

        // Valida
        if (!isFinite(number)) {
            Ui.error("[Algebra.absolute] Valor inválido: " + number, "", true)
            return NaN
        }

        if (round) {
            number = Algebra.round(number, places) as Numeric
        }

        return Math.abs(number)
    },
}
