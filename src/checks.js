function isFiniteNumber(value) {
    return (isNumeric(value) || isValidText(value)) && Number.isFinite(Number(value));
}
function isFinitesNumbers(values) {
    return values.every(isFiniteNumber);
}
function isInInterval(value = 0, interval = [0, 1]) {
    if (interval.length < 2)
        return false;
    const bounds = [...interval];
    if (bounds.length % 2 === 1)
        bounds.push(bounds.at(-1) ?? bounds[0] ?? 0);
    return bounds.some((min, i) => i % 2 === 0 && min <= value && value <= (bounds[i + 1] ?? min));
}
function isNumeric(value) {
    return typeof value === "number";
}
function isText(value) {
    return typeof value === "string";
}
function isValidText(value) {
    return isText(value) && value.trim() !== "";
}
export { isFiniteNumber, isFinitesNumbers, isInInterval, isValidText };
