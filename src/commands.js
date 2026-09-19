import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

/** @type {CommandsNames[]} */ export const COMMANDS_NAMES = ["config", "exit", "start", "review", "history", "change"]

export const Commands = {
    process: (raw = "") => {
        if (raw.length == 0 || raw[0] != "/") return null

        const parts = Writing.noAccents(raw.slice(1).toLowerCase()).split(" "),
            cmd = parts[0] ?? "",
            arg = Commands.parseBool(parts[1] ?? ""),
            canonical = Commands.resolveCmd(cmd),
            cmds = Commands.listCmds

        if (canonical == null) {
            const suggestion = Commands.suggestCmd(cmd)

            if (suggestion.type == "suggestion") {
                if (
                    Ui.notifyOptions(tr("commands.commandSuggestion", { suggestion: suggestion.canonical }), {
                        explanation: tr("commands.commandSuggestionExp", {
                            command: cmd,
                            suggestion: suggestion.canonical,
                            distance: suggestion.distance,
                        }),
                        type: "confirm",
                    })
                )
                    return Commands.process(`/${suggestion.canonical} ${parts[1]}`)
                return null
            }

            Ui.notifyOptions(tr("commands.invalidCommand"), {
                explanation: tr("commands.invalidCommandExp", { command: cmd }),
                type: "error",
            })
            return null
        }

        return cmds[canonical]?.action(arg, parts) ?? null
    },

    levenshtein: (source = "", target = "") => {
        if (source == target) return 0
        if (source.length == 0) return target.length
        if (target.length == 0) return source.length

        const rows = target.length + 1,
            cols = source.length + 1,
            /** @type {NumericMatrix} */ matrix = Array.from({ length: rows }, (_, row) =>
                Array.from({ length: cols }, (__, col) => (row == 0 ? col : col == 0 ? row : 0))
            )

        for (let row = 1; row < rows; row++) {
            const currentRow = matrix[row],
                previousRow = matrix[row - 1]

            if (!currentRow || !previousRow) continue

            for (let col = 1; col < cols; col++) {
                const cost = source[col - 1] == target[row - 1] ? 0 : 1,
                    deletion = (previousRow[col] ?? 0) + 1,
                    insertion = (currentRow[col - 1] ?? 0) + 1,
                    substitution = (previousRow[col - 1] ?? 0) + cost

                currentRow[col] = Math.min(deletion, insertion, substitution)
            }
        }

        return matrix[rows - 1]?.[cols - 1] ?? 0
    },

    suggestCmd: (typed = "") => {
        const cmds = Commands.listCmds
        let best = "",
            lowerDist = Infinity

        Object.entries(cmds).forEach(([key, cmd]) => {
            ;[key, ...cmd.variations].forEach(candidate => {
                const dist = Commands.levenshtein(typed, candidate)
                if (dist < lowerDist) {
                    lowerDist = dist
                    best = key
                }
            })
        })

        if (lowerDist <= 3)
            return { type: lowerDist == 0 ? "exact" : "suggestion", canonical: best, distance: lowerDist }
        return { type: "unknown", canonical: "", distance: -1 }
    },

    searchCmds: (term = "") => {
        if (term == "") return []

        const cmds = Commands.listCmds,
            normalizedTerm = Writing.noAccents(Writing.lowercase(term))

        return Object.keys(cmds).filter(key => {
            const cmd = cmds[key]
            if (cmd == null) return false

            return [key, cmd.short, cmd.long, ...cmd.variations].some(candidate =>
                Writing.noAccents(Writing.lowercase(candidate)).includes(normalizedTerm)
            )
        })
    },

    get listCmds() {
        return {
            help: {
                short: tr("commands.shortHelp"),
                long: tr("commands.longHelp"),
                variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"],
                action: (_, parts) => Commands.help(parts[1]),
            },
            search: {
                short: tr("commands.shortSearch"),
                long: tr("commands.longSearch"),
                variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
                action: (_, parts) => Commands.searchHelp(parts[1]),
            },
            shortcuts: {
                short: tr("commands.shortShortcuts"),
                long: tr("commands.longShortcuts"),
                variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"],
                action: (_, parts) => Commands.shortcuts(parts[1]),
            },
            about: {
                short: tr("commands.shortAbout"),
                long: tr("commands.longAbout"),
                variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
                action: () => Commands.about,
            },
            config: {
                short: tr("commands.shortConfig"),
                long: tr("commands.longConfig"),
                variations: ["config", "configuracoes", "conf", "settings", "cfg"],
                action: (arg, parts) => {
                    if (parts[1] != null) {
                        if (Checks.isConfigKey(parts[1])) return Commands.change(parts[1], arg)

                        Ui.notifyOptions(tr("commands.invalidSetting"), {
                            explanation: tr("commands.invalidSettingExp", { setting: parts[1] }),
                            type: "error",
                        })
                        return null
                    }
                    State.type = "config"
                    return "config"
                },
            },
            reset: {
                short: tr("commands.shortReset"),
                long: tr("commands.longReset"),
                variations: ["resetar", "reset", "restaurar", "restore"],
                action: () => {
                    Config.reset()
                    Ui.notifyOptions(tr("commands.resetConfirm"), { type: "warning" })
                    return null
                },
            },
            start: {
                short: tr("commands.shortStart"),
                long: tr("commands.longStart"),
                variations: ["inicio", "start", "home", "menu", "voltar", "back"],
                action: () => {
                    State.type = "start"
                    return "start"
                },
            },
            review: {
                short: tr("commands.shortReview"),
                long: tr("commands.longReview"),
                variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
                action: () => {
                    State.type = "review"
                    return "review"
                },
            },
            change: {
                short: tr("commands.shortChange"),
                long: tr("commands.longChange"),
                variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
                action: () => {
                    State.type = "change"
                    return "change"
                },
            },
            history: {
                short: tr("commands.shortHistory"),
                long: tr("commands.longHistory"),
                variations: ["historico", "history", "hist"],
                action: () => {
                    State.type = "history"
                    return "history"
                },
            },
            version: {
                short: tr("commands.shortVersion"),
                long: tr("commands.longVersion"),
                variations: ["versao", "version", "vers", "v"],
                action: () => Commands.version,
            },
            unicode: {
                short: tr("commands.shortUnicode"),
                long: tr("commands.longUnicode"),
                variations: ["unicode", "uni"],
                action: arg => Commands.change("unicode", arg),
            },
            accents: {
                short: tr("commands.shortAccents"),
                long: tr("commands.longAccents"),
                variations: ["acentos", "accents", "acento", "accent"],
                action: arg => Commands.change("accents", arg),
            },
            explain: {
                short: tr("commands.shortExplain"),
                long: tr("commands.longExplain"),
                variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"],
                action: arg => Commands.change("explanations", arg),
            },
            textcase: {
                short: tr("commands.shortTextCase"),
                long: tr("commands.longTextCase"),
                variations: [
                    "textcase",
                    "capitalizacao",
                    "capitalizar",
                    "capitalize",
                    "capitalized",
                    "capitalise",
                    "capitalised",
                    "cap",
                    "maiuscula",
                    "maiusculas",
                    "uppercase",
                    "upper",
                    "minuscula",
                    "minusculas",
                    "lowercase",
                    "lower",
                    "normal",
                ],
                action: (_, parts) => {
                    /** @type {TextCase[]} */ const TEXT_CASES = ["capitalized", "uppercase", "lowercase", "normal"],
                        target = parts[1] == null ? null : Writing.noAccents(Writing.lowercase(parts[1]))
                    /** @type {TextCase} */ let value

                    /** @type {Record<TextCase, string[]>} */ const TEXT_CASE_ALIASES = {
                        capitalized: [
                            "capitalizado",
                            "capitalizada",
                            "capitalize",
                            "capitalized",
                            "capitalise",
                            "capitalised",
                            "cap",
                        ],
                        uppercase: ["maiuscula", "maiusculas", "uppercase", "upper"],
                        lowercase: ["minuscula", "minusculas", "lowercase", "lower"],
                        normal: ["normal"],
                    }

                    if (target == null)
                        value = TEXT_CASES[(TEXT_CASES.indexOf(Config.textCase) + 1) % TEXT_CASES.length] ?? "normal"
                    else {
                        const match = /** @type {TextCase | undefined} */ (
                            Object.entries(TEXT_CASE_ALIASES).find(([, aliases]) => aliases.includes(target))?.[0]
                        )

                        if (match == null) {
                            Ui.notifyOptions(tr("commands.invalidSetting"), {
                                explanation: tr("commands.invalidSettingExp", { setting: target }),
                                type: "error",
                            })
                            return null
                        }

                        value = match
                    }

                    return Commands.change("textCase", value)
                },
            },
            separator: {
                short: tr("commands.shortSeparator"),
                long: tr("commands.longSeparator"),
                variations: ["decimal", "separador", "separator", "sep"],
                action: arg => Commands.change("decimalSeparator", arg),
            },
            multiples: {
                short: tr("commands.shortMultiples"),
                long: tr("commands.longMultiples"),
                variations: ["multiplos", "multiplo", "multiples", "multi"],
                action: arg => Commands.change("simpleMulti", arg),
            },
            confirm: {
                short: tr("commands.shortConfirm"),
                long: tr("commands.longConfirm"),
                variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
                action: arg => Commands.change("inputConfirm", arg),
            },
            confirmExit: {
                short: tr("commands.shortConfirmExit"),
                long: tr("commands.longConfirmExit"),
                variations: [
                    "confirmarSaida",
                    "confirmExit",
                    "confirmarsaida",
                    "confirmsaida",
                    "confirmexit",
                    "confsaida",
                    "confexit",
                ],
                action: arg => Commands.change("outputConfirm", arg),
            },
            errors: {
                short: tr("commands.shortErrors"),
                long: tr("commands.longErrors"),
                variations: ["erros", "erro", "errors", "error", "err"],
                action: arg => Commands.change("errors", arg),
            },
            function: {
                short: tr("commands.shortFunction"),
                long: tr("commands.longFunction"),
                variations: [
                    "funcao",
                    "mostrarfuncao",
                    "mostrarFuncao",
                    "function",
                    "showfunction",
                    "showFunction",
                    "func",
                    "fn",
                ],
                action: arg => Commands.change("showFunction", arg),
            },
            degrees: {
                short: tr("commands.shortDegrees"),
                long: tr("commands.longDegrees"),
                variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
                action: arg => Commands.change("degrees", arg),
            },
            language: {
                short: tr("commands.shortLanguage"),
                long: tr("commands.longLanguage"),
                variations: [
                    "lingua",
                    "language",
                    "lang",
                    "idioma",

                    // Português
                    "pt",
                    "pt-br",
                    "pt-pt",
                    "portugues",
                    "portuguese",
                    "brasileiro",
                    "brazilian",
                    "br",
                    "ptbr",

                    // Inglês
                    "en",
                    "en-us",
                    "en-gb",
                    "ingles",
                    "english",
                    "anglo",
                    "eua",
                    "usa",
                    "uk",

                    // Espanhol
                    "es",
                    "es-es",
                    "es-419",
                    "espanol",
                ],

                action: (_, parts) => {
                    /** @type {Record<Language, string[]>} */
                    const LANGUAGE_ALIASES = {
                        "pt-br": ["br", "pt-br", "ptbr", "brasileiro", "brazilian", "brasil", "brazil"],
                        "pt-pt": ["pt", "pt-pt", "ptpt", "portugues", "portuguese", "portugal"],
                        "en-us": ["en", "en-us", "enus", "americano", "american", "eua", "usa"],
                        "en-gb": ["gb", "en-gb", "engb", "ingles", "english", "britanico", "british", "uk"],
                        "es-419": ["es", "es-419", "espanol"],
                        "es-es": ["es-es"],
                    }
                    let target = parts[1] ?? parts[0]
                    target = Writing.noAccents(Writing.lowercase(target))

                    const entries = /** @type {[Language, string[]][]} */ (Object.entries(LANGUAGE_ALIASES))
                    const match = entries.find(([, aliases]) => aliases.includes(target))?.[0]

                    if (match != null) changeLanguage(match)
                    else if (parts[1] != null)
                        Ui.notifyOptions(tr("commands.invalidLanguage"), {
                            explanation: `"${target}" ${tr("commands.noteInvalidLanguage")}`,
                            type: "error",
                        })

                    return null
                },
            },
            exit: {
                short: tr("commands.shortExit"),
                long: tr("commands.longExit"),
                variations: ["sair", "exit", "//", "ex", "out", "quit", "q", "fechar", "close"],
                action: () => {
                    State.type = "exit"
                    return "exit"
                },
            },
        }
    },

    resolveCmd: (specific = "") => {
        if (specific == "") return null
        const cmds = Commands.listCmds,
            found = Object.entries(cmds).find(([_, cmd]) => cmd.variations.includes(specific))
        return found?.[0] ?? (specific in cmds ? specific : null)
    },

    parseBool: (text = "") =>
        ["true", "1", "sim", "yes", "on", "enable", "enabled", "ligar", "ativar"].includes(text)
            ? true
            : ["false", "0", "nao", "no", "off", "disable", "disabled", "desligar", "desativar"].includes(text)
              ? false
              : null,

    help: (specific = "") => {
        const cmds = Commands.listCmds

        if (specific != "") {
            const canonical = Commands.resolveCmd(specific)

            if (canonical == null) {
                Ui.notifyOptions(tr("commands.unknownCommand"), {
                    explanation: `“/${specific}” ${tr("commands.invalidCommandExp")}`,
                    type: "error",
                })
                return null
            }

            const cmd = cmds[canonical]
            if (cmd == null) return null

            const shortList = [canonical, ...cmd.variations].join(", ")
            Ui.notifyOptions(`“/${canonical}” — ${cmd.long}\n${tr("commands.variations")}${shortList}`)
            return null
        }

        const key = Object.keys(cmds),
            total = Math.ceil(key.length / 5)
        let page = 1,
            answer

        do {
            if (page < 1) page = 1
            if (page > total) page = total

            const start = (page - 1) * 5,
                end = Math.min(start + 5, key.length)
            let menu = `=== ${tr("commands.help")} ===\n${tr("commands.page")} ${String(page)}/${String(total)}`

            menu += key
                .slice(start, end)
                .map(name => `\n/${name} — ${cmds[name].short}\n ↳ ${[name, ...cmds[name].variations].join(", ")}`)
                .join("")

            menu += `\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`

            answer = Ui.rangeOptions(menu, { max: 9, commands: true })

            if (answer == 8) page--
            if (answer == 9) page++
        } while (answer != 0)

        return null
    },

    searchHelp: (term = "") => {
        if (term == "") {
            Ui.notifyOptions(tr("commands.emptySearch"), { explanation: tr("commands.usageSearch"), type: "error" })
            return null
        }

        term = Writing.noAccents(term.toLowerCase())

        const results = Commands.searchCmds(term),
            cmds = Commands.listCmds

        if (results.length == 0) {
            Ui.notifyOptions(`${tr("commands.noCommand")}“${term}”`, { type: "warning" })
            return null
        }

        const total = Math.ceil(results.length / 5)
        let page = 1,
            answer

        do {
            if (page < 1) page = 1
            if (page > total) page = total

            const start = (page - 1) * 5,
                end = Math.min(start + 5, results.length)
            let menu = `=== ${tr("commands.search")}“${term}” ===\n${String(results.length)} ${tr(
                "commands.resultsSearch"
            )}${String(page)}/${String(total)}\n`

            menu += results
                .slice(start, end)
                .map(name => `\n/${name} — ${cmds[name].short}`)
                .join("")

            menu += `\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`

            answer = Ui.rangeOptions(menu, { max: 9, commands: true })

            if (answer == 8) page--
            else if (answer == 9) page++
        } while (answer != 0)

        return null
    },

    shortcuts: (specific = "") => {
        if (specific == "") {
            Ui.notifyOptions(tr("commands.commandNotProvided"), {
                explanation: tr("commands.usageShortcuts"),
                type: "error",
            })
            return null
        }

        const cmds = Commands.listCmds,
            canonical = Commands.resolveCmd(specific)

        if (canonical == null) {
            Ui.notifyOptions(tr("commands.unknownCommand"), {
                explanation: `“/${specific}” ${tr("commands.invalidCommandExp")}`,
                type: "error",
            })
            return null
        }

        Ui.notifyOptions(
            `${tr("commands.commandVariations")}“/${canonical}”:\n${cmds[canonical].variations.map(v => `/${v}`).join("\n")}`
        )
        return null
    },

    get about() {
        Ui.notifyOptions(
            `==================================================\n` +
                `${tr("commands.title")} — ${VERSION}\n` +
                `${tr("commands.author")}Adriano Lima\n` +
                `${tr("commands.repository")}github.com/C4Adriano/analisador-funcoes-matematicas\n` +
                `${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
                `==================================================`
        )
        return null
    },

    get version() {
        Ui.notifyOptions(
            `==================================================\n` +
                `${tr("commands.title")} — ${VERSION}\n` +
                `${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
                `==================================================`
        )
        return null
    },

    /**
     * @template {import("./config.js").ConfigKey} K
     * @param {K} name
     * @param {import("./config.js").ConfigType[K]} value
     */
    change: (name, value) => {
        const currentValue = Config[name]

        if (currentValue == null) return null

        if (typeof currentValue == "boolean" && value == null) Object.assign(Config, { [name]: !currentValue })
        else if (value != null && typeof currentValue == typeof value) Object.assign(Config, { [name]: value })
        else return null

        Config.save()
        Ui.notifyOptions(Writing.configItem(`${tr("commands.changed")} “${name}”`, name), { type: "warning" })

        return null
    },

    get names() {
        return COMMANDS_NAMES
    },
}
