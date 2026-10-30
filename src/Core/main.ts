import { isInInterval, isNumber } from "../Base/checks.js"
import { Config, type ConfigKey, DEFAULT_CONFIG } from "../Base/config.js"
import { INPUT_FAILED } from "../Base/consts.js"
import { ensureReal, toPlaces, toPrecision } from "../Base/quantity.js"
import { tr } from "../Lang/i18n.js"
import { configItem, decimalOptions, uppercase } from "../Lang/writing.js"
import { resolveUnknown } from "../Math/algebra.js"
import { settleCoef } from "../Math/math.js"
import { State } from "../Math/state.js"
import { algebraIO } from "../UI/algebraIO.js"
import { isValidCommand } from "../UI/commands.js"
import { confirmLanguageChange, isActionConfirmed, notify } from "../UI/display.js"
import { inputCommands, rangeOptions } from "../UI/ui.js"
import { VERSION } from "../version.js"
import { resolveAffine, resolveConstant, resolveCosine, resolveExponential, resolveLogarithmic, resolveQuadratic, resolveSine, resolveTangent } from "./analyze.js"

await notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`, { type: "console" })

Config.load()

if (Config.showWelcome === "on") await notify(tr("main.welcomeTitle"), { explanation: tr("main.welcomeDescription") })
Config.showWelcome = "off"

if (State.current.load() === "loaded") {
    if (await isActionConfirmed(tr("math.save"))) State.askCoeffs = "off"
    else State.current.reset()
}

const LOCALES: Record<Language, string> = { "pt-br": "pt_BR", "pt-pt": "pt_PT", "en-us": "en_US", "en-gb": "en_GB", "es-419": "es_419", "es-es": "es_ES" },
    TITLE_METAS = `meta[name="title"], meta[property="og:title"], meta[name="twitter:title"]`,
    DESCRIPTION_METAS = `meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]`,
    LOCALE_METAS = `meta[property="og:locale"]`

function setMetaContent(selector: string, content: string): void {
    for (const meta of document.querySelectorAll(selector)) meta.setAttribute("content", content)
}

function localizeDocument(): void {
    const title: string = tr("commands.title")

    document.documentElement.lang = Config.language
    document.title = title
    document.querySelector("h1")?.replaceChildren(tr("main.h1"))

    setMetaContent(TITLE_METAS, title)
    setMetaContent(DESCRIPTION_METAS, tr("main.documentDescription"))
    setMetaContent(LOCALE_METAS, LOCALES[Config.language])
}

localizeDocument()

function submenuFooter(backLabel: string): string {
    return `----------------\n6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr("main.change")} | 0 = ${backLabel}`
}

async function runSubmenu(buildMenuText: () => string, maxOption: number, handlers: Record<number, () => Promise<void>>): Promise<void> {
    let isSubLoop: boolean

    do {
        const subtype = await inputCommands(buildMenuText(), { type: "number", places: 0, placeholder: "0" })
        if (subtype === INPUT_FAILED) return

        isSubLoop = !((isNumber(subtype) && isInInterval(subtype, [0, maxOption, 6, 9])) || isValidCommand(subtype))

        if (!isSubLoop) {
            if (isNumber(subtype) && isInInterval(subtype, [6, 9])) {
                State.menuChoice = subtype
                State.loop = "on"
                State.keepChoice = "on"
            } else if (isValidCommand(subtype)) {
                State.menuChoice = subtype
                State.loop = "on"
                if (subtype !== "exit") State.keepChoice = "on"
            } else if (subtype === 0) State.loop = "on"
            else await handlers[subtype]?.()
        }
    } while (isSubLoop)
}

async function handleExpOrLog(kind: FunctionType, label: string, resolveFunction: (coefs: NumericCoefficients) => Promise<void>): Promise<void> {
    State.current.type = kind

    if (State.current.variableCoefs) State.current.resolveCoefs(await resolveUnknown(algebraIO, State.current.toCoefficients(), State.current.type))
    if (State.current.variableCoefs) return

    if (State.current.isValidExpLog) {
        await resolveFunction(State.current.toNumericCoefficients())
        return
    }

    if (State.current.isConstantExpLog) {
        await notify(tr("errors.error004", { type: label }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" })

        if (State.current.numericA === 1) State.current.c = State.current.numericC + State.current.numericB

        State.current.a = 0
        State.current.b = 0
        State.menuChoice = 1
        State.keepChoice = "on"
        State.loop = "on"
        return
    }

    if (!State.current.isInvalidExpLog) return

    await notify(tr("errors.error005", { type: label }), { explanation: "a < 0", type: "error" })
    State.askCoeffs = "on"
    State.loop = "on"
}

async function handleTrig(kind: FunctionType, label: string, resolveFunction: (coefs: NumericCoefficients) => Promise<void>, shouldMerge = false): Promise<void> {
    State.current.type = kind

    if (State.current.variableCoefs) State.current.resolveCoefs(await resolveUnknown(algebraIO, State.current.toCoefficients(), State.current.type))
    if (State.current.variableCoefs) return

    if (State.current.isValidTrig) {
        await resolveFunction(State.current.toNumericCoefficients())
        return
    }

    if (!State.current.isConstantTrig) return

    await notify(tr("errors.error004", { type: label }), { explanation: "(a = 0) ∨ (b = 0)", type: "error" })
    if (shouldMerge && State.current.numericA === 0) State.current.c = State.current.numericC + State.current.numericB

    State.current.a = 0
    State.current.b = 0
    State.menuChoice = 1
    State.keepChoice = "on"
    State.loop = "on"
}

const settingsPageActions: Record<number, Record<number, () => Promise<void>>> = {
        1: {
            1: async () => {
                const LANGUAGES: Language[] = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"],
                    displayLocale = Config.language.replace(/-\w+$/v, m => uppercase(m)),
                    languageNames = new Intl.DisplayNames([displayLocale], { type: "language" }),
                    optionLines = LANGUAGES.map((lang, index) => `${index + 1} = ${languageNames.of(lang)}`),
                    question = await rangeOptions(`${configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`, { explanation: tr("main.noteLanguage"), min: 1, max: 6 }),
                    language: Language = LANGUAGES.at(question - 1) ?? "pt-br"

                if (Config.language === language) await notify(tr("commands.languageAlready"), { type: "warning" })

                const result = await confirmLanguageChange(language)

                if (result === "same") await notify(tr("commands.languageAlready"), { type: "warning" })
                else if (result === "changed") localizeDocument()
            },
            2: async () => {
                Config.showUnicode = (await isActionConfirmed(configItem(tr("main.enableUnicode"), "showUnicode"), { explanation: tr("main.noteUnicode") })) ? "on" : "off"
            },
            3: async () => {
                Config.showAccents = (await isActionConfirmed(configItem(tr("main.enableAccents"), "showAccents"), { explanation: tr("main.noteAccents") })) ? "on" : "off"
            },
            4: async () => {
                const cases: TextCase[] = ["capitalized", "uppercase", "lowercase", "default"],
                    message = [tr("main.textCaseCapitalized"), tr("main.textCaseUppercase"), tr("main.textCaseLowercase"), tr("main.textCaseNormal")].map((label, index) => `${index + 1} = ${label}`).join("\n"),
                    choice = await rangeOptions(`${configItem(tr("main.changeTextCase"), "textCase")}\n${message}`, { explanation: tr("main.noteTextCase"), min: 1, max: 4 })
                Config.textCase = cases.at(choice - 1) ?? "default"
            },
            5: async () => {
                Config.decimalSeparator = (await isActionConfirmed(configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"), { explanation: `${tr("main.noteDecimalSeparator")}${decimalOptions(123.456)}${tr("main.noteDecimalSeparator2")}` })) ? "comma" : "dot"
            },
        },
        2: {
            1: async () => {
                Config.showExplanations = (await isActionConfirmed(configItem(tr("main.enableExplanations"), "showExplanations"), { explanation: tr("main.noteExplanations") })) ? "on" : "off"
            },
            2: async () => {
                Config.showErrors = (await isActionConfirmed(configItem(tr("main.enableErrors"), "showErrors"), { explanation: tr("main.noteErrors") })) ? "on" : "off"
            },
            3: async () => {
                Config.showFunction = (await isActionConfirmed(configItem(tr("main.enableShowFunction"), "showFunction"), { explanation: tr("main.noteShowFunction") })) ? "on" : "off"
            },
            4: async () => {
                Config.inputConfirm = (await isActionConfirmed(configItem(tr("main.enableInputConfirm"), "inputConfirm"), { explanation: tr("main.noteInputConfirm") })) ? "on" : "off"
            },
            5: async () => {
                Config.exitConfirm = (await isActionConfirmed(configItem(tr("main.enableOutputConfirm"), "exitConfirm"), { explanation: tr("main.noteOutputConfirm") })) ? "on" : "off"
            },
            6: async () => {
                Config.implicitMulti = (await isActionConfirmed(configItem(tr("main.changeSimpleMulti"), "implicitMulti"), { explanation: tr("main.noteSimpleMulti") })) ? "on" : "off"
            },
        },
        3: {
            1: async () => {
                Config.decimalPlaces = toPlaces(await rangeOptions(configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"), { explanation: tr("main.noteDecimalPlaces"), min: 3, max: 10 })) ?? Config.decimalPlaces
                State.current.a = settleCoef(State.current.a)
                State.current.b = settleCoef(State.current.b)
                State.current.c = settleCoef(State.current.c)
            },
            2: async () => {
                Config.logPrecision = toPrecision(await rangeOptions(configItem(tr("main.whatLogPrecision"), "logPrecision"), { explanation: tr("main.noteLogPrecision"), min: 1e-12, max: 1e-6, places: 20 })) ?? Config.logPrecision
            },
            3: async () => {
                Config.divPrecision = toPrecision(await rangeOptions(configItem(tr("main.whatDivisionPrecision"), "divPrecision"), { explanation: tr("main.noteDivisionPrecision"), min: 1e-12, max: 1e-6, places: 20 })) ?? Config.divPrecision
            },
            4: async () => {
                Config.iterationLimit = await rangeOptions(configItem(tr("main.whatIterationLimit"), "iterationLimit"), { explanation: tr("main.noteIterationLimit"), min: 100, max: 10_000, places: 0 })
            },
            5: async () => {
                Config.angleUnit = (await isActionConfirmed(configItem(tr("main.changeDegrees"), "angleUnit"), { explanation: tr("main.noteDegrees") })) ? "deg" : "rad"
            },
        },
    },
    TYPE_ALIASES: Record<CommandNames, number> = { history: 6, config: 7, review: 8, change: 9, exit: 0, start: -1 }

async function runHistoryMenu(): Promise<void> {
    State.loop = "on"

    const filtered = State.history.filter(Boolean).toReversed()

    if (filtered.length <= 1) {
        await notify(tr("main.noHistory"), { explanation: tr("main.noHistoryExp") })
        return
    }

    const message = `=== ${tr("main.history")} ===\n${tr("main.whatWant")}\n${filtered.map((stored, index) => `${index + 1} ⇒ "a" = ${decimalOptions(stored.a)}; "b" = ${decimalOptions(stored.b)}; "c" = ${decimalOptions(stored.c)}`).join("\n")}`,
        answer = await rangeOptions(message, { max: ensureReal(filtered.length) }),
        stored = answer === 0 ? null : filtered.at(answer - 1)

    if (stored == null) return

    State.currentCoefs = stored

    if (State.funcChanged) State.lastRecorded = State.current.toCoefficients()
}

async function runSettingsMenu(): Promise<void> {
    let page = 1,
        choice: number | CommandNames

    do {
        State.menuChoice = -1
        State.loop = "on"

        const configOptions: string[] = [
                configItem(tr("main.language"), "language"),
                configItem(tr("main.unicode"), "showUnicode"),
                configItem(tr("main.accents"), "showAccents"),
                configItem(tr("main.textCase"), "textCase"),
                configItem(tr("main.decimalSeparator"), "decimalSeparator"),
                "---",

                configItem(tr("main.explanations"), "showExplanations"),
                configItem(tr("main.errors"), "showErrors"),
                configItem(tr("main.showFunction"), "showFunction"),
                configItem(tr("main.inputConfirm"), "inputConfirm"),
                configItem(tr("main.outputConfirm"), "exitConfirm"),
                configItem(tr("main.simpleMulti"), "implicitMulti"),

                configItem(tr("main.decimalPlaces"), "decimalPlaces"),
                configItem(tr("main.logPrecision"), "logPrecision"),
                configItem(tr("main.divisionPrecision"), "divPrecision"),
                configItem(tr("main.iterationLimit"), "iterationLimit"),
                configItem(tr("main.degrees"), "angleUnit"),
                "---",
            ],
            total = Math.ceil(configOptions.length / 6)

        page = Math.min(Math.max(page, 1), total)

        const start = 6 * (page - 1)

        choice = await rangeOptions(
            [
                `=== ${tr("main.settings")} ===\n${tr("commands.page")}${page}/${total}\n${tr("main.settingsNote")}`,
                ...configOptions.slice(start, start + 6).map((option, index) => `\n${index + 1} = ${option}`),
                `\n----------------\n7 = ${tr("main.restoreDefault")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
            ].join(""),
            { max: 9, commands: true },
        )

        if (choice === 7) {
            if (JSON.stringify(Config) === JSON.stringify(DEFAULT_CONFIG)) await notify(tr("main.allSettingsDefault"), { explanation: tr("main.allSettingsDefaultExp"), type: "warning" })
            else {
                const changedKeys = (Object.keys(Config) as ConfigKey[]).filter(key => Config[key] !== DEFAULT_CONFIG[key])
                if (await isActionConfirmed(`${tr("main.wantRestoreDefault")}${changedKeys.join(", ")}`, { type: "warning", explanation: tr("main.noteRestoreDefault") })) {
                    Config.reset()
                    localizeDocument()
                }
            }
        } else if (choice === 8) page--
        else if (choice === 9) page++
        else if (choice === "exit") {
            choice = 0
            State.menuChoice = "exit"
        } else if (isNumber(choice)) {
            const pageActions = settingsPageActions[page],
                action = pageActions?.[choice]
            if (action) await action()
        }

        if (isNumber(choice) && isInInterval(choice, [1, 6])) Config.save()
    } while (choice !== 0)
}

