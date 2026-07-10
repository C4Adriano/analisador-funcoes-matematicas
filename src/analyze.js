import { Algebra } from "./algebra.js";
import { Commands } from "./commands.js";
import { Helpers } from "./helpers.js";
import { tr, trArr } from "./i18n.js";
import { State } from "./state.js";
import { Ui } from "./ui.js";
import { Writing } from "./writing.js";
const BASE_OPTIONS = [
    ["Domínio", "Domain"],
    ["Imagem", "Range"],
    ["Interseção com o eixo x", "X‐axis intersection"],
    ["Interseção com o eixo y", "Y‐axis intersection"],
    ["Valores para x", "X values"],
    ["Valores para y", "Y values"],
    ["Estudo do sinal", "Sign analysis"],
    ["Equações entre funções", "Function equations"],
];
export const Analyze = {
    constant(coefC = State.globalC) {
        let option = 0, page = 1, menuResp;
        Ui.function(0, 0, coefC);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr(BASE_OPTIONS.slice()), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.domain();
                }
                else if (option == 2) {
                    Helpers.range("= " + Writing.decimal(coefC), ".", "y = c ⇒ ƒ(x) " + tr("assume apenas esse valor", "takes only this value"));
                }
                else if (option == 3) {
                    Helpers.xAxis(0, String(coefC));
                }
                else if (option == 4) {
                    Helpers.yAxis(coefC, "c", "c");
                }
                else if (option == 5) {
                    Helpers.xValues(0, 0, coefC);
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yValues(0, 0, coefC);
                }
                else if (option == 2) {
                    Helpers.sign(0, 0, coefC);
                }
                else if (option == 3) {
                    option = Helpers.equations(true, 0, 0, coefC);
                }
            }
            if (option == 6) {
                Ui.function(0, 0, coefC, false, false, "", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefC];
    },
    affine(coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(0, coefB, coefC);
        let root = Helpers.calcRoot(0, coefB, coefC);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Inclinação", "Slope"], ["Raiz", "Root"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.curve(0, coefB);
                }
                else if (option == 2) {
                    Helpers.showRoot(root, "(−c) / b");
                }
                else if (option == 3) {
                    Helpers.domain();
                }
                else if (option == 4) {
                    Helpers.range();
                }
                else if (option == 5) {
                    Helpers.xAxis(root, "(−c) / b");
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefC, "bx + c", "c");
                }
                else if (option == 2) {
                    Helpers.xValues(0, coefB, coefC);
                }
                else if (option == 3) {
                    Helpers.yValues(0, coefB, coefC);
                }
                else if (option == 4) {
                    Helpers.sign(0, coefB, coefC);
                }
                else if (option == 5) {
                    option = Helpers.equations(true, 0, coefB, coefC);
                }
            }
            if (option == 6) {
                Ui.function(0, coefB, coefC, false, false, "", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefB, coefC];
    },
    quadratic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC);
        let delta = Helpers.calcDelta(coefA, coefB, coefC), vertex = Helpers.vertex(coefA, coefB, delta[0]);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Concavidade", "Concavity"], ["Raízes", "Roots"], ["Vértice", "Vertex"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.curve(coefA);
                }
                else if (option == 2) {
                    Helpers.showDelta(delta[0], tr("Não há raízes reais.", "There are no real roots"), tr("Raiz real: ", "Real root: ") + "x₁ = x₂ = " + Writing.decimal(delta[1]), tr("Raízes reais: ", "Real roots: ") +
                        "x₁ = " +
                        Writing.decimal(delta[1]) +
                        ", x₂ = " +
                        Writing.decimal(delta[2]));
                }
                else if (option == 3) {
                    Ui.display(tr("Vértice: ", "Vertex: ") +
                        "(" +
                        Writing.decimal(vertex[0]) +
                        ", " +
                        Writing.decimal(vertex[1]) +
                        ")", tr("Ponto mais baixo (ou mais alto, conforme a concavidade) da função.", "Lowest (or highest, depending on concavity) point of the function") +
                        "\n" +
                        tr("Ponto: ", "Point: ") +
                        "(-b / (2 · a), -Δ / (4 · a))");
                }
                else if (option == 4) {
                    Helpers.domain();
                }
                else if (option == 5) {
                    if (coefA > 0) {
                        Helpers.range("∈ [" + Writing.decimal(vertex[1]) + ", ∞)", tr(" entre o vértice e o ∞.", " between the vertex and the ∞."));
                    }
                    else if (coefA < 0) {
                        Helpers.range("∈ (-∞, " + Writing.decimal(vertex[1]) + "]", tr(" entre -∞ e o vértice.", " between the -∞ and the vertex"));
                    }
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.showDelta(delta[0], tr("Não há interseção com o eixo x.", "There is no intersection with the x‐axis"), tr("Interseção com o eixo x: ", "Intersection with the x‐axis: ") +
                        "(" +
                        Writing.decimal(delta[1]) +
                        ", 0)", tr("Interseções com o eixo x: ", "Intersections with the x‐axis: ") +
                        "(" +
                        Writing.decimal(delta[1]) +
                        ", 0), (" +
                        Writing.decimal(delta[2]) +
                        ", 0)");
                }
                else if (option == 2) {
                    Helpers.yAxis(coefC, "ax² + bx + c", "c");
                }
                else if (option == 3) {
                    Helpers.xValues(coefA, coefB, coefC);
                }
                else if (option == 4) {
                    Helpers.yValues(coefA, coefB, coefC);
                }
                else if (option == 5) {
                    Helpers.sign(coefA, coefB, coefC);
                }
            }
            else if (page == 3) {
                if (option == 1) {
                    option = Helpers.equations(true, coefA, coefB, coefC);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
    exponential(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC, true);
        let root = Helpers.calcRoot(coefA, coefB, coefC, true);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Curva", "Curve"], ["Raiz", "Root"], ["Assíntota", "Asymptote"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.curve(coefA, coefB, false);
                }
                else if (option == 2) {
                    Helpers.showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0");
                }
                else if (option == 3) {
                    Ui.display(tr("Assíntota horizontal: ", "Horizontal asymptote: ") + "y = " + Writing.decimal(coefC), "y = c");
                }
                else if (option == 4) {
                    Helpers.domain();
                }
                else if (option == 5) {
                    if (coefB > 0) {
                        Helpers.range("∈ (" + Writing.decimal(coefC) + ", ∞)", tr(" entre c e ∞, exceto o próprio c.", " between c and ∞, excluding c itself"));
                    }
                    else {
                        Helpers.range("∈ (-∞, " + Writing.decimal(coefC) + ")", tr(" entre -∞ e c, exceto o próprio c.", " between -∞ and c, excluding c itself"));
                    }
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0");
                }
                else if (option == 2) {
                    Helpers.yAxis(coefB + coefC, "b × aˣ + c", "b + c");
                }
                else if (option == 3) {
                    Helpers.xValues(coefA, coefB, coefC, true);
                }
                else if (option == 4) {
                    Helpers.yValues(coefA, coefB, coefC, true);
                }
                else if (option == 5) {
                    Helpers.sign(coefA, coefB, coefC, true);
                }
            }
            else if (page == 3) {
                if (option == 1) {
                    Helpers.equations(false);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, true, false, "", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
    logarithmic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC, false, true);
        let root = Algebra.round(coefA ** Algebra.division(-coefC, coefB, false));
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Curva", "Curve"], ["Raiz", "Root"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.curve(coefA, coefB, false);
                }
                else if (option == 2) {
                    Helpers.showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾");
                }
                else if (option == 3) {
                    Helpers.domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ");
                }
                else if (option == 4) {
                    Helpers.range();
                }
                else if (option == 5) {
                    Helpers.xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾");
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ");
                }
                else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, true);
                }
                else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, true);
                }
                else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, true);
                }
                else if (option == 5) {
                    Helpers.equations(false);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, true, "", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
    sine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC, false, false, "sin");
        let root = Algebra.round(Math.asin(Algebra.division(-coefC, coefB)) / coefA);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Amplitude", "Amplitude"], ["Período", "Period"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.amplitude(coefB);
                }
                else if (option == 2) {
                    Helpers.showPeriod(coefA);
                }
                else if (option == 3) {
                    Helpers.domain();
                }
                else if (option == 4) {
                    Helpers.range("∈ [" +
                        Writing.decimal(-Algebra.absolute(coefB) + coefC) +
                        ", " +
                        Writing.decimal(Algebra.absolute(coefB) + coefC) +
                        "]", "", "−|b| + c ≤ y ≤ |b| + c");
                }
                else if (option == 5) {
                    Helpers.xAxis(root, "arcsin(−c / b) / a", "|(−c / b)| > 1, " + tr("sem raiz real", "without real root"));
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefC, "b × sin(a · x) + c", "c");
                }
                else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "sin");
                }
                else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "sin");
                }
                else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "sin");
                }
                else if (option == 5) {
                    Helpers.equations(false);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "sin", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
    cosine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC, false, false, "cos");
        let root = Algebra.round(Math.acos(Algebra.division(-coefC, coefB)) / coefA);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Amplitude", "Amplitude"], ["Período", "Period"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.amplitude(coefB);
                }
                else if (option == 2) {
                    Helpers.showPeriod(coefA);
                }
                else if (option == 3) {
                    Helpers.domain();
                }
                else if (option == 4) {
                    Helpers.range("∈ [" +
                        Writing.decimal(-Algebra.absolute(coefB) + coefC) +
                        ", " +
                        Writing.decimal(Algebra.absolute(coefB) + coefC) +
                        "]", "", "−|b| + c ≤ y ≤ |b| + c");
                }
                else if (option == 5) {
                    Helpers.xAxis(root, "arccos(−c / b) / a", "|(−c / b)| > 1, " + tr("sem raiz real", "without real root"));
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefB + coefC, "b × cos(a · x) + c", "b + c");
                }
                else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "cos");
                }
                else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "cos");
                }
                else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "cos");
                }
                else if (option == 5) {
                    Helpers.equations(false);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "cos", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
    tangent(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        let option, page = 1, menuResp;
        Ui.function(coefA, coefB, coefC, false, false, "tan");
        let root = Algebra.round(Math.atan(Algebra.division(-coefC, coefB)) / coefA);
        let limit = 0;
        do {
            menuResp = Ui.menu(trArr([["Assíntotas verticais", "Vertical asymptotes"], ["Período", "Period"], ...BASE_OPTIONS]), page);
            option = menuResp[0];
            page = menuResp[1];
            if (Commands.names().includes(String(menuResp[0]))) {
                option = 0;
                page = 1;
            }
            if (page == 1) {
                if (option == 1) {
                    Helpers.verticalAsymptotes(coefA);
                }
                else if (option == 2) {
                    Helpers.showPeriod(coefA, true);
                }
                else if (option == 3) {
                    Helpers.domain();
                }
                else if (option == 4) {
                    Helpers.range();
                }
                else if (option == 5) {
                    Helpers.xAxis(root, "arctan(−c / b) / a");
                }
            }
            else if (page == 2) {
                if (option == 1) {
                    Helpers.yAxis(coefC, "b × tan(a · x) + c", "c");
                }
                else if (option == 2) {
                    Helpers.xValues(coefA, coefB, coefC, false, false, "tan");
                }
                else if (option == 3) {
                    Helpers.yValues(coefA, coefB, coefC, false, false, "tan");
                }
                else if (option == 4) {
                    Helpers.sign(coefA, coefB, coefC, false, false, "tan");
                }
                else if (option == 5) {
                    Helpers.equations(false);
                }
            }
            if (option == 6) {
                Ui.function(coefA, coefB, coefC, false, false, "tan", true);
            }
            if (Helpers.exceededLimit(++limit)) {
                option = 0;
            }
        } while (option != 0);
        return [coefA, coefB, coefC];
    },
};
