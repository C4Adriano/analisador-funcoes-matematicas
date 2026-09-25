import { isValidText } from "./checks.js";
import { Config } from "./config.js";
import { KEY_NOT_FOUND } from "./consts.js";
import enGB from "./JSON/i18n/en-GB.json" with { type: "json" };
import enUS from "./JSON/i18n/en-US.json" with { type: "json" };
import es419 from "./JSON/i18n/es-419.json" with { type: "json" };
import esES from "./JSON/i18n/es-ES.json" with { type: "json" };
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" };
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" };
const dictionaries = Object.freeze({ "pt-br": ptBR, "pt-pt": ptPT, "en-us": enUS, "en-gb": enGB, "es-419": es419, "es-es": esES }), COMMA_DECIMAL_LANGUAGES = new Set(["pt-br", "pt-pt", "es-419", "es-es"]);
function changeLanguage(language = "pt-br") {
    if (Config.language === language)
        return "same";
    if (!confirm(tr("i18n.confirmChangeLanguage", { language })))
        return "notChange";
    const useComma = COMMA_DECIMAL_LANGUAGES.has(language);
    Config.decimalSeparator = useComma;
    Config.accents = useComma;
    Config.language = language;
    Config.save();
    return "changed";
}
function isTrKey(value) {
    return isValidText(value) && resolveKey(ptBR, value) !== KEY_NOT_FOUND;
}
function resolveKey(dict, key) {
    const raw = key.split(".").reduce((obj, part) => (typeof obj !== "object" || obj == null ? undefined : obj[part]), dict);
    return typeof raw === "string" ? raw : KEY_NOT_FOUND;
}
const trCache = new Map();
function tr(key, params) {
    const cacheKey = `${Config.language}:${key}`;
    let raw = trCache.get(cacheKey);
    if (raw === undefined) {
        const resolved = resolveKey(dictionaries[Config.language], key);
        if (resolved === KEY_NOT_FOUND)
            return key;
        raw = resolved;
        trCache.set(cacheKey, raw);
    }
    return params ? Object.entries(params).reduce((str, [k, v]) => str.split(`{${k}}`).join(String(v)), raw) : raw;
}
function trArr(keys = []) {
    return keys.map(key => tr(key));
}
export { changeLanguage, isTrKey, tr, trArr };
