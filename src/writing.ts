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
 * - {@link Writing.configItem configItem} - Formata um valor de configuração.
 * - {@link Writing.decimalOptions decimalOptions} - Transforma o ponto decimal de um número.
 * - {@link Writing.format format} - Formata uma mensagem.
 * - {@link Writing.formatValue formatValue} - Formata um valor.
 * - {@link Writing.lowercase lowercase} - Transforma para minúsculas.
 * - {@link Writing.noAccents noAccents} - Remove os acentos.
 * - {@link Writing.noUnicode noUnicode} - Remove os caracteres Unicode.
 * - {@link Writing.replace replace} - Muda uma sequência de letras dentro de uma frase.
 * - {@link Writing.replaceGroup replaceGroup} - Muda uma sequência de letras dentro de várias frases.
 * - {@link Writing.simplifyMultiplication simplifyMultiplication} - Transforma o ponto da multiplicação.
 * - {@link Writing.subscript subscript} - Transforma em subscrito.
 * - {@link Writing.superscript superscript} - Transforma em sobrescrito.
 * - {@link Writing.uppercase uppercase} - Transforma para maiúsculas.
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
     * @param list - Lista de substituições do tipo: `[["removido", "adicionado"], ["removido", "adicionado"], ...]`.
     * @returns Texto convertido.
     * @group Texto
     * @since v6.1.0
     */
    static replaceGroup = (text: Str = "", list: [Str, Str][] = [["", ""]]): Str =>
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
                ["«", "'"],
                ["±", "+/-"],
                ["²", "^2"],
                ["³", "^3"],
                ["·", "*"],
                ["»", "'"],
                ["×", "*"],
                ["÷", "/"],
                ["ƒ", "f"],
                ["ʸ", "y"],
                ["ˣ", "^x"],
                ["ᵇ", "b"],
                ["ᶜ", "c"],
                ["–", "-"],
                ["—", "-"],
                ["‘", "'"],
                ["’", "'"],
                ["“", "'"],
                ["”", "'"],
                ["•", "*"],
                ["…", "..."],
                ["⁄", "/"],
                ["⁺", "+"],
                ["⁻", "-"],
                ["⁼", "="],
                ["⁽", "^("],
                ["⁾", ")"],
                ["₁", "1"],
                ["₂", "2"],
                ["₃", "3"],
                ["₊", "+"],
                ["₋", "-"],
                ["₌", "="],
                ["₍", "_("],
                ["₎", ")"],
                ["ₐ", "_a"],
                ["ₑ", "_e"],
                ["ₒ", "_o"],
                ["ₓ", "_x"],
                ["←", "<-"],
                ["↑", "^"],
                ["→", "->"],
                ["↓", "v"],
                ["↔", "<->"],
                ["↕", "^v"],
                ["↖", "\\"],
                ["↗", "/"],
                ["↘", "\\"],
                ["↙", "/"],
                ["↳", "->"],
                ["⇐", "<="],
                ["⇑", "^^"],
                ["⇒", "=>"],
                ["⇓", "vv"],
                ["⇔", "<=>"],
                ["⇕", "^^vv"],
                ["⇖", "\\"],
                ["⇗", "//"],
                ["⇘", "\\"],
                ["⇙", "//"],
                ["−", "-"],
                ["∓", "-/+"],
                ["∖", "-"],
                ["≠", "!="],
                ["≤", "<="],
                ["≥", ">="],
                ["≪", "<<"],
                ["≫", ">>"],
            ],
            localizedReplacements: [Str, Str][] = [
                ["-∞", tr("symbols.negativeInfinity")],
                ["¬", tr("symbols.notWord")],
                ["Δ", tr("symbols.delta")],
                ["α", tr("symbols.alpha")],
                ["β", tr("symbols.beta")],
                ["γ", tr("symbols.gamma")],
                ["ε", tr("symbols.epsilon")],
                ["ζ", tr("symbols.zeta")],
                ["η", tr("symbols.eta")],
                ["θ", tr("symbols.theta")],
                ["κ", tr("symbols.kappa")],
                ["λ", tr("symbols.lambda")],
                ["μ", tr("symbols.mu")],
                ["ν", tr("symbols.nu")],
                ["ξ", tr("symbols.xi")],
                ["π", tr("symbols.pi")],
                ["ρ", tr("symbols.rho")],
                ["σ", tr("symbols.sigma")],
                ["τ", tr("symbols.tau")],
                ["φ", tr("symbols.phi")],
                ["χ", tr("symbols.chi")],
                ["ψ", tr("symbols.psi")],
                ["ω", tr("symbols.omega")],
                ["ℂ", tr("symbols.complexes")],
                ["ℕ", tr("symbols.naturals")],
                ["ℚ", tr("symbols.rationals")],
                ["ℝ", tr("symbols.reals")],
                ["ℤ", tr("symbols.integers")],
                ["ℯ", tr("symbols.eNumber")],
                ["∀", tr("symbols.forAll")],
                ["∂", tr("symbols.partialDerivative")],
                ["∃!", tr("symbols.existsUniqueOne")],
                ["∃∞", tr("symbols.existsInfinite")],
                ["∃", tr("symbols.exists")],
                ["∄!", tr("symbols.notExistsUniqueOne")],
                ["∄∞", tr("symbols.notExistsInfinite")],
                ["∄", tr("symbols.notExists")],
                ["∅", tr("symbols.emptySet")],
                ["∇", tr("symbols.nabla")],
                ["∈", tr("symbols.belongsTo")],
                ["∉", tr("symbols.notBelongsTo")],
                ["∋", tr("symbols.containsAsElement")],
                ["∌", tr("symbols.notContainsAsElement")],
                ["∏", tr("symbols.product")],
                ["∑", tr("symbols.sum")],
                ["√", tr("symbols.squareRootOf")],
                ["∛", tr("symbols.cubeRootOf")],
                ["∜", tr("symbols.fourthRootOf")],
                ["∝", tr("symbols.proportionalTo")],
                ["∞", tr("symbols.infinity")],
                ["∠", tr("symbols.angle")],
                ["∧", tr("symbols.and")],
                ["∨", tr("symbols.or")],
                ["∩", tr("symbols.intersection")],
                ["∪", tr("symbols.union")],
                ["∫", tr("symbols.integral")],
                ["∬", tr("symbols.doubleIntegral")],
                ["∭", tr("symbols.tripleIntegral")],
                ["∮", tr("symbols.lineIntegral")],
                ["∯", tr("symbols.surfaceIntegral")],
                ["∰", tr("symbols.volumeIntegral")],
                ["∴", tr("symbols.therefore")],
                ["∵", tr("symbols.because")],
                ["∼", tr("symbols.similarTo")],
                ["≅", tr("symbols.congruentTo")],
                ["≈", tr("symbols.approximatelyEqualTo")],
                ["≡", tr("symbols.identicalTo")],
                ["⊆", tr("symbols.subsetOf")],
                ["⊇", tr("symbols.supersetOf")],
                ["⊈", tr("symbols.notSubsetOf")],
                ["⊉", tr("symbols.notSupersetOf")],
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
    static decimalOptions(number: Value, options?: Options & { invert?: false }): Variable
    static decimalOptions(number: Value, options: Options & { invert: true }): Numeric
    static decimalOptions(
        number: Value = 0,
        { invert = false, round = true, places = Config.decimalPlaces }: Options = {}
    ): Value {
        let result: Value = String(number)

        if (invert) return Writing.replace(result, ",", ".")
        if (round) result = Algebra.round(result, places)
        if (Config.decimalSeparator) return Writing.replace(String(result), ".", ",")

        return result
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
        if (Config.explanations && explanation !== "") message += `\n\n${explanation}`
        if (Config.simpleMulti) message = Writing.simplifyMultiplication(message)
        if (!Config.unicode) message = Writing.noUnicode(message)
        if (!Config.accents) message = Writing.noAccents(message)
        if (Config.textCase === "capitalized") message = Writing.capitalize(message)
        else if (Config.textCase === "lowercase") message = Writing.lowercase(message)
        else if (Config.textCase === "uppercase") message = Writing.uppercase(message)

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
                  ["-", "⁻"],
                  [".", "․"],
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
                  ["-", "₋"],
                  [".", "․"],
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
