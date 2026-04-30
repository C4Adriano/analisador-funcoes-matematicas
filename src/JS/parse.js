// Desenvolvido por (Anthropic) Claude (claude.ai), revisado e corrigido por Adriano Lima
// Identifica o tipo de função matemática e extrai seus coeficientes.
// Pipeline: normalizar → tentar cada tipo → fallback constante

// ─── Constantes numéricas ────────────────────────────────────────────────────

/**
 * Número π
 */
const _PI = "3.14159265"
/**
 * Número de Euler
 */
const _E = "2.71828182"

// ─── Utilitários ────────────────────────────────────────────────────────────

/**
 * [PARSE] Configurações e funções para processar a entrada do usuário e extrair informações sobre a função matemática.
 * - Use as funções aqui para processar a entrada do usuário e extrair informações sobre a função matemática.
 * @since v6.1.0
 */
export const Parse = {
    /**
     * Função feita por mim para testar o parser
     * @since v6.1.0
     */
    entrada() {
        let input = prompt("Digite uma função de x (ex: 2x+3, x²-4x+1, ln(x)):")
        if (input === null) return null
        const r = Parse.parsear(input)
        alert(
            "Processando: " +
                input +
                "\nVerificado:" +
                "\nTipo: " +
                (r?.tipo || "Tipo não reconhecido") +
                "\nCoeficientes: " +
                JSON.stringify(r?.coeficientes || {}) +
                "\nOriginal: " +
                (r?.original || input)
        )
    },

    /**
     * Converte uma string de coeficiente capturada pelo regex em número.
     * Usada tanto para coeficientes externos quanto para argumentos internos.
     *
     * Casos especiais:
     *   undefined / null / '' / '+' → fallback (padrão: 1)
     *   '-'                         → -fallback
     *   resto                       → Number(str)
     *
     * @param {string} str - String capturada pelo regex para o coeficiente
     * @param {number} fallback - Valor a ser usado quando str for vazio ou apenas um sinal
     * @return {number} - Valor numérico do coeficiente
     * @since v6.1.0
     */
    coef(str, fallback = 1) {
        if (str === undefined || str === null) return fallback
        const s = str.trim()
        if (s === "" || s === "+") return fallback
        if (s === "-") return -fallback
        return Number(s)
    },

    /**
     * Normaliza a entrada antes de qualquer tentativa de parsing.
     *
     * Ordem das substituições é crítica — não reordenar sem testar.
     *
     * Correções aplicadas:
     *   [N01] Notação científica (1e3 → 1000) ANTES de expandir e de Euler,
     *         para evitar que "1e3" seja interpretado como "1 * e * 3"
     *   [N02] ƒ (U+0192) e variantes tipográficas → f
     *   [N03] "fx = ..." → prefixo de função removido
     *   [N04] π e pi → valor numérico (com * explícito se precedidos de dígito)
     *   [N05] e de Euler isolado → valor numérico (não afeta "sen", "exp", e^x)
     *   [N06] Multiplicações numéricas colapsadas (2 * 3.14... → 6.28...)
     *   [N07] e^x convertido para ℯx após a limpeza do e isolado
     *   [N08] a*b^x → a·bˣ (· preserva separador, evita fusão "23ˣ")
     *   [N09] log_b → logb
     *   [N10] lg(x) → log10(x)
     *   [N11] Parênteses externos removidos: (expr) → expr
     *
     * @param {string} entrada - String de entrada do usuário
     * @return {string} - String normalizada pronta para parsing
     * @since v6.1.0
     */
    normalizar(entrada) {
        return (
            entrada
                .trim()
                .toLowerCase()

                // [N01] Notação científica PRIMEIRO — antes de qualquer expansão de 'e'
                // "1e3" → 1000,  "2.5e2" → 250
                .replace(/(\d+\.?\d*)e(\d+)/g, (_, m, exp) => String(Number(m) * Math.pow(10, Number(exp))))

                // [N02] ƒ e variantes unicode → f
                .replace(/[ƒ𝑓𝒻]/gu, "f")

                // [N03] Prefixos de função: "fx=", "f(x)=", "g(x)=", "y=", etc.
                .replace(/^fx\s*=?\s*/, "")
                .replace(/^[a-z]\s*\([a-z]\)\s*=\s*/, "")
                .replace(/^[a-z]\s*=\s*/, "")

                // Vírgula → ponto decimal
                .replace(/,/g, ".")

                // Remove espaços
                .replace(/\s+/g, "")

                // [N04] Adicionar * entre dígito e pi/π antes de expandir
                // "2pi" → "2*pi", "2π" → "2*π"
                .replace(/(\d)(pi|π)/g, "$1*$2")
                .replace(/π|pi/g, _PI)

                // [N05] 'e' de Euler isolado (não e^x, não parte de palavra como "sen", "exp")
                // Adicionar * quando precedido de dígito: "2e+3" → "2*e+3"
                .replace(/(\d)e(?!\^)(?![a-z])/g, "$1*e")
                // Substituir e isolado (precedido de não-letra-não-dígito, ou início de string)
                .replace(/(?<![a-z\d])e(?!\^)(?![a-z])/g, _E)

                // [N06] Colapsar multiplicações numéricas resultantes das expansões acima
                // "2 * 3.14..." → "6.28..."
                .replace(/(\d+\.?\d*)\*(\d+\.?\d*)/g, (_, a, b) =>
                    String(parseFloat((Number(a) * Number(b)).toPrecision(8)))
                )

                // x^2 → x²
                .replace(/x\^2/g, "x²")

                // [N07] e^x → ℯx (símbolo interno para Euler como base)
                // Feito DEPOIS de tratar e isolado — o 'e' de "e^x" chega aqui intacto
                // porque o lookbehind de [N05] exige não-letra antes do e
                .replace(/e\^x/g, "ℯx")

                // [N08] Coeficiente * base^x → coef·baseˣ (preserva separador)
                // DEVE vir antes do replace de ^x genérico
                .replace(/([+-]?\d+\.?\d*)\*(\d+\.?\d*)\^x/g, "$1·$2ˣ")
                .replace(/(\d+\.?\d*)\^x/g, "$1ˣ")

                // [N09] log_b(x) → logb(x)
                .replace(/log_(\d+)/g, "log$1")

                // [N10] lg(x) → log10(x)  (alias comum de log base 10)
                .replace(/^([+-]?\d*\.?\d*)lg\(/, "$1log10(")

                // [N11] Parênteses externos: (expr) → expr
                .replace(/^\((.+)\)$/, "$1")

                // Remove * restantes (2*x → 2x, 2*ln(x) → 2ln(x), etc.)
                .replace(/\*/g, "")
        )
    },

    // ─── Parsers individuais ─────────────────────────────────────────────────────

    /**
     * Quadrática: ax² + bx + c
     * Exemplos: x²-4x+1, 2x²+3x, -x²+5, 0.5x²+x+1
     *
     * Coeficientes:
     *   a — coeficiente de x² (fator de crescimento)
     *   b — coeficiente de x (fator de crescimento linear)
     *   c — termo constante (deslocamento vertical)
     * @param {string} expr - Expressão a ser analisada
     * @return {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearQuadratica(expr) {
        const rA = /([+-]?\d*\.?\d*)x²/
        const rB = /([+-]?\d*\.?\d*)x(?!²)/
        const rC = /(?:^|(?<=[x²]))([+-]\d+\.?\d*)$/

        const mA = expr.match(rA)
        if (!mA) return null

        const mB = expr.match(rB)
        const mC = expr.match(rC)

        const a = Parse.coef(mA[1])
        if (a === 0) return null

        return {
            tipo: "quadratica",
            coeficientes: {
                a,
                b: mB ? Parse.coef(mB[1]) : 0,
                c: mC ? Number(mC[1]) : 0,
            },
        }
    },

    /**
     * Afim: ax + b
     * Exemplos: 2x+3, -x+1, x, 3x, πx+1, 0.5x+2
     *
     * Coeficientes:
     *   a — coeficiente de x (fator de crescimento)
     *   b — termo constante (deslocamento vertical)
     * @param {string} expr - Expressão a ser analisada
     * @return {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearAfim(expr) {
        const regex = /^([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        const a = Parse.coef(match[1])
        if (a === 0) return null

        return {
            tipo: "afim",
            coeficientes: {
                a,
                b: match[2] ? Number(match[2]) : 0,
            },
        }
    },

    /**
     * Exponencial base de Euler: a * e^x + c
     * Exemplos: e^x, 2e^x, -e^x, 2*e^x+5
     * (após normalização: ℯx, 2ℯx, -ℯx, 2ℯx+5)
     *
     * Coeficientes:
     *   a — amplitude (fator externo)
     *   base — Math.E (sempre)
     *   c — deslocamento vertical
     */
    parsearExponencialEuler(expr) {
        const regex = /^([+-]?\d*\.?\d*)ℯx([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "exponencial",
            coeficientes: {
                a: Parse.coef(match[1]),
                base: Math.E,
                c: match[2] ? Number(match[2]) : 0,
            },
        }
    },

    /**
     * Exponencial base arbitrária: a * b^x + c
     * Exemplos: 2*3^x, 5^x, 10^x, -2*10^x+1
     * (após normalização: 2·3ˣ, 5ˣ, 10ˣ, -2·10ˣ+1)
     *
     * Dois regex distintos: com coeficiente (·) e sem.
     * O · como separador evita a fusão "2*3^x" → "23ˣ" [N08].
     *
     * Coeficientes:
     *   a — amplitude (fator externo)
     *   base — base da exponencial (deve ser > 0 e ≠ 1)
     *   c — deslocamento vertical
     * @param {string} expr - Expressão a ser analisada
     * @return {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearExponencialBase(expr) {
        const r1 = /^([+-]?\d+\.?\d*)·(\d+\.?\d*)ˣ([+-]\d+\.?\d*)?$/
        const m1 = expr.match(r1)
        if (m1) {
            const base = Number(m1[2])
            if (base <= 0 || base === 1) return null
            return {
                tipo: "exponencial",
                coeficientes: {
                    a: Number(m1[1]),
                    base,
                    c: m1[3] ? Number(m1[3]) : 0,
                },
            }
        }

        const r2 = /^(\d+\.?\d*)ˣ([+-]\d+\.?\d*)?$/
        const m2 = expr.match(r2)
        if (m2) {
            const base = Number(m2[1])
            if (base <= 0 || base === 1) return null
            return {
                tipo: "exponencial",
                coeficientes: {
                    a: 1,
                    base,
                    c: m2[2] ? Number(m2[2]) : 0,
                },
            }
        }

        return null
    },

    /**
     * Logaritmo natural: a * ln(freq·x) + c
     * Exemplos: ln(x), 2ln(x), -ln(x), ln(2x), 2ln(3x)+1
     *
     * Coeficientes:
     *   a    — amplitude (fator externo)
     *   base — Math.E (sempre)
     *   freq — coeficiente interno de x
     *   c    — deslocamento vertical
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearLn(expr) {
        const regex = /^([+-]?\d*\.?\d*)ln\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "logaritmica",
            coeficientes: {
                a: Parse.coef(match[1]),
                base: Math.E,
                freq: Parse.coef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Logaritmo: a * log_base(freq·x) + c
     * Aceita: log(x) [base 10], log2(x), log10(x), log_2(x) [N09], lg(x) [N10]
     *
     * Coeficientes: idem ln, com base variável.
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearLog(expr) {
        const regex = /^([+-]?\d*\.?\d*)log(\d*\.?\d*)\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        const base = match[2] === "" ? 10 : Number(match[2])
        if (base <= 0 || base === 1) return null

        return {
            tipo: "logaritmica",
            coeficientes: {
                a: Parse.coef(match[1]),
                base,
                freq: Parse.coef(match[3]),
                c: match[4] ? Number(match[4]) : 0,
            },
        }
    },

    /**
     * Seno: a * sin(b·x) + c   (aceita sin e sen)
     * Exemplos: sin(x), 2sin(x), -sen(x), sin(2x), sin(-x), 2sin(-3x)+1
     *
     * Coeficientes:
     *   a — amplitude
     *   b — frequência (pode ser negativo — Parse.coef trata '-' como -1)
     *   c — deslocamento vertical
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearSeno(expr) {
        const regex = /^([+-]?\d*\.?\d*)s[ei]n\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "seno",
            coeficientes: {
                a: Parse.coef(match[1]),
                b: Parse.coef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Cosseno: a * cos(b·x) + c
     * Exemplos: cos(x), 3cos(x), cos(-2x), -cos(3x)+1
     *
     * Coeficientes:
     *   a — amplitude
     *   b — frequência (pode ser negativo — Parse.coef trata '-' como -1)
     *   c — deslocamento vertical
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearCosseno(expr) {
        const regex = /^([+-]?\d*\.?\d*)cos\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "cosseno",
            coeficientes: {
                a: Parse.coef(match[1]),
                b: Parse.coef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Tangente: a * tan(b·x) + c   (aceita tan e tg)
     * Exemplos: tan(x), tg(x), 2tan(x), tan(-3x)-1
     *
     * Coeficientes:
     *   a — amplitude
     *   b — frequência (pode ser negativo — Parse.coef trata '-' como -1)
     *   c — deslocamento vertical
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearTangente(expr) {
        const regex = /^([+-]?\d*\.?\d*)t(?:an|g)\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "tangente",
            coeficientes: {
                a: Parse.coef(match[1]),
                b: Parse.coef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Constante: qualquer número sozinho (fallback final)
     * Exemplos: 5, -3, 0, 2.5, 1000 (de 1e3), 3.14159... (de pi), 2.718... (de e)
     * @param {string} expr - Expressão a ser analisada
     * @returns {{ tipo: string, coeficientes: object } | null}
     * @since v6.1.0
     */
    parsearConstante(expr) {
        const regex = /^([+-]?\d+\.?\d*)$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            tipo: "constante",
            coeficientes: { c: Number(match[1]) },
        }
    },

    // ─── Pipeline principal ──────────────────────────────────────────────────────

    /**
     * Recebe a entrada do usuário e retorna um objeto descrevendo a função.
     * Retorna null se nenhum tipo for reconhecido.
     *
     * Ordem do pipeline:
     *   Quadrática antes de afim (x² também contém x — falso positivo se invertido)
     *   Euler antes de base arbitrária (ambas trabalham com ˣ/ℯx)
     *   Constante é o fallback final
     *
     * Estrutura de retorno por tipo:
     *   afim        → { a, b }
     *   quadratica  → { a, b, c }
     *   exponencial → { a, base, c }
     *   logaritmica → { a, base, freq, c }
     *   seno        → { a, b, c }
     *   cosseno     → { a, b, c }
     *   tangente    → { a, b, c }
     *   constante   → { c }
     *
     * @param {string} entrada - ex: "2x + 3", "x² - 4x + 1", "2*3^x+1", "sin(πx)"
     * @returns {{ tipo: string, coeficientes: object, original: string } | null}
     * @since v6.1.0
     */
    parsear(entrada) {
        if (!entrada || !entrada.trim()) return null

        const original = entrada.trim()
        const expr = Parse.normalizar(original)

        const resultado =
            Parse.parsearQuadratica(expr) ||
            Parse.parsearAfim(expr) ||
            Parse.parsearExponencialEuler(expr) ||
            Parse.parsearExponencialBase(expr) ||
            Parse.parsearLn(expr) ||
            Parse.parsearLog(expr) ||
            Parse.parsearSeno(expr) ||
            Parse.parsearCosseno(expr) ||
            Parse.parsearTangente(expr) ||
            Parse.parsearConstante(expr) ||
            null

        if (!resultado) return null

        return { ...resultado, original }
    },
}
