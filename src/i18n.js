import { Config, saveConfig } from "./config.js"
export function tr(pt = "", en = "") {
    if (en == "" || Config.language == "pt" || Config.language == "pt-br") {
        return pt
    } else if (pt == "" || Config.language == "en") {
        return en
    }
    return pt
}
export function trArr(pairs = [["", ""]]) {
    return pairs.map(pair => tr(pair[0], pair[1]))
}
export function changeLanguage(language) {
    if (confirm(`${tr("Tu queres alterar a língua para", "Do you want to change the language to")}: “${language}”?`)) {
        if (language == "pt") {
            Config.decimalSeparator = true
            Config.accents = true
        } else if (language == "en") {
            Config.decimalSeparator = false
            Config.accents = false
        }
        Config.language = language
        saveConfig()
    }
}
