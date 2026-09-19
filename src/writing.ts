import { Algebra } from "./algebra.js"
import { Config, DEFAULT_CONFIG, type ConfigKey } from "./config.js"
import { tr } from "./i18n.js"
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
 * - {@link Writing.decimalOptions decimalOptions} - Transforma o ponto decimal de um número.
 * - {@link Writing.simplifyMultiplication simplifyMultiplication} - Transforma o ponto da multiplicação.
 * - {@link Writing.format format} - Formata uma mensagem.
 * - {@link Writing.superscript superscript} - Transforma em sobrescrito.
 * - {@link Writing.subscript subscript} - Transforma em subscrito.
 * - {@link Writing.formatValue formatValue} - Formata um valor.
 * - {@link Writing.configItem configItem} - Formata um valor de configuração.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Texto
 * @since v6.1.0
 */
export class Writing {
    /**
     * Substitui uma parte de uma `string` por outra.
     * @param text - Texto.
     * @param from - O que será removido.
     * @param to - O que será colocado no lugar.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static replace = (text: Str = "", from: Str = "", to: Str = ""): Str => String(text).replaceAll(from, to)

    /**
     * Substitui uma parte de várias `strings` por outra.
     * @param text - Texto.
     * @param list - Lista de substituições do tipo: [["removido", "adicionado"], ["removido", "adicionado"], ...].
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static replaceGroup = (text: Str = "", list: Str[][] = [["", ""]]): Str =>
        list.reduce((acc, [from, to]) => (from != null && to != null ? Writing.replace(acc, from, to) : acc), text)

    /**
     * Substituição da grafia de Unicode, traduzindo os termos textuais para o idioma configurado.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static noUnicode = (text: Str = ""): Str => {
        const staticReplacements: [Str, Str][] = [
            ["©", "(c)"],
            ["ƒ", "f"],
            ["₁", "1"],
            ["₂", "2"],
            ["₃", "3"],
            ["²", "^2"],
            ["³", "^3"],
            ["ˣ", "^x"],
            ["ₐ", "_a"],
            ["ₑ", "_e"],
            ["ₒ", "_o"],
            ["ₓ", "_x"],
            ["⁽", "^("],
            ["⁾", ")"],
            ["₍", "_("],
            ["₎", ")"],
            ["⁻", "-"],
            ["⁺", "+"],
            ["⁼", "="],
            ["ᶜ", "c"],
            ["ᵇ", "b"],
            ["ʸ", "y"],
            ["⁄", "/"],
            ["₌", "="],
            ["₋", "-"],
            ["₊", "+"],
            ["≠", "!="],
            ["≤", "<="],
            ["≥", ">="],
            ["≪", "<<"],
            ["≫", ">>"],
            ["·", "*"],
            ["×", "*"],
            ["±", "+/-"],
            ["∓", "-/+"],
            ["÷", "/"],
            ["∖", "-"],
            ["⇒", "=>"],
            ["⇐", "<="],
            ["⇑", "^^"],
            ["⇓", "vv"],
            ["⇔", "<=>"],
            ["⇕", "^^vv"],
            ["⇖", "\\"],
            ["⇗", "//"],
            ["⇘", "\\"],
            ["⇙", "//"],
            ["→", "->"],
            ["←", "<-"],
            ["↑", "^"],
            ["↓", "v"],
            ["↳", "->"],
            ["↔", "<->"],
            ["↕", "^v"],
            ["↖", "\\"],
            ["↗", "/"],
            ["↘", "\\"],
            ["↙", "/"],
            ["“", "'"],
            ["”", "'"],
            ["‘", "'"],
            ["’", "'"],
            ["«", "'"],
            ["»", "'"],
            ["…", "..."],
            ["—", "-"],
            ["–", "-"],
            ["−", "-"],
            ["•", "*"],
        ]

        const localizedReplacements: [Str, Str][] = [
            ["Δ", tr("symbols.delta")],
            ["π", tr("symbols.pi")],
            ["ℯ", tr("symbols.eNumber")],
            ["φ", tr("symbols.phi")],
            ["θ", tr("symbols.theta")],
            ["λ", tr("symbols.lambda")],
            ["μ", tr("symbols.mu")],
            ["σ", tr("symbols.sigma")],
            ["ρ", tr("symbols.rho")],
            ["τ", tr("symbols.tau")],
            ["ε", tr("symbols.epsilon")],
            ["γ", tr("symbols.gamma")],
            ["η", tr("symbols.eta")],
            ["ζ", tr("symbols.zeta")],
            ["κ", tr("symbols.kappa")],
            ["ν", tr("symbols.nu")],
            ["ξ", tr("symbols.xi")],
            ["ω", tr("symbols.omega")],
            ["α", tr("symbols.alpha")],
            ["β", tr("symbols.beta")],
            ["χ", tr("symbols.chi")],
            ["ψ", tr("symbols.psi")],

            ["∑", tr("symbols.sum")],
            ["∏", tr("symbols.product")],
            ["∫", tr("symbols.integral")],
            ["∬", tr("symbols.doubleIntegral")],
            ["∭", tr("symbols.tripleIntegral")],
            ["∮", tr("symbols.lineIntegral")],
            ["∯", tr("symbols.surfaceIntegral")],
            ["∰", tr("symbols.volumeIntegral")],
            ["∂", tr("symbols.partialDerivative")],
            ["∇", tr("symbols.nabla")],

            ["ℝ", tr("symbols.reals")],
            ["ℤ", tr("symbols.integers")],
            ["ℕ", tr("symbols.naturals")],
            ["ℚ", tr("symbols.rationals")],
            ["ℂ", tr("symbols.complexes")],
            ["∅", tr("symbols.emptySet")],
            ["∪", tr("symbols.union")],
            ["∩", tr("symbols.intersection")],
            ["⊆", tr("symbols.subsetOf")],
            ["⊇", tr("symbols.supersetOf")],
            ["⊈", tr("symbols.notSubsetOf")],
            ["⊉", tr("symbols.notSupersetOf")],

            ["∃!", tr("symbols.existsUniqueOne")],
            ["∄!", tr("symbols.notExistsUniqueOne")],
            ["∃∞", tr("symbols.existsInfinite")],
            ["∄∞", tr("symbols.notExistsInfinite")],
            ["∀", tr("symbols.forAll")],
            ["∃", tr("symbols.exists")],
            ["∄", tr("symbols.notExists")],

            ["∈", tr("symbols.belongsTo")],
            ["∉", tr("symbols.notBelongsTo")],
            ["∋", tr("symbols.containsAsElement")],
            ["∌", tr("symbols.notContainsAsElement")],

            ["∝", tr("symbols.proportionalTo")],
            ["∠", tr("symbols.angle")],
            ["∼", tr("symbols.similarTo")],
            ["≅", tr("symbols.congruentTo")],
            ["≈", tr("symbols.approximatelyEqualTo")],
            ["≡", tr("symbols.identicalTo")],

            ["√", tr("symbols.squareRootOf")],
            ["∛", tr("symbols.cubeRootOf")],
            ["∜", tr("symbols.fourthRootOf")],
            ["-∞", tr("symbols.negativeInfinity")],
            ["∞", tr("symbols.infinity")],

            ["∴", tr("symbols.therefore")],
            ["∵", tr("symbols.because")],
            ["∨", tr("symbols.or")],
            ["∧", tr("symbols.and")],
            ["¬", tr("symbols.notWord")],
            ["⊕", tr("symbols.exclusiveOr")],
            ["⊗", tr("symbols.inclusiveOr")],
        ]

        return Writing.replaceGroup(text, [...localizedReplacements, ...staticReplacements])
    }

    /**
     * Substituição da grafia de acentos.
     * @param text - Texto.
     * @returns Texto convertido.
     */
    static noAccents = (text: Str = ""): Str =>
        String(text)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")

