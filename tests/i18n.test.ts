import { describe, it, expect, beforeEach } from "vitest"
import { tr, trArr, changeLanguage } from "../src/i18n.js"
import { Config } from "../src/config.js"
import "./setup.js"

beforeEach(() => {
    Config.language = "pt"
})

describe("tr", () => {
    it("retorna o texto em português quando Config.language é 'pt' ou 'pt-br'", () => {
        Config.language = "pt"
        expect(tr("Olá", "Hello")).toBe("Olá")

        Config.language = "pt-br"
        expect(tr("Olá", "Hello")).toBe("Olá")
    })

    it("retorna o texto em inglês quando Config.language é 'en'", () => {
        Config.language = "en"
        expect(tr("Olá", "Hello")).toBe("Hello")
    })

    it("retorna português como fallback quando o inglês está vazio", () => {
        Config.language = "en"
        expect(tr("Só em PT", "")).toBe("Só em PT")
    })

    it("retorna inglês como fallback quando o português está vazio (e o idioma não é pt)", () => {
        Config.language = "en"
        expect(tr("", "Only in EN")).toBe("Only in EN")
    })
})

describe("trArr", () => {
    it("mapeia uma lista de pares [pt, en] para o idioma configurado", () => {
        Config.language = "pt"
        expect(
            trArr([
                ["Um", "One"],
                ["Dois", "Two"],
            ])
        ).toEqual(["Um", "Dois"])

        Config.language = "en"
        expect(
            trArr([
                ["Um", "One"],
                ["Dois", "Two"],
            ])
        ).toEqual(["One", "Two"])
    })
})

describe("changeLanguage", () => {
    it("altera Config.language e ajusta acentos/separador decimal para 'pt'", () => {
        Config.language = "en"
        Config.decimalSeparator = false
        Config.accents = false

        changeLanguage("pt")

        expect(Config.language).toBe("pt")
        expect(Config.decimalSeparator).toBe(true)
        expect(Config.accents).toBe(true)
    })

    it("altera Config.language e ajusta acentos/separador decimal para 'en'", () => {
        Config.language = "pt"
        Config.decimalSeparator = true
        Config.accents = true

        changeLanguage("en")

        expect(Config.language).toBe("en")
        expect(Config.decimalSeparator).toBe(false)
        expect(Config.accents).toBe(false)
    })
})
