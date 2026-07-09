import { tr } from "./i18n.js";
import { Ui } from "./ui.js";
/**
 * [ERRO] Mensagens de erro padronizadas do programa
 * - Use as funções aqui para exibir erros ao usuário. Nunca chame Ui.error() diretamente
 * @since v6.1.0
 */
export const Error = {
    /**
     * [ERRO] Exibe um erro de valor fora do intervalo permitido
     * @param min - Valor mínimo permitido
     * @param max - Valor máximo permitido
     * @since v6.1.0
     */
    range(min = 0, max = 1) {
        if (!isFinite(min) || !isFinite(max)) {
            Ui.error("[Error.range] Parâmetros inválidos.", "Min: " + min + " | Max: " + max, true);
            min = 0;
            max = 1;
        }
        Ui.error(tr("ERRO-001: Valor fora do intervalo. Escolha entre ", "ERROR-001: Value out of range. Choose between ") +
            /* Se min = 0, o range exibido começa em 1 (0 é reservado para "voltar/sair") */
            String(min + (min == 0 ? 1 : 0)) +
            tr(" e ", " and ") +
            String(max) +
            (min == 0 ? tr(" ou 0 para voltar / sair", " or 0 to go back / exit") : ""), tr("Valor fora do intervalo permitido.", "Value outside the allowed range."));
    },
    /**
     * [ERRO] Exibe um erro de divisão por zero
     * @param reason - Motivo da divisão por zero
     * @since v6.1.0
     */
    divZero(reason = "") {
        if (typeof reason !== "string") {
            Ui.error("[Error.divZero] 'reason' inválido.", "Recebido: " + reason, true);
            reason = "";
        }
        Ui.error(tr("ERRO-002: Divisão por zero", "ERROR-002: Division by zero"), reason != ""
            ? tr("Motivo: ", "Reason: ") + reason
            : tr("Não é possível dividir por zero.", "Division by zero is not defined."));
    },
    /**
     * [ERRO] Exibe um erro de limite de interações estourado
     * @since v6.1.0
     */
    limitExceeded() {
        Ui.error(tr("ERRO-003: Limite de interações excedido", "ERROR-003: Interaction limit exceeded"), tr("O número de interações ultrapassou o limite configurado.", "The number of iterations exceeded the configured limit."));
    },
    /**
     * [ERRO] Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param type - Tipo de função
     * @since v6.1.0
     */
    constantFunction(type = "") {
        Ui.error(tr("ERRO-004: A função não é ", "ERROR-004: The function is not ") +
            type +
            tr("; é constante", "; it is constant"), "(a = 0) ∨ (a = 1) ∨ (b = 0)");
    },
    /**
     * [ERRO] Exibe um erro de função inválida pelos coeficientes dados
     * @param type - Tipo de função
     * @since v6.1.0
     */
    invalidFunction(type = "") {
        if (typeof type != "string") {
            Ui.error("[Error.invalidFunction] 'type' inválido.", "Recebido: " + type, true);
            type = "";
        }
        Ui.error(tr("ERRO-005: A função não é ", "ERROR-005: The function is not ") + type, "a < 0");
    },
    /**
     * [ERRO] Exibe um erro de logaritmo inválido
     * @param type - Tipo de logaritmo (log, ln, etc.)
     * @param reason - Motivo do erro
     * @since v6.1.0
     */
    invalidLog(type = "log", reason = "") {
        if (typeof type != "string") {
            Ui.error("[Error.invalidLog] 'type' inválido.", "Recebido: " + type, true);
            type = "log";
        }
        if (typeof reason != "string") {
            Ui.error("[Error.invalidLog] 'reason' inválido.", "Recebido: " + reason, true);
            reason = "";
        }
        Ui.error(tr("ERRO-006: ", "ERROR-006: ") + type + tr(" inválido", " invalid"), reason != ""
            ? tr("Motivo: ", "Reason: ") + reason
            : tr("Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível.", "You tried to calculate a logarithm with a base less than or equal to 1, which is not possible."));
    },
};
