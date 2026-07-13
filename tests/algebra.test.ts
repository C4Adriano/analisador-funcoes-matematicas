import { describe, it, expect, beforeEach } from "vitest"
import { Algebra } from "../src/algebra.js"
import { Config } from "../src/config.js"
import { queuePrompt, clearPromptQueue } from "./setup.js"

beforeEach(() => {
    clearPromptQueue()
    Config.decimalPlaces = 4
    Config.decimalSeparator = false
    Config.logPrecision = 1e-9
    Config.divPrecision = 1e-9
    Config.interactionLimit = 1000
})

describe("Algebra.round", () => {
    it("arredonda para o número de casas decimais configurado", () => {
        expect(Algebra.round(1.23456, 2)).toBe(1.23)
        expect(Algebra.round(1.23556, 2)).toBe(1.24)
    })

    it("usa Config.decimalPlaces quando 'places' não é informado", () => {
        Config.decimalPlaces = 2
        expect(Algebra.round(3.14159)).toBe(3.14)
    })

    it("aceita números em formato texto, inclusive com vírgula", () => {
        expect(Algebra.round("2,5", 0)).toBe(3)
        expect(Algebra.round("2.5", 0)).toBe(3)
    })

    it("normaliza -0 para 0", () => {
        expect(Algebra.round(-0.00001, 2)).toBe(0)
    })
})

describe("Algebra.division", () => {
    it("divide corretamente e arredonda por padrão", () => {
        expect(Algebra.division(10, 4)).toBe(2.5)
        expect(Algebra.division(1, 3, true, 1e-9)).toBeCloseTo(0.3333, 4)
    })

    it("retorna sem arredondar quando round=false", () => {
        const result = Algebra.division(1, 3, false) as number
        expect(result).toBeGreaterThan(0.33333333)
        expect(result).toBeLessThan(0.33333334)
    })

    it("retorna NaN para divisão por zero", () => {
        expect(Algebra.division(5, 0)).toBeNaN()
    })

    it("retorna NaN quando o denominador é menor que a precisão configurada", () => {
        expect(Algebra.division(5, 1e-12, true, 1e-9)).toBeNaN()
    })

    it("retorna NaN para entradas não numéricas", () => {
        expect(Algebra.division("a" as any, 2)).toBeNaN()
    })
})

describe("Algebra.absolute", () => {
    it("retorna o valor absoluto", () => {
        expect(Algebra.absolute(-5)).toBe(5)
        expect(Algebra.absolute(5)).toBe(5)
        expect(Algebra.absolute(0)).toBe(0)
    })

    it("arredonda antes de tirar o módulo, por padrão", () => {
        expect(Algebra.absolute(-1.23456, true, 2)).toBe(1.23)
    })

    it("retorna NaN para valores inválidos", () => {
        expect(Algebra.absolute("x" as any)).toBeNaN()
    })
})

describe("Algebra.ln", () => {
    it("calcula o logaritmo natural com precisão configurada", () => {
        expect(Algebra.ln(Math.E)).toBeCloseTo(1, 6)
        expect(Algebra.ln(1)).toBeCloseTo(0, 6)
    })

    it("retorna NaN para x <= 0", () => {
        expect(Algebra.ln(0)).toBeNaN()
        expect(Algebra.ln(-5)).toBeNaN()
    })
})

describe("Algebra.log", () => {
    it("calcula o log em base arbitrária", () => {
        expect(Algebra.log(8, 2)).toBeCloseTo(3, 4)
        expect(Algebra.log(100, 10)).toBeCloseTo(2, 4)
    })

    it("calcula log com base menor que 1 via mudança de base", () => {
        expect(Algebra.log(0.25, 0.5)).toBeCloseTo(2, 3)
    })

    it("retorna NaN para x <= 0, base <= 0 ou base == 1", () => {
        expect(Algebra.log(-1, 2)).toBeNaN()
        expect(Algebra.log(8, 1)).toBeNaN()
        expect(Algebra.log(8, -2)).toBeNaN()
        expect(Algebra.log(8, 0)).toBeNaN()
    })
})

describe("Algebra.variables — regressão do bug #1 (via Ui.input)", () => {
    it("reconhece um número digitado e o retorna arredondado", () => {
        queuePrompt("5.5")
        expect(Algebra.variables("a")).toBe(5.5)
    })

    it("reconhece números com vírgula decimal", () => {
        queuePrompt("2,25")
        expect(Algebra.variables("b")).toBe(2.25)
    })

    it("trata o próprio nome digitado como incógnita", () => {
        queuePrompt("a")
        expect(Algebra.variables("a")).toBe("a")
    })

    it("trata entrada cancelada (null) como incógnita, respeitando o limite de interações", () => {
        Config.interactionLimit = 3
        queuePrompt(null, null, null)
        expect(Algebra.variables("c")).toBe("c")
    })
})

describe("Algebra.point", () => {
    it("coleta um ponto (x, y)", () => {
        queuePrompt("2", "4")
        expect(Algebra.point(1)).toEqual([2, 4])
    })

    it("coleta dois pontos", () => {
        queuePrompt("1", "2", "3", "6")
        expect(Algebra.point(2)).toEqual([1, 2, 3, 6])
    })
})

describe("Algebra.equations", () => {
    it("não lança erro ao comparar duas funções afins com coeficientes válidos", () => {
        Algebra.equations([0, 2, -4], [0, -1, 5])
    })
})
