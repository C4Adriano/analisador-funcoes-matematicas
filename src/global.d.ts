import type PtBR from "./Lang/i18n/pt-BR.js"

declare global {
    type List<T> = T[]
    type Matrix<T> = T[][]
    type Value = string | number

    type Variable = "a" | "b" | "c"
    type MathValue = Variable | number

    type TrigonometricName = "sin" | "cos" | "tan" | "csc" | "sec" | "cot"
    type TrigonometricFunction = TrigonometricName | ""
    type FunctionType = "poly" | "exp" | "log" | TrigonometricName

    type Coefficients = Record<Variable, MathValue>
    type NamedCoefficient<Name extends Variable = Variable> = number | Name
    type NamedCoefficients = { [Name in Variable]: NamedCoefficient<Name> }
    type NamedCoefficientsFor<K extends Variable> = Partial<Pick<NamedCoefficients, K>>
    type NumericCoefficients = Record<Variable, number>
    type NumericCoefficientsFor<K extends Variable> = Partial<Pick<NumericCoefficients, K>>

    interface Point {
        x: number
        y: number
    }
    type PointPairReturn<T extends 1 | 2 | 3 = 1> = T extends 1 ? [{ x: number; y: number }] : T extends 2 ? [{ x: number; y: number }, { x: number; y: number }] : [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }]
    type LinearBasis = Record<string, (x: number) => number>

    type Toggle = "on" | "off"
    type AngleUnit = "deg" | "rad"
    type CommandNames = "change" | "config" | "exit" | "history" | "review" | "start"
    type DecimalSeparator = "comma" | "dot"
    type ExplicitMulti = Toggle | "zero" | "one"
    type Language = "pt-br" | "pt-pt" | "en-us" | "en-gb" | "es-419" | "es-es"
    type MessageType = "confirm" | "console" | "display" | "error" | "warning"
    type Places = 0 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 20
    type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12
    type ShowFunction = Toggle | "changed"
    type TextCase = "default" | "uppercase" | "capitalized" | "lowercase"

    interface ValueTypeMap {
        string: string
        number: number
    }
    type ValueTypeName = keyof ValueTypeMap

    interface BaseOptions {
        explanation?: string
        places?: Places
    }

    interface TypedOptions<T extends ValueTypeName = ValueTypeName> extends BaseOptions {
        type?: T
    }

    interface NumericOptions<T extends ValueTypeName = ValueTypeName> extends TypedOptions<T> {
        precision?: Precision
        shouldRound?: boolean
    }

    interface InputOptions<T extends ValueTypeName = ValueTypeName> extends TypedOptions<T> {
        placeholder?: string
    }

    interface RangeOptions extends BaseOptions {
        commands?: boolean
        max?: number
        min?: number
    }

    interface DefaultMessageOptions extends BaseOptions {
        type?: Exclude<MessageType, "warning">
    }

    interface WarningMessageOptions extends BaseOptions {
        type: "warning"
        asConfirm?: boolean
    }

    type MessageOptions = DefaultMessageOptions | WarningMessageOptions

    type PtBRShape = typeof PtBR
    type PathsOf<T> = T extends string ? never : { [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly unknown[] ? never : `${K}.${PathsOf<T[K]>}` }[keyof T & string]
    type TranslationKey = PathsOf<PtBRShape>
    type ResolveValue<T, P extends string> = P extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ResolveValue<T[Head], Rest> : never) : P extends keyof T ? T[P] : never
    type ExtractPlaceholders<S extends string> = S extends `${string}{${infer Param}}${infer Rest}` ? Param | ExtractPlaceholders<Rest> : never
    type PlaceholdersOf<K extends TranslationKey> = ExtractPlaceholders<ResolveValue<PtBRShape, K> & string>
    type ParamsOf<K extends TranslationKey> = [PlaceholdersOf<K>] extends [never] ? undefined : Record<PlaceholdersOf<K>, Value>
    type TrArgs<K extends TranslationKey = TranslationKey> = K extends TranslationKey ? (ParamsOf<K> extends undefined ? [key: K] : [key: K, params: ParamsOf<K>]) : never
    type ErrorCode = Extract<TranslationKey, `errors.${string}`>

    interface ValidResult<TValue> {
        kind: "valid"
        value: TValue
    }
    interface SymbolResult<TSymbol> {
        kind: "symbol"
        name: TSymbol
    }
    interface NoteResult<TValue, TError> {
        kind: "note"
        value: TValue
        note: TError
    }
    interface InvalidResult {
        kind: "invalid"
        value?: number | null
    }
    interface ErrorResult<TError> {
        kind: "error"
        error: TError
    }

    type DomainResult<TValue = unknown, TError = ErrorCode, TSymbol = string> = ValidResult<TValue> | SymbolResult<TSymbol> | NoteResult<TValue, TError> | InvalidResult | ErrorResult<TError>
    type SimpleResult<TValue = unknown> = ValidResult<TValue> | InvalidResult
    type SymbolicResult<TValue = unknown, TSymbol = string> = SimpleResult<TValue> | SymbolResult<TSymbol>
    type NotedResult<TValue = unknown, TError = ErrorCode> = SimpleResult<TValue> | NoteResult<TValue, TError>
    type FallibleResult<TValue = unknown, TError = ErrorCode> = SimpleResult<TValue> | ErrorResult<TError>

    interface Pager {
        page: number
    }
}
