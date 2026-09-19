import type { InputOptions, MessageOptions, RangeOptions } from "./values.d.ts"

/**
 * # Ui
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo exibições na tela.
 *
 * ## Métodos:
 * - {@link Ui.notifyOptions notifyOptions} - Mostra uma mensagem qualquer, com base no `type` informado.
 * - {@link Ui.menu menu} - Mostra um menu.
 * - {@link Ui.inputOptions inputOptions} - Pergunta algo para o usuário.
 * - {@link Ui.resolveFunction resolveFunction} - Mostra uma Função.
 * - {@link Ui.rangeOptions rangeOptions} - Mostra um intervalo.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group UI
 * @since v6.1.0
 */
export declare const Ui: {
    /** Exibe uma mensagem qualquer, como {@link alert `alert`}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "warning"; asConfirm?: false }): void
    /** Exibe uma mensagem qualquer, como {@link confirm `confirm`}, via {@link alert `alert`}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "warning"; asConfirm: true }): boolean
    /** Exibe uma mensagem qualquer, como {@link confirm `confirm`}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "confirm"; asConfirm?: never }): boolean
    /** Exibe uma mensagem qualquer, como {@link confirm `confirm`}. @deprecated Use `{ type: "confirm" }` no lugar. */
    notifyOptions(message: Str, option: MessageOptions & { asConfirm: true }): boolean
    /** Exibe uma mensagem qualquer. */
    notifyOptions(
        message?: Str,
        option?: MessageOptions & { type?: "display" | "error" | "console"; asConfirm?: never }
    ): void
    /**
     * Exibe uma mensagem qualquer, com base no `type` informado.
     * @param message - Mensagem
     * @param option - Opções
     * @default options = { asConfirm: false, type: "display" }
     * @group UI
     * @since v6.6.1
     */
    notifyOptions(message: Str, option?: MessageOptions): boolean | void

    /**
     * Formata um menu paginado.
     * @param options Array com todas as opções possíveis.
     * @param page Página atual.
     * @returns Retorna a resposta, a página atual, as opções por página.
     * @group UI
     * @since v6.1.0
     */
    menu(options: Str[], page: Numeric): [CommandsNames | Numeric, Numeric]

    /** Texto, com comandos. */
    inputOptions(message: Str, options?: InputOptions & { number?: false; commands: true }): Variable | CommandsNames
    /** Número, com comandos. */
    inputOptions(message: Str, options?: InputOptions & { number: true; commands: true }): Numeric | CommandsNames
    /** Texto. */
    inputOptions(message: Str, options?: InputOptions & { number?: false }): Variable
    /** Número. */
    inputOptions(message: Str, options?: InputOptions & { number: true }): Numeric
    /**
     * Exibe um prompt personalizado e verifica ele.
     * @param message - Mensagem.
     * @param options - Opções.
     * @default { number: false, places: Config.decimalPlaces, commands: false }
     * @returns Valor verificado.
     * @group UI
     * @since v6.1.0
     */
    inputOptions(message: Str, options?: InputOptions): Value

    /**
     * Formata uma Função.
     * @param coefs - Coeficientes.
     * @param funcType - Tipo da Função.
     * @param show - Mostrará a Função ou não, baseado na configuração.
     * @default coefs = { a: State.numericA, b: State.numericB, c: State.numericC }; funcType = "poly"; show = true
     * @group UI
     * @since v6.6.1
     */
    resolveFunction(coefs?: Coefficients, funcType?: FunctionType, show?: boolean): void

    /** Sem comandos. */
    rangeOptions(message: Str, options?: RangeOptions & { commands?: false }): Numeric
    /**
     * Pede ao usuário um valor entre o intervalo.
     * @param message - Mensagem.
     * @param options - Opções.
     * @returns Um valor escolhido entre o intervalo.
     * @group UI
     * @since v6.1.0
     */
    rangeOptions(message: Str, options?: RangeOptions): Numeric | CommandsNames
}
