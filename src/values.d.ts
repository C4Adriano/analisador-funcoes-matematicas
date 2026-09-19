/**
 * Dígito numérico.
 * @since ~v6.2.0
 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Opções básicas suportadas pelo programa.
 * @since v6.6.1
 */
export type Options = { round?: boolean; precision?: Precision; places?: Places; invert?: boolean }

/**
 * Opções básicas para `input`s suportadas pelo programa.
 * @since v6.7.0
 */
export type InputOptions = {
    explanation?: Str
    number?: boolean
    places?: Places
    commands?: boolean
    placeholder?: Value
}

/**
 * Opções básicas para intervalos suportadas pelo programa.
 * @since v6.7.0
 */
export type RangeOptions = { explanation?: Str; min?: Numeric; max?: Numeric; places?: Places; commands?: boolean }

/**
 * Opções básicas para mensagens suportadas pelo programa.
 * @since v6.6.1
 */
export type MessageOptions =
    | { explanation?: Str; type?: Exclude<TypeMessage, "warning"> }
    | { explanation?: Str; type: "warning"; asConfirm?: boolean }
