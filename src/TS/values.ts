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
 * Funções trigonométricas suportadas pelo programa.
 */
export type TrigonometricFunction = "sin" | "cos" | "tan" | "csc" | "sec" | "cot" | ""

/**
 * Unidades de ângulo suportadas pelo programa.
 */
export type Degrees = "deg" | "rad"

/**
 * Idiomas suportados pelo programa.
 */
export type Language = "pt" | "pt-br" | "en"

/**
 * Comandos suportados pelo programa.
 */
export type CommandsNames = "config" | "start" | "review" | "change" | "history" | "exit"
