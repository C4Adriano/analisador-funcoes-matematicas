/**
 * Variáveis
 */
export type Variable = string

/**
 * Números
 */
export type Numeric = number

/**
 * Valores matemáticos
 */
export type Value = Variable | Numeric

/**
 * Precisão numérica
 */
export type Precision = number

/**
 * Par de valores.
 */
export type Pair = [Value, Value]

/**
 * Vetor de valores matemáticos.
 */
export type ValueArray = Value[]

/**
 * Idiomas suportados.
 */
export type Language = "pt" | "pt-br" | "en"
