import type { PLACES, PRECISIONS } from "./Base/quantity.js"
import type PtBR from "./Lang/i18n/pt-BR.js"

declare global {
    type Places = (typeof PLACES)[number]
    type Precision = (typeof PRECISIONS)[number]

    type Variable = "a" | "b" | "c"

    type NamedCoefficient<Name extends Variable = Variable> = number | Name
    type NamedCoefficients = { [Name in Variable]: NamedCoefficient<Name> }
    type NamedCoefficientsFor<K extends Variable> = Partial<Pick<NamedCoefficients, K>>
    type NumericCoefficients = Record<Variable, number>
    type NumericCoefficientsFor<K extends Variable> = Partial<Pick<NumericCoefficients, K>>

    interface Point {
        x: number
        y: number
    }
    type PointPairReturn<T extends 1 | 2 | 3 = 1> = T extends 1 ? [Point] : T extends 2 ? [Point, Point] : [Point, Point, Point]
    type LinearBasis = Record<string, (x: number) => number | null>

    type TrigonometricName = "sin" | "cos" | "tan" | "csc" | "sec" | "cot"
    type TrigonometricFunction = TrigonometricName | ""
    type FunctionType = "poly" | "exp" | "log" | TrigonometricName

    type Toggle = "on" | "off"
    type AngleUnit = "deg" | "rad"
    type CommandNames = "change" | "config" | "exit" | "history" | "review" | "start"
    type DecimalSeparator = "comma" | "dot"
    type ExplicitMulti = Toggle | "zero" | "one"
    type Language = "pt-br" | "pt-pt" | "en-us" | "en-gb" | "es-419" | "es-es"
    type MessageType = "console" | "display" | "error" | "warning"
    type ShowFunction = Toggle | "changed"
    type TextCase = "default" | "uppercase" | "capitalized" | "lowercase"
    type LoadOptions = "loaded" | "empty" | "corrupted"

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

    interface MessageOptions {
        explanation?: string
        type?: MessageType
    }

    type PtBRShape = typeof PtBR
    type PathsOf<T> = T extends string ? never : { [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly unknown[] ? never : `${K}.${PathsOf<T[K]>}` }[keyof T & string]
    type TranslationKey = PathsOf<PtBRShape>
    type ResolveValue<T, P extends string> = P extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ResolveValue<T[Head], Rest> : never) : P extends keyof T ? T[P] : never
    type ExtractPlaceholders<S extends string> = S extends `${string}{${infer Parameter}}${infer Rest}` ? Parameter | ExtractPlaceholders<Rest> : never
    type PlaceholdersOf<K extends TranslationKey> = ExtractPlaceholders<ResolveValue<PtBRShape, K> & string>
    type ParametersOf<K extends TranslationKey> = [PlaceholdersOf<K>] extends [never] ? undefined : Record<PlaceholdersOf<K>, string | number>
    type TranslationParameters<K extends TranslationKey = TranslationKey> = K extends TranslationKey ? (ParametersOf<K> extends undefined ? [key: K] : [key: K, params: ParametersOf<K>]) : never
    type ErrorCode = Extract<TranslationKey, `errors.${string}`>

    interface ValidResult<TValue> {
        kind: "valid"
        value: TValue
    }
    interface NoteResult<TValue, TError> {
        kind: "note"
        value: TValue
        note: TError
    }
    interface InvalidResult {
        kind: "invalid"
    }

    type SimpleResult<TValue = unknown> = ValidResult<TValue> | InvalidResult
    type NotedResult<TValue = unknown, TError = ErrorCode> = SimpleResult<TValue> | NoteResult<TValue, TError>

    type Kind = "real" | "complex" | "angle"
    type Operator = "+" | "-" | "*" | "/" | "^"
    type FunctionName = "sin" | "cos" | "tan" | "atan" | "abs" | "arg" | "conj" | "sqrt" | "cbrt"
    type FailReason = "incompatible" | "divZero"

    interface Complex {
        re: number
        im: number
    }

    interface RealQuantity {
        kind: "real"
        value: number
    }

    interface ComplexQuantity extends Complex {
        kind: "complex"
    }

    interface AngleQuantity {
        kind: "angle"
        radians: number
    }

    type Quantity = RealQuantity | ComplexQuantity | AngleQuantity
    type Of<K extends Kind> = Extract<Quantity, { kind: K }>
    type Outcome = Quantity | "divZero"
    type Handler = (left: Quantity, right: Quantity) => Outcome
    type UnaryHandler = (argument: Quantity) => Quantity
    type Builder = (value: number) => Quantity

    interface Invalid {
        kind: "invalid"
        reason: FailReason
        operator: Operator | FunctionName
        left: Kind
        right: Kind | null
    }

    type QuantityResult = Invalid | { kind: "valid"; value: Quantity }
    type OperationTable = Record<Operator, { [L in Kind]?: { [R in Kind]?: (left: Of<L>, right: Of<R>) => Outcome } }>
    type FunctionTable = Record<FunctionName, { [K in Kind]?: (argument: Of<K>) => Quantity }>
    type ExpressionError = Invalid | { kind: "notReal"; actual: Kind }
    type ExpressionResult<Name extends symbol> = { kind: "valid"; value: Quantity } | { kind: "symbol"; name: Name } | { kind: "invalid"; error: Invalid | null }
}
