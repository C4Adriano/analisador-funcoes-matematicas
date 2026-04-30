/**
 * algebra.test.js
 * Testes para Algebra, Helpers, Writing e Commands.
 * Execução: npx vitest run
 */

import { describe, it, expect, vi } from "vitest"

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("../src/JS/config.js", () => ({
    Config: {
        decimalPlaces: 6,
        logPrecision: 1e-12,
        divPrecision: 1e-12,
        interactionLimit: 1000,
        decimalSeparator: false,
        explanations: true,
        accents: false,
        capitalized: true,
        lowercase: false,
        uppercase: false,
        unicode: true,
        simpleMulti: true,
        language: "en",
    },
    DEFAULT_CONFIG: {
        decimalPlaces: 6,
        unicode: true,
        accents: false,
        capitalized: true,
        uppercase: false,
        lowercase: false,
    },
    VERSION: "v6.1.1",
    saveConfig: vi.fn(),
    resetConfig: vi.fn(),
    loadConfig: vi.fn(),
}))

vi.mock("../src/JS/writing.js", () => ({
    Writing: {
        decimal: (number, invert = false) => {
            if (invert) {
                const parsed = parseFloat(String(number).replace(",", "."))
                return isNaN(parsed) ? NaN : parsed
            }
            return String(number)
        },
        replace: (text, from, to) => String(text).split(from).join(to),
        replaceGroup: (text, list = []) => {
            for (const [from, to] of list) {
                if (from != null && to != null) {
                    text = String(text).split(from).join(to)
                }
            }
            return text
        },
        format: msg => msg,
        configItem: msg => msg,
        noAccents: vi.fn(t => t),
        noUnicode: vi.fn(t => t),
        lowercase: vi.fn(t => String(t).toLowerCase()),
        uppercase: vi.fn(t => String(t).toUpperCase()),
        translate: vi.fn(t => t),
        translateUnicode: vi.fn(t => t),
        capitalized: vi.fn(t => t),
        multiSimples: vi.fn(t => t),
        formatValue: v => (v === true ? "Sim" : v === false ? "Não" : String(v)),
        parseDegree: text => parseFloat(String(text).replace("°", "")) * (Math.PI / 180),
        parseRadian: text => {
            const parts = text.split("/")
            const denominator = parts[1] ? parseFloat(parts[1]) : 1
            const multiParts = parts[0].split("*")
            const multiplier = multiParts.length > 1 ? parseFloat(multiParts[0]) : 1
            return (multiplier * Math.PI) / denominator
        },
        parseAngle: text => {
            if (text.includes("°")) return parseFloat(text.replace("°", "")) * (Math.PI / 180)
            const parts = text.split("/")
            const denominator = parts[1] ? parseFloat(parts[1]) : 1
            const multiParts = parts[0].split("*")
            const multiplier = multiParts.length > 1 ? parseFloat(multiParts[0]) : 1
            return (multiplier * Math.PI) / denominator
        },
        superscript: vi.fn(t => t),
        subscript: vi.fn(t => t),
        formatAngle: vi.fn(v => String(v)),
    },
}))

vi.mock("../src/JS/error.js", () => ({
    Error: {
        range: vi.fn(),
        divZero: vi.fn(),
        limitExceeded: vi.fn(),
        invalidLog: vi.fn(),
        constantFunction: vi.fn(),
        invalidFunction: vi.fn(),
    },
}))

vi.mock("../src/JS/ui.js", () => ({
    Ui: {
        display: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        input: vi.fn(),
        confirm: vi.fn(),
        range: vi.fn(),
        function: vi.fn(),
        intervalo: vi.fn(() => 0),
    },
}))

vi.mock("../src/JS/state.js", () => ({
    State: {
        loop: false,
        keepType: false,
        askCoeffs: false,
        type: 0,
    },
}))

vi.mock("../src/JS/teste.js", () => ({
    Test: { start: vi.fn() },
}))

const { Algebra } = await import("../src/JS/algebra.js")
const { Helpers } = await import("../src/JS/helpers.js")
const { Commands } = await import("../src/JS/commands.js")

// ═══════════════════════════════════════════════════════════════════════════
// ALGEBRA.ROUND
// ═══════════════════════════════════════════════════════════════════════════

