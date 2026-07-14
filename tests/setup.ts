/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from "../src/config.js"

// [SETUP] Garante execução determinística e sem UI de navegador nos testes
Config.debug = true

let promptQueue: (string | null)[] = []

/**
 * Enfileira respostas para as próximas chamadas de `prompt()` feitas por Ui.input
 * @param values - Respostas na ordem em que serão consumidas
 */
export function queuePrompt(...values: (string | null)[]): void {
    promptQueue.push(...values)
}

/**
 * Limpa a fila de respostas de prompt (chamar entre testes)
 */
export function clearPromptQueue(): void {
    promptQueue = []
}

;(globalThis as any).prompt = (_message?: string) => {
    if (promptQueue.length === 0) {
        throw new Error("[testSetup] prompt() chamado sem resposta enfileirada — use queuePrompt(...) antes do teste.")
    }
    return promptQueue.shift()
}

;(globalThis as any).alert = (_message?: string) => {}
;(globalThis as any).confirm = (_message?: string) => true

// [SETUP] Mock simples de localStorage (Node não tem esse global por padrão)
class MemoryStorage {
    private store = new Map<string, string>()

    getItem(key: string): string | null {
        return this.store.has(key) ? (this.store.get(key) as string) : null
    }

    setItem(key: string, value: string): void {
        this.store.set(key, String(value))
    }

    removeItem(key: string): void {
        this.store.delete(key)
    }

    clear(): void {
        this.store.clear()
    }
}

;(globalThis as any).localStorage = new MemoryStorage()
