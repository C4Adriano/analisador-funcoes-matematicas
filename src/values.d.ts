/**
 * Texto genérico.
 */
export type Text = string

/**
 * Número genérico.
 */
export type Numeric = number

/**
 * Variável matemática.
 */
export type Variable = Text

/**
 * Valor matemático.
 */
export type Value = Variable | Numeric

/**
 * Precisão numérica.
 */
export type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12

/**
 * Casas decimais.
 */
export type Places = Numeric

/**
 * Dígito numérico.
 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Vetor de valores matemáticos.
 */
export type ValueArray = Value[]

/**
 * Matriz de valores matemáticos.
 */
export type ValueMatrix = Value[][]

/**
 * Array de números.
 */
export type NumericArray = Numeric[]

/**
 * Funções trigonométricas suportadas pelo programa.
 */
export type TrigonometricFunction = "sin" | "cos" | "tan" | "csc" | "sec" | "cot" | ""

/**
 * Funções suportadas pelo programa
 */
export type FunctionType = "poly" | "exp" | "log" | Exclude<TrigonometricFunction, "">

/**
 * Coeficientes suportados pelo programa
 */
export type Coefficients = { a: Value; b: Value; c: Value }

/**
 * Um par ordenado de um ponto qualquer
 */
export type PointPair = {
    x: number
    y: number
}

/**
 * Usado para montar a matriz de um sistema linear genérico em {@link Algebra.solveLinearCoefs}.
 */
export type LinearBasis = {
    [coefficient: string]: (x: number) => number
}

/**
 * Unidades de ângulo suportadas pelo programa.
 */
export type Degrees = "deg" | "rad"

/**
 * Idiomas suportados pelo programa.
 */
export type Language = "pt-br" | "pt-pt" | "en-us" | "en-gb" | "es-419" | "es-es"

/**
 * Comandos suportados pelo programa.
 */
export type CommandsNames = "config" | "start" | "review" | "change" | "history" | "exit"
