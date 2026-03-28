import { config } from "./config.js"
import { erro } from "./erro.js"
import { escrita } from "./escrita.js"
import { helpers } from "./helpers.js"
import { state } from "./state.js"
import { ui } from "./ui.js"

/**
 * Objeto base para as funções envolvendo algebra
 * - Use as funções aqui para fazer cálculos, pedir variáveis, pontos e outras coisas relacionadas a álgebra. As funções de escrita são usadas para exibir os resultados, então as mensagens são formatadas automaticamente conforme as configurações.
 */
export const algebra = {
    /**
     * Arredonda um número
     * @param {number} numero Número
     * @param {number} casas Casas decimais
     * @returns Número arredondado
     */
    arredonda(numero = 0, casas = config.casasDecimais) {
        numero = escrita.decimal(numero, true)

        if (isFinite(numero)) {
            numero = Math.round(numero * 10 ** casas) / 10 ** casas
            if (numero == "-0") {
                numero = 0
            }
        }

        return numero
    },

    /**
     * Pede uma variável
     * @param {string} nome Nome da variável
     * @returns Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     */
    variaveis(nome = "x") {
        let valor = ui.entrada(nome + " = ", "Digite “" + nome + "” caso queira que “" + nome + "” seja uma incógnita.")

        if (isFinite(escrita.decimal(valor, true))) {
            return algebra.arredonda(valor)
        }

        return nome
    },

    /**
     * Pede um(ns) ponto(s)
     * @param {number} tipo Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
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
        x1 = ui.entrada("x₁ = ", "", true)
        y1 = ui.entrada("y₁ = ", "", true)
        array.push(x1, y1)

        if (tipo == 2 || tipo == 3) {
            x2 = ui.entrada("x₂ = ", "", true)
            y2 = ui.entrada("y₂ = ", "", true)
            array.push(x2, y2)

            if (tipo == 3) {
                x3 = ui.entrada("x₃ = ", "", true)
                y3 = ui.entrada("y₃ = ", "", true)
                array.push(x3, y3)
            }
        }

        return array
    },

    /**
     * Vê se as funções têm pontos de encontro
     * @param {number[]} func1 Primeira função [a, b, c]
     * @param {number[]} func2 Segunda função [a, b, c]
     */
    equacoes(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        let coefA = func1[0] - func2[0],
            coefB = func1[1] - func2[1],
            coefC = func1[2] - func2[2],
            x = 0

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                ui.exibir(
                    "As funções coincidem: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são iguais, em todos os pontos, elas se encontram.",
                )
            } else if (coefC != 0) {
                ui.exibir(
                    "As funções nunca se encontrarão: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ",
                    "Porque as funções são diferentes, não há ponto em que elas se encontrarão.",
                )
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = algebra.divisao(-coefC, coefB)
            ui.exibir("As funções se encontram em: x = " + escrita.decimal(x), "x = −c / b")
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = helpers.calcDelta(coefA, coefB, coefC)
            helpers.exibDelta(
                delta[0],
                "As funções não possuem pontos de interseção reais",
                "As funções se encontram em: x = " + escrita.decimal(delta[1]),
                "As funções se encontram em: x₁ = " + escrita.decimal(delta[1]) + ", x₂ = " + escrita.decimal(delta[2]),
            )
        }
    },

    /**
     * Descobre quais são as incógnitas
     * @param {string | number} coefA Coeficiente a
     * @param {string | number} coefB Coeficiente b
     * @param {string | number} coefC Coeficiente c
     * @param {boolean} funcExp Se é exponencial
     * @param {boolean} funcLog Se é logarítmica
     * @returns Retorna os coeficientes em formato de array numérico [a, b, c]
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
        ui.funcao(coefA, coefB, coefC, funcExp, funcLog, tipo)

        // Loop
        let limite = 0
        do {
            repetir = false

            // Polinomial
            if (!funcExp && !funcLog) {
                // Constante
                if (coefA == 0 && coefB == 0) {
                    pts = algebra.ponto()

                    coefC = pts[1]
                }

                // Afim
                else if (coefA == 0 && coefB != 0) {
                    // Únicas
                    if ((coefB == "b" && coefC != "c") || (coefC == "c" && coefB != "b")) {
                        pts = algebra.ponto()

                        if (coefC == "c") {
                            coefC = pts[1] - coefB * pts[0]
                        } else if (coefB == "b") {
                            if (pts[0] != 0) {
                                coefB = algebra.divisao(pts[1] - coefC, pts[0])
                            } else {
                                erro.divZero("x ≠ 0")
                                repetir = true
                            }
                        }
                    }

                    // Duplas
                    else if (coefB == "b" && coefC == "c") {
                        pts = algebra.ponto(2)

                        if (pts[0] != pts[2] && (pts[0] != 0 || pts[2] != 0)) {
                            coefB = algebra.divisao(pts[3] - pts[1], pts[2] - pts[0])
                            coefC = pts[1] - coefB * pts[0]
                        } else {
                            erro.divZero("x ≠ 0 e x₁ ≠ x₂")
                            repetir = true
                        }
                    }
                }

                // Quadrática
                else if (coefA != 0) {
                    // Únicas

                    // a
                    if (coefA == "a" && coefB != "b" && coefC != "c") {
                        pts = algebra.ponto()

                        if (pts[0] != 0) {
                            coefA = algebra.divisao(pts[1] - coefB * pts[0] - coefC, pts[0] * pts[0])
                        } else {
                            erro.divZero("x ≠ 0")
                            repetir = true
                        }
                    }

                    // b
                    else if (coefB == "b" && coefA != "a" && coefC != "c") {
                        pts = algebra.ponto()

                        if (pts[0] != 0) {
                            coefB = algebra.divisao(pts[1] - coefA * (pts[0] * pts[0]) - coefC, pts[0])
                        } else {
                            erro.divZero("x ≠ 0")
                            repetir = true
                        }
                    }

                    // c
                    else if (coefC == "c" && coefB != "b" && coefA != "a") {
                        pts = algebra.ponto()

                        coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                    }

                    // Duplas

                    // a, b
                    else if (coefA == "a" && coefB == "b" && coefC != "c") {
                        pts = algebra.ponto(2)

                        if (pts[0] != 0 && pts[0] != pts[2]) {
                            denominador = pts[0] * pts[2] * (pts[0] - pts[2])
                            coefA = algebra.divisao((pts[1] - coefC) * pts[2] - (pts[3] - coefC) * pts[0], denominador)
                            coefB = algebra.divisao(
                                (pts[3] - coefC) * pts[0] * pts[0] - (pts[1] - coefC) * pts[2] * pts[2],
                                denominador,
                            )
                        } else {
                            erro.divZero("x ≠ 0 e x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // a, c
                    else if (coefA == "a" && coefB != "b" && coefC == "c") {
                        pts = algebra.ponto(2)

                        denominador = pts[0] * pts[0] - pts[2] * pts[2]
                        if (denominador != 0) {
                            coefA = algebra.divisao(pts[1] - coefB * pts[0] - (pts[3] - coefB * pts[2]), denominador)
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            erro.divZero("x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // b, c
                    else if (coefA != "a" && coefB == "b" && coefC == "c") {
                        pts = algebra.ponto(2)

                        if (pts[0] != pts[2]) {
                            coefB = algebra.divisao(
                                pts[3] - coefA * pts[2] * pts[2] - (pts[1] - coefA * pts[0] * pts[0]),
                                pts[2] - pts[0],
                            )
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            erro.divZero("x₁ ≠ x₂")
                            repetir = true
                        }
                    }

                    // Triplas
                    else if (coefA == "a" && coefB == "b" && coefC == "c") {
                        pts = algebra.ponto(3)

                        dif1 = pts[3] - pts[1]
                        dif2 = pts[5] - pts[1]
                        term1 = pts[2] * pts[2] - pts[0] * pts[0]
                        term2 = pts[2] - pts[0]
                        term3 = pts[4] * pts[4] - pts[0] * pts[0]
                        term4 = pts[4] - pts[0]
                        denominador = term1 * term4 - term2 * term3

                        if (denominador != 0) {
                            coefA = algebra.divisao(dif1 * term4 - term2 * dif2, denominador)
                            coefB = algebra.divisao(term1 * dif2 - dif1 * term3, denominador)
                            coefC = pts[1] - coefA * (pts[0] * pts[0]) - coefB * pts[0]
                        } else {
                            erro.divZero("x₁ ≠ x₂")
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
                    pts = algebra.ponto()

                    coefA = algebra.arredonda(
                        algebra.divisao(pts[1] - coefC, coefB, false) ** algebra.divisao(1, pts[0], false),
                    )
                }

                // b
                else if (coefB == "b" && coefA != "a" && coefC != "c") {
                    pts = algebra.ponto()

                    coefB = algebra.divisao(pts[1] - coefC, coefA ** pts[0])
                }

                // c
                else if (coefC == "c" && coefB != "b" && coefA != "a") {
                    pts = algebra.ponto()

                    coefC = pts[1] - coefB * coefA ** pts[0]
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    pts = algebra.ponto(2)

                    coefA = algebra.arredonda(
                        algebra.divisao(pts[1] - coefC, pts[3] - coefC, false) **
                            algebra.divisao(1, pts[0] - pts[2], false),
                    )
                    coefB = algebra.divisao(pts[1] - coefC, coefA ** pts[0])
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(2)

                    ui.aviso("Não posso ainda descobrir o valor de a e c quando tenho somente o b", "Em construção.")
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    pts = algebra.ponto(2)

                    coefB = algebra.divisao(pts[3] - pts[1], coefA ** pts[2] - coefA ** pts[0])
                    coefC = pts[1] - coefB * coefA ** pts[0]
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoExp = algebra.ponto(3)

                    ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
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
                    pts = algebra.ponto()

                    coefA = algebra.arredonda(pts[0] ** algebra.divisao(coefB, pts[1] - coefC, false))
                }

                // b
                else if (coefA != "a" && coefB == "b" && coefC != "c") {
                    pts = algebra.ponto()

                    coefB = algebra.divisao(pts[1] - coefC, algebra.log(pts[0], coefA))
                }

                // c
                else if (coefA != "a" && coefB != "b" && coefC == "c") {
                    pts = algebra.ponto()

                    coefC = pts[1] - algebra.arredonda(coefB * algebra.log(pts[0], coefA))
                }

                // Duplas

                // a, b
                else if (coefA == "a" && coefB == "b" && coefC != "c") {
                    // pontoLog = algebra.ponto(2)

                    ui.aviso("Não posso ainda descobrir o valor de a e b quando tenho somente o c", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if (coefA == "a" && coefB != "b" && coefC == "c") {
                    pts = algebra.ponto(2)

                    coefA = algebra.arredonda(
                        algebra.divisao(pts[0], pts[2], false) ** algebra.divisao(coefB, pts[1] - pts[3], false),
                    )
                    coefC = pts[1] - coefB * algebra.log(pts[0], coefA)
                }

                // b, c
                else if (coefA != "a" && coefB == "b" && coefC == "c") {
                    pts = algebra.ponto(2)

                    coefB = algebra.divisao(pts[1] - pts[3], algebra.log(pts[0], coefA) - algebra.log(pts[2], coefA))
                    coefC = pts[1] - coefB * algebra.log(pts[0], coefA)
                }

                // Triplas
                else if (coefA == "a" && coefB == "b" && coefC == "c") {
                    // pontoLog = algebra.ponto(3)

                    ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Erro
            if (!isFinite(coefA) || !isFinite(coefB) || !isFinite(coefC)) {
                erro.divZero("Valores inválidos.")
                if (
                    ui.confirmar(
                        "Queres mudar os valores dos coeficientes?",
                        "Se quiser alterar os valores dos pontos, escolha “Cancelar”",
                    )
                ) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    state.pedirCoefs = true
                    state.loop = true
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
            if (helpers.estourouLimite(++limite)) {
                repetir = false
            }
        } while (repetir)

        return [coefA, coefB, coefC]
    },

    /**
     * Log de x na base
     * @param {number} x Número
     * @param {number} base Base
     * @param {number} precisao Casas decimais
     * @returns Resultado
     */
    log(x = 0, base = Math.E, precisao = config.logPrecisao) {
        let y = x > 1 ? 1 : -1,
            numero = 0,
            delta = 0,
            lnX = 0,
            lnBase = 0

        // Valida
        if (x <= 0 || base <= 0 || base == 1) {
            erro.logInvalido("log", "x > 0 e base > 0, base ≠ 1")
            return NaN
        }

        numero = algebra.ln(base)
        delta = algebra.divisao(base ** y - x, base ** y * numero, false)

        // Mudança de base
        if (base < 1) {
            lnX = algebra.ln(x)
            lnBase = algebra.ln(base)
            if (!isFinite(lnX) || !isFinite(lnBase) || lnBase == 0) {
                return NaN
            }

            return algebra.divisao(lnX, lnBase)
        }

        // Loop
        let limite = 0
        while (Math.abs(delta) > precisao && limite < config.limiteInteracoes) {
            delta = algebra.divisao(base ** y - x, base ** y * numero, false)
            y -= delta

            // Limite
            if (helpers.estourouLimite(++limite)) {
                return NaN
            }
        }

        return algebra.arredonda(y)
    },

    /**
     * Log de x na base E
     * @param {number} x Número
     * @param {number} precisao Casas decimais
     * @returns Resultado
     */
    ln(x = 0, precisao = config.logPrecisao) {
        let y = x > 1 ? 1 : -1,
            base = Math.E,
            delta = algebra.divisao(base ** y - x, base ** y, false)

        // Valida
        if (x <= 0) {
            erro.logInvalido("ln", "x > 0")
            return NaN
        }

        // Loop
        let limite = 0
        while (Math.abs(delta) > precisao && limite < config.limiteInteracoes) {
            delta = algebra.divisao(base ** y - x, base ** y, false)
            y -= delta

            // Limite
            if (helpers.estourouLimite(++limite)) {
                return NaN
            }
        }

        return algebra.arredonda(y)
    },

    /**
     * Divide dois números
     * @param {number} numerador Parte de cima da fração
     * @param {number} denominador Parte de baixo da fração
     * @param {boolean} arredondar Se irá arredondar
     * @param {number} precisao Precisão do arredondamento
     * @returns a/b
     */
    divisao(numerador = 0, denominador = 1, arredondar = true, precisao = config.divPrecisao) {
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
            return algebra.arredonda(resultado)
        }

        return resultado
    },
}
