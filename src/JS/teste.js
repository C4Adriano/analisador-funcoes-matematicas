import { Algebra } from "./algebra.js"
import { Helpers } from "./helpers.js"
import { Ui } from "./ui.js"
import { Analisar } from "./analisar.js"

/**
 * Objeto de testes do programa
 * - Use as funções aqui para testar as funcionalidades do programa.
 */
export const Teste = {
    /**
     * Executa os testes do programa
     * @since v6.1.0
     */
    rodar() {
        let opcao = 0
        do {
            opcao = Ui.intervalo(
                "=== Testes ===\n1 = Constante\n2 = Afim\n3 = Quadrática\n4 = Exponencial\n5 = Logarítmica\n6 = Contas\n0 = Sair",
                "",
                0,
                6,
            )

            if (opcao == 1) {
                Teste.constante()
            } else if (opcao == 2) {
                Teste.afim()
            } else if (opcao == 3) {
                Teste.quadratica()
            } else if (opcao == 4) {
                Teste.exponencial()
            } else if (opcao == 5) {
                Teste.logaritmica()
            } else if (opcao == 6) {
                Teste.contas()
            }
        } while (opcao != 0)
    },

    /**
     * Testa a função constante com diferentes coeficientes
     * @since v6.1.0
     */
    constante() {
        Ui.exibir("Testando constante...")
        Analisar.constante(5) // Normal
        Analisar.constante(0) // Nula
        Analisar.constante(-3) // Negativa
    },

    /**
     * Testa a função afim com diferentes coeficientes
     * @since v6.1.0
     */
    afim() {
        Ui.exibir("Testando afim...")
        Analisar.afim(1, 0) // Identidade: x
        Analisar.afim(-1, 0) // Oposta: -x
        Analisar.afim(2, -4) // Raiz em x = 2
        Analisar.afim(1, 1) // Crescente com c positivo
        Analisar.afim(-2, 6) // Decrescente com raiz em x = 3
    },

    /**
     * Testa a função quadrática com diferentes coeficientes
     * @since v6.1.0
     */
    quadratica() {
        Ui.exibir("Testando quadrática...")
        Analisar.quadratica(1, 0, 0) // Pura: x²
        Analisar.quadratica(1, -3, 2) // Δ > 0: raízes em x = 1 e x = 2
        Analisar.quadratica(1, -2, 1) // Δ = 0: raiz dupla em x = 1
        Analisar.quadratica(1, 0, 1) // Δ < 0: sem raízes reais
        Analisar.quadratica(-1, 0, 4) // Concavidade para baixo
    },

    /**
     * Testa a função exponencial com diferentes coeficientes
     * @since v6.1.0
     */
    exponencial() {
        Ui.exibir("Testando exponencial...")
        Analisar.exponencial(2, 1, 0) // Pura: 2ˣ
        Analisar.exponencial(2, 1, -1) // Com assíntota em y = -1
        Analisar.exponencial(0.5, 1, 0) // Base < 1: decrescente
        Analisar.exponencial(2, -1, 0) // b negativo: decrescente
        // Casos de erro esperados:
        // analisar.exponencial(1, 1, 0) → constante (a = 1)
        // analisar.exponencial(-2, 1, 0) → inválida (a < 0)
    },

    /**
     * Testa a função logarítmica com diferentes coeficientes
     * @since v6.1.0
     */
    logaritmica() {
        Ui.exibir("Testando logarítmica...")
        Analisar.logaritmica(2, 1, 0) // Pura: log₂(x)
        Analisar.logaritmica(10, 1, 0) // Decimal: log₁₀(x)
        Analisar.logaritmica(Math.E, 1, 0) // Natural: ln(x)
        Analisar.logaritmica(2, 1, -1) // Com deslocamento
        Analisar.logaritmica(0.5, 1, 0) // Base < 1: decrescente
        // Casos de erro esperados:
        // analisar.logaritmica(1, 1, 0) → constante (a = 1)
        // analisar.logaritmica(-2, 1, 0) → inválida (a < 0)
    },

    /**
     * Testa as funções auxiliares do programa (arredondamento, divisão, logaritmos, delta, vértice, etc.)
     * @since v6.1.0
     */
    contas() {
        let resultados = [],
            erros = 0

        // algebra.arredonda
        resultados.push(["arredonda(3.14159, 2)", Algebra.arredonda(3.14159, 2), 3.14])
        resultados.push(["arredonda(-0, 2)", Algebra.arredonda(-0, 2), 0])
        resultados.push(["arredonda(1.005, 2)", Algebra.arredonda(1.005, 2), 1.01])
        resultados.push(["arredonda(1.005, 2)", Algebra.arredonda(1.005, 2), 1.01])
        resultados.push(["arredonda(1.045, 2)", Algebra.arredonda(1.045, 2), 1.05])
        resultados.push(["arredonda(1.055, 2)", Algebra.arredonda(1.055, 2), 1.06])

        // algebra.divisao
        resultados.push(["divisao(10, 3)", Algebra.divisao(10, 3), 3.333333])
        resultados.push(["divisao(1, 0)", Algebra.divisao(1, 0), NaN])
        resultados.push(["divisao(0, 5)", Algebra.divisao(0, 5), 0])

        // algebra.log
        resultados.push(["log(100, 10)", Algebra.log(100, 10), 2])
        resultados.push(["log(8, 2)", Algebra.log(8, 2), 3])
        resultados.push(["log(1, 10)", Algebra.log(1, 10), 0])
        resultados.push(["log(-1, 10)", Algebra.log(-1, 10), NaN])

        // algebra.ln
        resultados.push(["ln(1)", Algebra.ln(1), 0])
        resultados.push(["ln(Math.E)", Algebra.ln(Math.E), 1])
        resultados.push(["ln(0)", Algebra.ln(0), NaN])

        // helpers.calcDelta
        let d1 = Helpers.calcDelta(1, -3, 2)
        resultados.push(["calcDelta(1,-3,2)[0]", d1[0], 1]) // Δ = 1
        resultados.push(["calcDelta(1,-3,2)[1]", d1[1], 1]) // x₁ = 1
        resultados.push(["calcDelta(1,-3,2)[2]", d1[2], 2]) // x₂ = 2

        let d2 = Helpers.calcDelta(1, -2, 1)
        resultados.push(["calcDelta(1,-2,1)[0]", d2[0], 0]) // Δ = 0

        let d3 = Helpers.calcDelta(1, 0, 1)
        resultados.push(["calcDelta(1,0,1)[0]", d3[0], -4]) // Δ < 0

        // helpers.vertice
        let v = Helpers.vertice(1, -2, 0)
        resultados.push(["vertice(1,-2,0)[0]", v[0], 1]) // x do vértice
        resultados.push(["vertice(1,-2,0)[1]", v[1], 0]) // y do vértice

        // Monta relatório
        let relatorio = "=== Relatório de Contas ===\n"
        for (let i = 0; i < resultados.length; i++) {
            let nome = resultados[i][0],
                obtido = resultados[i][1],
                esperado = resultados[i][2]
            let passou = isNaN(esperado) ? isNaN(obtido) : obtido == esperado
            if (!passou) {
                erros++
            }
            relatorio +=
                (passou ? "✓" : "✗") +
                " " +
                nome +
                " → " +
                obtido +
                (passou ? "" : " (esperado: " + esperado + ")") +
                "\n"
        }

        relatorio += "\n" + (erros == 0 ? "✓ Todos os testes passaram!" : "✗ " + erros + " erro(s) encontrado(s)")
        Ui.exibir(relatorio)
    },
}
