import { Algebra } from "./algebra.js";
import { Commands } from "./commands.js";
import { Config } from "./config.js";
import { Error } from "./error.js";
import { Helpers } from "./helpers.js";
import { tr } from "./i18n.js";
import { State } from "./state.js";
import { Writing } from "./writing.js";
export const Ui = {
    display(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.log(message);
            if (explanation != "") {
                console.log(explanation);
            }
        }
        else {
            alert(Writing.format(message, explanation));
        }
    },
    confirm(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.log(message);
            if (explanation != "") {
                console.log(explanation);
            }
            return true;
        }
        else {
            return confirm(Writing.format(message, explanation + "\n\n" + tr("“Ok” = Sim | “Cancelar” = Não", "“Ok” = Yes | “Cancel” = No")));
        }
    },
    error(message = "", explanation = "", debug = Config.debug) {
        if (Config.errors) {
            Ui.display("=== " + tr("Erro", "Error") + " ===\n" + message, explanation, debug);
        }
    },
    warning(message = "", explanation = "", type = false, debug = Config.debug) {
        if (!type) {
            Ui.display("=== " + tr("Aviso", "Warning") + " ===\n" + message, explanation, debug);
        }
        else {
            return Ui.confirm("=== " + tr("Aviso", "Warning") + " ===\n" + message, explanation, debug);
        }
    },
    menu(options = ["---"], page = 1) {
        let answer, menu = "", option = 1, total = 0, list = options.slice();
        while (list.length % 5 != 0 || list.length == 0) {
            list.push("---");
        }
        total = Math.ceil(list.length / 5);
        let limit = 0;
        do {
            if (page < 1) {
                page = 1;
            }
            else if (page > total) {
                page = total;
            }
            menu =
                "=== Menu ===\n" +
                    tr("Página ", "Page ") +
                    String(page) +
                    "/" +
                    String(total) +
                    "\n" +
                    tr("O que queres?", "What do you want?");
            while (option <= 5) {
                menu += "\n" + String(option) + " = " + String(list[option - 1 + 5 * (page - 1)]);
                option++;
            }
            option = 1;
            menu +=
                "\n----------------\n" +
                    "6 = " +
                    tr("Rever", "Review") +
                    " | 7 = " +
                    tr("Alterar", "Change") +
                    " | 8 = " +
                    tr("Anterior", "Previous") +
                    " | 9 = " +
                    tr("Próxima", "Next") +
                    " | 0 = " +
                    tr("Voltar", "Back");
            answer = Ui.range(menu, "", 0, 9, 0, true);
            if (answer == 0) {
                State.askCoeffs = false;
                State.loop = true;
            }
            else if (answer == 7) {
                State.askCoeffs = true;
                State.loop = true;
                answer = 0;
            }
            else if (answer == 8) {
                answer = -1;
                page -= 1;
            }
            else if (answer == 9) {
                answer = -1;
                page += 1;
            }
            else if (Commands.names().includes(String(answer))) {
                State.loop = true;
                State.keepType = true;
            }
            if (Helpers.exceededLimit(++limit)) {
                answer = 0;
                State.loop = true;
            }
        } while (typeof answer != "number" && typeof answer != "string");
        return [answer, page];
    },
    input(message = "", explanation = "", number = false, places = Config.decimalPlaces, allowCommands = false, angle = Config.degrees) {
        let raw = "", text = "", value = 0, valid = false;
        let limit = 0;
        do {
            raw = prompt(Writing.format(message, explanation));
            if (raw == null) {
                valid = false;
                continue;
            }
            else {
                text = String(raw).trim();
                valid = text != "";
            }
            if (valid && raw[0] == "/" && allowCommands) {
                let action = Commands.process(raw);
                if (action != null) {
                    return action;
                }
                valid = false;
            }
            if (valid && number) {
                if (angle == "rad") {
                    value = Writing.parseAngle(String(text));
                }
                else if (angle == "deg") {
                    value = Number(Writing.decimal(text, true));
                }
                valid = isFinite(value);
            }
            if (valid && Config.inputConfirm) {
                valid = Ui.warning(tr("Tu digitaste: “", "You typed: “") +
                    (number ? (angle ? Writing.formatAngle(value) : Writing.decimal(value)) : text) +
                    tr("”\nTens certeza?", "”\nAre you sure?"), tr("Obs.₁: Se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado\nObs.₂: Essas mensagens podem ser desativadas nas configurações, em “Confirmações de entrada”", "Note₁: If this is a variable and what was typed is not a number, it will be transformed into the variable name, not what was typed.\nNote₂: These messages can be disabled in the settings, under “Input Confirmations”."), true);
            }
            if (valid) {
                if (number) {
                    return Algebra.round(value, places);
                }
                return text;
            }
            if (Helpers.exceededLimit(++limit)) {
                valid = true;
            }
        } while (!valid);
        return number ? 0 : "";
    },
    function(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "", show = Config.showFunction) {
        if (!show) {
            return "";
        }
        let funcStr = tr("A função: ƒ(x) = ", "The function: ƒ(x) = ");
        if (!funcExp && !funcLog && funcTrig == "") {
            if (coefA == 0 && coefB == 0) {
                if (typeof coefC == "string") {
                    funcStr += "c";
                }
                else if (typeof coefC == "number") {
                    funcStr += String(coefC);
                }
                funcStr += tr(" é constante", " is constant");
                if (coefC == 0) {
                    funcStr += tr(" / nula", " / null");
                }
            }
            else if (coefA == 0 && coefB != 0) {
                if (typeof coefB == "string") {
                    funcStr += "b · x";
                }
                else if (typeof coefB == "number") {
                    if (Algebra.absolute(coefB) == 1) {
                        if (coefB == -1) {
                            funcStr += "−";
                        }
                        funcStr += "x";
                    }
                    else if (Algebra.absolute(coefB) != 1) {
                        funcStr += String(coefB) + " · x";
                    }
                }
                if (typeof coefC == "string") {
                    funcStr += " + c";
                }
                else if (typeof coefC == "number") {
                    if (coefC > 0) {
                        funcStr += " + " + String(coefC);
                    }
                    else if (coefC < 0) {
                        funcStr += " − " + String(-coefC);
                    }
                }
                funcStr += tr(" é afim", " is affine");
                if (coefB != 1 && coefC == 0) {
                    funcStr += " / linear";
                }
                else if (coefB == 1 && coefC == 0) {
                    funcStr += tr(" / identidade", " / identity");
                }
                else if (coefB == -1) {
                    funcStr += tr(" / oposta", " / opposite");
                }
            }
            else if (coefA != 0) {
                if (typeof coefA == "string") {
                    funcStr += "a · x²";
                }
                else if (typeof coefA == "number") {
                    if (Algebra.absolute(coefA) == 1) {
                        if (coefA == -1) {
                            funcStr += "−";
                        }
                        funcStr += "x²";
                    }
                    else if (Algebra.absolute(coefA) != 1) {
                        funcStr += String(coefA) + " · x²";
                    }
                }
                if (typeof coefB == "string") {
                    funcStr += " + b · x";
                }
                else if (typeof coefB == "number" && coefB != 0) {
                    if (coefB > 0) {
                        funcStr += " + ";
                    }
                    else if (coefB < 0) {
                        funcStr += " − ";
                    }
                    if (Algebra.absolute(coefB) == 1) {
                        funcStr += "x";
                    }
                    else if (Algebra.absolute(coefB) != 1) {
                        funcStr += String(Algebra.absolute(coefB)) + " · x";
                    }
                }
                if (typeof coefC == "string") {
                    funcStr += " + c";
                }
                else if (typeof coefC == "number" && coefC != 0) {
                    if (coefC > 0) {
                        funcStr += " + " + String(coefC);
                    }
                    else if (coefC < 0) {
                        funcStr += " − " + String(-coefC);
                    }
                }
                funcStr += tr(" é quadrática", " is quadratic");
                if (coefB == 0 && coefC == 0) {
                    funcStr += tr(" / pura", " / pure");
                }
                else if (coefB == 0) {
                    funcStr += tr(" / incompleta (sem termo linear)", " / incomplete (without linear term)");
                }
                else if (coefC == 0) {
                    funcStr += tr(" / incompleta (sem termo constante)", " / incomplete (without constant term)");
                }
            }
        }
        else if (funcExp && funcTrig == "") {
            if (typeof coefB == "number" && coefB != 0) {
                if (coefB != 1) {
                    funcStr += String(coefB) + " × ";
                }
            }
            else if (typeof coefB == "string") {
                funcStr += "b × ";
            }
            if (typeof coefA == "number" && coefA != 0) {
                funcStr += String(coefA) + "ˣ";
            }
            else if (typeof coefA == "string") {
                funcStr += "aˣ";
            }
            if (typeof coefC == "number" && coefC != 0) {
                if (coefC > 0) {
                    funcStr += " + " + String(coefC);
                }
                else if (coefC < 0) {
                    funcStr += " − " + String(-coefC);
                }
            }
            else if (typeof coefC == "string") {
                funcStr += " + c";
            }
            funcStr += tr(" é exponencial", " is exponential");
            if (coefB == 1 && coefC == 0) {
                funcStr += tr(" / pura", " / pure");
            }
            if (coefA == Algebra.round(Math.E)) {
                funcStr += " / natural";
            }
        }
        else if (funcLog && funcTrig == "") {
            if (typeof coefB == "number" && coefB != 0) {
                if (coefB != 1) {
                    funcStr += String(coefB) + " × ";
                }
            }
            else if (typeof coefB == "string") {
                funcStr += "b × ";
            }
            if (typeof coefA == "number" && coefA != 0) {
                funcStr += "log" + Writing.subscript(coefA) + "(x)";
            }
            else if (typeof coefA == "string") {
                funcStr += "logₐ(x)";
            }
            if (typeof coefC == "number" && coefC != 0) {
                if (coefC > 0) {
                    funcStr += " + " + String(coefC);
                }
                else if (coefC < 0) {
                    funcStr += " − " + String(-coefC);
                }
            }
            else if (typeof coefC == "string") {
                funcStr += " + c";
            }
            funcStr += tr(" é logarítmica", " is logarithmic");
            if (coefB == 1 && coefC == 0) {
                funcStr += tr(" / pura", " / pure");
            }
            if (coefA == Algebra.round(Math.E)) {
                funcStr += " / natural";
            }
            else if (coefA == 10) {
                funcStr += " / decimal";
            }
        }
        else if (funcTrig != "") {
            if (typeof coefB == "number" && coefB != 0) {
                if (coefB != 1) {
                    funcStr += String(coefB) + " × ";
                }
            }
            else if (typeof coefB == "string") {
                funcStr += "b × ";
            }
            if (typeof coefA == "number" && coefA != 0) {
                funcStr += funcTrig + "(" + String(coefA) + " · x)";
            }
            else if (typeof coefA == "string") {
                funcStr += funcTrig + "(a · x)";
            }
            if (typeof coefC == "number" && coefC != 0) {
                if (coefC > 0) {
                    funcStr += " + " + String(coefC);
                }
                else if (coefC < 0) {
                    funcStr += " − " + String(-coefC);
                }
            }
            else if (typeof coefC == "string") {
                funcStr += " + c";
            }
        }
        Ui.display("=== " + tr("Função Atual", "Current Function") + " ===\n" + Writing.decimal(funcStr));
    },
    range(message = "", explanation = "", min = 0, max = 1, places = 0, allowCommands = false) {
        let value = 0, i = true;
        do {
            i = true;
            value = Ui.input(message, explanation, true, places, allowCommands);
            if (typeof value == "string" && Commands.names().includes(value)) {
                return value;
            }
            else if (typeof value == "string" && value == "end") {
                return 0;
            }
            if (typeof value == "number" && !(min <= value && value <= max)) {
                Error.range(min, max);
                i = false;
            }
        } while (i);
        return value;
    },
};
