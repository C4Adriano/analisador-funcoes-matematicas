declare global {
    /**
    @deprecated
     */
    type Str = string

    /**
    @deprecated
     */
    type Numeric = number
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
}

export {}
