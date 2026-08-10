import type { ConfigKey } from "./config.ts"
import type { Numeric, Places, Text, Value, Variable } from "./values.js"

/**
 * # Writing
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo escrita.
 *
 * ## Métodos:
 * - {@link Writing.replace replace} - Muda uma sequência de letras dentro de uma frase
 * - {@link Writing.replaceGroup replaceGroup} - Muda uma sequência de letras dentro de várias frases
 * - {@link Writing.noUnicode noUnicode} - Remove os caracteres Unicode
 * - {@link Writing.noAccents noAccents} - Remove os acentos
 * - {@link Writing.lowercase lowercase} - Transforma para minúsculas
 * - {@link Writing.uppercase uppercase} - Transforma para maiúsculas
 * - {@link Writing.decimal decimal} - Transforma o ponto decimal de um número
 * - {@link Writing.simplifyMultiplication simplifyMultiplication} - Transforma a multiplicação (graficamente)
 * - {@link Writing.format format} - Formata uma mensagem
 * - {@link Writing.superscript superscript} - Transforma em sobrescrito
 * - {@link Writing.subscript subscript} - Transforma em subscrito
 * - {@link Writing.formatValue formatValue} - Formata um valor
 * - {@link Writing.configItem configItem} - Formata um valor de configuração
 * - {@link Writing.parseDegree parseDegree} - Transforma para graus
 * - {@link Writing.parseRadian parseRadian} - Transforma para radianos
 * - {@link Writing.parseAngle parseAngle} - Altera o ângulo
 * - {@link Writing.formatAngle formatAngle} - Formata o ângulo
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Texto
 * @since v6.1.0
 */
export declare const Writing: {
    /**
     * Substituição de strings
     * @param text - Texto
     * @param from - O que será removido
     * @param to - O que será colocado no lugar
     * @returns Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    replace(text: Text, from: Text, to: Text): Text

    /**
     * Substituição de várias strings
     * @param text - Texto
     * @param list - Lista de substituições do tipo: [["removido", "adicionado"], ["removido", "adicionado"], ...]
     * @returns Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    replaceGroup(text: Text, list: Text[][]): Text

    /**
     * Substituição da grafia de Unicode, traduzindo os termos textuais para o idioma configurado
     * @param text - Texto
     * @returns Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    noUnicode(text: Text): Text

    /**
     * Substituição da grafia de acentos
     * @param text Texto
     * @returns Texto convertido
     */
    noAccents(text: Text): Text

    /**
     * Conversão para minúsculas
     * @param {string} text - Texto
     * @returns {string} Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    lowercase(text: Text): Text

    /**
     * Conversão para maiúsculas
     * @param {string} text - Texto
     * @returns {string} Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    uppercase(text: Text): Text

    /**
     * Manipulação de separadores decimais (inversão para uso em contas)
     * @param number - Número
     * @param invert - `true` sempre retorna número com separador convertido para cálculo (“.”)
     * @param round - Arredondar
     * @param places - Casas decimais
     * @returns Número convertido
     * @overload
     * @group Texto
     * @since v6.1.0
     */
    decimal(number: Value, invert: true, round?: boolean, places?: Places): Numeric

    /**
     * Manipulação de separadores decimais (para exibição)
     * @param number - Número
     * @param invert - `false` sempre retorna texto com separador convertido para exibição (“,”)
     * @param round - Arredondar (ignorado quando `invert` é `false`)
     * @param places - Casas decimais
     * @returns Número convertido como texto
     * @overload
     * @group Texto
     * @since v6.1.0
     */
    decimal(number: Value, invert: false, round?: boolean, places?: Places): Variable

    /**
     * Manipulação de separadores decimais (para exibição)
     * @param number - Número
     * @param invert - `false` ou omitido; retorno depende de `round` e da configuração de separador decimal
     * @param round - Arredondar
     * @param places - Casas decimais
     * @returns Número convertido — texto ou número, dependendo da configuração atual
     * @group Texto
     * @since v6.1.0
     */
    decimal(number: Value, invert?: boolean, round?: boolean, places?: Places): Value

    /**
     * Simplificação de símbolos de multiplicação
     * @param text - Texto
     * @returns Texto convertido
     * @group Texto
     * @since v6.1.0
     */
    simplifyMultiplication(text: Text): Text

    /**
     * Formatação geral de mensagens
     * @param message - Mensagem
     * @param explanation - Mensagem para a explicação
     * @returns Mensagem formatada
     * @group Texto
     * @since v6.1.0
     */
    format(message: Text, explanation?: Text): Text

    /**
     * Conversão para sobrescrito
     * @param text - Número
     * @returns Número convertido
     * @group Texto
     * @since v6.1.0
     */
    superscript(text: Text): Text

    /**
     * Conversão para subscrito
     * @param text - Número
     * @returns Número subscrito
     * @group Texto
     * @since v6.1.0
     */
    subscript(text: Text): Text

    /**
     * Formatação de valores booleans
     * @param value - Valor
     * @returns Valor formatado
     * @group Texto
     * @since v6.1.0
     */
    formatValue(value: boolean): Text

    /**
     * Formatação de itens de configuração
     * @param message - Mensagem
     * @param name - Nome em "config"
     * @returns Mensagem formatada
     * @group Texto
     * @since v6.1.0
     */
    configItem(message: Text, name: ConfigKey): Text

    /**
     * Análise de texto para conversão de graus para radianos
     * @param text - Texto
     * @returns Ângulo em radianos
     * @group Texto
     * @since v6.1.0
     */
    parseDegree(text: Text): Text

    /**
     * Análise de texto para conversão de radianos para graus
     * @param text - Texto
     * @returns Ângulo em graus
     * @group Texto
     * @since v6.1.0
     */
    parseRadian(text: Text): Text

    /**
     * Análise de texto para conversão de ângulos
     * @param text - Texto
     * @returns Ângulo em graus ou radianos
     * @group Texto
     * @since v6.1.0
     */
    parseAngle(text: Text): Text

    /**
     * Formatação de ângulos para exibição
     * @param value - Ângulo em radianos
     * @returns Ângulo formatado
     * @group Texto
     * @since v6.1.0
     */
    formatAngle(value: Numeric): Value
}
