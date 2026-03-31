import { Algebra } from "./algebra.js"
import { Config } from "./config.js"
import { Erro } from "./erro.js"
import { Escrita } from "./escrita.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"

/**
 * Objeto base para as ajudas de código (repetições) e cálculos comuns
 * - Use as funções aqui para obter ajudas comuns, como o domínio, imagem, interseção com os eixos, estudo do sinal, etc. As funções de ajuda também são usadas para exibir os resultados, então as explicações são feitas automaticamente conforme as configurações.
 */
export const Helpers = {
    /**
     * Monta o domínio de uma função
     * @param {string} pertence Intervalo de pertencimento
     * @param {string} explicacao Explicação
     */
    dominio(pertence = "∈ ℝ", explicacao = "A função pode assumir qualquer x real") {
        Ui.exibir("Domínio: x " + pertence, explicacao)
    },

    /**
     * Monta a imagem de uma função
     * @param {string} pertence Intervalo de pertencimento
     * @param {string} intervalo Se a função deve assumir algum intervalo diferente
     * @param {string} explicacao Explicação
     */
    imagem(pertence = "∈ ℝ", intervalo = ".", explicacao = "A função pode assumir qualquer y real") {
        Ui.exibir("Imagem: y " + pertence, explicacao + intervalo)
    },

    /**
     * Monta a intercessão com o eixo x de uma função
     * @param {string} raiz Raiz da função
     * @param {string} explicacao Explicação
     * @param {string} naoHa Mensagem quando não há interseção com o eixo x
     */
    eixoX(raiz = "0", explicacao = "c", naoHa = "Não existe raiz real, portanto não há interseção com o eixo x.") {
        let intersecao = "Interseção com o eixo x: "

        if (raiz == "0") {
            // Constante
            if (explicacao == 0) {
                // Se c = 0, a função é nula, então existe infinitas raízes
                Ui.exibir(intersecao + "∃∞ x ∈ ℝ", "y = 0, ∀ x ∈ ℝ")
            } else {
                // Se c ≠ 0, então não existe raiz
                Ui.exibir(intersecao + "∄! x ∈ ℝ", "y = c; se c ≠ 0 ⇒ ∄ x")
            }
        } else {
            // Outras funções
            if (isNaN(raiz)) {
                // Não polinomial
                Ui.exibir(intersecao + "∄", naoHa)
            } else {
                // Afim
                Ui.exibir(intersecao + "(" + Escrita.decimal(raiz) + ", 0)", "Ponto da raiz, (" + explicacao + ", 0)")
            }
        }
    },

    /**
     * Monta a intercessão com o eixo y de uma função
     * @param {string} ponto Ponto
     * @param {string} funcao Função
     * @param {string} explicacao Explicação
     */
    eixoY(ponto = "0", funcao = "c", explicacao = "c") {
        Ui.exibir(
            "Interseção com o eixo y: " + (ponto != "∄" ? "(0, " + Escrita.decimal(ponto) + ")" : "∄"),
            "Como y = " + funcao + (ponto != "∄" ? ", o ponto é sempre (0, " + explicacao + ")" : explicacao),
        )
    },

    /**
     * Monta o valor de y para o x dado
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    valoresX(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let x = Ui.entrada("x = ", "", true),
            mensagem = "Para x = " + Escrita.decimal(x) + ", "

        if (!funcExp && !funcLog) {
            // Polinomial
            Ui.exibir(
                mensagem + "y = " + Escrita.decimal(coefA * x ** 2 + coefB * x + coefC),
                "y = " + (coefA != 0 ? "a · x² + " : "") + (coefB != 0 ? "b · x + " : "") + "c",
            )
        } else if (funcExp) {
            // Exponencial
            Ui.exibir(mensagem + "y = " + Escrita.decimal(coefB * coefA ** x + coefC), "y = b × aˣ + c")
        } else if (funcLog) {
            // Logarítmica
            if (x > 0) {
                // O logaritmo só é definido para x > 0
                Ui.exibir(
                    mensagem + "y = " + Escrita.decimal(coefB * Algebra.log(x, coefA) + coefC),
                    "y = b × logₐ(x) + c",
                )
            } else {
                // Se x ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse x
                Ui.exibir(mensagem + "∄! y ∈ ℝ", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
            }
        }
    },

    /**
     * Monta o valor de x para o y dado
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    valoresY(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let y = Ui.entrada("y = ", "", true),
            mensagem = "Para y = " + Escrita.decimal(y) + ", "

        if (!funcExp && !funcLog) {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                if (y == coefC) {
                    // Se y = c, então existe infinitas soluções
                    Ui.exibir(mensagem + "∃∞ x ∈ ℝ", "y = c, ∀ x ∈ ℝ")
                } else {
                    // Se y ≠ c, então não existe solução
                    Ui.exibir(mensagem + "∄! x ∈ ℝ", "y = c; se y ≠ c ⇒ ∄ x")
                }
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                Ui.exibir(mensagem + "x = " + Escrita.decimal(Algebra.divisao(y - coefC, coefB)), "x = (y - c) / b")
            } else if (coefA != 0) {
                // Quadrática
                let delta = Helpers.calcDelta(coefA, coefB, coefC - y)
                Helpers.exibDelta(
                    delta[0],
                    mensagem + "∄! x ∈ ℝ",
                    mensagem + "x = " + Escrita.decimal(delta[1]),
                    mensagem + "x₁ = " + Escrita.decimal(delta[1]) + ", x₂ = " + Escrita.decimal(delta[2]),
                    true,
                )
            }
        } else {
            // Não polinomial
            let expoente = Algebra.divisao(y - coefC, coefB, false) // (y - c) / b
            if (funcExp) {
                // Exponencial
                if (expoente > 0) {
                    // Se (y - c) / b > 0, então o logaritmo é definido, então a função tem valor real para esse y
                    Ui.exibir(
                        mensagem + "x = " + Escrita.decimal(Algebra.divisao(Algebra.ln(expoente), Algebra.ln(coefA))),
                        "x = ln((y - c) / b) / ln(a)",
                    )
                } else {
                    // Se (y - c) / b ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse y
                    Ui.exibir(mensagem + "∄! x ∈ ℝ", "(y - c) / b ≤ 0")
                }
            } else if (funcLog) {
                // Logarítmica
                Ui.exibir(mensagem + "x = " + Escrita.decimal(coefA ** expoente), "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾")
            }
        }
    },

    /**
     * Monta o estudo do sinal de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    sinal(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let operacoes = [">", "<"],
            palavras = ["positiva", "negativa"]

        if (!funcExp && !funcLog) {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                let op = coefC > 0 ? 0 : 1
                Ui.exibir(
                    "ƒ(x) " + (coefC != 0 ? operacoes[op] : "=") + " 0, ∀ x ∈ ℝ",
                    "A função será sempre " +
                        (coefC != 0 ? palavras[op] : "nula") +
                        ", pois c " +
                        (coefC != 0 ? operacoes[op] : "=") +
                        " 0",
                )
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                let raizAfim = Helpers.calcRaiz(0, coefB, coefC),
                    op = coefB > 0 ? 0 : 1
                Ui.exibir(
                    "ƒ(x) " +
                        operacoes[op] +
                        " 0 se x " +
                        operacoes[(op + (coefB < 0 ? 1 : 0)) % 2] +
                        " " +
                        raizAfim +
                        "\nƒ(x) " +
                        operacoes[1 - op] +
                        " 0 se x " +
                        operacoes[(1 - op + (coefB < 0 ? 1 : 0)) % 2] +
                        " " +
                        raizAfim +
                        "\nƒ(x) = 0 em x = " +
                        raizAfim,
                    "Pois b " + operacoes[op] + " 0.",
                )
            } else if (coefA != 0) {
                // Quadrática
                let raizQuad = Helpers.calcRaiz(coefA, coefB, coefC),
                    op = coefA > 0 ? 0 : 1
                if (raizQuad[1] > raizQuad[2]) {
                    // Inverte para ficar de menor a maior
                    let temp = raizQuad[2]
                    raizQuad[2] = raizQuad[1]
                    raizQuad[1] = temp
                }
                if (raizQuad[0] < 0) {
                    // Sem raiz
                    Ui.exibir(
                        "ƒ(x) " + operacoes[op] + " 0, ∀ x ∈ ℝ",
                        "Conforme a concavidade e as raízes, a " + operacoes[op] + " 0 e Δ < 0.",
                    )
                } else if (raizQuad[0] == 0) {
                    // Uma raiz
                    Ui.exibir(
                        "ƒ(x) " + operacoes[op] + " 0, exceto em x = " + Escrita.decimal(raizQuad[1]),
                        "Conforme a concavidade e a raiz, a " + operacoes[op] + " 0 e Δ = 0.",
                    )
                } else {
                    // Duas raízes
                    if (coefA < 0) {
                        // Concavidade para baixo
                        Ui.exibir(
                            "ƒ(x) > 0 se " +
                                Escrita.decimal(raizQuad[1]) +
                                " < x < " +
                                Escrita.decimal(raizQuad[2]) +
                                "\nƒ(x) < 0 se (x < " +
                                Escrita.decimal(raizQuad[1]) +
                                ") ∨ (x > " +
                                Escrita.decimal(raizQuad[2]) +
                                ")\nƒ(x) = 0 em x = " +
                                Escrita.decimal(raizQuad[1]) +
                                ", " +
                                Escrita.decimal(raizQuad[2]),
                            "Conforme a concavidade e as raízes, a < 0 e Δ > 0.",
                        )
                    } else {
                        // Concavidade para cima
                        Ui.exibir(
                            "ƒ(x) > 0 se (x < " +
                                Escrita.decimal(raizQuad[1]) +
                                ") ∨ (x > " +
                                Escrita.decimal(raizQuad[2]) +
                                ")\nƒ(x) < 0 se " +
                                Escrita.decimal(raizQuad[1]) +
                                " < x < " +
                                Escrita.decimal(raizQuad[2]) +
                                "\nƒ(x) = 0 em x = " +
                                Escrita.decimal(raizQuad[1]) +
                                ", " +
                                Escrita.decimal(raizQuad[2]),
                            "Conforme a concavidade e as raízes, a > 0 e Δ > 0.",
                        )
                    }
                }
            }
        } else {
            // Não polinomial
            if (funcExp) {
                // Exponencial
                if (Algebra.divisao(-coefC, coefB, false) > 0) {
                    // Raiz
                    let raizExp = Helpers.calcRaiz(coefA, coefB, coefC, true)
                    if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                        // Curva para cima
                        Ui.exibir(
                            "ƒ(x) > 0 se x > " +
                                Escrita.decimal(raizExp) +
                                "\nƒ(x) < 0 se x < " +
                                Escrita.decimal(raizExp) +
                                "\nƒ(x) = 0 em x = " +
                                Escrita.decimal(raizExp),
                            "Conforme a curva e a raiz, neste caso, crescente e (−c) / b > 0.",
                        )
                    } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                        // Curva para baixo
                        Ui.exibir(
                            "ƒ(x) > 0 se x < " +
                                Escrita.decimal(raizExp) +
                                "\nƒ(x) < 0 se x > " +
                                Escrita.decimal(raizExp) +
                                "\nƒ(x) = 0 em x = " +
                                Escrita.decimal(raizExp),
                            "Conforme a curva e a raiz, neste caso, decrescente e (−c) / b > 0.",
                        )
                    }
                } else if (coefB > 0) {
                    // Sem raiz, mas curva para cima
                    Ui.exibir("ƒ(x) > 0, ∀ x ∈ ℝ", "Conforme b > 0 e (−c) / b ≤ 0.")
                } else {
                    // Sem raiz, mas curva para baixo
                    Ui.exibir("ƒ(x) < 0, ∀ x ∈ ℝ", "Conforme b < 0 e (−c) / b ≤ 0.")
                }
            } else if (funcLog) {
                // Logarítmica
                let raizLog = Helpers.calcRaiz(coefA, coefB, coefC, false, true)
                if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                    // Curva para cima
                    Ui.exibir(
                        "ƒ(x) > 0 se x > " +
                            Escrita.decimal(raizLog) +
                            "\nƒ(x) < 0 se x < " +
                            Escrita.decimal(raizLog) +
                            "\nƒ(x) = 0 em x = " +
                            Escrita.decimal(raizLog),
                        "Conforme a curva (crescente)",
                    )
                } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                    // Curva para baixo
                    Ui.exibir(
                        "ƒ(x) > 0 se x < " +
                            Escrita.decimal(raizLog) +
                            "\nƒ(x) < 0 se x > " +
                            Escrita.decimal(raizLog) +
                            "\nƒ(x) = 0 em x = " +
                            Escrita.decimal(raizLog),
                        "Conforme a curva (decrescente)",
                    )
                }
            }
        }
    },

    /**
     * Monta a equação de duas funções
     * @param {boolean} polinomial Polinomial
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @returns Operação futura
     */
    equacoes(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) {
            // Polinomial
            if (State.funcBase.length == 0) {
                // Salvar a primeira função para comparar depois
                State.funcBase = [coefA, coefB, coefC]
                State.pedirCoefs = true
                State.loop = true
                Ui.aviso("ƒ₁(x) salva.", "Digite ƒ₂(x) para comparar.")
                return 0
            } else {
                // Comparar as duas funções
                Algebra.equacoes(State.funcBase, [coefA, coefB, coefC])
                State.funcBase = []
                return 1
            }
        } else {
            // Não polinomial
            Ui.aviso(
                "Ainda não posso resolver equações com funções não polinomiais.",
                "Em construção, use valores para x e y por enquanto.",
            )
        }
    },

    /**
     * Monta a curva de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {boolean} polinomial Polinomial
     */
    curva(coefA = 0, coefB = 0, polinomial = true) {
        if (!polinomial) {
            if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                Ui.exibir("Crescente", "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)")
            } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                Ui.exibir("Decrescente", "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)")
            }
        } else {
            if (coefB != 0) {
                if (coefB > 0) {
                    Ui.exibir("Crescente", "Aponta para cima, pois b > 0")
                } else if (coefB < 0) {
                    Ui.exibir("Decrescente", "Aponta para baixo, pois b < 0")
                }
            } else if (coefA != 0) {
                if (coefA > 0) {
                    Ui.exibir("Concavidade para cima", "a > 0")
                } else if (coefA < 0) {
                    Ui.exibir("Concavidade para baixo", "a < 0")
                }
            }
        }
    },

    /**
     * Calcula a raiz de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     * @returns Raiz
     */
    calcRaiz(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        if (!funcExp && !funcLog) {
            if (coefA == 0 && coefB == 0) {
                return NaN
            } else if (coefA == 0 && coefB != 0) {
                return Algebra.divisao(-coefC, coefB)
            } else if (coefA != 0) {
                return Helpers.calcDelta(coefA, coefB, coefC)
            }
        } else {
            let expoente = Algebra.divisao(-coefC, coefB, false)
            if (funcExp) {
                if (expoente > 0) {
                    return Algebra.divisao(Algebra.ln(expoente), Algebra.ln(coefA))
                } else {
                    return NaN
                }
            } else if (funcLog) {
                return Algebra.arredonda(coefA ** expoente)
            }
        }
    },

    /**
     * Mostra a raiz de uma função
     * @param {string} raiz Raiz
     * @param {string} explicacao Explicação
     * @param {string} naoHa Mensagem quando não há raiz
     */
    exibRaiz(raiz = "0", explicacao = "c", naoHa = "") {
        let intersecao = "Raiz real: "
        if (isNaN(raiz)) {
            Ui.exibir(intersecao + "∄! x ∈ ℝ", naoHa)
        } else {
            Ui.exibir(intersecao + "x = " + Escrita.decimal(raiz), "A raiz é x = " + explicacao)
        }
    },

    /**
     * Calcula o Delta de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @returns Delta
     */
    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        let array = [coefB ** 2 - 4 * coefA * coefC]
        array.push(array[0] >= 0 ? Algebra.divisao(-coefB + Math.sqrt(array[0]), 2 * coefA) : NaN)
        array.push(array[0] > 0 ? Algebra.divisao(-coefB - Math.sqrt(array[0]), 2 * coefA) : NaN)

        if (array[0] > 0 && array[1] > array[2]) {
            let temp = array[2]
            array[2] = array[1]
            array[1] = temp
        }

        return array
    },

    /**
     * Exibe o Delta de uma função
     * @param {number} delta Delta
     * @param {string} menor Mensagem para Delta < 0
     * @param {string} igual Mensagem para Delta = 0
     * @param {string} maior Mensagem para Delta > 0
     * @param {boolean} temY Se é (c - y)
     */
    exibDelta(delta = 0, menor = "", igual = "", maior = "", temY = false) {
        if (delta < 0) {
            Ui.exibir(menor, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ < 0 ⇒ x ∉ ℝ")
        } else if (delta == 0) {
            Ui.exibir(igual, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ = 0 ⇒ x = (-b) / (2 · a)")
        } else {
            Ui.exibir(maior, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ > 0 ⇒ x₁, x₂ = (-b ± √Δ) / (2 · a)")
        }
    },

    /**
     * Calcula o vértice de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} delta Delta
     * @returns Vértice
     */
    vertice(coefA = 0, coefB = 0, delta = 0) {
        return [Algebra.divisao(-coefB, 2 * coefA), Algebra.divisao(-delta, 4 * coefA)]
    },

    /**
     * Vê se estourou o limite
     * @param {number} limite Limite
     * @returns Se estourou o limite
     */
    estourouLimite(limite = Config.limiteInteracoes) {
        let estourou = limite >= Config.limiteInteracoes

        // Exibe o erro se estourou o limite
        if (estourou) {
            Erro.limiteEstourado()
        }

        return estourou
    },
}