    /**
     * Conversão para minúsculas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static lowercase = (text: Str = ""): Str => Writing.replace(String(text).toLowerCase(), "δ", "Δ")

    /**
     * Conversão para maiúsculas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static uppercase = (text: Str = ""): Str => Writing.replace(String(text).toUpperCase(), "Ƒ", "ƒ")

    /**
     * Conversão para capitalizadas.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.6.7
     */
    static capitalize = (text: Str = ""): Str =>
        Writing.lowercase(text).replace(/\p{L}+/gu, word => Writing.uppercase(word[0]) + word.slice(1))

    /**
     * Manipulação de separadores decimais.
     * @param number - Número.
     * @param options - Opções.
     * @returns Número convertido — texto ou número, dependendo da configuração atual.
     * @group Texto
     * @since v6.6.1
     */
    static decimalOptions: {
        (number: Value, options?: Options & { invert?: false }): Variable
        (number: Value, options: Options & { invert: true }): Numeric
        (number: Value, options?: Options & { invert?: boolean }): Value
    } = ((number: Value = 0, { invert = false, round = true, places = Config.decimalPlaces }: Options = {}): Value => {
        let result: Value = String(number)

        if (invert) return Writing.replace(result, ",", ".")
        if (round) result = Algebra.round(result, places)
        if (Config.decimalSeparator) return Writing.replace(String(result), ".", ",")

        return result
    }) as unknown as {
        (number: Value, options?: Options & { invert?: false }): Variable
        (number: Value, options: Options & { invert: true }): Numeric
        (number: Value, options?: Options & { invert?: boolean }): Value
    }

