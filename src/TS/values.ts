/**
 * Variáveis matemáticas.
 */
export type Variable = string

/**
 * Números matemáticos.
 */
export type Numeric = number

/**
 * Valores matemáticos.
 */
export type Value = Variable | Numeric

/**
 * Texto genérico.
 */
export type Text = string

/**
 * Precisão numérica.
 */
export type Precision = number

/**
 * Casas decimais.
 */
export type Places = number

/**
 * Dígitos numéricos.
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
