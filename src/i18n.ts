/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config, saveConfig } from "./config.js"
import { Ui } from "./ui.js"

import type { Language, Text } from "./values.js"

import enGB from "./JSON/i18n/en-GB.json" with { type: "json" }
import enUS from "./JSON/i18n/en-US.json" with { type: "json" }
import es419 from "./JSON/i18n/es-419.json" with { type: "json" }
import esES from "./JSON/i18n/es-ES.json" with { type: "json" }
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" }
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" }

const dictionaries = {
    /** Português (Brasil). */
    "pt-br": ptBR,
    /** Português (Portugal). */
    "pt-pt": ptPT,
    /** Inglês (Estados Unidos). */
    "en-us": enUS,
    /** Inglês (Reino Unido). */
    "en-gb": enGB,
    /** Espanhol (América Latina). */
    "es-419": es419,
    /** Espanhol (Espanha). */
    "es-es": esES,
}

const FALLBACK_DICT = ptBR
const FALLBACK_CHAIN: Partial<Record<keyof typeof dictionaries, (keyof typeof dictionaries)[]>> = {
    "en-gb": ["en-us"],
    "es-es": ["es-419"],
}

/**
 * Gera, recursivamente, a união de todas as chaves em _dot-notation_ de um objeto de traduções.
 * @remarks `Array` são excluídos da recursão (viram `never`), já que o dicionário de i18n não deve conter listas.
 * @group i18n
 * @since v6.6.2
 */
type PathsOf<T> = T extends string
    ? never
    : {
          [K in keyof T & string]: T[K] extends string
              ? K
              : T[K] extends readonly unknown[]
                ? never
                : PathsOf<T[K]> extends never
                  ? never
                  : `${K}.${PathsOf<T[K]>}`
      }[keyof T & string]

/**
 * União de todas as chaves de tradução válidas, derivada de `pt-BR.json` (dicionário master).
 * @remarks Como {@link https://github.com/C4Adriano | `sync_i18n.py`} garante paridade de chaves entre todos os locales, basta gerar o tipo a partir do master.
 * @group i18n
 * @since v6.6.2
 */
export type TranslationKey = PathsOf<typeof ptBR>

/**
 * Navega um objeto de dicionário por uma chave em _dot-notation_.
 * @param dict - Dicionário a navegar.
 * @param key - Chave em _dot-notation_. (Ex.: `errors.error001`)
 * @returns O texto encontrado, ou `undefined` se a chave não existir nesse dicionário.
 * @group i18n
 * @since v6.3.0
 */
function resolveKey(dict: Record<string, any>, key: string): string | undefined {
    const raw = key.split(".").reduce<any>((obj, part) => obj?.[part], dict)
    return typeof raw == "string" ? raw : undefined
}

/**
 * Retorna o texto na língua configurada, a partir de uma chave em _dot-notation_.
 * @remarks Se a chave não existir no idioma ativo, cai automaticamente para `pt-BR` antes de desistir.
 * @param key - Chave do texto. (Ex.: `main.welcome.title`)
 * @param params - Valores para interpolação de _placeholders_. (Ex.: `{ value: 5 }`)
 * @returns Texto na língua configurada, no _fallback_ `pt-BR`, ou a própria chave em último caso.
 * @group i18n
 * @since v6.2.0
 */
export function tr(key: TranslationKey, params?: Record<string, string | number>): Text {
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

/**
 * Retorna o `array` de opções na língua configurada.
 * @param keys - `Array` de chaves.
 * @returns `Array` na língua configurada.
 * @group i18n
 * @since v6.2.0
 */
export function trArr(keys: TranslationKey[] = []): Text[] {
    return keys.map(key => tr(key))
}

/**
 * Altera a língua do programa, ajustando as configurações relacionadas (como {@link Config.accents} e {@link Config.decimalSeparator}).
 * @param language Língua.
 * @group i18n
 * @since v6.2.0
 */
export function changeLanguage(language: Language = "pt-br") {
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
