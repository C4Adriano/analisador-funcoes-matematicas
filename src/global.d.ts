import type { PLACES, PRECISIONS } from "./Base/quantity.js"
import type PtBR from "./Lang/i18n/pt-BR.js"

declare global {
    const brand: unique symbol
    type Brand<Base, Name extends string> = Base & { readonly [brand]: Readonly<Record<Name, true>> }

    type List<T> = T[]
    type Matrix<T> = T[][]
    type Raw = number
    type Token = string | Real
    type Parameter = string | Real

    type SetName = "integer" | "rational" | "irrational"
    type SignName = "negative" | "zero" | "positive"
    type Flip<G extends SignName> = G extends "positive" ? "negative" : G extends "negative" ? "positive" : "zero"

    type Finite<S extends SetName = SetName, G extends SignName = SignName> = number & { readonly [brand]: { readonly extent: "finite"; readonly set: S; readonly sign: G } }

    type Real = Finite
    type Rational = Finite<"integer" | "rational">
    type Irrational = Finite<"irrational">
    type Integer = Finite<"integer">

    type Zero = Finite<"integer", "zero">
    type Positive = Finite<SetName, "positive">
    type Negative = Finite<SetName, "negative">
    type NonZero = Finite<SetName, "negative" | "positive">
    type NonNegative = Finite<SetName, "zero" | "positive">
    type NonPositive = Finite<SetName, "negative" | "zero">

    type Natural = Finite<"integer", "zero" | "positive">
    type PositiveInteger = Finite<"integer", "positive">
    type NegativeInteger = Finite<"integer", "negative">

    type PositiveInfinity = number & { readonly [brand]: { readonly extent: "infinite"; readonly sign: "positive" } }
    type NegativeInfinity = number & { readonly [brand]: { readonly extent: "infinite"; readonly sign: "negative" } }
    type Infinity = PositiveInfinity | NegativeInfinity
    type ExtendedReal = Real | Infinity

    type LogBase = Positive & Brand<number, "logBase">
    type Places = Natural & Brand<(typeof PLACES)[number], "places">
    type Precision = Rational & Positive & Brand<(typeof PRECISIONS)[number], "precision">
    type Radians = Real & Brand<number, "radians">
    type Degrees = Real & Brand<number, "degrees">

    type SignOf<N extends number> = `${N}` extends "0" ? "zero" : `${N}` extends `-${string}` ? "negative" : "positive"
    type SetOf<N extends number> = `${N}` extends `${string}.${string}` | `${string}e-${string}` ? "rational" : "integer"
    type Numeric<N extends number> = number extends N ? Real : N extends unknown ? N & Finite<SetOf<N>, SignOf<N>> : never
    type IsLiteral<T extends number> = number extends T ? false : true
    type Checked<T, Target extends number> = T extends Target ? T : T extends Infinity ? null : T extends number ? (IsLiteral<T> extends true ? (Numeric<T> extends Target ? Numeric<T> : null) : Target | null) : Target | null

    type Closure = "open" | "closed"
    type LowerBound = { value: Real; closure: Closure } | { value: NegativeInfinity; closure: "open" }
    type UpperBound = { value: Real; closure: Closure } | { value: PositiveInfinity; closure: "open" }

    interface Interval {
        lower: LowerBound
        upper: UpperBound
    }

    type RealSet = List<Interval>
    type Cardinality = Natural | "infinite"

    type Variable = "a" | "b" | "c"
    type MathValue = Variable | Real

    type Coefficients = Record<Variable, MathValue>
    type NamedCoefficient<Name extends Variable = Variable> = Real | Name
    type NamedCoefficients = { [Name in Variable]: NamedCoefficient<Name> }
    type NamedCoefficientsFor<K extends Variable> = Partial<Pick<NamedCoefficients, K>>
    type NumericCoefficients = Record<Variable, Real>
    type NumericCoefficientsFor<K extends Variable> = Partial<Pick<NumericCoefficients, K>>

    interface Point {
        x: Real
        y: Real
    }
    type PointPairReturn<T extends 1 | 2 | 3 = 1> = T extends 1 ? [Point] : T extends 2 ? [Point, Point] : [Point, Point, Point]
    type LinearBasis = Record<string, (x: Real) => Real | null>

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
        number: Real
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
        max?: Real
        min?: Real
    }

    interface MessageOptions {
        explanation?: string
        type?: MessageType
    }

    interface Pager {
        page: Natural
    }

    type PtBRShape = typeof PtBR
    type PathsOf<T> = T extends string ? never : { [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly unknown[] ? never : `${K}.${PathsOf<T[K]>}` }[keyof T & string]
    type TranslationKey = PathsOf<PtBRShape>
    type ResolveValue<T, P extends string> = P extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ResolveValue<T[Head], Rest> : never) : P extends keyof T ? T[P] : never
    type ExtractPlaceholders<S extends string> = S extends `${string}{${infer Parameter}}${infer Rest}` ? Parameter | ExtractPlaceholders<Rest> : never
    type PlaceholdersOf<K extends TranslationKey> = ExtractPlaceholders<ResolveValue<PtBRShape, K> & string>
    type ParametersOf<K extends TranslationKey> = [PlaceholdersOf<K>] extends [never] ? undefined : Record<PlaceholdersOf<K>, Parameter>
    type TranslationParameters<K extends TranslationKey = TranslationKey> = K extends TranslationKey ? (ParametersOf<K> extends undefined ? [key: K] : [key: K, params: ParametersOf<K>]) : never
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

    type Kind = "real" | "complex" | "angle"
    type Operator = "+" | "-" | "*" | "/" | "^"
    type FunctionName = "sin" | "cos" | "tan" | "atan" | "abs" | "arg" | "conj" | "sqrt" | "cbrt"
    type FailReason = "incompatible" | "divZero"

    interface Complex {
        re: Real
        im: Real
    }

    interface RealQuantity {
        kind: "real"
        value: Real
    }

    interface ComplexQuantity extends Complex {
        kind: "complex"
    }

    interface AngleQuantity {
        kind: "angle"
        radians: Radians
    }

    type Quantity = RealQuantity | ComplexQuantity | AngleQuantity
    type Of<K extends Kind> = Extract<Quantity, { kind: K }>
    type Outcome = Quantity | "divZero"
    type Handler = (left: Quantity, right: Quantity) => Outcome
    type UnaryHandler = (argument: Quantity) => Quantity
    type Builder = (value: Raw) => Quantity

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
