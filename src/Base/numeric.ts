import { Config } from "./config.js"
import { ensureReal } from "./quantity.js"

export function round(value: number, places?: Places): number
export function round(value: number | null, places?: Places): number | null
export function round(value: number | null, places: Places = Config.decimalPlaces): number | null {
    if (value == null || !Number.isFinite(value)) return null
    if (value === 0) return 0

    let numberText = String(value),
        sign: "positive" | "negative" = "positive"

    if (numberText.startsWith("-")) {
        sign = "negative"
        numberText = numberText.slice(1)
    }

    const exponentIndex = numberText.indexOf("e")
    let exponent = 0

    if (exponentIndex !== -1) {
        exponent = Number(numberText.slice(exponentIndex + 1))
        numberText = numberText.slice(0, exponentIndex)
    }

    const decimalIndex = numberText.indexOf("."),
        fractionPart = decimalIndex === -1 ? "" : numberText.slice(decimalIndex + 1),
        pow = exponent - fractionPart.length,
        shift = pow + places
    if (shift >= 0) return value

    const integerPart = decimalIndex === -1 ? numberText : numberText.slice(0, decimalIndex),
        digitsText = `${integerPart}${fractionPart}`,
        digits = BigInt(digitsText)

    if (-shift > digitsText.length) return 0

    const divisor = 10n ** BigInt(-shift),
        integer = digits / divisor,
        remainder = digits % divisor,
        half = divisor / 2n

    let rounded = integer

    if (sign === "negative" ? remainder > half : remainder >= half) rounded++

    if (rounded === 0n) return 0

    const result = Number(`${rounded}e-${places}`)
    return ensureReal(sign === "negative" ? -result : result)
}

export function add(left: number, right: number): number {
    return ensureReal(left + right)
}

export function subtract(left: number, right: number): number {
    return ensureReal(left - right)
}

export function multiply(left: number, right: number): number {
    return ensureReal(left * right)
}

export function divide(numerator: number, denominator: number): number {
    return ensureReal(numerator / denominator)
}

export function abs(value: number): number {
    return Math.abs(value)
}

export function negate(value: number): number {
    return multiply(value, -1)
}

export function square(value: number): number {
    return ensureReal(value * value)
}

export function sqrt(value: number): number {
    return Math.sqrt(value)
}

export function min(left: number, right: number): number {
    return Math.min(left, right)
}

export function max(left: number, right: number): number {
    return Math.max(left, right)
}

export function ln(value: number): number {
    return ensureReal(Math.log(value))
}

export function log(value: number, base: number): number {
    return ensureReal(base === 10 ? Math.log10(value) : base === 2 ? Math.log2(value) : Math.log(value) / ln(base))
}

export function finite(value: number): number | null {
    return Number.isFinite(value) ? value : null
}

export function power(base: number, exponent: number): number | null {
    return finite(base ** exponent)
}
