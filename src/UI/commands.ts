import { Config, isConfigKey, type ConfigKey, type ConfigType } from "../Core/config.js"
import { State } from "../Core/state.js"
import { changeLanguage, tr } from "../Lang/i18n.js"
import { configItem, lowercase, noAccents } from "../Lang/writing.js"
import { VERSION } from "../version.js"
import { notify } from "./display.js"
import { rangeOptions } from "./ui.js"

function change<K extends ConfigKey>(name: K, value?: ConfigType[K] | null): null {
    const currentValue = Config[name]

    if (value == null && typeof currentValue === "boolean") Object.assign(Config, { [name]: !currentValue })
    else if (value != null && typeof currentValue === typeof value) Object.assign(Config, { [name]: value })
    else return null

    Config.save()
    notify(configItem(`${tr("commands.changed")} "${name}"`, name), { type: "warning" })

    return null
}

function help(specific: string): null {
    const cmds = listCmds()

    if (specific.trim() !== "") {
        const canonical = resolveCmd(specific, cmds)

        if (canonical == null) {
            notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" })
            return null
        }

        const cmd = cmds[canonical]
        if (cmd == null) return null

        const shortList = [canonical, ...cmd.variations].join(", ")
        notify(`“/${canonical}” — ${cmd.long}\n${tr("commands.variations")}${shortList}`)
        return null
    }

    const key = Object.keys(cmds),
        total = Math.ceil(key.length / 5)
    let page = 1,
        answer: number | CommandNames

    do {
        page = Math.min(Math.max(page, 1), total)

        answer = rangeOptions(
            `=== ${tr("commands.help")} ===\n${tr("commands.page")} ${page}/${total}${key
                .slice((page - 1) * 5, Math.min(page * 5, key.length))
                .map(name => `\n/${name} — ${cmds[name]!.short}\n ↳ ${[name, ...cmds[name]!.variations].join(", ")}`)
                .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
            { max: 9, commands: true },
        )

        page += answer === 8 ? -1 : answer === 9 ? 1 : 0
    } while (answer !== 0)

    return null
}

function listCmds(): Record<string, { short: string; long: string; variations: List<string>; action: (arg: boolean | null, parts: [cmd: string, argRaw: string]) => CommandNames | null }> {
    return {
        help: { short: tr("commands.shortHelp"), long: tr("commands.longHelp"), variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"], action: (_, [, argRaw]) => help(argRaw) },
        search: {
            short: tr("commands.shortSearch"),
            long: tr("commands.longSearch"),
            variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
            action: (_, [, argRaw]): null => {
                if (argRaw.trim() === "") {
                    notify(tr("commands.emptySearch"), { explanation: tr("commands.usageSearch"), type: "error" })
                    return null
                }

                const term = noAccents(lowercase(argRaw)),
                    cmds = listCmds(),
                    results = Object.keys(cmds).filter(key => {
                        const cmd = cmds[key]
                        return cmd != null && [key, cmd.short, cmd.long, ...cmd.variations].some(candidate => noAccents(lowercase(candidate)).includes(term))
                    })

                if (results.length === 0) {
                    notify(`${tr("commands.noCommand")}"${term}"`, { type: "warning" })
                    return null
                }

                const total = Math.ceil(results.length / 5)
                let page = 1,
                    answer: number | CommandNames

                do {
                    page = Math.min(Math.max(page, 1), total)

                    answer = rangeOptions(
                        `=== ${tr("commands.search")}"${term}" ===\n${results.length} ${tr("commands.resultsSearch")}${page}/${total}\n${results
                            .slice((page - 1) * 5, Math.min(page * 5, results.length))
                            .map(name => `\n/${name} — ${cmds[name]!.short}`)
                            .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
                        { max: 9, commands: true },
                    )

                    page += answer === 8 ? -1 : answer === 9 ? 1 : 0
                } while (answer !== 0)

                return null
            },
        },
        shortcuts: { short: tr("commands.shortShortcuts"), long: tr("commands.longShortcuts"), variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"], action: (_, [, argRaw]) => shortcuts(argRaw) },
        about: {
            short: tr("commands.shortAbout"),
            long: tr("commands.longAbout"),
            variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
            action: (): null => {
                notify(
                    `==================================================\n` +
                        `${tr("commands.title")} — ${VERSION}\n` +
                        `${tr("commands.author")}Adriano Lima\n` +
                        `${tr("commands.repository")}github.com/C4Adriano/analisador-funcoes-matematicas\n` +
                        `${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
                        `==================================================`,
                )
                return null
            },
        },
        config: {
            short: tr("commands.shortConfig"),
            long: tr("commands.longConfig"),
            variations: ["config", "configuracoes", "conf", "settings", "cfg"],
            action: (arg, [, argRaw]): "config" | null => {
                if (argRaw.trim() === "") {
                    State.menuChoice = "config"
                    return "config"
                }

                if (isConfigKey(argRaw)) return change(argRaw, arg ? "on" : "off")

                notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: argRaw }), type: "error" })
                return null
            },
        },
        reset: {
            short: tr("commands.shortReset"),
            long: tr("commands.longReset"),
            variations: ["resetar", "reset", "restaurar", "restore"],
            action: (): null => {
                Config.reset()
                notify(tr("commands.resetConfirm"), { type: "warning" })
                return null
            },
        },
        start: {
            short: tr("commands.shortStart"),
            long: tr("commands.longStart"),
            variations: ["inicio", "start", "home", "menu", "voltar", "back"],
            action: (): "start" => {
                State.menuChoice = "start"
                return "start"
            },
        },
        review: {
            short: tr("commands.shortReview"),
            long: tr("commands.longReview"),
            variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
            action: (): "review" => {
                State.menuChoice = "review"
                return "review"
            },
        },
        change: {
            short: tr("commands.shortChange"),
            long: tr("commands.longChange"),
            variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
            action: (): "change" => {
                State.menuChoice = "change"
                return "change"
            },
        },
        history: {
            short: tr("commands.shortHistory"),
            long: tr("commands.longHistory"),
            variations: ["historico", "history", "hist"],
            action: (): "history" => {
                State.menuChoice = "history"
                return "history"
            },
        },
        version: {
            short: tr("commands.shortVersion"),
            long: tr("commands.longVersion"),
            variations: ["versao", "version", "vers", "v"],
            action: (): null => {
                notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`)
                return null
            },
        },
        unicode: { short: tr("commands.shortUnicode"), long: tr("commands.longUnicode"), variations: ["unicode", "uni"], action: arg => change("showUnicode", arg ? "on" : "off") },
        accents: { short: tr("commands.shortAccents"), long: tr("commands.longAccents"), variations: ["acentos", "accents", "acento", "accent"], action: arg => change("showAccents", arg ? "on" : "off") },
        explain: { short: tr("commands.shortExplain"), long: tr("commands.longExplain"), variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"], action: arg => change("showExplanations", arg ? "on" : "off") },
        textcase: {
            short: tr("commands.shortTextCase"),
            long: tr("commands.longTextCase"),
            variations: ["textcase", "capitalizacao", "capitalizar", "capitalize", "capitalized", "capitalise", "capitalised", "cap", "maiuscula", "maiusculas", "uppercase", "upper", "minuscula", "minusculas", "lowercase", "lower", "normal", "default"],
            action: (_, [, argRaw]): null => {
                const TEXT_CASES: TextCase[] = ["capitalized", "uppercase", "lowercase", "default"],
                    hasArg = argRaw.trim() !== "",
                    target = hasArg ? noAccents(lowercase(argRaw)) : "",
                    TEXT_CASE_ALIASES: Record<TextCase, List<string>> = {
                        capitalized: ["capitalizado", "capitalizada", "capitalize", "capitalized", "capitalise", "capitalised", "cap"],
                        uppercase: ["maiuscula", "maiusculas", "uppercase", "upper"],
                        lowercase: ["minuscula", "minusculas", "lowercase", "lower"],
                        default: ["normal", "default"],
                    }
                let value: TextCase

                if (hasArg) {
                    const match = (Object.entries(TEXT_CASE_ALIASES) as [TextCase, List<string>][]).find(([, aliases]) => aliases.includes(target))?.[0]

                    if (match == null) {
                        notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" })
                        return null
                    }

                    value = match
                } else value = TEXT_CASES[(TEXT_CASES.indexOf(Config.textCase) + 1) % TEXT_CASES.length] ?? "default"

                return change("textCase", value)
            },
        },
        separator: { short: tr("commands.shortSeparator"), long: tr("commands.longSeparator"), variations: ["decimal", "separador", "separator", "sep"], action: arg => change("decimalSeparator", arg ? "comma" : "dot") },
        multiples: { short: tr("commands.shortMultiples"), long: tr("commands.longMultiples"), variations: ["multiplos", "multiplo", "multiples", "multi"], action: arg => change("implicitMulti", arg ? "on" : "off") },
        confirm: { short: tr("commands.shortConfirm"), long: tr("commands.longConfirm"), variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"], action: arg => change("inputConfirm", arg ? "on" : "off") },
        confirmExit: { short: tr("commands.shortConfirmExit"), long: tr("commands.longConfirmExit"), variations: ["confirmarSaida", "confirmExit", "confirmarsaida", "confirmsaida", "confirmexit", "confsaida", "confexit"], action: arg => change("exitConfirm", arg ? "on" : "off") },
        errors: { short: tr("commands.shortErrors"), long: tr("commands.longErrors"), variations: ["erros", "erro", "errors", "error", "err"], action: arg => change("showErrors", arg ? "on" : "off") },
        function: {
            short: tr("commands.shortFunction"),
            long: tr("commands.longFunction"),
            variations: ["funcao", "mostrarfuncao", "mostrarFuncao", "function", "showfunction", "showFunction", "func", "fn"],
            action: arg => change("showFunction", arg == null ? (Config.showFunction === "off" ? "on" : "off") : arg ? "on" : "off"),
        },
        degrees: {
            short: tr("commands.shortDegrees"),
            long: tr("commands.longDegrees"),
            variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
            action: (_, [, argRaw]): null => {
                const hasArg = argRaw.trim() !== "",
                    target = hasArg ? noAccents(lowercase(argRaw)) : "",
                    DEGREES_ALIASES: Record<AngleUnit, List<string>> = { deg: ["graus", "grau", "degrees", "degree", "deg"], rad: ["radianos", "radians", "rad"] }
                let value: AngleUnit

                if (hasArg) {
                    const match = (Object.entries(DEGREES_ALIASES) as [AngleUnit, List<string>][]).find(([, aliases]) => aliases.includes(target))?.[0]

                    if (match == null) {
                        notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" })
                        return null
                    }

                    value = match
                } else value = Config.angleUnit === "deg" ? "rad" : "deg"

                return change("angleUnit", value)
            },
        },
        language: {
            short: tr("commands.shortLanguage"),
            long: tr("commands.longLanguage"),
            variations: ["lingua", "language", "lang", "idioma", "pt", "pt-br", "pt-pt", "portugues", "portuguese", "brasileiro", "brazilian", "br", "ptbr", "en", "en-us", "en-gb", "ingles", "english", "anglo", "eua", "usa", "uk", "es", "es-es", "es-419", "espanol"],
            action: (_, [cmd, argRaw]): null => {
                const LANGUAGE_ALIASES: Record<Language, List<string>> = {
                        "pt-br": ["br", "pt-br", "ptbr", "brasileiro", "brazilian", "brasil", "brazil"],
                        "pt-pt": ["pt", "pt-pt", "ptpt", "portugues", "portuguese", "portugal"],
                        "en-us": ["en", "en-us", "enus", "americano", "american", "eua", "usa"],
                        "en-gb": ["gb", "en-gb", "engb", "ingles", "english", "britanico", "british", "uk"],
                        "es-419": ["es", "es-419", "espanol"],
                        "es-es": ["es-es"],
                    },
                    hasArg = argRaw.trim() !== "",
                    target = noAccents(lowercase(hasArg ? argRaw : cmd)),
                    entries = Object.entries(LANGUAGE_ALIASES) as [Language, List<string>][],
                    match = entries.find(([, aliases]) => aliases.includes(target))?.[0]

                if (match != null) {
                    if (changeLanguage(match) === "same") notify(tr("commands.languageAlready"), { type: "warning" })
                    return null
                }

                if (hasArg) notify(tr("commands.invalidLanguage"), { explanation: `"${target}" ${tr("commands.noteInvalidLanguage")}`, type: "error" })

                return null
            },
        },
        exit: {
            short: tr("commands.shortExit"),
            long: tr("commands.longExit"),
            variations: ["sair", "exit", "//", "ex", "out", "quit", "q", "fechar", "close"],
            action: (): "exit" => {
                State.menuChoice = "exit"
                return "exit"
            },
        },
    }
}

function levenshteinDistance(left: string, right: string, limit: number): number {
    const cols = left.length + 1

    let previousRow = Array.from({ length: cols }, (_, col) => col),
        currentRow = Array(cols).fill(0)

    for (let row = 1; row <= right.length; row++) {
        currentRow[0] = row
        let rowMin = row

        for (let col = 1; col < cols; col++) {
            const cost = left[col - 1] === right[row - 1] ? 0 : 1,
                deletion = previousRow[col]! + 1,
                insertion = currentRow[col - 1]! + 1,
                substitution = previousRow[col - 1]! + cost

            currentRow[col] = Math.min(deletion, insertion, substitution)
            rowMin = Math.min(rowMin, currentRow[col])
        }

        if (rowMin > limit) return limit + 1

        ;[previousRow, currentRow] = [currentRow, previousRow]
    }

    return previousRow[cols - 1]!
}

function suggestCmd(cmd: string): { best: string; distance: number } | null {
    const cmds = listCmds()
    let best = "",
        lowerDist = 4

    for (const [key, command] of Object.entries(cmds)) {
        for (const candidate of [key, ...command.variations]) {
            if (Math.abs(cmd.length - candidate.length) > lowerDist) continue
            if (cmd === candidate) return { best: key, distance: 0 }

            const distance = levenshteinDistance(cmd, candidate, lowerDist)
            if (distance >= lowerDist) continue

            lowerDist = distance
            best = key
            if (distance === 0) return { best, distance }
        }
    }

    return best === "" ? null : { best, distance: lowerDist }
}

export function processCmd(raw: string): CommandNames | null {
    let input = raw

    for (;;) {
        if (input.length === 0 || !input.startsWith("/")) return null

        const [cmd = "", argRaw = ""] = noAccents(input.slice(1).toLowerCase()).split(" ", 2),
            cmds = listCmds(),
            canonical = resolveCmd(cmd, cmds)

        let arg: boolean | null = null

        if (["true", "1", "sim", "yes", "on", "enable", "enabled", "ligar", "ativar"].includes(argRaw)) arg = true
        else if (["false", "0", "nao", "no", "off", "disable", "disabled", "desligar", "desativar"].includes(argRaw)) arg = false

        if (canonical == null) {
            const suggestion = suggestCmd(cmd)

            if (suggestion != null) {
                const { best, distance } = suggestion

                if (notify(tr("commands.commandSuggestion", { suggestion: best }), { explanation: tr("commands.commandSuggestionExp", { command: cmd, suggestion: best, distance }), type: "confirm" })) {
                    input = `/${best} ${argRaw}`
                    continue
                }

                return null
            }

            notify(tr("commands.invalidCommand"), { explanation: tr("commands.invalidCommandExp", { command: cmd }), type: "error" })
            return null
        }

        return cmds[canonical]?.action(arg, [cmd, argRaw]) ?? null
    }
}

function resolveCmd(specific: string, cmds: ReturnType<typeof listCmds>): string | null {
    if (specific.trim() === "") return null

    const found = Object.entries(cmds).find(([, cmd]) => cmd.variations.includes(specific))

    return found?.[0] ?? (Object.hasOwn(cmds, specific) ? specific : null)
}

function shortcuts(specific: string): null {
    if (specific.trim() === "") {
        notify(tr("commands.commandNotProvided"), { explanation: tr("commands.usageShortcuts"), type: "error" })
        return null
    }

    const cmds = listCmds(),
        canonical = resolveCmd(specific, cmds)

    if (canonical == null) {
        notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" })
        return null
    }

    const variations = cmds[canonical]!.variations.map(v => `/${v}`).join("\n")

    notify(`${tr("commands.commandVariations")}“/${canonical}”:\n${variations}`)
    return null
}

export function isValidCommand(value: unknown): value is CommandNames {
    return typeof value === "string" && ["config", "exit", "start", "review", "history", "change"].includes(value)
}
