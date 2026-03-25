import { algebra } from "./algebra.js"
import { helpers } from "./helpers.js"
import { escrita } from "./escrita.js"
import { ui } from "./ui.js"
import { analisar } from "./analisar.js"

export const teste = {
    rodar() {
        let opcao = ui.entrada("=== Testes ===\n1 = Constante\n2 = Afim\n3 = Quadrática\n4 = Exponencial\n5 = Logarítmica\n6 = Contas\n0 = Sair", "", true, 0, false)

        if (opcao == 1) { teste.constante() }
        else if (opcao == 2) { teste.afim() }
        else if (opcao == 3) { teste.quadratica() }
        else if (opcao == 4) { teste.exponencial() }
        else if (opcao == 5) { teste.logaritimica() }
        else if (opcao == 6) { teste.contas() }
        // ...
    },

    constante() {
        ui.exibir("Testando constante...")
        analisar.constante()
        analisar.constante(0)
        analisar.constante(1)
        analisar.constante(-1)
    },

    afim() {
        ui.exibir("Testando afim...")
        analisar.afim()
        analisar.afim(0, 0)
        analisar.afim(1)
        analisar.afim(-1)
    },

    quadratica() {
        ui.exibir("Testando quadrática...")
        analisar.quadratica()
        analisar.quadratica(0, 0, 0)
        analisar.quadratica(1)
        analisar.quadratica(-1)
    },

    exponencial() {
        ui.exibir("Testando exponencial...")
        analisar.exponencial()
        analisar.exponencial(0, 0, 0)
        analisar.exponencial(1)
        analisar.exponencial(-1)
    },

    logaritimica() {
        ui.exibir("Testando logarítimica...")
        analisar.logaritmica()
        analisar.logaritmica(0, 0, 0)
        analisar.logaritmica(1)
        analisar.logaritmica(-1)
    },

    contas() {
        ui.exibir("Testando contas...")

    }
}