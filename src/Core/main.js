import { changeLanguage, tr } from "../Lang/i18n.js";
import { configItem, decimalOptions, uppercase } from "../Lang/writing.js";
import { resolveUnknown } from "../Math/algebra.js";
import { round } from "../Math/numeric.js";
import { isValidCommand } from "../UI/commands.js";
import { notify } from "../UI/display.js";
import { inputCommands, rangeOptions } from "../UI/ui.js";
import { VERSION } from "../version.js";
import { resolveAffine, resolveConstant, resolveCosine, resolveExponential, resolveLogarithmic, resolveQuadratic, resolveSine, resolveTangent } from "./analyze.js";
import { isFiniteNumber, isInInterval } from "./checks.js";
import { Config, DEFAULT_CONFIG } from "./config.js";
import { State } from "./state.js";
notify(`==================================================\n${tr("commands.title")} — ${VERSION}\n${tr("commands.copyright")} © Adriano Lima 2025 — 2026\n==================================================`, { type: "console" });
Config.load();
if (Config.showWelcome === "on")
    notify(tr("main.welcomeTitle"), { explanation: tr("main.welcomeDescription") });
Config.showWelcome = "off";
if (State.current.load())
    notify(tr("math.save"), { type: "confirm" }) ? (State.askCoeffs = "off") : State.current.reset();
