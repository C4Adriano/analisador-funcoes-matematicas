import { Config } from "./config.js"
import { Error } from "./erro.js"
import { Escrita } from "./escrita.js"
import { Helpers } from "./helpers.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"

/**
 * [NUMÉRICO] Objeto base para as funções envolvendo algebra
 * - Use as funções daqui para fazer cálculos, arredondar números, pedir variáveis e pontos, etc.
 * @since v6.1.0
 */
export const Algebra = {
    /**
     * [NUMÉRICO] Arredonda um número
     * @param {number} numero - Número
     * @param {number} casas - Casas decimais
     * @returns {number} - Número arredondado
     * @since v6.1.0
     */
    arredonda(numero = 0, casas = Config.decimalPlaces) {
        numero = Escrita.decimal(numero, true)

        if (isFinite(numero)) {
            numero = Math.round(numero * 10 ** casas) / 10 ** casas
            if (numero == "-0") {
                numero = 0
            }
        }

        return numero
    },

    /**
     * [UI] Pede uma variável
     * @param {string} nome - Nome da variável
     * @returns {string | number} - Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     * @since v6.1.0
     */
    variaveis(nome = "x") {
        let valor = Ui.entrada(nome + " = ", "Digite “" + nome + "” caso queira que “" + nome + "” seja uma incógnita.")

        if (isFinite(Escrita.decimal(valor, true))) {
            return Algebra.arredonda(valor)
        }

        return nome
    },

    /**
     * [UI] Pede um(ns) ponto(s)
     * @param {number} tipo - Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns {number[]} - Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @since v6.1.0
     */
    ponto(tipo = 1) {
        let array = [],
            x1 = 0,
            x2 = 0,
            x3 = 0,
            y1 = 0,
            y2 = 0,
            y3 = 0

        // Pergunta
        x1 = Ui.entrada("x₁ = ", "", true)
        y1 = Ui.entrada("y₁ = ", "", true)
        array.push(x1, y1)

        if (tipo == 2 || tipo == 3) {
            x2 = Ui.entrada("x₂ = ", "", true)
            y2 = Ui.entrada("y₂ = ", "", true)
            array.push(x2, y2)

            if (tipo == 3) {
                x3 = Ui.entrada("x₃ = ", "", true)
                y3 = Ui.entrada("y₃ = ", "", true)
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
    equacoes(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        let coefA = func1[0] - func2[0],
            coefB = func1[1] - func2[1],
            coefC = func1[2] - func2[2],
            x = 0

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                Ui.exibir(
                    "As funções coincidem: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são iguais, em todos os pontos, elas se encontram.",
                )
            } else if (coefC != 0) {
                Ui.exibir(
                    "As funções nunca se encontrarão: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são diferentes, não há ponto em que elas se encontrarão.",
                )
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = Algebra.divisao(-coefC, coefB)
            Ui.exibir("As funções se encontram em: x = " + Escrita.decimal(x), "x = −c / b")
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = Helpers.calcDelta(coefA, coefB, coefC)
            Helpers.exibDelta(
                delta[0],
                "As funções não possuem pontos de interseção reais",
                "As funções se encontram em: x = " + Escrita.decimal(delta[1]),
                "As funções se encontram em: x₁ = " + Escrita.decimal(delta[1]) + ", x₂ = " + Escrita.decimal(delta[2]),
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
     * @returns {number[]} - Retorna os coeficientes em formato de array numérico [a, b, c]
     * @since v6.1.0
     */
    incognita(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, tipo = 0) {
        let repetir = false,
            pts = [0],
            denominador = 0,
            dif1 = 0,
            dif2 = 0,
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
        Ui.funcao(coefA, coefB, coefC, funcExp, funcLog, tipo)

        // Loop
        let limite = 0
        do {
            repetir = false

            // Polinomial
            if (!funcExp && !funcLog) {
                // Constante
                if (coefA == 0 && coefB == 0) {
                    pts = Algebra.ponto()

                    coefC = pts[1]
                }

                // Afim
                else if (coefA == 0 && coefB != 0) {
                    // Únicas
                    if ((coefB == "b" && coefC != "c") || (coefC == "c" && coefB != "b")) {
                        pts = Algebra.ponto()

                        if (coefC == "c") {
                            coefC = pts[1] - coefB * pts[0]
                        } else if (coefB == "b") {
                            if (pts[0] != 0) {
                                coefB = Algebra.divisao(pts[1] - coefC, pts[0])
                            } else {
                                Error.divZero("x ≠ 0")
                                repetir = true
                            }
                        }
                    }

                    // Duplas
                    else if (coefB == "b" && coefC == "c") {
                        pts = Algebra.ponto(2)

                        if (pts[0] != pts[2] && (pts[0] != 0 || pts[2] != 0)) {
                            coefB = Algebra.divisao(pts[3] - pts[1], pts[2] - pts[0])
                            coefC = pts[1] - coefB * pts[0]
                        } else {
                            Error.divZero("x ≠ 0 e x₁ ≠ x₂")
                            repetir = true
                        }
                    }
                }

                // Quadrática
                else if (coefA != 0) {
                    // Únicas

                    // a
                    if (coefA == "a" && coefB != "b" && coefC != "c") {
                        pts = Algebra.ponto()

                        if (pts[0] != 0) {
                            coefA = Algebra.divisao(pts[1] - coefB * pts[0] - coefC, pts[0] * pts[0])
                        } else {
                            Error.divZero("x ≠ 0")
                            repetir = true
                        }
                    }

                    // b
                    else if (coefB == "b" && coefA != "a" && coefC != "c") {
                        pts = Algebra.ponto()

                        if (pts[0] != 0) {
                            coefB = Algebra.divisao(pts[1] - coefA * (pts[0] * pts[0]) - coefC, pts[0])
                        } else {
                            Error.divZero("x ≠ 0")
                            repetir = true
                        }
                    }

                    // c
                    else if (coefC == "c" && coefB != "b" && coefA != "a") {
                        pts = Algebra.ponto()

                        coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                    }

                    // Duplas

                    // a, b
                    else if (coefA == "a" && coefB == "b" && coefC != "c") {
                        pts = Algebra.ponto(2)

                        if (pts[0] != 0 && pts[0] != pts[2]) {
                            denominador = pts[0] * pts[2] * (pts[0] - pts[2])
                            coefA = Algebra.divisao((pts[1] - coefC) * pts[2] - (pts[3] - coefC) * pts[0], denominador)
                            coefB = Algebra.divisao(
                                (pts[3] - coefC) * pts[0] * pts[0] - (pts[1] - coefC) * pts[2] * pts[2],
                                denominador,
                            )
                        } else {
                            Error.divZero("x ≠ 0 e x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // a, c
                    else if (coefA == "a" && coefB != "b" && coefC == "c") {
                        pts = Algebra.ponto(2)

                        denominador = pts[0] * pts[0] - pts[2] * pts[2]
                        if (denominador != 0) {
                            coefA = Algebra.divisao(pts[1] - coefB * pts[0] - (pts[3] - coefB * pts[2]), denominador)
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // b, c
                    else if (coefA != "a" && coefB == "b" && coefC == "c") {
                        pts = Algebra.ponto(2)

                        if (pts[0] != pts[2]) {
                            coefB = Algebra.divisao(
                                pts[3] - coefA * pts[2] * pts[2] - (pts[1] - coefA * pts[0] * pts[0]),
                                pts[2] - pts[0],
                            )
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // Triplas
                    else if (coefA == "a" && coefB == "b" && coefC == "c") {
                        pts = Algebra.ponto(3)

                        dif1 = pts[3] - pts[1]
                        dif2 = pts[5] - pts[1]
                        term1 = pts[2] * pts[2] - pts[0] * pts[0]
                        term2 = pts[2] - pts[0]
                        term3 = pts[4] * pts[4] - pts[0] * pts[0]
                        term4 = pts[4] - pts[0]
                        denominador = term1 * term4 - term2 * term3

                        if (denominador != 0) {
                            coefA = Algebra.divisao(dif1 * term4 - term2 * dif2, denominador)
                            coefB = Algebra.divisao(term1 * dif2 - dif1 * term3, denominador)
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            Error.divZero("x₁ ≠ x₂")
                            repetir = true
                        }
                    }
                }
            }

            // Exponencial
            else if (funcExp) {
                // Únicas

                // a
                if (coefA == "a" && coefB != "b" && coefC != "c") {
                    pts = Algebra.ponto()

                    coefA = Algebra.arredonda(
                        Algebra.divisao(pts[1] - coefC, coefB, false) ** Algebra.divisao(1, pts[0], false),
                    )
                }

                // b
                else if (coefB == "b" && coefA != "a" && coefC != "c") {
                    pts = Algebra.ponto()

                    coefB = Algebra.divisao(pts[1] - coefC, coefA ** pts[0])
                }

                // c
                else if (coefC == "c" && coefB != "b" && coefA != "a") {
                    pts = Algebra.ponto()

                    coefC = pts[1] - coefB * coefA ** pts[0]
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    pts = Algebra.ponto(2)

                    coefA = Algebra.arredonda(
                        Algebra.divisao(pts[1] - coefC, pts[3] - coefC, false) **
                            Algebra.divisao(1, pts[0] - pts[2], false),
                    )
                    coefB = Algebra.divisao(pts[1] - coefC, coefA ** pts[0])
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(2)

                    Ui.aviso("Não posso ainda descobrir o valor de a e c quando tenho somente o b", "Em construção.")
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    pts = Algebra.ponto(2)

                    coefB = Algebra.divisao(pts[3] - pts[1], coefA ** pts[2] - coefA ** pts[0])
                    coefC = pts[1] - coefB * coefA ** pts[0]
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(3)

                    Ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
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
                    pts = Algebra.ponto()

                    coefA = Algebra.arredonda(pts[0] ** Algebra.divisao(coefB, pts[1] - coefC, false))
                }

                // b
                else if (coefA != "a" && coefB == "b" && coefC != "c") {
                    pts = Algebra.ponto()

                    coefB = Algebra.divisao(pts[1] - coefC, Algebra.log(pts[0], coefA))
                }

                // c
                else if (coefA != "a" && coefB != "b" && coefC == "c") {
                    pts = Algebra.ponto()

                    coefC = pts[1] - Algebra.arredonda(coefB * Algebra.log(pts[0], coefA))
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    // pontoLog = algebra.ponto(2)

                    Ui.aviso("Não posso ainda descobrir o valor de a e b quando tenho somente o c", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    pts = Algebra.ponto(2)

                    coefA = Algebra.arredonda(
                        Algebra.divisao(pts[0], pts[2], false) ** Algebra.divisao(coefB, pts[1] - pts[3], false),
                    )
                    coefC = pts[1] - coefB * Algebra.log(pts[0], coefA)
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    pts = Algebra.ponto(2)

                    coefB = Algebra.divisao(pts[1] - pts[3], Algebra.log(pts[0], coefA) - Algebra.log(pts[2], coefA))
                    coefC = pts[1] - coefB * Algebra.log(pts[0], coefA)
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoLog = algebra.ponto(3)

                    Ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Erro
            if (!isFinite(coefA) || !isFinite(coefB) || !isFinite(coefC)) {
                Error.divZero("Valores inválidos.")
                if (
                    Ui.confirmar(
                        "Queres mudar os valores dos coeficientes?",
                        "Se quiser alterar os valores dos pontos, escolha “Cancelar”",
                    )
                ) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    State.askCoeffs = true
                    State.loop = true
                    repetir = false
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
                    repetir = true
                }
            }

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                repetir = false
            }
        } while (repetir)

        return [coefA, coefB, coefC]
    },

    /**
     * [NUMÉRICO] Log de x na base
     * @param {number} x - Número
     * @param {number} base - Base
     * @param {number} precisao - Casas decimais
     * @returns {number} - Resultado
     * @since v6.1.0
     */
    log(x = 1, base = Math.E, precisao = Config.logPrecision) {
        let y = x > 1 ? 1 : -1,
            numero = 0,
            delta = 0,
            lnX = 0,
            lnBase = 0

        // Valida
        if (x <= 0 || base <= 0 || base == 1) {
            Error.invalidLog("log", "x > 0 e base > 0, base ≠ 1")
            return NaN
        }

        numero = Algebra.ln(base)
        delta = Algebra.divisao(base ** y - x, base ** y * numero, false)

        // Mudança de base
        if (base < 1) {
            lnX = Algebra.ln(x)
            lnBase = Algebra.ln(base)
            if (!isFinite(lnX) || !isFinite(lnBase) || lnBase == 0) {
                return NaN
            }

            return Algebra.divisao(lnX, lnBase)
        }

        // Loop
        let limite = 0
        while (Math.abs(delta) > precisao && limite < Config.interactionLimit) {
            delta = Algebra.divisao(base ** y - x, base ** y * numero, false)
            y -= delta

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                return NaN
            }
        }

        return Algebra.arredonda(y)
    },

    /**
     * [NUMÉRICO] Log de x na base E
     * @param {number} x - Número
     * @param {number} precisao - Casas decimais
     * @returns {number} - Resultado
     * @since v6.1.0
     */
    ln(x = 1, precisao = Config.logPrecision) {
        let y = x > 1 ? 1 : -1,
            base = Math.E,
            delta = Algebra.divisao(base ** y - x, base ** y, false)

        // Valida
        if (x <= 0) {
            Error.invalidLog("ln", "x > 0")
            return NaN
        }

        // Loop
        let limite = 0
        while (Math.abs(delta) > precisao && limite < Config.interactionLimit) {
            delta = Algebra.divisao(base ** y - x, base ** y, false)
            y -= delta

            // Limite
            if (Helpers.estourouLimite(++limite)) {
                return NaN
            }
        }

        return Algebra.arredonda(y)
    },

    /**
     * [NUMÉRICO] Divide dois números
     * @param {number} numerador - Parte de cima da fração
     * @param {number} denominador - Parte de baixo da fração
     * @param {boolean} arredondar - Se irá arredondar
     * @param {number} precisao - Precisão do arredondamento
     * @returns {number} - Resultado
     * @since v6.1.0
     */
    divisao(numerador = 0, denominador = 1, arredondar = true, precisao = Config.divPrecision) {
        let resultado = 0

        // Valida
        if (denominador == 0 || !isFinite(numerador) || !isFinite(denominador)) {
            return NaN
        }

        // Denominador pequeno
        if (Math.abs(denominador) <= precisao) {
            return NaN
        }

        resultado = numerador / denominador

        // Infinito
        if (!isFinite(resultado)) {
            return NaN
        }

        // Arredonda
        if (arredondar) {
            return Algebra.arredonda(resultado)
        }

        return resultado
    },
}
