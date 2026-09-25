function isFiniteNumber(value: unknown): value is number {
    return (isNumeric(value) || isValidText(value)) && Number.isFinite(Number(value))
}

function isFinitesNumbers(values: unknown[]): values is number[] {
    return values.every(isFiniteNumber)
}

function isInInterval(value = 0, interval: readonly number[] = [0, 1]): boolean {
    if (interval.length < 2) return false

    const bounds = [...interval]
    if (bounds.length % 2 === 1) bounds.push(bounds.at(-1) ?? bounds[0] ?? 0)

    return bounds.some((min, i) => i % 2 === 0 && min <= value && value <= (bounds[i + 1] ?? min))
}

function isNumeric(value: unknown): value is number {
    return typeof value === "number"
}

function isText(value: unknown): value is string {
    return typeof value === "string"
}

function isValidText(value: unknown): value is string {
    return isText(value) && value.trim() !== ""
}

export { isFiniteNumber, isFinitesNumbers, isInInterval, isValidText }
