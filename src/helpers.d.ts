import type { Numeric, Text, TrigonometricFunction, Value } from "./values.js"

/**
 * # Helpers
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo ajudas.
 *
 * ## Métodos:
 * - {@link Helpers.domain domain} - Domínio de uma Função.
 * - {@link Helpers.range range} - Imagem de uma Função.
 * - {@link Helpers.xAxis xAxis} - Intercessões com o eixo x de uma Função.
 * - {@link Helpers.yAxis yAxis} - Intercessões com o eixo y de uma Função.
 * - {@link Helpers.xValues xValues} - Valores de x de uma Função.
 * - {@link Helpers.yValues yValues} - Valores de y de uma Função.
 * - {@link Helpers.sign sign} - Estudo do sinal de uma Função.
 * - {@link Helpers.equations equations} - Equações entre Funções.
 * - {@link Helpers.curve curve} - Curva de uma Função.
 * - {@link Helpers.calcRoot calcRoot} - Calcula as raízes de uma Função.
 * - {@link Helpers.showRoot showRoot} - Mostra as raízes de uma Função.
 * - {@link Helpers.calcDelta calcDelta} - Calcula o Delta de uma Função.
 * - {@link Helpers.showDelta showDelta} - Mostra o Delta de uma Função.
 * - {@link Helpers.vertex vertex} - Vértice de uma Função.
 * - {@link Helpers.exceededLimit exceededLimit} - Vê se excedeu o limite.
 * - {@link Helpers.calcPeriod calcPeriod} - Calcula o período de uma Função.
 * - {@link Helpers.showPeriod showPeriod} - Mostra o período de uma Função.
 * - {@link Helpers.amplitude amplitude} - Amplitude de uma Função.
 * - {@link Helpers.verticalAsymptote verticalAsymptotes} - Assíntotas verticais de uma Função.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Função
 * @since v6.1.0
 */
