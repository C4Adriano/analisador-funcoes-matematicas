import type { Coefficients, CommandsNames, FunctionType, Numeric, NumericArray, Places, Text, Value } from "./values.js"

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
    /**
     * Exibe uma mensagem qualquer.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param asConfirm - Se é `confirm` ou não.
     * @param debug - Se `true`, exibe no `console`, se `false`, exibe no `alert` ou `confirm` (dependendo de `asConfirm`).
     * @group UI
     * @since v6.6.1
     */
    notify(message: Text, explanation?: Text, asConfirm?: boolean, debug?: boolean)

    /**
     * Exibe um `alert` personalizado.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param debug - Se `true`, exibe no `console`, se `false`, exibe no `alert`.
     * @group UI
     * @since v6.1.0
     */
    display(message: Text, explanation?: Text, debug?: boolean): void

    /**
     * Exibe um `confirm` personalizado.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param debug - Se `true`, exibe no `console`, se `false`, exibe no `confirm`.
     * @returns "Sim" ou "Não".
     * @group UI
     * @since v6.1.0
     */
    confirm(message: Text, explanation?: Text, debug?: boolean): boolean

    /**
     * Exibe uma mensagem de erro.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param debug - Se `true`, exibe no `console`, se `false`, exibe no `confirm`.
     * @group UI
     * @since v6.1.0
     */
    error(message: Text, explanation?: Text, debug?: boolean): void

    /**
     * Exibe uma mensagem de aviso.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param asConfirm - Se é `confirm` ou não.
     * @param debug - Se `true`, exibe no `console`, se `false`, exibe no `confirm`.
     * @group UI
     * @since v6.1.0
     */
    warning(message: Text, explanation?: Text, asConfirm?: boolean, debug?: boolean): void

    /**
     * Formata um menu paginado.
     * @param options Array com todas as opções possíveis.
     * @param page Página atual.
     * @returns Retorna a resposta, a página atual, as opções por página.
     * @group UI
     * @since v6.1.0
     */
    menu(options: Text[], page: Numeric): NumericArray

    /**
     * Exibe um prompt personalizado e verifica ele.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param number - `true` = Número, `false` = Texto.
     * @param places - Casas para arredondar (0 = sem casas).
     * @returns Valor verificado.
     * @group UI
     * @since v6.1.0
     */
    input(
        message: Text,
        explanation?: Text,
        number?: boolean,
        places?: Places,
        allowCommands?: boolean,
        angle?: boolean
    ): Value

    /**
     * Formata uma Função.
     *
     * @deprecated
     * Desde v6.6.1. Use {@link Algebra.resolveUnknown} com um objeto {@link Coefficients} e um {@link FunctionType} no lugar dos outros três parâmetros.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     *
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
     * @remarks Substitui {@link Ui.function} com uma assinatura mais enxuta, agrupando os Coeficientes em um único objeto e os antigos parâmetros (`funcExp`, `funcLog`, `funcTrig`) em um único tipo discriminado.
     * @param coefs - Coeficientes.
     * @param funcType - Tipo da Função.
     * @param show - Mostrará a Função ou não, baseado na configuração.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }; funcType = "poly"; show = true
     * @group UI
     * @since v6.6.1
     */
    resolveFunction(coefs?: Coefficients, funcType?: FunctionType, show?: boolean): void

    /**
     * Pede ao usuário um valor entre o intervalo.
     * @param message - Mensagem.
     * @param explanation - Explicação.
     * @param min - Mínimo.
     * @param max - Máximo.
     * @param places - Casas decimais.
     * @returns Um valor escolhido entre o intervalo.
     * @group UI
     * @since v6.1.0
     */
    range(
        message: Text,
        explanation?: Text,
        min?: Numeric,
        max?: Numeric,
        places?: Places,
        allowCommands?: boolean
    ): Numeric | CommandsNames
}
