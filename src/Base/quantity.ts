export const PLACES = [0, 3, 4, 5, 6, 7, 8, 9, 10, 20] as const
export const PRECISIONS = [1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12] as const

const LIMIT: Raw = 1e100

export function ensureReal(value: Raw): Real {
    if (Number.isFinite(value)) return value as Real
    throw new RangeError("ensureReal: value is not finite", { cause: value })
}

export function num<N extends number>(value: number extends N ? never : N): Numeric<N> {
    return value as unknown as Numeric<N>
}

export const ZERO = num(0)
export const ONE = num(1)
export const PI = Math.PI as Irrational & Positive
export const E = Math.E as Irrational & Positive
export const POSITIVE_INFINITY = Infinity as PositiveInfinity
export const NEGATIVE_INFINITY = -Infinity as NegativeInfinity

export function toReal<const T>(value: T): Checked<T, Real>
export function toReal(value: unknown): Real | null {
    return typeof value === "number" && Number.isFinite(value) ? (value as Real) : null
}

export function toInteger<const T>(value: T): Checked<T, Integer>
export function toInteger(value: unknown): Integer | null {
    return typeof value === "number" && Number.isSafeInteger(value) ? (value as Integer) : null
}

export function toNatural<const T>(value: T): Checked<T, Natural>
export function toNatural(value: unknown): Natural | null {
    const integer: Integer | null = toInteger(value)
    return integer != null && isNonNegative(integer) ? integer : null
}

export function toExtended<const T>(value: T): Checked<T, ExtendedReal>
export function toExtended(value: unknown): ExtendedReal | null {
    return typeof value === "number" && !Number.isNaN(value) ? (value as ExtendedReal) : null
}

export function toPlaces(value: unknown): Places | null {
    return (PLACES as readonly unknown[]).includes(value) ? (value as Places) : null
}

export function toPrecision(value: unknown): Precision | null {
    return (PRECISIONS as readonly unknown[]).includes(value) ? (value as Precision) : null
}

export function placesOf(value: (typeof PLACES)[number]): Places {
    return value as Places
}

export function precisionOf(value: (typeof PRECISIONS)[number]): Precision {
    return value as Precision
}

export function negate<S extends SetName, G extends SignName>(value: Finite<S, G>): Finite<S, Flip<G>> {
    return (0 - value) as Finite<S, Flip<G>>
}

export function parseReal(text: string): Rational | null {
    if (!/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?$/iv.test(text.trim())) return null
    const value: Raw = Number(text)
    if (Math.abs(value) > LIMIT) return null
    return (Math.abs(value) < ONE / LIMIT ? ZERO : value) as Rational
}

export function isPositive(value: Real): value is Positive {
    return value > ZERO
}

export function isNonPositive(value: Real): value is NonPositive {
    return value <= ZERO
}

export function isNegative(value: Real): value is Negative {
    return value < ZERO
}

export function isNonNegative(value: Real): value is NonNegative {
    return value >= ZERO
}

export function isZero(value: Real): value is Zero {
    return value === ZERO
}

export function isNonZero(value: Real): value is NonZero {
    return value !== ZERO
}

export function isInteger(value: Real): value is Integer {
    return Number.isSafeInteger(value)
}

export function isLogBase(value: Real): value is LogBase {
    return value > ZERO && value !== ONE
}

export function isInfinity(value: unknown): value is Infinity {
    return typeof value === "number" && Math.abs(value) === Infinity
}

export function radians(value: Raw): Radians {
    return ensureReal(value) as Radians
}

export function degrees(value: Raw): Degrees {
    return ensureReal(value) as Degrees
}

export function toRadians(angle: Degrees): Radians {
    return radians((angle * PI) / 180)
}

export function toDegrees(angle: Radians): Degrees {
    return degrees((angle * 180) / PI)
}

export function sin(angle: Radians): Real {
    return ensureReal(Math.sin(angle))
}

