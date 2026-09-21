import defaultConfigJson from "./JSON/config.json" with { type: "json" };
import { Ui } from "./ui.js";
import { VERSION } from "./version.js";
const DEFAULT_CONFIG = structuredClone(defaultConfigJson);
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
        if (saved == null || saved.trim() == "")
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
            const value = parsed[key];
            if (value == null)
                continue;
            const defaultValue = defaultConfigJson[key];
            if (typeof value == typeof defaultValue)
                updates[key] = value;
            else
                Ui.notifyOptions(`[Config.load] Tipo inválido para '${key}'. Mantendo padrão da versão atual.`, {
                    explanation: `Esperado: ${typeof defaultValue} | Recebido: ${typeof value}`,
                    type: "console",
                });
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
const Config = new ConfigStore();
export { Config, DEFAULT_CONFIG };
