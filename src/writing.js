import { Algebra } from "./algebra.js";
import { Config, DEFAULT_CONFIG } from "./config.js";
import { tr } from "./i18n.js";
export const Writing = {
    replace(text = "", from = "", to = "") {
        return String(text).split(from).join(to);
    },
    replaceGroup(text = "", list = [["", ""]]) {
        list.forEach(value => {
            if (value[0] != undefined && value[1] != undefined) {
                text = Writing.replace(text, value[0], value[1]);
            }
        });
        return text;
    },
    noUnicode(text = "") {
        let replacements = [
            ["©", "(c)"],
            ["Δ", "Delta"],
            ["π", "pi"],
            ["ℯ", "_e"],
            ["φ", "phi"],
            ["θ", "theta"],
            ["λ", "lambda"],
            ["μ", "mu"],
            ["σ", "sigma"],
            ["ρ", "rho"],
            ["τ", "tau"],
            ["ε", "epsilon"],
            ["γ", "gamma"],
            ["η", "eta"],
            ["ζ", "zeta"],
            ["κ", "kappa"],
            ["ν", "nu"],
            ["ξ", "xi"],
            ["ω", "omega"],
            ["α", "alfa"],
            ["β", "beta"],
            ["χ", "chi"],
            ["ψ", "psi"],
            ["ƒ", "f"],
            ["∑", "soma"],
            ["∏", "produto"],
            ["∫", "integral"],
            ["∬", "integral dupla"],
            ["∭", "integral tripla"],
            ["∮", "integral de linha"],
            ["∯", "integral de superfície"],
            ["∰", "integral de volume"],
            ["∂", "derivada parcial"],
            ["∇", "nabla"],
            ["ℝ", "Reais"],
            ["ℤ", "Inteiros"],
            ["ℕ", "Naturais"],
            ["ℚ", "Racionais"],
            ["ℂ", "Complexos"],
            ["∅", "vazio"],
            ["∪", "união"],
            ["∩", "interseção"],
            ["⊆", "subconjunto de"],
            ["⊇", "superconjunto de"],
            ["⊈", "não é subconjunto de"],
            ["⊉", "não é superconjunto de"],
            ["∀", "para todo"],
            ["∃", "existe"],
            ["∄", "não existe"],
            ["∃!", "existe um único"],
            ["∄!", "não existe um único"],
            ["∃∞", "existem infinitos"],
            ["∄∞", "não existem infinitos"],
            ["∈", "pertencente a"],
            ["∉", "não pertencente a"],
            ["∋", "contém como elemento"],
            ["∌", "não contém como elemento"],
            ["₁", "1"],
            ["₂", "2"],
            ["₃", "3"],
            ["²", "^2"],
            ["³", "^3"],
            ["ˣ", "^x"],
            ["ₐ", "_a"],
            ["ₑ", "_e"],
            ["ₒ", "_o"],
            ["ₓ", "_x"],
            ["⁽", "^("],
            ["⁾", ")"],
            ["₍", "_("],
            ["₎", ")"],
            ["⁻", "-"],
            ["⁺", "+"],
            ["⁼", "="],
            ["ᶜ", "c"],
            ["ᵇ", "b"],
            ["ʸ", "y"],
            ["⁄", "/"],
            ["₌", "="],
            ["₋", "-"],
            ["₊", "+"],
            ["≠", "!="],
            ["≤", "<="],
            ["≥", ">="],
            ["≪", "<<"],
            ["≫", ">>"],
            ["∝", "proporcional a"],
            ["∠", "ângulo"],
            ["∼", "semelhante a"],
            ["≅", "congruente a"],
            ["≈", "aproximadamente igual a"],
            ["≡", "idêntico a"],
            ["·", "*"],
            ["×", "*"],
            ["±", "+/-"],
            ["∓", "-/+"],
            ["÷", "/"],
            ["∖", "-"],
            ["√", "raiz quadrada de "],
            ["∛", "raiz cúbica de "],
            ["∜", "raiz quarta de "],
            ["-∞", "menos infinito"],
            ["∞", "infinito"],
            ["⇒", "=>"],
            ["⇐", "<="],
            ["⇑", "^^"],
            ["⇓", "vv"],
            ["⇔", "<=>"],
            ["⇕", "^^vv"],
            ["⇖", "\\\\"],
            ["⇗", "//"],
            ["⇘", "\\\\"],
            ["⇙", "//"],
            ["∴", "portanto"],
            ["∵", "porque"],
            ["∨", "ou"],
            ["∧", "e"],
            ["¬", "não "],
            ["⊕", "ou exclusivo"],
            ["⊗", "ou não exclusivo"],
            ["→", "->"],
            ["←", "<-"],
            ["↑", "^"],
            ["↓", "v"],
            ["↳", "->"],
            ["↔", "<->"],
            ["↕", "^v"],
            ["↖", "\\"],
            ["↗", "/"],
            ["↘", "\\"],
            ["↙", "/"],
            ["“", "'"],
            ["”", "'"],
            ["‘", "'"],
            ["’", "'"],
            ["…", "..."],
            ["—", "-"],
            ["–", "-"],
            ["−", "-"],
            ["•", "*"],
        ];
        text = Writing.replaceGroup(text, replacements);
        return text;
    },
    noAccents(text = "") {
        let replacements = [
            ["á", "a"],
            ["Á", "A"],
            ["é", "e"],
            ["É", "E"],
            ["í", "i"],
            ["Í", "I"],
            ["ó", "o"],
            ["Ó", "O"],
            ["ú", "u"],
            ["Ú", "U"],
            ["ý", "y"],
            ["Ý", "Y"],
            ["à", "a"],
            ["À", "A"],
            ["è", "e"],
            ["È", "E"],
            ["ì", "i"],
            ["Ì", "I"],
            ["ò", "o"],
            ["Ò", "O"],
            ["ù", "u"],
            ["Ù", "U"],
            ["ỳ", "y"],
            ["Ỳ", "Y"],
            ["ã", "a"],
            ["Ã", "A"],
            ["ẽ", "e"],
            ["Ẽ", "E"],
            ["ĩ", "i"],
            ["Ĩ", "I"],
            ["õ", "o"],
            ["Õ", "O"],
            ["ũ", "u"],
            ["Ũ", "U"],
            ["ñ", "n"],
            ["Ñ", "N"],
            ["ỹ", "y"],
            ["Ỹ", "Y"],
            ["â", "a"],
            ["Â", "A"],
            ["ê", "e"],
            ["Ê", "E"],
            ["î", "i"],
            ["Î", "I"],
            ["ô", "o"],
            ["Ô", "O"],
            ["û", "u"],
            ["Û", "U"],
            ["ŷ", "y"],
            ["Ŷ", "Y"],
            ["ä", "a"],
            ["Ä", "A"],
            ["ë", "e"],
            ["Ë", "E"],
            ["ï", "i"],
            ["Ï", "I"],
            ["ö", "o"],
            ["Ö", "O"],
            ["ü", "u"],
            ["Ü", "U"],
            ["ÿ", "y"],
            ["Ÿ", "Y"],
            ["ç", "c"],
            ["Ç", "C"],
        ];
        text = Writing.replaceGroup(text, replacements);
        return text;
    },
    lowercase(text = "") {
        text = text.toLowerCase();
        text = Writing.replace(text, "δ", "Δ");
        return text;
    },
    uppercase(text = "") {
        text = text.toUpperCase();
        text = Writing.replace(String(text), "Ƒ", "ƒ");
        return text;
    },
    decimal(number = 0, invert = false, round = true, places = Config.decimalPlaces) {
        number = String(number);
        if (invert) {
            return Writing.replace(number, ",", ".");
        }
        if (round) {
            number = Algebra.round(number, places);
        }
        if (Config.decimalSeparator) {
            return Writing.replace(String(number), ".", ",");
        }
        return number;
    },
    simplifyMultiplication(text = "") {
        return Writing.replace(String(text), " · ", "");
    },
    translateUnicode(text = "") {
        let replacements = [
            ["alfa", "alpha"],
            ["para todo", "for all"],
            ["existe um único", "there exists exactly one"],
            ["não existe um único", "there is no unique"],
            ["existem infinitos", "infinitely many exist"],
            ["não existe", "does not exist"],
            ["não pertencente a", "not belonging to"],
            ["pertencente a", "belonging to"],
            ["proporcional a", "proportional to"],
            ["semelhante a", "similar to"],
            ["congruente a", "congruent to"],
            ["aproximadamente igual a", "approximately equal to"],
            ["idêntico a", "identical to"],
            ["raiz quadrada de", "square root of"],
            ["raiz cúbica de", "cube root of"],
            ["raiz quarta de", "fourth root of"],
            ["menos infinito", "negative infinity"],
            ["ou exclusivo", "or exclusive"],
            ["ou não exclusivo", "or not exclusive"],
            ["integral dupla", "double integral"],
            ["integral tripla", "triple integral"],
            ["integral de linha", "line integral"],
            ["integral de superfície", "surface integral"],
            ["integral de volume", "volume integral"],
            ["derivada parcial", "partial derivative"],
            ["reais", "reals"],
            ["inteiros", "integers"],
            ["naturais", "naturals"],
            ["racionais", "rationals"],
            ["complexos", "complexes"],
            ["vazio", "empty"],
            ["união", "union"],
            ["ângulo", "angle"],
            ["soma", "sum"],
            ["produto", "product"],
        ];
        text = Writing.replaceGroup(text, replacements);
        return text;
    },
    format(message = "", explanation = "") {
        if (Config.explanations && explanation != "") {
            message += "\n\n" + explanation;
        }
        if (Config.simpleMulti) {
            message = Writing.simplifyMultiplication(message);
        }
        if (!Config.unicode) {
            message = Writing.noUnicode(message);
            if (Config.language != "pt") {
                message = Writing.translateUnicode(message);
            }
        }
        if (!Config.accents) {
            message = Writing.noAccents(message);
        }
        if (Config.lowercase) {
            message = Writing.lowercase(message);
        }
        else if (Config.uppercase) {
            message = Writing.uppercase(message);
        }
        return message;
    },
    superscript(text = "") {
        if (!Config.unicode) {
            return "^" + text;
        }
        let replacements = [
            ["0", "⁰"],
            ["1", "¹"],
            ["2", "²"],
            ["3", "³"],
            ["4", "⁴"],
            ["5", "⁵"],
            ["6", "⁶"],
            ["7", "⁷"],
            ["8", "⁸"],
            ["9", "⁹"],
            ["-", "⁻"],
            [".", "․"],
        ];
        text = Writing.replaceGroup(String(text), replacements);
        return text;
    },
    subscript(text = "") {
        if (!Config.unicode) {
            return "_" + text;
        }
        let replacements = [
            ["0", "₀"],
            ["1", "₁"],
            ["2", "₂"],
            ["3", "₃"],
            ["4", "₄"],
            ["5", "₅"],
            ["6", "₆"],
            ["7", "₇"],
            ["8", "₈"],
            ["9", "₉"],
            ["-", "₋"],
            [".", "․"],
        ];
        text = Writing.replaceGroup(String(text), replacements);
        return text;
    },
    formatValue(value = true) {
        if (value == true || value == false) {
            return value ? tr("Sim", "Yes") : tr("Não", "No");
        }
        return String(value);
    },
    configItem(message, name) {
        return (message +
            " | “" +
            tr("Atual", "Current") +
            "”: “" +
            Writing.formatValue(Config[name]) +
            "” | “" +
            tr("Padrão", "Default") +
            "”: “" +
            Writing.formatValue(DEFAULT_CONFIG[name]) +
            "”");
    },
    parseDegree(text = "") {
        let degrees = parseFloat(Writing.replace(text, "°", ""));
        return degrees * (Math.PI / 180);
    },
    parseRadian(text = "") {
        let parts = text.split("/"), denominator = parts[1] ? parseFloat(parts[1]) : 1, multiParts = String(parts[0]).split("*"), multiplier = multiParts.length > 1 ? parseFloat(String(multiParts[0])) : 1;
        return (multiplier * Math.PI) / denominator;
    },
    parseAngle(text = "") {
        if (text.includes("°")) {
            return Writing.parseDegree(text);
        }
        else {
            return Writing.parseRadian(text);
        }
    },
    formatAngle(value = 0) {
        let ratio = value / Math.PI;
        for (let denominator = 1; denominator <= 12; denominator++) {
            let numerator = Algebra.round(ratio * denominator, 0);
            if (Algebra.absolute(numerator / denominator - ratio) < 1e-9) {
                if (numerator == 0) {
                    return 0;
                }
                else if (denominator == 1) {
                    return numerator == 1 ? "PI" : numerator + " * PI";
                }
                else {
                    return (numerator == 1 ? "" : numerator + " * ") + "PI / " + denominator;
                }
            }
        }
        return Writing.decimal(value);
    },
};
