const memory = new Map();
export function readStorage(key) {
    if (memory.has(key))
        return memory.get(key) ?? null;
    try {
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
export function writeStorage(key, value) {
    memory.set(key, value);
    try {
        localStorage.setItem(key, value);
    }
    catch {
    }
}
export function removeStorage(key) {
    memory.delete(key);
    try {
        localStorage.removeItem(key);
    }
    catch {
    }
}
