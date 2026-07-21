import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Error } from "./error.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * # Algebra
 *
 * ## Funcionalidades:
 * Objeto base para as funções envolvendo álgebra.
 *
 * ## Métodos:
 * - {@link Algebra.round round} - Arredonda números
 * - {@link Algebra.variables variables} - Pede variáveis
 * - {@link Algebra.point point} - Pede pontos
 * - {@link Algebra.equations equations} - Equações entre funções
 * - {@link Algebra.unknown unknown} - Descobre variáveis
 * - {@link Algebra.log log} - Log de `x` de uma `base` qualquer
 * - {@link Algebra.ln ln} - Log natural de `x`
 * - {@link Algebra.division division} - Divide de forma segura
 * - {@link Algebra.absolute absolute} - Valor absoluto de um número
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Numérico
 * @since v6.1.0
 */
export const Algebra = {
    /**
     * Arredonda um número
     * @param {string | number} number - Número
     * @param {number} places - Casas decimais
     * @returns {string | number} Número arredondado
     * @group Numérico
     * @since v6.1.0
     */
    round(number = 0, places = Config.decimalPlaces) {
        if (!Checks.isFiniteNumber(places) || places < 0) {
            Ui.error(`"[Algebra.round] 'places' inválido: ${places}`, `Usando padrão: ${Config.decimalPlaces}`, true)
            places = Config.decimalPlaces
        }

        number = Writing.decimal(number, true, false)

        if (Checks.isFiniteNumber(number)) {
            number = Math.round(number * 10 ** places) / 10 ** places
            if (number == 0) {
                number = 0
            }
        }

        return number
    },

    /**
     * Pede uma variável
     * @param {string} name - Nome da variável
     * @returns {string | number} Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     * @group UI
     * @since v6.1.0
     */
    variables(name = "x") {
        if (name.trim() == "") {
            Ui.error(`[Algebra.variables] 'name' inválido: ${name}`, `Usando 'x'`, true)
            name = "x"
        }

        let value = Ui.input(name + " = ", tr("algebra.variableAsk", { name: name }))

        value = Writing.decimal(value, true)
        if (Checks.isFiniteNumber(value)) {
            return Algebra.round(value)
        }

        return name
    },

    /**
     * [UI] Pede um(ns) ponto(s)
     * @param {number} type - Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns {number[]} Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @since v6.1.0
     */
    point(type = 1) {
        if (type != 1 && type != 2 && type != 3) {
            console.warn("[Algebra.point] 'type' inválido: ", type, "— usando 1")
            type = 1
        }

        let array = []

        // Pergunta
        let x1 = Ui.input("x₁ = ", "", true)
        let y1 = Ui.input("y₁ = ", "", true)
        array.push(x1, y1)

        if (type == 2 || type == 3) {
            let x2 = Ui.input("x₂ = ", "", true)
            let y2 = Ui.input("y₂ = ", "", true)
            array.push(x2, y2)

            if (type == 3) {
                let x3 = Ui.input("x₃ = ", "", true)
                let y3 = Ui.input("y₃ = ", "", true)
                array.push(x3, y3)
            }
        }

        return array
    },

    /**
     * [UI] Vê se as funções têm pontos de encontro
     * @param {number[]} func1 - Primeira função [a, b, c]
     * @param {number[]} func2 - Segunda função [a, b, c]
     * @since v6.1.0
     */
    equations(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        if (!Array.isArray(func1) || func1.length != 3) {
            Ui.error(`[Algebra.equations] 'func1' inválido: ${func1}`, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!Array.isArray(func2) || func2.length != 3) {
            Ui.error(`[Algebra.equations] 'func2' inválido: ${func2}`, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }
        if (!func1.every(value => Checks.isFiniteNumber(value))) {
            Ui.error(`[Algebra.equations] 'func1' contém valores inválidos: ${func1}`, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!func2.every(value => Checks.isFiniteNumber(value))) {
            Ui.error(`[Algebra.equations] 'func2' contém valores inválidos: ${func2}`, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }

        const [a1 = 0, b1 = 0, c1 = 0] = func1
        const [a2 = 0, b2 = 0, c2 = 0] = func2
        let coefA = a1 - a2,
            coefB = b1 - b2,
            coefC = c1 - c2,
            x = 0

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                Ui.display(tr("algebra.constantCoincide"), tr("algebra.constantCoincideExp"))
            } else if (coefC != 0) {
                Ui.display(tr("algebra.constantDistinct"), tr("algebra.constantDistinctExp"))
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = Algebra.division(-coefC, coefB)
            Ui.display(tr("algebra.oneRoot", { x: Writing.decimal(x) }), "x = −c / b")
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = Helpers.calcDelta(coefA, coefB, coefC)
            Helpers.showDelta(
                delta[0],
                tr("algebra.quadraticDistinc"),
                tr("algebra.oneRoot", { x: Writing.decimal(delta[1]) }),
                tr("algebra.twoRoots", { x1: Writing.decimal(delta[1]), x2: Writing.decimal(delta[2]) })
            )
        }
    },

    /**
     * [NUMÉRICO] Descobre quais são as incógnitas
     * @param {string | number} coefA - Coeficiente a
     * @param {string | number} coefB - Coeficiente b
     * @param {string | number} coefC - Coeficiente c
     * @param {boolean} funcExp - Se é exponencial
     * @param {boolean} funcLog - Se é logarítmica
     * @param {string} funcTrig - Se é trigonométrica, e qual (sin, cos, tan)
     * @returns Retorna os coeficientes em formato de array numérico [a, b, c]
     * @since v6.1.0
     */
    unknown(coefA, coefB, coefC, funcExp = false, funcLog = false, funcTrig = "") {
        let repeat = false,
            points = [],
            denominator = 0,
            diff1 = 0,
            diff2 = 0,
            term1 = 0,
            term2 = 0,
            term3 = 0,
            term4 = 0

        if (funcExp || funcLog) {
            // Valida
            if (coefA == 0 || coefA == 1 || coefB == 0) {
                if (!Checks.isFiniteNumber(coefA)) {
                    coefA = 0
                }
                if (!Checks.isFiniteNumber(coefB)) {
                    coefB = 0
                }
                if (!Checks.isFiniteNumber(coefC)) {
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
                    if ((coefB == "b" && coefC != "c") || (coefC == "c" && coefB != "b")) {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        if (coefC == "c") {
                            const b = coefB
                            coefC = x1 - b * x0
                        } else if (coefB == "b") {
                            if (x0 != 0) {
                                coefB = Algebra.division(x1 - coefC, x0)
                            } else {
                                Error.divZero("x ≠ 0")
                                repeat = true
                            }
                        }
                    }

                    // Duplas
                    else if (coefB == "b" && coefC == "c") {
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
                    if (coefA == "a" && coefB != "b" && coefC != "c") {
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
                    else if (coefB == "b" && coefA != "a" && coefC != "c") {
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
                    else if (coefC == "c" && coefB != "b" && coefA != "a") {
                        points = Algebra.point()
                        const x0 = Checks.numericPoint(points, 0)
                        const x1 = Checks.numericPoint(points, 1)

                        coefC = x1 - coefA * (x0 * x0) - coefB * x0
                    }

                    // Duplas
                    // a, b
                    else if (coefA == "a" && coefB == "b" && coefC != "c") {
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
                    else if (coefA == "a" && coefB != "b" && coefC == "c") {
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
                    else if (coefA != "a" && coefB == "b" && coefC == "c") {
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
                    else if (coefA == "a" && coefB == "b" && coefC == "c") {
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
                if (coefA == "a" && coefB != "b" && coefC != "c") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefA = Algebra.round(Algebra.division(x1 - coefC, coefB, false) ** Algebra.division(1, x0, false))
                }

                // b
                else if (coefB == "b" && coefA != "a" && coefC != "c") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefB = Algebra.division(x1 - coefC, coefA ** x0)
                }

                // c
                else if (coefC == "c" && coefB != "b" && coefA != "a") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefC = x1 - coefB * coefA ** x0
                }

                // Duplas
                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    const a = Algebra.round(
                        Algebra.division(x1 - coefC, x3 - coefC, false) ** Algebra.division(1, x0 - x2, false)
                    )
                    coefA = a
                    coefB = Algebra.division(x1 - coefC, a ** x0)
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    // points = Algebra.point(2)

                    Ui.warning(
                        tr("algebra.cannotDetermine", { v1: "a", v2: "c", v3: "b" }),
                        tr("algebra.underConstruction")
                    )
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
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
                if (coefA == "a" && coefB != "b" && coefC != "c") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefA = Algebra.round(x0 ** Algebra.division(coefB, x1 - coefC, false))
                }

                // b
                else if (coefA != "a" && coefB == "b" && coefC != "c") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefB = Algebra.division(x1 - coefC, Algebra.log(x0, coefA))
                }

                // c
                else if (coefA != "a" && coefB != "b" && coefC == "c") {
                    points = Algebra.point()
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)

                    coefC = x1 - Algebra.round(coefB * Algebra.log(x0, coefA))
                }

                // Duplas
                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    // points = Algebra.point(2)

                    Ui.warning(
                        tr("algebra.cannotDetermine", { v1: "a", v2: "b", v3: "c" }),
                        tr("algebra.underConstruction")
                    )
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    points = Algebra.point(2)
                    const x0 = Checks.numericPoint(points, 0)
                    const x1 = Checks.numericPoint(points, 1)
                    const x2 = Checks.numericPoint(points, 2)
                    const x3 = Checks.numericPoint(points, 3)

                    const a = Algebra.round(Algebra.division(x0, x2, false) ** Algebra.division(coefB, x1 - x3, false))
                    coefA = a
                    coefC = x1 - coefB * Algebra.log(x0, a)
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
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
            if (!Checks.isFiniteNumber(coefA) || !Checks.isFiniteNumber(coefB) || !Checks.isFiniteNumber(coefC)) {
                Error.divZero(tr("algebra.invalidValues"))
                if (Ui.confirm(tr("algebra.changeValues"), tr("algebra.changeValuesExp"))) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    State.askCoeffs = true
                    State.loop = true
                    repeat = false
                } else {
                    if (!Checks.isFiniteNumber(coefA)) {
                        coefA = "a"
                    }
                    if (!Checks.isFiniteNumber(coefB)) {
                        coefB = "b"
                    }
                    if (!Checks.isFiniteNumber(coefC)) {
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
     * @param {number} x - Número
     * @param {number} base - Base
     * @param {number} precision - Casas decimais
     * @returns {number} Resultado
     * @since v6.1.0
     */
    log(x = 1, base = Math.E, precision = Config.logPrecision) {
        let y = x > 1 ? 1 : -1,
            number = 0,
            delta = 0,
            lnX = 0,
            lnBase = 0

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
            if (!Checks.isFiniteNumber(lnX) || !Checks.isFiniteNumber(lnBase) || lnBase == 0) {
                return NaN
            }

            return Algebra.division(lnX, lnBase)
        }

        // Loop
        let limit = 0
        while (Algebra.absolute(delta) > precision && limit < Config.iteractionLimit) {
            delta = Algebra.division(base ** y - x, base ** y * number, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y)
    },

    /**
     * [NUMÉRICO] Log de x na base E
     * @param {number} x - Número
     * @param {number} precision - Casas decimais
     * @returns {number} Resultado
     * @since v6.1.0
     */
    ln(x = 1, precision = Config.logPrecision) {
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
        while (Algebra.absolute(delta) > precision && limit < Config.iteractionLimit) {
            delta = Algebra.division(base ** y - x, base ** y, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y)
    },

    /**
     * [NUMÉRICO] Divide dois números
     * @param {number} numerator - Parte de cima da fração
     * @param {number} denominator - Parte de baixo da fração
     * @param {boolean} round - Se irá arredondar
     * @param {number} precision - Precisão do arredondamento
     * @returns {number} Resultado
     * @since v6.1.0
     */
    division(numerator = 0, denominator = 1, round = true, precision = Config.divPrecision) {
        let result = 0

        numerator = Writing.decimal(numerator, true)
        denominator = Writing.decimal(denominator, true)

        // Valida
        if (denominator == 0 || !Checks.isFiniteNumber(numerator) || !Checks.isFiniteNumber(denominator)) {
            Ui.error(
                "[Algebra.division] Entrada inválida.",
                `numerator: ${String(numerator)} denominator: ${String(denominator)}`,
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
        if (!Checks.isFiniteNumber(result)) {
            return NaN
        }

        // Arredonda
        if (round) {
            return Algebra.round(result)
        }

        return result
    },

    /**
     * [NUMÉRICO] Calcula o valor absoluto de um número
     * @param {number} number - Número
     * @param {boolean} round - Se irá arredondar
     * @param {number} places - Casas decimais
     * @returns Número absoluto
     * @since v6.1.0
     */
    absolute(number = 0, round = true, places = Config.decimalPlaces) {
        number = Writing.decimal(number, true)

        // Valida
        if (!Checks.isFiniteNumber(number)) {
            Ui.error(`[Algebra.absolute] Valor inválido: ${number}`, "", true)
            return NaN
        }

        if (round) {
            number = Algebra.round(number, places)
        }

        return Math.abs(number)
    },
}
