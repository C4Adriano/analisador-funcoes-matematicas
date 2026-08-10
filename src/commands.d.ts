import type { ConfigKey, ConfigType } from "./config.ts"
import type { CommandsNames, Text } from "./values.js"

/**
 * # Commands
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo comandos.
 *
 * ## Métodos:
 * - {@link Commands.process process} - Processa um comando
 * - {@link Commands.levenshtein levenshtein} - Faz a verificação da distância de Levenshtein e acha a correspondente mais próxima
 * - {@link Commands.suggestCmd suggestCmd} - Sugere um comando, com base na verificação da distância de Levenshtein
 * - {@link Commands.searchCmd searchCmd} - Procura por comandos
 * - {@link Commands.listCmd listCmd} - Lista todos os comandos
 * - {@link Commands.resolveCmd resolveCmd} - Resolve um comando
 * - {@link Commands.parseBool parseBool} - Transforma em boolean uma string (Ex.: "Não" -> false)
 * - {@link Commands.help help} - Exibe o menu de ajuda
 * - {@link Commands.searchHelp searchHelp} - Procura por uma ajuda específica
 * - {@link Commands.shortcuts shortcuts} - Exibe todas as variações de um comando
 * - {@link Commands.about about} - Exibe informações sobre o projeto
 * - {@link Commands.version version} - Exibe a versão do programa
 * - {@link Commands.change change} - Muda o valor de uma chave em Config
 * - {@link Commands.names names} - Array dos nomes dos comandos
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group JS
 * @since v6.1.0
 */
export declare const Commands: {
    /**
     * Processa um comando slash
     * @param raw o digitado pelo usuário
     * @returns Ação a executar, ou null se não for comando
     * @group JS
     * @since v6.1.0
     */
    process(raw: Text): unknown

    /**
     * Calcula a distância de Levenshtein entre duas strings
     * @param wrong - String digitada pelo usuário
     * @param correct - String de um comando conhecido
     * @group JS
     * @since v6.1.0
     */
    levenshtein(wrong: Text, correct: Text): void

    /**
     * Sugere um comando baseado no digitado pelo usuário usando distância de Levenshtein
     * @param typed - O digitado pelo usuário
     * @returns A sugestão de comando
     * @group JS
     * @since v6.1.0
     */
    suggestCmd(typed: Text): void

    /**
     * Pesquisa comandos por termo — busca no canônico, variações, short e long
     * @param term - Termo de pesquisa
     * @returns Lista de nomes canônicos dos comandos encontrados
     * @group JS
     * @since v6.2.0
     */
    searchCmd(term: Text): void

    /**
     * Retorna a lista de comandos disponíveis
     * @returns Lista de comandos com suas descrições, variações e ações
     * @group JS
     * @since v6.1.0
     */
    listCmd(): object

    /**
     * Resolve um comando específico para seu nome canônico
     * @param specific - Comando específico
     * @returns Nome canônico do comando, ou null se não for encontrado
     * @group JS
     * @since v6.1.0
     */
    resolveCmd(specific: Text): void

    /**
     * Converte um texto em um valor boolean
     * @param text Texto
     * @returns Se é parecido com um valor boolean verdadeiro / falso ou se não é reconhecido
     * @group JS
     * @since v6.1.0
     */
    parseBool(text: Text): void

    /**
     * Exibe ajuda sobre um comando específico ou lista paginada de todos os comandos
     * @param specific - Nome ou variação de um comando específico (opcional)
     * @group JS
     * @since v6.1.0
     */
    help(specific: Text): null

    /**
     * Exibe os resultados de uma pesquisa de comandos de forma paginada
     * @param term - Termo de pesquisa
     * @group JS
     * @since v6.2.0
     */
    searchHelp(term: Text): null

    /**
     * Exibe todas as variações aceitas de um comando
     * @param specific - Nome ou variação do comando
     * @group JS
     * @since v6.2.0
     */
    shortcuts(specific: Text): null

    /**
     * Exibe informações sobre o Projeto
     * @group JS
     * @since v6.2.0
     */
    about(): null

    /**
     * Exibe a versão do programa
     * @group JS
     * @since v6.1.0
     */
    version(): null

    /**
     * Muda o valor de uma chave em Config
     * @group JS
     * @since v6.1.0
     */
    change(name: ConfigKey, value: ConfigType): null

    /**
     * Retorna uma lista com os nomes canônicos dos comandos que alteram o fluxo de estado
     * @returns Lista de nomes canônicos
     * @group JS
     * @since v6.1.0
     */
    names(): CommandsNames
}
