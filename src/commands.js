import { Config, isConfigKey } from "./config.js";
import { notify } from "./display.js";
import { changeLanguage, tr } from "./i18n.js";
import { State } from "./state.js";
import { rangeOptions } from "./ui.js";
import { VERSION } from "./version.js";
import { configItem, lowercase, noAccents } from "./writing.js";
const COMMANDS_NAMES = ["config", "exit", "start", "review", "history", "change"];
function about() {
    notify(`==================================================\n` +
        `${tr("commands.title")} — ${VERSION}\n` +
        `${tr("commands.author")}Adriano Lima\n` +
        `${tr("commands.repository")}github.com/C4Adriano/analisador-funcoes-matematicas\n` +
        `${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
        `==================================================`);
    return null;
}
function change(name, value) {
    const currentValue = Config[name];
    if (value == null && typeof currentValue === "boolean")
        Object.assign(Config, { [name]: !currentValue });
    else if (value != null && typeof currentValue === typeof value)
        Object.assign(Config, { [name]: value });
    else
        return null;
    Config.save();
    notify(configItem(`${tr("commands.changed")} "${name}"`, name), { type: "warning" });
    return null;
}
function help(specific) {
    const cmds = listCmds();
    if (specific.trim() !== "") {
        const canonical = resolveCmd(specific);
        if (canonical == null) {
            notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" });
            return null;
        }
        const cmd = cmds[canonical];
        if (cmd == null)
            return null;
        const shortList = [canonical, ...cmd.variations].join(", ");
        notify(`“/${canonical}” — ${cmd.long}\n${tr("commands.variations")}${shortList}`);
        return null;
    }
    const key = Object.keys(cmds), total = Math.ceil(key.length / 5);
    let page = 1, answer;
    do {
        page = Math.min(Math.max(page, 1), total);
        answer = rangeOptions(`=== ${tr("commands.help")} ===\n${tr("commands.page")} ${page}/${total}${key
            .slice((page - 1) * 5, Math.min(page * 5, key.length))
            .map(name => `\n/${name} — ${cmds[name].short}\n ↳ ${[name, ...cmds[name].variations].join(", ")}`)
            .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`, { max: 9, commands: true });
        page += answer === 8 ? -1 : answer === 9 ? 1 : 0;
    } while (answer !== 0);
    return null;
}
function levenshtein(source, target) {
    if (source === target)
        return 0;
    if (source.length === 0)
        return target.length;
    if (target.length === 0)
        return source.length;
    const rows = target.length + 1, cols = source.length + 1, matrix = Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (__, col) => (row === 0 ? col : col === 0 ? row : 0)));
    for (let row = 1; row < rows; row++) {
        const currentRow = matrix[row], previousRow = matrix[row - 1];
        if (!currentRow || !previousRow)
            continue;
        for (let col = 1; col < cols; col++) {
            const cost = source[col - 1] === target[row - 1] ? 0 : 1, deletion = (previousRow[col] ?? 0) + 1, insertion = (currentRow[col - 1] ?? 0) + 1, substitution = (previousRow[col - 1] ?? 0) + cost;
            currentRow[col] = Math.min(deletion, insertion, substitution);
        }
    }
    return matrix[rows - 1]?.[cols - 1] ?? 0;
}
function listCmds() {
    return {
        help: { short: tr("commands.shortHelp"), long: tr("commands.longHelp"), variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"], action: (_, [, argRaw]) => help(argRaw) },
        search: { short: tr("commands.shortSearch"), long: tr("commands.longSearch"), variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"], action: (_, [, argRaw]) => searchHelp(argRaw) },
        shortcuts: { short: tr("commands.shortShortcuts"), long: tr("commands.longShortcuts"), variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"], action: (_, [, argRaw]) => shortcuts(argRaw) },
        about: { short: tr("commands.shortAbout"), long: tr("commands.longAbout"), variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"], action: () => about() },
        config: {
            short: tr("commands.shortConfig"),
            long: tr("commands.longConfig"),
            variations: ["config", "configuracoes", "conf", "settings", "cfg"],
            action: (arg, [, argRaw]) => {
                if (argRaw.trim() === "") {
                    State.type = "config";
                    return "config";
                }
                if (isConfigKey(argRaw))
                    return change(argRaw, arg);
                notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: argRaw }), type: "error" });
                return null;
            },
        },
        reset: {
            short: tr("commands.shortReset"),
            long: tr("commands.longReset"),
            variations: ["resetar", "reset", "restaurar", "restore"],
            action: () => {
                Config.reset();
                notify(tr("commands.resetConfirm"), { type: "warning" });
                return null;
            },
        },
        start: {
            short: tr("commands.shortStart"),
            long: tr("commands.longStart"),
            variations: ["inicio", "start", "home", "menu", "voltar", "back"],
            action: () => {
                State.type = "start";
                return "start";
            },
        },
        review: {
            short: tr("commands.shortReview"),
            long: tr("commands.longReview"),
            variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
            action: () => {
                State.type = "review";
                return "review";
            },
        },
        change: {
            short: tr("commands.shortChange"),
            long: tr("commands.longChange"),
            variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
            action: () => {
                State.type = "change";
                return "change";
            },
        },
        history: {
            short: tr("commands.shortHistory"),
            long: tr("commands.longHistory"),
            variations: ["historico", "history", "hist"],
            action: () => {
                State.type = "history";
                return "history";
            },
        },
        version: { short: tr("commands.shortVersion"), long: tr("commands.longVersion"), variations: ["versao", "version", "vers", "v"], action: () => version() },
        unicode: { short: tr("commands.shortUnicode"), long: tr("commands.longUnicode"), variations: ["unicode", "uni"], action: arg => change("unicode", arg) },
        accents: { short: tr("commands.shortAccents"), long: tr("commands.longAccents"), variations: ["acentos", "accents", "acento", "accent"], action: arg => change("accents", arg) },
        explain: { short: tr("commands.shortExplain"), long: tr("commands.longExplain"), variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"], action: arg => change("explanations", arg) },
        textcase: {
            short: tr("commands.shortTextCase"),
            long: tr("commands.longTextCase"),
            variations: ["textcase", "capitalizacao", "capitalizar", "capitalize", "capitalized", "capitalise", "capitalised", "cap", "maiuscula", "maiusculas", "uppercase", "upper", "minuscula", "minusculas", "lowercase", "lower", "normal", "default"],
            action: (_, [, argRaw]) => {
                const TEXT_CASES = ["capitalized", "uppercase", "lowercase", "default"], hasArg = argRaw.trim() !== "", target = hasArg ? noAccents(lowercase(argRaw)) : "", TEXT_CASE_ALIASES = {
                    capitalized: ["capitalizado", "capitalizada", "capitalize", "capitalized", "capitalise", "capitalised", "cap"],
                    uppercase: ["maiuscula", "maiusculas", "uppercase", "upper"],
                    lowercase: ["minuscula", "minusculas", "lowercase", "lower"],
                    default: ["normal", "default"],
                };
                let value;
                if (hasArg) {
                    const match = Object.entries(TEXT_CASE_ALIASES).find(([, aliases]) => aliases.includes(target))?.[0];
                    if (match == null) {
                        notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" });
                        return null;
                    }
                    value = match;
                }
                else
                    value = TEXT_CASES[(TEXT_CASES.indexOf(Config.textCase) + 1) % TEXT_CASES.length] ?? "default";
                return change("textCase", value);
            },
        },
        separator: { short: tr("commands.shortSeparator"), long: tr("commands.longSeparator"), variations: ["decimal", "separador", "separator", "sep"], action: arg => change("decimalSeparator", arg) },
        multiples: { short: tr("commands.shortMultiples"), long: tr("commands.longMultiples"), variations: ["multiplos", "multiplo", "multiples", "multi"], action: arg => change("simpleMulti", arg) },
        confirm: { short: tr("commands.shortConfirm"), long: tr("commands.longConfirm"), variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"], action: arg => change("inputConfirm", arg) },
        confirmExit: { short: tr("commands.shortConfirmExit"), long: tr("commands.longConfirmExit"), variations: ["confirmarSaida", "confirmExit", "confirmarsaida", "confirmsaida", "confirmexit", "confsaida", "confexit"], action: arg => change("outputConfirm", arg) },
        errors: { short: tr("commands.shortErrors"), long: tr("commands.longErrors"), variations: ["erros", "erro", "errors", "error", "err"], action: arg => change("errors", arg) },
        function: {
            short: tr("commands.shortFunction"),
            long: tr("commands.longFunction"),
            variations: ["funcao", "mostrarfuncao", "mostrarFuncao", "function", "showfunction", "showFunction", "func", "fn"],
            action: arg => change("showFunction", arg == null ? (Config.showFunction === "never" ? "always" : "never") : arg ? "always" : "never"),
        },
        degrees: {
            short: tr("commands.shortDegrees"),
            long: tr("commands.longDegrees"),
            variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
            action: (_, [, argRaw]) => {
                const hasArg = argRaw.trim() !== "", target = hasArg ? noAccents(lowercase(argRaw)) : "", DEGREES_ALIASES = { deg: ["graus", "grau", "degrees", "degree", "deg"], rad: ["radianos", "radians", "rad"] };
                let value;
                if (hasArg) {
                    const match = Object.entries(DEGREES_ALIASES).find(([, aliases]) => aliases.includes(target))?.[0];
                    if (match == null) {
                        notify(tr("commands.invalidSetting"), { explanation: tr("commands.invalidSettingExp", { setting: target }), type: "error" });
                        return null;
                    }
                    value = match;
                }
                else
                    value = Config.degrees === "deg" ? "rad" : "deg";
                return change("degrees", value);
            },
        },
        language: {
            short: tr("commands.shortLanguage"),
            long: tr("commands.longLanguage"),
            variations: ["lingua", "language", "lang", "idioma", "pt", "pt-br", "pt-pt", "portugues", "portuguese", "brasileiro", "brazilian", "br", "ptbr", "en", "en-us", "en-gb", "ingles", "english", "anglo", "eua", "usa", "uk", "es", "es-es", "es-419", "espanol"],
            action: (_, [cmd, argRaw]) => {
                const LANGUAGE_ALIASES = {
                    "pt-br": ["br", "pt-br", "ptbr", "brasileiro", "brazilian", "brasil", "brazil"],
                    "pt-pt": ["pt", "pt-pt", "ptpt", "portugues", "portuguese", "portugal"],
                    "en-us": ["en", "en-us", "enus", "americano", "american", "eua", "usa"],
                    "en-gb": ["gb", "en-gb", "engb", "ingles", "english", "britanico", "british", "uk"],
                    "es-419": ["es", "es-419", "espanol"],
                    "es-es": ["es-es"],
                }, hasArg = argRaw.trim() !== "", target = noAccents(lowercase(hasArg ? argRaw : cmd)), entries = Object.entries(LANGUAGE_ALIASES), match = entries.find(([, aliases]) => aliases.includes(target))?.[0];
                if (match != null) {
                    if (changeLanguage(match) === "same")
                        notify(tr("commands.languageAlready"), { type: "warning" });
                    return null;
                }
                if (hasArg)
                    notify(tr("commands.invalidLanguage"), { explanation: `"${target}" ${tr("commands.noteInvalidLanguage")}`, type: "error" });
                return null;
            },
        },
        exit: {
            short: tr("commands.shortExit"),
            long: tr("commands.longExit"),
            variations: ["sair", "exit", "//", "ex", "out", "quit", "q", "fechar", "close"],
            action: () => {
                State.type = "exit";
                return "exit";
            },
        },
    };
}
function parseBool(text) {
    return ["true", "1", "sim", "yes", "on", "enable", "enabled", "ligar", "ativar"].includes(text) || (!["false", "0", "nao", "no", "off", "disable", "disabled", "desligar", "desativar"].includes(text) && null);
}
function processCommand(raw) {
    let input = raw;
    for (;;) {
        if (input.length === 0 || !input.startsWith("/"))
            return null;
        const [cmd = "", argRaw = ""] = noAccents(input.slice(1).toLowerCase()).split(" ", 2), arg = parseBool(argRaw), canonical = resolveCmd(cmd);
        if (canonical == null) {
            const suggestion = suggestCmd(cmd);
            if (suggestion.type === "suggestion") {
                if (notify(tr("commands.commandSuggestion", { suggestion: suggestion.canonical }), { explanation: tr("commands.commandSuggestionExp", { command: cmd, suggestion: suggestion.canonical, distance: suggestion.distance }), type: "confirm" })) {
                    input = `/${suggestion.canonical} ${argRaw}`;
                    continue;
                }
                return null;
            }
            notify(tr("commands.invalidCommand"), { explanation: tr("commands.invalidCommandExp", { command: cmd }), type: "error" });
            return null;
        }
        return listCmds()[canonical]?.action(arg, [cmd, argRaw]) ?? null;
    }
}
function resolveCmd(specific) {
    if (specific.trim() === "")
        return null;
    const cmds = listCmds(), found = Object.entries(cmds).find(([, cmd]) => cmd.variations.includes(specific));
    return found?.[0] ?? (Object.hasOwn(cmds, specific) ? specific : null);
}
function searchCmds(term) {
    if (term.trim() === "")
        return [];
    const cmds = listCmds(), normalizedTerm = noAccents(lowercase(term));
    return Object.keys(cmds).filter(key => {
        const cmd = cmds[key];
        return cmd != null && [key, cmd.short, cmd.long, ...cmd.variations].some(candidate => noAccents(lowercase(candidate)).includes(normalizedTerm));
    });
}
function searchHelp(term) {
    if (term.trim() === "") {
        notify(tr("commands.emptySearch"), { explanation: tr("commands.usageSearch"), type: "error" });
        return null;
    }
    term = noAccents(term.toLowerCase());
    const results = searchCmds(term);
    if (results.length === 0) {
        notify(`${tr("commands.noCommand")}"${term}"`, { type: "warning" });
        return null;
    }
    const cmds = listCmds(), total = Math.ceil(results.length / 5);
    let page = 1, answer;
    do {
        page = Math.min(Math.max(page, 1), total);
        answer = rangeOptions(`=== ${tr("commands.search")}"${term}" ===\n${results.length} ${tr("commands.resultsSearch")}${page}/${total}\n${results
            .slice((page - 1) * 5, Math.min(page * 5, results.length))
            .map(name => `\n/${name} — ${cmds[name].short}`)
            .join("")}\n----------------\n8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`, { max: 9, commands: true });
        page += answer === 8 ? -1 : answer === 9 ? 1 : 0;
    } while (answer !== 0);
    return null;
}
function shortcuts(specific) {
    if (specific.trim() === "") {
        notify(tr("commands.commandNotProvided"), { explanation: tr("commands.usageShortcuts"), type: "error" });
        return null;
    }
    const canonical = resolveCmd(specific);
    if (canonical == null) {
        notify(tr("commands.unknownCommand"), { explanation: tr("commands.invalidCommandExp", { command: specific }), type: "error" });
        return null;
    }
    const variations = listCmds()[canonical].variations.map(v => `/${v}`)
        .join("\n");
    notify(`${tr("commands.commandVariations")}“/${canonical}”:\n${variations}`);
    return null;
}
function suggestCmd(typed) {
    const cmds = listCmds();
    let best = "", lowerDist = Infinity;
    for (const [key, cmd] of Object.entries(cmds))
        for (const candidate of [key, ...cmd.variations]) {
            const dist = levenshtein(typed, candidate);
            if (dist >= lowerDist)
                continue;
            lowerDist = dist;
            best = key;
        }
    if (lowerDist <= 3)
        return { type: lowerDist === 0 ? "exact" : "suggestion", canonical: best, distance: lowerDist };
    return { type: "unknown", canonical: "", distance: -1 };
}
function version() {
    notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`);
    return null;
}
function isValidCommand(value) {
    return typeof value === "string" && COMMANDS_NAMES.includes(value);
}
export { isValidCommand, processCommand };
