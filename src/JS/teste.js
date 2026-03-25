import { algebra } from "./algebra.js"
import { helpers } from "./helpers.js"
import { escrita } from "./escrita.js"
import { ui } from "./ui.js"

export const teste = {
    rodar() {
        let opcao = ui.entrada(
            "=== Testes ===\n1 = Constante\n2 = Afim\n3 = Quadrática\n4 = Exponencial\n5 = Logarítmica\n6 = Álgebra\n0 = Sair",
            "", true, 0, false
        )

        if (opcao == 1) { teste.constante() }
        else if (opcao == 2) { teste.afim() }
        else if (opcao == 3) { teste.quadratica() }
        // ...
    },

    constante() {
        ui.exibir("Testando constante...")
        // chama analisar.constante com valores fixos
    },

    afim() {
        ui.exibir("Testando afim...")
    }
    // ...
}