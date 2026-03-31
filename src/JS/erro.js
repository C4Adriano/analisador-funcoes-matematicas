import { Ui } from "./ui.js"

/**
 * Mensagens de erro padronizadas do programa
 * - Use as funções aqui para exibir erros ao usuário. Nunca chame ui.erro() diretamente
 */
export const Erro = {
    /**
     * Exibe um erro de valor fora do intervalo permitido
     * @param {number} min Valor mínimo permitido
     * @param {number} max Valor máximo permitido
     * @since v6.1.0
     */
    intervalo(min = 0, max = 1) {
        Ui.erro(
            "ERRO-001: Escolha um valor entre " +
                String(min + (min == 0 ? 1 : 0)) +
                " e " +
                String(max) +
                (min == 0 ? " ou selecione 0 para voltar / sair" : ""),
            "Tu escolheste algo fora do intervalo.",
        )
    },

    /**
     * Exibe um erro de divisão por zero
     * @param {string} motivo Motivo da divisão por zero, para exibir uma mensagem mais específica (opcional)
     * @since v6.1.0
     */
    divZero(motivo = "") {
        Ui.erro(
            "ERRO-002: Divisão por zero",
            motivo != "" ? "Motivo: " + motivo : "Tu tentaste dividir um número por zero, o que não é possível.",
        )
    },

    /**
     * Exibe um erro de limite de interações estourado
     * @since v6.1.0
     */
    limiteEstourado() {
        Ui.erro("ERRO-003: Ultrapassou o limite", "A quantidade de interações passou do limite.")
    },

    /**
     * Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param {string} tipo Tipo
     * @since v6.1.0
     */
    funcaoConstante(tipo = "") {
        Ui.erro("ERRO-004: A função não é " + tipo + "; ela é constante", "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    /**
     * Exibe um erro de função inválida pelos coeficientes dados
     * @param {string} tipo Tipo
     * @since v6.1.0
     */
    funcaoInvalida(tipo = "") {
        Ui.erro("ERRO-005: A função não é " + tipo, "a < 0")
    },

    /**
     * Exibe um erro de logaritmo inválido
     * @param {string} tipo Tipo de logaritmo (log, ln, etc.), para exibir uma mensagem mais específica (opcional)
     * @param {string} motivo Motivo do erro, para exibir uma mensagem mais específica (opcional)
     * @since v6.1.0
     */
    logInvalido(tipo = "log", motivo = "") {
        Ui.erro(
            "ERRO-006: " + tipo + " inválido",
            motivo != ""
                ? "Motivo: " + motivo
                : "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível.",
        )
    },
}