describe("Algebra.round", () => {
    it("arredonda com 2 casas decimais", () => {
        expect(Algebra.round(3.14159, 2)).toBe(3.14)
    })
    it("converte -0 para 0", () => {
        expect(Algebra.round(-0, 2)).toBe(0)
    })
    it("1.005 com 2 casas (comportamento real de float)", () => {
        expect(Algebra.round(1.005, 2)).toBe(1.0)
    })
    it("arredonda 1.045 para 1.05", () => {
        expect(Algebra.round(1.045, 2)).toBe(1.05)
    })
    it("arredonda 1.055 para 1.06", () => {
        expect(Algebra.round(1.055, 2)).toBe(1.06)
    })
    it("arredonda número negativo corretamente", () => {
        expect(Algebra.round(-3.14159, 2)).toBe(-3.14)
    })
    it("com 0 casas decimais retorna inteiro", () => {
        expect(Algebra.round(3.7, 0)).toBe(4)
    })
    it("número inteiro permanece igual", () => {
        expect(Algebra.round(5, 2)).toBe(5)
    })
    it("retorna NaN para entrada NaN", () => {
        expect(Algebra.round(NaN, 2)).toBeNaN()
    })
    it("retorna Infinity para entrada Infinity", () => {
        expect(Algebra.round(Infinity, 2)).toBe(Infinity)
    })
    it("retorna -Infinity para entrada -Infinity", () => {
        expect(Algebra.round(-Infinity, 2)).toBe(-Infinity)
    })
    it("aceita vírgula como separador (string '1,5')", () => {
        expect(Algebra.round("1,5", 1)).toBe(1.5)
    })
    it("retorna string 'a' intacta (incógnita)", () => {
        expect(Algebra.round("a", 2)).toBe("a")
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// ALGEBRA.DIVISION
// ═══════════════════════════════════════════════════════════════════════════

describe("Algebra.division", () => {
    it("divisão simples sem arredondamento", () => {
        expect(Algebra.division(10, 2, false)).toBe(5)
    })
    it("retorna NaN para divisão por zero", () => {
        expect(Algebra.division(1, 0)).toBeNaN()
    })
    it("0 dividido por qualquer número é 0", () => {
        expect(Algebra.division(0, 5, false)).toBe(0)
    })
    it("retorna NaN para denominador abaixo da precisão (1e-15)", () => {
        expect(Algebra.division(1, 1e-15)).toBeNaN()
    })
    it("retorna NaN para numerador Infinity", () => {
        expect(Algebra.division(Infinity, 5)).toBeNaN()
    })
    it("retorna NaN para denominador Infinity", () => {
        expect(Algebra.division(5, Infinity)).toBeNaN()
    })
    it("retorna NaN para ambos Infinity", () => {
        expect(Algebra.division(Infinity, Infinity)).toBeNaN()
    })
    it("retorna NaN para NaN no numerador", () => {
        expect(Algebra.division(NaN, 5)).toBeNaN()
    })
    it("retorna NaN para NaN no denominador", () => {
        expect(Algebra.division(5, NaN)).toBeNaN()
    })
    it("10 / 3 sem arredondamento", () => {
        expect(Algebra.division(10, 3, false)).toBeCloseTo(3.3333, 4)
    })
    it("divisão negativa", () => {
        expect(Algebra.division(-10, 2, false)).toBe(-5)
    })
    it("divisão de negativo por negativo", () => {
        expect(Algebra.division(-6, -2, false)).toBe(3)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// ALGEBRA.ABSOLUTE
// ═══════════════════════════════════════════════════════════════════════════

describe("Algebra.absolute", () => {
    it("valor absoluto de número negativo", () => {
        expect(Algebra.absolute(-5, false)).toBe(5)
    })
    it("valor absoluto de número positivo permanece igual", () => {
        expect(Algebra.absolute(3, false)).toBe(3)
    })
    it("valor absoluto de zero é zero", () => {
        expect(Algebra.absolute(0, false)).toBe(0)
    })
    it("retorna NaN para Infinity", () => {
        expect(Algebra.absolute(Infinity, false)).toBeNaN()
    })
    it("retorna NaN para -Infinity", () => {
        expect(Algebra.absolute(-Infinity, false)).toBeNaN()
    })
    it("retorna NaN para NaN", () => {
        expect(Algebra.absolute(NaN, false)).toBeNaN()
    })
    it("valor absoluto de número decimal negativo", () => {
        expect(Algebra.absolute(-3.14, false)).toBeCloseTo(3.14, 5)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// ALGEBRA.LN
// ═══════════════════════════════════════════════════════════════════════════

describe("Algebra.ln", () => {
    it("ln(1) = 0", () => {
        expect(Algebra.ln(1)).toBe(0)
    })
    it("ln(e) = 1", () => {
        expect(Algebra.ln(Math.E)).toBe(1)
    })
    it("ln(e²) ≈ 2", () => {
        expect(Algebra.ln(Math.E ** 2)).toBeCloseTo(2, 5)
    })
    it("ln(0) retorna NaN", () => {
        expect(Algebra.ln(0)).toBeNaN()
    })
    it("ln de número negativo retorna NaN", () => {
        expect(Algebra.ln(-1)).toBeNaN()
    })
    it("ln de número muito pequeno positivo retorna número muito negativo", () => {
        expect(Algebra.ln(0.0001)).toBeLessThan(-5)
    })
    it("ln de número grande retorna número positivo", () => {
        expect(Algebra.ln(1000)).toBeGreaterThan(0)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// ALGEBRA.LOG
// ═══════════════════════════════════════════════════════════════════════════

describe("Algebra.log", () => {
    it("log₁₀(100) = 2", () => {
        expect(Algebra.log(100, 10)).toBe(2)
    })
    it("log₂(8) = 3", () => {
        expect(Algebra.log(8, 2)).toBe(3)
    })
    it("log₁₀(1) = 0", () => {
        expect(Algebra.log(1, 10)).toBe(0)
    })
    it("log₂(1) = 0", () => {
        expect(Algebra.log(1, 2)).toBe(0)
    })
    it("log de número negativo retorna NaN", () => {
        expect(Algebra.log(-1, 10)).toBeNaN()
    })
    it("log com base 1 retorna NaN", () => {
        expect(Algebra.log(10, 1)).toBeNaN()
    })
    it("log com base 0 retorna NaN", () => {
        expect(Algebra.log(10, 0)).toBeNaN()
    })
    it("log com base negativa retorna NaN", () => {
        expect(Algebra.log(10, -2)).toBeNaN()
    })
    it("log₀.₅(4) retorna número negativo (base < 1)", () => {
        expect(Algebra.log(4, 0.5)).toBeLessThan(0)
    })
    it("log(0) retorna NaN", () => {
        expect(Algebra.log(0, 10)).toBeNaN()
    })
    it("log₁₀(1000) = 3", () => {
        expect(Algebra.log(1000, 10)).toBe(3)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS.CALCDELTA
// ═══════════════════════════════════════════════════════════════════════════

describe("Helpers.calcDelta", () => {
    it("Δ > 0: duas raízes distintas — x² - 3x + 2", () => {
        const [delta, x1, x2] = Helpers.calcDelta(1, -3, 2)
        expect(delta).toBe(1)
        expect(x1).toBe(1)
        expect(x2).toBe(2)
    })
    it("Δ = 0: raiz dupla — x² - 2x + 1", () => {
        const [delta, x1, x2] = Helpers.calcDelta(1, -2, 1)
        expect(delta).toBe(0)
        expect(x1).toBe(1)
        expect(x2).toBeNaN()
    })
    it("Δ < 0: sem raízes reais — x² + 1", () => {
        const [delta, x1, x2] = Helpers.calcDelta(1, 0, 1)
        expect(delta).toBe(-4)
        expect(x1).toBeNaN()
        expect(x2).toBeNaN()
    })
    it("raízes retornadas em ordem crescente", () => {
        const [, x1, x2] = Helpers.calcDelta(1, -5, 6)
        expect(x1).toBeLessThanOrEqual(x2)
    })
    it("coeficiente a negativo — Δ = b² - 4ac = 16", () => {
        const [delta] = Helpers.calcDelta(-1, 0, 4)
        expect(delta).toBe(16)
    })
    it("c = 0 — uma das raízes é 0", () => {
        const [, x1, x2] = Helpers.calcDelta(1, -3, 0)
        expect([x1, x2]).toContain(0)
    })
    it("b = 0 — raízes simétricas", () => {
        const [, x1, x2] = Helpers.calcDelta(1, 0, -4)
        expect(x1).toBe(-2)
        expect(x2).toBe(2)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS.VERTEX
// ═══════════════════════════════════════════════════════════════════════════

describe("Helpers.vertex", () => {
    it("vértice de x² - 2x, delta=4", () => {
        const [xv, yv] = Helpers.vertex(1, -2, 4)
        expect(xv).toBe(1)
        expect(yv).toBe(-1)
    })
    it("vértice de x² é a origem (a=1, b=0, delta=0)", () => {
        const [xv, yv] = Helpers.vertex(1, 0, 0)
        expect(xv).toBe(0)
        expect(yv).toBe(0)
    })
    it("xv = -b / (2a) para a=2, b=-8", () => {
        const [xv] = Helpers.vertex(2, -8, 0)
        expect(xv).toBe(2)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS.CALCROOT
// ═══════════════════════════════════════════════════════════════════════════

describe("Helpers.calcRoot", () => {
    it("raiz de função afim: 2x - 4 → x = 2", () => {
        expect(Helpers.calcRoot(0, 2, -4)).toBe(2)
    })
    it("função constante retorna NaN (sem raiz)", () => {
        expect(Helpers.calcRoot(0, 0, 5)).toBeNaN()
    })
    it("função quadrática retorna array (delega para calcDelta)", () => {
        expect(Array.isArray(Helpers.calcRoot(1, -3, 2))).toBe(true)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS.EXCEEDEDLIMIT
// ═══════════════════════════════════════════════════════════════════════════

describe("Helpers.exceededLimit", () => {
    it("não excedeu o limite (5)", () => {
        expect(Helpers.exceededLimit(5)).toBe(false)
    })
    it("exatamente no limite (1000) → excedeu", () => {
        expect(Helpers.exceededLimit(1000)).toBe(true)
    })
    it("acima do limite (1001) → excedeu", () => {
        expect(Helpers.exceededLimit(1001)).toBe(true)
    })
    it("zero → não excedeu", () => {
        expect(Helpers.exceededLimit(0)).toBe(false)
    })
    it("999 → não excedeu", () => {
        expect(Helpers.exceededLimit(999)).toBe(false)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// COMMANDS.LEVENSHTEIN
// ═══════════════════════════════════════════════════════════════════════════

describe("Commands.levenshtein", () => {
    it("strings idênticas → distância 0", () => {
        expect(Commands.levenshtein("help", "help")).toBe(0)
    })
    it("string vazia vs string → distância = tamanho", () => {
        expect(Commands.levenshtein("", "abc")).toBe(3)
    })
    it("string vs string vazia → distância = tamanho", () => {
        expect(Commands.levenshtein("abc", "")).toBe(3)
    })
    it("uma letra diferente → distância 1", () => {
        expect(Commands.levenshtein("halp", "help")).toBe(1)
    })
    it("inserção de uma letra → distância 1", () => {
        expect(Commands.levenshtein("helo", "hello")).toBe(1)
    })
    it("remoção de uma letra → distância 1", () => {
        expect(Commands.levenshtein("helloo", "hello")).toBe(1)
    })
    it("palavras completamente diferentes → distância alta", () => {
        expect(Commands.levenshtein("abc", "xyz")).toBe(3)
    })
    it("'ajda' próximo de 'ajuda' → distância 1", () => {
        expect(Commands.levenshtein("ajda", "ajuda")).toBe(1)
    })
    it("'siar' próximo de 'sair' → distância <= 2", () => {
        expect(Commands.levenshtein("siar", "sair")).toBeLessThanOrEqual(2)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// COMMANDS.PARSEBOOL
// ═══════════════════════════════════════════════════════════════════════════

describe("Commands.parseBool", () => {
    it('"true" → true', () => expect(Commands.parseBool("true")).toBe(true))
    it('"1" → true', () => expect(Commands.parseBool("1")).toBe(true))
    it('"sim" → true', () => expect(Commands.parseBool("sim")).toBe(true))
    it('"yes" → true', () => expect(Commands.parseBool("yes")).toBe(true))
    it('"on" → true', () => expect(Commands.parseBool("on")).toBe(true))
    it('"ativo" → true', () => expect(Commands.parseBool("ativo")).toBe(true))
    it('"false" → false', () => expect(Commands.parseBool("false")).toBe(false))
    it('"0" → false', () => expect(Commands.parseBool("0")).toBe(false))
    it('"nao" → false', () => expect(Commands.parseBool("nao")).toBe(false))
    it('"no" → false', () => expect(Commands.parseBool("no")).toBe(false))
    it('"off" → false', () => expect(Commands.parseBool("off")).toBe(false))
    it('"inativo" → false', () => expect(Commands.parseBool("inativo")).toBe(false))
    it("string não reconhecida → null", () => expect(Commands.parseBool("talvez")).toBeNull())
    it("string vazia → null", () => expect(Commands.parseBool("")).toBeNull())
    it("maiúsculas não reconhecidas → null", () => expect(Commands.parseBool("TRUE")).toBeNull())
})

// ═══════════════════════════════════════════════════════════════════════════
// COMMANDS.RESOLVECMD
// ═══════════════════════════════════════════════════════════════════════════

describe("Commands.resolveCmd", () => {
    it("canônico 'help' → 'help'", () => {
        expect(Commands.resolveCmd("help")).toBe("help")
    })
    it("variação 'ajuda' → 'help'", () => {
        expect(Commands.resolveCmd("ajuda")).toBe("help")
    })
    it("variação 'sair' → 'exit'", () => {
        expect(Commands.resolveCmd("sair")).toBe("exit")
    })
    it("variação 'historico' → 'history'", () => {
        expect(Commands.resolveCmd("historico")).toBe("history")
    })
    it("variação 'versao' → 'version'", () => {
        expect(Commands.resolveCmd("versao")).toBe("version")
    })
    it("variação 'cfg' → 'config'", () => {
        expect(Commands.resolveCmd("cfg")).toBe("config")
    })
    it("comando inexistente → null", () => {
        expect(Commands.resolveCmd("naoexiste")).toBeNull()
    })
    it("string vazia → null", () => {
        expect(Commands.resolveCmd("")).toBeNull()
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// COMMANDS.SUGGESTCMD
// ═══════════════════════════════════════════════════════════════════════════

describe("Commands.suggestCmd", () => {
    it("comando exato → type 'exact', distance 0", () => {
        const result = Commands.suggestCmd("help")
        expect(result.type).toBe("exact")
        expect(result.distance).toBe(0)
    })
    it("'ajdua' próximo de 'ajuda' → type 'suggestion'", () => {
        const result = Commands.suggestCmd("ajdua")
        expect(result.type).toBe("suggestion")
        expect(result.canonical).toBe("help")
    })
    it("palavra completamente diferente → type 'unknown'", () => {
        const result = Commands.suggestCmd("xyzwqr")
        expect(result.type).toBe("unknown")
        expect(result.distance).toBe(-1)
    })
    it("sugestão retorna sempre um canonical válido", () => {
        const result = Commands.suggestCmd("ajdua")
        const validCanonicals = Object.keys(Commands.listCmd())
        expect(validCanonicals).toContain(result.canonical)
    })
})

// ═══════════════════════════════════════════════════════════════════════════
// COMMANDS.PROCESS
// ═══════════════════════════════════════════════════════════════════════════

describe("Commands.process", () => {
    it("texto sem '/' → null (não é comando)", () => {
        expect(Commands.process("hello")).toBeNull()
    })
    it("string vazia → null", () => {
        expect(Commands.process("")).toBeNull()
    })
    it("/exit retorna 'sair'", () => {
        expect(Commands.process("/exit")).toBe("sair")
    })
    it("/sair retorna 'sair'", () => {
        expect(Commands.process("/sair")).toBe("sair")
    })
    it("/start retorna 'inicio'", () => {
        expect(Commands.process("/start")).toBe("inicio")
    })
    it("/review retorna 'rever'", () => {
        expect(Commands.process("/review")).toBe("rever")
    })
    it("/history retorna 'historico'", () => {
        expect(Commands.process("/history")).toBe("historico")
    })
    it("/change retorna 'alterar'", () => {
        expect(Commands.process("/change")).toBe("alterar")
    })
})
