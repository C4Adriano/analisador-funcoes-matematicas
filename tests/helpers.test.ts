import { describe, it, expect, beforeEach } from "vitest"
import { Helpers } from "../src/helpers.js"
import { Config } from "../src/config.js"
import { State } from "../src/state.js"
import "./setup.js"

beforeEach(() => {
    Config.decimalPlaces = 4
    Config.decimalSeparator = false
    Config.divPrecision = 1e-9
    Config.interactionLimit = 1000
    State.baseFunc = []
})

describe("Helpers.calcDelta", () => {
    it("calcula Delta positivo e ordena as raízes (menor primeiro)", () => {
        // x² - 5x + 6 = 0 → raízes 2 e 3
        const [delta, x1, x2] = Helpers.calcDelta(1, -5, 6)
        expect(delta).toBe(1)
        expect(x1).toBe(2)
        expect(x2).toBe(3)
    })

    it("calcula Delta igual a zero (raiz dupla)", () => {
        // x² - 4x + 4 = 0 → raiz dupla 2
        const [delta, x1, x2] = Helpers.calcDelta(1, -4, 4)
        expect(delta).toBe(0)
        expect(x1).toBe(2)
        expect(x2).toBeNaN()
    })

    it("calcula Delta negativo (sem raízes reais)", () => {
        // x² + x + 1 = 0 → Delta < 0
        const [delta, x1, x2] = Helpers.calcDelta(1, 1, 1)
        expect(delta).toBeLessThan(0)
        expect(x1).toBeNaN()
        expect(x2).toBeNaN()
    })
})

describe("Helpers.calcRoot", () => {
    it("função afim: raiz de bx + c", () => {
        // 2x - 8 = 0 → x = 4
        expect(Helpers.calcRoot(0, 2, -8)).toBe(4)
    })

    it("função constante: sem raiz (NaN)", () => {
        expect(Helpers.calcRoot(0, 0, 5)).toBeNaN()
    })

    it("função quadrática: retorna [delta, x1, x2]", () => {
        const result = Helpers.calcRoot(1, -3, 2) as number[]
        expect(result[1]).toBe(1)
        expect(result[2]).toBe(2)
    })

    it("função exponencial: raiz existente", () => {
        // 2^x - 4 = 0 → x = 2  (coefA=2, coefB=1, coefC=-4)
        expect(Helpers.calcRoot(2, 1, -4, true)).toBeCloseTo(2, 3)
    })

    it("função exponencial: sem raiz real quando (-c)/b <= 0", () => {
        expect(Helpers.calcRoot(2, 1, 4, true)).toBeNaN()
    })
})

describe("Helpers.vertex", () => {
    it("calcula o vértice de uma parábola", () => {
        // x² - 4x + 3 → delta = 4, vértice em (2, -1)
        const delta = Helpers.calcDelta(1, -4, 3)
        const [vx, vy] = Helpers.vertex(1, -4, delta[0])
        expect(vx).toBe(2)
        expect(vy).toBe(-1)
    })
})

describe("Helpers.calcPeriod", () => {
    it("calcula o período de seno/cosseno: 2π / |a|", () => {
        expect(Helpers.calcPeriod(2)).toBeCloseTo((2 * Math.PI) / 2, 4)
    })

    it("calcula o período da tangente: π / |a|", () => {
        expect(Helpers.calcPeriod(2, true)).toBeCloseTo(Math.PI / 2, 4)
    })
})

describe("Helpers.exceededLimit", () => {
    it("retorna false abaixo do limite configurado", () => {
        Config.interactionLimit = 100
        expect(Helpers.exceededLimit(10)).toBe(false)
    })

    it("retorna true quando o limite é atingido", () => {
        Config.interactionLimit = 100
        expect(Helpers.exceededLimit(100)).toBe(true)
        expect(Helpers.exceededLimit(150)).toBe(true)
    })
})

describe("Helpers.equations", () => {
    it("na primeira chamada, salva a função em State.baseFunc e retorna 0", () => {
        expect(State.baseFunc.length).toBe(0)
        const result = Helpers.equations(true, 0, 2, -4)
        expect(result).toBe(0)
        expect(State.baseFunc).toEqual([0, 2, -4])
    })

    it("na segunda chamada, compara e limpa State.baseFunc, retornando 1", () => {
        Helpers.equations(true, 0, 2, -4)
        const result = Helpers.equations(true, 0, -1, 5)
        expect(result).toBe(1)
        expect(State.baseFunc).toEqual([])
    })

    it("com funções não polinomiais, sempre retorna 0 sem alterar o estado", () => {
        const result = Helpers.equations(false)
        expect(result).toBe(0)
    })
})

describe("Funções de exibição (Helpers.domain/range/xAxis/yAxis/sign/curve) — não devem lançar erro", () => {
    it("domain / range", () => {
        Helpers.domain()
        Helpers.range()
    })

    it("xAxis / yAxis para os três tipos de função polinomial", () => {
        Helpers.xAxis(0, "5") // constante
        Helpers.xAxis(4, "4") // afim/quadrática com raiz
        Helpers.xAxis(NaN, "") // sem raiz real
        Helpers.yAxis(5, "c", "c")
    })

    it("sign para constante, afim e quadrática", () => {
        Helpers.sign(0, 0, 5)
        Helpers.sign(0, 2, -4)
        Helpers.sign(1, -3, 2)
    })

    it("curve para não-polinomial e polinomial", () => {
        Helpers.curve(2, 3, false)
        Helpers.curve(1, -1, true)
    })

    it("showPeriod, amplitude e verticalAsymptotes", () => {
        Helpers.showPeriod(2)
        Helpers.showPeriod(0)
        Helpers.amplitude(3)
        Helpers.verticalAsymptotes(1)
        Helpers.verticalAsymptotes(0)
    })
})
