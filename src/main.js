import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Checks } from "./checks.js"
import { Config, DEFAULT_CONFIG } from "./config.js"
import { Errors } from "./errors.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

Ui.notifyOptions(
    `==================================================\n` +
        `${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n` +
        `==================================================`,
    { type: "console" }
)

Config.load()

Ui.notifyOptions(tr("main.welcomeTitle"), { explanation: tr("main.welcomeDescription") })

const setMeta = (name = "", content = "") =>
        document.querySelector(`meta[name="${name}"]`)?.setAttribute("content", content),
    setProperty = (property = "", content = "") =>
        document.querySelector(`meta[property="${property}"]`)?.setAttribute("content", content),
    locales = {
        "pt-br": "pt_BR",
        "pt-pt": "pt_PT",
        "en-us": "en_US",
        "en-gb": "en_GB",
        "es-419": "es_419",
        "es-es": "es_ES",
    },
    changeHTML = () => {
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
    },
    handleSubMenu = subType => {
        if (Checks.isFiniteNumber(subType) && subType >= 6 && subType <= 9) {
            State.type = subType
            State.loop = true
            State.keepType = true
            return true
        }

        if (Checks.isValidCommand(subType)) {
            State.type = subType
            State.loop = true
            if (subType !== "exit") State.keepType = true
            return true
        }

        if (subType === 0) {
            State.loop = true
            return true
        }

        return false
    },
    isValidSubType = (subType, maxOption) =>
        (Checks.isFiniteNumber(subType) &&
            ((subType >= 0 && subType <= maxOption) || (subType >= 6 && subType <= 9))) ||
        Checks.isValidCommand(subType),
    runSubMenu = (buildMenuText, maxOption, handlers) => {
        let subLoop

        do {
            const subType = Ui.inputOptions(buildMenuText(), { number: true, places: 0, commands: true })
            subLoop = !isValidSubType(subType, maxOption)

            if (!subLoop && !handleSubMenu(subType)) handlers[subType]?.()
        } while (subLoop)
    },
    handlePolynomial = () => {
        State.current.type = "poly"

        if (!State.current.numericCoefs) State.current.resolveCoefs()
        if (!State.current.numericCoefs) return
        if (State.current.isConstant) Analyze.resolveConstant()
        else if (State.current.isAffine) Analyze.resolveAffine()
        else Analyze.resolveQuadratic()
    },
    handleExpOrLog = (kind = "exp", label, resolveFn) => {
        State.current.type = /** @type {FunctionType} */ (kind)

        if (State.current.variableCoefs) State.current.resolveCoefs()
        if (State.current.variableCoefs) return

        if (State.current.isValidExpLog) {
            resolveFn(State.current.toCoefficients())
            return
        }

        if (State.current.isConstantExpLog) {
            Errors.constantFunction(label)

            if (State.current.numericA === 1 && Checks.isFiniteNumber(State.current.numericC))
                State.current.c = State.current.numericC + State.current.numericB

            State.current.a = 0
            State.current.b = 0
            State.type = 1
            State.keepType = true
            State.loop = true
            return
        }

        if (State.current.isInvalidExpLog) {
            Errors.invalidFunction(label)
            State.askCoeffs = true
            State.loop = true
        }
    },
    handleNonPolynomial = () => {
        runSubMenu(
            () =>
                `=== Menu ===\n${tr("main.whatWant")}\n` +
                `1 = ${tr("main.exponentialFunction")}\n` +
                `2 = ${tr("main.logarithmicFunction")}\n` +
                `----------------\n` +
                `6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr(
                    "main.change"
                )} | 0 = ${tr("commands.back")}`,
            2,
            {
                1: () => handleExpOrLog("exp", tr("main.exponential"), coefs => Analyze.resolveExponential(coefs)),
                2: () => handleExpOrLog("log", tr("main.logarithmic"), coefs => Analyze.resolveLogarithmic(coefs)),
            }
        )
    },
    handleTrig = (kind = "sin", label, resolveFn, mergeOnZeroA = false) => {
        State.current.type = /** @type {FunctionType} */ (kind)

        if (State.current.variableCoefs) State.current.resolveCoefs()
        if (State.current.variableCoefs) return

        if (State.current.isValidTrig) {
            resolveFn(State.current.toCoefficients())
            return
        }

        if (State.current.isConstantTrig) {
            Errors.constantFunction(label)

            if (mergeOnZeroA && State.current.numericA === 0 && Checks.isFiniteNumber(State.current.numericC))
                State.current.c = State.current.numericC + State.current.numericB

            State.current.a = 0
            State.current.b = 0
            State.type = 1
            State.keepType = true
            State.loop = true
        }
    },
    handleTrigonometric = () => {
        runSubMenu(
            () =>
                `=== Menu ===\n${tr("main.whatWant")}\n` +
                `1 = ${tr("main.sineFunction")}\n` +
                `2 = ${tr("main.cosineFunction")}\n` +
                `3 = ${tr("main.tangentFunction")}\n` +
                `----------------\n` +
                `6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr(
                    "main.change"
                )} | 0 = ${tr("commands.back")}`,
            3,
            {
                1: () => handleTrig("sin", tr("main.sine"), coefs => Analyze.resolveSine(coefs)),
                2: () => handleTrig("cos", tr("main.cosine"), coefs => Analyze.resolveCosine(coefs), true),
                3: () => handleTrig("tan", tr("main.tangent"), coefs => Analyze.resolveTangent(coefs)),
            }
        )
    },
    handleHistory = () => {
        State.loop = true

        if (State.history.length <= 1) {
            Ui.notifyOptions(tr("main.noHistory"), { explanation: tr("main.noHistoryExp") })
            return
        }

        const message = `=== ${tr("main.history")} ===\n${tr("main.whatWant")}\n${State.history
                .filter(Boolean)
                .toReversed()
                .map(
                    (stored, i) =>
                        `${i + 1} ⇒ “a” = ${Writing.decimalOptions(stored.a)}; “b” = ${Writing.decimalOptions(stored.b)}; “c” = ${Writing.decimalOptions(stored.c)}`
                )
                .join("")}`,
            answer = Ui.rangeOptions(message, { max: State.history.length })
        if (answer === 0) return

        const stored = State.history.at(-answer)
        if (!stored) return

        State.current.a = stored.a
        State.current.b = stored.b
        State.current.c = stored.c

        if (State.funcChanged) State.lastSaved = State.current.toCoefficients()
    },
    buildConfigOptions = () => [
        // Página 1
        Writing.configItem(tr("main.language"), "language"),
        Writing.configItem(tr("main.unicode"), "unicode"),
        Writing.configItem(tr("main.accents"), "accents"),
        Writing.configItem(tr("main.textCase"), "textCase"),
        Writing.configItem(tr("main.decimalSeparator"), "decimalSeparator"),
        "---",

        // Página 2
        Writing.configItem(tr("main.explanations"), "explanations"),
        Writing.configItem(tr("main.errors"), "errors"),
        Writing.configItem(tr("main.showFunction"), "showFunction"),
        Writing.configItem(tr("main.inputConfirm"), "inputConfirm"),
        Writing.configItem(tr("main.outputConfirm"), "outputConfirm"),
        Writing.configItem(tr("main.simpleMulti"), "simpleMulti"),

        // Página 3
        Writing.configItem(tr("main.decimalPlaces"), "decimalPlaces"),
        Writing.configItem(tr("main.logPrecision"), "logPrecision"),
        Writing.configItem(tr("main.divisionPrecision"), "divPrecision"),
        Writing.configItem(tr("main.iterationLimit"), "iterationLimit"),
        Writing.configItem(tr("main.degrees"), "degrees"),
        "---",
    ],
    /**
     * @param {Numeric} page
     * @param {Numeric} total
     * @param {Str[]} configOptions
     */
    buildSettingsMenu = (page, total, configOptions) => {
        let text = `=== ${tr("main.settings")} ===\n${tr("commands.page")}${String(page)}/${String(
            total
        )}\n${tr("main.settingsNote")}`

        for (let option = 1; option <= 6; option++)
            text += `\n${String(option)} = ${String(configOptions[option - 1 + 6 * (page - 1)])}`

        text +=
            `\n----------------\n` +
            `7 = ${tr("main.restoreDefault")} | 8 = ${tr("commands.previous")} | 9 = ${tr(
                "commands.next"
            )} | 0 = ${tr("commands.back")}`

        return text
    },
    restoreDefaults = () => {
        if (JSON.stringify(Config) === JSON.stringify(DEFAULT_CONFIG)) {
            Ui.notifyOptions(tr("main.allSettingsDefault"), {
                explanation: tr("main.allSettingsDefaultExp"),
                type: "warning",
            })
            return
        }

        const changedKeys = /** @type {(import("./config.js").ConfigKey)[]} */ (Object.keys(Config)).filter(
            key => Config[key] !== DEFAULT_CONFIG[key]
        )
        if (
            Ui.notifyOptions(tr("main.wantRestoreDefault") + changedKeys.join(", "), {
                explanation: tr("main.noteRestoreDefault"),
                type: "warning",
                asConfirm: true,
            })
        )
            Config.reset()
    },
    settingsPageActions = {
        1: {
            1: () => {
                /** @type {Language[]} */ const LANGUAGES = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"],
                    displayLocale = Config.language.replace(/(?:-\w+)$/, m => Writing.uppercase(m)),
                    languageNames = new Intl.DisplayNames([displayLocale], { type: "language" }),
                    optionLines = LANGUAGES.map((lang, index) => `${index + 1} = ${languageNames.of(lang)}`),
                    question = Ui.rangeOptions(
                        `${Writing.configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`,
                        { explanation: tr("main.noteLanguage"), min: 1, max: 6 }
                    ),
                    /** @type {Language} */ language = LANGUAGES[question - 1] ?? "pt-br"

                if (language !== Config.language) {
                    changeLanguage(language)
                    changeHTML()
                }
            },
            2: () => {
                Config.unicode = Ui.notifyOptions(Writing.configItem(tr("main.enableUnicode"), "unicode"), {
                    type: "confirm",
                    explanation: tr("main.noteUnicode"),
                })
            },
            3: () => {
                Config.accents = Ui.notifyOptions(Writing.configItem(tr("main.enableAccents"), "accents"), {
                    type: "confirm",
                    explanation: tr("main.noteAccents"),
                })
            },
            4: () => {
                /** @type {TextCase[]} */ const cases = ["capitalized", "uppercase", "lowercase", "normal"]
                Config.textCase =
                    cases[
                        Ui.rangeOptions(
                            `${Writing.configItem(tr("main.changeTextCase"), "textCase")}\n${[
                                tr("main.textCaseCapitalized"),
                                tr("main.textCaseUppercase"),
                                tr("main.textCaseLowercase"),
                                tr("main.textCaseNormal"),
                            ]
                                .map((label, index) => `${index + 1} = ${label}`)
                                .join("\n")}`,
                            { explanation: tr("main.noteTextCase"), min: 1, max: 4 }
                        ) - 1
                    ] ?? "normal"
            },
            5: () => {
                Config.decimalSeparator = Ui.notifyOptions(
                    Writing.configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"),
                    {
                        type: "confirm",
                        explanation:
                            tr("main.noteDecimalSeparator") +
                            Writing.decimalOptions(123.456) +
                            tr("main.noteDecimalSeparator2"),
                    }
                )
            },
        },

        2: {
            1: () => {
                Config.explanations = Ui.notifyOptions(
                    Writing.configItem(tr("main.enableExplanations"), "explanations"),
                    { type: "confirm", explanation: tr("main.noteExplanations") }
                )
            },
            2: () => {
                Config.errors = Ui.notifyOptions(Writing.configItem(tr("main.enableErrors"), "errors"), {
                    type: "confirm",
                    explanation: tr("main.noteErrors"),
                })
            },
            3: () => {
                Config.showFunction = Ui.notifyOptions(
                    Writing.configItem(tr("main.enableShowFunction"), "showFunction"),
                    { type: "confirm", explanation: tr("main.noteShowFunction") }
                )
            },
            4: () => {
                Config.inputConfirm = Ui.notifyOptions(
                    Writing.configItem(tr("main.enableInputConfirm"), "inputConfirm"),
                    { type: "confirm", explanation: tr("main.noteInputConfirm") }
                )
            },
            5: () => {
                Config.outputConfirm = Ui.notifyOptions(
                    Writing.configItem(tr("main.enableOutputConfirm"), "outputConfirm"),
                    { type: "confirm", explanation: tr("main.noteOutputConfirm") }
                )
            },
            6: () => {
                Config.simpleMulti = Ui.notifyOptions(Writing.configItem(tr("main.changeSimpleMulti"), "simpleMulti"), {
                    type: "confirm",
                    explanation: tr("main.noteSimpleMulti"),
                })
            },
        },

        3: {
            1: () => {
                Config.decimalPlaces = Ui.rangeOptions(
                    Writing.configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"),
                    { explanation: tr("main.noteDecimalPlaces"), min: 3, max: 10 }
                )

                if (!State.current.variableA) State.current.a = Algebra.round(State.current.numericA)
                if (!State.current.variableB) State.current.b = Algebra.round(State.current.numericB)
                if (!State.current.variableC) State.current.c = Algebra.round(State.current.numericC)
            },
            2: () => {
                Config.logPrecision = /** @type {Precision} */ (
                    Ui.rangeOptions(Writing.configItem(tr("main.whatLogPrecision"), "logPrecision"), {
                        explanation: tr("main.noteLogPrecision"),
                        min: 1e-12,
                        max: 1e-6,
                        places: 20,
                    })
                )
            },
            3: () => {
                Config.divPrecision = /** @type {Precision} */ (
                    Ui.rangeOptions(Writing.configItem(tr("main.whatDivisionPrecision"), "divPrecision"), {
                        explanation: tr("main.noteDivisionPrecision"),
                        min: 1e-12,
                        max: 1e-6,
                        places: 20,
                    })
                )
            },
            4: () => {
                Config.iterationLimit = Ui.rangeOptions(
                    Writing.configItem(tr("main.whatIterationLimit"), "iterationLimit"),
                    { explanation: tr("main.noteIterationLimit"), min: 100, max: 10000 }
                )
            },
            5: () => {
                Config.degrees = Ui.notifyOptions(Writing.configItem(tr("main.changeDegrees"), "degrees"), {
                    type: "confirm",
                    explanation: tr("main.noteDegrees"),
                })
                    ? "deg"
                    : "rad"
            },
        },
    },
    handleSettings = () => {
        let page = 1,
            choice

        do {
            State.type = -1
            State.loop = true

            const configOptions = buildConfigOptions(),
                total = Math.ceil(configOptions.length / 6)

            if (page < 1) page = 1
            if (page > total) page = total

            choice = Ui.rangeOptions(buildSettingsMenu(page, total, configOptions), { max: 9, commands: true })

            if (choice === 7) restoreDefaults()
            else if (choice === 8) {
                choice = -1
                page--
            } else if (choice === 9) {
                choice = -1
                page++
            } else if (choice === "config") choice = -1
            else if (choice === "exit") {
                choice = 0
                State.type = "exit"
            } else if (Checks.isFiniteNumber(choice)) {
                /** @type {Record<Numeric, Record<Numeric, () => void> | undefined>} */ const pageActions =
                    settingsPageActions
                pageActions[page]?.[choice]?.()
            }

            if (Checks.isFiniteNumber(choice) && choice >= 1 && choice <= 6) Config.save()
        } while (choice !== 0)
    },
    handleReview = () => {
        Ui.notifyOptions(
            `${tr("main.values")}\n` +
                `“a” = ${Writing.decimalOptions(State.current.a)}\n` +
                `“b” = ${Writing.decimalOptions(State.current.b)}\n` +
                `“c” = ${Writing.decimalOptions(State.current.c)}\n`
        )
        State.loop = true
    },
    handleChange = () => {
        State.loop = true
        State.askCoeffs = true
    },
    handleExit = () => {
        State.loop = Config.outputConfirm
            ? !Ui.notifyOptions(tr("main.exitConfirm"), { type: "confirm", explanation: tr("main.noteSettingsExit") })
            : false
    },
    TYPE_ALIASES = { history: 6, config: 7, review: 8, change: 9, exit: 0 },
    /** @type {Record<Numeric, () => void>} */ typeActions = {
        1: handlePolynomial,
        2: handleNonPolynomial,
        3: handleTrigonometric,
        6: handleHistory,
        7: handleSettings,
        8: handleReview,
        9: handleChange,
        0: handleExit,
    },
    resolveTypeKey = type => (Checks.isValidCommand(type) ? TYPE_ALIASES[type] : type),
    askMainMenu = () =>
        Ui.inputOptions(
            `=== ${tr("main.start")} ===\n${tr("main.whatWant")}\n` +
                `1 = ${tr("main.polynomialFunctions")}\n` +
                `2 = ${tr("main.nonPolynomialFunctions")}\n` +
                `3 = ${tr("main.trigonometricFunctions")}\n` +
                `----------------\n` +
                `6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr("main.change")} | 0 = ${tr("main.exit")}`,
            { number: true, places: 0, commands: true }
        ),
    saveHistory = () => {
        if (!State.funcChanged) return

        State.lastSaved = State.current.toCoefficients()
        State.history.push(State.lastSaved)

        if (State.history.length > 9) State.history.shift()
    }

State.current.refreshCoefs()

do {
    if (State.askCoeffs) State.current.refreshCoefs()

    saveHistory()

    if (!State.keepType || State.type === "start") State.type = askMainMenu()

    State.keepType = false
    State.askCoeffs = false
    State.loop = false

    if (
        (Checks.isFiniteNumber(State.type) &&
            ((State.type >= 0 && State.type <= 3) || (State.type >= 6 && State.type <= 9))) ||
        Checks.isValidCommand(State.type)
    )
        typeActions[resolveTypeKey(State.type)]?.()
    else State.loop = true
} while (State.loop)

changeHTML()
