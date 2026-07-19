import { Config, saveConfig } from "./config.js"
import { Ui } from "./ui.js"
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
const FALLBACK_DICT = ptBR
function resolveKey(dict, key) {
    const raw = key.split(".").reduce((obj, part) => obj?.[part], dict)
    return typeof raw === "string" ? raw : undefined
}
export function tr(key, params) {
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
export function trArr(keys = []) {
    return keys.map(key => tr(key))
}
function mergeDictionaries(base, overrides) {
    const result = { ...base }
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
export function changeLanguage(language) {
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
