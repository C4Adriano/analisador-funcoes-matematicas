import { tr } from "./i18n.js";
import { Ui } from "./ui.js";
export const Error = {
    range(min = 0, max = 1) {
        if (!isFinite(min) || !isFinite(max)) {
            Ui.error("[Error.range] Parâmetros inválidos.", "Min: " + min + " | Max: " + max, true);
            min = 0;
            max = 1;
        }
        Ui.error(tr("ERRO-001: Valor fora do intervalo. Escolha entre ", "ERROR-001: Value out of range. Choose between ") +
            String(min + (min == 0 ? 1 : 0)) +
            tr(" e ", " and ") +
            String(max) +
            (min == 0 ? tr(" ou 0 para voltar / sair", " or 0 to go back / exit") : ""), tr("Valor fora do intervalo permitido.", "Value outside the allowed range."));
    },
    divZero(reason = "") {
        if (typeof reason !== "string") {
            Ui.error("[Error.divZero] 'reason' inválido.", "Recebido: " + reason, true);
            reason = "";
        }
        Ui.error(tr("ERRO-002: Divisão por zero", "ERROR-002: Division by zero"), reason != ""
            ? tr("Motivo: ", "Reason: ") + reason
            : tr("Não é possível dividir por zero.", "Division by zero is not defined."));
    },
    limitExceeded() {
        Ui.error(tr("ERRO-003: Limite de interações excedido", "ERROR-003: Interaction limit exceeded"), tr("O número de interações ultrapassou o limite configurado.", "The number of iterations exceeded the configured limit."));
    },
    constantFunction(type = "") {
        Ui.error(tr("ERRO-004: A função não é ", "ERROR-004: The function is not ") +
            type +
            tr("; é constante", "; it is constant"), "(a = 0) ∨ (a = 1) ∨ (b = 0)");
    },
    invalidFunction(type = "") {
        if (typeof type != "string") {
            Ui.error("[Error.invalidFunction] 'type' inválido.", "Recebido: " + type, true);
            type = "";
        }
        Ui.error(tr("ERRO-005: A função não é ", "ERROR-005: The function is not ") + type, "a < 0");
    },
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
