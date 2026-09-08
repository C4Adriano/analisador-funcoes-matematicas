import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Checks } from "./checks.js"
import { Commands } from "./commands.js"
import { Config, DEFAULT_CONFIG, loadConfig, resetConfig, saveConfig } from "./config.js"
import { Errors } from "./errors.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

Ui.display(
    `====================================================` +
        `\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026` +
        `\n` +
        `====================================================`,
    "",
    true
)

loadConfig()

Ui.display(tr("main.welcomeTitle"), tr("main.welcomeDescription"))

// === OBJETOS GLOBAIS ===
function setMeta(name = "", content = "") {
    const meta = document.querySelector(`meta[name="${name}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

function setProperty(property = "", content = "") {
    const meta = document.querySelector(`meta[property="${property}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

const locales = {
    "pt-br": "pt_BR",
    "pt-pt": "pt_PT",
    "en-us": "en_US",
    "en-gb": "en_GB",
    "es-419": "es_419",
    "es-es": "es_ES",
}

function changeHTML() {
    const title = tr("commands.title")
    const description = tr("main.documentDescription")

    document.documentElement.lang = Config.language
    setProperty("og:locale", locales[Config.language])
    document.title = title

    const h1 = document.querySelector("h1")
    if (h1) {
        h1.textContent = tr("main.h1")
    } else {
        Ui.error("[main] Elemento “h1” não encontrado no DOM.", "", true)
    }

    setMeta("title", title)
    setMeta("description", description)
    setProperty("og:title", title)
    setProperty("og:description", description)
    setMeta("twitter:title", title)
    setMeta("twitter:description", description)
}

changeHTML()

// === HELPERS COMPARTILHADOS ===

function hasKnownCoefficients() {
    return (
        Checks.isFiniteNumber(State.globalA) &&
        Checks.isFiniteNumber(State.globalB) &&
        Checks.isFiniteNumber(State.globalC)
    )
}

function areCoefficientsUnknown() {
    return State.globalA == "a" || State.globalB == "b" || State.globalC == "c"
}

function resolveUnknownCoefficients(kind) {
    State.coefficients = Algebra.resolveUnknown({ a: State.globalA, b: State.globalB, c: State.globalC }, kind)
    State.globalA = Algebra.round(State.coefficients.a)
    State.globalB = Algebra.round(State.coefficients.b)
    State.globalC = Algebra.round(State.coefficients.c)
}

// === LOOP DE MENU (compartilhado entre não-polinomial e trigonométrica) ===

function isValidSubType(subType, maxOption) {
    return (subType >= 0 && subType <= maxOption) || (subType >= 6 && subType <= 9) || Commands.names.includes(subType)
}

function handleSubMenuCommand(subType) {
    if (subType >= 6 && subType <= 9) {
        State.type = subType
        State.loop = true
        State.keepType = true
        return true
    }

    if (Commands.names.includes(subType)) {
        State.type = subType
        State.loop = true
        if (subType != "exit") {
            State.keepType = true
        }
        return true
    }

    if (subType == 0) {
        State.loop = true
        return true
    }

    return false
}

function runSubMenu(buildMenuText, maxOption, handlers) {
    let subLoop

    do {
        const subType = Ui.input(buildMenuText(), "", true, 0, true)
        subLoop = !isValidSubType(subType, maxOption)

        if (!subLoop && !handleSubMenuCommand(subType)) {
            handlers[subType]?.()
        }
    } while (subLoop)
}

// === TIPO 1: POLINOMIAL ===

function handlePolynomial() {
    if (!hasKnownCoefficients()) {
        resolveUnknownCoefficients()
    }

    if (!hasKnownCoefficients()) return

    if (State.globalA == 0 && State.globalB == 0) {
        Analyze.resolveConstant({ c: State.globalC })
    } else if (State.globalA == 0) {
        Analyze.resolveAffine({ b: State.globalB, c: State.globalC })
    } else {
        Analyze.resolveQuadratic({ a: State.globalA, b: State.globalB, c: State.globalC })
    }
}

// === TIPO 2: NÃO POLINOMIAL (exponencial / logarítmica) ===

function handleExpOrLog(kind, label, resolveFn) {
    if (areCoefficientsUnknown()) {
        resolveUnknownCoefficients(kind)
    }

    if (areCoefficientsUnknown()) return

    const isValidBase =
        Checks.isFiniteNumber(State.globalA) &&
        Checks.isFiniteNumber(State.globalB) &&
        State.globalA > 0 &&
        State.globalA != 1 &&
        State.globalB != 0

    if (isValidBase) {
        resolveFn({ a: State.globalA, b: State.globalB, c: State.globalC })
        return
    }

    if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
        Errors.constantFunction(label)

        if (State.globalA == 1 && Checks.isFiniteNumber(State.globalB) && Checks.isFiniteNumber(State.globalC)) {
            State.globalC += State.globalB
        }

        State.globalA = 0
        State.globalB = 0
        State.type = 1
        State.keepType = true
        State.loop = true
        return
    }

    if (Checks.isFiniteNumber(State.globalA) && State.globalA < 0) {
        Errors.invalidFunction(label)
        State.askCoeffs = true
        State.loop = true
    }
}

function handleNonPolynomial() {
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
}

// === TIPO 3: TRIGONOMÉTRICA (seno / cosseno / tangente) ===

function handleTrig(kind, label, resolveFn, mergeOnZeroA = false) {
    if (areCoefficientsUnknown()) {
        resolveUnknownCoefficients(kind)
    }

    if (areCoefficientsUnknown()) return

    if (State.globalA != 0 && State.globalB != 0) {
        resolveFn({ a: State.globalA, b: State.globalB, c: State.globalC })
        return
    }

    if (State.globalA == 0 || State.globalB == 0) {
        Errors.constantFunction(label)

        if (
            mergeOnZeroA &&
            State.globalA == 0 &&
            Checks.isFiniteNumber(State.globalC) &&
            Checks.isFiniteNumber(State.globalB)
        ) {
            State.globalC += State.globalB
        }

        State.globalA = 0
        State.globalB = 0
        State.type = 1
        State.keepType = true
        State.loop = true
    }
}

function handleTrigonometric() {
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
}

// === TIPO 6: HISTÓRICO ===

function handleHistory() {
    State.loop = true

    if (State.history.length <= 1) {
        Ui.display(tr("main.noHistory"), tr("main.noHistoryExp"))
        return
    }

    let message = `=== ${tr("main.history")} ===\n${tr("main.whatWant")}\n`
    let option = 1

    for (let func = State.history.length - 1; func >= 0; func--) {
        const stored = State.history[func]
        message += `${String(option)} ⇒ “a” = ${Writing.decimal(stored.a)}; “b” = ${Writing.decimal(
            stored.b
        )}; “c” = ${Writing.decimal(stored.c)}\n`
        option++
    }

    const answer = Ui.range(message, "", 0, State.history.length)
    if (answer == 0) return

    const stored = State.history.at(State.history.length - answer)
    State.globalA = stored.a
    State.globalB = stored.b
    State.globalC = stored.c

    if (
        State.globalA != State.currentFunc.a ||
        State.globalB != State.currentFunc.b ||
        State.globalC != State.currentFunc.c
    ) {
        State.currentFunc = { a: State.globalA, b: State.globalB, c: State.globalC }
    }
}

// === TIPO 7: CONFIGURAÇÕES ===

function buildConfigOptions() {
    const configOptions = [
        Writing.configItem(tr("main.unicode"), "unicode"),
        Writing.configItem(tr("main.explanations"), "explanations"),
        Writing.configItem(tr("main.accents"), "accents"),
        Writing.configItem(tr("main.capitalized"), "capitalized"),
        Writing.configItem(tr("main.uppercase"), "uppercase"),
        Writing.configItem(tr("main.lowercase"), "lowercase"),

        Writing.configItem(tr("main.decimalSeparator"), "decimalSeparator"),
        Writing.configItem(tr("main.simpleMulti"), "simpleMulti"),
        Writing.configItem(tr("main.inputConfirm"), "inputConfirm"),
        Writing.configItem(tr("main.outputConfirm"), "outputConfirm"),
        Writing.configItem(tr("main.errors"), "errors"),
        Writing.configItem(tr("main.showFunction"), "showFunction"),

        Writing.configItem(tr("main.decimalPlaces"), "decimalPlaces"),
        Writing.configItem(tr("main.logPrecision"), "logPrecision"),
        Writing.configItem(tr("main.divisionPrecision"), "divPrecision"),
        Writing.configItem(tr("main.iterationLimit"), "iterationLimit"),
        Writing.configItem(tr("main.language"), "language"),
        Writing.configItem(tr("main.degrees"), "degrees"),
    ]

    while (configOptions.length % 6 != 0 || configOptions.length == 0) {
        configOptions.push("---")
    }

    return configOptions
}

function buildSettingsMenuText(page, total, configOptions) {
    let text = `=== ${tr("main.settings")} ===\n${tr("commands.page")}${String(page)}/${String(
        total
    )}\n${tr("main.settingsNote")}`

    for (let option = 1; option <= 6; option++) {
        text += `\n${String(option)} = ${String(configOptions[option - 1 + 6 * (page - 1)])}`
    }

    text +=
        `\n----------------\n` +
        `7 = ${tr("main.restoreDefault")} | 8 = ${tr("commands.previous")} | 9 = ${tr(
            "commands.next"
        )} | 0 = ${tr("commands.back")}`

    return text
}

function restoreDefaultsIfConfirmed() {
    if (JSON.stringify(Config) == JSON.stringify(DEFAULT_CONFIG)) {
        Ui.warning(tr("main.allSettingsDefault"), tr("main.allSettingsDefaultExp"))
        return
    }

    let message = tr("main.wantRestoreDefault")
    const keys = Object.keys(Config)

    keys.forEach(key => {
        message += Config[key] != DEFAULT_CONFIG[key] ? `${key}, ` : ""
    })

    message = message.slice(0, -2)

    if (Ui.warning(message, tr("main.noteRestoreDefault"), true)) {
        resetConfig()
    }
}

// Trata a exclusividade entre capitalized/uppercase/lowercase
function toggleTextCase(chosenKey) {
    const others = ["capitalized", "uppercase", "lowercase"].filter(key => key != chosenKey)

    if (Config[chosenKey]) {
        others.forEach(key => {
            Config[key] = false
        })
    } else if (others.every(key => !Config[key])) {
        Config.capitalized = true
    }
}

const settingsPageActions = {
    1: {
        1: () => {
            Config.unicode = Ui.confirm(Writing.configItem(tr("main.enableUnicode"), "unicode"), tr("main.noteUnicode"))
        },
        2: () => {
            Config.explanations = Ui.confirm(
                Writing.configItem(tr("main.enableExplanations"), "explanations"),
                tr("main.noteExplanations")
            )
        },
        3: () => {
            Config.accents = Ui.confirm(Writing.configItem(tr("main.enableAccents"), "accents"), tr("main.noteAccents"))
        },
        4: () => {
            Config.capitalized = Ui.confirm(
                Writing.configItem(tr("main.enableCapitalized"), "capitalized"),
                tr("main.noteCapitalized")
            )
            toggleTextCase("capitalized")
        },
        5: () => {
            Config.uppercase = Ui.confirm(
                Writing.configItem(tr("main.enableUppercase"), "uppercase"),
                tr("main.noteUppercase")
            )
            toggleTextCase("uppercase")
        },
        6: () => {
            Config.lowercase = Ui.confirm(
                Writing.configItem(tr("main.enableLowercase"), "lowercase"),
                tr("main.noteLowercase")
            )
            toggleTextCase("lowercase")
        },
    },
    2: {
        1: () => {
            Config.decimalSeparator = Ui.confirm(
                Writing.configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"),
                tr("main.noteDecimalSeparator") + Writing.decimal(123.456) + tr("main.noteDecimalSeparator2")
            )
        },
        2: () => {
            Config.simpleMulti = Ui.confirm(
                Writing.configItem(tr("main.changeSimpleMulti"), "simpleMulti"),
                tr("main.noteSimpleMulti")
            )
        },
        3: () => {
            Config.inputConfirm = Ui.confirm(
                Writing.configItem(tr("main.enableInputConfirm"), "inputConfirm"),
                tr("main.noteInputConfirm")
            )
        },
        4: () => {
            Config.outputConfirm = Ui.confirm(
                Writing.configItem(tr("main.enableOutputConfirm"), "outputConfirm"),
                tr("main.noteOutputConfirm")
            )
        },
        5: () => {
            Config.errors = Ui.confirm(Writing.configItem(tr("main.enableErrors"), "errors"), tr("main.noteErrors"))
        },
        6: () => {
            Config.showFunction = Ui.confirm(
                Writing.configItem(tr("main.enableShowFunction"), "showFunction"),
                tr("main.noteShowFunction")
            )
        },
    },
    3: {
        1: () => {
            Config.decimalPlaces = Ui.range(
                Writing.configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"),
                tr("main.noteDecimalPlaces"),
                3,
                10
            )

            if (State.globalA != "a") State.globalA = Algebra.round(State.globalA)
            if (State.globalB != "b") State.globalB = Algebra.round(State.globalB)
            if (State.globalC != "c") State.globalC = Algebra.round(State.globalC)
        },
        2: () => {
            Config.logPrecision = Ui.range(
                Writing.configItem(tr("main.whatLogPrecision"), "logPrecision"),
                tr("main.noteLogPrecision"),
                1e-12,
                1e-6,
                20
            )
        },
        3: () => {
            Config.divPrecision = Ui.range(
                Writing.configItem(tr("main.whatDivisionPrecision"), "divPrecision"),
                tr("main.noteDivisionPrecision"),
                1e-12,
                1e-6,
                20
            )
        },
        4: () => {
            Config.interactionLimit = Ui.range(
                Writing.configItem(tr("main.whatIterationLimit"), "interactionLimit"),
                tr("main.noteIterationLimit"),
                100,
                10000
            )
        },
        5: () => {
            const LANGUAGES = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]
            const optionLines = [
                "Português (Brasil)",
                "Português (Portugal)",
                "English (United States)",
                "English (United Kingdom)",
                "Español (Latinoamérica)",
                "Español (España)",
            ].map((label, index) => `${index + 1} = ${label}`)

            const question = Ui.range(
                `${Writing.configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`,
                tr("main.noteLanguage"),
                1,
                6,
                0
            )
            const language = LANGUAGES[question - 1]

            if (language != Config.language) {
                changeLanguage(language)
                changeHTML()
            }
        },
        6: () => {
            const useDegrees = Ui.confirm(
                Writing.configItem(tr("main.changeDegrees"), "degrees"),
                tr("main.noteDegrees")
            )
            Config.degrees = useDegrees ? "deg" : "rad"
        },
    },
}

function handleSettings() {
    let page = 1
    let choice

    do {
        State.type = -1
        State.loop = true

        const configOptions = buildConfigOptions()
        const total = Math.ceil(configOptions.length / 6)

        if (page < 1) {
            page = 1
        } else if (page > total) {
            page = total
        }

        const text = buildSettingsMenuText(page, total, configOptions)
        choice = Ui.range(text, "", 0, 9, 0, true)

        if (choice == 7) {
            restoreDefaultsIfConfirmed()
        } else if (choice == 8) {
            choice = -1
            page -= 1
        } else if (choice == 9) {
            choice = -1
            page += 1
        } else if (choice == "config") {
            choice = -1
        } else if (choice == "exit") {
            choice = 0
            State.type = "exit"
        } else {
            settingsPageActions[page]?.[choice]?.()
        }

        if (Checks.isFiniteNumber(choice) && choice >= 1 && choice <= 6) {
            saveConfig()
        }
    } while (choice != 0)
}

// === TIPOS 8, 9, 0: REVER | MUDAR | SAIR ===

function handleReview() {
    Ui.display(
        `${tr("`${main.values")}\n“a” = ${Writing.decimal(State.globalA)}\n` +
            `“b” = ${Writing.decimal(State.globalB)}\n` +
            `“c” = ${Writing.decimal(State.globalC)}\n`
    )
    State.loop = true
}

function handleChange() {
    State.loop = true
    State.askCoeffs = true
}

function handleExit() {
    if (Config.outputConfirm) {
        State.loop = !Ui.confirm(tr("main.exitConfirm"), tr("main.noteSettingsExit"))
    } else {
        State.loop = false
    }
}

// === LOOP PRINCIPAL ===

const TYPE_ALIASES = {
    history: 6,
    config: 7,
    review: 8,
    change: 9,
    exit: 0,
}

const typeActions = {
    1: handlePolynomial,
    2: handleNonPolynomial,
    3: handleTrigonometric,
    6: handleHistory,
    7: handleSettings,
    8: handleReview,
    9: handleChange,
    0: handleExit,
}

function resolveTypeKey(type) {
    return TYPE_ALIASES[type] ?? type
}

function askMainMenu() {
    return Ui.input(
        `=== ${tr("main.start")} ===\n${tr("main.whatWant")}\n` +
            `1 = ${tr("main.polynomialFunctions")}\n` +
            `2 = ${tr("main.nonPolynomialFunctions")}\n` +
            `3 = ${tr("main.trigonometricFunctions")}\n` +
            `----------------\n` +
            `6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr(
                "main.change"
            )} | 0 = ${tr("main.exit")}`,
        "",
        true,
        0,
        true
    )
}

function refreshGlobalCoefficients() {
    State.globalA = Algebra.variables("a")
    State.globalB = Algebra.variables("b")
    State.globalC = Algebra.variables("c")
}

function saveHistoryIfChanged() {
    const changed =
        State.globalA != State.currentFunc.a ||
        State.globalB != State.currentFunc.b ||
        State.globalC != State.currentFunc.c

    if (!changed) return

    State.currentFunc = { a: State.globalA, b: State.globalB, c: State.globalC }
    State.history.push(State.currentFunc)

    if (State.history.length > 9) {
        State.history.shift()
    }
}

refreshGlobalCoefficients()

do {
    if (State.askCoeffs) {
        refreshGlobalCoefficients()
    }

    saveHistoryIfChanged()

    if (!State.keepType || State.type == "start") {
        State.type = askMainMenu()
    }

    State.keepType = false
    State.askCoeffs = false
    State.loop = false

    const isValidType =
        (State.type >= 0 && State.type <= 3) ||
        (State.type >= 6 && State.type <= 9) ||
        Commands.names.includes(State.type)

    if (isValidType) {
        typeActions[resolveTypeKey(State.type)]?.()
    } else {
        State.loop = true
    }
} while (State.loop)
