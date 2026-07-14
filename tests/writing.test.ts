/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it } from "vitest"
import { Config } from "../src/config.js"
import { Writing } from "../src/writing.js"
import "./setup.js"

beforeEach(() => {
    Config.decimalPlaces = 4
    Config.decimalSeparator = false
    Config.explanations = true
    Config.simpleMulti = false
    Config.unicode = true
    Config.accents = true
    Config.lowercase = false
    Config.uppercase = false
    Config.language = "pt"
})

describe("Writing.replace / replaceGroup", () => {
    it("substitui todas as ocorrências de um trecho", () => {
        expect(Writing.replace("a-b-c", "-", "+")).toBe("a+b+c")
    })

    it("aplica múltiplas substituições em sequência", () => {
        expect(
            Writing.replaceGroup("café com açúcar", [
                ["é", "e"],
                ["ú", "u"],
            ])
        ).toBe("cafe com açucar")
    })

    it("ignora pares incompletos na lista de substituição", () => {
        expect(Writing.replaceGroup("abc", [["a", undefined as any]])).toBe("abc")
    })
})

describe("Writing.noAccents", () => {
    it("remove acentos comuns do português", () => {
        expect(Writing.noAccents("função")).toBe("funcao")
        expect(Writing.noAccents("é")).toBe("e")
        expect(Writing.noAccents("ção")).toBe("cao")
    })

    it("preserva texto sem acentos", () => {
        expect(Writing.noAccents("abc")).toBe("abc")
    })
})

describe("Writing.noUnicode", () => {
    it("converte símbolos matemáticos para notação ASCII", () => {
        expect(Writing.noUnicode("Δ")).toBe("Delta")
        expect(Writing.noUnicode("π")).toBe("pi")
        expect(Writing.noUnicode("x ∈ ℝ")).toBe("x pertencente a Reais")
    })
})

describe("Writing.lowercase / uppercase", () => {
    it("converte para minúsculas, preservando o Delta grego maiúsculo", () => {
        expect(Writing.lowercase("ABC")).toBe("abc")
        expect(Writing.lowercase("Δ")).toBe("Δ") // Δ minúsculo (δ) some, mas Δ maiúsculo não muda aqui
    })

    it("converte para maiúsculas, preservando o ƒ minúsculo especial", () => {
        expect(Writing.uppercase("abc")).toBe("ABC")
        expect(Writing.uppercase("ƒ")).toBe("ƒ") // Ƒ maiúsculo é revertido para ƒ minúsculo
    })
})

describe("Writing.decimal", () => {
    it("com invert=true, troca vírgula por ponto sem arredondar", () => {
        expect(Writing.decimal("3,14159", true)).toBe("3.14159")
    })

    it("arredonda e usa ponto quando decimalSeparator=false", () => {
        Config.decimalSeparator = false
        expect(Writing.decimal(3.14159, false, true, 2)).toBe(3.14)
    })

    it("arredonda e usa vírgula quando decimalSeparator=true", () => {
        Config.decimalSeparator = true
        expect(Writing.decimal(3.14159, false, true, 2)).toBe("3,14")
    })
})

describe("Writing.simplifyMultiplication", () => {
    it("remove o símbolo de multiplicação com espaços", () => {
        expect(Writing.simplifyMultiplication("2 · x")).toBe("2x")
    })
})

describe("Writing.superscript / subscript", () => {
    it("converte dígitos para sobrescrito em Unicode", () => {
        Config.unicode = true
        expect(Writing.superscript("23")).toBe("²³")
    })

    it("usa notação com '^' quando Unicode está desligado", () => {
        Config.unicode = false
        expect(Writing.superscript("23")).toBe("^23")
    })

    it("converte dígitos para subscrito em Unicode", () => {
        Config.unicode = true
        expect(Writing.subscript("12")).toBe("₁₂")
    })

    it("usa notação com '_' quando Unicode está desligado", () => {
        Config.unicode = false
        expect(Writing.subscript("12")).toBe("_12")
    })
})

describe("Writing.formatValue", () => {
    it("formata booleanos como Sim/Não (em português)", () => {
        Config.language = "pt"
        expect(Writing.formatValue(true)).toBe("Sim")
        expect(Writing.formatValue(false)).toBe("Não")
    })

    it("converte outros valores para string", () => {
        expect(Writing.formatValue(5 as any)).toBe("5")
        expect(Writing.formatValue("deg" as any)).toBe("deg")
    })
})

describe("Writing.format", () => {
    it("concatena mensagem e explicação quando Config.explanations=true", () => {
        Config.explanations = true
        expect(Writing.format("Título", "Detalhe")).toBe("Título\n\nDetalhe")
    })

    it("não concatena a explicação quando Config.explanations=false", () => {
        Config.explanations = false
        expect(Writing.format("Título", "Detalhe")).toBe("Título")
    })

    it("aplica maiúsculas quando Config.uppercase=true", () => {
        Config.uppercase = true
        expect(Writing.format("abc")).toBe("ABC")
    })
})

describe("Writing.parseDegree / parseRadian / parseAngle", () => {
    it("converte graus (com °) para radianos", () => {
        expect(Writing.parseDegree("180°")).toBeCloseTo(Math.PI, 6)
        expect(Writing.parseDegree("90°")).toBeCloseTo(Math.PI / 2, 6)
    })

    it("parseAngle detecta o símbolo de grau e delega para parseDegree", () => {
        expect(Writing.parseAngle("180°")).toBeCloseTo(Math.PI, 6)
    })

    it("parseRadian entende a notação 'N * PI / M'", () => {
        expect(Writing.parseRadian("2*PI/3")).toBeCloseTo((2 * Math.PI) / 3, 6)
        expect(Writing.parseRadian("PI/6")).toBeCloseTo(Math.PI / 6, 6) // sem "*", assume multiplicador 1
    })

    it("[comportamento atual, não ideal] parseRadian ignora números decimais simples, sem 'PI'", () => {
        // Observação: digitar um valor puro em radianos (ex.: "1.57") não é interpretado
        // como 1.57 — a ausência de "*" faz o multiplicador cair para 1, retornando sempre PI.
        // Isso está documentado aqui como comportamento atual; ver bugs relatados sobre Ui.input/angle.
        expect(Writing.parseRadian("1.57")).toBeCloseTo(Math.PI, 6)
    })
})

describe("Writing.formatAngle", () => {
    it("reconhece frações simples de PI", () => {
        expect(Writing.formatAngle(Math.PI)).toBe("PI")
        expect(Writing.formatAngle(Math.PI / 6)).toBe("PI / 6")
        expect(Writing.formatAngle((2 * Math.PI) / 3)).toBe("2 * PI / 3")
    })

    it("retorna 0 para ângulo zero", () => {
        expect(Writing.formatAngle(0)).toBe(0)
    })

    it("cai para decimal normal quando não há fração simples de PI", () => {
        const result = Writing.formatAngle(1.2345)
        expect(typeof result).toBe("number")
    })
})
