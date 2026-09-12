import type { ConfigKey } from "./config.js"
import type { Options } from "./values.d.ts"

/**
 * # Writing
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo escrita.
 *
 * ## Métodos:
 * - {@link Writing.replace replace} - Muda uma sequência de letras dentro de uma frase.
 * - {@link Writing.replaceGroup replaceGroup} - Muda uma sequência de letras dentro de várias frases.
 * - {@link Writing.noUnicode noUnicode} - Remove os caracteres Unicode.
 * - {@link Writing.noAccents noAccents} - Remove os acentos.
 * - {@link Writing.lowercase lowercase} - Transforma para minúsculas.
 * - {@link Writing.uppercase uppercase} - Transforma para maiúsculas.
 * - {@link Writing.decimal decimal} - Transforma o ponto decimal de um número.
 * - {@link Writing.simplifyMultiplication simplifyMultiplication} - Transforma o ponto da multiplicação.
 * - {@link Writing.format format} - Formata uma mensagem.
 * - {@link Writing.superscript superscript} - Transforma em sobrescrito.
 * - {@link Writing.subscript subscript} - Transforma em subscrito.
 * - {@link Writing.formatValue formatValue} - Formata um valor.
 * - {@link Writing.configItem configItem} - Formata um valor de configuração.
 * - {@link Writing.parseDegree parseDegree} - Transforma para graus.
 * - {@link Writing.parseRadian parseRadian} - Transforma para radianos.
 * - {@link Writing.parseAngle parseAngle} - Altera o ângulo.
 * - {@link Writing.formatAngle formatAngle} - Formata o ângulo.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Texto
 * @since v6.1.0
 */
export declare const Writing: {
    /**
     * Substitui uma parte de uma `string` por outra.
     * @param text - Texto.
     * @param from - O que será removido.
     * @param to - O que será colocado no lugar.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    replace(text: Str, from: Str, to: Str): Str

    /**
     * Substitui uma parte de várias `strings` por outra.
     * @param text - Texto.
     * @param list - Lista de substituições do tipo: [["removido", "adicionado"], ["removido", "adicionado"], ...].
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    replaceGroup(text: Str, list: Str[][]): Str

    /**
     * Substituição da grafia de Unicode, traduzindo os termos textuais para o idioma configurado.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    noUnicode(text: Str): Str

    /**
     * Substituição da grafia de acentos.
     * @param text - Texto.
     * @returns Texto convertido.
     */
    noAccents(text: Str): Str

    /**
     * Conversão para minúsculas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    lowercase(text: Str): Str

    /**
     * Conversão para maiúsculas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    uppercase(text: Str): Str

    /**
     * Conversão para capitalizadas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.6.7
     */
    capitalize(text: Str): Str

    /** Manipulação de separadores decimais (para exibição). */
    decimal(number: Value, invert?: false, round?: boolean, places?: Places): Variable
    /** Manipulação de separadores decimais (inversão para uso em contas). */
    decimal(number: Value, invert: true, round?: boolean, places?: Places): Numeric
    /**
     * Manipulação de separadores decimais (para exibição).
     * @param number - Número.
     * @param invert - `false` ou omitido; retorno depende de `round` e da configuração de separador decimal.
     * @param round - Arredondar.
     * @param places - Casas decimais.
     * @returns Número convertido — texto ou número, dependendo da configuração atual.
     * @group Texto
     * @since v6.1.0
     */
    decimal(number: Value, invert?: boolean, round?: boolean, places?: Places): Value

    /** Manipulação de separadores decimais (para exibição). */
    decimalOptions(number: Value, options?: Options & { invert?: false }): Variable
    /** Manipulação de separadores decimais (inversão para uso em contas). */
    decimalOptions(number: Value, options: Options & { invert: true }): Numeric
    /**
     * Manipulação de separadores decimais. Alias para {@link Writing.decimal}.
     * @param number - Número.
     * @param options - Opções.
     * @returns Número convertido — texto ou número, dependendo da configuração atual.
     * @group Texto
     * @since v6.6.1
     */
    decimalOptions(number: Value, options?: Options & { invert?: boolean }): Value

    /**
     * Simplificação de símbolos de multiplicação.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    simplifyMultiplication(text: Str): Str

    /**
     * Formatação geral de mensagens.
     * @param message - Mensagem.
     * @param explanation - Mensagem para a explicação.
     * @returns Mensagem formatada.
     * @group Texto
     * @since v6.1.0
     */
    format(message: Str, explanation?: Str): Str

    /**
     * Conversão para sobrescrito.
     * @param value - Número.
     * @returns Número convertido.
     * @group Texto
     * @since v6.1.0
     */
    superscript(value: Value): Str

    /**
     * Conversão para subscrito.
     * @param value - Número.
     * @returns Número subscrito.
     * @group Texto
     * @since v6.1.0
     */
    subscript(value: Value): Str

    /**
     * Formatação de valores `boolean`.
     * @param value - Valor.
     * @returns Valor formatado.
     * @group Texto
     * @since v6.1.0
     */
    formatValue(value: boolean): Str

    /**
     * Formatação de itens de configuração.
     * @param message - Mensagem.
     * @param name - Nome em `Config`.
     * @returns Mensagem formatada.
     * @group Texto
     * @since v6.1.0
     */
    configItem(message: Str, name: ConfigKey): Str

    /**
     * Análise de texto para conversão de graus para radianos.
     * @param text - Texto.
     * @returns Ângulo em radianos.
     * @group Texto
     * @since v6.1.0
     */
    parseDegree(text: Str): Str

    /**
     * Análise de texto para conversão de radianos para graus.
     * @param text - Texto.
     * @returns Ângulo em graus.
     * @group Texto
     * @since v6.1.0
     */
    parseRadian(text: Str): Str

    /**
     * Análise de texto para conversão de ângulos.
     * @param text - Texto.
     * @returns Ângulo em graus ou radianos.
     * @group Texto
     * @since v6.1.0
     */
    parseAngle(text: Str): Str

    /**
     * Formatação de ângulos para exibição.
     * @param value - Ângulo em radianos.
     * @returns Ângulo formatado.
     * @group Texto
     * @since v6.1.0
     */
    formatAngle(value: Numeric): Value
}
