import { Checks } from "./checks.js";
import { Config } from "./config.js";
import { Ui } from "./ui.js";
import enGB from "./JSON/i18n/en-GB.json" with { type: "json" };
import enUS from "./JSON/i18n/en-US.json" with { type: "json" };
import es419 from "./JSON/i18n/es-419.json" with { type: "json" };
import esES from "./JSON/i18n/es-ES.json" with { type: "json" };
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" };
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" };
const dictionaries = {
    "pt-br": ptBR,
    "pt-pt": ptPT,
    "en-us": enUS,
    "en-gb": enGB,
    "es-419": es419,
    "es-es": esES,
}, FALLBACK_DICT = ptBR, FALLBACK_CHAIN = {
    "en-gb": ["en-us"],
    "es-es": ["es-419"],
};
const resolveKey = (dict, key) => {
    const raw = key
        .split(".")
        .reduce((obj, part) => typeof obj !== "object" || obj == null ? undefined : obj[part], dict);
    return Checks.isValidText(raw) ? raw : null;
}, tr = (key, params) => {
    const dict = dictionaries[Config.language];
    let raw = resolveKey(dict, key);
    const fallbackLanguages = FALLBACK_CHAIN[Config.language];
    if (raw == null && fallbackLanguages)
        for (const lang of fallbackLanguages) {
            raw = resolveKey(dictionaries[lang], key);
            if (raw != null)
                break;
        }
    if (raw == null && dict !== FALLBACK_DICT)
        raw = resolveKey(FALLBACK_DICT, key);
    if (raw == null)
        return key;
    return params ? Object.entries(params).reduce((str, [k, v]) => str.split(`{${k}}`).join(String(v)), raw) : raw;
}, trArr = (keys = []) => keys.map(key => tr(key)), changeLanguage = (language = "pt-br") => {
    if (Config.language == language)
        Ui.notifyOptions(tr("commands.languageAlready"), { type: "warning" });
    else if (confirm(tr("i18n.confirmChangeLanguage", { language }))) {
        if (["pt-br", "pt-pt", "es-419", "es-es"].includes(language)) {
            Config.decimalSeparator = true;
            Config.accents = true;
        }
        else {
            Config.decimalSeparator = false;
            Config.accents = false;
        }
        Config.language = language;
        Config.save();
    }
};
export { changeLanguage, tr, trArr };
