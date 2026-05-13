import { Config } from "./config.js"
import { Error } from "./error.js"
import { Helpers } from "./helpers.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * [NUMÉRICO] Objeto base para as funções envolvendo algebra
 * - Use as funções daqui para fazer cálculos, arredondar números, pedir variáveis e pontos, etc.
 * @since v6.1.0
 */
export const Algebra = {
    /**
     * [NUMÉRICO] Arredonda um número
     * @param {number} number - Número
     * @param {number} places - Casas decimais
     * @returns {number} - Número arredondado
     * @since v6.1.0
     */
    round(number = 0, places = Config.decimalPlaces) {
        number = Writing.decimal(number, true)

        if (isFinite(number)) {
            number = Math.round(number * 10 ** places) / 10 ** places
            if (number == "-0") {
                number = 0
            }
        }

        return number
    },

    /**
     * [UI] Pede uma variável
     * @param {string} name - Nome da variável
     * @returns {string | number} - Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     * @since v6.1.0
     */
    variables(name = "x") {
        let value = Ui.input(name + " = ", "Digite “" + name + "” caso queira que “" + name + "” seja uma incógnita.")

        if (isFinite(Writing.decimal(value, true))) {
            return Algebra.round(value)
        }

        return name
    },

    /**
     * [UI] Pede um(ns) ponto(s)
     * @param {number} type - Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns {number[]} - Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @since v6.1.0
     */
    point(type = 1) {
        let array = [],
            x1 = 0,
            x2 = 0,
            x3 = 0,
            y1 = 0,
            y2 = 0,
            y3 = 0

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
     * @param {number[]} func1 - Primeira função [a, b, c]
     * @param {number[]} func2 - Segunda função [a, b, c]
     * @since v6.1.0
     */
    equations(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        let coefA = func1[0] - func2[0],
            coefB = func1[1] - func2[1],
            coefC = func1[2] - func2[2],
            x = 0

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                Ui.display(
                    "As funções coincidem: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são iguais, em todos os pontos, elas se encontram."
                )
            } else if (coefC != 0) {
                Ui.display(
                    "As funções nunca se encontrarão: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são diferentes, não há ponto em que elas se encontrarão."
                )
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = Algebra.division(-coefC, coefB)
            Ui.display("As funções se encontram em: x = " + Writing.decimal(x), "x = −c / b")
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = Helpers.calcDelta(coefA, coefB, coefC)
            Helpers.showDelta(
                delta[0],
                "As funções não possuem pontos de interseção reais",
                "As funções se encontram em: x = " + Writing.decimal(delta[1]),
                "As funções se encontram em: x₁ = " + Writing.decimal(delta[1]) + ", x₂ = " + Writing.decimal(delta[2])
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
     * @returns {number[]} - Retorna os coeficientes em formato de array numérico [a, b, c]
     * @since v6.1.0
     */
    unknown(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let repeat = false,
            points = [0],
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
                if (!isFinite(coefA)) {
                    coefA = 0
                }
                if (!isFinite(coefB)) {
                    coefB = 0
                }
                if (!isFinite(coefC)) {
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

                    coefC = points[1]
                }

                // Afim
                else if (coefA == 0 && coefB != 0) {
                    // Únicas
                    if ((coefB == "b" && coefC != "c") || (coefC == "c" && coefB != "b")) {
                        points = Algebra.point()

                        if (coefC == "c") {
                            coefC = points[1] - coefB * points[0]
                        } else if (coefB == "b") {
                            if (points[0] != 0) {
                                coefB = Algebra.division(points[1] - coefC, points[0])
                            } else {
                                Error.divZero("x ≠ 0")
                                repeat = true
                            }
                        }
                    }

                    // Duplas
                    else if (coefB == "b" && coefC == "c") {
                        points = Algebra.point(2)

                        if (points[0] != points[2] && (points[0] != 0 || points[2] != 0)) {
                            coefB = Algebra.division(points[3] - points[1], points[2] - points[0])
                            coefC = points[1] - coefB * points[0]
                        } else {
                            Error.divZero("x ≠ 0 e x₁ ≠ x₂")
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

                        if (points[0] != 0) {
                            coefA = Algebra.division(points[1] - coefB * points[0] - coefC, points[0] * points[0])
                        } else {
                            Error.divZero("x ≠ 0")
                            repeat = true
                        }
                    }

                    // b
                    else if (coefB == "b" && coefA != "a" && coefC != "c") {
                        points = Algebra.point()

                        if (points[0] != 0) {
                            coefB = Algebra.division(points[1] - coefA * (points[0] * points[0]) - coefC, points[0])
                        } else {
                            Error.divZero("x ≠ 0")
                            repeat = true
                        }
                    }

                    // c
                    else if (coefC == "c" && coefB != "b" && coefA != "a") {
                        points = Algebra.point()

                        coefC = points[1] - coefA * (points[0] * points[0]) - coefB * points[0]
                    }

                    // Duplas

                    // a, b
                    else if (coefA == "a" && coefB == "b" && coefC != "c") {
                        points = Algebra.point(2)

                        if (points[0] != 0 && points[0] != points[2]) {
                            denominator = points[0] * points[2] * (points[0] - points[2])
                            coefA = Algebra.division(
                                (points[1] - coefC) * points[2] - (points[3] - coefC) * points[0],
                                denominator
                            )
                            coefB = Algebra.division(
                                (points[3] - coefC) * points[0] * points[0] -
                                    (points[1] - coefC) * points[2] * points[2],
                                denominator
                            )
                        } else {
                            Error.divZero("x ≠ 0 e x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // a, c
                    else if (coefA == "a" && coefB != "b" && coefC == "c") {
                        points = Algebra.point(2)

                        denominator = points[0] * points[0] - points[2] * points[2]
                        if (denominator != 0) {
                            coefA = Algebra.division(
                                points[1] - coefB * points[0] - (points[3] - coefB * points[2]),
                                denominator
                            )
                            coefC = points[1] - coefA * (points[0] * points[0]) - coefB * points[0]
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // b, c
                    else if (coefA != "a" && coefB == "b" && coefC == "c") {
                        points = Algebra.point(2)

                        if (points[0] != points[2]) {
                            coefB = Algebra.division(
                                points[3] - coefA * points[2] * points[2] - (points[1] - coefA * points[0] * points[0]),
                                points[2] - points[0]
                            )
                            coefC = points[1] - coefA * (points[0] * points[0]) - coefB * points[0]
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repeat = true
                        }
                    }

                    // Triplas
                    else if (coefA == "a" && coefB == "b" && coefC == "c") {
                        points = Algebra.point(3)

                        diff1 = points[3] - points[1]
                        diff2 = points[5] - points[1]
                        term1 = points[2] * points[2] - points[0] * points[0]
                        term2 = points[2] - points[0]
                        term3 = points[4] * points[4] - points[0] * points[0]
                        term4 = points[4] - points[0]
                        denominator = term1 * term4 - term2 * term3

                        if (denominator != 0) {
                            coefA = Algebra.division(diff1 * term4 - term2 * diff2, denominator)
                            coefB = Algebra.division(term1 * diff2 - diff1 * term3, denominator)
                            coefC = points[1] - coefA * (points[0] * points[0]) - coefB * points[0]
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

                    coefA = Algebra.round(
                        Algebra.division(points[1] - coefC, coefB, false) ** Algebra.division(1, points[0], false)
                    )
                }

                // b
                else if (coefB == "b" && coefA != "a" && coefC != "c") {
                    points = Algebra.point()

                    coefB = Algebra.division(points[1] - coefC, coefA ** points[0])
                }

                // c
                else if (coefC == "c" && coefB != "b" && coefA != "a") {
                    points = Algebra.point()

                    coefC = points[1] - coefB * coefA ** points[0]
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    points = Algebra.point(2)

                    coefA = Algebra.round(
                        Algebra.division(points[1] - coefC, points[3] - coefC, false) **
                            Algebra.division(1, points[0] - points[2], false)
                    )
                    coefB = Algebra.division(points[1] - coefC, coefA ** points[0])
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(2)

                    Ui.warning("Não posso ainda descobrir o valor de a e c quando tenho somente o b", "Em construção.")
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    points = Algebra.point(2)

                    coefB = Algebra.division(points[3] - points[1], coefA ** points[2] - coefA ** points[0])
                    coefC = points[1] - coefB * coefA ** points[0]
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(3)

                    Ui.warning("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Logarítmica
            else if (funcLog) {
                // Únicas

                // a
                if (coefA == "a" && coefB != "b" && coefC != "c") {
                    points = Algebra.point()

                    coefA = Algebra.round(points[0] ** Algebra.division(coefB, points[1] - coefC, false))
                }

                // b
                else if (coefA != "a" && coefB == "b" && coefC != "c") {
                    points = Algebra.point()

                    coefB = Algebra.division(points[1] - coefC, Algebra.log(points[0], coefA))
                }

                // c
                else if (coefA != "a" && coefB != "b" && coefC == "c") {
                    points = Algebra.point()

                    coefC = points[1] - Algebra.round(coefB * Algebra.log(points[0], coefA))
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    // pontoLog = algebra.ponto(2)

                    Ui.warning("Não posso ainda descobrir o valor de a e b quando tenho somente o c", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    points = Algebra.point(2)

                    coefA = Algebra.round(
                        Algebra.division(points[0], points[2], false) **
                            Algebra.division(coefB, points[1] - points[3], false)
                    )
                    coefC = points[1] - coefB * Algebra.log(points[0], coefA)
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    points = Algebra.point(2)

                    coefB = Algebra.division(
                        points[1] - points[3],
                        Algebra.log(points[0], coefA) - Algebra.log(points[2], coefA)
                    )
                    coefC = points[1] - coefB * Algebra.log(points[0], coefA)
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoLog = algebra.ponto(3)

                    Ui.warning("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Erro
            if (!isFinite(coefA) || !isFinite(coefB) || !isFinite(coefC)) {
                Error.divZero("Valores inválidos.")
                if (
                    Ui.confirm(
                        "Queres mudar os valores dos coeficientes?",
                        "Se quiser alterar os valores dos pontos, escolha “Cancelar”"
                    )
                ) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    State.askCoeffs = true
                    State.loop = true
                    repeat = false
                } else {
                    if (!isFinite(coefA)) {
                        coefA = "a"
                    }
                    if (!isFinite(coefB)) {
                        coefB = "b"
                    }
                    if (!isFinite(coefC)) {
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
     * @returns {number} - Resultado
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
            Error.invalidLog("log", "x > 0 e base > 0, base ≠ 1")
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

        return Algebra.round(y)
    },

    /**
     * [NUMÉRICO] Log de x na base E
     * @param {number} x - Número
     * @param {number} precision - Casas decimais
     * @returns {number} - Resultado
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
        while (Algebra.absolute(delta) > precision && limit < Config.interactionLimit) {
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
     * @returns {number} - Resultado
     * @since v6.1.0
     */
    division(numerator = 0, denominator = 1, round = true, precision = Config.divPrecision) {
        let result = 0

        // Valida
        if (denominator == 0 || !isFinite(numerator) || !isFinite(denominator)) {
            return NaN
        }

        // Denominador pequeno
        if (Algebra.absolute(denominator) <= precision) {
            return NaN
        }

        result = numerator / denominator

        // Infinito
        if (!isFinite(result)) {
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
     * @param {string | number} number - Número
     * @param {boolean} round - Se irá arredondar
     * @param {number} precision - Precisão do arredondamento
     * @returns {number} - Número absoluto
     * @since v6.1.0
     */
    absolute(number = 0, round = true, precision = Config.decimalPlaces) {
        number = Writing.decimal(number, true, round, precision)

        // Valida
        if (!isFinite(number)) {
            return NaN
        }

        return Math.abs(number)
    },
}
