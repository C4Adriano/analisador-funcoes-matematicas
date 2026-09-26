declare global {
    type NumericArray = number[]
    type NumericMatrix = number[][]

    type Value = string | number
    type ValueArray = Value[]
    type ValueMatrix = Value[][]

    type Variable = "a" | "b" | "c"
    type MathValue = Variable | number

    type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12
    type Places = number

    type TrigonometricFunction = "sin" | "cos" | "tan" | "csc" | "sec" | "cot" | ""
    type FunctionType = "poly" | "exp" | "log" | Exclude<TrigonometricFunction, "">
    interface Coefficients {
        a: MathValue
        b: MathValue
        c: MathValue
    }
    type NamedCoefficients = { [Name in Variable]: number | Name }
    interface NumericCoefficients {
        a: number
        b: number
        c: number
    }

    interface PointPair {
        x: number
        y: number
    }
    type LinearBasis = Record<string, (x: number) => number>

    type Degrees = "deg" | "rad"
    type Language = "pt-br" | "pt-pt" | "en-us" | "en-gb" | "es-419" | "es-es"
    type TypeMessage = "confirm" | "console" | "display" | "error" | "warning"
    type TextCase = "uppercase" | "capitalized" | "lowercase" | "default"
    type CommandsNames = "change" | "config" | "exit" | "history" | "review" | "start"
    type ExplicitMulti = "never" | "zero" | "one" | "always"
    type ShowFunction = "always" | "never" | "onChange"

    interface Options {
        invert?: boolean
        places?: Places
        precision?: Precision
        shouldRound?: boolean
    }
    interface InputOptions {
        explanation?: string
        number?: boolean
        placeholder?: string
        places?: Places
    }
    interface RangeOptions {
        commands?: boolean
        explanation?: string
        max?: number
        min?: number
        places?: Places
    }
    type MessageOptions = { explanation?: string; type?: Exclude<TypeMessage, "warning"> } | { explanation?: string; type: "warning"; asConfirm?: boolean }

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    type PtBRShape = (typeof import("../src/JSON/i18n/pt-BR.d.ts"))["default"]
    type PathsOf<T> = T extends string ? never : { [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly unknown[] ? never : PathsOf<T[K]> extends never ? never : `${K}.${PathsOf<T[K]>}` }[keyof T & string]
    type TranslationKey = PathsOf<PtBRShape>
    type ResolveValue<T, P extends string> = P extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ResolveValue<T[Head], Rest> : never) : P extends keyof T ? T[P] : never
    type ExtractPlaceholders<S extends string> = S extends `${string}{${infer Param}}${infer Rest}` ? Param | ExtractPlaceholders<Rest> : never
    type PlaceholdersOf<K extends TranslationKey> = ExtractPlaceholders<ResolveValue<PtBRShape, K> & string>
    type ParamsOf<K extends TranslationKey> = [PlaceholdersOf<K>] extends [never] ? undefined : Record<PlaceholdersOf<K>, Value>
    type TrArgs = { [K in TranslationKey]: ParamsOf<K> extends undefined ? [key: K] : [key: K, params: ParamsOf<K>] }[TranslationKey]

    type ErrorCode = Extract<TranslationKey, `errors.${string}`>

    type DomainResult<TValue = unknown, TError = ErrorCode, TSymbol = string> = { kind: "valid"; value: TValue } | { kind: "symbol"; name: TSymbol } | { kind: "note"; value: TValue; note: ErrorCode } | { kind: "invalid"; value?: number | null } | { kind: "error"; error: TError }

    type SimpleResult<TValue = unknown> = Extract<DomainResult<TValue>, { kind: "valid" | "invalid" }>
    type SymbolicResult<TValue = unknown, TSymbol = string> = Extract<DomainResult<TValue, ErrorCode, TSymbol>, { kind: "valid" | "invalid" | "symbol" }>
    type NotedResult<TValue = unknown> = Extract<DomainResult<TValue>, { kind: "valid" | "invalid" | "note" }>
    type FallibleResult<TValue = unknown, TError = ErrorCode> = Extract<DomainResult<TValue, TError>, { kind: "valid" | "invalid" | "error" }>
}

export {}
