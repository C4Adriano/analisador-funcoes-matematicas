import { Algebra } from "./algebra.js";
import { Config } from "./config.js";
import { Error } from "./error.js";
import { tr } from "./i18n.js";
import { State } from "./state.js";
import { Ui } from "./ui.js";
import { Writing } from "./writing.js";
/**
 * [FUNÇÃO] Objeto base para as ajudas de código (repetições) e cálculos comuns
 * - Use as funções aqui para obter ajudas comuns, como o domínio, imagem, interseção com os eixos, estudo do sinal, etc.
 * @since v6.1.0
 */
export const Helpers = {
    /**
     * [FUNÇÃO] Monta o domínio de uma função
     * @param belongs - Intervalo de pertencimento
     * @param explanation - Explicação
     * @since v6.1.0
     */
    domain(belongs = "∈ ℝ", explanation = tr("A função pode assumir qualquer x real", "The function can take any real x")) {
        Ui.display(tr("Domínio: ", "Domain: ") + "x " + belongs, explanation);
    },
    /**
     * [FUNÇÃO] Monta a imagem de uma função
     * @param belongs - Intervalo de pertencimento
     * @param interval - Se a função deve assumir algum intervalo diferente
     * @param explanation - Explicação
     * @since v6.1.0
     */
    range(belongs = "∈ ℝ", interval = ".", explanation = tr("A função pode assumir qualquer y real", "The function can assume any real y")) {
        Ui.display(tr("Imagem: ", "Range: ") + "y " + belongs, explanation + interval);
    },
    /**
     * [FUNÇÃO] Monta a intercessão com o eixo x de uma função
     * @param root - Raiz
     * @param explanation - Explicação
     * @param noHave - Mensagem quando não há interseção com o eixo x
     * @since v6.1.0
     */
    xAxis(root = 0, explanation = "c", noHave = tr("Não existe raiz real, portanto não há interseção com o eixo x.", "There is no real root, therefore there is no intersection with the x‐axis.")) {
        let intersection = tr("Interseção com o eixo x: ", "Intersection with the x‐axis: ");
        if (root == 0) {
            // Constante
            if (explanation == "0") {
                // Se c = 0, a função é nula, então existe infinitas raízes
                Ui.display(intersection + "∃∞ x ∈ ℝ", "y = 0 ⇒ ∀ x ∈ ℝ");
            }
            else {
                // Se c ≠ 0, então não existe raiz
                Ui.display(intersection + "∄! x ∈ ℝ", "y = c ∧ c ≠ 0 ⇒ ∄ x");
            }
        }
        else {
            // Outras funções
            if (isNaN(root)) {
                // Não polinomial
                Ui.display(intersection + "∄", noHave);
            }
            else {
                // Afim
                Ui.display(intersection + "(" + Writing.decimal(root) + ", 0)", tr("Ponto da raiz: ", "Root point: ") + "(" + explanation + ", 0)");
            }
        }
    },
    /**
     * [FUNÇÃO] Monta a intercessão com o eixo y de uma função
     * @param point - Ponto
     * @param func - Função
     * @param explanation - Explicação
     * @since v6.1.0
     */
    yAxis(point = 0, func = "c", explanation = "c") {
        Ui.display(tr("Interseção com o eixo y: ", "Intersection with the y‐axis: ") +
            (point != "∄" ? "(0, " + Writing.decimal(point) + ")" : "∄"), tr("Como y = ", "Since y = ") + func + (point != "∄" ? " ⇒ (0, " + explanation + ")" : explanation));
    },
    /**
     * [FUNÇÃO] Monta o valor de y para o x dado
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Exponencial
     * @param funcLog - Logarítmica
     * @since v6.1.0
     */
    xValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let x = Ui.input("x = ", "", true), message = tr("Para x = ", "Since x = ") + Writing.decimal(x) + ", ";
        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            Ui.display(message + "y = " + Writing.decimal(coefA * x ** 2 + coefB * x + coefC), "y = " + (coefA != 0 ? "a · x² + " : "") + (coefB != 0 ? "b · x + " : "") + "c");
        }
        else if (funcExp) {
            // Exponencial
            Ui.display(message + "y = " + Writing.decimal(coefB * coefA ** x + coefC), "y = b × aˣ + c");
        }
        else if (funcLog) {
            // Logarítmica
            if (x > 0) {
                // O logaritmo só é definido para x > 0
                Ui.display(message + "y = " + Writing.decimal(coefB * Algebra.log(x, coefA) + coefC), "y = b × logₐ(x) + c");
            }
            else {
                // Se x ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse x
                Ui.display(message + "∄! y ∈ ℝ", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ");
            }
        }
        else if (funcTrig != "") {
            // Trigonométrica
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
    /**
     * [FUNÇÃO] Monta o valor de x para o y dado
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Exponencial
     * @param funcLog - Logarítmica
     * @since v6.1.0
     */
    yValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let y = Ui.input("y = ", "", true), message = tr("Para y = ", "Since y = ") + Writing.decimal(y) + ", ";
        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                if (y == coefC) {
                    // Se y = c, então existe infinitas soluções
                    Ui.display(message + "∃∞ x ∈ ℝ", "y = c ⇒ ∀ x ∈ ℝ");
                }
                else {
                    // Se y ≠ c, então não existe solução
                    Ui.display(message + "∄! x ∈ ℝ", "y ≠ c ⇒ ∄ x");
                }
            }
            else if (coefA == 0 && coefB != 0) {
                // Afim
                Ui.display(message + "x = " + Writing.decimal(Algebra.division(y - coefC, coefB)), "x = (y − c) / b");
            }
            else if (coefA != 0) {
                // Quadrática
                let delta = Helpers.calcDelta(coefA, coefB, coefC - y);
                Helpers.showDelta(delta[0], message + "∄! x ∈ ℝ", message + "x = " + Writing.decimal(delta[1]), message + "x₁ = " + Writing.decimal(delta[1]) + ", x₂ = " + Writing.decimal(delta[2]), true);
            }
        }
        else if (funcExp || funcLog) {
            // Não polinomial
            let exponent = Algebra.division(y - coefC, coefB, false); // (y − c) / b
            if (funcExp) {
                // Exponencial
                if (exponent > 0) {
                    // Se (y − c) / b > 0, então o logaritmo é definido, então a função tem valor real para esse y
                    Ui.display(message + "x = " + Writing.decimal(Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA))), "x = ln((y − c) / b) / ln(a)");
                }
                else {
                    // Se (y − c) / b ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse y
                    Ui.display(message + "∄! x ∈ ℝ", "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ");
                }
            }
            else if (funcLog) {
                // Logarítmica
                Ui.display(message + "x = " + Writing.decimal(coefA ** exponent), "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾");
            }
        }
        else if (funcTrig != "") {
            // Trigonométrica
            Ui.display(tr("Valor de x para y ainda não disponível para funções trigonométricas.", "X value for a given y is not yet available to the trigonometric functions."), tr("Em construção.", "Under construction."));
        }
    },
    /**
     * [FUNÇÃO] Monta o estudo do sinal de uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Exponencial
     * @param funcLog - Logarítmica
     * @param funcTrig - Trigonométrica (sin, cos ou tan)
     * @since v6.1.0
     */
    sign(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        let operations = { positive: ">", negative: "<" }, words = { positive: tr("positiva", "positive"), negative: tr("negativa", "negative") };
        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                let operation = coefC > 0 ? "positive" : "negative";
                Ui.display("ƒ(x) " + (coefC != 0 ? operations[operation] : "=") + " 0, ∀ x ∈ ℝ", "c " +
                    (coefC != 0 ? operations[operation] : "=") +
                    " 0 ⇒ ƒ(x) " +
                    (coefC != 0 ? operations[operation] : "=") +
                    " 0 ⇒ ∀ x ∈ ℝ");
            }
            else if (coefA == 0 && coefB != 0) {
                // Afim
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
                // Quadrática
                let quadRoot = Helpers.calcRoot(coefA, coefB, coefC), operation = coefA > 0 ? "positive" : "negative";
                if (quadRoot[1] > quadRoot[2]) {
                    // Inverte para ficar de menor a maior
                    let temp = quadRoot[2];
                    quadRoot[2] = quadRoot[1];
                    quadRoot[1] = temp;
                }
                if (quadRoot[0] < 0) {
                    // Sem raiz
                    Ui.display("ƒ(x) " + operations[operation] + " 0, ∀ x ∈ ℝ", "a " + operations[operation] + " 0 ∧ Δ < 0 ⇒ ƒ(x) " + operations[operation] + " 0, ∀ x ∈ ℝ");
                }
                else if (quadRoot[0] == 0) {
                    // Uma raiz
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
                    // Duas raízes
                    if (coefA < 0) {
                        // Concavidade para baixo
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
                        // Concavidade para cima
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
            // Não polinomial
            if (funcExp) {
                // Exponencial
                if (Algebra.division(-coefC, coefB, false) > 0) {
                    // Raiz
                    let expRoot = Helpers.calcRoot(coefA, coefB, coefC, true);
                    if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                        // Curva para cima
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
                        // Curva para baixo
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
                    // Sem raiz, mas curva para cima
                    Ui.display("ƒ(x) > 0, ∀ x ∈ ℝ", tr("Conforme", "According to") + "b > 0 ∧ (−c) / b ≤ 0.");
                }
                else {
                    // Sem raiz, mas curva para baixo
                    Ui.display("ƒ(x) < 0, ∀ x ∈ ℝ", tr("Conforme", "According to") + "b < 0 ∧ (−c) / b ≤ 0.");
                }
            }
            else if (funcLog) {
                // Logarítmica
                let logRoot = Helpers.calcRoot(coefA, coefB, coefC, false, true);
                if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                    // Curva para cima
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
                    // Curva para baixo
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
            // Trigonométrica
            Ui.display(tr("Estudo do sinal para funções trigonométricas ainda não disponível.", "Sign analysis not yet available for trigonometric functions."), tr("Em construção.", "Under construction."));
        }
    },
    /**
     * [FUNÇÃO] Monta a equação de duas funções
     * @param polinomial - Polinomial
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @returns Operação futura
     * @since v6.1.0
     */
    equations(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) {
            // Polinomial
            if (State.baseFunc.length == 0) {
                // Salvar a primeira função para comparar depois
                State.baseFunc = [coefA, coefB, coefC];
                State.askCoeffs = true;
                State.loop = true;
                Ui.warning("ƒ₁(x) " + tr("salva", "saved"), tr("Digite ƒ₂(x) para comparar.", "Type ƒ₂(x) to compare"));
                return 0;
            }
            else {
                // Comparar as duas funções
                Algebra.equations(State.baseFunc, [coefA, coefB, coefC]);
                State.baseFunc = [];
                return 1;
            }
        }
        else {
            // Não polinomial
            Ui.warning(tr("Ainda não posso resolver equações com funções não polinomiais.", "I cannot yet resolve equations with non-polynomial functions."), tr("Em construção.", "Under construction."));
            return 0;
        }
    },
    /**
     * [FUNÇÃO] Monta a curva de uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param polynomial - Polinomial
     * @since v6.1.0
     */
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
    /**
     * [FUNÇÃO] Calcula a raiz de uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Exponencial
     * @param funcLog - Logarítmica
     * @returns {Numeric | Numeric[]} - Raiz
     * @since v6.1.0
     */
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
    /**
     * [FUNÇÃO] Mostra a raiz de uma função
     * @param root - Raiz
     * @param explanation - Explicação
     * @param noHave - Mensagem quando não há raiz
     * @since v6.1.0
     */
    showRoot(root = 0, explanation = "c", noHave = "") {
        let intersection = tr("Raiz real: ", "Real root: ");
        if (isNaN(root)) {
            Ui.display(intersection + "∄! x ∈ ℝ", noHave);
        }
        else {
            Ui.display(intersection + "x = " + Writing.decimal(root), tr("A raiz é x = ", "The root is x = ") + explanation);
        }
    },
    /**
     * [FUNÇÃO] Calcula o Delta de uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @returns Delta
     * @since v6.1.0
     */
    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        const delta = coefB ** 2 - 4 * coefA * coefC;
        let x1 = delta >= 0 ? Algebra.division(-coefB + Math.sqrt(delta), 2 * coefA) : NaN;
        let x2 = delta > 0 ? Algebra.division(-coefB - Math.sqrt(delta), 2 * coefA) : NaN;
        if (delta > 0 && x1 > x2)
            [x1, x2] = [x2, x1];
        return [delta, x1, x2];
    },
    /**
     * [FUNÇÃO] Exibe o Delta de uma função
     * @param delta - Delta
     * @param lower - Mensagem para Delta < 0
     * @param equal - Mensagem para Delta = 0
     * @param higher - Mensagem para Delta > 0
     * @param hasY - Se é (c − y)
     * @since v6.1.0
     */
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
    /**
     * [FUNÇÃO] Calcula o vértice de uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param delta - Delta
     * @returns Vértice
     * @since v6.1.0
     */
    vertex(coefA = 0, coefB = 0, delta = 0) {
        return [Algebra.division(-coefB, 2 * coefA), Algebra.division(-delta, 4 * coefA)];
    },
    /**
     * [FUNÇÃO] Vê se estourou o limite
     * @param limit - Limite
     * @returns Se estourou o limite
     * @since v6.1.0
     */
    exceededLimit(limit = Config.interactionLimit) {
        let exceeded = limit >= Config.interactionLimit;
        // Exibe o erro se estourou o limite
        if (exceeded) {
            Error.limitExceeded();
        }
        return exceeded;
    },
    /**
     * [FUNÇÃO] Calcula o período de uma função
     * @param coefA - Coeficiente a (frequência angular)
     * @param funcTan - Se é função tangente (tan tem período π / |a|)
     * @returns Período
     * @since v6.1.0
     */
    calcPeriod(coefA = 0, funcTan = false) {
        return Writing.decimal((funcTan ? Math.PI : 2 * Math.PI) / Algebra.absolute(coefA));
    },
    /**
     * [FUNÇÃO] Exibe o período de uma função
     * @param coefA - Coeficiente a (frequência angular)
     * @param funcTan - Se é função tangente
     * @since v6.1.0
     */
    showPeriod(coefA = 0, funcTan = false) {
        if (coefA != 0) {
            Ui.display(tr("Período: ", "Period: ") + Helpers.calcPeriod(coefA, funcTan), tr("Período = ", "Period = ") + (funcTan ? "π" : "2π") + " / |a|");
        }
        else {
            Ui.display(tr("Período: ∞", "Period: ∞"), tr("Se a = 0, a função é constante, então o período é infinito.", "Since a = 0, the function is constant, so the period is infinity."));
        }
    },
    /**
     * [FUNÇÃO] Exibe a amplitude de uma função
     * @param coefB - Coeficiente b (amplitude)
     * @since v6.1.0
     */
    amplitude(coefB = 0) {
        Ui.display("Amplitude: " + Writing.decimal(Algebra.absolute(coefB)), "Amplitude = |b|");
    },
    /**
     * [FUNÇÃO] Exibe as assíntotas verticais da tangente
     * @param coefA - Coeficiente a (frequência angular)
     * @since v6.1.0
     */
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
//# sourceMappingURL=helpers.js.map