import { describe, it, expect } from "vitest"
import { Checks } from "../src/checks.js"
import "./setup.js"

describe("Checks.isText", () => {
    it("aceita strings, incluindo vazias", () => {
        expect(Checks.isText("")).toBe(true)
        expect(Checks.isText("abc")).toBe(true)
    })

    it("rejeita não-strings", () => {
        expect(Checks.isText(5)).toBe(false)
        expect(Checks.isText(null)).toBe(false)
        expect(Checks.isText(undefined)).toBe(false)
        expect(Checks.isText(true)).toBe(false)
    })
})

describe("Checks.isValidText", () => {
    it("rejeita strings vazias ou só com espaços", () => {
        expect(Checks.isValidText("")).toBe(false)
        expect(Checks.isValidText("   ")).toBe(false)
    })

    it("aceita strings com conteúdo real", () => {
        expect(Checks.isValidText("a")).toBe(true)
        expect(Checks.isValidText("  x  ")).toBe(true)
    })
})

describe("Checks.isNumeric", () => {
    it("aceita apenas o tipo number", () => {
        expect(Checks.isNumeric(5)).toBe(true)
        expect(Checks.isNumeric(-3.2)).toBe(true)
        expect(Checks.isNumeric(NaN)).toBe(true) // NaN é do tipo "number"
        expect(Checks.isNumeric("5")).toBe(false)
    })
})

describe("Checks.isFiniteNumber — regressão do bug #1", () => {
    it("reconhece números do tipo number", () => {
        expect(Checks.isFiniteNumber(5)).toBe(true)
        expect(Checks.isFiniteNumber(-3.2)).toBe(true)
        expect(Checks.isFiniteNumber(0)).toBe(true)
    })

    it("reconhece números digitados como texto (ponto decimal)", () => {
        expect(Checks.isFiniteNumber("5")).toBe(true)
        expect(Checks.isFiniteNumber("5.3")).toBe(true)
        expect(Checks.isFiniteNumber("-12.75")).toBe(true)
        expect(Checks.isFiniteNumber("0")).toBe(true)
    })

    it("rejeita texto não numérico", () => {
        expect(Checks.isFiniteNumber("a")).toBe(false)
        expect(Checks.isFiniteNumber("abc")).toBe(false)
        expect(Checks.isFiniteNumber("")).toBe(false)
        expect(Checks.isFiniteNumber("   ")).toBe(false)
    })

    it("rejeita infinito e NaN", () => {
        expect(Checks.isFiniteNumber(Infinity)).toBe(false)
        expect(Checks.isFiniteNumber(-Infinity)).toBe(false)
        expect(Checks.isFiniteNumber(NaN)).toBe(false)
        expect(Checks.isFiniteNumber("Infinity")).toBe(false)
    })

    it("rejeita outros tipos", () => {
        expect(Checks.isFiniteNumber(null)).toBe(false)
        expect(Checks.isFiniteNumber(undefined)).toBe(false)
        expect(Checks.isFiniteNumber({})).toBe(false)
        expect(Checks.isFiniteNumber([])).toBe(false)
    })
})

describe("Checks.isValue / isValidValue", () => {
    it("isValue aceita texto ou número, mesmo vazio/NaN", () => {
        expect(Checks.isValue("")).toBe(true)
        expect(Checks.isValue(NaN)).toBe(true)
        expect(Checks.isValue(null)).toBe(false)
    })

    it("isValidValue exige texto não vazio OU número finito", () => {
        expect(Checks.isValidValue("a")).toBe(true)
        expect(Checks.isValidValue("5")).toBe(true)
        expect(Checks.isValidValue("")).toBe(false)
        expect(Checks.isValidValue(NaN)).toBe(false)
        expect(Checks.isValidValue(Infinity)).toBe(false)
        expect(Checks.isValidValue(5)).toBe(true)
    })
})

describe("Checks.isCommand", () => {
    it("aceita apenas nomes de comando válidos", () => {
        expect(Checks.isCommand("config")).toBe(true)
        expect(Checks.isCommand("exit")).toBe(true)
        expect(Checks.isCommand("start")).toBe(true)
    })

    it("rejeita textos que não são comandos, e números", () => {
        expect(Checks.isCommand("naoexiste")).toBe(false)
        expect(Checks.isCommand(5 as any)).toBe(false)
    })
})

describe("Checks.isConfigKey", () => {
    it("aceita chaves existentes em Config", () => {
        expect(Checks.isConfigKey("decimalPlaces")).toBe(true)
        expect(Checks.isConfigKey("degrees")).toBe(true)
    })

    it("rejeita chaves inexistentes ou inválidas", () => {
        expect(Checks.isConfigKey("naoexiste")).toBe(false)
        expect(Checks.isConfigKey("")).toBe(false)
        expect(Checks.isConfigKey(5)).toBe(false)
    })
})

describe("Checks.numericPoint", () => {
    it("extrai e arredonda um valor numérico de um array de pontos", () => {
        expect(Checks.numericPoint([1, 2.987654321, 3], 1)).toBeCloseTo(2.9877, 3)
    })

    it("retorna 0 para índices fora do array", () => {
        expect(Checks.numericPoint([1, 2], 5)).toBe(0)
    })
})
