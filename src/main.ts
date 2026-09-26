import { round } from "./algebra.js"
import { resolveAffine, resolveConstant, resolveCosine, resolveExponential, resolveLogarithmic, resolveQuadratic, resolveSine, resolveTangent } from "./analyze.js"
import { isFiniteNumber, isInInterval } from "./checks.js"
import { isValidCommand } from "./commands.js"
import { Config, DEFAULT_CONFIG, type ConfigKey } from "./config.js"
import { notify } from "./display.js"
import { errorConstantFunction, errorInvalidFunction } from "./errors.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { inputCommands, rangeOptions } from "./ui.js"
import { VERSION } from "./version.js"
import { configItem, decimalOptions, uppercase } from "./writing.js"

notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`, { type: "console" })

Config.load()

function setMeta(name = "", content = ""): void {
    document.querySelector(`meta[name="${CSS.escape(name)}"]`)?.setAttribute("content", content)
}

function setProperty(property = "", content = ""): void {
    document.querySelector(`meta[property="${CSS.escape(property)}"]`)?.setAttribute("content", content)
}

const locales: Record<Language, string> = { "pt-br": "pt_BR", "pt-pt": "pt_PT", "en-us": "en_US", "en-gb": "en_GB", "es-419": "es_419", "es-es": "es_ES" }

function changeHTML(): void {
    const title = tr("commands.title"),
        description = tr("main.documentDescription")

    document.documentElement.lang = Config.language
    setProperty("og:locale", locales[Config.language])
    document.title = title

    const h1 = document.querySelector("h1")
    if (h1) h1.textContent = tr("main.h1")

    setMeta("title", title)
    setMeta("description", description)
    setProperty("og:title", title)
    setProperty("og:description", description)
    setMeta("twitter:title", title)
    setMeta("twitter:description", description)
}

changeHTML()

notify(tr("main.welcomeTitle"), { explanation: tr("main.welcomeDescription") })

function submenuFooter(backLabel: string): string {
    return `----------------\n6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr("main.change")} | 0 = ${backLabel}`
}

function handleSubmenu(subtype: number | CommandsNames): boolean {
    if (isFiniteNumber(subtype) && isInInterval(subtype, [6, 9])) {
        State.type = subtype
        State.loop = true
        State.keepType = true
        return true
    }

    if (isValidCommand(subtype)) {
        State.type = subtype
        State.loop = true
        if (subtype !== "exit") State.keepType = true
        return true
    }

    if (subtype === 0) {
        State.loop = true
        return true
    }

    return false
}

function isValidSubtype(subtype: number | CommandsNames, maxOption: number): boolean {
    return (isFiniteNumber(subtype) && isInInterval(subtype, [0, maxOption, 6, 9])) || isValidCommand(subtype)
}

function runSubmenu(buildMenuText: () => string, maxOption: number, handlers: Record<number, () => void>): void {
    let subLoop: boolean

    do {
        const subtype = inputCommands(buildMenuText(), { number: true, places: 0, placeholder: "0" })
        subLoop = !isValidSubtype(subtype, maxOption)

        if (!subLoop && !handleSubmenu(subtype)) handlers[subtype as number]?.()
    } while (subLoop)
}

function handlePolynomial(): void {
    State.current.type = "poly"

    if (!State.current.numericCoefs) State.current.resolveCoefs()
    if (!State.current.numericCoefs) return

    if (State.current.isConstant) resolveConstant()
    else if (State.current.isAffine) resolveAffine()
    else resolveQuadratic()
}

function handleExpOrLog(kind: FunctionType, label: string, resolveFn: (coefs: NumericCoefficients) => void): void {
    State.current.type = kind

    if (State.current.variableCoefs) State.current.resolveCoefs()
    if (State.current.variableCoefs) return

    if (State.current.isValidExpLog) {
        resolveFn(State.current.toNumericCoefficients())
        return
    }

    if (State.current.isConstantExpLog) {
        errorConstantFunction(label)

        if (State.current.numericA === 1) State.current.c = State.current.numericC + State.current.numericB

        State.current.a = 0
        State.current.b = 0
        State.type = 1
        State.keepType = true
        State.loop = true
        return
    }

    if (!State.current.isInvalidExpLog) return

    errorInvalidFunction(label)
    State.askCoeffs = true
    State.loop = true
}

function handleNonPolynomial(): void {
    runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.exponentialFunction")}\n2 = ${tr("main.logarithmicFunction")}\n${submenuFooter(tr("commands.back"))}`, 2, {
        1: () => handleExpOrLog("exp", tr("main.exponential"), coefs => resolveExponential(coefs)),
        2: () => handleExpOrLog("log", tr("main.logarithmic"), coefs => resolveLogarithmic(coefs)),
    })
}

