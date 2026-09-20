import defaultConfigJson from "../src/JSON/config.json" with { type: "json" };
import { Ui } from "./ui.js";
import { VERSION } from "./version.js";
export const DEFAULT_CONFIG = structuredClone(defaultConfigJson);
class ConfigStore {
    language;
    unicode;
    accents;
    textCase;
    decimalSeparator;
    explanations;
    errors;
    showFunction;
    inputConfirm;
    outputConfirm;
    simpleMulti;
    decimalPlaces;
    logPrecision;
    divPrecision;
    iterationLimit;
    degrees;
    constructor() {
        Object.assign(this, structuredClone(defaultConfigJson));
    }
    load() {
        const saved = localStorage.getItem("config");
        if (!saved)
            return;
        let parsed;
        try {
            parsed = JSON.parse(saved);
        }
        catch (e) {
            Ui.notifyOptions("[Config.load] Config corrompida no localStorage. Ignorando.", {
                explanation: String(e),
                type: "console",
            });
            localStorage.removeItem("config");
            return;
        }
        const keys = Object.keys(defaultConfigJson), updates = {};
        for (const key of keys) {
            const defaultValue = defaultConfigJson[key], newValue = parsed[key];
            if (newValue == null)
                continue;
            if (typeof newValue == typeof defaultValue)
                updates[key] = newValue;
            else
                Ui.notifyOptions(`[Config.load] Tipo inválido para '${String(key)}'. Mantendo padrão da versão atual.`, { explanation: `Esperado: ${typeof defaultValue} | Recebido: ${typeof newValue}`, type: "console" });
        }
        Object.assign(this, updates);
    }
    save() {
        try {
            localStorage.setItem("config", JSON.stringify(this));
            localStorage.setItem("configVersion", VERSION);
        }
        catch (e) {
            Ui.notifyOptions("[Config.save] Não foi possível salvar as configurações.", {
                explanation: String(e),
                type: "console",
            });
        }
    }
    reset() {
        localStorage.removeItem("config");
        localStorage.removeItem("configVersion");
        Object.assign(this, structuredClone(defaultConfigJson));
    }
}
export const Config = new ConfigStore();
