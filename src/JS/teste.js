import { algebra } from "./algebra.js"
import { helpers } from "./helpers.js"
import { ui } from "./ui.js"
import { analisar } from "./analisar.js"

export const teste = {
    rodar() {
        let opcao = 0
        do {
            opcao = ui.intervalo(
                "=== Testes ===\n1 = Constante\n2 = Afim\n3 = Quadrática\n4 = Exponencial\n5 = Logarítmica\n6 = Contas\n0 = Sair",
                "",
                0,
                6,
            )

            if (opcao == 1) {
                teste.constante()
            } else if (opcao == 2) {
                teste.afim()
            } else if (opcao == 3) {
                teste.quadratica()
            } else if (opcao == 4) {
                teste.exponencial()
            } else if (opcao == 5) {
                teste.logaritmica()
            } else if (opcao == 6) {
                teste.contas()
            }
        } while (opcao != 0)
    },

    constante() {
        ui.exibir("Testando constante...")
        analisar.constante(5) // Normal
        analisar.constante(0) // Nula
        analisar.constante(-3) // Negativa
    },

    afim() {
        ui.exibir("Testando afim...")
        analisar.afim(1, 0) // Identidade: x
        analisar.afim(-1, 0) // Oposta: -x
        analisar.afim(2, -4) // Raiz em x = 2
        analisar.afim(1, 1) // Crescente com c positivo
        analisar.afim(-2, 6) // Decrescente com raiz em x = 3
    },

    quadratica() {
        ui.exibir("Testando quadrática...")
        analisar.quadratica(1, 0, 0) // Pura: x²
        analisar.quadratica(1, -3, 2) // Δ > 0: raízes em x = 1 e x = 2
        analisar.quadratica(1, -2, 1) // Δ = 0: raiz dupla em x = 1
        analisar.quadratica(1, 0, 1) // Δ < 0: sem raízes reais
        analisar.quadratica(-1, 0, 4) // Concavidade para baixo
    },

    exponencial() {
        ui.exibir("Testando exponencial...")
        analisar.exponencial(2, 1, 0) // Pura: 2ˣ
        analisar.exponencial(2, 1, -1) // Com assíntota em y = -1
        analisar.exponencial(0.5, 1, 0) // Base < 1: decrescente
        analisar.exponencial(2, -1, 0) // b negativo: decrescente
        // Casos de erro esperados:
        // analisar.exponencial(1, 1, 0) → constante (a = 1)
        // analisar.exponencial(-2, 1, 0) → inválida (a < 0)
    },

    logaritmica() {
        ui.exibir("Testando logarítmica...")
        analisar.logaritmica(2, 1, 0) // Pura: log₂(x)
        analisar.logaritmica(10, 1, 0) // Decimal: log₁₀(x)
        analisar.logaritmica(Math.E, 1, 0) // Natural: ln(x)
        analisar.logaritmica(2, 1, -1) // Com deslocamento
        analisar.logaritmica(0.5, 1, 0) // Base < 1: decrescente
        // Casos de erro esperados:
        // analisar.logaritmica(1, 1, 0) → constante (a = 1)
        // analisar.logaritmica(-2, 1, 0) → inválida (a < 0)
    },

    contas() {
        let resultados = [],
            erros = 0

        // algebra.arredonda
        resultados.push(["arredonda(3.14159, 2)", algebra.arredonda(3.14159, 2), 3.14])
        resultados.push(["arredonda(-0, 2)", algebra.arredonda(-0, 2), 0])
        resultados.push(["arredonda(1.005, 2)", algebra.arredonda(1.005, 2), 1.01])
        resultados.push(["arredonda(1.005, 2)", algebra.arredonda(1.005, 2), 1.01])
        resultados.push(["arredonda(1.045, 2)", algebra.arredonda(1.045, 2), 1.05])
        resultados.push(["arredonda(1.055, 2)", algebra.arredonda(1.055, 2), 1.06])

        // algebra.divisao
        resultados.push(["divisao(10, 3)", algebra.divisao(10, 3), 3.333333])
        resultados.push(["divisao(1, 0)", algebra.divisao(1, 0), NaN])
        resultados.push(["divisao(0, 5)", algebra.divisao(0, 5), 0])

        // algebra.log
        resultados.push(["log(100, 10)", algebra.log(100, 10), 2])
        resultados.push(["log(8, 2)", algebra.log(8, 2), 3])
        resultados.push(["log(1, 10)", algebra.log(1, 10), 0])
        resultados.push(["log(-1, 10)", algebra.log(-1, 10), NaN])

        // algebra.ln
        resultados.push(["ln(1)", algebra.ln(1), 0])
        resultados.push(["ln(Math.E)", algebra.ln(Math.E), 1])
        resultados.push(["ln(0)", algebra.ln(0), NaN])

        // helpers.calcDelta
        let d1 = helpers.calcDelta(1, -3, 2)
        resultados.push(["calcDelta(1,-3,2)[0]", d1[0], 1]) // Δ = 1
        resultados.push(["calcDelta(1,-3,2)[1]", d1[1], 1]) // x₁ = 1
        resultados.push(["calcDelta(1,-3,2)[2]", d1[2], 2]) // x₂ = 2

        let d2 = helpers.calcDelta(1, -2, 1)
        resultados.push(["calcDelta(1,-2,1)[0]", d2[0], 0]) // Δ = 0

        let d3 = helpers.calcDelta(1, 0, 1)
        resultados.push(["calcDelta(1,0,1)[0]", d3[0], -4]) // Δ < 0

        // helpers.vertice
        let v = helpers.vertice(1, -2, 0)
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
        ui.exibir(relatorio)
    },
}