function handleTrig(kind: FunctionType, label: string, resolveFn: (coefs: NumericCoefficients) => void, mergeOnZeroA = false): void {
    State.current.type = kind

    if (State.current.variableCoefs) State.current.resolveCoefs()
    if (State.current.variableCoefs) return

    if (State.current.isValidTrig) {
        resolveFn(State.current.toNumericCoefficients())
        return
    }

    if (!State.current.isConstantTrig) return

    errorConstantFunction(label)

    if (mergeOnZeroA && State.current.numericA === 0) State.current.c = State.current.numericC + State.current.numericB

    State.current.a = 0
    State.current.b = 0
    State.type = 1
    State.keepType = true
    State.loop = true
}

function handleTrigonometric(): void {
    runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.sineFunction")}\n2 = ${tr("main.cosineFunction")}\n3 = ${tr("main.tangentFunction")}\n${submenuFooter(tr("commands.back"))}`, 3, {
        1: () => handleTrig("sin", tr("main.sine"), coefs => resolveSine(coefs)),
        2: () => handleTrig("cos", tr("main.cosine"), coefs => resolveCosine(coefs), true),
        3: () => handleTrig("tan", tr("main.tangent"), coefs => resolveTangent(coefs)),
    })
}

function handleHistory(): void {
    State.loop = true

    const filtered = State.history.filter(Boolean).toReversed()

    if (filtered.length <= 1) {
        notify(tr("main.noHistory"), { explanation: tr("main.noHistoryExp") })
        return
    }

    const message = `=== ${tr("main.history")} ===\n${tr("main.whatWant")}\n${filtered.map((stored, i) => `${i + 1} ⇒ "a" = ${decimalOptions(stored.a)}; "b" = ${decimalOptions(stored.b)}; "c" = ${decimalOptions(stored.c)}`).join("")}`,
        answer = rangeOptions(message, { max: filtered.length })
    if (answer === 0) return

    const stored = filtered[answer - 1]
    if (!stored) return

    State.currentCoefs = stored

    if (State.funcChanged) State.lastSaved = State.current.toCoefficients()
}

function buildConfigOptions(): string[] {
    return [
        // Página 1
        configItem(tr("main.language"), "language"),
        configItem(tr("main.unicode"), "unicode"),
        configItem(tr("main.accents"), "accents"),
        configItem(tr("main.textCase"), "textCase"),
        configItem(tr("main.decimalSeparator"), "decimalSeparator"),
        "---",

        // Página 2
        configItem(tr("main.explanations"), "explanations"),
        configItem(tr("main.errors"), "errors"),
        configItem(tr("main.showFunction"), "showFunction"),
        configItem(tr("main.inputConfirm"), "inputConfirm"),
        configItem(tr("main.outputConfirm"), "outputConfirm"),
        configItem(tr("main.simpleMulti"), "simpleMulti"),

        // Página 3
        configItem(tr("main.decimalPlaces"), "decimalPlaces"),
        configItem(tr("main.logPrecision"), "logPrecision"),
        configItem(tr("main.divisionPrecision"), "divPrecision"),
        configItem(tr("main.iterationLimit"), "iterationLimit"),
        configItem(tr("main.degrees"), "degrees"),
        "---",
    ]
}

