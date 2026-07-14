import { beforeEach, describe, expect, it } from "vitest"
import { Config, DEFAULT_CONFIG, loadConfig, resetConfig, saveConfig } from "../src/config.js"
import "./setup.js"

beforeEach(() => {
    localStorage.clear()
    Object.assign(Config, structuredClone(DEFAULT_CONFIG))
})

describe("Config / DEFAULT_CONFIG", () => {
    it("Config começa igual a DEFAULT_CONFIG", () => {
        expect(Config).toEqual(DEFAULT_CONFIG)
    })

    it("DEFAULT_CONFIG não é afetado por mudanças em Config (são clones independentes)", () => {
        Config.decimalPlaces = 99
        expect(DEFAULT_CONFIG.decimalPlaces).not.toBe(99)
    })
})

describe("saveConfig / loadConfig", () => {
    it("salva e recarrega uma configuração alterada", () => {
        Config.decimalPlaces = 6
        Config.degrees = "rad"
        saveConfig()

        // Simula reinício do app: volta Config para o padrão antes de carregar
        Object.assign(Config, structuredClone(DEFAULT_CONFIG))
        loadConfig()

        expect(Config.decimalPlaces).toBe(6)
        expect(Config.degrees).toBe("rad")
    })

    it("não altera Config quando não há nada salvo", () => {
        localStorage.clear()
        loadConfig()
        expect(Config).toEqual(DEFAULT_CONFIG)
    })

    it("descarta configuração salva de uma versão diferente", () => {
        localStorage.setItem("config", JSON.stringify({ decimalPlaces: 10 }))
        localStorage.setItem("configVersion", "0.0.1-versao-antiga")

        loadConfig()

        expect(Config.decimalPlaces).toBe(DEFAULT_CONFIG.decimalPlaces)
        expect(localStorage.getItem("config")).toBeNull()
    })

    it("ignora chaves com tipo incompatível ao carregar", () => {
        saveConfig() // grava a versão atual corretamente primeiro
        const saved = JSON.parse(localStorage.getItem("config") as string)
        saved.decimalPlaces = "não é um número" // tipo errado de propósito
        localStorage.setItem("config", JSON.stringify(saved))

        loadConfig()

        // decimalPlaces não deve ter sido sobrescrito por um valor de tipo errado
        expect(Config.decimalPlaces).toBe(DEFAULT_CONFIG.decimalPlaces)
    })

    it("ignora configuração corrompida (JSON inválido) sem lançar erro", () => {
        localStorage.setItem("config", "{ isso não é JSON válido")
        localStorage.setItem("configVersion", "qualquer")

        expect(() => loadConfig()).not.toThrow()
    })
})

describe("resetConfig", () => {
    it("restaura os valores padrão e limpa o localStorage", () => {
        Config.decimalPlaces = 1
        saveConfig()

        resetConfig()

        expect(Config).toEqual(DEFAULT_CONFIG)
        expect(localStorage.getItem("config")).toBeNull()
        expect(localStorage.getItem("configVersion")).toBeNull()
    })
})
