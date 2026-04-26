import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Helpers } from "./helpers.js"
import { Ui } from "./ui.js"

/**
 * [DEBUG] Objeto de testes do programa
 * - Use as funções aqui para testar as funcionalidades do programa.
 * @since v6.1.0
 */
export const Test = {
    /**
     * [DEBUG] Executa os testes do programa
     * @since v6.1.0
     */
    start() {
        let option = 0
        do {
            option = Ui.range(
                "=== Testes ===\n1 = Constante\n2 = Afim\n3 = Quadrática\n4 = Exponencial\n5 = Logarítmica\n6 = Contas\n0 = Sair",
                "",
                0,
                6
            )

            if (option == 1) {
                Test.constant()
            } else if (option == 2) {
                Test.affine()
            } else if (option == 3) {
                Test.quadratic()
            } else if (option == 4) {
                Test.exponential()
            } else if (option == 5) {
                Test.logarithmic()
            } else if (option == 6) {
                Test.math()
            }
        } while (option != 0)
    },

    /**
     * [DEBUG] Testa a função constante com diferentes coeficientes
     * @since v6.1.0
     */
    constant() {
        Ui.display("Testando constante...")
        Analyze.constant(5) // Normal
        Analyze.constant(0) // Nula
        Analyze.constant(-3) // Negativa
    },

    /**
     * [DEBUG] Testa a função afim com diferentes coeficientes
     * @since v6.1.0
     */
    affine() {
        Ui.display("Testando afim...")
        Analyze.affine(1, 0) // Identidade: x
        Analyze.affine(-1, 0) // Oposta: -x
        Analyze.affine(2, -4) // Raiz em x = 2
        Analyze.affine(1, 1) // Crescente com c positivo
        Analyze.affine(-2, 6) // Decrescente com raiz em x = 3
    },

    /**
     * [DEBUG] Testa a função quadrática com diferentes coeficientes
     * @since v6.1.0
     */
    quadratic() {
        Ui.display("Testando quadrática...")
        Analyze.quadratic(1, 0, 0) // Pura: x²
        Analyze.quadratic(1, -3, 2) // Δ > 0: raízes em x = 1 e x = 2
        Analyze.quadratic(1, -2, 1) // Δ = 0: raiz dupla em x = 1
        Analyze.quadratic(1, 0, 1) // Δ < 0: sem raízes reais
        Analyze.quadratic(-1, 0, 4) // Concavidade para baixo
    },

    /**
     * [DEBUG] Testa a função exponencial com diferentes coeficientes
     * @since v6.1.0
     */
    exponential() {
        Ui.display("Testando exponencial...")
        Analyze.exponential(2, 1, 0) // Pura: 2ˣ
        Analyze.exponential(2, 1, -1) // Com assíntota em y = -1
        Analyze.exponential(0.5, 1, 0) // Base < 1: decrescente
        Analyze.exponential(2, -1, 0) // b negativo: decrescente
        // Casos de erro esperados:
        // analisar.exponencial(1, 1, 0) → constante (a = 1)
        // analisar.exponencial(-2, 1, 0) → inválida (a < 0)
    },

    /**
     * [DEBUG] Testa a função logarítmica com diferentes coeficientes
     * @since v6.1.0
     */
    logarithmic() {
        Ui.display("Testando logarítmica...")
        Analyze.logarithmic(2, 1, 0) // Pura: log₂(x)
        Analyze.logarithmic(10, 1, 0) // Decimal: log₁₀(x)
        Analyze.logarithmic(Math.E, 1, 0) // Natural: ln(x)
        Analyze.logarithmic(2, 1, -1) // Com deslocamento
        Analyze.logarithmic(0.5, 1, 0) // Base < 1: decrescente
        // Casos de erro esperados:
        // Analisar.logarithmic(1, 1, 0) → constante (a = 1)
        // Analisar.logarithmic(-2, 1, 0) → inválida (a < 0)
    },

    /**
     * [DEBUG] Testa as funções auxiliares do programa (arredondamento, divisão, logaritmos, delta, vértice, etc.)
     * @since v6.1.0
     */
    math() {
        let result = [],
            errors = 0

        // algebra.round
        result.push(["round(3.14159, 2)", Algebra.round(3.14159, 2), 3.14])
        result.push(["round(-0, 2)", Algebra.round(-0, 2), 0])
        result.push(["round(1.005, 2)", Algebra.round(1.005, 2), 1.01])
        result.push(["round(1.005, 2)", Algebra.round(1.005, 2), 1.01])
        result.push(["round(1.045, 2)", Algebra.round(1.045, 2), 1.05])
        result.push(["round(1.055, 2)", Algebra.round(1.055, 2), 1.06])

        // algebra.division
        result.push(["division(10, 3)", Algebra.division(10, 3), 3.333333])
        result.push(["division(1, 0)", Algebra.division(1, 0), NaN])
        result.push(["division(0, 5)", Algebra.division(0, 5), 0])

        // algebra.log
        result.push(["log(100, 10)", Algebra.log(100, 10), 2])
        result.push(["log(8, 2)", Algebra.log(8, 2), 3])
        result.push(["log(1, 10)", Algebra.log(1, 10), 0])
        result.push(["log(-1, 10)", Algebra.log(-1, 10), NaN])

        // algebra.ln
        result.push(["ln(1)", Algebra.ln(1), 0])
        result.push(["ln(Math.E)", Algebra.ln(Math.E), 1])
        result.push(["ln(0)", Algebra.ln(0), NaN])

        // helpers.calcDelta
        let d1 = Helpers.calcDelta(1, -3, 2)
        result.push(["calcDelta(1,-3,2)[0]", d1[0], 1]) // Δ = 1
        result.push(["calcDelta(1,-3,2)[1]", d1[1], 1]) // x₁ = 1
        result.push(["calcDelta(1,-3,2)[2]", d1[2], 2]) // x₂ = 2

        let d2 = Helpers.calcDelta(1, -2, 1)
        result.push(["calcDelta(1,-2,1)[0]", d2[0], 0]) // Δ = 0

        let d3 = Helpers.calcDelta(1, 0, 1)
        result.push(["calcDelta(1,0,1)[0]", d3[0], -4]) // Δ < 0

        // helpers.vertex
        let v = Helpers.vertex(1, -2, 0)
        result.push(["vertex(1,-2,0)[0]", v[0], 1]) // x do vértice
        result.push(["vertex(1,-2,0)[1]", v[1], 0]) // y do vértice

        // Monta relatório
        let logs = "=== Relatório de Contas ===\n"
        for (let i = 0; i < result.length; i++) {
            let name = result[i][0],
                gated = result[i][1],
                waited = result[i][2]
            let pass = isNaN(waited) ? isNaN(gated) : gated == waited
            if (!pass) {
                errors++
            }
            logs += (pass ? "✓" : "✗") + " " + name + " → " + gated + (pass ? "" : " (esperado: " + waited + ")") + "\n"
        }

        logs += "\n" + (errors == 0 ? "✓ Todos os testes passaram!" : "✗ " + errors + " erro(s) encontrado(s)")
        Ui.display(logs)
    },
}