function buildSettingsMenu(page: number, total: number, configOptions: string[]): string {
    const start = 6 * (page - 1)

    return [
        `=== ${tr("main.settings")} ===\n${tr("commands.page")}${page}/${total}\n${tr("main.settingsNote")}`,
        ...configOptions.slice(start, start + 6).map((option, i) => `\n${i + 1} = ${option}`),
        `\n----------------\n7 = ${tr("main.restoreDefault")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
    ].join("")
}

function restoreDefaults(): void {
    if (JSON.stringify(Config) === JSON.stringify(DEFAULT_CONFIG)) {
        notify(tr("main.allSettingsDefault"), { explanation: tr("main.allSettingsDefaultExp"), type: "warning" })
        return
    }

    const changedKeys = (Object.keys(Config) as ConfigKey[]).filter(key => Config[key] !== DEFAULT_CONFIG[key])
    if (notify(`${tr("main.wantRestoreDefault")}${changedKeys.join(", ")}`, { explanation: tr("main.noteRestoreDefault"), type: "warning", asConfirm: true })) Config.reset()
}

const settingsPageActions: Record<number, Record<number, () => void>> = {
    1: {
        1: () => {
            const LANGUAGES: Language[] = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"],
                displayLocale = Config.language.replace(/-\w+$/v, m => uppercase(m)),
                languageNames = new Intl.DisplayNames([displayLocale], { type: "language" }),
                optionLines = LANGUAGES.map((lang, i) => `${i + 1} = ${languageNames.of(lang)}`),
                question = rangeOptions(`${configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`, { explanation: tr("main.noteLanguage"), min: 1, max: 6 }),
                language: Language = LANGUAGES[question - 1] ?? "pt-br"

            if (language === Config.language) return

            if (changeLanguage(language) === "same") notify(tr("commands.languageAlready"), { type: "warning" })
            changeHTML()
        },
        2: () => {
            Config.unicode = notify(configItem(tr("main.enableUnicode"), "unicode"), { type: "confirm", explanation: tr("main.noteUnicode") })
        },
        3: () => {
            Config.accents = notify(configItem(tr("main.enableAccents"), "accents"), { type: "confirm", explanation: tr("main.noteAccents") })
        },
        4: () => {
            const cases: TextCase[] = ["capitalized", "uppercase", "lowercase", "default"],
                message = [tr("main.textCaseCapitalized"), tr("main.textCaseUppercase"), tr("main.textCaseLowercase"), tr("main.textCaseNormal")].map((label, i) => `${i + 1} = ${label}`).join("\n")
            Config.textCase = cases[rangeOptions(`${configItem(tr("main.changeTextCase"), "textCase")}\n${message}`, { explanation: tr("main.noteTextCase"), min: 1, max: 4 }) - 1] ?? "default"
        },
        5: () => {
            Config.decimalSeparator = notify(configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"), { type: "confirm", explanation: `${tr("main.noteDecimalSeparator")}${decimalOptions(123.456)}${tr("main.noteDecimalSeparator2")}` })
        },
    },
    2: {
        1: () => {
            Config.explanations = notify(configItem(tr("main.enableExplanations"), "explanations"), { type: "confirm", explanation: tr("main.noteExplanations") })
        },
        2: () => {
            Config.errors = notify(configItem(tr("main.enableErrors"), "errors"), { type: "confirm", explanation: tr("main.noteErrors") })
        },
        3: () => {
            Config.showFunction = notify(configItem(tr("main.enableShowFunction"), "showFunction"), { type: "confirm", explanation: tr("main.noteShowFunction") }) ? "always" : "never"
        },
        4: () => {
            Config.inputConfirm = notify(configItem(tr("main.enableInputConfirm"), "inputConfirm"), { type: "confirm", explanation: tr("main.noteInputConfirm") })
        },
        5: () => {
            Config.outputConfirm = notify(configItem(tr("main.enableOutputConfirm"), "outputConfirm"), { type: "confirm", explanation: tr("main.noteOutputConfirm") })
        },
        6: () => {
            Config.simpleMulti = notify(configItem(tr("main.changeSimpleMulti"), "simpleMulti"), { type: "confirm", explanation: tr("main.noteSimpleMulti") })
        },
    },

    3: {
        1: () => {
            Config.decimalPlaces = rangeOptions(configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"), { explanation: tr("main.noteDecimalPlaces"), min: 3, max: 10 })

            if (!State.current.variableA) State.current.a = round(State.current.numericA)
            if (!State.current.variableB) State.current.b = round(State.current.numericB)
            if (!State.current.variableC) State.current.c = round(State.current.numericC)
        },
        2: () => {
            Config.logPrecision = rangeOptions(configItem(tr("main.whatLogPrecision"), "logPrecision"), { explanation: tr("main.noteLogPrecision"), min: 1e-12, max: 1e-6, places: 20 }) as Precision
        },
        3: () => {
            Config.divPrecision = rangeOptions(configItem(tr("main.whatDivisionPrecision"), "divPrecision"), { explanation: tr("main.noteDivisionPrecision"), min: 1e-12, max: 1e-6, places: 20 }) as Precision
        },
        4: () => {
            Config.iterationLimit = rangeOptions(configItem(tr("main.whatIterationLimit"), "iterationLimit"), { explanation: tr("main.noteIterationLimit"), min: 100, max: 10_000 })
        },
        5: () => {
            Config.degrees = notify(configItem(tr("main.changeDegrees"), "degrees"), { type: "confirm", explanation: tr("main.noteDegrees") }) ? "deg" : "rad"
        },
    },
}

function handleSettings(): void {
    let page = 1,
        choice: number | CommandsNames

    function hasChoice(c: number | CommandsNames): void {
        switch (c) {
            case 7:
                restoreDefaults()
                break
            case 8:
                page--
                break
            case 9:
                page++
                break
            case "exit":
                choice = 0
                State.type = "exit"
                break
            default:
                if (isFiniteNumber(choice)) settingsPageActions[page]?.[choice]?.()
        }
    }

    do {
        State.type = -1
        State.loop = true

        const configOptions = buildConfigOptions(),
            total = Math.ceil(configOptions.length / 6)

        page = Math.min(Math.max(page, 1), total)

        choice = rangeOptions(buildSettingsMenu(page, total, configOptions), { max: 9, commands: true })

        hasChoice(choice)

        if (isFiniteNumber(choice) && isInInterval(choice, [1, 6])) Config.save()
    } while (choice !== 0)
}

function handleReview(): void {
    notify(`${tr("main.values")}\n"a" = ${decimalOptions(State.current.a)}\n"b" = ${decimalOptions(State.current.b)}\n"c" = ${decimalOptions(State.current.c)}\n`)
    State.loop = true
}

function handleChange(): void {
    State.loop = true
    State.askCoeffs = true
}

function handleExit(): void {
    State.loop = Config.outputConfirm && !notify(tr("main.exitConfirm"), { type: "confirm", explanation: tr("main.noteSettingsExit") })
}

const TYPE_ALIASES: Record<CommandsNames, number> = { history: 6, config: 7, review: 8, change: 9, exit: 0, start: -1 },
    typeActions: Record<number, () => void> = { 1: handlePolynomial, 2: handleNonPolynomial, 3: handleTrigonometric, 6: handleHistory, 7: handleSettings, 8: handleReview, 9: handleChange, 0: handleExit }

function resolveTypeKey(type: number | CommandsNames): number {
    return isValidCommand(type) ? TYPE_ALIASES[type] : type
}

function askMainMenu(): number | CommandsNames {
    return inputCommands(`=== ${tr("main.start")} ===\n${tr("main.whatWant")}\n1 = ${tr("main.polynomialFunctions")}\n2 = ${tr("main.nonPolynomialFunctions")}\n3 = ${tr("main.trigonometricFunctions")}\n${submenuFooter(tr("main.exit"))}`, { number: true, places: 0, placeholder: "0" })
}

function saveHistory(): void {
    if (!State.funcChanged) return

    State.lastSaved = State.current.toCoefficients()
    State.history.push(State.lastSaved)

    if (State.history.length > 9) State.history = State.history.slice(1)
}

State.current.refreshCoefs()

do {
    if (State.askCoeffs) State.current.refreshCoefs()

    saveHistory()

    if (!State.keepType || State.type === "start") State.type = askMainMenu()

    State.keepType = false
    State.askCoeffs = false
    State.loop = false

    if ((isFiniteNumber(State.type) && isInInterval(State.type, [0, 3, 6, 9])) || isValidCommand(State.type)) typeActions[resolveTypeKey(State.type)]?.()
    else State.loop = true
} while (State.loop)
