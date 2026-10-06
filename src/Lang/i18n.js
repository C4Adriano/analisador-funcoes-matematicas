import { Config } from "../Core/config.js"
import enGB from "./i18n/en-GB.json" with { type: "json" }
import enUS from "./i18n/en-US.json" with { type: "json" }
import es419 from "./i18n/es-419.json" with { type: "json" }
import esES from "./i18n/es-ES.json" with { type: "json" }
import ptBR from "./i18n/pt-BR.json" with { type: "json" }
import ptPT from "./i18n/pt-PT.json" with { type: "json" }
const dictionaries = Object.freeze({ "pt-br": ptBR, "pt-pt": ptPT, "en-us": enUS, "en-gb": enGB, "es-419": es419, "es-es": esES }),
    COMMA_DECIMAL_LANGUAGES = new Set(["pt-br", "pt-pt", "es-419", "es-es"])
export function changeLanguage(language = "pt-br") {
    if (Config.language === language) return "same"
    if (!confirm(tr("i18n.confirmChangeLanguage", { language }))) return "notChange"
    const useComma = COMMA_DECIMAL_LANGUAGES.has(language)
    Config.decimalSeparator = useComma ? "comma" : "dot"
    Config.showAccents = useComma ? "on" : "off"
    Config.language = language
    Config.save()
    return "changed"
}
const trCache = new Map()
export function tr(key, params) {
    const cacheKey = `${Config.language}:${key}`
    let raw = trCache.get(cacheKey)
    if (raw == null) {
        const resolved = key.split(".").reduce((obj, part) => (typeof obj !== "object" || obj == null ? null : obj[part]), dictionaries[Config.language])
        if (typeof resolved !== "string") return key
        trCache.set(cacheKey, resolved)
        raw = resolved
    }
    return params ? Object.entries(params).reduce((str, [k, v]) => str.split(`{${k}}`).join(String(v)), raw) : raw
}
