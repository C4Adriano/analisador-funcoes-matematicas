import { Config, type ConfigKey, type ConfigType, isConfigKey } from "../Base/config.js"
import { isZero, num, toNatural, ZERO } from "../Base/quantity.js"
import { tr } from "../Lang/i18n.js"
import { configItem, lowercase, noAccents } from "../Lang/writing.js"
import { State } from "../Math/state.js"
import { VERSION } from "../version.js"
import { confirmLanguageChange, isActionConfirmed, notify } from "./display.js"
import { rangeOptions } from "./ui.js"

type CommandAction = (argument: boolean | null, parts: [cmd: string, raw: string]) => CommandNames | Promise<CommandNames | null> | Promise<void>

function toggle(argument: boolean | null, key: ConfigKey): Toggle
function toggle<const Values extends readonly [string, string]>(argument: boolean | null, key: ConfigKey, values: Values): Values[Real]
function toggle(argument: boolean | null, key: ConfigKey, values: readonly [string, string] = ["on", "off"]): string {
    const [first, second] = values
    return argument === null ? (Config[key] === first ? second : first) : argument ? first : second
}

async function change<K extends ConfigKey>(name: K, value?: ConfigType[K] | null): Promise<void> {
    const currentValue = Config[name]

    if (value == null && typeof currentValue === "boolean") Object.assign(Config, { [name]: !currentValue })
    else if (value != null && typeof currentValue === typeof value) Object.assign(Config, { [name]: value })
    else return

    Config.save()
    await notify(configItem(`${tr("commands.changed")} "${name}"`, name), { type: "warning" })
}

