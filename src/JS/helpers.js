import { Algebra } from "./algebra.js"
import { Config } from "./config.js"
import { Error } from "./error.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * [FUNÇÃO] Objeto base para as ajudas de código (repetições) e cálculos comuns
 * - Use as funções aqui para obter ajudas comuns, como o domínio, imagem, interseção com os eixos, estudo do sinal, etc.
 * @since v6.1.0
 */
export const Helpers = {
    /**
     * [FUNÇÃO] Monta o domínio de uma função
     * @param {string} belongs - Intervalo de pertencimento
     * @param {string} explanation - Explicação
     * @since v6.1.0
     */
    domain(belongs = "∈ ℝ", explanation = "A função pode assumir qualquer x real") {
        Ui.display("Domínio: x " + belongs, explanation)
    },

    /**
     * [FUNÇÃO] Monta a imagem de uma função
     * @param {string} belongs - Intervalo de pertencimento
     * @param {string} interval - Se a função deve assumir algum intervalo diferente
     * @param {string} explanation - Explicação
     * @since v6.1.0
     */
    range(belongs = "∈ ℝ", interval = ".", explanation = "A função pode assumir qualquer y real") {
        Ui.display("Imagem: y " + belongs, explanation + interval)
    },

    /**
     * [FUNÇÃO] Monta a intercessão com o eixo x de uma função
     * @param {number} root - Raiz
     * @param {string} explanation - Explicação
     * @param {string} noHave - Mensagem quando não há interseção com o eixo x
     * @since v6.1.0
     */
    xAxis(root = 0, explanation = "c", noHave = "Não existe raiz real, portanto não há interseção com o eixo x.") {
        let intersection = "Interseção com o eixo x: "

        if (root == 0) {
            // Constante
            if (explanation == 0) {
                // Se c = 0, a função é nula, então existe infinitas raízes
                Ui.display(intersection + "∃∞ x ∈ ℝ", "y = 0, ∀ x ∈ ℝ")
            } else {
                // Se c ≠ 0, então não existe raiz
                Ui.display(intersection + "∄! x ∈ ℝ", "y = c; se c ≠ 0 ⇒ ∄ x")
            }
        } else {
            // Outras funções
            if (isNaN(root)) {
                // Não polinomial
                Ui.display(intersection + "∄", noHave)
            } else {
                // Afim
                Ui.display(
                    intersection + "(" + Writing.decimal(root) + ", 0)",
                    "Ponto da raiz, (" + explanation + ", 0)"
                )
            }
        }
    },

    /**
     * [FUNÇÃO] Monta a intercessão com o eixo y de uma função
     * @param {string | number} point - Ponto
     * @param {string} function - Função
     * @param {string} explanation - Explicação
     * @since v6.1.0
     */
    yAxis(point = 0, func = "c", explanation = "c") {
        Ui.display(
            "Interseção com o eixo y: " + (point != "∄" ? "(0, " + Writing.decimal(point) + ")" : "∄"),
            "Como y = " + func + (point != "∄" ? ", o ponto é sempre (0, " + explanation + ")" : explanation)
        )
    },

    /**
     * [FUNÇÃO] Monta o valor de y para o x dado
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @param {boolean} funcExp - Exponencial
     * @param {boolean} funcLog - Logarítmica
     * @since v6.1.0
     */
    xValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let x = Ui.input("x = ", "", true),
            message = "Para x = " + Writing.decimal(x) + ", "

        if (!funcExp && !funcLog) {
            // Polinomial
            Ui.display(
                message + "y = " + Writing.decimal(coefA * x ** 2 + coefB * x + coefC),
                "y = " + (coefA != 0 ? "a · x² + " : "") + (coefB != 0 ? "b · x + " : "") + "c"
            )
        } else if (funcExp) {
            // Exponencial
            Ui.display(message + "y = " + Writing.decimal(coefB * coefA ** x + coefC), "y = b × aˣ + c")
        } else if (funcLog) {
            // Logarítmica
            if (x > 0) {
                // O logaritmo só é definido para x > 0
                Ui.display(
                    message + "y = " + Writing.decimal(coefB * Algebra.log(x, coefA) + coefC),
                    "y = b × logₐ(x) + c"
                )
            } else {
                // Se x ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse x
                Ui.display(message + "∄! y ∈ ℝ", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
            }
        }
    },

    /**
     * [FUNÇÃO] Monta o valor de x para o y dado
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @param {boolean} funcExp - Exponencial
     * @param {boolean} funcLog - Logarítmica
     * @since v6.1.0
     */
    yValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let y = Ui.input("y = ", "", true),
            message = "Para y = " + Writing.decimal(y) + ", "

        if (!funcExp && !funcLog) {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                if (y == coefC) {
                    // Se y = c, então existe infinitas soluções
                    Ui.display(message + "∃∞ x ∈ ℝ", "y = c, ∀ x ∈ ℝ")
                } else {
                    // Se y ≠ c, então não existe solução
                    Ui.display(message + "∄! x ∈ ℝ", "y = c; se y ≠ c ⇒ ∄ x")
                }
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                Ui.display(message + "x = " + Writing.decimal(Algebra.division(y - coefC, coefB)), "x = (y - c) / b")
            } else if (coefA != 0) {
                // Quadrática
                let delta = Helpers.calcDelta(coefA, coefB, coefC - y)
                Helpers.showDelta(
                    delta[0],
                    message + "∄! x ∈ ℝ",
                    message + "x = " + Writing.decimal(delta[1]),
                    message + "x₁ = " + Writing.decimal(delta[1]) + ", x₂ = " + Writing.decimal(delta[2]),
                    true
                )
            }
        } else {
            // Não polinomial
            let exponent = Algebra.division(y - coefC, coefB, false) // (y - c) / b
            if (funcExp) {
                // Exponencial
                if (exponent > 0) {
                    // Se (y - c) / b > 0, então o logaritmo é definido, então a função tem valor real para esse y
                    Ui.display(
                        message + "x = " + Writing.decimal(Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA))),
                        "x = ln((y - c) / b) / ln(a)"
                    )
                } else {
                    // Se (y - c) / b ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse y
                    Ui.display(message + "∄! x ∈ ℝ", "(y - c) / b ≤ 0")
                }
            } else if (funcLog) {
                // Logarítmica
                Ui.display(message + "x = " + Writing.decimal(coefA ** exponent), "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾")
            }
        }
    },

    /**
     * [FUNÇÃO] Monta o estudo do sinal de uma função
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @param {boolean} funcExp - Exponencial
     * @param {boolean} funcLog - Logarítmica
     * @since v6.1.0
     */
    sign(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let operations = { positive: ">", negative: "<" },
            words = { positive: "positiva", negative: "negativa" }

        if (!funcExp && !funcLog) {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                let op = coefC > 0 ? "positive" : "negative"
                Ui.display(
                    "ƒ(x) " + (coefC != 0 ? operations[op] : "=") + " 0, ∀ x ∈ ℝ",
                    "A função será sempre " +
                        (coefC != 0 ? words[op] : "nula") +
                        ", pois c " +
                        (coefC != 0 ? operations[op] : "=") +
                        " 0"
                )
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                let affineRoot = Helpers.calcRoot(0, coefB, coefC),
                    op = coefB > 0 ? "positive" : "negative"
                Ui.display(
                    "ƒ(x) " +
                        operations[op] +
                        " 0 se x " +
                        operations[(op + (coefB < 0 ? 1 : 0)) % 2] +
                        " " +
                        affineRoot +
                        "\nƒ(x) " +
                        operations[1 - op] +
                        " 0 se x " +
                        operations[(1 - op + (coefB < 0 ? 1 : 0)) % 2] +
                        " " +
                        affineRoot +
                        "\nƒ(x) = 0 em x = " +
                        affineRoot,
                    "Pois b " + operations[op] + " 0."
                )
            } else if (coefA != 0) {
                // Quadrática
                let quadRoot = Helpers.calcRoot(coefA, coefB, coefC),
                    op = coefA > 0 ? "positive" : "negative"
                if (quadRoot[1] > quadRoot[2]) {
                    // Inverte para ficar de menor a maior
                    let temp = quadRoot[2]
                    quadRoot[2] = quadRoot[1]
                    quadRoot[1] = temp
                }
                if (quadRoot[0] < 0) {
                    // Sem raiz
                    Ui.display(
                        "ƒ(x) " + operations[op] + " 0, ∀ x ∈ ℝ",
                        "Conforme a concavidade e as raízes, a " + operations[op] + " 0 e Δ < 0."
                    )
                } else if (quadRoot[0] == 0) {
                    // Uma raiz
                    Ui.display(
                        "ƒ(x) " + operations[op] + " 0, exceto em x = " + Writing.decimal(quadRoot[1]),
                        "Conforme a concavidade e a raiz, a " + operations[op] + " 0 e Δ = 0."
                    )
                } else {
                    // Duas raízes
                    if (coefA < 0) {
                        // Concavidade para baixo
                        Ui.display(
                            "ƒ(x) > 0 se " +
                                Writing.decimal(quadRoot[1]) +
                                " < x < " +
                                Writing.decimal(quadRoot[2]) +
                                "\nƒ(x) < 0 se (x < " +
                                Writing.decimal(quadRoot[1]) +
                                ") ∨ (x > " +
                                Writing.decimal(quadRoot[2]) +
                                ")\nƒ(x) = 0 em x = " +
                                Writing.decimal(quadRoot[1]) +
                                ", " +
                                Writing.decimal(quadRoot[2]),
                            "Conforme a concavidade e as raízes, a < 0 e Δ > 0."
                        )
                    } else {
                        // Concavidade para cima
                        Ui.display(
                            "ƒ(x) > 0 se (x < " +
                                Writing.decimal(quadRoot[1]) +
                                ") ∨ (x > " +
                                Writing.decimal(quadRoot[2]) +
                                ")\nƒ(x) < 0 se " +
                                Writing.decimal(quadRoot[1]) +
                                " < x < " +
                                Writing.decimal(quadRoot[2]) +
                                "\nƒ(x) = 0 em x = " +
                                Writing.decimal(quadRoot[1]) +
                                ", " +
                                Writing.decimal(quadRoot[2]),
                            "Conforme a concavidade e as raízes, a > 0 e Δ > 0."
                        )
                    }
                }
            }
        } else {
            // Não polinomial
            if (funcExp) {
                // Exponencial
                if (Algebra.division(-coefC, coefB, false) > 0) {
                    // Raiz
                    let expRoot = Helpers.calcRoot(coefA, coefB, coefC, true)
                    if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                        // Curva para cima
                        Ui.display(
                            "ƒ(x) > 0 se x > " +
                                Writing.decimal(expRoot) +
                                "\nƒ(x) < 0 se x < " +
                                Writing.decimal(expRoot) +
                                "\nƒ(x) = 0 em x = " +
                                Writing.decimal(expRoot),
                            "Conforme a curva e a raiz, neste caso, crescente e (−c) / b > 0."
                        )
                    } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                        // Curva para baixo
                        Ui.display(
                            "ƒ(x) > 0 se x < " +
                                Writing.decimal(expRoot) +
                                "\nƒ(x) < 0 se x > " +
                                Writing.decimal(expRoot) +
                                "\nƒ(x) = 0 em x = " +
                                Writing.decimal(expRoot),
                            "Conforme a curva e a raiz, neste caso, decrescente e (−c) / b > 0."
                        )
                    }
                } else if (coefB > 0) {
                    // Sem raiz, mas curva para cima
                    Ui.display("ƒ(x) > 0, ∀ x ∈ ℝ", "Conforme b > 0 e (−c) / b ≤ 0.")
                } else {
                    // Sem raiz, mas curva para baixo
                    Ui.display("ƒ(x) < 0, ∀ x ∈ ℝ", "Conforme b < 0 e (−c) / b ≤ 0.")
                }
            } else if (funcLog) {
                // Logarítmica
                let logRoot = Helpers.calcRoot(coefA, coefB, coefC, false, true)
                if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                    // Curva para cima
                    Ui.display(
                        "ƒ(x) > 0 se x > " +
                            Writing.decimal(logRoot) +
                            "\nƒ(x) < 0 se x < " +
                            Writing.decimal(logRoot) +
                            "\nƒ(x) = 0 em x = " +
                            Writing.decimal(logRoot),
                        "Conforme a curva (crescente)"
                    )
                } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                    // Curva para baixo
                    Ui.display(
                        "ƒ(x) > 0 se x < " +
                            Writing.decimal(logRoot) +
                            "\nƒ(x) < 0 se x > " +
                            Writing.decimal(logRoot) +
                            "\nƒ(x) = 0 em x = " +
                            Writing.decimal(logRoot),
                        "Conforme a curva (decrescente)"
                    )
                }
            }
        }
    },

    /**
     * [FUNÇÃO] Monta a equação de duas funções
     * @param {boolean} polinomial - Polinomial
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @returns {number} - Operação futura
     * @since v6.1.0
     */
    equations(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) {
            // Polinomial
            if (State.baseFunc.length == 0) {
                // Salvar a primeira função para comparar depois
                State.baseFunc = [coefA, coefB, coefC]
                State.askCoeffs = true
                State.loop = true
                Ui.warning("ƒ₁(x) salva.", "Digite ƒ₂(x) para comparar.")
                return 0
            } else {
                // Comparar as duas funções
                Algebra.equations(State.baseFunc, [coefA, coefB, coefC])
                State.baseFunc = []
                return 1
            }
        } else {
            // Não polinomial
            Ui.warning(
                "Ainda não posso resolver equações com funções não polinomiais.",
                "Em construção, use valores para x e y por enquanto."
            )
        }
    },

    /**
     * [FUNÇÃO] Monta a curva de uma função
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {boolean} polynomial - Polinomial
     * @since v6.1.0
     */
    curve(coefA = 0, coefB = 0, polynomial = true) {
        if (!polynomial) {
            if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                Ui.display("Crescente", "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)")
            } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                Ui.display("Decrescente", "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)")
            }
        } else {
            if (coefB != 0) {
                if (coefB > 0) {
                    Ui.display("Crescente", "Aponta para cima, pois b > 0")
                } else if (coefB < 0) {
                    Ui.display("Decrescente", "Aponta para baixo, pois b < 0")
                }
            } else if (coefA != 0) {
                if (coefA > 0) {
                    Ui.display("Concavidade para cima", "a > 0")
                } else if (coefA < 0) {
                    Ui.display("Concavidade para baixo", "a < 0")
                }
            }
        }
    },

    /**
     * [FUNÇÃO] Calcula a raiz de uma função
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @param {boolean} funcExp - Exponencial
     * @param {boolean} funcLog - Logarítmica
     * @returns {number} - Raiz
     * @since v6.1.0
     */
    calcRoot(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        if (!funcExp && !funcLog) {
            if (coefA == 0 && coefB == 0) {
                return NaN
            } else if (coefA == 0 && coefB != 0) {
                return Algebra.division(-coefC, coefB)
            } else if (coefA != 0) {
                return Helpers.calcDelta(coefA, coefB, coefC)
            }
        } else {
            let exponent = Algebra.division(-coefC, coefB, false)
            if (funcExp) {
                if (exponent > 0) {
                    return Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA))
                } else {
                    return NaN
                }
            } else if (funcLog) {
                return Algebra.round(coefA ** exponent)
            }
        }
    },

    /**
     * [FUNÇÃO] Mostra a raiz de uma função
     * @param {string} root - Raiz
     * @param {string} explanation - Explicação
     * @param {string} noHave - Mensagem quando não há raiz
     * @since v6.1.0
     */
    showRoot(root = 0, explanation = "c", noHave = "") {
        let intersection = "Raiz real: "
        if (isNaN(root)) {
            Ui.display(intersection + "∄! x ∈ ℝ", noHave)
        } else {
            Ui.display(intersection + "x = " + Writing.decimal(root), "A raiz é x = " + explanation)
        }
    },

    /**
     * [FUNÇÃO] Calcula o Delta de uma função
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} coefC - Coeficiente c
     * @returns {number[]} - Delta
     * @since v6.1.0
     */
    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        let array = [coefB ** 2 - 4 * coefA * coefC]
        array.push(array[0] >= 0 ? Algebra.division(-coefB + Math.sqrt(array[0]), 2 * coefA) : NaN)
        array.push(array[0] > 0 ? Algebra.division(-coefB - Math.sqrt(array[0]), 2 * coefA) : NaN)

        if (array[0] > 0 && array[1] > array[2]) {
            let temp = array[2]
            array[2] = array[1]
            array[1] = temp
        }

        return array
    },

    /**
     * [FUNÇÃO] Exibe o Delta de uma função
     * @param {number} delta - Delta
     * @param {string} lower - Mensagem para Delta < 0
     * @param {string} equal - Mensagem para Delta = 0
     * @param {string} higher - Mensagem para Delta > 0
     * @param {boolean} hasY - Se é (c - y)
     * @since v6.1.0
     */
    showDelta(delta = 0, lower = "", equal = "", higher = "", hasY = false) {
        if (delta < 0) {
            Ui.display(lower, "Δ = b² - 4 · a · " + (hasY ? "(c - y)" : "c") + " ⇒ Δ < 0 ⇒ x ∉ ℝ")
        } else if (delta == 0) {
            Ui.display(equal, "Δ = b² - 4 · a · " + (hasY ? "(c - y)" : "c") + " ⇒ Δ = 0 ⇒ x = (-b) / (2 · a)")
        } else {
            Ui.display(
                higher,
                "Δ = b² - 4 · a · " + (hasY ? "(c - y)" : "c") + " ⇒ Δ > 0 ⇒ x₁, x₂ = (-b ± √Δ) / (2 · a)"
            )
        }
    },

    /**
     * [FUNÇÃO] Calcula o vértice de uma função
     * @param {number} coefA - Coeficiente a
     * @param {number} coefB - Coeficiente b
     * @param {number} delta - Delta
     * @returns {number[]} - Vértice
     * @since v6.1.0
     */
    vertex(coefA = 0, coefB = 0, delta = 0) {
        return [Algebra.division(-coefB, 2 * coefA), Algebra.division(-delta, 4 * coefA)]
    },

    /**
     * [FUNÇÃO] Vê se estourou o limite
     * @param {number} limit - Limite
     * @returns {boolean} - Se estourou o limite
     * @since v6.1.0
     */
    exceededLimit(limit = Config.interactionLimit) {
        let exceeded = limit >= Config.interactionLimit

        // Exibe o erro se estourou o limite
        if (exceeded) {
            Error.limitExceeded()
        }

        return exceeded
    },

    /**
     * [FUNÇÃO] Calcula o período de uma função
     * @param {number} coefC - Coeficiente c
     * @returns {number} - Período
     * @since v6.1.0
     */
    calcPeriod(coefC = 0) {
        return Writing.decimal((2 * Math.PI) / Math.abs(coefC))
    },

    /**
     * [FUNÇÃO] Exibe o período de uma função
     * @param {number} coefC - Coeficiente c
     * @since v6.1.0
     */
    showPeriod(coefC = 0) {
        if (coefC != 0) {
            Ui.display("Período: " + Helpers.calcPeriod(coefC), "Período = 2π / |c|")
        } else {
            Ui.display("Período: ∞", "Se c = 0, a função é constante, então o período é infinito.")
        }
    },
}
