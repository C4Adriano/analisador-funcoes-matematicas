import { isFiniteNumber } from "../Core/checks.js"
import { Config } from "../Core/config.js"
export function absoluteOptions(number = 0, { shouldRound = true, places = Config.decimalPlaces } = {}) {
    return isFiniteNumber(number) ? Math.abs(shouldRound ? round(number, places) : number) : NaN
}
export function divisionOptions(numerator = 0, denominator = 1, { shouldRound = true, places = Config.decimalPlaces } = {}) {
    if (denominator === 0 || !isFiniteNumber(numerator) || !isFiniteNumber(denominator)) return NaN
    const result = numerator / denominator
    return isFiniteNumber(result) ? (shouldRound ? round(result, places) : result) : NaN
}
export function round(number = 0, places = Config.decimalPlaces) {
    if (number === 0) return 0
    if (!isFiniteNumber(number)) return number
    if (places < 0 || !isFiniteNumber(places) || !Number.isSafeInteger(places)) places = Config.decimalPlaces
    let numberStr = String(number),
        sign = ""
    if (numberStr.startsWith("-")) {
        sign = "-"
        numberStr = numberStr.slice(1)
    }
    const exponentIndex = numberStr.indexOf("e")
    let exponent = 0
    if (exponentIndex !== -1) {
        exponent = Number(numberStr.slice(exponentIndex + 1))
        numberStr = numberStr.slice(0, exponentIndex)
    }
    const decimalIndex = numberStr.indexOf("."),
        fractionPart = decimalIndex === -1 ? "" : numberStr.slice(decimalIndex + 1),
        power = exponent - fractionPart.length,
        shift = power + places
    if (shift >= 0) return number
    const integerPart = decimalIndex === -1 ? numberStr : numberStr.slice(0, decimalIndex),
        digitsStr = `${integerPart}${fractionPart}`,
        digits = BigInt(digitsStr)
    if (-shift > digitsStr.length) return 0
    const divisor = 10n ** BigInt(-shift),
        integer = digits / divisor,
        remainder = digits % divisor,
        half = divisor / 2n
    let rounded = integer
    if (sign === "-" ? remainder > half : remainder >= half) rounded++
    if (rounded === 0n) return 0
    const result = Number(`${rounded}e-${places}`)
    return sign === "-" ? -result : result
}
export function lnOptions(x = 1, { shouldRound = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}) {
    if (x === 1) return 0
    if (x <= 0 || !isFiniteNumber(x)) return NaN
    let exponent = 0
    while (x >= 2) {
        x /= 2
        exponent++
    }
    while (x < 1) {
        x *= 2
        exponent--
    }
    const z = (x - 1) / (x + 1)
    let term = z,
        sum = z,
        denominator = 1,
        limit = 0
    while (absoluteOptions(term, { shouldRound: false }) > precision) {
        term *= z ** 2
        denominator += 2
        sum += term / denominator
        if (limit++ >= Config.iterationLimit) return NaN
    }
    const result = 2 * sum + exponent * Math.LN2
    return shouldRound ? round(result, places) : result
}
export function logOptions(x = 1, base = Math.E, { shouldRound = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}) {
    if (base === Math.E) return lnOptions(x, { shouldRound, places, precision })
    if (base === 1 || base <= 0 || x <= 0 || !isFiniteNumber(x) || !isFiniteNumber(base)) return NaN
    const result = divisionOptions(lnOptions(x, { precision }), lnOptions(base, { precision }), { shouldRound: false, places })
    return shouldRound ? round(result, places) : result
}
