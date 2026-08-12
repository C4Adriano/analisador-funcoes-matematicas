/**
 * Texto genérico.
 * @since ~~v6.2.0
 */
export type Text = string

/**
 * Número genérico.
 * @since ~~v6.2.0
 */
export type Numeric = number

/**
 * Variável matemática.
 * @since ~v6.2.0
 */
export type Variable = Text

/**
 * Valor matemático.
 * @since ~v6.2.0
 */
export type Value = Variable | Numeric

/**
 * Precisão numérica.
 * @since ~v6.2.0
 */
export type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12

/**
 * Casas decimais.
 * @since ~v6.2.0
 */
export type Places = Numeric

/**
 * Dígito numérico.
 * @since ~v6.2.0
 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Vetor de valores matemáticos.
 * @since ~v6.2.0
 */
export type ValueArray = Value[]

/**
 * Matriz de valores matemáticos.
 * @since ~v6.2.0
 */
export type ValueMatrix = Value[][]

/**
 * Array de números.
 * @since ~v6.2.0
 */
export type NumericArray = Numeric[]

/**
 * Funções trigonométricas suportadas pelo programa.
 * @since ~v6.2.0
 */
export type TrigonometricFunction = "sin" | "cos" | "tan" | "csc" | "sec" | "cot" | ""

/**
 * Funções suportadas pelo programa.
 * @since v6.6.0
 */
export type FunctionType = "poly" | "exp" | "log" | Exclude<TrigonometricFunction, "">

/**
 * Coeficientes suportados pelo programa.
 * @since v6.6.0
 */
export type Coefficients = {
    a: Value
    b: Value
    c: Value
}

/**
 * Um par ordenado de um ponto qualquer.
 * @since v6.6.0
 */
export type PointPair = {
    x: number
    y: number
}

/**
 * Usado para montar a matriz de um sistema linear genérico.
 * @since v6.6.0
 */
export type LinearBasis = {
    [coefficient: string]: (x: number) => number
}

/**
 * Unidades de ângulo suportadas pelo programa.
 * @since ~v6.2.0
 */
export type Degrees = "deg" | "rad"

/**
 * Idiomas suportados pelo programa.
 * @since ~v6.2.0
 */
export type Language = "pt-br" | "pt-pt" | "en-us" | "en-gb" | "es-419" | "es-es"

/**
 * Comandos suportados pelo programa.
 * @since ~v6.2.0
 */
export type CommandsNames = "config" | "start" | "review" | "change" | "history" | "exit"

/**
 * Opções básicas suportadas pelo programa.
 * @since v6.6.1
 */
export type Options = {
    round?: boolean
    precision?: Precision
    places?: Places
}

/**
 * Opções básicas para mensagens suportadas pelo programa.
 * @since v6.6.1
 */
export type MessageOptions = {
    explanation?: Text
    debug?: boolean
    asConfirm?: boolean
    allowCommands?: boolean
}
