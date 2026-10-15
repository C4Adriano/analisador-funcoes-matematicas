export function isValidText(value) {
    return typeof value === "string" && value.trim() !== "";
}
export function isFiniteNumber(value) {
    return (typeof value === "number" || isValidText(value)) && Number.isFinite(Number(value));
}
export function isInInterval(value = 0, interval = [0, 1]) {
    if (interval.length < 2)
        return false;
    const bounds = [...interval];
    if (bounds.length % 2 === 1)
        bounds.push(bounds.at(-1) ?? bounds[0] ?? 0);
    return bounds.some((min, i) => i % 2 === 0 && min <= value && value <= (bounds.at(i + 1) ?? min));
}