async function help(specific: string): Promise<void> {
    const cmds = listCmds()

    if (specific.trim() !== "") {
        const canonical = resolveCommand(specific, cmds)

        if (canonical == null) {
            await notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" })
            return
        }

        const command = cmds[canonical]
        if (command == null) return

        const shortList = [canonical, ...command.variations].join(", ")
        await notify(`“/${canonical}” — ${command.long}\n${tr("commands.variations")}${shortList}`)
        return
    }

    const key = Object.keys(cmds),
        total = Math.ceil(key.length / 5)
    let page = 1,
        answer: Raw | CommandNames

    do {
        page = Math.min(Math.max(page, 1), total)

        answer = await rangeOptions(
            `=== ${tr("commands.help")} ===\n${tr("commands.page")} ${page}/${total}${key
                .slice((page - 1) * 5, Math.min(page * 5, key.length))
                .map(name => `\n/${name} — ${cmds[name]!.short}\n ↳ ${[name, ...cmds[name]!.variations].join(", ")}`)
                .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
            { max: 9 as Integer, commands: true },
        )

        page += answer === 8 ? -1 : answer === 9 ? 1 : 0
    } while (answer !== 0)
}

function listCmds(): Record<string, { short: string; long: string; variations: List<string>; action: CommandAction }> {
    return {
        help: { short: tr("commands.shortHelp"), long: tr("commands.longHelp"), variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"], action: async (_, [, raw]) => help(raw) },
        search: {
            short: tr("commands.shortSearch"),
            long: tr("commands.longSearch"),
            variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
            action: async (_, [, raw]): Promise<void> => {
                if (raw.trim() === "") {
                    await notify(tr("commands.emptySearch"), { explanation: tr("commands.usageSearch"), type: "error" })
                    return
                }

                const term = noAccents(lowercase(raw)),
                    cmds = listCmds(),
                    results = Object.keys(cmds).filter(key => {
                        const command = cmds[key]
                        return command != null && [key, command.short, command.long, ...command.variations].some(candidate => noAccents(lowercase(candidate)).includes(term))
                    })

                if (results.length === 0) {
                    await notify(`${tr("commands.noCommand")}"${term}"`, { type: "warning" })
                    return
                }

                const total = Math.ceil(results.length / 5)
                let page = 1,
                    answer: Raw | CommandNames

                do {
                    page = Math.min(Math.max(page, 1), total)

                    answer = await rangeOptions(
                        `=== ${tr("commands.search")}"${term}" ===\n${results.length} ${tr("commands.resultsSearch")}${page}/${total}\n${results
                            .slice((page - 1) * 5, Math.min(page * 5, results.length))
                            .map(name => `\n/${name} — ${cmds[name]!.short}`)
                            .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
                        { max: 9 as Integer, commands: true },
                    )

                    page += answer === 8 ? -1 : answer === 9 ? 1 : 0
                } while (answer !== 0)
            },
        },
        shortcuts: { short: tr("commands.shortShortcuts"), long: tr("commands.longShortcuts"), variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"], action: async (_, [, raw]) => shortcuts(raw) },
        about: {
            short: tr("commands.shortAbout"),
            long: tr("commands.longAbout"),
            variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
            action: async (): Promise<void> => {
                await notify(
                    `==================================================\n` +
                        `${tr("commands.title")} — ${VERSION}\n` +
                        `${tr("commands.author")}Adriano Lima\n` +
                        `${tr("commands.repository")}github.com/C4Adriano/analisador-funcoes-matematicas\n` +
                        `${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
                        `==================================================`,
                )
            },
        },
        config: {
            short: tr("commands.shortConfig"),
            long: tr("commands.longConfig"),
            variations: ["config", "configuracoes", "conf", "settings", "cfg"],
            action: async (argument, [, raw]): Promise<"config" | null> => {
                if (raw.trim() === "") {
                    State.menuChoice = "config"
                    return "config"
                }

                if (isConfigKey(raw)) await change(raw, toggle(argument, raw))
                else await notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: raw }), type: "error" })

                return null
            },
        },
        reset: {
            short: tr("commands.shortReset"),
            long: tr("commands.longReset"),
            variations: ["resetar", "reset", "restaurar", "restore"],
            action: async (): Promise<void> => {
                Config.reset()
                await notify(tr("commands.resetConfirm"), { type: "warning" })
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
            action: async (): Promise<void> => {
                await notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`)
            },
        },
        unicode: { short: tr("commands.shortUnicode"), long: tr("commands.longUnicode"), variations: ["unicode", "uni"], action: async argument => change("showUnicode", toggle(argument, "showUnicode")) },
        accents: { short: tr("commands.shortAccents"), long: tr("commands.longAccents"), variations: ["acentos", "accents", "acento", "accent"], action: async argument => change("showAccents", toggle(argument, "showAccents")) },
        explain: { short: tr("commands.shortExplain"), long: tr("commands.longExplain"), variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"], action: async argument => change("showExplanations", toggle(argument, "showExplanations")) },
        textcase: {
            short: tr("commands.shortTextCase"),
            long: tr("commands.longTextCase"),
            variations: ["textcase", "capitalizacao", "capitalizar", "capitalize", "capitalized", "capitalise", "capitalised", "cap", "maiuscula", "maiusculas", "uppercase", "upper", "minuscula", "minusculas", "lowercase", "lower", "normal", "default"],
            action: async (_, [, raw]): Promise<void> => {
                const TEXT_CASES: TextCase[] = ["capitalized", "uppercase", "lowercase", "default"],
                    hasArgument = raw.trim() !== "",
                    target = hasArgument ? noAccents(lowercase(raw)) : "",
                    TEXT_CASE_ALIASES: Record<TextCase, List<string>> = {
                        capitalized: ["capitalizado", "capitalizada", "capitalize", "capitalized", "capitalise", "capitalised", "cap"],
                        uppercase: ["maiuscula", "maiusculas", "uppercase", "upper"],
                        lowercase: ["minuscula", "minusculas", "lowercase", "lower"],
                        default: ["normal", "default"],
                    }
                let value: TextCase

                if (hasArgument) {
                    const match = (Object.entries(TEXT_CASE_ALIASES) as [TextCase, List<string>][]).find(([, aliases]) => aliases.includes(target))?.[0]

                    if (match == null) {
                        await notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" })
                        return
                    }

                    value = match
                } else value = TEXT_CASES[(TEXT_CASES.indexOf(Config.textCase) + 1) % TEXT_CASES.length] ?? "default"

                await change("textCase", value)
            },
        },
        separator: { short: tr("commands.shortSeparator"), long: tr("commands.longSeparator"), variations: ["decimal", "separador", "separator", "sep"], action: async argument => change("decimalSeparator", toggle(argument, "decimalSeparator", ["comma", "dot"])) },
        multiples: { short: tr("commands.shortMultiples"), long: tr("commands.longMultiples"), variations: ["multiplos", "multiplo", "multiples", "multi"], action: async argument => change("implicitMulti", toggle(argument, "implicitMulti")) },
        confirm: { short: tr("commands.shortConfirm"), long: tr("commands.longConfirm"), variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"], action: async argument => change("inputConfirm", toggle(argument, "inputConfirm")) },
        confirmExit: {
            short: tr("commands.shortConfirmExit"),
            long: tr("commands.longConfirmExit"),
            variations: ["confirmarSaida", "confirmExit", "confirmarsaida", "confirmsaida", "confirmexit", "confsaida", "confexit"],
            action: async argument => change("exitConfirm", toggle(argument, "exitConfirm")),
        },
        errors: { short: tr("commands.shortErrors"), long: tr("commands.longErrors"), variations: ["erros", "erro", "errors", "error", "err"], action: async argument => change("showErrors", toggle(argument, "showErrors")) },
        function: { short: tr("commands.shortFunction"), long: tr("commands.longFunction"), variations: ["funcao", "mostrarfuncao", "mostrarFuncao", "function", "showfunction", "showFunction", "func", "fn"], action: async argument => change("showFunction", toggle(argument, "showFunction")) },
        degrees: {
            short: tr("commands.shortDegrees"),
            long: tr("commands.longDegrees"),
            variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
            action: async (_, [, raw]): Promise<void> => {
                const hasArgument = raw.trim() !== "",
                    target = hasArgument ? noAccents(lowercase(raw)) : "",
                    DEGREES_ALIASES: Record<AngleUnit, List<string>> = { deg: ["graus", "grau", "degrees", "degree", "deg"], rad: ["radianos", "radians", "rad"] }
                let value: AngleUnit

                if (hasArgument) {
                    const match = (Object.entries(DEGREES_ALIASES) as [AngleUnit, List<string>][]).find(([, aliases]) => aliases.includes(target))?.[0]

                    if (match == null) {
                        await notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" })
                        return
                    }

                    value = match
                } else value = Config.angleUnit === "deg" ? "rad" : "deg"

                await change("angleUnit", value)
            },
        },
        language: {
            short: tr("commands.shortLanguage"),
            long: tr("commands.longLanguage"),
            variations: ["lingua", "language", "lang", "idioma", "pt", "pt-br", "pt-pt", "portugues", "portuguese", "brasileiro", "brazilian", "br", "ptbr", "en", "en-us", "en-gb", "ingles", "english", "anglo", "eua", "usa", "uk", "es", "es-es", "es-419", "espanol"],
            action: async (_, [command, raw]): Promise<void> => {
                const LANGUAGE_ALIASES: Record<Language, List<string>> = {
                        "pt-br": ["br", "pt-br", "ptbr", "brasileiro", "brazilian", "brasil", "brazil"],
                        "pt-pt": ["pt", "pt-pt", "ptpt", "portugues", "portuguese", "portugal"],
                        "en-us": ["en", "en-us", "enus", "americano", "american", "eua", "usa"],
                        "en-gb": ["gb", "en-gb", "engb", "ingles", "english", "britanico", "british", "uk"],
                        "es-419": ["es", "es-419", "espanol"],
                        "es-es": ["es-es"],
                    },
                    hasArgument = raw.trim() !== "",
                    target = noAccents(lowercase(hasArgument ? raw : command)),
                    entries = Object.entries(LANGUAGE_ALIASES) as [Language, List<string>][],
                    match = entries.find(([, aliases]) => aliases.includes(target))?.[0]

                if (match != null) {
                    if ((await confirmLanguageChange(match)) === "same") await notify(tr("commands.languageAlready"), { type: "warning" })
                    return
                }

                if (hasArgument) await notify(tr("commands.invalidLanguage"), { explanation: `"${target}" ${tr("commands.noteInvalidLanguage")}`, type: "error" })
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

function levenshteinDistance(left: string, right: string, limit: Raw): Natural {
    const cols: Raw = left.length + 1

    let previousRow: Raw[] = Array.from({ length: cols }, (_, col) => col),
        currentRow: Raw[] = Array.from({ length: cols }, () => 0)

    for (let row = 1; row <= right.length; row++) {
        currentRow[0] = row
        let rowMin: Raw = row

        for (let col = 1; col < cols; col++) {
            const cost: Raw = left[col - 1] === right[row - 1] ? 0 : 1,
                distance: Raw = Math.min(previousRow[col]! + 1, currentRow[col - 1]! + 1, previousRow[col - 1]! + cost)

            currentRow[col] = distance
            rowMin = Math.min(rowMin, distance)
        }

        if (rowMin > limit) return toNatural(limit + 1)!

        const nextRow = previousRow
        previousRow = currentRow
        currentRow = nextRow
    }

    return toNatural(previousRow[cols - 1]!)!
}

function suggestCommand(raw: string): { best: string; distance: Natural } | null {
    const cmds = listCmds()
    let best = "",
        lowerDistance: Natural = num(4)

    for (const [key, command] of Object.entries(cmds)) {
        for (const candidate of [key, ...command.variations]) {
            if (Math.abs(raw.length - candidate.length) > lowerDistance) continue
            if (raw === candidate) return { best: key, distance: ZERO }

            const distance = levenshteinDistance(raw, candidate, lowerDistance)
            if (distance >= lowerDistance) continue

            lowerDistance = distance
            best = key
            if (isZero(distance)) return { best, distance }
        }
    }

    return best === "" ? null : { best, distance: lowerDistance }
}

export async function processCommand(text: string): Promise<CommandNames | null> {
    let input = text

    for (;;) {
        if (input.length === 0 || !input.startsWith("/")) return null

        const [command = "", raw = ""] = noAccents(input.slice(1).toLowerCase()).split(" ", 2),
            cmds = listCmds(),
            canonical = resolveCommand(command, cmds)

        let argument: boolean | null = null

        if (["true", "1", "sim", "yes", "on", "enable", "enabled", "ligar", "ativar"].includes(raw)) argument = true
        else if (["false", "0", "nao", "no", "off", "disable", "disabled", "desligar", "desativar"].includes(raw)) argument = false

        if (canonical == null) {
            const suggestion = suggestCommand(command)

            if (suggestion != null) {
                const { best, distance } = suggestion

                if (await isActionConfirmed(tr("commands.commandSuggestion", { suggestion: best }), { explanation: tr("commands.commandSuggestionExp", { command, suggestion: best, distance }) })) {
                    input = `/${best} ${raw}`
                    continue
                }

                return null
            }

            await notify(tr("commands.invalidCommand"), { explanation: tr("commands.invalidCommandExp", { command }), type: "error" })
            return null
        }

        const result = await cmds[canonical]?.action(argument, [command, raw])
        return typeof result === "string" ? result : null
    }
}

function resolveCommand(specific: string, cmds: ReturnType<typeof listCmds>): string | null {
    if (specific.trim() === "") return null

    const found = Object.entries(cmds).find(([, command]) => command.variations.includes(specific))

    return found?.[0] ?? (Object.hasOwn(cmds, specific) ? specific : null)
}

async function shortcuts(specific: string): Promise<void> {
    if (specific.trim() === "") {
        await notify(tr("commands.commandNotProvided"), { explanation: tr("commands.usageShortcuts"), type: "error" })
        return
    }

    const cmds = listCmds(),
        canonical = resolveCommand(specific, cmds)

    if (canonical == null) {
        await notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" })
        return
    }

    const variations = cmds[canonical]!.variations.map(v => `/${v}`).join("\n")

    await notify(`${tr("commands.commandVariations")}“/${canonical}”:\n${variations}`)
}

export function isValidCommand(value: unknown): value is CommandNames {
    return typeof value === "string" && ["config", "exit", "start", "review", "history", "change"].includes(value)
}