export declare const Helpers: {
    /**
     * Monta o domínio de uma Função.
     * @param belongs - Intervalo de pertencimento.
     * @param explanation - Explicação.
     * @group Função
     * @since v6.1.0
     */
    domain(belongs: Text, explanation: Text): void

    /**
     * Monta a imagem de uma Função.
     * @param belongs - Intervalo de pertencimento.
     * @param interval - Se a Função deve assumir algum intervalo diferente.
     * @param explanation - Explicação.
     * @group Função
     * @since v6.1.0
     */
    range(belongs: Text, interval: Text, explanation: Text): void

    /**
     * Monta a intercessão com o eixo x de uma Função.
     * @param root - Raiz.
     * @param explanation - Explicação.
     * @param noHave - Mensagem quando não há interseção com o eixo x.
     * @group Função
     * @since v6.1.0
     */
    xAxis(root: Numeric, explanation: Text, noHave: Text): void

    /**
     * Monta a intercessão com o eixo y de uma Função.
     * @param point - Ponto.
     * @param func - Função.
     * @param explanation - Explicação.
     * @group Função
     * @since v6.1.0
     */
    yAxis(point: Numeric, func: Text, explanation: Text): void

    /**
     * Monta o valor de y para o x dado.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @param funcExp - Exponencial.
     * @param funcLog - Logarítmica.
     * @param funcTrig - Trigonométrica.
     * @group Função
     * @since v6.1.0
     */
    xValues(
        coefA?: Value,
        coefB?: Value,
        coefC?: Value,
        funcExp?: boolean,
        funcLog?: boolean,
        funcTrig?: TrigonometricFunction
    ): void

    /**
     * Monta o valor de x para o y dado.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @param funcExp - Exponencial.
     * @param funcLog - Logarítmica.
     * @param funcTrig - Trigonométrica.
     * @group Função
     * @since v6.1.0
     */
    yValues(
        coefA?: Value,
        coefB?: Value,
        coefC?: Value,
        funcExp?: boolean,
        funcLog?: boolean,
        funcTrig?: TrigonometricFunction
    ): void

    /**
     * Monta o estudo do sinal de uma Função.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @param funcExp - Exponencial.
     * @param funcLog - Logarítmica.
     * @param funcTrig - Trigonométrica.
     * @group Função
     * @since v6.1.0
     */
    sign(
        coefA?: Value,
        coefB?: Value,
        coefC?: Value,
        funcExp?: boolean,
        funcLog?: boolean,
        funcTrig?: TrigonometricFunction
    ): void

    /**
     * Monta a equação de duas Funções.
     * @param polinomial - Polinomial.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @returns Operação futura
     * @group Função
     * @since v6.1.0
     */
    equations(polinomial: boolean, coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Monta a curva de uma Função.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param polynomial - Polinomial.
     * @group Função
     * @since v6.1.0
     */
    curve(coefA?: Value, coefB?: Value, polynomial: Text): void

    /**
     * Calcula a raiz de uma Função.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @param funcExp - Exponencial.
     * @param funcLog - Logarítmica.
     * @param funcTrig - Trigonométrica.
     * @returns - Raiz
     * @group Função
     * @since v6.1.0
     */
    calcRoot(
        coefA?: Value,
        coefB?: Value,
        coefC?: Value,
        funcExp?: boolean,
        funcLog?: boolean,
        funcTrig?: TrigonometricFunction
    ): void

    /**
     * Mostra a raiz de uma Função.
     * @param root - Raiz.
     * @param explanation - Explicação.
     * @param noHave - Mensagem quando não há raiz.
     * @group Função
     * @since v6.1.0
     */
    showRoot(root: Numeric, explanation: Text, noHave: Text): void

    /**
     * Calcula o Delta de uma Função.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param coefC - Coeficiente `c`.
     * @returns Delta.
     * @group Função
     * @since v6.1.0
     */
    calcDelta(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Exibe o Delta de uma Função.
     * @param delta - Delta.
     * @param lower - Mensagem para Delta < 0.
     * @param equal - Mensagem para Delta = 0.
     * @param higher - Mensagem para Delta > 0.
     * @param hasY - Se é (c − y).
     * @group Função
     * @since v6.1.0
     */
    showDelta(delta: Numeric, lower: Text, equal: Text, higher: Text, hasY: boolean): void

    /**
     * Calcula o vértice de uma Função.
     * @param coefA - Coeficiente `a`.
     * @param coefB - Coeficiente `b`.
     * @param delta - Delta.
     * @returns Vértice.
     * @group Função
     * @since v6.1.0
     */
    vertex(coefA?: Value, coefB?: Value, delta: Numeric): void

    /**
     * Vê se estourou o limite.
     * @param limit - Limite.
     * @returns Se estourou o limite.
     * @group Função
     * @since v6.1.0
     */
    exceededLimit(limit: Numeric): void

    /**
     * Calcula o período de uma Função.
     * @param coefA - Coeficiente `a` (frequência angular).
     * @param funcTan - Se é Função Tangente (tan tem período π / |a|).
     * @returns Período.
     * @group Função
     * @since v6.1.0
     */
    calcPeriod(coefA?: Value, funcTan: boolean): void

    /**
     * Exibe o período de uma Função
     * @param coefA - Coeficiente `a` (frequência angular).
     * @param funcTan - Se é Função Tangente.
     * @group Função
     * @since v6.1.0
     */
    showPeriod(coefA?: Value, funcTan: boolean): void

    /**
     * Exibe a amplitude de uma Função.
     * @param coefB - Coeficiente `b` (amplitude).
     * @group Função
     * @since v6.1.0
     */
    amplitude(coefB?: Value): void

    /**
     * Exibe as assíntotas verticais de uma Função Tangente.
     * @param coefA - Coeficiente `a` (frequência angular).
     * @group Função
     * @since v6.1.0
     */
    verticalAsymptote(coefA?: Value): void
}
