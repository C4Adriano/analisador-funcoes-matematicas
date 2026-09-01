import { Config, saveConfig } from "./config.js"
import { Ui } from "./ui.js"
import enGB from "./JSON/i18n/en-GB.json" with { type: "json" }
import enUS from "./JSON/i18n/en-US.json" with { type: "json" }
import es419 from "./JSON/i18n/es-419.json" with { type: "json" }
import esES from "./JSON/i18n/es-ES.json" with { type: "json" }
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" }
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" }
const dictionaries = {
    "pt-br": ptBR,
    "pt-pt": ptPT,
    "en-us": enUS,
    "en-gb": enGB,
    "es-419": es419,
    "es-es": esES,
}
const FALLBACK_DICT = ptBR
const FALLBACK_CHAIN = {
    "en-gb": ["en-us"],
    "es-es": ["es-419"],
}
function resolveKey(dict, key) {
    const raw = key.split(".").reduce((obj, part) => obj?.[part], dict)
    return typeof raw == "string" ? raw : undefined
}
export function tr(key, params) {
    const dict = dictionaries[Config.language] ?? dictionaries["pt-br"]
    let raw = resolveKey(dict, key)
    if (raw == undefined) {
        for (const lang of FALLBACK_CHAIN[Config.language] ?? []) {
            raw = resolveKey(dictionaries[lang], key)
            if (raw != undefined) {
                if (Config.debug) {
                    console.warn(`[i18n] Chave “${key}” ausente em “${Config.language}”, usando fallback “${lang}”.`)
                }
                break
            }
        }
    }
    if (raw == undefined && dict != FALLBACK_DICT) {
        raw = resolveKey(FALLBACK_DICT, key)
        if (raw != undefined && Config.debug) {
            console.warn(`[i18n] Chave “${key}” ausente em “${Config.language}”, usando fallback “pt-BR”.`)
        }
    }
    if (raw == undefined) {
        return key
    }
    return params ? Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw) : raw
}
export function trArr(keys = []) {
    return keys.map(key => tr(key))
}
export function changeLanguage(language = "pt-br") {
    if (Config.language == language) {
        Ui.warning(tr("commands.languageAlready"))
    } else if (confirm(tr("i18n.confirmChangeLanguage", { language: language }))) {
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
