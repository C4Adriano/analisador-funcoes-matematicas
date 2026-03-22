import { algebra } from "./algebra.js"
import { analisar } from "./analisar.js"
import { escrita } from "./escrita.js"
import { helpers } from "./helpers.js"
import { state } from "./state.js"
import { ui } from "./ui.js"

let opcoesBase = ["Domínio", "Imagem", "Interseção com o eixo x", "Interseção com o eixo y", "Valores para x", "Valores para y", "Estudo do sinal", "Equações entre funções"],
opcoesConst = [].concat(opcoesBase),
opcoesAfim = ["Inclinação", "Raiz"].concat(opcoesBase),
opcoesQuad = ["Concavidade", "Raízes", "Vértice"].concat(opcoesBase),
opcoesExp = ["Curva", "Raiz", "Assíntota"].concat(opcoesBase),
opcoesLog = ["Curva", "Raiz"].concat(opcoesBase)

/**
 * Objeto base para as funções envolvendo funções matemáticas, seus estudos e características
 * - Use as funções aqui para montar as funções constantes, afins, quadráticas, exponenciais e logarítmicas. As funções de escrita são usadas para exibir os resultados, então as mensagens são formatadas automaticamente conforme as configurações.
 */
export const analisar = {
    /**
     * Monta uma função constante: ƒ(x) = c
     * @param {number} coefC Coeficiente c da função constante
     * @returns Retorna: [coefC]
     */
    constante(coefC = state.globalC) {
        let opcao = 0, pagina = 1, menuResp = [0, ""]

        // Mostra
        ui.funcao(0, 0, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = ui.menu(opcoesConst, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]

            // Página 1
            if (pagina == 1) {
                // Domínio
                if (opcao == 1) {
                    helpers.dominio()
                }

                // Imagem
                else if (opcao == 2) {
                    helpers.imagem("= " + escrita.decimal(coefC), ".", "A função só tem esse valor de y, pois y = c")
                }

                // Interseção com o eixo x
                else if (opcao == 3) {
                    helpers.eixoX("0", coefC)
                }

                // Interseção com o eixo y
                else if (opcao == 4) {
                    helpers.eixoY(coefC, "c", "c")
                }

                // Valores para x
                else if (opcao == 5) {
                    helpers.valoresX(0, 0, coefC)
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Valores para y
                if (opcao == 1) {
                    helpers.valoresY(0, 0, coefC)
                }

                // Estudo do sinal
                else if (opcao == 2) {
                    helpers.sinal(0, 0, coefC)
                }

                // Equações
                else if (opcao == 3) {
                    opcao = helpers.equacoes(true, 0, 0, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(0, 0, coefC, false, false, true)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefC])
    },

    /**
     * Monta uma função afim: ƒ(x) = bx + c
     * @param {number} coefB Coeficiente b da função afim
     * @param {number} coefC Coeficiente c da função afim
     * @returns Retorna: [coefB, coefC]
     */
    afim(coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0, pagina = 1, menuResp = [0, ""]

        // Mostra
        ui.funcao(0, coefB, coefC)

        // Cálculo
        let raiz = helpers.calcRaiz(0, coefB, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = ui.menu(opcoesAfim, pagina)
            pagina = menuResp[1]
            opcao = menuResp[0]

            // Página 1
            if (pagina == 1) {
                // Inclinação
                if (opcao == 1) {
                    helpers.curva(0, coefB)
                }

                // Raiz
                else if (opcao == 2) {
                    helpers.exibRaiz(raiz, "(−c) / b")
                }

                // Domínio
                else if (opcao == 3) {
                    helpers.dominio()
                }

                // Imagem
                else if (opcao == 4) {
                    helpers.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    helpers.eixoX(raiz, "(−c) / b")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    helpers.eixoY(coefC, "bx + c", "c")
                }

                // Valores para x
                else if (opcao == 2) {
                    helpers.valoresX(0, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 3) {
                    helpers.valoresY(0, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    helpers.sinal(0, coefB, coefC)
                }

                // Equações
                else if (opcao == 5) {
                    opcao = helpers.equacoes(true, 0, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(0, coefB, coefC, false, false, true)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefB, coefC])
    },

    /**
     * Monta uma função quadrática: ƒ(x) = ax² + bx + c
     * @param {number} coefA Coeficiente a da função quadrática
     * @param {number} coefB Coeficiente b da função quadrática
     * @param {number} coefC Coeficiente c da função quadrática
     * @returns Retorna: [coefA, coefB, coefC]
     */
    quadratica(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0, pagina = 1, menuResp = [0, ""]

        // Mostra
        ui.funcao(coefA, coefB, coefC)

        // Cálculo
        let delta = helpers.calcDelta(coefA, coefB, coefC), vertice = helpers.vertice(coefA, coefB, delta[0])

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = ui.menu(opcoesQuad, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]

            // Página 1
            if (pagina == 1) {
                // Concavidade
                if (opcao == 1) {
                    helpers.curva(coefA)
                }

                // Raízes
                else if (opcao == 2) {
                    helpers.exibDelta(delta[0], "Não há raízes reais.", "Raiz real: x₁ = x₂ = " + escrita.decimal(delta[1]), "Raízes reais: x₁ = " + escrita.decimal(delta[1]) + ", x₂ = " + escrita.decimal(delta[2]))
                }

                // Vértice
                else if (opcao == 3) {
                    ui.exibir("Vértice: (" + escrita.decimal(vertice[0]) + ", " + escrita.decimal(vertice[1]) + ")", "Ponto mais baixo (ou mais alto, conforme a concavidade) da função. Ponto (-b / (2 · a), -Δ / (4 · a))")
                }

                // Domínio
                else if (opcao == 4) {
                    helpers.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefA > 0) {
                        helpers.imagem("∈ [" + escrita.decimal(vertice[1]) + ", ∞)", " entre o vértice e o ∞.")
                    } else if (coefA < 0) {
                        helpers.imagem("∈ (-∞, " + escrita.decimal(vertice[1]) + "]", " entre -∞ e o vértice.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    helpers.exibDelta(delta[0], "Não há interseção com o eixo x.", "Interseção com o eixo x: (" + escrita.decimal(delta[1]) + ", 0)", "Interseções com o eixo x: (" + escrita.decimal(delta[1]) + ", 0) e (" + escrita.decimal(delta[2]) + ", 0)")
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    helpers.eixoY(coefC, "ax² + bx + c", "c")
                }

                // Valores para x
                else if (opcao == 3) {
                    helpers.valoresX(coefA, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 4) {
                    helpers.valoresY(coefA, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    helpers.sinal(coefA, coefB, coefC)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    opcao = helpers.equacoes(true, coefA, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, false, false, true)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    },

    /**
     * Monta uma função exponencial: ƒ(x) = b × aˣ + c
     * @param {number} coefA Coeficiente a da função exponencial
     * @param {number} coefB Coeficiente b da função exponencial
     * @param {number} coefC Coeficiente c da função exponencial
     * @returns Retorna: [coefA, coefB, coefC]
     */
    exponencial(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0, pagina = 1, menuResp = []

        // Mostra
        ui.funcao(coefA, coefB, coefC, true)

        // Cálculo
        let raiz = helpers.calcRaiz(coefA, coefB, coefC, true)

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = ui.menu(opcoesExp, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    helpers.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    helpers.exibRaiz(raiz, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Assíntota
                else if (opcao == 3) {
                    ui.exibir("Assíntota horizontal: y = " + escrita.decimal(coefC), "y = c")
                }

                // Domínio
                else if (opcao == 4) {
                    helpers.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefB > 0) {
                        helpers.imagem("∈ (" + escrita.decimal(coefC) + ", ∞)", " entre c e ∞, exceto o próprio c.")
                    } else {
                        helpers.imagem("∈ (-∞, " + escrita.decimal(coefC) + ")", " entre -∞ e c, exceto o próprio c.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    helpers.eixoX(raiz, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    helpers.eixoY(coefB + coefC, "b × aˣ + c", "b + c")
                }

                // Valores para x
                else if (opcao == 3) {
                    helpers.valoresX(coefA, coefB, coefC, true)
                }

                // Valores para y
                else if (opcao == 4) {
                    helpers.valoresY(coefA, coefB, coefC, true)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    helpers.sinal(coefA, coefB, coefC, true)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    helpers.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, true, false, true)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    },

    /**
     * Monta a função logarítmica: b × logₐ(x) + c
     * @param {number} coefA Coeficiente a da função logarítmica
     * @param {number} coefB Coeficiente b da função logarítmica
     * @param {number} coefC Coeficiente c da função logarítmica
     * @returns Retorna: [coefA, coefB, coefC]
     */
    logaritmica(coefA = state.globalA, coefB = state.globalB, coefC = state.globalC) {
        let opcao = 0, pagina = 1, menuResp = []

        // Mostra
        ui.funcao(coefA, coefB, coefC, false, true)

        // Cálculo
        let raiz = algebra.arredonda(coefA ** algebra.divisao(-coefC, coefB, false))

        // Loop
        let limite = 0
        do {
            // Menu
            menuResp = ui.menu(opcoesLog, pagina)
            opcao = menuResp[0]
            pagina = menuResp[1]

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    helpers.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    helpers.exibRaiz(raiz, "a⁽⁻ᶜ⁄ᵇ⁾")
                }

                // Domínio
                else if (opcao == 3) {
                    helpers.dominio("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Imagem
                else if (opcao == 4) {
                    helpers.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    helpers.eixoX(raiz, "a⁽⁻ᶜ⁄ᵇ⁾")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    helpers.eixoY("∄", "b × logₐ(x) + c", " x = 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Valores para x
                else if (opcao == 2) {
                    helpers.valoresX(coefA, coefB, coefC, false, true)
                }

                // Valores para y
                else if (opcao == 3) {
                    helpers.valoresY(coefA, coefB, coefC, false, true)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    helpers.sinal(coefA, coefB, coefC, false, true)
                }

                // Equações
                else if (opcao == 5) {
                    helpers.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, false, true, true)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    }
}