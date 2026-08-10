import type { CommandsNames, Numeric, NumericArray, Places, Text, Value } from "./values.js"

/**
 * # Ui
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo exibições na tela.
 *
 * ## Métodos:
 * - {@link Ui.display display} - Mostra uma mensagem
 * - {@link Ui.confirm confirm} - Pergunta “Sim” ou “Não”
 * - {@link Ui.error error} - Mostra um erro
 * - {@link Ui.warning warning} - Mostra um aviso
 * - {@link Ui.menu menu} - Mostra um menu
 * - {@link Ui.input input} - Pergunta algo para o usuário
 * - {@link Ui.function function} - Mostra uma Função
 * - {@link Ui.range range} - Mostra um intervalo
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group UI
 * @since v6.1.0
 */
export declare const Ui: {
    /**
     * Exibe um alert personalizado
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param debug - Se true, exibe no console, se false, exibe no alert
     * @group UI
     * @since v6.1.0
     */
    display(message: Text, explanation?: Text, debug?: boolean): void

    /**
     * Exibe um confirm personalizado
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param debug - Se true, exibe no console, se false, exibe no confirm
     * @returns Sim / Não
     * @group UI
     * @since v6.1.0
     */
    confirm(message: Text, explanation?: Text, debug?: boolean): boolean

    /**
     * Exibe uma mensagem de erro
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param debug - Se true, exibe no console, se false, exibe no confirm
     * @group UI
     * @since v6.1.0
     */
    error(message: Text, explanation?: Text, debug?: boolean): void

    /**
     * Exibe uma mensagem de aviso
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param type - Tipo da mensagem
     * @param debug - Se true, exibe no console, se false, exibe no confirm
     * @group UI
     * @since v6.1.0
     */
    warning(message: Text, explanation?: Text, type?: boolean, debug?: boolean): void

    /**
     * Formata um menu paginado
     * @param options Array com todas as opções possíveis
     * @param page Página atual
     * @returns Retorna a resposta, a página atual, as opções por página
     * @group UI
     * @since v6.1.0
     */
    menu(options: Text[], page: Numeric): NumericArray

    /**
     * Exibe um prompt personalizado e verifica ele
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param number - true = Número, false = Texto
     * @param places - Casas para arredondar (0 = sem casas)
     * @returns Valor verificado
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
     * Formata uma função
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Exponencial
     * @param funcLog - Logarítmica
     * @param funcTrig - Trigonométrica (sin, cos, tan)
     * @param show - Mostrará a função ou não, baseado na configuração
     * @group UI
     * @since v6.1.0
     */
    function(
        coefA: Value,
        coefB: Value,
        coefC: Value,
        funcExp: boolean,
        funcLog: boolean,
        funcTrig: TrigonometricFunction,
        show?: boolean
    ): void

    /**
     * Pede ao usuário um valor entre o intervalo
     * @param message - Mensagem
     * @param explanation - Explicação
     * @param min - Mínimo
     * @param max - Máximo
     * @param places - Casas decimais
     * @returns Um valor escolhido entre o intervalo
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