function setMeta(name = "", content = "") {
    document.querySelector(`meta[name="${CSS.escape(name)}"]`)?.setAttribute("content", content);
}
function setProperty(property = "", content = "") {
    document.querySelector(`meta[property="${CSS.escape(property)}"]`)?.setAttribute("content", content);
}
function changeHTML() {
    const title = tr("commands.title"), description = tr("main.documentDescription"), locales = { "pt-br": "pt_BR", "pt-pt": "pt_PT", "en-us": "en_US", "en-gb": "en_GB", "es-419": "es_419", "es-es": "es_ES" };
    document.documentElement.lang = Config.language;
    setProperty("og:locale", locales[Config.language]);
    document.title = title;
    const h1 = document.querySelector("h1");
    if (h1 != null)
        h1.textContent = tr("main.h1");
    setMeta("title", title);
    setMeta("description", description);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
}
changeHTML();
function submenuFooter(backLabel) {
    return `----------------\n6 = ${tr("main.history")} | 7 = ${tr("main.settings")} | 8 = ${tr("main.review")} | 9 = ${tr("main.change")} | 0 = ${backLabel}`;
}
function runSubmenu(buildMenuText, maxOption, handlers) {
    let subLoop;
    do {
        const subtype = inputCommands(buildMenuText(), { type: "number", places: 0, placeholder: "0" });
        subLoop = !((isFiniteNumber(subtype) && isInInterval(subtype, [0, maxOption, 6, 9])) || isValidCommand(subtype));
        if (!subLoop) {
            if (isFiniteNumber(subtype) && isInInterval(subtype, [6, 9])) {
                State.menuChoice = subtype;
                State.loop = "on";
                State.keepChoice = "on";
            }
            else if (isValidCommand(subtype)) {
                State.menuChoice = subtype;
                State.loop = "on";
                if (subtype !== "exit")
                    State.keepChoice = "on";
            }
            else if (subtype === 0)
                State.loop = "on";
            else
                handlers[subtype]?.();
        }
    } while (subLoop);
}
function handleExpOrLog(kind, label, resolveFn) {
    State.current.type = kind;
    if (State.current.variableCoefs)
        State.current.resolveCoefs(resolveUnknown({ a: State.current.a, b: State.current.b, c: State.current.c }, State.current.type));
    if (State.current.variableCoefs)
        return;
    if (State.current.isValidExpLog) {
        resolveFn(State.current.toNumericCoefficients());
        return;
    }
    if (State.current.isConstantExpLog) {
        notify(tr("errors.error004", { type: label }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" });
        if (State.current.numericA === 1)
            State.current.c = State.current.numericC + State.current.numericB;
        State.current.a = 0;
        State.current.b = 0;
        State.menuChoice = 1;
        State.keepChoice = "on";
        State.loop = "on";
        return;
    }
    if (!State.current.isInvalidExpLog)
        return;
    notify(tr("errors.error005", { type: label }), { explanation: "a < 0", type: "error" });
    State.askCoeffs = "on";
    State.loop = "on";
}
function handleTrig(kind, label, resolveFn, mergeOnZeroA = false) {
    State.current.type = kind;
    if (State.current.variableCoefs)
        State.current.resolveCoefs(resolveUnknown({ a: State.current.a, b: State.current.b, c: State.current.c }, State.current.type));
    if (State.current.variableCoefs)
        return;
    if (State.current.isValidTrig) {
        resolveFn(State.current.toNumericCoefficients());
        return;
    }
    if (!State.current.isConstantTrig)
        return;
    notify(tr("errors.error004", { type: label }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" });
    if (mergeOnZeroA && State.current.numericA === 0)
        State.current.c = State.current.numericC + State.current.numericB;
    State.current.a = 0;
    State.current.b = 0;
    State.menuChoice = 1;
    State.keepChoice = "on";
    State.loop = "on";
}
const settingsPageActions = {
    1: {
        1: () => {
            const LANGUAGES = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"], displayLocale = Config.language.replace(/-\w+$/v, m => uppercase(m)), languageNames = new Intl.DisplayNames([displayLocale], { type: "language" }), optionLines = LANGUAGES.map((lang, i) => `${i + 1} = ${languageNames.of(lang)}`), question = rangeOptions(`${configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`, { explanation: tr("main.noteLanguage"), min: 1, max: 6 }), language = LANGUAGES.at(question - 1) ?? "pt-br";
            if (Config.language === language)
                notify(tr("commands.languageAlready"), { type: "warning" });
            changeLanguage(language);
            changeHTML();
        },
        2: () => {
            Config.showUnicode = notify(configItem(tr("main.enableUnicode"), "showUnicode"), { type: "confirm", explanation: tr("main.noteUnicode") }) ? "on" : "off";
        },
        3: () => {
            Config.showAccents = notify(configItem(tr("main.enableAccents"), "showAccents"), { type: "confirm", explanation: tr("main.noteAccents") }) ? "on" : "off";
        },
        4: () => {
            const cases = ["capitalized", "uppercase", "lowercase", "default"], message = [tr("main.textCaseCapitalized"), tr("main.textCaseUppercase"), tr("main.textCaseLowercase"), tr("main.textCaseNormal")].map((label, i) => `${i + 1} = ${label}`).join("\n"), choice = rangeOptions(`${configItem(tr("main.changeTextCase"), "textCase")}\n${message}`, { explanation: tr("main.noteTextCase"), min: 1, max: 4 });
            Config.textCase = cases.at(choice - 1) ?? "default";
        },
        5: () => {
            Config.decimalSeparator = notify(configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"), { type: "confirm", explanation: `${tr("main.noteDecimalSeparator")}${decimalOptions(123.456)}${tr("main.noteDecimalSeparator2")}` }) ? "comma" : "dot";
        },
    },
    2: {
        1: () => {
            Config.showExplanations = notify(configItem(tr("main.enableExplanations"), "showExplanations"), { type: "confirm", explanation: tr("main.noteExplanations") }) ? "on" : "off";
        },
        2: () => {
            Config.showErrors = notify(configItem(tr("main.enableErrors"), "showErrors"), { type: "confirm", explanation: tr("main.noteErrors") }) ? "on" : "off";
        },
        3: () => {
            Config.showFunction = notify(configItem(tr("main.enableShowFunction"), "showFunction"), { type: "confirm", explanation: tr("main.noteShowFunction") }) ? "on" : "off";
        },
        4: () => {
            Config.inputConfirm = notify(configItem(tr("main.enableInputConfirm"), "inputConfirm"), { type: "confirm", explanation: tr("main.noteInputConfirm") }) ? "on" : "off";
        },
        5: () => {
            Config.exitConfirm = notify(configItem(tr("main.enableOutputConfirm"), "exitConfirm"), { type: "confirm", explanation: tr("main.noteOutputConfirm") }) ? "on" : "off";
        },
        6: () => {
            Config.implicitMulti = notify(configItem(tr("main.changeSimpleMulti"), "implicitMulti"), { type: "confirm", explanation: tr("main.noteSimpleMulti") }) ? "on" : "off";
        },
    },
    3: {
        1: () => {
            Config.decimalPlaces = rangeOptions(configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"), { explanation: tr("main.noteDecimalPlaces"), min: 3, max: 10 });
            if (!State.current.variableA)
                State.current.a = round(State.current.numericA);
            if (!State.current.variableB)
                State.current.b = round(State.current.numericB);
            if (!State.current.variableC)
                State.current.c = round(State.current.numericC);
        },
        2: () => {
            Config.logPrecision = rangeOptions(configItem(tr("main.whatLogPrecision"), "logPrecision"), { explanation: tr("main.noteLogPrecision"), min: 1e-12, max: 1e-6, places: 20 });
        },
        3: () => {
            Config.divPrecision = rangeOptions(configItem(tr("main.whatDivisionPrecision"), "divPrecision"), { explanation: tr("main.noteDivisionPrecision"), min: 1e-12, max: 1e-6, places: 20 });
        },
        4: () => {
            Config.iterationLimit = rangeOptions(configItem(tr("main.whatIterationLimit"), "iterationLimit"), { explanation: tr("main.noteIterationLimit"), min: 100, max: 10000 });
        },
        5: () => {
            Config.angleUnit = notify(configItem(tr("main.changeDegrees"), "angleUnit"), { type: "confirm", explanation: tr("main.noteDegrees") }) ? "deg" : "rad";
        },
    },
}, TYPE_ALIASES = { history: 6, config: 7, review: 8, change: 9, exit: 0, start: -1 };
do {
    if (State.askCoeffs === "on")
        State.current.refreshCoefs();
    if (State.funcChanged) {
        State.lastRecorded = State.current.toCoefficients();
        State.history.push(State.lastRecorded);
        if (State.history.length > 9)
            State.history = State.history.slice(1);
    }
    if (State.keepChoice === "off" || State.menuChoice === "start") {
        State.menuChoice = inputCommands(`=== ${tr("main.start")} ===\n${tr("main.whatWant")}\n1 = ${tr("main.polynomialFunctions")}\n2 = ${tr("main.nonPolynomialFunctions")}\n3 = ${tr("main.trigonometricFunctions")}\n${submenuFooter(tr("main.exit"))}`, {
            type: "number",
            places: 0,
            placeholder: "0",
        });
    }
    State.keepChoice = "off";
    State.askCoeffs = "off";
    State.loop = "off";
    if ((isFiniteNumber(State.menuChoice) && isInInterval(State.menuChoice, [0, 3, 6, 9])) || isValidCommand(State.menuChoice)) {
        const menuKey = isValidCommand(State.menuChoice) ? TYPE_ALIASES[State.menuChoice] : State.menuChoice;
        if (menuKey === 1) {
            State.current.type = "poly";
            if (!State.current.numericCoefs)
                State.current.resolveCoefs(resolveUnknown({ a: State.current.a, b: State.current.b, c: State.current.c }, State.current.type));
            State.current.isConstant ? resolveConstant() : State.current.isAffine ? resolveAffine() : resolveQuadratic();
        }
        else if (menuKey === 2)
            runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.exponentialFunction")}\n2 = ${tr("main.logarithmicFunction")}\n${submenuFooter(tr("commands.back"))}`, 2, {
                1: () => handleExpOrLog("exp", tr("main.exponential"), coefs => resolveExponential(coefs)),
                2: () => handleExpOrLog("log", tr("main.logarithmic"), coefs => resolveLogarithmic(coefs)),
            });
        else if (menuKey === 3)
            runSubmenu(() => `=== Menu ===\n${tr("main.whatWant")}\n1 = ${tr("main.sineFunction")}\n2 = ${tr("main.cosineFunction")}\n3 = ${tr("main.tangentFunction")}\n${submenuFooter(tr("commands.back"))}`, 3, {
                1: () => handleTrig("sin", tr("main.sine"), coefs => resolveSine(coefs)),
                2: () => handleTrig("cos", tr("main.cosine"), coefs => resolveCosine(coefs), true),
                3: () => handleTrig("tan", tr("main.tangent"), coefs => resolveTangent(coefs)),
            });
        else if (menuKey === 6) {
            State.loop = "on";
            const filtered = State.history.filter(Boolean).toReversed();
            if (filtered.length <= 1)
                notify(tr("main.noHistory"), { explanation: tr("main.noHistoryExp") });
            else {
                const message = `=== ${tr("main.history")} ===\n${tr("main.whatWant")}\n${filtered.map((stored, i) => `${i + 1} ⇒ "a" = ${decimalOptions(stored.a)}; "b" = ${decimalOptions(stored.b)}; "c" = ${decimalOptions(stored.c)}`).join("")}`, answer = rangeOptions(message, { max: filtered.length });
                if (answer !== 0) {
                    const stored = filtered.at(answer - 1);
                    if (stored != null) {
                        State.currentCoefs = stored;
                        if (State.funcChanged)
                            State.lastRecorded = State.current.toCoefficients();
                    }
                }
            }
        }
        else if (menuKey === 7) {
            let page = 1, choice;
            do {
                State.menuChoice = -1;
                State.loop = "on";
                const configOptions = [
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
                ], total = Math.ceil(configOptions.length / 6);
                page = Math.min(Math.max(page, 1), total);
                const start = 6 * (page - 1);
                choice = rangeOptions([
                    `=== ${tr("main.settings")} ===\n${tr("commands.page")}${page}/${total}\n${tr("main.settingsNote")}`,
                    ...configOptions.slice(start, start + 6).map((option, i) => `\n${i + 1} = ${option}`),
                    `\n----------------\n7 = ${tr("main.restoreDefault")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
                ].join(""), { max: 9, commands: true });
                if (choice === 7) {
                    if (JSON.stringify(Config) === JSON.stringify(DEFAULT_CONFIG))
                        notify(tr("main.allSettingsDefault"), { explanation: tr("main.allSettingsDefaultExp"), type: "warning" });
                    else {
                        const changedKeys = Object.keys(Config).filter(key => Config[key] !== DEFAULT_CONFIG[key]);
                        if (notify(`${tr("main.wantRestoreDefault")}${changedKeys.join(", ")}`, { explanation: tr("main.noteRestoreDefault"), type: "warning", asConfirm: true }))
                            Config.reset();
                    }
                }
                else if (choice === 8)
                    page--;
                else if (choice === 9)
                    page++;
                else if (choice === "exit") {
                    choice = 0;
                    State.menuChoice = "exit";
                }
                else if (isFiniteNumber(choice))
                    settingsPageActions[page]?.[choice]?.();
                if (isFiniteNumber(choice) && isInInterval(choice, [1, 6]))
                    Config.save();
            } while (choice !== 0);
        }
        else if (menuKey === 8) {
            notify(`${tr("main.values")}\n"a" = ${decimalOptions(State.current.a)}\n"b" = ${decimalOptions(State.current.b)}\n"c" = ${decimalOptions(State.current.c)}\n`);
            State.loop = "on";
        }
        else if (menuKey === 9) {
            State.loop = "on";
            State.askCoeffs = "on";
        }
        else if (menuKey === 0)
            State.loop = Config.exitConfirm === "on" && !notify(tr("main.exitConfirm"), { type: "confirm", explanation: tr("main.noteSettingsExit") }) ? "on" : "off";
    }
    else
        State.loop = "on";
} while (State.loop === "on");
Config.save();
State.current.save();