export function cos(angle: Radians): Real {
    return ensureReal(Math.cos(angle))
}

export function tan(angle: Radians): Real {
    return ensureReal(Math.tan(angle))
}

export function real(value: Raw): RealQuantity {
    return { kind: "real", value: ensureReal(value) }
}

export function complex(re: Raw, im: Raw): ComplexQuantity {
    return { kind: "complex", re: ensureReal(re), im: ensureReal(im) }
}

export function toAngle(value: Raw): AngleQuantity {
    return { kind: "angle", radians: radians(value) }
}

function fromDegrees(value: Raw): AngleQuantity {
    return toAngle(toRadians(degrees(value)))
}

function toQuantity(re: Raw, im: Raw): Quantity {
    const tolerance: Raw = 64 * Number.EPSILON * Math.hypot(re, im)
    if (Math.abs(im) <= tolerance) return real(re)
    return complex(Math.abs(re) <= tolerance ? ZERO : re, im)
}

function toComplex(quantity: RealQuantity | ComplexQuantity): ComplexQuantity {
    return quantity.kind === "real" ? complex(quantity.value, ZERO) : quantity
}

function addComplex(left: RealQuantity | ComplexQuantity, right: RealQuantity | ComplexQuantity): Quantity {
    const l: ComplexQuantity = toComplex(left),
        r: ComplexQuantity = toComplex(right)
    return toQuantity(l.re + r.re, l.im + r.im)
}

function subComplex(left: RealQuantity | ComplexQuantity, right: RealQuantity | ComplexQuantity): Quantity {
    const l: ComplexQuantity = toComplex(left),
        r: ComplexQuantity = toComplex(right)
    return toQuantity(l.re - r.re, l.im - r.im)
}

function mulComplex(left: RealQuantity | ComplexQuantity, right: RealQuantity | ComplexQuantity): Quantity {
    const l: ComplexQuantity = toComplex(left),
        r: ComplexQuantity = toComplex(right)
    return toQuantity(l.re * r.re - l.im * r.im, l.re * r.im + l.im * r.re)
}

function divComplex(left: RealQuantity | ComplexQuantity, right: RealQuantity | ComplexQuantity): Outcome {
    const l: ComplexQuantity = toComplex(left),
        r: ComplexQuantity = toComplex(right),
        denominator: Raw = r.re ** 2 + r.im ** 2
    return denominator === ZERO ? "divZero" : toQuantity((l.re * r.re + l.im * r.im) / denominator, (l.im * r.re - l.re * r.im) / denominator)
}

function powComplex(base: ComplexQuantity, exponent: RealQuantity): Quantity {
    const modulus: Raw = Math.hypot(base.re, base.im) ** exponent.value,
        theta: Raw = Math.atan2(base.im, base.re) * exponent.value
    return toQuantity(modulus * Math.cos(theta), modulus * Math.sin(theta))
}

function powReal(base: RealQuantity, exponent: RealQuantity): Quantity {
    const value: Raw = base.value ** exponent.value
    return Number.isNaN(value) ? powComplex(complex(base.value, ZERO), exponent) : real(value)
}

