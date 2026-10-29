export function isText(value: unknown): value is string {
    return typeof value === "string" && value.trim() !== ""
}

export function isReal(value: unknown): value is Real {
    return typeof value === "number" && Number.isFinite(value)
}

export function isInInterval(value = 0, interval: readonly number[] = [0, 1]): boolean {
    if (interval.length < 2) return false

    const bounds = [...interval]
    if (bounds.length % 2 === 1) bounds.push(bounds.at(-1) ?? bounds[0] ?? 0)

    return bounds.some((min, index) => index % 2 === 0 && min <= value && value <= (bounds.at(index + 1) ?? min))
}