    /**
     * Simplificação de símbolos de multiplicação.
     * @param text - Texto.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static simplifyMultiplication = (text: Str = ""): Str => Writing.replace(text, " · ", "")

    /**
     * Formatação geral de mensagens.
     * @param message - Mensagem.
     * @param explanation - Mensagem para a explicação.
     * @returns Mensagem formatada.
     * @group Texto
     * @since v6.1.0
     */
    static format = (message: Str = "", explanation: Str = ""): Str => {
        if (Config.explanations && explanation != "") message += `\n\n${explanation}`
        if (Config.simpleMulti) message = Writing.simplifyMultiplication(message)
        if (!Config.unicode) message = Writing.noUnicode(message)
        if (!Config.accents) message = Writing.noAccents(message)
        if (Config.textCase == "capitalized") message = Writing.capitalize(message)
        else if (Config.textCase == "lowercase") message = Writing.lowercase(message)
        else if (Config.textCase == "uppercase") message = Writing.uppercase(message)

        return message
    }

    /**
     * Conversão para sobrescrito.
     * @param value - Número.
     * @returns Número convertido.
     * @group Texto
     * @since v6.1.0
     */
    static superscript = (value: Value = ""): Str =>
        Config.unicode
            ? Writing.replaceGroup(String(value), [
                  ["0", "⁰"],
                  ["1", "¹"],
                  ["2", "²"],
                  ["3", "³"],
                  ["4", "⁴"],
                  ["5", "⁵"],
                  ["6", "⁶"],
                  ["7", "⁷"],
                  ["8", "⁸"],
                  ["9", "⁹"],
                  ["-", "⁻"],
                  [".", "․"],
              ])
            : `^${value}`

    /**
     * Conversão para subscrito.
     * @param value - Número.
     * @returns Número subscrito.
     * @group Texto
     * @since v6.1.0
     */
    static subscript = (value: Value = ""): Str =>
        Config.unicode
            ? Writing.replaceGroup(String(value), [
                  ["0", "₀"],
                  ["1", "₁"],
                  ["2", "₂"],
                  ["3", "₃"],
                  ["4", "₄"],
                  ["5", "₅"],
                  ["6", "₆"],
                  ["7", "₇"],
                  ["8", "₈"],
                  ["9", "₉"],
                  ["-", "₋"],
                  [".", "․"],
              ])
            : `_${value}`

    /**
     * Formatação de valores `boolean`.
     * @param value - Valor.
     * @returns Valor formatado.
     * @group Texto
     * @since v6.1.0
     */
    static formatValue = (value: Value | boolean = true): Str =>
        typeof value == "boolean" ? (value ? tr("writing.yes") : tr("writing.no")) : String(value)

    /**
     * Formatação de itens de configuração.
     * @param message - Mensagem.
     * @param name - Nome em `Config`.
     * @returns Mensagem formatada.
     * @group Texto
     * @since v6.1.0
     */
    static configItem = (message: Str = "", name: ConfigKey): Str =>
        tr("writing.currentDefault", {
            message,
            current: Writing.formatValue(Config[name]),
            default: Writing.formatValue(DEFAULT_CONFIG[name]),
        })
}
