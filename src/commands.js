import { Checks } from "./checks.js"
import { Config, resetConfig, saveConfig } from "./config.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

/** @type {import("./values.js").CommandsNames[]} */
export const COMMANDS_NAMES = ["config", "exit", "start", "review", "history", "change"]

export const Commands = {
    process(raw = "") {
        if (raw.length == 0 || raw[0] != "/") {
            return null
        }

        const parts = Writing.noAccents(raw.slice(1).toLowerCase()).split(" ")
        const cmd = parts[0] ?? ""
        const arg = Commands.parseBool(parts[1] ?? "")
        const canonical = Commands.resolveCmd(cmd)
        const cmds = Commands.listCmds

        if (canonical == null) {
            const suggestion = Commands.suggestCmd(cmd)

            if (suggestion.type == "suggestion") {
                let answer = Ui.confirm(
                    tr("commands.commandSuggestion", { suggestion: suggestion.canonical }),
                    tr("commands.commandSuggestionExp", {
                        command: cmd,
                        suggestion: suggestion.canonical,
                        distance: suggestion.distance,
                    })
                )
                if (answer) {
                    return Commands.process(`/${suggestion.canonical} ${parts[1]}`)
                }
                return null
            }

            Ui.error(tr("commands.invalidCommand"), tr("commands.invalidCommandExp", { command: cmd }))
            return null
        }

        const command = cmds[canonical]
        if (command == undefined) {
            return null
        }

        return command.action(arg, parts)
    },

    levenshtein(source = "", target = "") {
        if (source == target) {
            return 0
        }

        if (source.length == 0) {
            return target.length
        }

        if (target.length == 0) {
            return source.length
        }

        const rows = target.length + 1
        const cols = source.length + 1
        const matrix = Array.from({ length: rows }, () => Array(cols).fill(0))

        for (let row = 0; row < rows; row++) {
            matrix[row][0] = row
        }

        for (let col = 0; col < cols; col++) {
            matrix[0][col] = col
        }

        for (let row = 1; row < rows; row++) {
            for (let col = 1; col < cols; col++) {
                const cost = source[col - 1] == target[row - 1] ? 0 : 1
                const deletion = matrix[row - 1][col] + 1
                const insertion = matrix[row][col - 1] + 1
                const substitution = matrix[row - 1][col - 1] + cost

                matrix[row][col] = Math.min(deletion, insertion, substitution)
            }
        }

        return matrix[rows - 1][cols - 1]
    },

    suggestCmd(typed = "") {
        const LIMIT = 3
        const cmds = Commands.listCmds
        const keys = Object.keys(cmds)
        let best = "",
            lowerDist = Infinity,
            candidates = []

        keys.forEach(key => {
            candidates = [key, ...cmds[key].variations]

            candidates.forEach(candidate => {
                let dist = Commands.levenshtein(typed, candidate)
                if (dist < lowerDist) {
                    lowerDist = dist
                    best = key
                }
            })
        })

        if (lowerDist <= LIMIT) {
            return { type: lowerDist == 0 ? "exact" : "suggestion", canonical: best, distance: lowerDist }
        }
        return { type: "unknown", canonical: "", distance: -1 }
    },

    searchCmds(term = "") {
        if (term == "") {
            return []
        }

        const cmds = Commands.listCmds
        const keys = Object.keys(cmds)
        const results = []
        let candidates = []

        keys.forEach(key => {
            const cmd = cmds[key]
            if (cmd == undefined) {
                return
            }
            candidates = [key, cmd.short, cmd.long, ...cmd.variations]

            candidates.forEach(candidate => {
                if (Writing.noAccents(candidate.toLowerCase()).includes(Writing.noAccents(term.toLowerCase()))) {
                    results.push(key)
                }
            })
        })

        return results
    },

    get listCmds() {
        return {
            help: {
                short: tr("commands.shortHelp"),
                long: tr("commands.longHelp"),
                variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"],
                action(arg, parts) {
                    return Commands.help(parts[1])
                },
            },
            search: {
                short: tr("commands.shortSearch"),
                long: tr("commands.longSearch"),
                variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
                action(arg, parts) {
                    return Commands.searchHelp(parts[1])
                },
            },
            shortcuts: {
                short: tr("commands.shortShortcuts"),
                long: tr("commands.longShortcuts"),
                variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"],
                action(arg, parts) {
                    return Commands.shortcuts(parts[1])
                },
            },
            about: {
                short: tr("commands.shortAbout"),
                long: tr("commands.longAbout"),
                variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
                action() {
                    return Commands.about
                },
            },
            config: {
                short: tr("commands.shortConfig"),
                long: tr("commands.longConfig"),
                variations: ["config", "configuracoes", "conf", "settings", "cfg"],
                action(arg, parts) {
                    if (parts[1] != undefined) {
                        if (Checks.isConfigKey(parts[1])) {
                            return Commands.change(parts[1], arg)
                        }
                        Ui.error(tr("commands.invalidSetting"), tr("commands.invalidSettingExp", { setting: parts[1] }))
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
                action() {
                    resetConfig()
                    Ui.warning(tr("commands.resetConfirm"))
                    return null
                },
            },
            start: {
                short: tr("commands.shortStart"),
                long: tr("commands.longStart"),
                variations: ["inicio", "start", "home", "menu", "voltar", "back"],
                action() {
                    State.type = "start"
                    return "start"
                },
            },
            review: {
                short: tr("commands.shortReview"),
                long: tr("commands.longReview"),
                variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
                action() {
                    State.type = "review"
                    return "review"
                },
            },
            change: {
                short: tr("commands.shortChange"),
                long: tr("commands.longChange"),
                variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
                action() {
                    State.type = "change"
                    return "change"
                },
            },
            history: {
                short: tr("commands.shortHistory"),
                long: tr("commands.longHistory"),
                variations: ["historico", "history", "hist"],
                action() {
                    State.type = "history"
                    return "history"
                },
            },
            version: {
                short: tr("commands.shortVersion"),
                long: tr("commands.longVersion"),
                variations: ["versao", "version", "vers", "v"],
                action() {
                    return Commands.version
                },
            },
            unicode: {
                short: tr("commands.shortUnicode"),
                long: tr("commands.longUnicode"),
                variations: ["unicode", "uni"],
                action(arg) {
                    return Commands.change("unicode", arg)
                },
            },
            accents: {
                short: tr("commands.shortAccents"),
                long: tr("commands.longAccents"),
                variations: ["acentos", "accents", "acento", "accent"],
                action(arg) {
                    return Commands.change("accents", arg)
                },
            },
            explain: {
                short: tr("commands.shortExplain"),
                long: tr("commands.longExplain"),
                variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"],
                action(arg) {
                    return Commands.change("explanations", arg)
                },
            },
            capitalize: {
                short: tr("commands.shortCapitalize"),
                long: tr("commands.longCapitalize"),
                variations: [
                    "capitalizar",
                    "capitalizadas",
                    "capitalize",
                    "capitalized",
                    "cap",
                    "capitalise",
                    "capitalised",
                ],
                action(arg) {
                    return Commands.change("capitalized", arg)
                },
            },
            uppercase: {
                short: tr("commands.shortUppercase"),
                long: tr("commands.longUppercase"),
                variations: ["maiuscula", "uppercase", "upper"],
                action(arg) {
                    return Commands.change("uppercase", arg)
                },
            },
            lowercase: {
                short: tr("commands.shortLowercase"),
                long: tr("commands.longLowercase"),
                variations: ["minuscula", "lowercase", "lower"],
                action(arg) {
                    return Commands.change("lowercase", arg)
                },
            },
            separator: {
                short: tr("commands.shortSeparator"),
                long: tr("commands.longSeparator"),
                variations: ["decimal", "separador", "separator", "sep"],
                action(arg) {
                    return Commands.change("decimalSeparator", arg)
                },
            },
            multiples: {
                short: tr("commands.shortMultiples"),
                long: tr("commands.longMultiples"),
                variations: ["multiplos", "multiplo", "multiples", "multi"],
                action(arg) {
                    return Commands.change("simpleMulti", arg)
                },
            },
            confirm: {
                short: tr("commands.shortConfirm"),
                long: tr("commands.longConfirm"),
                variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
                action(arg) {
                    return Commands.change("inputConfirm", arg)
                },
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
                action(arg) {
                    return Commands.change("outputConfirm", arg)
                },
            },
            errors: {
                short: tr("commands.shortErrors"),
                long: tr("commands.longErrors"),
                variations: ["erros", "erro", "errors", "error", "err"],
                action(arg) {
                    return Commands.change("errors", arg)
                },
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
                action(arg) {
                    return Commands.change("showFunction", arg)
                },
            },
            degrees: {
                short: tr("commands.shortDegrees"),
                long: tr("commands.longDegrees"),
                variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
                action(arg) {
                    return Commands.change("degrees", arg)
                },
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
                action(arg, parts) {
                    let target = parts[1] != undefined ? parts[1] : parts[0]
                    target = Writing.noAccents(Writing.lowercase(target))

                    // Português
                    // BR
                    if (["br", "pt-br", "ptbr", "brasileiro", "brazilian", "brasil", "brazil"].includes(target)) {
                        changeLanguage("pt-br")
                    }

                    // PT
                    else if (["pt", "pt-pt", "ptpt", "portugues", "portuguese", "portugal"].includes(target)) {
                        changeLanguage("pt-pt")
                    }

                    // Inglês
                    // US
                    else if (["en", "en-us", "enus", "americano", "american", "eua", "usa"].includes(target)) {
                        changeLanguage("en-us")
                    }

                    // GB
                    else if (
                        ["gb", "en-gb", "engb", "ingles", "english", "britanico", "british", "uk"].includes(target)
                    ) {
                        changeLanguage("en-gb")
                    }

                    // Espanhol
                    // 419
                    else if (["es", "es-419", "espanol"].includes(target)) {
                        changeLanguage("es-419")
                    }

                    // ES
                    else if (["es-es"].includes(target)) {
                        changeLanguage("es-es")
                    }

                    // Erro — só mostra se o utilizador tentou passar um argumento explícito
                    else if (parts[1] != undefined) {
                        Ui.error(
                            tr("commands.invalidLanguage"),
                            "“" + target + "” " + tr("commands.noteInvalidLanguage")
                        )
                    }

                    return null
                },
            },
            debug: {
                short: tr("commands.shortDebug"),
                long: tr("commands.longDebug"),
                variations: ["debug", "dbg"],
                action(arg) {
                    return Commands.change("debug", arg)
                },
            },
            exit: {
                short: tr("commands.shortExit"),
                long: tr("commands.longExit"),
                variations: ["sair", "exit", "//", "ex", "out", "quit", "q", "fechar", "close"],
                action() {
                    State.type = "exit"
                    return "exit"
                },
            },
        }
    },

    resolveCmd(specific = "") {
        if (specific == "") {
            return null
        }

        const cmds = Commands.listCmds
        const cmdKeys = Object.keys(cmds)
        let canonical = specific

        cmdKeys.forEach(key => {
            const cmd = cmds[key]
            if (cmd != undefined && cmd.variations.includes(specific)) {
                canonical = key
            }
        })

        return cmds[canonical] != undefined ? canonical : null
    },

    parseBool(text = "") {
        if (["true", "1", "sim", "yes", "on", "ativo", "enable", "enabled", "ligar", "ativar"].includes(text)) {
            return true
        }
        if (
            ["false", "0", "nao", "no", "off", "inativo", "disable", "disabled", "desligar", "desativar"].includes(text)
        ) {
            return false
        }
        return undefined
    },

    help(specific = "") {
        const cmds = Commands.listCmds

        if (specific != "") {
            const canonical = Commands.resolveCmd(specific)

            if (canonical != null) {
                const cmd = cmds[canonical]
                if (cmd != undefined) {
                    const shortList = [canonical, ...cmd.variations].join(", ")
                    Ui.display("“/" + canonical + "” — " + cmd.long + "\n" + tr("commands.variations") + shortList)
                }
                return null
            }

            Ui.error(tr("commands.unknownCommand"), "“/" + specific + "” " + tr("commands.invalidCommandExp"))
            return null
        }

        const key = Object.keys(cmds)
        const total = Math.ceil(key.length / 5)
        let page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            const start = (page - 1) * 5
            const end = Math.min(start + 5, key.length)
            let menu = `=== ${tr("commands.help")} ===\n${tr("commands.page")} ${String(page)}/${String(total)}`

            for (let i = start; i < end; i++) {
                let aliases = [key[i], ...cmds[key[i]].variations].join(", ")
                menu += "\n/" + key[i] + " — " + cmds[key[i]].short + "\n  ↳ " + aliases
            }

            menu += `\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`

            answer = Ui.range(menu, "", 0, 9, 0, true)

            if (answer == 8) {
                page--
            } else if (answer == 9) {
                page++
            }
        } while (answer != 0)

        return null
    },

    searchHelp(term = "") {
        if (term == "") {
            Ui.error(tr("commands.emptySearch"), tr("commands.usageSearch"))
            return null
        }

        term = Writing.noAccents(term.toLowerCase())

        const results = Commands.searchCmds(term)
        const cmds = Commands.listCmds

        if (results.length == 0) {
            Ui.warning(tr("commands.noCommand") + "“" + term + "”")
            return null
        }

        const total = Math.ceil(results.length / 5)
        let page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            const start = (page - 1) * 5
            const end = Math.min(start + 5, results.length)
            let menu =
                "=== " +
                tr("commands.search") +
                "“" +
                term +
                "” ===\n" +
                String(results.length) +
                " " +
                tr("commands.resultsSearch") +
                String(page) +
                "/" +
                String(total) +
                "\n"

            for (let i = start; i < end; i++) {
                menu += "\n/" + results[i] + " — " + cmds[results[i]].short
            }

            menu +=
                "\n----------------\n" +
                "8 = " +
                tr("commands.previous") +
                " | 9 = " +
                tr("commands.next") +
                " | 0 = " +
                tr("commands.back")

            answer = Ui.range(menu, "", 0, 9, 0, true)

            if (answer == 8) {
                page--
            } else if (answer == 9) {
                page++
            }
        } while (answer != 0)

        return null
    },

    shortcuts(specific = "") {
        if (specific == "") {
            Ui.error(tr("commands.commandNotProvided"), tr("commands.usageShortcuts"))
            return null
        }

        const cmds = Commands.listCmds
        const canonical = Commands.resolveCmd(specific)

        if (canonical == null) {
            Ui.error(tr("commands.unknownCommand"), "“/" + specific + "” " + tr("commands.invalidCommandExp"))
            return null
        }

        const all = cmds[canonical].variations
        const list = all
            .map(v => {
                return "/" + v
            })
            .join("\n")

        Ui.display(tr("commands.commandVariations") + "“/" + canonical + "”:\n" + list)
        return null
    },

    get about() {
        Ui.display(
            "====================================================" +
                "\n" +
                tr("commands.title") +
                " — " +
                VERSION +
                "\n" +
                tr("commands.author") +
                "Adriano Lima" +
                "\n" +
                tr("commands.repository") +
                "github.com/C4Adriano/analisador-funcoes-matematicas" +
                "\n" +
                tr("commands.copyright") +
                " © Adriano Lima 2025 — 2026" +
                "\n" +
                "===================================================="
        )
        return null
    },

    get version() {
        Ui.display(
            "====================================================" +
                "\n" +
                tr("commands.title") +
                " — " +
                VERSION +
                "\n" +
                tr("commands.copyright") +
                " © Adriano Lima 2025 — 2026" +
                "\n" +
                "===================================================="
        )
        return null
    },

    /**
     * @param {import("./config.js").ConfigKey} name
     * @param {import("./config.js").ConfigType} value
     */
    change(name = "", value = false) {
        const currentValue = Config[name]

        if (currentValue == undefined) {
            Ui.error("[Commands.change] Configuração inexistente.", `“${name}” não existe em Config.`, true)
            return null
        }

        if (typeof currentValue == "boolean" && value == undefined) {
            Config[name] = !currentValue
        } else if (value != undefined && typeof currentValue == typeof value) {
            Config[name] = value
        } else {
            Ui.error("[Commands.change] Valor inválido.", "Esta configuração não suporta alternância simples.", true)
            return null
        }

        if (name == "capitalized" && Config.capitalized) {
            Config.uppercase = false
            Config.lowercase = false
        } else if (name == "uppercase" && Config.uppercase) {
            Config.capitalized = false
            Config.lowercase = false
        } else if (name == "lowercase" && Config.lowercase) {
            Config.capitalized = false
            Config.uppercase = false
        }

        saveConfig()
        Ui.warning(Writing.configItem(`${tr("commands.changed")} “${name}”`, name))

        return null
    },

    get names() {
        return COMMANDS_NAMES
    },
}
