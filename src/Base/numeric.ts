import { Config } from "./config.js"
import { ensureReal, num, toReal, ZERO } from "./quantity.js"

export function round(value: Real, places?: Places): Real
export function round(value: Raw | null, places?: Places): Real | null
export function round(value: Raw | null, places: Places = Config.decimalPlaces): Real | null {
    const finite: Real | null = toReal(value)
    if (finite == null) return null
    if (finite === ZERO) return ZERO

    let numberText = String(finite),
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
    if (shift >= 0) return finite

    const integerPart = decimalIndex === -1 ? numberText : numberText.slice(0, decimalIndex),
        digitsText = `${integerPart}${fractionPart}`,
        digits = BigInt(digitsText)

    if (-shift > digitsText.length) return ZERO

    const divisor = 10n ** BigInt(-shift),
        integer = digits / divisor,
        remainder = digits % divisor,
        half = divisor / 2n

    let rounded = integer

    if (sign === "negative" ? remainder > half : remainder >= half) rounded++

    if (rounded === 0n) return ZERO

    const result = Number(`${rounded}e-${places}`)
    return ensureReal(sign === "negative" ? -result : result)
}

export function add(left: Natural, right: Natural): Natural
export function add(left: Integer, right: Integer): Integer
export function add(left: Rational, right: Rational): Rational
export function add(left: Real, right: Real): Real
export function add(left: Real, right: Real): Real {
    return ensureReal(left + right)
}

export function subtract(left: Integer, right: Integer): Integer
export function subtract(left: Rational, right: Rational): Rational
export function subtract(left: Real, right: Real): Real
export function subtract(left: Real, right: Real): Real {
    return ensureReal(left - right)
}

export function multiply(left: Natural, right: Natural): Natural
export function multiply(left: Integer, right: Integer): Integer
export function multiply(left: Rational, right: Rational): Rational
export function multiply(left: Real, right: Real): Real
export function multiply(left: Real, right: Real): Real {
    return ensureReal(left * right)
}

export function divide(numerator: Rational, denominator: NonZero & Rational): Rational
export function divide(numerator: Real, denominator: NonZero): Real
export function divide(numerator: Real, denominator: NonZero): Real {
    return ensureReal(numerator / denominator)
}

export function abs(value: NonZero): Positive
export function abs(value: Real): NonNegative
export function abs(value: Real): NonNegative {
    return Math.abs(value) as NonNegative
}

export function negate<S extends SetName, G extends SignName>(value: Finite<S, G>): Finite<S, Flip<G>> {
    return multiply(value, num(-1)) as Finite<S, Flip<G>>
}

export function square(value: Real): NonNegative {
    return ensureReal(value * value) as NonNegative
}

export function sqrt(value: NonNegative): NonNegative {
    return Math.sqrt(value) as NonNegative
}

export function min(left: Real, right: Real): Real {
    return left < right ? left : right
}

export function max(left: Real, right: Real): Real {
    return left > right ? left : right
}

export function ln(value: LogBase): NonZero
export function ln(value: Positive): Real
export function ln(value: Positive): Real {
    return ensureReal(Math.log(value))
}

export function log(value: Positive, base: LogBase): Real {
    return ensureReal(base === 10 ? Math.log10(value) : base === 2 ? Math.log2(value) : Math.log(value) / ln(base))
}

export function power(base: Real, exponent: Real): Real | null {
    return toReal(base ** exponent)
}
