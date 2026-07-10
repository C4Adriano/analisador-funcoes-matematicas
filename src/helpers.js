import { Algebra } from "./algebra.js";
import { Config } from "./config.js";
import { Error } from "./error.js";
import { tr } from "./i18n.js";
import { State } from "./state.js";
import { Ui } from "./ui.js";
import { Writing } from "./writing.js";
export const Helpers = {
    domain(belongs = "∈ ℝ", explanation = tr("A função pode assumir qualquer x real", "The function can take any real x")) {
        Ui.display(tr("Domínio: ", "Domain: ") + "x " + belongs, explanation);
    },
    range(belongs = "∈ ℝ", interval = ".", explanation = tr("A função pode assumir qualquer y real", "The function can assume any real y")) {
        Ui.display(tr("Imagem: ", "Range: ") + "y " + belongs, explanation + interval);
    },
    xAxis(root = 0, explanation = "c", noHave = tr("Não existe raiz real, portanto não há interseção com o eixo x.", "There is no real root, therefore there is no intersection with the x‐axis.")) {
        let intersection = tr("Interseção com o eixo x: ", "Intersection with the x‐axis: ");
        if (root == 0) {
            if (explanation == "0") {
                Ui.display(intersection + "∃∞ x ∈ ℝ", "y = 0 ⇒ ∀ x ∈ ℝ");
            }
            else {
                Ui.display(intersection + "∄! x ∈ ℝ", "y = c ∧ c ≠ 0 ⇒ ∄ x");
            }
        }
        else {
            if (isNaN(root)) {
                Ui.display(intersection + "∄", noHave);
            }
            else {
                Ui.display(intersection + "(" + Writing.decimal(root) + ", 0)", tr("Ponto da raiz: ", "Root point: ") + "(" + explanation + ", 0)");
            }
        }
    },
    yAxis(point = 0, func = "c", explanation = "c") {
        Ui.display(tr("Interseção com o eixo y: ", "Intersection with the y‐axis: ") +
            (point != "∄" ? "(0, " + Writing.decimal(point) + ")" : "∄"), tr("Como y = ", "Since y = ") + func + (point != "∄" ? " ⇒ (0, " + explanation + ")" : explanation));
    },
    xValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let x = Ui.input("x = ", "", true), message = tr("Para x = ", "Since x = ") + Writing.decimal(x) + ", ";
        if (!funcExp && !funcLog && funcTrig == "") {
            Ui.display(message + "y = " + Writing.decimal(coefA * x ** 2 + coefB * x + coefC), "y = " + (coefA != 0 ? "a · x² + " : "") + (coefB != 0 ? "b · x + " : "") + "c");
        }
        else if (funcExp) {
            Ui.display(message + "y = " + Writing.decimal(coefB * coefA ** x + coefC), "y = b × aˣ + c");
        }
        else if (funcLog) {
            if (x > 0) {
                Ui.display(message + "y = " + Writing.decimal(coefB * Algebra.log(x, coefA) + coefC), "y = b × logₐ(x) + c");
            }
            else {
                Ui.display(message + "∄! y ∈ ℝ", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ");
            }
        }
        else if (funcTrig != "") {
            Ui.display(message +
                "y = " +
                Writing.decimal(coefB *
                    (funcTrig == "sin"
                        ? Math.sin(x)
                        : funcTrig == "cos"
                            ? Math.cos(x)
                            : funcTrig == "tan"
                                ? Math.tan(x)
                                : 0) +
                    coefC), "y = b × " + funcTrig + "(x) + c");
        }
    },
    yValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let y = Ui.input("y = ", "", true), message = tr("Para y = ", "Since y = ") + Writing.decimal(y) + ", ";
        if (!funcExp && !funcLog && funcTrig == "") {
            if (coefA == 0 && coefB == 0) {
                if (y == coefC) {
                    Ui.display(message + "∃∞ x ∈ ℝ", "y = c ⇒ ∀ x ∈ ℝ");
                }
                else {
                    Ui.display(message + "∄! x ∈ ℝ", "y ≠ c ⇒ ∄ x");
                }
            }
            else if (coefA == 0 && coefB != 0) {
                Ui.display(message + "x = " + Writing.decimal(Algebra.division(y - coefC, coefB)), "x = (y − c) / b");
            }
            else if (coefA != 0) {
                let delta = Helpers.calcDelta(coefA, coefB, coefC - y);
                Helpers.showDelta(delta[0], message + "∄! x ∈ ℝ", message + "x = " + Writing.decimal(delta[1]), message + "x₁ = " + Writing.decimal(delta[1]) + ", x₂ = " + Writing.decimal(delta[2]), true);
            }
        }
        else if (funcExp || funcLog) {
            let exponent = Algebra.division(y - coefC, coefB, false);
            if (funcExp) {
                if (exponent > 0) {
                    Ui.display(message + "x = " + Writing.decimal(Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA))), "x = ln((y − c) / b) / ln(a)");
                }
                else {
                    Ui.display(message + "∄! x ∈ ℝ", "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ");
                }
            }
            else if (funcLog) {
                Ui.display(message + "x = " + Writing.decimal(coefA ** exponent), "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾");
            }
        }
        else if (funcTrig != "") {
            Ui.display(tr("Valor de x para y ainda não disponível para funções trigonométricas.", "X value for a given y is not yet available to the trigonometric functions."), tr("Em construção.", "Under construction."));
        }
    },
    sign(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let operations = { positive: ">", negative: "<" }, words = { positive: tr("positiva", "positive"), negative: tr("negativa", "negative") };
        if (!funcExp && !funcLog && funcTrig == "") {
            if (coefA == 0 && coefB == 0) {
                let operation = coefC > 0 ? "positive" : "negative";
                Ui.display("ƒ(x) " + (coefC != 0 ? operations[operation] : "=") + " 0, ∀ x ∈ ℝ", "c " +
                    (coefC != 0 ? operations[operation] : "=") +
                    " 0 ⇒ ƒ(x) " +
                    (coefC != 0 ? operations[operation] : "=") +
                    " 0 ⇒ ∀ x ∈ ℝ");
            }
            else if (coefA == 0 && coefB != 0) {
                let affineRoot = Helpers.calcRoot(0, coefB, coefC), operation = coefB > 0 ? "positive" : "negative", opposite = operation == "positive" ? "negative" : "positive";
                Ui.display("ƒ(x) " +
                    operations[operation] +
                    " 0 " +
                    tr("se", "if") +
                    " x " +
                    operations[opposite] +
                    " " +
                    affineRoot +
                    "\nƒ(x) = 0 " +
                    tr("em", "in") +
                    " x = " +
                    affineRoot +
                    "\nƒ(x) " +
                    operations[opposite] +
                    " 0 " +
                    tr("se", "if") +
                    " x " +
                    operations[operation] +
                    " " +
                    affineRoot, "b " + operations[operation] + " 0 ⇒ ƒ(x) " + tr("crescente", "increasing"));
            }
            else if (coefA != 0) {
                let quadRoot = Helpers.calcRoot(coefA, coefB, coefC), operation = coefA > 0 ? "positive" : "negative";
                if (quadRoot[1] > quadRoot[2]) {
                    let temp = quadRoot[2];
                    quadRoot[2] = quadRoot[1];
                    quadRoot[1] = temp;
                }
                if (quadRoot[0] < 0) {
                    Ui.display("ƒ(x) " + operations[operation] + " 0, ∀ x ∈ ℝ", "a " + operations[operation] + " 0 ∧ Δ < 0 ⇒ ƒ(x) " + operations[operation] + " 0, ∀ x ∈ ℝ");
                }
                else if (quadRoot[0] == 0) {
                    Ui.display("ƒ(x) " +
                        operations[operation] +
                        " 0, " +
                        tr("exceto em", "except in") +
                        " x = " +
                        Writing.decimal(quadRoot[1]), "a " +
                        operations[operation] +
                        " 0 ∧ Δ = 0 ⇒ ƒ(x) " +
                        operations[operation] +
                        " 0, x ≠ " +
                        Writing.decimal(quadRoot[1]));
                }
                else {
                    if (coefA < 0) {
                        Ui.display("ƒ(x) > 0 " +
                            tr("se", "if") +
                            " " +
                            Writing.decimal(quadRoot[1]) +
                            " < x < " +
                            Writing.decimal(quadRoot[2]) +
                            "\nƒ(x) = 0 " +
                            tr("em", "in") +
                            " x = " +
                            Writing.decimal(quadRoot[1]) +
                            " ∨ x = " +
                            Writing.decimal(quadRoot[2]) +
                            "\nƒ(x) < 0 " +
                            tr("se", "if") +
                            " x < " +
                            Writing.decimal(quadRoot[1]) +
                            " ∨ x > " +
                            Writing.decimal(quadRoot[2]), "a < 0 ∧ Δ > 0");
                    }
                    else {
                        Ui.display("ƒ(x) > 0 " +
                            tr("se", "if") +
                            " x < " +
                            Writing.decimal(quadRoot[1]) +
                            " ∨ x > " +
                            Writing.decimal(quadRoot[2]) +
                            "\nƒ(x) = 0 " +
                            tr("em", "in") +
                            " x = " +
                            Writing.decimal(quadRoot[1]) +
                            " ∨ x = " +
                            Writing.decimal(quadRoot[2]) +
                            "\nƒ(x) < 0 " +
                            tr("se", "if") +
                            " " +
                            Writing.decimal(quadRoot[1]) +
                            " < x < " +
                            Writing.decimal(quadRoot[2]), "a > 0 ∧ Δ > 0.");
                    }
                }
            }
        }
        else if (funcExp || funcLog) {
            if (funcExp) {
                if (Algebra.division(-coefC, coefB, false) > 0) {
                    let expRoot = Helpers.calcRoot(coefA, coefB, coefC, true);
                    if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                        Ui.display("ƒ(x) > 0 " +
                            tr("se", "if") +
                            " x > " +
                            Writing.decimal(expRoot) +
                            "\nƒ(x) = 0 " +
                            tr("em", "in") +
                            " x = " +
                            Writing.decimal(expRoot) +
                            "\nƒ(x) < 0 " +
                            tr("se", "if") +
                            " x < " +
                            Writing.decimal(expRoot), "a > 0 ∧ (−c) / b > 0.");
                    }
                    else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                        Ui.display("ƒ(x) > 0 " +
                            tr("se", "if") +
                            " x < " +
                            Writing.decimal(expRoot) +
                            "\nƒ(x) = 0 " +
                            tr("em", "in") +
                            " x = " +
                            Writing.decimal(expRoot) +
                            "\nƒ(x) < 0 " +
                            tr("se", "if") +
                            " x > " +
                            Writing.decimal(expRoot), "a < 0 ∧ (−c) / b > 0.");
                    }
                }
                else if (coefB > 0) {
                    Ui.display("ƒ(x) > 0, ∀ x ∈ ℝ", tr("Conforme", "According to") + "b > 0 ∧ (−c) / b ≤ 0.");
                }
                else {
                    Ui.display("ƒ(x) < 0, ∀ x ∈ ℝ", tr("Conforme", "According to") + "b < 0 ∧ (−c) / b ≤ 0.");
                }
            }
            else if (funcLog) {
                let logRoot = Helpers.calcRoot(coefA, coefB, coefC, false, true);
                if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                    Ui.display("ƒ(x) > 0 " +
                        tr("se", "if") +
                        " x > " +
                        Writing.decimal(logRoot) +
                        "\nƒ(x) = 0 " +
                        tr("em", "in") +
                        " x = " +
                        Writing.decimal(logRoot) +
                        "\nƒ(x) < 0 " +
                        tr("se", "if") +
                        " x < " +
                        Writing.decimal(logRoot), "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)");
                }
                else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                    Ui.display("ƒ(x) > 0 " +
                        tr("se", "if") +
                        " x < " +
                        Writing.decimal(logRoot) +
                        "\nƒ(x) = 0 " +
                        tr("em", "in") +
                        " x = " +
                        Writing.decimal(logRoot) +
                        "\nƒ(x) < 0 " +
                        tr("se", "if") +
                        " x > " +
                        Writing.decimal(logRoot), "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)");
                }
            }
        }
        else if (funcTrig != "") {
            Ui.display(tr("Estudo do sinal para funções trigonométricas ainda não disponível.", "Sign analysis not yet available for trigonometric functions."), tr("Em construção.", "Under construction."));
        }
    },
    equations(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) {
            if (State.baseFunc.length == 0) {
                State.baseFunc = [coefA, coefB, coefC];
                State.askCoeffs = true;
                State.loop = true;
                Ui.warning("ƒ₁(x) " + tr("salva", "saved"), tr("Digite ƒ₂(x) para comparar.", "Type ƒ₂(x) to compare"));
                return 0;
            }
            else {
                Algebra.equations(State.baseFunc, [coefA, coefB, coefC]);
                State.baseFunc = [];
                return 1;
            }
        }
        else {
            Ui.warning(tr("Ainda não posso resolver equações com funções não polinomiais.", "I cannot yet resolve equations with non-polynomial functions."), tr("Em construção.", "Under construction."));
            return 0;
        }
    },
    curve(coefA = 0, coefB = 0, polynomial = true) {
        if (!polynomial) {
            if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                Ui.display(tr("Crescente", "Increasing"), "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)");
            }
            else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                Ui.display(tr("Decrescente", "Decreasing"), "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)");
            }
        }
        else {
            if (coefB != 0) {
                if (coefB > 0) {
                    Ui.display(tr("Crescente", "Increasing"), tr("Aponta para cima, pois ", "Points upward, since ") + "b > 0");
                }
                else if (coefB < 0) {
                    Ui.display(tr("Decrescente", "Decreasing"), tr("Aponta para baixo, pois ", "Points downward, since ") + "b < 0");
                }
            }
            else if (coefA != 0) {
                if (coefA > 0) {
                    Ui.display(tr("Concavidade para cima", "Upward concavity"), "a > 0");
                }
                else if (coefA < 0) {
                    Ui.display(tr("Concavidade para baixo", "Downward concavity"), "a < 0");
                }
            }
        }
    },
    calcRoot(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        if (!funcExp && !funcLog) {
            if (coefA == 0 && coefB == 0) {
                return NaN;
            }
            else if (coefA == 0 && coefB != 0) {
                return Algebra.division(-coefC, coefB);
            }
            else if (coefA != 0) {
                return Helpers.calcDelta(coefA, coefB, coefC);
            }
        }
        else {
            let exponent = Algebra.division(-coefC, coefB, false);
            if (funcExp) {
                if (exponent > 0) {
                    return Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA));
                }
                else {
                    return NaN;
                }
            }
            else if (funcLog) {
                return Number(Algebra.round(coefA ** exponent));
            }
        }
        return NaN;
    },
    showRoot(root = 0, explanation = "c", noHave = "") {
        let intersection = tr("Raiz real: ", "Real root: ");
        if (isNaN(root)) {
            Ui.display(intersection + "∄! x ∈ ℝ", noHave);
        }
        else {
            Ui.display(intersection + "x = " + Writing.decimal(root), tr("A raiz é x = ", "The root is x = ") + explanation);
        }
    },
    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        const delta = coefB ** 2 - 4 * coefA * coefC;
        let x1 = delta >= 0 ? Algebra.division(-coefB + Math.sqrt(delta), 2 * coefA) : NaN;
        let x2 = delta > 0 ? Algebra.division(-coefB - Math.sqrt(delta), 2 * coefA) : NaN;
        if (delta > 0 && x1 > x2)
            [x1, x2] = [x2, x1];
        return [delta, x1, x2];
    },
    showDelta(delta = 0, lower = "", equal = "", higher = "", hasY = false) {
        if (delta < 0) {
            Ui.display(lower, "Δ = b² − 4 · a · " + (hasY ? "(c − y)" : "c") + " ⇒ Δ < 0 ⇒ x ∉ ℝ");
        }
        else if (delta == 0) {
            Ui.display(equal, "Δ = b² − 4 · a · " + (hasY ? "(c − y)" : "c") + " ⇒ Δ = 0 ⇒ x = (−b) / (2 · a)");
        }
        else {
            Ui.display(higher, "Δ = b² − 4 · a · " + (hasY ? "(c − y)" : "c") + " ⇒ Δ > 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)");
        }
    },
    vertex(coefA = 0, coefB = 0, delta = 0) {
        return [Algebra.division(-coefB, 2 * coefA), Algebra.division(-delta, 4 * coefA)];
    },
    exceededLimit(limit = Config.interactionLimit) {
        let exceeded = limit >= Config.interactionLimit;
        if (exceeded) {
            Error.limitExceeded();
        }
        return exceeded;
    },
    calcPeriod(coefA = 0, funcTan = false) {
        return Writing.decimal((funcTan ? Math.PI : 2 * Math.PI) / Algebra.absolute(coefA));
    },
    showPeriod(coefA = 0, funcTan = false) {
        if (coefA != 0) {
            Ui.display(tr("Período: ", "Period: ") + Helpers.calcPeriod(coefA, funcTan), tr("Período = ", "Period = ") + (funcTan ? "π" : "2π") + " / |a|");
        }
        else {
            Ui.display(tr("Período: ∞", "Period: ∞"), tr("Se a = 0, a função é constante, então o período é infinito.", "Since a = 0, the function is constant, so the period is infinity."));
        }
    },
    amplitude(coefB = 0) {
        Ui.display("Amplitude: " + Writing.decimal(Algebra.absolute(coefB)), "Amplitude = |b|");
    },
    verticalAsymptotes(coefA = 0) {
        if (coefA != 0) {
            Ui.display(tr("Assíntotas verticais: ", "Vertical asymptote: ") + "x = (π / 2 + n · π) / a,  n ∈ ℤ", "tan(a · x) " +
                tr("é indefinida quando ", "is undefined when ") +
                "cos(a · x) = 0, " +
                tr("ou seja, ", "i.e., ") +
                "a · x = π / 2 + n · π");
        }
        else {
            Ui.display(tr("Assíntotas verticais: ", "Vertical asymptote: ") + "∄", tr("Se a = 0, a função é constante, então não há assíntotas.", "If a = 0, the function is constant, so there are no asymptotes."));
        }
    },
};
