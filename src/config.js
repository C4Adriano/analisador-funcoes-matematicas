import defaultConfigJson from "../src/JSON/config.json" with { type: "json" };
import { VERSION } from "./version.js";
export const Config = structuredClone(defaultConfigJson);
export const DEFAULT_CONFIG = structuredClone(defaultConfigJson);
export function loadConfig() {
    const saved = localStorage.getItem("config");
    const savedVersion = localStorage.getItem("configVersion");
    if (!saved)
        return;
    if (savedVersion != VERSION) {
        localStorage.removeItem("config");
        localStorage.removeItem("configVersion");
        return;
    }
    let parsed;
    try {
        parsed = JSON.parse(saved);
    }
    catch (e) {
        console.warn("[loadConfig] Config corrompida no localStorage. Ignorando.", e);
        localStorage.removeItem("config");
        localStorage.removeItem("configVersion");
        return;
    }
    const keys = Object.keys(parsed);
    for (const key of keys) {
        if (!(key in Config))
            continue;
        const currentType = typeof Config[key];
        const newValue = parsed[key];
        if (typeof newValue == currentType) {
            ;
            Config[key] = newValue;
        }
        else {
            console.warn(`[loadConfig] Tipo inválido para '${String(key)}'.`, `Esperado: ${currentType} | Recebido: ${typeof newValue}`);
        }
    }
}
export function saveConfig() {
    try {
        localStorage.setItem("config", JSON.stringify(Config));
        localStorage.setItem("configVersion", VERSION);
    }
    catch (e) {
        console.warn("[saveConfig] Não foi possível salvar as configurações.", e);
    }
}
export function resetConfig() {
    localStorage.removeItem("config");
    localStorage.removeItem("configVersion");
    Object.assign(Config, structuredClone(defaultConfigJson));
}
