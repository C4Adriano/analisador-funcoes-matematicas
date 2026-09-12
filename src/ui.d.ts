import type { CommandsNames, MessageOptions } from "./values.d.ts"

/**
 * # Ui
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo exibições na tela.
 *
 * ## Métodos:
 * - {@link Ui.notify notify} - Mostra uma mensagem qualquer.
 * - {@link Ui.display display} - Mostra uma mensagem.
 * - {@link Ui.confirm confirm} - Pergunta “Sim” ou “Não”.
 * - {@link Ui.error error} - Mostra um erro.
 * - {@link Ui.warning warning} - Mostra um aviso.
 * - {@link Ui.menu menu} - Mostra um menu.
 * - {@link Ui.input input} - Pergunta algo para o usuário.
 * - {@link Ui.resolveFunction resolveFunction} - Mostra uma Função.
 * - {@link Ui.range range} - Mostra um intervalo.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group UI
 * @since v6.1.0
 */
export declare const Ui: {
    /** Exibe uma mensagem qualquer, como {@link Ui.display display}. @deprecated */
    notify(message: Str, explanation?: Str, asConfirm?: false): undefined
    /** Exibe uma mensagem qualquer, como {@link Ui.confirm `confirm`}. @deprecated */
    notify(message: Str, explanation?: Str, asConfirm: true): boolean
    /**
     * Exibe uma mensagem qualquer.
     * @deprecated
     * Desde v6.6.7. Use {@link Ui.notifyOptions} com um objeto {@link MessageOptions} ao invés dos parâmetros.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     *
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param asConfirm - Se é {@link Ui.confirm `confirm`} ou não.
     * @group UI
     * @since v6.6.1
     */
    notify(message: Str, explanation?: Str, asConfirm?: boolean): boolean | undefined

    /** Exibe uma mensagem qualquer, como {@link Ui.warning aviso}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "warning"; asConfirm?: false }): null
    /** Exibe uma mensagem qualquer, como {@link Ui.confirm `confirm`}, via {@link Ui.warning aviso}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "warning"; asConfirm: true }): boolean
    /** Exibe uma mensagem qualquer, como {@link Ui.confirm `confirm`}. */
    notifyOptions(message: Str, option: MessageOptions & { type: "confirm"; asConfirm?: never }): boolean
    /** Exibe uma mensagem qualquer, como {@link Ui.confirm `confirm`}. @deprecated Use `{ type: "confirm" }` no lugar. */
    notifyOptions(message: Str, option: MessageOptions & { asConfirm: true }): boolean
    /** Exibe uma mensagem qualquer. */
    notifyOptions(
        message?: Str,
        option?: MessageOptions & { type?: "display" | "error" | "console"; asConfirm?: never }
    ): null
    /**
     * Exibe uma mensagem qualquer, com base no `type` informado.
     * @param message - Mensagem
     * @param option - Opções
     * @default options = { asConfirm: false, type: "display" }
     * @group UI
     * @since v6.6.1
     */
    notifyOptions(message: Str, option?: MessageOptions): boolean | null

    /**
     * Exibe um `alert` personalizado.
     * @deprecated
     * Desde v6.6.7. Use {@link Ui.notifyOptions} com um objeto {@link MessageOptions} com `type: "display"`
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @group UI
     * @since v6.1.0
     */
    display(message: Str, explanation?: Str): undefined

    /**
     * Exibe um `confirm` personalizado.
     * @deprecated
     * Desde v6.6.7. Use {@link Ui.notifyOptions} com um objeto {@link MessageOptions} com `type: "confirm"`
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @returns "Sim" ou "Não".
     * @group UI
     * @since v6.1.0
     */
    confirm(message: Str, explanation?: Str): boolean

    /**
     * Exibe uma mensagem de erro.
     * @deprecated
     * Desde v6.6.7. Use {@link Ui.notifyOptions} com um objeto {@link MessageOptions} com `type: "error"`
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @group UI
     * @since v6.1.0
     */
    error(message: Str, explanation?: Str): undefined

    /** Exibe uma mensagem de aviso, como `alert`. @deprecated */
    warning(message: Str, explanation?: Str, asConfirm?: false): undefined
    /** Exibe uma mensagem de aviso, como {@link Ui.confirm `confirm`}. @deprecated */
    warning(message: Str, explanation?: Str, asConfirm: true): boolean
    /**
     * Exibe uma mensagem de aviso.
     * @deprecated
     * Desde v6.6.7. Use {@link Ui.notifyOptions} com um objeto {@link MessageOptions} com `type: "warning"` e `asConfrim`
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param asConfirm - Se é `confirm` ou não.
     * @default asConfirm = false
     * @group UI
     * @since v6.1.0
     */
    warning(message: Str, explanation?: Str, asConfirm?: boolean): boolean | undefined

    /**
     * Formata um menu paginado.
     * @param options Array com todas as opções possíveis.
     * @param page Página atual.
     * @returns Retorna a resposta, a página atual, as opções por página.
     * @group UI
     * @since v6.1.0
     */
    menu(options: Str[], page: Numeric): [CommandsNames | Numeric, Numeric]

    /** Texto */
    input(
        message: Str,
        explanation?: Str,
        number?: false,
        places?: Places,
        allowCommands?: boolean,
        angle?: boolean
    ): Variable
    /** Número */
    input(
        message: Str,
        explanation: Str,
        number: true,
        places?: Places,
        allowCommands?: boolean,
        angle?: boolean
    ): Numeric
    /**
     * Exibe um prompt personalizado e verifica ele.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param number - `true` = Número, `false` = Texto.
     * @param places - Casas para arredondar (0 = sem casas).
     * @param allowCommands Se irá permitir comandos.
     * @param angle Se é um ângulo ou não.
     * @default number = false, places = Config.decimalPlaces, allowCommands = false, angle = false
     * @returns Valor verificado.
     * @group UI
     * @since v6.1.0
     */
    input(
        message: Str,
        explanation?: Str,
        number?: boolean,
        places?: Places,
        allowCommands?: boolean,
        angle?: boolean
    ): Value

    /**
     * Formata uma Função.
     * @deprecated
     * Desde v6.6.1. Use {@link Ui.resolveFunction} com um objeto {@link Coefficients} e um {@link FunctionType} no lugar dos outros três parâmetros.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @param funcExp - Exponencial.
     * @param funcLog - Logarítmica.
     * @param funcTrig - Trigonométrica (sin, cos, tan).
     * @param show - Mostrará a Função ou não, baseado na configuração.
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC; funcExp = false; funcLog = false; funcTrig = ""; show = true
     * @group UI
     * @since v6.1.0
     */
    function(
        coefA?: Value,
        coefB?: Value,
        coefC?: Value,
        funcExp?: boolean,
        funcLog?: boolean,
        funcTrig?: TrigonometricFunction,
        show?: boolean
    ): void

    /**
     * Formata uma Função.
     * @param coefs - Coeficientes.
     * @param funcType - Tipo da Função.
     * @param show - Mostrará a Função ou não, baseado na configuração.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }; funcType = "poly"; show = true
     * @group UI
     * @since v6.6.1
     */
    resolveFunction(coefs?: Coefficients, funcType?: FunctionType, show?: boolean): void

    /** Sem commandos */
    range(
        message: Str,
        explanation?: Str,
        min?: Numeric,
        max?: Numeric,
        places?: Places,
        allowCommands?: false
    ): Numeric
    /**
     * Pede ao usuário um valor entre o intervalo.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param min - Mínimo.
     * @param max - Máximo.
     * @param places - Casas decimais do `input`. (Ex.: 1 ⇒ `0.1` → `max`)
     * @default min = 0, max = 1, places = 0, allowCommands = false
     * @returns Um valor escolhido entre o intervalo.
     * @group UI
     * @since v6.1.0
     */
    range(
        message: Str,
        explanation?: Str,
        min?: Numeric,
        max?: Numeric,
        places?: Places,
        allowCommands?: boolean
    ): Numeric | CommandsNames
}
