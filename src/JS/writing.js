import { Algebra } from "./algebra.js"
import { Config, DEFAULT_CONFIG } from "./config.js"
import { Phrases } from "./phrases.js"

/**
 * @status Funcionando
 * [ 0% ] Phrases
 */

/**
 * [TEXTO] Objeto base para as funções envolvendo escrita e conversão de texto
 * - Use as funções aqui para converter os textos para o formato desejado, como sem acentos ou sem Unicode.
 * @since v6.1.0
 */
export const Writing = {
    /**
     * [TEXTO] Substituição de strings
     * @param {string} text - Texto
     * @param {string} from - O que será removido
     * @param {string} to - O que será colocado no lugar
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    replace(text = "", from = "", to = "") {
        return String(text).split(from).join(to)
    },

    /**
     * [TEXTO] Substituição de várias strings
     * @param {string} text - Texto
     * @param {string[][]} list - Lista de substituições do tipo: [["removido", "adicionado"], ["removido", "adicionado"], ...]
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    replaceGroup(text = "", list = [["", ""]]) {
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] != undefined && list[i][1] != undefined) {
                text = Writing.replace(text, list[i][0], list[i][1])
            }
        }
        return text
    },

    /**
     * [TEXTO] Substituição da grafia de Unicode
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    noUnicode(text = "") {
        let replacements = [
            // === LETRAS / SÍMBOLOS ESPECIAIS ===
            ["Δ", "Delta"],
            ["π", "pi"],
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

            // === FUNÇÕES MATEMÁTICAS ===
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

            // === CONJUNTOS MATEMÁTICOS ===
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

            // === QUANTIFICADORES / EXISTÊNCIA ===
            ["∀", "para todo"],
            ["∃", "existe"],
            ["∄", "não existe"],
            ["∃!", "existe um único"],
            ["∄!", "não existe um único"],
            ["∃∞", "existem infinitos"],
            ["∄∞", "não existem infinitos"],

            // === PERTENCIMENTO ===
            ["∈", "pertencente a"],
            ["∉", "não pertencente a"],
            ["∋", "contém como elemento"],
            ["∌", "não contém como elemento"],

            // === ÍNDICES / EXPOENTES ===
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

            // === OPERADORES RELACIONAIS ===
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

            // === OPERADORES ARITMÉTICOS ===
            ["·", "*"],
            ["×", "*"],
            ["±", "+/-"],
            ["∓", "-/+"],
            ["÷", "/"],
            ["∖", "-"],

            // === RADICAIS / INFINITOS ===
            ["√", "raiz quadrada de "],
            ["∛", "raiz cúbica de "],
            ["∜", "raiz quarta de "],
            ["-∞", "menos infinito"],
            ["∞", "infinito"],

            // === LÓGICA ===
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

            // === SETAS / DIREÇÕES ===
            ["→", "->"],
            ["←", "<-"],
            ["↑", "^"],
            ["↓", "v"],
            ["↔", "<->"],
            ["↕", "^v"],
            ["↖", "\\"],
            ["↗", "/"],
            ["↘", "\\"],
            ["↙", "/"],

            // === PONTUAÇÃO / TEXTO ===
            ["“", "'"],
            ["”", "'"],
            ["‘", "'"],
            ["’", "'"],
            ["…", "..."],
            ["—", "-"],
            ["–", "-"],
            ["−", "-"],
            ["•", "*"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Substituição da grafia de acentos
     * @param {string} text Texto
     * @returns Texto convertido
     */
    noAccents(text = "") {
        let replacements = [
            // === AGUDOS (´) ===
            ["á", "a"], // A agudo (espanhol, português)
            ["Á", "A"],
            ["é", "e"], // E agudo (espanhol, português)
            ["É", "E"],
            ["í", "i"], // I agudo (espanhol, português)
            ["Í", "I"],
            ["ó", "o"], // O agudo (espanhol, português)
            ["Ó", "O"],
            ["ú", "u"], // U agudo (espanhol, português)
            ["Ú", "U"],
            ["ý", "y"], // Y agudo (islandês, tcheco)
            ["Ý", "Y"],

            // === GRAVES (`) ===
            ["à", "a"], // A grave (italiano, francês, português)
            ["À", "A"],
            ["è", "e"], // E grave (italiano, francês)
            ["È", "E"],
            ["ì", "i"], // I grave (italiano, francês)
            ["Ì", "I"],
            ["ò", "o"], // O grave (italiano, francês)
            ["Ò", "O"],
            ["ù", "u"], // U grave (italiano, francês)
            ["Ù", "U"],
            ["ỳ", "y"], // Y grave (islandês, tcheco)
            ["Ỳ", "Y"],

            // === TIL (~) ===
            ["ã", "a"], // A til (português)
            ["Ã", "A"],
            ["ẽ", "e"], // E til (islandês, tcheco)
            ["Ẽ", "E"],
            ["ĩ", "i"], // I til (islandês, tcheco)
            ["Ĩ", "I"],
            ["õ", "o"], // O til (português)
            ["Õ", "O"],
            ["ũ", "u"], // U til (islandês, tcheco)
            ["Ũ", "U"],
            ["ñ", "n"], // N til (espanhol, português)
            ["Ñ", "N"],
            ["ỹ", "y"], // Y til (islandês, tcheco)
            ["Ỹ", "Y"],

            // === CIRCUNFLEXOS (^) ===
            ["â", "a"], // A circunflexo (francês, português)
            ["Â", "A"],
            ["ê", "e"], // E circunflexo (francês, português)
            ["Ê", "E"],
            ["î", "i"], // I circunflexo (francês)
            ["Î", "I"],
            ["ô", "o"], // O circunflexo (francês)
            ["Ô", "O"],
            ["û", "u"], // U circunflexo (francês)
            ["Û", "U"],
            ["ŷ", "y"], // Y circunflexo (islandês, tcheco)
            ["Ŷ", "Y"],

            // === TREMA (¨) ===
            ["ä", "a"], // A trema (alemão, dinamarquês, norueguês)
            ["Ä", "A"],
            ["ë", "e"], // E trema (alemão, dinamarquês, norueguês)
            ["Ë", "E"],
            ["ï", "i"], // I trema (alemão, dinamarquês, norueguês)
            ["Ï", "I"],
            ["ö", "o"], // O trema (alemão, dinamarquês, norueguês)
            ["Ö", "O"],
            ["ü", "u"], // U trema (alemão, dinamarquês, norueguês)
            ["Ü", "U"],
            ["ÿ", "y"], // Y trema (francês)
            ["Ÿ", "Y"],

            // === GANCHOS ===
            ["ç", "c"], // Cedilha / C com gancho (português, francês)
            ["Ç", "C"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para capitalização
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    capitalized(text = "") {
        let result = "",
            capitalize = true

        for (let i = 0; i < text.length; i++) {
            let current = text[i],
                letter = Writing.noAccents(current).toLowerCase()

            if (
                current == "." ||
                current == "!" ||
                current == "?" ||
                current == "\n" ||
                current == "|" ||
                current == "“" ||
                current == "'"
            ) {
                capitalize = true
            } else if (current == "/") {
                capitalize = false
            }

            if (capitalize && "a" <= letter && letter <= "z") {
                result += current.toUpperCase()
                capitalize = false
            } else {
                result += current
            }
        }

        text = result

        let replacements = [
            // Caso especial para a letra latina f, que matematicamente tem uma forma diferente em maiúscula e minúscula
            ["Ƒ", "ƒ"],
            ["F(x)", "f(x)"],
            ["(X)", "(x)"],

            // Casos especiais para variáveis, por padrão, minúsculas
            ["X ", "x "],
            ["Y ", "y "],

            ["A =", "a ="],
            ["B =", "b ="],
            ["C =", "c ="],

            ["A · x²", "a · x²"],
            ["A >", "a >"],
            ["A <", "a <"],
            ["B · x", "b · x"],
            ["B × ", "b × "],
            ["B²", "b²"],

            ["“A”", "“a”"],
            ["'A'", "'a'"],
            ["“B”", "“b”"],
            ["'B'", "'b'"],
            ["“C”", "“c”"],
            ["'C'", "'c'"],

            ["X²", "x²"],
            ["X₁", "x₁"],
            ["X₂", "x₂"],
            ["X₃", "x₃"],
            ["Y₁", "y₁"],
            ["Y₂", "y₂"],
            ["Y₃", "y₃"],

            ["1E-", "1e-"],
            ["1E+", "1e+"],
            ["1E ", "1e "],
            ["1E\n", "1e\n"],

            // Casos especiais para palavras, por padrão, maiúsculas
            ["delta", "Delta"],
            ["unicode", "Unicode"],
            ["reais", "Reais"],
            ["inteiros", "Inteiros"],
            ["naturais", "Naturais"],
            ["racionais", "Racionais"],
            ["complexos", "Complexos"],
            ["reals", "Reals"],
            ["integers", "Integers"],
            ["naturals", "Naturals"],
            ["rationals", "Rationals"],
            ["complexes", "Complexes"],
            ["nan", "NaN"],
            ["infinity", "Infinity"],
            [" i ", " I "],

            // Casos especiais para línguas, que as siglas são minusculas, e as palavras maiúsculas
            ["Pt-br", "pt-br"],
            ["En", "en"],
            ["português", "Português"],
            ["portuguese", "Portuguese"],
            ["inglês", "Inglês"],
            ["english", "English"],

            // Caso especial para o nome do programa
            ["analisador de funções matemáticas", "Analisador de Funções Matemáticas"],
            ["Analisador de funções matemáticas", "Analisador de Funções Matemáticas"],
            ["mathematical function analyzer", "Mathematical Function Analyzer"],
            ["Mathematical function analyzer", "Mathematical Function Analyzer"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para minúsculas
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    lowercase(text = "") {
        text = text.toLowerCase()
        // Caso especial para a letra grega delta, que matematicamente tem uma forma diferente em maiúscula e minúscula
        text = Writing.replace(text, "δ", "Δ")

        return text
    },

    /**
     * [TEXTO] Conversão para maiúsculas
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    uppercase(text = "") {
        text = text.toUpperCase()
        // Caso especial para a letra latina f, que matematicamente tem uma forma diferente em maiúscula e minúscula
        text = Writing.replace(text, "Ƒ", "ƒ")

        return text
    },

    /**
     * [TEXTO] Manipulação de separadores decimais
     * @param {string | number} number - Número
     * @param {boolean} invert - Para inverter e não afetar nas contas
     * @param {boolean} round - Arredondar
     * @param {number} places - Casas decimais
     * @returns {string} - Número convertido
     * @since v6.1.0
     */
    decimal(number = 0, invert = false, round = true, places = Config.decimalPlaces) {
        number = String(number)

        // Se inverter é verdadeiro, troca vírgulas por pontos para não afetar nas contas
        if (invert) {
            return Writing.replace(number, ",", ".")
        }

        // Se arredondar é verdadeiro, arredonda o número para o número de casas decimais configurado
        if (round) {
            number = Algebra.round(number, places)
        }

        // Se separadorDecimal é verdadeiro, troca pontos por vírgulas para exibição
        if (Config.decimalSeparator) {
            return Writing.replace(number, ".", ",")
        }

        return number
    },

    /**
     * [TEXTO] Simplificação de símbolos de multiplicação
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    simplifyMultiplication(text = "") {
        return Writing.replace(text, " · ", "")
    },

    translate(text = "") {
        // Movido para Phrases
    },

    translateUnicode(text = "") {
        // Movido para Phrases
    },

    /**
     * [TEXTO] Formatação geral de mensagens
     * @param {string} message - Mensagem
     * @param {string} explanation - Mensagem para a explicação
     * @returns {string} - Mensagem formatada
     * @since v6.1.0
     */
    format(message = "", explanation = "") {
        // === ADIÇÃO DE EXPLICAÇÕES ===
        // Se explicações estão ativadas e há uma explicação, adiciona à mensagem
        if (Config.explanations && explanation != "") {
            message += "\n\n" + explanation
        }

        // === SIMPLIFICAÇÃO DE MULTIPLICAÇÃO ===
        // Substitui símbolos de multiplicação complexos por simples, se ativado
        if (Config.simpleMulti) {
            message = Writing.simplifyMultiplication(message)
        }

        // === TRADUÇÃO ===
        // Traduz a mensagem para a linguagem configurada
        if (Config.language != "pt-br") {
            message = Writing.translate(message)
        }

        // === REMOÇÃO DE UNICODE ===
        // Remove símbolos Unicode especiais, se desativado
        if (!Config.unicode) {
            message = Writing.noUnicode(message)
            if (Config.language != "pt-br") {
                message = Writing.translateUnicode(message)
            }
        }

        // === REMOÇÃO DE ACENTOS ===
        // Remove acentos das letras, se desativado
        if (!Config.accents) {
            message = Writing.noAccents(message)
        }

        // === AJUSTE DE CASE (MAIÚSCULAS/MINÚSCULAS) ===
        // Aplica transformação de case baseada nas configurações
        if (Config.capitalized) {
            message = Writing.capitalized(message)
        } else if (Config.lowercase) {
            message = Writing.lowercase(message)
        } else if (Config.uppercase) {
            message = Writing.uppercase(message)
        }

        return message
    },

    /**
     * [TEXTO] Conversão para sobrescrito
     * @param {string | number} text - Número
     * @returns {string} - Número convertido
     * @since v6.1.0
     */
    superscript(text = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de sobrescrito simples
        if (!Config.unicode) {
            return "^" + text
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
        ]

        // Substitui os números por seus equivalentes em sobrescrito
        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para subscrito
     * @param {string | number} text - Número
     * @returns {string} - Número subscrito
     * @since v6.1.0
     */
    subscript(text = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de subscrito simples
        if (!Config.unicode) {
            return "_" + text
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
        ]

        // Substitui os números por seus equivalentes em subscrito
        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Formatação de valores booleans
     * @param {string | number | boolean} value - Valor
     * @returns {string} - Valor formatado
     * @since v6.1.0
     */
    formatValue(value = true) {
        if (value == true || value == false) {
            return value ? "Sim" : "Não"
        }

        return String(value)
    },

    /**
     * [TEXTO] Formatação de itens de configuração
     * @param {string} message - Mensagem
     * @param {string} name - Nome em "config"
     * @returns {string} - Mensagem formatada
     * @since v6.1.0
     */
    configItem(message = "", name = "") {
        return (
            message +
            " | Atual: “" +
            Writing.formatValue(Config[name]) +
            "” | Padrão: “" +
            Writing.formatValue(DEFAULT_CONFIG[name]) +
            "”"
        )
    },

    /**
     * [TEXTO] Análise de texto para conversão de graus para radianos
     * @param {string} text - Texto
     * @returns {number} - Ângulo em radianos
     * @since v6.1.0
     */
    parseDegree(text = "") {
        let degrees = parseFloat(Writing.replace(text, "°", ""))
        return degrees * (Math.PI / 180)
    },

    /**
     * [TEXTO] Análise de texto para conversão de radianos para graus
     * @param {string} text - Texto
     * @returns {number} - Ângulo em graus
     * @since v6.1.0
     */
    parseRadian(text = "") {
        let parts = text.split("/"),
            denominator = parts[1] ? parseFloat(parts[1]) : 1,
            multiParts = parts[0].split("*"),
            multiplier = multiParts.length > 1 ? parseFloat(multiParts[0]) : 1
        return (multiplier * Math.PI) / denominator
    },

    /**
     * [TEXTO] Análise de texto para conversão de ângulos
     * @param {string} text - Texto
     * @returns {number} - Ângulo em graus ou radianos
     * @since v6.1.0
     */
    parseAngle(text = "") {
        if (text.includes("°")) {
            return Writing.parseDegree(text)
        } else {
            return Writing.parseRadian(text)
        }
    },

    /**
     * [TEXTO] Formatação de ângulos para exibição
     * @param {number} value - Ângulo em radianos
     * @returns {string} - Ângulo formatado
     * @since v6.1.0
     */
    formatAngle(value = 0) {
        let ratio = value / Math.PI // PI/6 → ratio = 1/6 ≈ 0.1666...

        // Testa denominadores comuns (1 a 12 cobre os casos típicos)
        for (let denominator = 1; denominator <= 12; denominator++) {
            let numerator = Algebra.round(ratio * denominator, 0)
            if (Algebra.absolute(numerator / denominator - ratio) < 1e-9) {
                // Achou uma fração exata
                if (numerator == 0) {
                    return "0"
                } else if (denominator == 1) {
                    return numerator == 1 ? "PI" : numerator + " * PI"
                } else {
                    return (numerator == 1 ? "" : numerator + " * ") + "PI / " + denominator
                }
            }
        }

        // Se não achou fração simples, retorna decimal normal
        return Writing.decimal(value)
    },
}
