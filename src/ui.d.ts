import type { InputOptions, MessageOptions, RangeOptions } from "./values.d.ts"

/**
 * # UI
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo exibições na tela.
 *
 * ## Métodos:
 * - {@link Ui.inputOptions inputOptions} - Pergunta algo para o usuário.
 * - {@link Ui.menu menu} - Mostra um menu.
 * - {@link Ui.notifyOptions notifyOptions} - Mostra uma mensagem qualquer, com base no `type` informado.
 * - {@link Ui.rangeOptions rangeOptions} - Mostra um intervalo.
 * - {@link Ui.resolveFunction resolveFunction} - Mostra uma Função.
 *
 * ### Tags:
 * @license [License](../LICENSE.md)
 * @group UI
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @since v6.1.0
 */
export declare const Ui: {
    /**
     * Exibe uma mensagem qualquer, como {@link alert `alert`}.
     */
    notifyOptions: ((message: Str, option: MessageOptions & { type: "warning"; asConfirm?: false }) => void) &
        ((
            message: Str,
            option:
                | (MessageOptions & { type: "warning"; asConfirm: true })
                | (MessageOptions & { type: "confirm"; asConfirm?: never })
        ) => boolean) &
        ((
            message?: Str,
            option?: MessageOptions & { type?: "display" | "error" | "console"; asConfirm?: never }
        ) => void) &
        ((message: Str, option?: MessageOptions) => boolean | undefined)

    /**
     * Formata um menu paginado.
     * @param options - Array com todas as opções possíveis.
     * @param page - Página atual.
     * @returns Retorna a resposta, a página atual, as opções por página.
     * @group UI
     * @since v6.1.0
     */
    menu: (options: Str[], page: Numeric) => [CommandsNames | Numeric, Numeric]

    /**
     * Texto, com comandos.
     */
    inputOptions: ((
        message: Str,
        options?: InputOptions & { number?: false; commands: true }
    ) => Variable | CommandsNames) &
        ((message: Str, options?: InputOptions & { number: true; commands: true }) => Numeric | CommandsNames) &
        ((message: Str, options?: InputOptions & { number?: false }) => Variable) &
        ((message: Str, options?: InputOptions & { number: true }) => Numeric) &
        ((message: Str, options?: InputOptions) => Value)

    /**
     * Formata uma Função.
     * @param coefs - Coeficientes.
     * @param funcType - Tipo da Função.
     * @param show - Mostrará a Função ou não, baseado na configuração.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }; funcType = "poly"; show = true
     * @group UI
     * @since v6.6.1
     */
    resolveFunction: (coefs?: Coefficients, funcType?: FunctionType, show?: boolean) => void

    /**
     * Sem comandos.
     */
    rangeOptions: ((message: Str, options?: RangeOptions & { commands?: false }) => Numeric) &
        ((message: Str, options?: RangeOptions) => Numeric | CommandsNames)
}
