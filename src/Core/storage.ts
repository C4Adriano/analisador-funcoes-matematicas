const memory = new Map<string, string>()

export function readStorage(key: string): string | null {
    if (memory.has(key)) return memory.get(key) ?? null

    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

export function writeStorage(key: string, value: string): void {
    memory.set(key, value)

    try {
        localStorage.setItem(key, value)
    } catch {
        // Armazenamento indisponível ou cheio: o valor fica só na memória da sessão.
    }
}

export function removeStorage(key: string): void {
    memory.delete(key)

    try {
        localStorage.removeItem(key)
    } catch {
        // Armazenamento indisponível: nada para remover.
    }
}
