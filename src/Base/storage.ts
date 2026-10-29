const memory: Map<string, string> = new Map<string, string>()

function didStorageActionSucceed(action: () => void): boolean {
    try {
        action()
        return true
    } catch {
        return false
    }
}

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
    didStorageActionSucceed(() => {
        localStorage.setItem(key, value)
    })
}

export function removeStorage(key: string): void {
    memory.delete(key)
    didStorageActionSucceed(() => {
        localStorage.removeItem(key)
    })
}
