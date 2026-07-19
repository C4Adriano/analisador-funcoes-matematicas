/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config, saveConfig } from "./config.js"
import { Ui } from "./ui.js"

import type { DeepPartial, Language, Text } from "./values.js"

import enGB from "./JSON/i18n/en-GB.json" with { type: "json" }
import enUS from "./JSON/i18n/en-US.json" with { type: "json" }
import es419 from "./JSON/i18n/es-419.json" with { type: "json" }
import esES from "./JSON/i18n/es-ES.json" with { type: "json" }
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" }
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" }

const dictionaries = {
    "en-us": enUS,
    "en-gb": mergeDictionaries(enUS, enGB),
    "pt-br": ptBR,
    "pt-pt": mergeDictionaries(ptBR, ptPT),
    "es-419": es419,
    "es-es": mergeDictionaries(es419, esES),
}

const FALLBACK_DICT = ptBR // PT-BR é a base de segurança — deve estar sempre 100% completo

/**
 * [I18N] Navega um objeto de dicionário por uma chave em dot-notation
 * @param dict - Dicionário a navegar
 * @param key - Chave em dot-notation (ex.: "error.error001")
 * @returns O texto encontrado, ou undefined se a chave não existir nesse dicionário
 * @since v6.3.0
 */
function resolveKey(dict: Record<string, any>, key: string): string | undefined {
    const raw = key.split(".").reduce<any>((obj, part) => obj?.[part], dict)
    return typeof raw === "string" ? raw : undefined
}

/**
 * [I18N] Retorna o texto na língua configurada, a partir de uma chave em dot-notation
 * Se a chave não existir no idioma ativo, cai automaticamente para PT-BR antes de desistir
 * @param key - Chave do texto (ex.: "main.welcome.title")
 * @param params - Valores para interpolação de placeholders (ex.: { valor: 5 })
 * @returns Texto na língua configurada, no fallback PT-BR, ou a própria chave em último caso
 * @since v6.2.0
 */
export function tr(key: string, params?: Record<string, string | number>): Text {
    const dict = dictionaries[Config.language] ?? dictionaries["pt"]

    let raw = resolveKey(dict, key)

    if (raw === undefined && dict !== FALLBACK_DICT) {
        raw = resolveKey(FALLBACK_DICT, key)

        if (raw !== undefined && Config.debug) {
            console.warn(`[i18n] Chave "${key}" ausente em "${Config.language}", usando fallback PT-BR.`)
        }
    }

    if (raw === undefined) {
        return key
    }

    return params ? Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw) : raw
}

/**
 * [I18N] Retorna o array de opções na língua configurada
 * @param keys - Array de chaves
 * @returns Array na língua configurada
 * @since v6.2.0
 */
export function trArr(keys: string[] = []): Text[] {
    return keys.map(key => tr(key))
}

/**
 * [I18N] Combina um dicionário base com um conjunto de sobrescritas parciais,
 * mesclando recursivamente até o nível das strings (folhas do objeto)
 * @param base - Dicionário completo do idioma base (ex.: en.json)
 * @param overrides - Dicionário parcial só com as chaves que divergem (ex.: en-GB.json)
 * @returns Dicionário mesclado, com a mesma estrutura do base
 * @since v6.3.0
 */
function mergeDictionaries<T extends Record<string, any>>(base: T, overrides: DeepPartial<T>): T {
    const result: any = { ...base }

    for (const key in overrides) {
        const overrideValue = overrides[key]
        const baseValue = base[key]

        if (
            overrideValue !== null &&
            typeof overrideValue === "object" &&
            !Array.isArray(overrideValue) &&
            baseValue !== null &&
            typeof baseValue === "object"
        ) {
            result[key] = mergeDictionaries(baseValue, overrideValue)
        } else {
            result[key] = overrideValue
        }
    }

    return result
}

/**
 * [I18N] Altera a língua do programa, ajustando as configurações relacionadas (como acentos e separador decimal)
 * @param language Língua
 * @since v6.2.0
 */
export function changeLanguage(language: Language) {
    if (Config.language == language) {
        Ui.warning(tr("commands.languageAlready"))
        return
    }

    if (confirm(tr("i18n.confirmChangeLanguage", { language: language }))) {
        if (language == "pt-br" || language == "pt-pt" || language == "es-419" || language == "es-es") {
            Config.decimalSeparator = true
            Config.accents = true
        } else if (language == "en-us" || language == "en-gb") {
            Config.decimalSeparator = false
            Config.accents = false
        }

        Config.language = language
        saveConfig()
    }
}
