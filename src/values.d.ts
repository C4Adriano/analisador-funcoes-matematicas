/**
 * Dígito numérico.
 * @since ~v6.2.0
 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Opções básicas suportadas pelo programa.
 * @since v6.6.1
 */
export type Options = {
    /** Arredondamento. */
    round?: boolean
    /** Precisão. */
    precision?: Precision
    /** Casas decimais. */
    places?: Places
}

/**
 * Opções básicas para mensagens suportadas pelo programa.
 * @since v6.6.1
 */
export type MessageOptions =
    | {
          explanation?: Str
          type?: Exclude<TypeMessage, "warning">
      }
    | {
          explanation?: Str
          type: "warning"
          asConfirm?: boolean
      }
