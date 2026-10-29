import { isInfinity, NEGATIVE_INFINITY, ONE, POSITIVE_INFINITY, toNatural, ZERO } from "./quantity.js"

export const EMPTY: RealSet = []
export const ALL: RealSet = [{ lower: { value: NEGATIVE_INFINITY, closure: "open" }, upper: { value: POSITIVE_INFINITY, closure: "open" } }]

function normalize(intervals: List<Interval>): RealSet {
    const sorted: List<Interval> = intervals
            .filter(({ lower, upper }: Interval): boolean => lower.value < upper.value || (lower.value === upper.value && lower.closure === "closed" && upper.closure === "closed"))
            .toSorted((left: Interval, right: Interval): number => left.lower.value - right.lower.value || (right.lower.closure === "closed" ? ONE : ZERO) - (left.lower.closure === "closed" ? ONE : ZERO)),
        result: RealSet = []

    for (const inter of sorted) {
        const last: Interval | null = result.at(-1) ?? null
        if (last == null || inter.lower.value > last.upper.value || (inter.lower.value === last.upper.value && inter.lower.closure === "open" && last.upper.closure === "open")) result.push(inter)
        else if (inter.upper.value > last.upper.value || (inter.upper.value === last.upper.value && inter.upper.closure === "closed")) result[result.length - 1] = { lower: last.lower, upper: inter.upper }
    }

    return result
}

export function interval(lower: LowerBound, upper: UpperBound): RealSet {
    return normalize([{ lower, upper }])
}

export function points(values: List<Real>): RealSet {
    const result: List<Interval> = Array.from(values, value => ({ lower: { value, closure: "closed" }, upper: { value, closure: "closed" } }))
    return normalize(result)
}

export function union(left: RealSet, right: RealSet): RealSet {
    return normalize([...left, ...right])
}

export function intersection(left: RealSet, right: RealSet): RealSet {
    const result: List<Interval> = []

    for (const { lower: aLower, upper: aUpper } of left) {
        for (const { lower: bLower, upper: bUpper } of right) {
            let lower: LowerBound
            if (aLower.value > bLower.value) lower = aLower
            else if (bLower.value > aLower.value) lower = bLower
            else lower = aLower.closure === "closed" ? bLower : aLower

            let upper: UpperBound
            if (aUpper.value < bUpper.value) upper = aUpper
            else if (bUpper.value < aUpper.value) upper = bUpper
            else upper = aUpper.closure === "closed" ? bUpper : aUpper

            result.push({ lower, upper })
        }
    }

    return normalize(result)
}

export function complement(set: RealSet): RealSet {
    const result: List<Interval> = []
    let start: LowerBound | null = { value: NEGATIVE_INFINITY, closure: "open" }

    for (const { lower, upper } of normalize(set)) {
        if (start != null && !isInfinity(lower.value)) result.push({ lower: start, upper: { value: lower.value, closure: lower.closure === "open" ? "closed" : "open" } })
        start = isInfinity(upper.value) ? null : { value: upper.value, closure: upper.closure === "open" ? "closed" : "open" }
    }

    if (start != null) result.push({ lower: start, upper: { value: POSITIVE_INFINITY, closure: "open" } })
    return result
}

export function haveValue(set: RealSet, value: Real): boolean {
    return set.some(({ lower, upper }: Interval): boolean => (value > lower.value || (value === lower.value && lower.closure === "closed")) && (value < upper.value || (value === upper.value && upper.closure === "closed")))
}

export function cardinality(set: RealSet): Cardinality {
    const normalized: RealSet = normalize(set)
    return normalized.every(({ lower, upper }: Interval): boolean => lower.value === upper.value) ? (toNatural(normalized.length) ?? ZERO) : "infinite"
}
