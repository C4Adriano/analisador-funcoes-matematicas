import { erro } from "./erro.js"
import { ui } from "./ui.js"

/**
 * Objeto base para as funções de erro
 * - Use as funções aqui para exibir mensagens de erro, como quando o usuário digita algo inválido ou quando acontece um erro inesperado. As mensagens são formatadas automaticamente conforme as configurações, então use a função "escrita.verificar" para formatar as mensagens antes de exibi-las.
 */
export const erro = {
    /**
     * Exibe um erro de intervalo
     * @param {number} min Mínimo
     * @param {number} max Máximo
     */
    intervalo(min = 0, max = 1) {
        ui.erro("ERRO-001: Escolha um valor entre " + String(min + (min == 0 ? 1 : 0)) + " e " + String(max) + (min == 0 ? " ou selecione 0 para voltar / sair" : ""), "Tu escolheste algo fora do intervalo.")
    },

    /**
     * Exibe um erro de divisão por zero
     * @param {string} moitvo Motivo
     */
    divZero(moitvo = "") {
        ui.erro("ERRO-002: Divisão por zero", (moitvo != "" ? "Motivo: " + moitvo : "Tu tentaste dividir um número por zero, o que não é possível."))
    },

    /**
     * Exibe um erro de limite estourado
     */
    limiteEstourado() {
        ui.erro("ERRO-003: Ultrapassou o limite", "A quantidade de interações passou do limite.")
    },

    /**
     * Exibe um erro de função que vira constante
     * @param {string} tipo Tipo
     */
    funcaoConstante(tipo = "") {
        ui.erro("ERRO-004: A função não é " + tipo + "; ela é constante", "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    /**
     * Exibe um erro de função inválida
     * @param {string} tipo Tipo
     */
    funcaoInvalida(tipo = "") {
        ui.erro("ERRO-005: A função não é " + tipo, "a < 0")
    },

    /**
     * Exibe um erro de logaritmo inválido
     * @param {string} tipo Tipo
     * @param {string} motivo Motivo
     */
    logInvalido(tipo = "log", motivo = "") {
        ui.erro("ERRO-006: " + tipo + " inválido", (motivo != "" ? "Motivo: " + motivo : "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível."))
    }
}