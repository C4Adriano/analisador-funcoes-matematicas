export const PLACES = [0, 3, 4, 5, 6, 7, 8, 9, 10, 20] as const
export const PRECISIONS = [1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12] as const

export function ensureReal(value: number): number {
    if (Number.isFinite(value)) return value
    throw new RangeError("ensureReal: value is not finite", { cause: value })
}

export function toPlaces(value: unknown): Places | null {
    return (PLACES as readonly unknown[]).includes(value) ? (value as Places) : null
}

export function toPrecision(value: unknown): Precision | null {
    return (PRECISIONS as readonly unknown[]).includes(value) ? (value as Precision) : null
}

export function isLogBase(value: number): boolean {
    return value > 0 && value !== 1
}

export function toRadians(angle: number): number {
    return ensureReal((angle * Math.PI) / 180)
}

export function toDegrees(angle: number): number {
    return ensureReal((angle * 180) / Math.PI)
}

export function sin(angle: number): number {
    return ensureReal(Math.sin(angle))
}

export function cos(angle: number): number {
    return ensureReal(Math.cos(angle))
}

export function tan(angle: number): number {
    return ensureReal(Math.tan(angle))
}

export function real(value: number): RealQuantity {
    return { kind: "real", value: ensureReal(value) }
}

export function complex(re: number, im: number): ComplexQuantity {
    return { kind: "complex", re: ensureReal(re), im: ensureReal(im) }
}

export function toAngle(value: number): AngleQuantity {
    return { kind: "angle", radians: ensureReal(value) }
}

function fromDegrees(value: number): AngleQuantity {
    return toAngle(toRadians(value))
}

function toQuantity(re: number, im: number): Quantity {
    const tolerance: number = 64 * Number.EPSILON * Math.hypot(re, im)
    if (Math.abs(im) <= tolerance) return real(re)
    return complex(Math.abs(re) <= tolerance ? 0 : re, im)
}

function toComplex(quantity: RealQuantity | ComplexQuantity): ComplexQuantity {
    return quantity.kind === "real" ? complex(quantity.value, 0) : quantity
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
        denominator: number = r.re ** 2 + r.im ** 2
    return denominator === 0 ? "divZero" : toQuantity((l.re * r.re + l.im * r.im) / denominator, (l.im * r.re - l.re * r.im) / denominator)
}

function powComplex(base: ComplexQuantity, exponent: RealQuantity): Quantity {
    const modulus: number = Math.hypot(base.re, base.im) ** exponent.value,
        theta: number = Math.atan2(base.im, base.re) * exponent.value
    return toQuantity(modulus * Math.cos(theta), modulus * Math.sin(theta))
}

function powReal(base: RealQuantity, exponent: RealQuantity): Quantity {
    const value: number = base.value ** exponent.value
    return Number.isNaN(value) ? powComplex(complex(base.value, 0), exponent) : real(value)
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
            real: { real: (l: RealQuantity, r: RealQuantity): Outcome => (r.value === 0 ? "divZero" : real(l.value / r.value)), complex: divComplex },
            complex: { real: divComplex, complex: divComplex },
            angle: { real: (l: AngleQuantity, r: RealQuantity): Outcome => (r.value === 0 ? "divZero" : toAngle(l.radians / r.value)), angle: (l: AngleQuantity, r: AngleQuantity): Outcome => (r.radians === 0 ? "divZero" : real(l.radians / r.radians)) },
        },
        "^": { real: { real: (l: RealQuantity, r: RealQuantity): Outcome => (l.value === 0 && r.value < 0 ? "divZero" : powReal(l, r)) }, complex: { real: powComplex } },
    },
    FUNCTIONS: FunctionTable = {
        sin: { angle: (a: AngleQuantity): RealQuantity => real(sin(a.radians)) },
        cos: { angle: (a: AngleQuantity): RealQuantity => real(cos(a.radians)) },
        tan: { angle: (a: AngleQuantity): RealQuantity => real(tan(a.radians)) },
        atan: { real: (a: RealQuantity): AngleQuantity => toAngle(Math.atan(a.value)) },
        abs: { real: (a: RealQuantity): RealQuantity => real(Math.abs(a.value)), complex: (a: ComplexQuantity): RealQuantity => real(Math.hypot(a.re, a.im)) },
        arg: { complex: (a: ComplexQuantity): AngleQuantity => toAngle(Math.atan2(a.im, a.re)) },
        conj: { complex: (a: ComplexQuantity): Quantity => toQuantity(a.re, -a.im) },
        sqrt: { real: (a: RealQuantity): Quantity => (a.value >= 0 ? real(Math.sqrt(a.value)) : complex(0, Math.sqrt(-a.value))), complex: (a: ComplexQuantity): Quantity => powComplex(a, real(0.5)) },
        cbrt: { real: (a: RealQuantity): RealQuantity => real(Math.cbrt(a.value)), complex: (a: ComplexQuantity): Quantity => powComplex(a, real(1 / 3)) },
    }

export function operate(operator: Operator, left: Quantity, right: Quantity): QuantityResult {
    const handler: Handler | null = (OPERATIONS[operator][left.kind]?.[right.kind] as Handler | null) ?? null
    if (handler == null) return { kind: "invalid", reason: "incompatible", operator, left: left.kind, right: right.kind }
    const outcome: Outcome = handler(left, right)
    return outcome === "divZero" ? { kind: "invalid", reason: "divZero", operator, left: left.kind, right: right.kind } : { kind: "valid", value: outcome }
}

export const SUFFIXES = new Map<string, Builder>([
    ["", real],
    ["i", (value: number): Quantity => complex(0, value)],
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
