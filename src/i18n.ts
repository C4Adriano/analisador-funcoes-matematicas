import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Ui } from "./ui.js"

import enGB from "./JSON/i18n/en-GB.json" with { type: "json" }
import enUS from "./JSON/i18n/en-US.json" with { type: "json" }
import es419 from "./JSON/i18n/es-419.json" with { type: "json" }
import esES from "./JSON/i18n/es-ES.json" with { type: "json" }
import ptBR from "./JSON/i18n/pt-BR.json" with { type: "json" }
import ptPT from "./JSON/i18n/pt-PT.json" with { type: "json" }

const dictionaries = {
        /**
         * Português (Brasil).
         */
        "pt-br": ptBR,

        /**
         * Português (Portugal).
         */
        "pt-pt": ptPT,

        /**
         * Inglês (Estados Unidos).
         */
        "en-us": enUS,

        /**
         * Inglês (Reino Unido).
         */
        "en-gb": enGB,

        /**
         * Espanhol (América Latina).
         */
        "es-419": es419,

        /**
         * Espanhol (Espanha).
         */
        "es-es": esES,
    },
    FALLBACK_DICT = ptBR,
    FALLBACK_CHAIN: Partial<Record<keyof typeof dictionaries, (keyof typeof dictionaries)[]>> = {
        "en-gb": ["en-us"],
        "es-es": ["es-419"],
    }

/**
 * Gera, recursivamente, a união de todas as chaves em _dot-notation_ de um objeto de traduções.
 * @template T - Tipo.
 * @remarks `Array` são excluídos da recursão (viram `never`), já que o dicionário de i18n não deve conter listas.
 * @group i18n
 * @since v6.6.2
 */
type PathsOf<T> = T extends Str
    ? never
    : {
          [K in keyof T & Str]: T[K] extends Str
              ? K
              : T[K] extends readonly unknown[]
                ? never
                : PathsOf<T[K]> extends never
                  ? never
                  : `${K}.${PathsOf<T[K]>}`
      }[keyof T & Str]

/**
 * União de todas as chaves de tradução válidas, derivada de `pt-BR.json` (dicionário master).
 * @remarks Como {@link https://github.com/C4Adriano | `sync_i18n.py`} garante paridade de chaves entre todos os locales, basta gerar o tipo a partir do master.
 * @group i18n
 * @since v6.6.2
 */
type TranslationKey = PathsOf<typeof ptBR>

/**
 * Navega um objeto de dicionário por uma chave em _dot-notation_.
 * @param dict - Dicionário a navegar.
 * @param key - Chave em _dot-notation_. (Ex.: `errors.error001`).
 * @returns O texto encontrado, ou `null` se a chave não existir nesse dicionário.
 * @group i18n
 * @since v6.3.0
 */
const resolveKey = (dict: Record<Str, unknown>, key: Str): Str | null => {
        const raw = key
            .split(".")
            .reduce<unknown>(
                (obj, part) =>
                    typeof obj !== "object" || obj == null ? undefined : (obj as Record<Str, unknown>)[part],
                dict
            )
        return Checks.isValidText(raw) ? raw : null
    },
    /**
     * Retorna o texto no idioma configurado, a partir de uma chave em _dot-notation_.
     * @param key - Chave do texto. (Ex.: `main.welcome.title`).
     * @param params - Valores para interpolação de _placeholders_. (Ex.: `{ value: 5 }`).
     * @returns Texto no idioma configurado, no _fallback_ `pt-BR`, ou a própria chave em último caso.
     * @remarks Se a chave não existir no idioma ativo, cai automaticamente para `pt-BR` antes de desistir.
     * @group i18n
     * @since v6.2.0
     */
    tr = (key: TranslationKey, params?: Record<Str, Value>): Str => {
        const dict = dictionaries[Config.language]

        let raw = resolveKey(dict, key)

        const fallbackLanguages = FALLBACK_CHAIN[Config.language]
        if (raw == null && fallbackLanguages)
            for (const lang of fallbackLanguages) {
                raw = resolveKey(dictionaries[lang], key)
                if (raw != null) break
            }
        if (raw == null && dict !== FALLBACK_DICT) raw = resolveKey(FALLBACK_DICT, key)
        if (raw == null) return key

        return params ? Object.entries(params).reduce((str, [k, v]) => str.split(`{${k}}`).join(String(v)), raw) : raw
    },
    /**
     * Retorna o `array` de opções no idioma configurado.
     * @param keys - `Array` de chaves.
     * @returns `Array` no idioma configurado.
     * @group i18n
     * @since v6.2.0
     */
    trArr = (keys: TranslationKey[] = []): Str[] => keys.map(key => tr(key)),
    /**
     * Altera o idioma do programa, ajustando as configurações relacionadas (como {@link Config.accents} e {@link Config.decimalSeparator}).
     * @param language - Idioma.
     * @group i18n
     * @since v6.2.0
     */
    changeLanguage = (language: Language = "pt-br"): void => {
        if (Config.language == language) Ui.notifyOptions(tr("commands.languageAlready"), { type: "warning" })
        else if (confirm(tr("i18n.confirmChangeLanguage", { language }))) {
            if (["pt-br", "pt-pt", "es-419", "es-es"].includes(language)) {
                Config.decimalSeparator = true
                Config.accents = true
            } else {
                Config.decimalSeparator = false
                Config.accents = false
            }

            Config.language = language
            Config.save()
        }
    }

export { changeLanguage, tr, trArr }
export type { TranslationKey }