const OPERATIONS: OperationTable = {
        "+": { real: { real: (l: RealQuantity, r: RealQuantity): RealQuantity => real(l.value + r.value), complex: addComplex }, complex: { real: addComplex, complex: addComplex }, angle: { angle: (l: AngleQuantity, r: AngleQuantity): AngleQuantity => toAngle(l.radians + r.radians) } },
        "-": { real: { real: (l: RealQuantity, r: RealQuantity): RealQuantity => real(l.value - r.value), complex: subComplex }, complex: { real: subComplex, complex: subComplex }, angle: { angle: (l: AngleQuantity, r: AngleQuantity): AngleQuantity => toAngle(l.radians - r.radians) } },
        "*": {
            real: { real: (l: RealQuantity, r: RealQuantity): RealQuantity => real(l.value * r.value), complex: mulComplex, angle: (l: RealQuantity, r: AngleQuantity): AngleQuantity => toAngle(l.value * r.radians) },
            complex: { real: mulComplex, complex: mulComplex },
            angle: { real: (l: AngleQuantity, r: RealQuantity): AngleQuantity => toAngle(l.radians * r.value) },
        },
        "/": {
            real: { real: (l: RealQuantity, r: RealQuantity): Outcome => (r.value === ZERO ? "divZero" : real(l.value / r.value)), complex: divComplex },
            complex: { real: divComplex, complex: divComplex },
            angle: { real: (l: AngleQuantity, r: RealQuantity): Outcome => (r.value === ZERO ? "divZero" : toAngle(l.radians / r.value)), angle: (l: AngleQuantity, r: AngleQuantity): Outcome => (r.radians === ZERO ? "divZero" : real(l.radians / r.radians)) },
        },
        "^": { real: { real: (l: RealQuantity, r: RealQuantity): Outcome => (l.value === ZERO && r.value < ZERO ? "divZero" : powReal(l, r)) }, complex: { real: powComplex } },
    },
    FUNCTIONS: FunctionTable = {
        sin: { angle: (a: AngleQuantity): RealQuantity => real(sin(a.radians)) },
        cos: { angle: (a: AngleQuantity): RealQuantity => real(cos(a.radians)) },
        tan: { angle: (a: AngleQuantity): RealQuantity => real(tan(a.radians)) },
        atan: { real: (a: RealQuantity): AngleQuantity => toAngle(Math.atan(a.value)) },
        abs: { real: (a: RealQuantity): RealQuantity => real(Math.abs(a.value)), complex: (a: ComplexQuantity): RealQuantity => real(Math.hypot(a.re, a.im)) },
        arg: { complex: (a: ComplexQuantity): AngleQuantity => toAngle(Math.atan2(a.im, a.re)) },
        conj: { complex: (a: ComplexQuantity): Quantity => toQuantity(a.re, negate(a.im)) },
        sqrt: { real: (a: RealQuantity): Quantity => (a.value >= ZERO ? real(Math.sqrt(a.value)) : complex(ZERO, Math.sqrt(negate(a.value)))), complex: (a: ComplexQuantity): Quantity => powComplex(a, real(0.5)) },
        cbrt: { real: (a: RealQuantity): RealQuantity => real(Math.cbrt(a.value)), complex: (a: ComplexQuantity): Quantity => powComplex(a, real(1 / 3)) },
    }

export function operate(operator: Operator, left: Quantity, right: Quantity): QuantityResult {
    const handler: Handler | null = (OPERATIONS[operator][left.kind]?.[right.kind] as Handler | undefined) ?? null
    if (handler == null) return { kind: "invalid", reason: "incompatible", operator, left: left.kind, right: right.kind }
    const outcome: Outcome = handler(left, right)
    return outcome === "divZero" ? { kind: "invalid", reason: "divZero", operator, left: left.kind, right: right.kind } : { kind: "valid", value: outcome }
}

export const SUFFIXES = new Map<string, Builder>([
    ["", real],
    ["i", (value: Raw): Quantity => complex(ZERO, value)],
    ["°", fromDegrees],
    ["deg", fromDegrees],
    ["rad", toAngle],
])

export function callFunction(name: FunctionName, argument: Quantity): QuantityResult {
    const handler: UnaryHandler | null = (FUNCTIONS[name][argument.kind] as UnaryHandler | undefined) ?? null
    return handler == null ? { kind: "invalid", reason: "incompatible", operator: name, left: argument.kind, right: null } : { kind: "valid", value: handler(argument) }
}

export function isFunctionName(text: string): text is FunctionName {
    return Object.hasOwn(FUNCTIONS, text)
}

export function isInvalid(value: unknown): value is Invalid {
    return typeof value === "object" && value != null && "kind" in value && value.kind === "invalid" && "reason" in value
}
