import { Config } from "./config.js"

/**
 * [TEXTO] Objeto centralizado de frases bilíngues do programa.
 * - Cada folha é { pt, en }. Use Phrases.get() para obter a frase no idioma atual.
 * - Caminho: Phrases.classe.funcao.conceito[.variante]
 * @since v6.2.0
 */
export const Phrases = {
    /**
     * [TEXTO] Retorna a frase no idioma configurado.
     * @param {{ pt: string, en: string }} phrase - Objeto folha de Phrases
     * @returns {string} - Frase no idioma atual
     * @since v6.2.0
     */
    get(phrase) {
        return phrase[Config.language] != undefined ? phrase[Config.language] : phrase.pt
    },

    // =========================================================================
    // Main
    // =========================================================================

    Main: {
        intro: {
            title: {
                pt: "Bem-vindo ao Analisador de Funções Matemáticas!",
                en: "Welcome to the Mathematical Function Analyzer!",
            },
            body: {
                pt: "Este programa analisa funções do tipo constante, afim, quadrática, exponencial e logarítmica — identificando suas propriedades e características. Para começar, informe os dados da função quando solicitado.",
                en: "This program analyzes functions of the following types: constant, affine, quadratic, exponential, and logarithmic — identifying their properties and characteristics. To get started, enter the function's data when prompted.",
            },
        },

        start: {
            menu: {
                pt: "=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n3 = Funções trigonométricas\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair",
                en: "=== Start ===\nWhat do you want?\n1 = Polynomial functions\n2 = Non-polynomial functions\n3 = Trigonometric functions\n----------------\n6 = History | 7 = Settings | 8 = Review | 9 = Change | 0 = Exit",
            },
        },

        nonPolynomial: {
            menu: {
                pt: "=== Menu ===\nO que queres?\n1 = Função exponencial\n2 = Função logarítmica\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar",
                en: "=== Menu ===\nWhat do you want?\n1 = Exponential function\n2 = Logarithmic function\n----------------\n6 = History | 7 = Settings | 8 = Review | 9 = Change | 0 = Back",
            },
        },

        trigonometric: {
            menu: {
                pt: "=== Menu ===\nO que queres?\n1 = Função seno\n2 = Função cosseno\n3 = Função tangente\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar",
                en: "=== Menu ===\nWhat do you want?\n1 = Sine function\n2 = Cosine function\n3 = Tangent function\n----------------\n6 = History | 7 = Settings | 8 = Review | 9 = Change | 0 = Back",
            },
        },

        history: {
            notEnough: { pt: "Não há histórico o suficiente para mudanças.", en: "Not enough history for changes." },
            onlyOne: {
                pt: "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função.",
                en: "You have only written one function so far. Use “change” to write another function.",
            },
            header: { pt: "=== Histórico ===\nO que queres?\n", en: "=== History ===\nWhat do you want?\n" },
        },

        review: {
            values: { pt: "Valores:", en: "Values:" },
            // Concatenação: Phrases.get(Main.review.values) + "\n\"a\" = " + a + "\n\"b\" = " + b + "\n\"c\" = " + c
        },

        exit: {
            confirm: { pt: "Tu queres sair?", en: "Do you want to exit?" },
            warning: {
                pt: "Obs.: Configurações poderão voltar ao padrão caso saias",
                en: "Note: Settings may revert to default if you exit",
            },
        },

        html: {
            title: { pt: "Analisador de Funções Matemáticas", en: "Mathematical Function Analyzer" },
            h1: { pt: "Matemática", en: "Mathematics" },
        },
    },

    // =========================================================================
    // Ui
    // =========================================================================

    Ui: {
        display: {
            error: { pt: "=== Erro ===\n", en: "=== Error ===\n" },
            warning: { pt: "=== Aviso ===\n", en: "=== Warning ===\n" },
            function: { pt: "=== Função Atual ===\n", en: "=== Current Function ===\n" },
        },

        confirm: {
            footer: {
                pt: "\n\n“Ok” = “Sim” | “Cancelar” = “Não”",
                en: "\n\n“Ok” = “Yes” | “Cancel” = “No”",
            },
        },

        menu: {
            header: { pt: "=== Menu ===\nPágina ", en: "=== Menu ===\nPage " },
            // Concatenação: header + page + "/" + total
            question: { pt: "\nO que queres?", en: "\nWhat do you want?" },
            footer: {
                pt: "\n----------------\n6 = Rever | 7 = Alterar | 8 = Anterior | 9 = Próxima | 0 = Voltar",
                en: "\n----------------\n6 = Review | 7 = Change | 8 = Previous | 9 = Next | 0 = Back",
            },
        },

        input: {
            confirm: {
                question: { pt: "Tens certeza?", en: "Are you sure?" },
                // Concatenação: "Tu digitaste: \"" + value + "\"\n" + question
                typed: { pt: "Tu digitaste: “", en: "You typed: “" },
                obs1: {
                    pt: "Obs.₁: Se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado",
                    en: "Note₁: If this is a variable and what was typed is not a number, it will be transformed into the variable name, not what was typed",
                },
                obs2: {
                    pt: "Obs.₂: Essas mensagens podem ser desativadas nas configurações, em “Confirmações de entrada”",
                    en: "Note₂: These messages can be disabled in the settings, under “Input confirmations”",
                },
            },
        },

        function: {
            prefix: { pt: "A função: ƒ(x) = ", en: "The function: ƒ(x) = " },

            // Tipos — sufixos concatenados à expressão
            constant: { pt: " é constante", en: " is constant" },
            null: { pt: " / nula", en: " / null" },
            affine: { pt: " é afim", en: " is affine" },
            linear: { pt: " / linear", en: " / linear" },
            identity: { pt: " / identidade", en: " / identity" },
            opposite: { pt: " / oposta", en: " / opposite" },
            quadratic: { pt: " é quadrática", en: " is quadratic" },
            pure: { pt: " / pura", en: " / pure" },
            incomplete: {
                noLinear: { pt: " / incompleta (sem termo linear)", en: " / incomplete (no linear term)" },
                noConstant: { pt: " / incompleta (sem termo constante)", en: " / incomplete (no constant term)" },
            },
            exponential: { pt: " é exponencial", en: " is exponential" },
            natural: { pt: " / natural", en: " / natural" },
            logarithmic: { pt: " é logarítmica", en: " is logarithmic" },
            decimal: { pt: " / decimal", en: " / decimal" },
        },
    },

    // =========================================================================
    // Analyze
    // =========================================================================

    Analyze: {
        quadratic: {
            delta: {
                neg: { pt: "Não há raízes reais.", en: "There are no real roots." },
                zero: { pt: "Raiz real: x₁ = x₂ = ", en: "Real root: x₁ = x₂ = " },
                // Concatenação: zero + Writing.decimal(delta[1])
                pos: { pt: "Raízes reais: x₁ = ", en: "Real roots: x₁ = " },
                // Concatenação: pos + Writing.decimal(delta[1]) + ", x₂ = " + Writing.decimal(delta[2])
            },
            vertex: {
                label: { pt: "Vértice: (", en: "Vertex: (" },
                // Concatenação: label + x + ", " + y + ")"
                explanation: {
                    pt: "Ponto mais baixo (ou mais alto, conforme a concavidade) da função. Ponto (-b / (2 · a), -Δ / (4 · a))",
                    en: "Lowest (or highest, depending on concavity) point of the function. Point (-b / (2 · a), -Δ / (4 · a))",
                },
            },
            xAxis: {
                neg: {
                    pt: "Não há interseção com o eixo x.",
                    en: "There is no intersection with the x-axis.",
                },
                zero: { pt: "Interseção com o eixo x: (", en: "Intersection with the x-axis: (" },
                // Concatenação: zero + Writing.decimal(delta[1]) + ", 0)"
                pos: { pt: "Interseções com o eixo x: (", en: "Intersections with the x-axis: (" },
                // Concatenação: pos + x1 + ", 0) e (" + x2 + ", 0)"
            },
            range: {
                up: { pt: " entre o vértice e o ∞.", en: " between the vertex and ∞." },
                down: { pt: " entre -∞ e o vértice.", en: " between -∞ and the vertex." },
            },
        },

        exponential: {
            asymptote: { pt: "Assíntota horizontal: y = ", en: "Horizontal asymptote: y = " },
            // Concatenação: asymptote + Writing.decimal(coefC)
            range: {
                up: {
                    pt: " entre c e ∞, exceto o próprio c.",
                    en: " between c and ∞, excluding c itself.",
                },
                down: {
                    pt: " entre -∞ e c, exceto o próprio c.",
                    en: " between -∞ and c, excluding c itself.",
                },
            },
        },

        sine: {
            range: {
                explanation: { pt: "Entre -|b| + c e |b| + c", en: "Between -|b| + c and |b| + c" },
            },
            xAxis: {
                noHave: { pt: "|(−c / b)| > 1, sem raiz real", en: "|(−c / b)| > 1, no real root" },
            },
        },

        cosine: {
            range: {
                explanation: { pt: "Entre -|b| + c e |b| + c", en: "Between -|b| + c and |b| + c" },
            },
            xAxis: {
                noHave: { pt: "|(−c / b)| > 1, sem raiz real", en: "|(−c / b)| > 1, no real root" },
            },
        },
    },

    // =========================================================================
    // Helpers
    // =========================================================================

    Helpers: {
        domain: {
            label: { pt: "Domínio: x ", en: "Domain: x " },
            // Concatenação: label + belongs
            default: { pt: "A função pode assumir qualquer x real", en: "The function can take any real x" },
        },

        range: {
            label: { pt: "Imagem: y ", en: "Range: y " },
            // Concatenação: label + belongs
            default: { pt: "A função pode assumir qualquer y real", en: "The function can take any real y" },
            onlyThis: {
                pt: "A função só tem esse valor de y, pois y = c",
                en: "The function only has this y-value, since y = c",
            },
        },

        xAxis: {
            label: { pt: "Interseção com o eixo x: ", en: "Intersection with the x-axis: " },
            infinite: { pt: "y = 0, ∀ x ∈ ℝ", en: "y = 0, ∀ x ∈ ℝ" },
            noExist: { pt: "y = c; se c ≠ 0 ⇒ ∄ x", en: "y = c; if c ≠ 0 ⇒ ∄ x" },
            noHave: {
                pt: "Não existe raiz real, portanto não há interseção com o eixo x.",
                en: "There is no real root, therefore there is no intersection with the x-axis.",
            },
            rootPoint: { pt: "Ponto da raiz, (", en: "Root point, (" },
            // Concatenação: rootPoint + explanation + ", 0)"
        },

        yAxis: {
            label: { pt: "Interseção com o eixo y: ", en: "Intersection with the y-axis: " },
            asY: { pt: "Como y = ", en: "Since y = " },
            // Concatenação: asY + func + ", o ponto é sempre (0, " + explanation + ")"
            alwaysPoint: { pt: ", o ponto é sempre (0, ", en: ", the point is always (0, " },
        },

        xValues: {
            for: { pt: "Para x = ", en: "For x = " },
            // Concatenação: for + x + ", y = " + result
            yIs: { pt: ", y = ", en: ", y = " },
            noReal: {
                pt: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ",
                en: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ",
            },
        },

        yValues: {
            for: { pt: "Para y = ", en: "For y = " },
            // Concatenação: for + y + ", x = " + result  (ou variante de infinitas soluções / sem solução)
            xIs: { pt: ", x = ", en: ", x = " },
            infinite: { pt: "y = c, ∀ x ∈ ℝ", en: "y = c, ∀ x ∈ ℝ" },
            noExist: { pt: "y = c; se y ≠ c ⇒ ∄ x", en: "y = c; if y ≠ c ⇒ ∄ x" },
            afine: { pt: "x = (y - c) / b", en: "x = (y - c) / b" },
            expPos: { pt: "x = ln((y - c) / b) / ln(a)", en: "x = ln((y - c) / b) / ln(a)" },
            expNoExist: { pt: "(y - c) / b ≤ 0", en: "(y - c) / b ≤ 0" },
            log: {
                pt: "x = a⁽⁽ʸ⁻ᶜ⁾ᐟᵇ⁾",
                en: "x = a⁽⁽ʸ⁻ᶜ⁾ᐟᵇ⁾",
            },
            trig: {
                pt: "Valor de x para y ainda não disponível para funções trigonométricas.",
                en: "x-value for y not yet available for trigonometric functions.",
            },
            underConstruction: { pt: "Em construção.", en: "Under construction." },
        },

        sign: {
            // Estudo do sinal — constante
            constant: {
                always: { pt: "A função será sempre ", en: "The function will always be " },
                // Concatenação: always + ("positiva" | "negativa" | "nula") + ", pois c " + op + " 0"
                since: { pt: ", pois c ", en: ", since c " },
                positive: { pt: "positiva", en: "positive" },
                negative: { pt: "negativa", en: "negative" },
                null: { pt: "nula", en: "null" },
            },
            // Afim
            affine: {
                since: { pt: "Pois b ", en: "Since b " },
            },
            // Quadrática
            quadratic: {
                noRoot: {
                    pt: "Conforme a concavidade e as raízes, a ",
                    en: "According to the concavity and roots, a ",
                },
                // Concatenação: noRoot + op + " 0 e Δ < 0."
                oneRoot: { pt: "Conforme a concavidade e a raiz, a ", en: "According to the concavity and root, a " },
                twoRoot: {
                    pt: "Conforme a concavidade e as raízes, a ",
                    en: "According to the concavity and roots, a ",
                },
                // "a < 0 e Δ > 0." / "a > 0 e Δ > 0."
            },
            // Exponencial
            exponential: {
                increasing: {
                    pt: "Conforme a curva e a raiz, neste caso, crescente e (-c) / b > 0.",
                    en: "According to the curve and root, in this case, increasing and (-c) / b > 0.",
                },
                decreasing: {
                    pt: "Conforme a curva e a raiz, neste caso, decrescente e (-c) / b > 0.",
                    en: "According to the curve and root, in this case, decreasing and (-c) / b > 0.",
                },
                noRootUp: {
                    pt: "Conforme b > 0 e (-c) / b ≤ 0.",
                    en: "According to b > 0 and (-c) / b ≤ 0.",
                },
                noRootDown: {
                    pt: "Conforme b < 0 e (-c) / b ≤ 0.",
                    en: "According to b < 0 and (-c) / b ≤ 0.",
                },
            },
            // Logarítmica
            logarithmic: {
                increasing: { pt: "Conforme a curva (crescente)", en: "According to the curve (increasing)" },
                decreasing: { pt: "Conforme a curva (decrescente)", en: "According to the curve (decreasing)" },
            },
            // Trigonométrica
            trig: {
                pt: "Estudo do sinal para funções trigonométricas ainda não disponível.",
                en: "Sign analysis for trigonometric functions not yet available.",
            },
            underConstruction: { pt: "Em construção.", en: "Under construction." },
        },

        equations: {
            saved: { pt: "ƒ₁(x) salva.", en: "ƒ₁(x) saved." },
            enterSecond: { pt: "Digite ƒ₂(x) para comparar.", en: "Enter ƒ₂(x) to compare." },
            nonPoly: {
                pt: "Ainda não posso resolver equações com funções não polinomiais.",
                en: "I cannot solve equations with non-polynomial functions yet.",
            },
            underConstruction: {
                pt: "Em construção, use valores para x e y por enquanto.",
                en: "Under construction, use x and y values for now.",
            },
        },

        curve: {
            // Não polinomial (exponencial/logarítmica)
            nonPoly: {
                increasing: { pt: "Crescente", en: "Increasing" },
                decreasing: { pt: "Decrescente", en: "Decreasing" },
                expUp: {
                    pt: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)",
                    en: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)",
                },
                expDown: {
                    pt: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)",
                    en: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)",
                },
            },
            // Polinomial (afim)
            affine: {
                increasing: { pt: "Crescente", en: "Increasing" },
                decreasing: { pt: "Decrescente", en: "Decreasing" },
                up: { pt: "Aponta para cima, pois b > 0", en: "Points upward, since b > 0" },
                down: { pt: "Aponta para baixo, pois b < 0", en: "Points downward, since b < 0" },
            },
            // Quadrática
            quadratic: {
                up: { pt: "Concavidade para cima", en: "Concavity upward" },
                down: { pt: "Concavidade para baixo", en: "Concavity downward" },
                aPos: { pt: "a > 0", en: "a > 0" },
                aNeg: { pt: "a < 0", en: "a < 0" },
            },
        },

        showRoot: {
            label: { pt: "Raiz real: ", en: "Real root: " },
            explanation: { pt: "A raiz é x = ", en: "The root is x = " },
            // Concatenação: explanation + formula
        },

        showDelta: {
            // As explicações do delta são iguais em PT e EN (fórmulas matemáticas)
            // O lower/equal/higher vêm de fora — já cobertos em Analyze.quadratic.delta.*
        },

        showPeriod: {
            label: { pt: "Período: ", en: "Period: " },
            // Concatenação: label + value (ou "∞")
            formula: {
                sin: { pt: "Período = 2π / |a|", en: "Period = 2π / |a|" },
                tan: { pt: "Período = π / |a|", en: "Period = π / |a|" },
            },
            infinite: { pt: "Período: ∞", en: "Period: ∞" },
            ifZero: {
                pt: "Se a = 0, a função é constante, então o período é infinito.",
                en: "If a = 0, the function is constant, so the period is infinite.",
            },
        },

        amplitude: {
            label: { pt: "Amplitude: ", en: "Amplitude: " },
            // Concatenação: label + |b|
            formula: { pt: "Amplitude = |b|", en: "Amplitude = |b|" },
        },

        verticalAsymptotes: {
            label: {
                pt: "Assíntotas verticais: x = (π / 2 + n · π) / a,  n ∈ ℤ",
                en: "Vertical asymptotes: x = (π / 2 + n · π) / a,  n ∈ ℤ",
            },
            explanation: {
                pt: "tan(a · x) é indefinida quando cos(a · x) = 0, ou seja, a · x = π / 2 + n · π",
                en: "tan(a · x) is undefined when cos(a · x) = 0, meaning a · x = π / 2 + n · π",
            },
            none: { pt: "Assíntotas verticais: ∄", en: "Vertical asymptotes: ∄" },
            ifZero: {
                pt: "Se a = 0, a função é constante, então não há assíntotas.",
                en: "If a = 0, the function is constant, so there are no asymptotes.",
            },
        },
    },

    // =========================================================================
    // Error
    // =========================================================================

    Error: {
        range: {
            label: { pt: "ERRO-001: Escolha um valor entre ", en: "ERROR-001: Choose a value between " },
            // Concatenação: label + (min+1) + " e " + max + " ou selecione 0 para voltar / sair"
            and: { pt: " e ", en: " and " },
            orBack: { pt: " ou selecione 0 para voltar / sair", en: " or select 0 to go back / exit" },
            detail: { pt: "Tu escolheste algo fora do intervalo.", en: "You chose a value outside the interval." },
        },

        divZero: {
            label: { pt: "ERRO-002: Divisão por zero", en: "ERROR-002: Division by zero" },
            reason: { pt: "Motivo: ", en: "Reason: " },
            detail: {
                pt: "Tu tentaste dividir um número por zero, o que não é possível.",
                en: "You tried to divide a number by zero, which is not possible.",
            },
        },

        limitExceeded: {
            label: { pt: "ERRO-003: Ultrapassou o limite", en: "ERROR-003: Exceeded the limit" },
            detail: {
                pt: "A quantidade de interações passou do limite.",
                en: "The number of iterations exceeded the limit.",
            },
        },

        constantFunction: {
            label: {
                prefix: { pt: "ERRO-004: A função não é ", en: "ERROR-004: The function is not " },
                suffix: { pt: "; ela é constante", en: "; it is constant" },
            },
            // Concatenação: label.prefix + type + label.suffix
            detail: { pt: "(a = 0) ∨ (a = 1) ∨ (b = 0)", en: "(a = 0) ∨ (a = 1) ∨ (b = 0)" },
        },

        invalidFunction: {
            label: {
                prefix: { pt: "ERRO-005: A função não é ", en: "ERROR-005: The function is not " },
            },
            // Concatenação: label.prefix + type
            detail: { pt: "a < 0", en: "a < 0" },
        },

        invalidLog: {
            label: { pt: "ERRO-006: ", en: "ERROR-006: " },
            // Concatenação: label + type + " inválido"
            invalid: { pt: " inválido", en: " invalid" },
            reason: { pt: "Motivo: ", en: "Reason: " },
            detail: {
                pt: "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível.",
                en: "You tried to calculate a logarithm with a base less than or equal to 1, which is not possible.",
            },
        },
    },

    // =========================================================================
    // Config / Settings (Main — menu de configurações)
    // =========================================================================

    Config: {
        settings: {
            header: {
                prefix: { pt: "=== Configurações ===\nPágina ", en: "=== Settings ===\nPage " },
                obs: {
                    pt: "Obs.: Configurações não são salvas ao fechar",
                    en: "Note: Settings are not saved on close",
                },
            },
            footer: {
                pt: "\n----------------\n7 = Restaurar padrão | 8 = Anterior | 9 = Próxima | 0 = Voltar",
                en: "\n----------------\n7 = Restore defaults | 8 = Previous | 9 = Next | 0 = Back",
            },
        },

        restore: {
            alreadyDefault: {
                pt: "Todas as configurações já estão na forma padrão.",
                en: "All settings are already in their default form.",
            },
            noNeed: { pt: "Não há necessidade de restaurar.", en: "There is no need to restore." },
            confirm: {
                pt: "Voltar às configurações padrão?\nConfigurações afetadas:\n",
                en: "Reset to default settings?\nAffected settings:\n",
            },
            obs1: {
                pt: "Obs.₁: Isso irá afetar todas as configurações acima",
                en: "Note₁: This will affect all the settings above",
            },
            obs2: {
                pt: "Obs.₂: Essa alteração é permanente",
                en: "Note₂: This change is permanent",
            },
        },

        unicode: {
            question: { pt: "Ativar caracteres Unicode?", en: "Enable Unicode characters?" },
            obs1: {
                pt: "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.",
                en: "Note₁: Unicode characters are special symbols, such as: “ℝ”, “∀”, etc. Disabling them will cause them to be replaced by a corresponding word, such as: “Reals”, “for all”, etc.",
            },
            obs2: {
                pt: "Obs.₂: Nem todos os caracteres Unicode serão desativados",
                en: "Note₂: Not all Unicode characters will be disabled",
            },
            obs3: {
                pt: "Obs.₃: Essa configuração pode mudar algumas explicações",
                en: "Note₃: This setting may change some explanations",
            },
        },

        explanations: {
            question: { pt: "Ativar explicações?", en: "Enable explanations?" },
            obs1: {
                pt: "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele",
                en: "Note₁: Enabling will cause certain messages to be different and include explanations, for example: the calculation of Delta, Δ = b² - 4 · a · c, instead of just the result",
            },
            obs2: {
                pt: "Obs.₂: Nem todas as mensagens têm versão explicada",
                en: "Note₂: Not all messages have an explained version",
            },
            obs3: {
                pt: "Obs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c",
                en: "Note₃: Disabling Unicode will show: Delta = b^2 - 4 * a * c",
            },
        },

        accents: {
            question: { pt: "Ativar acentos?", en: "Enable accents?" },
            obs: {
                pt: "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação",
                en: "Note: This setting will remove all diacritical marks from words, which may cause misinterpretation",
            },
        },

        capitalized: {
            question: { pt: "Ativar letras capitalizadas?", en: "Enable capitalized letters?" },
            obs1: {
                pt: "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas",
                en: "Note₁: This setting will transform words into “normal” form, meaning the first letter of each sentence in uppercase and all others in lowercase",
            },
            obs2: {
                pt: "Obs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”",
                en: "Note₂: This setting will disable “uppercase” and “lowercase”",
            },
        },

        uppercase: {
            question: { pt: "Ativar todas as letras maiúsculas?", en: "Enable all uppercase letters?" },
            obs1: {
                pt: "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas",
                en: "Note₁: This setting will transform all letters into uppercase",
            },
            obs2: {
                pt: "Obs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”",
                en: "Note₂: This setting will disable “capitalized” and “lowercase”",
            },
        },

        lowercase: {
            question: { pt: "Ativar todas as letras minúsculas?", en: "Enable all lowercase letters?" },
            obs1: {
                pt: "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas",
                en: "Note₁: This setting will transform all letters into lowercase",
            },
            obs2: {
                pt: "Obs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”",
                en: "Note₂: This setting will disable “capitalized” and “uppercase”",
            },
        },

        decimalSeparator: {
            question: { pt: "Alterar ponto decimal?", en: "Change decimal separator?" },
            obs1: {
                pt: "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”",
                en: "Note₁: This setting will transform numbers with “.” into numbers with “,”",
            },
            obs2: {
                pt: "Obs.₂: Isso é apenas estético e não irá afetar as contas",
                en: "Note₂: This is only aesthetic and will not affect calculations",
            },
            obs3: {
                pt: "Obs.₃: Tu também poderás escrever os números com “,” em vez de “.”",
                en: "Note₃: You will also be able to write numbers with “,” instead of “.”",
            },
        },

        simpleMulti: {
            question: { pt: "Alterar para multiplicação simples?", en: "Change to simple multiplication?" },
            obs1: {
                pt: "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”",
                en: "Note₁: This will aesthetically change polynomial expressions from: “a · x² + b · x + c” to: “ax² + bx + c”",
            },
            obs2: {
                pt: "Obs.₂: Desativar o Unicode irá transformar o “·” em “*”",
                en: "Note₂: Disabling Unicode will transform “·” into “*”",
            },
            obs3: {
                pt: "Obs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”",
                en: "Note₃: This will not affect “×”, but Unicode will transform it into “*”",
            },
        },

        inputConfirm: {
            question: { pt: "Ativar confirmações de entrada?", en: "Enable input confirmations?" },
            obs: {
                pt: "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada",
                en: "Note: Everything typed will have to be confirmed",
            },
        },

        outputConfirm: {
            question: { pt: "Ativar confirmações de saída?", en: "Enable output confirmations?" },
            obs: {
                pt: "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa",
                en: "Note: This will enable a message before exiting / closing the program",
            },
        },

        errors: {
            question: { pt: "Ativar mensagens de erro?", en: "Enable error messages?" },
            obs: {
                pt: "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo",
                en: "Note: Disabling may cause you not to notice an error you are making",
            },
        },

        showFunction: {
            question: { pt: "Ativar exibição da função?", en: "Enable function display?" },
            obs1: {
                pt: "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções",
                en: "Note₁: “Show function” means the function (for example: ax² + bx + c) will be shown at the beginning of menus, before the options",
            },
            obs2: {
                pt: "Obs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)",
                en: "Note₂: The function will still be shown when option “6” (Review / Show function) is selected",
            },
        },

        decimalPlaces: {
            question: { pt: "Quantas casas decimais?", en: "How many decimal places?" },
            obs1: {
                pt: "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas",
                en: "Note₁: Too few decimal places may cause calculations to be incorrect",
            },
            obs2: {
                pt: "Obs.₂: Os números já digitados serão arredondados para o novo número de casas decimais",
                en: "Note₂: Numbers already entered will be rounded to the new number of decimal places",
            },
        },

        logPrecision: {
            question: { pt: "Qual a precisão do log?", en: "What is the log precision?" },
            obs1: {
                pt: "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs",
                en: "Note₁: This may affect very small calculations involving logarithms",
            },
            obs2: {
                pt: "Obs.₂: Tu terás que escrever literalmente “1e-12”",
                en: "Note₂: You will have to literally type “1e-12”",
            },
        },

        divPrecision: {
            question: { pt: "Qual a precisão da divisão?", en: "What is the division precision?" },
            obs1: {
                pt: "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões",
                en: "Note₁: This may affect very small calculations involving divisions",
            },
            obs2: {
                pt: "Obs.₂: Tu terás que escrever literalmente “1e-12”",
                en: "Note₂: You will have to literally type “1e-12”",
            },
        },

        interactionLimit: {
            question: { pt: "Qual o limite de interações?", en: "What is the interaction limit?" },
            obs1: {
                pt: "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.",
                en: "Note₁: This will affect all loops, such as logarithms, menus, etc.",
            },
            obs2: {
                pt: "Obs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                en: "Note₂: This setting is useful to avoid infinite loops in the code if something goes wrong",
            },
        },

        language: {
            question: { pt: "Qual língua?", en: "Which language?" },
            options: {
                pt: "\n1 = Português Brasileiro\n2 = Inglês",
                en: "\n1 = Brazilian Portuguese\n2 = English",
            },
            obs: {
                pt: "Obs.: Isso irá alterar a língua do sistema inteiro.",
                en: "Note: This will change the entire system language.",
            },
            confirm: { pt: "Tu queres alterar a língua para: ", en: "Do you want to change the language to: " },
        },

        degrees: {
            question: { pt: "Usar graus em vez de radianos?", en: "Use degrees instead of radians?" },
            obs1: {
                pt: "Obs.₁: Isso irá afetar as funções trigonométricas, tais como seno, cosseno e tangente",
                en: "Note₁: This will affect the trigonometric functions, such as sine, cosine, and tangent",
            },
            obs2: {
                pt: "Obs.₂: Ativar isso irá fazer com que os ângulos sejam interpretados como graus, e não π radianos",
                en: "Note₂: Enabling this will cause angles to be interpreted as degrees, not π radians",
            },
        },
    },

    // =========================================================================
    // Algebra (Algebra.equations — resultados de equações entre funções)
    // =========================================================================

    Algebra: {
        equations: {
            same: {
                pt: "Porque as funções são iguais, em todos os pontos, elas se encontram",
                en: "Because the functions are the same at all points, they intersect",
            },
            different: {
                pt: "Porque as funções são diferentes, não há ponto em que elas se encontrarão",
                en: "Because the functions are different, there is no point at which they will meet",
            },
            meet: { pt: "se encontram em", en: "meet at" },
            // Concatenação: "As funções " + meet + " x = " + x
        },
    },
}
