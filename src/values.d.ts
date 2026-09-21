/**
 * Dígito numérico.
 * @since ~v6.2.0
 */
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Opções básicas suportadas pelo programa.
 * @since v6.6.1
 */
interface Options {
    invert?: boolean
    places?: Places
    precision?: Precision
    round?: boolean
}

/**
 * Opções básicas para `input`s suportadas pelo programa.
 * @since v6.7.0
 */
interface InputOptions {
    commands?: boolean
    explanation?: Str
    number?: boolean
    placeholder?: Value
    places?: Places
}

/**
 * Opções básicas para intervalos suportadas pelo programa.
 * @since v6.7.0
 */
interface RangeOptions {
    commands?: boolean
    explanation?: Str
    max?: Numeric
    min?: Numeric
    places?: Places
}

/**
 * Opções básicas para mensagens suportadas pelo programa.
 * @since v6.6.1
 */
type MessageOptions =
    | { explanation?: Str; type?: Exclude<TypeMessage, "warning"> }
    | { explanation?: Str; type: "warning"; asConfirm?: boolean }

export type { Digit, InputOptions, MessageOptions, Options, RangeOptions }
