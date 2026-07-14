import { Config, saveConfig } from "./config.js"

import type { Language, Text } from "./values.js"

/**
 * [I18N] Retorna o texto na língua configurada
 * @param pt - Texto em português
 * @param en - Texto em inglês
 * @returns Texto na língua configurada
 * @since v6.2.0
 */
export function tr(pt: Text = "", en: Text = ""): Text {
    if (en == "" || Config.language == "pt" || Config.language == "pt-br") {
        return pt
    } else if (pt == "" || Config.language == "en") {
        return en
    }
    return pt
}

/**
 * [I18N] Retorna o array de opções na língua configurada
 * @param pairs - Array de pares [pt, en]
 * @returns Array na língua configurada
 * @since v6.2.0
 */
export function trArr(pairs: [Text, Text][] = [["", ""]]): Text[] {
    return pairs.map(pair => tr(pair[0], pair[1]))
}

/**
 * [I18N] Altera a língua do programa, ajustando as configurações relacionadas (como acentos e separador decimal)
 * @param language Língua
 * @since v6.2.0
 */
export function changeLanguage(language: Language) {
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