do {
    if (State.askCoeffs === "on") await State.current.refreshCoefs(algebraIO)

    if (State.funcChanged) {
        State.lastRecorded = State.current.toCoefficients()
        State.history.push(State.lastRecorded)

        if (State.history.length > 9) State.history = State.history.slice(1)
    }

    if (State.keepChoice === "off" || State.menuChoice === "start") {
        State.menuChoice = await inputCommands(`=== ${tr("main.start")} ===\n${tr("main.whatWant")}\n1 = ${tr("main.polynomialFunctions")}\n2 = ${tr("main.nonPolynomialFunctions")}\n3 = ${tr("main.trigonometricFunctions")}\n${submenuFooter(tr("main.exit"))}`, {
            type: "number",
            places: 0,
            placeholder: "0",
        })
    }

    State.keepChoice = "off"
    State.askCoeffs = "off"
    State.loop = "off"

    if ((isNumber(State.menuChoice) && isInInterval(State.menuChoice, [0, 3, 6, 9])) || isValidCommand(State.menuChoice)) {
        const menuKey = isValidCommand(State.menuChoice) ? TYPE_ALIASES[State.menuChoice] : State.menuChoice

        if (menuKey === 1) {
            State.current.type = "poly"

            if (!State.current.numericCoefs) State.current.resolveCoefs(await resolveUnknown(algebraIO, State.current.toCoefficients(), State.current.type))

            State.current.isConstant ? await resolveConstant() : State.current.isAffine ? await resolveAffine() : await resolveQuadratic()
        } else if (menuKey === 2)
            await runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.exponentialFunction")}\n2 = ${tr("main.logarithmicFunction")}\n${submenuFooter(tr("commands.back"))}`, 2, {
                1: async () => handleExpOrLog("exp", tr("main.exponential"), async coefs => resolveExponential(coefs)),
                2: async () => handleExpOrLog("log", tr("main.logarithmic"), async coefs => resolveLogarithmic(coefs)),
            })
        else if (menuKey === 3)
            await runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.sineFunction")}\n2 = ${tr("main.cosineFunction")}\n3 = ${tr("main.tangentFunction")}\n${submenuFooter(tr("commands.back"))}`, 3, {
                1: async () => handleTrig("sin", tr("main.sine"), async coefs => resolveSine(coefs)),
                2: async () => handleTrig("cos", tr("main.cosine"), async coefs => resolveCosine(coefs), true),
                3: async () => handleTrig("tan", tr("main.tangent"), async coefs => resolveTangent(coefs)),
            })
        else if (menuKey === 6) await runHistoryMenu()
        else if (menuKey === 7) await runSettingsMenu()
        else if (menuKey === 8) {
            await notify(`${tr("main.values")}\n"a" = ${decimalOptions(State.current.a)}\n"b" = ${decimalOptions(State.current.b)}\n"c" = ${decimalOptions(State.current.c)}\n`)
            State.loop = "on"
        } else if (menuKey === 9) {
            State.loop = "on"
            State.askCoeffs = "on"
        } else if (menuKey === 0) State.loop = Config.exitConfirm === "on" && !(await isActionConfirmed(tr("main.exitConfirm"), { explanation: tr("main.noteSettingsExit") })) ? "on" : "off"
    } else State.loop = "on"
} while (State.loop === "on")

Config.save()
State.current.save()
