// Desenvolvido por (Anthropic) Claude (claude.ai), revisado e corrigido por Adriano Lima
// Identifica o tipo de função matemática e extrai seus coeficientes.
// Pipeline: normalizar → tentar cada tipo → fallback constante

// ─── Numeric constants ───────────────────────────────────────────────────────

/**
 * Number π
 */
const _PI = "3.14159265"
/**
 * Euler's number
 */
const _E = "2.71828182"

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * [PARSE] Settings and functions for processing user input and extracting information about the mathematical function.
 * - Use the functions here to process user input and extract information about the mathematical function.
 * @since v6.1.0
 */
export const Parse = {
    /**
     * Quick test function for the parser (debug only)
     * @since v6.1.0
     */
    testInput() {
        let input = prompt("Digite uma função de x (ex: 2x+3, x²-4x+1, ln(x)):")
        if (input === null) return null
        const r = Parse.parseExpr(input)
        alert(
            "Processando: " +
                input +
                "\nVerificado:" +
                "\nTipo: " +
                (r?.type || "Tipo não reconhecido") +
                "\nCoeficientes: " +
                JSON.stringify(r?.coefficients || {}) +
                "\nOriginal: " +
                (r?.original || input)
        )
    },

    /**
     * Converts a coefficient string captured by a regex into a number.
     * Used for both external coefficients and internal arguments.
     *
     * Special cases:
     *   undefined / null / '' / '+' → fallback (default: 1)
     *   '-'                         → -fallback
     *   anything else               → Number(str)
     *
     * @param {string} str - String captured by the regex for the coefficient
     * @param {number} fallback - Value to use when str is empty or just a sign
     * @return {number} - Numeric value of the coefficient
     * @since v6.1.0
     */
    parseCoef(str, fallback = 1) {
        if (str === undefined || str === null) return fallback
        const s = str.trim()
        if (s === "" || s === "+") return fallback
        if (s === "-") return -fallback
        return Number(s)
    },

    /**
     * Normalizes the input before any parsing attempt.
     *
     * Order of substitutions is critical — do not reorder without testing.
     *
     * Applied corrections:
     *   [N01] Scientific notation (1e3 → 1000) BEFORE expanding and Euler,
     *         to prevent "1e3" from being read as "1 * e * 3"
     *   [N02] ƒ (U+0192) and typographic variants → f
     *   [N03] "fx = ..." → function prefix removed
     *   [N04] π and pi → numeric value (with explicit * if preceded by digit)
     *   [N05] Isolated Euler's e → numeric value (does not affect "sen", "exp", e^x)
     *   [N06] Numeric multiplications collapsed (2 * 3.14... → 6.28...)
     *   [N07] e^x converted to ℯx after cleaning isolated e
     *   [N08] a*b^x → a·bˣ (· preserves separator, avoids fusion "23ˣ")
     *   [N09] log_b → logb
     *   [N10] lg(x) → log10(x)
     *   [N11] Outer parentheses removed: (expr) → expr
     *
     * @param {string} input - User input string
     * @return {string} - Normalized string ready for parsing
     * @since v6.1.0
     */
    normalizeExpr(input) {
        return (
            input
                .trim()
                .toLowerCase()

                // [N01] Scientific notation FIRST — before any 'e' expansion
                // "1e3" → 1000,  "2.5e2" → 250
                .replace(/(\d+\.?\d*)e(\d+)/g, (_, m, exp) => String(Number(m) * Math.pow(10, Number(exp))))

                // [N02] ƒ and unicode variants → f
                .replace(/[ƒ𝑓𝒻]/gu, "f")

                // [N03] Function prefixes: "fx=", "f(x)=", "g(x)=", "y=", etc.
                .replace(/^fx\s*=?\s*/, "")
                .replace(/^[a-z]\s*\([a-z]\)\s*=\s*/, "")
                .replace(/^[a-z]\s*=\s*/, "")

                // Comma → decimal point
                .replace(/,/g, ".")

                // Remove spaces
                .replace(/\s+/g, "")

                // [N04] Add * between digit and pi/π before expanding
                // "2pi" → "2*pi", "2π" → "2*π"
                .replace(/(\d)(pi|π)/g, "$1*$2")
                .replace(/π|pi/g, _PI)

                // [N05] Isolated Euler's 'e' (not e^x, not part of a word like "sen", "exp")
                // Add * when preceded by digit: "2e+3" → "2*e+3"
                .replace(/(\d)e(?!\^)(?![a-z])/g, "$1*e")
                // Replace isolated e (preceded by non-letter-non-digit, or start of string)
                .replace(/(?<![a-z\d])e(?!\^)(?![a-z])/g, _E)

                // [N06] Collapse numeric multiplications from the expansions above
                // "2 * 3.14..." → "6.28..."
                .replace(/(\d+\.?\d*)\*(\d+\.?\d*)/g, (_, a, b) =>
                    String(parseFloat((Number(a) * Number(b)).toPrecision(8)))
                )

                // x^2 → x²
                .replace(/x\^2/g, "x²")

                // [N07] e^x → ℯx (internal symbol for Euler as base)
                // Done AFTER treating isolated e — the 'e' in "e^x" arrives here intact
                // because the lookbehind in [N05] requires a non-letter before e
                .replace(/e\^x/g, "ℯx")

                // [N08] coefficient * base^x → coef·baseˣ (preserves separator)
                // MUST come before the generic ^x replace
                .replace(/([+-]?\d+\.?\d*)\*(\d+\.?\d*)\^x/g, "$1·$2ˣ")
                .replace(/(\d+\.?\d*)\^x/g, "$1ˣ")

                // [N09] log_b(x) → logb(x)
                .replace(/log_(\d+)/g, "log$1")

                // [N10] lg(x) → log10(x)  (common alias for log base 10)
                .replace(/^([+-]?\d*\.?\d*)lg\(/, "$1log10(")

                // [N11] Outer parentheses: (expr) → expr
                .replace(/^\((.+)\)$/, "$1")

                // Remove remaining * (2*x → 2x, 2*ln(x) → 2ln(x), etc.)
                .replace(/\*/g, "")
        )
    },

    // ─── Individual parsers ──────────────────────────────────────────────────────

    /**
     * Quadratic: ax² + bx + c
     * Examples: x²-4x+1, 2x²+3x, -x²+5, 0.5x²+x+1
     *
     * Coefficients:
     *   a — coefficient of x² (growth factor)
     *   b — coefficient of x (linear growth factor)
     *   c — constant term (vertical shift)
     * @param {string} expr - Expression to analyze
     * @return {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseQuadratic(expr) {
        const rA = /([+-]?\d*\.?\d*)x²/
        const rB = /([+-]?\d*\.?\d*)x(?!²)/
        const rC = /(?:^|(?<=[x²]))([+-]\d+\.?\d*)$/

        const mA = expr.match(rA)
        if (!mA) return null

        const mB = expr.match(rB)
        const mC = expr.match(rC)

        const a = Parse.parseCoef(mA[1])
        if (a === 0) return null

        return {
            type: "quadratic",
            coefficients: {
                a,
                b: mB ? Parse.parseCoef(mB[1]) : 0,
                c: mC ? Number(mC[1]) : 0,
            },
        }
    },

    /**
     * Affine: ax + b
     * Examples: 2x+3, -x+1, x, 3x, πx+1, 0.5x+2
     *
     * Coefficients:
     *   a — coefficient of x (growth factor)
     *   b — constant term (vertical shift)
     * @param {string} expr - Expression to analyze
     * @return {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseAffine(expr) {
        const regex = /^([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        const a = Parse.parseCoef(match[1])
        if (a === 0) return null

        return {
            type: "affine",
            coefficients: {
                a,
                b: match[2] ? Number(match[2]) : 0,
            },
        }
    },

    /**
     * Euler exponential: a * e^x + c
     * Examples: e^x, 2e^x, -e^x, 2*e^x+5
     * (after normalization: ℯx, 2ℯx, -ℯx, 2ℯx+5)
     *
     * Coefficients:
     *   a    — amplitude (external factor)
     *   base — Math.E (always)
     *   c    — vertical shift
     * @param {string} expr - Expression to analyze
     * @return {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseEulerExp(expr) {
        const regex = /^([+-]?\d*\.?\d*)ℯx([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "exponential",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                base: Math.E,
                c: match[2] ? Number(match[2]) : 0,
            },
        }
    },

    /**
     * Arbitrary-base exponential: a * b^x + c
     * Examples: 2*3^x, 5^x, 10^x, -2*10^x+1
     * (after normalization: 2·3ˣ, 5ˣ, 10ˣ, -2·10ˣ+1)
     *
     * Two distinct regexes: with coefficient (·) and without.
     * The · separator avoids fusing "2*3^x" → "23ˣ" [N08].
     *
     * Coefficients:
     *   a    — amplitude (external factor)
     *   base — exponential base (must be > 0 and ≠ 1)
     *   c    — vertical shift
     * @param {string} expr - Expression to analyze
     * @return {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseBaseExp(expr) {
        const r1 = /^([+-]?\d+\.?\d*)·(\d+\.?\d*)ˣ([+-]\d+\.?\d*)?$/
        const m1 = expr.match(r1)
        if (m1) {
            const base = Number(m1[2])
            if (base <= 0 || base === 1) return null
            return {
                type: "exponential",
                coefficients: {
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
                type: "exponential",
                coefficients: {
                    a: 1,
                    base,
                    c: m2[2] ? Number(m2[2]) : 0,
                },
            }
        }

        return null
    },

    /**
     * Natural logarithm: a * ln(freq·x) + c
     * Examples: ln(x), 2ln(x), -ln(x), ln(2x), 2ln(3x)+1
     *
     * Coefficients:
     *   a    — amplitude (external factor)
     *   base — Math.E (always)
     *   freq — internal coefficient of x
     *   c    — vertical shift
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseLn(expr) {
        const regex = /^([+-]?\d*\.?\d*)ln\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "logarithmic",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                base: Math.E,
                freq: Parse.parseCoef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Logarithm: a * log_base(freq·x) + c
     * Accepts: log(x) [base 10], log2(x), log10(x), log_2(x) [N09], lg(x) [N10]
     *
     * Coefficients: same as parseLn, with variable base.
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseLog(expr) {
        const regex = /^([+-]?\d*\.?\d*)log(\d*\.?\d*)\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        const base = match[2] === "" ? 10 : Number(match[2])
        if (base <= 0 || base === 1) return null

        return {
            type: "logarithmic",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                base,
                freq: Parse.parseCoef(match[3]),
                c: match[4] ? Number(match[4]) : 0,
            },
        }
    },

    /**
     * Sine: a * sin(b·x) + c   (accepts sin and sen)
     * Examples: sin(x), 2sin(x), -sen(x), sin(2x), sin(-x), 2sin(-3x)+1
     *
     * Coefficients:
     *   a — amplitude
     *   b — frequency (can be negative — parseCoef handles '-' as -1)
     *   c — vertical shift
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseSine(expr) {
        const regex = /^([+-]?\d*\.?\d*)s[ei]n\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "sine",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                b: Parse.parseCoef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Cosine: a * cos(b·x) + c
     * Examples: cos(x), 3cos(x), cos(-2x), -cos(3x)+1
     *
     * Coefficients:
     *   a — amplitude
     *   b — frequency (can be negative — parseCoef handles '-' as -1)
     *   c — vertical shift
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseCosine(expr) {
        const regex = /^([+-]?\d*\.?\d*)cos\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "cosine",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                b: Parse.parseCoef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Tangent: a * tan(b·x) + c   (accepts tan and tg)
     * Examples: tan(x), tg(x), 2tan(x), tan(-3x)-1
     *
     * Coefficients:
     *   a — amplitude
     *   b — frequency (can be negative — parseCoef handles '-' as -1)
     *   c — vertical shift
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseTangent(expr) {
        const regex = /^([+-]?\d*\.?\d*)t(?:an|g)\(([+-]?\d*\.?\d*)x\)([+-]\d+\.?\d*)?$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "tangent",
            coefficients: {
                a: Parse.parseCoef(match[1]),
                b: Parse.parseCoef(match[2]),
                c: match[3] ? Number(match[3]) : 0,
            },
        }
    },

    /**
     * Constant: any standalone number (final fallback)
     * Examples: 5, -3, 0, 2.5, 1000 (from 1e3), 3.14159... (from pi), 2.718... (from e)
     * @param {string} expr - Expression to analyze
     * @returns {{ type: string, coefficients: object } | null}
     * @since v6.1.0
     */
    parseConstant(expr) {
        const regex = /^([+-]?\d+\.?\d*)$/
        const match = expr.match(regex)
        if (!match) return null

        return {
            type: "constant",
            coefficients: { c: Number(match[1]) },
        }
    },

    // ─── Main pipeline ───────────────────────────────────────────────────────────

    /**
     * Receives user input and returns an object describing the function.
     * Returns null if no type is recognized.
     *
     * Pipeline order:
     *   Quadratic before affine (x² also contains x — false positive if reversed)
     *   Euler before arbitrary base (both work with ˣ/ℯx)
     *   Constant is the final fallback
     *
     * Return structure by type:
     *   affine       → { a, b }
     *   quadratic    → { a, b, c }
     *   exponential  → { a, base, c }
     *   logarithmic  → { a, base, freq, c }
     *   sine         → { a, b, c }
     *   cosine       → { a, b, c }
     *   tangent      → { a, b, c }
     *   constant     → { c }
     *
     * @param {string} input - e.g. "2x + 3", "x² - 4x + 1", "2*3^x+1", "sin(πx)"
     * @returns {{ type: string, coefficients: object, original: string } | null}
     * @since v6.1.0
     */
    parseExpr(input) {
        if (!input || !input.trim()) return null

        const original = input.trim()
        const expr = Parse.normalizeExpr(original)

        const result =
            Parse.parseQuadratic(expr) ||
            Parse.parseAffine(expr) ||
            Parse.parseEulerExp(expr) ||
            Parse.parseBaseExp(expr) ||
            Parse.parseLn(expr) ||
            Parse.parseLog(expr) ||
            Parse.parseSine(expr) ||
            Parse.parseCosine(expr) ||
            Parse.parseTangent(expr) ||
            Parse.parseConstant(expr) ||
            null

        if (!result) return null

        return { ...result, original }
    },
}
