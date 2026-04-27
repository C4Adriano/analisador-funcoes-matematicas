import { Algebra } from "./algebra.js"
import { Config, DEFAULT_CONFIG } from "./config.js"

/**
 * [TEXTO] Objeto base para as funções envolvendo escrita e conversão de texto
 * - Use as funções aqui para converter os textos para o formato desejado, como sem acentos ou sem Unicode.
 * @since v6.1.0
 */
export const Writing = {
    /**
     * [TEXTO] Substituição de strings
     * @param {string} text - Texto
     * @param {string} from - O que será removido
     * @param {string} to - O que será colocado no lugar
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    replace(text = "", from = "", to = "") {
        return String(text).split(from).join(to)
    },

    /**
     * [TEXTO] Substituição de várias strings
     * @param {string} text - Texto
     * @param {string[][]} list - Lista de substituições do tipo: [["removido", "adicionado"], ["removido", "adicionado"], ...]
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    replaceGroup(text = "", list = [["", ""]]) {
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] != undefined && list[i][1] != undefined) {
                text = Writing.replace(text, list[i][0], list[i][1])
            }
        }
        return text
    },

    /**
     * [TEXTO] Substituição da grafia de Unicode
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    noUnicode(text = "") {
        let replacements = [
            // === LETRAS / SÍMBOLOS ESPECIAIS ===
            ["Δ", "Delta"],
            ["π", "pi"],
            ["φ", "phi"],
            ["θ", "theta"],
            ["λ", "lambda"],
            ["μ", "mu"],
            ["σ", "sigma"],
            ["ρ", "rho"],
            ["τ", "tau"],
            ["ε", "epsilon"],
            ["γ", "gamma"],
            ["η", "eta"],
            ["ζ", "zeta"],
            ["κ", "kappa"],
            ["ν", "nu"],
            ["ξ", "xi"],
            ["ω", "omega"],
            ["α", "alfa"],
            ["β", "beta"],
            ["χ", "chi"],
            ["ψ", "psi"],

            // === FUNÇÕES MATEMÁTICAS ===
            ["ƒ", "f"],
            ["∑", "soma"],
            ["∏", "produto"],
            ["∫", "integral"],
            ["∬", "integral dupla"],
            ["∭", "integral tripla"],
            ["∮", "integral de linha"],
            ["∯", "integral de superfície"],
            ["∰", "integral de volume"],
            ["∂", "derivada parcial"],
            ["∇", "nabla"],

            // === CONJUNTOS MATEMÁTICOS ===
            ["ℝ", "Reais"],
            ["ℤ", "Inteiros"],
            ["ℕ", "Naturais"],
            ["ℚ", "Racionais"],
            ["ℂ", "Complexos"],
            ["∅", "vazio"],
            ["∪", "união"],
            ["∩", "interseção"],
            ["⊆", "subconjunto de"],
            ["⊇", "superconjunto de"],
            ["⊈", "não é subconjunto de"],
            ["⊉", "não é superconjunto de"],

            // === QUANTIFICADORES / EXISTÊNCIA ===
            ["∀", "para todo"],
            ["∃", "existe"],
            ["∄", "não existe"],
            ["∃!", "existe um único"],
            ["∄!", "não existe um único"],
            ["∃∞", "existem infinitos"],
            ["∄∞", "não existem infinitos"],

            // === PERTENCIMENTO ===
            ["∈", "pertencente a"],
            ["∉", "não pertencente a"],
            ["∋", "contém como elemento"],
            ["∌", "não contém como elemento"],

            // === ÍNDICES / EXPOENTES ===
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

            // === OPERADORES RELACIONAIS ===
            ["≠", "!="],
            ["≤", "<="],
            ["≥", ">="],
            ["≪", "<<"],
            ["≫", ">>"],
            ["∝", "proporcional a"],
            ["∠", "ângulo"],
            ["∼", "semelhante a"],
            ["≅", "congruente a"],
            ["≈", "aproximadamente igual a"],
            ["≡", "idêntico a"],

            // === OPERADORES ARITMÉTICOS ===
            ["·", "*"],
            ["×", "*"],
            ["±", "+/-"],
            ["∓", "-/+"],
            ["÷", "/"],
            ["∖", "-"],

            // === RADICAIS / INFINITOS ===
            ["√", "raiz quadrada de "],
            ["∛", "raiz cúbica de "],
            ["∜", "raiz quarta de "],
            ["-∞", "menos infinito"],
            ["∞", "infinito"],

            // === LÓGICA ===
            ["⇒", "=>"],
            ["⇐", "<="],
            ["⇑", "^^"],
            ["⇓", "vv"],
            ["⇔", "<=>"],
            ["⇕", "^^vv"],
            ["⇖", "\\\\"],
            ["⇗", "//"],
            ["⇘", "\\\\"],
            ["⇙", "//"],
            ["∴", "portanto"],
            ["∵", "porque"],
            ["∨", "ou"],
            ["∧", "e"],
            ["¬", "não "],
            ["⊕", "ou exclusivo"],
            ["⊗", "ou não exclusivo"],

            // === SETAS / DIREÇÕES ===
            ["→", "->"],
            ["←", "<-"],
            ["↑", "^"],
            ["↓", "v"],
            ["↔", "<->"],
            ["↕", "^v"],
            ["↖", "\\"],
            ["↗", "/"],
            ["↘", "\\"],
            ["↙", "/"],

            // === PONTUAÇÃO / TEXTO ===
            ["“", "'"],
            ["”", "'"],
            ["‘", "'"],
            ["’", "'"],
            ["…", "..."],
            ["—", "-"],
            ["–", "-"],
            ["−", "-"],
            ["•", "*"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Substituição da grafia de acentos
     * @param {string} text Texto
     * @returns Texto convertido
     */
    noAccents(text = "") {
        let replacements = [
            // === AGUDOS (´) ===
            ["á", "a"], // A agudo (espanhol, português)
            ["Á", "A"],
            ["é", "e"], // E agudo (espanhol, português)
            ["É", "E"],
            ["í", "i"], // I agudo (espanhol, português)
            ["Í", "I"],
            ["ó", "o"], // O agudo (espanhol, português)
            ["Ó", "O"],
            ["ú", "u"], // U agudo (espanhol, português)
            ["Ú", "U"],
            ["ý", "y"], // Y agudo (islandês, tcheco)
            ["Ý", "Y"],

            // === GRAVES (`) ===
            ["à", "a"], // A grave (italiano, francês, português)
            ["À", "A"],
            ["è", "e"], // E grave (italiano, francês)
            ["È", "E"],
            ["ì", "i"], // I grave (italiano, francês)
            ["Ì", "I"],
            ["ò", "o"], // O grave (italiano, francês)
            ["Ò", "O"],
            ["ù", "u"], // U grave (italiano, francês)
            ["Ù", "U"],
            ["ỳ", "y"], // Y grave (islandês, tcheco)
            ["Ỳ", "Y"],

            // === TIL (~) ===
            ["ã", "a"], // A til (português)
            ["Ã", "A"],
            ["ẽ", "e"], // E til (islandês, tcheco)
            ["Ẽ", "E"],
            ["ĩ", "i"], // I til (islandês, tcheco)
            ["Ĩ", "I"],
            ["õ", "o"], // O til (português)
            ["Õ", "O"],
            ["ũ", "u"], // U til (islandês, tcheco)
            ["Ũ", "U"],
            ["ñ", "n"], // N til (espanhol, português)
            ["Ñ", "N"],
            ["ỹ", "y"], // Y til (islandês, tcheco)
            ["Ỹ", "Y"],

            // === CIRCUNFLEXOS (^) ===
            ["â", "a"], // A circunflexo (francês, português)
            ["Â", "A"],
            ["ê", "e"], // E circunflexo (francês, português)
            ["Ê", "E"],
            ["î", "i"], // I circunflexo (francês)
            ["Î", "I"],
            ["ô", "o"], // O circunflexo (francês)
            ["Ô", "O"],
            ["û", "u"], // U circunflexo (francês)
            ["Û", "U"],
            ["ŷ", "y"], // Y circunflexo (islandês, tcheco)
            ["Ŷ", "Y"],

            // === TREMA (¨) ===
            ["ä", "a"], // A trema (alemão, dinamarquês, norueguês)
            ["Ä", "A"],
            ["ë", "e"], // E trema (alemão, dinamarquês, norueguês)
            ["Ë", "E"],
            ["ï", "i"], // I trema (alemão, dinamarquês, norueguês)
            ["Ï", "I"],
            ["ö", "o"], // O trema (alemão, dinamarquês, norueguês)
            ["Ö", "O"],
            ["ü", "u"], // U trema (alemão, dinamarquês, norueguês)
            ["Ü", "U"],
            ["ÿ", "y"], // Y trema (francês)
            ["Ÿ", "Y"],

            // === GANCHOS ===
            ["ç", "c"], // Cedilha / C com gancho (português, francês)
            ["Ç", "C"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para capitalização
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    capitalized(text = "") {
        let result = "",
            capitalize = true

        for (let i = 0; i < text.length; i++) {
            let current = text[i],
                letter = Writing.noAccents(current).toLowerCase()

            if (
                current == "." ||
                current == "!" ||
                current == "?" ||
                current == "\n" ||
                current == "|" ||
                current == "“" ||
                current == "'"
            ) {
                capitalize = true
            } else if (current == "/") {
                capitalize = false
            }

            if (capitalize && "a" <= letter && letter <= "z") {
                result += current.toUpperCase()
                capitalize = false
            } else {
                result += current
            }
        }

        text = result

        let replacements = [
            // Caso especial para a letra latina f, que matematicamente tem uma forma diferente em maiúscula e minúscula
            ["Ƒ", "ƒ"],
            ["F(x)", "f(x)"],
            ["(X)", "(x)"],

            // Casos especiais para variáveis, por padrão, minúsculas
            ["X ", "x "],
            ["Y ", "y "],

            ["A =", "a ="],
            ["B =", "b ="],
            ["C =", "c ="],

            ["A · x²", "a · x²"],
            ["A >", "a >"],
            ["A <", "a <"],
            ["B · x", "b · x"],
            ["B × ", "b × "],
            ["B²", "b²"],

            ["“A”", "“a”"],
            ["'A'", "'a'"],
            ["“B”", "“b”"],
            ["'B'", "'b'"],
            ["“C”", "“c”"],
            ["'C'", "'c'"],

            ["X²", "x²"],
            ["X₁", "x₁"],
            ["X₂", "x₂"],
            ["X₃", "x₃"],
            ["Y₁", "y₁"],
            ["Y₂", "y₂"],
            ["Y₃", "y₃"],

            ["1E-", "1e-"],
            ["1E+", "1e+"],
            ["1E ", "1e "],
            ["1E\n", "1e\n"],

            // Casos especiais para palavras, por padrão, maiúsculas
            ["delta", "Delta"],
            ["unicode", "Unicode"],
            ["reais", "Reais"],
            ["inteiros", "Inteiros"],
            ["naturais", "Naturais"],
            ["racionais", "Racionais"],
            ["complexos", "Complexos"],
            ["reals", "Reals"],
            ["integers", "Integers"],
            ["naturals", "Naturals"],
            ["rationals", "Rationals"],
            ["complexes", "Complexes"],
            ["nan", "NaN"],
            ["infinity", "Infinity"],
            [" i ", " I "],

            // Casos especiais para línguas, que as siglas são minusculas, e as palavras maiúsculas
            ["Pt-br", "pt-br"],
            ["En", "en"],
            ["português", "Português"],
            ["portuguese", "Portuguese"],
            ["inglês", "Inglês"],
            ["english", "English"],

            // Caso especial para o nome do programa
            ["analisador de funções matemáticas", "Analisador de Funções Matemáticas"],
            ["Analisador de funções matemáticas", "Analisador de Funções Matemáticas"],
            ["mathematical function analyzer", "Mathematical Function Analyzer"],
            ["Mathematical function analyzer", "Mathematical Function Analyzer"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para minúsculas
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    lowercase(text = "") {
        text = text.toLowerCase()
        // Caso especial para a letra grega delta, que matematicamente tem uma forma diferente em maiúscula e minúscula
        text = Writing.replace(text, "δ", "Δ")

        return text
    },

    /**
     * [TEXTO] Conversão para maiúsculas
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    uppercase(text = "") {
        text = text.toUpperCase()
        // Caso especial para a letra latina f, que matematicamente tem uma forma diferente em maiúscula e minúscula
        text = Writing.replace(text, "Ƒ", "ƒ")

        return text
    },

    /**
     * [TEXTO] Manipulação de separadores decimais
     * @param {string | number} number - Número
     * @param {boolean} invert - Para inverter e não afetar nas contas
     * @param {boolean} round - Arredondar
     * @param {number} places - Casas decimais
     * @returns {string} - Número convertido
     * @since v6.1.0
     */
    decimal(number = 0, invert = false, round = true, places = Config.decimalPlaces) {
        number = String(number)

        // Se inverter é verdadeiro, troca vírgulas por pontos para não afetar nas contas
        if (invert) {
            return Writing.replace(number, ",", ".")
        }

        // Se arredondar é verdadeiro, arredonda o número para o número de casas decimais configurado
        if (round) {
            number = Algebra.round(number, places)
        }

        // Se separadorDecimal é verdadeiro, troca pontos por vírgulas para exibição
        if (Config.decimalSeparator) {
            return Writing.replace(number, ".", ",")
        }

        return number
    },

    /**
     * [TEXTO] Simplificação de símbolos de multiplicação
     * @param {string} text - Texto
     * @returns {string} - Texto convertido
     * @since v6.1.0
     */
    multiSimples(text = "") {
        return Writing.replace(text, " · ", "")
    },

    /**
     * [TEXTO] Tradução de texto para a linguagem configurada
     * @param {string} text - Texto
     * @returns {string} - Texto traduzido
     * @since v6.1.0
     */
    translate(text = "") {
        text = Writing.lowercase(text)

        let completeSentences = [["", ""]],
            partialSentences = [["", ""]],
            words = [["", ""]],
            connectors = [["", ""]]

        if (Config.language == "pt-br") {
            // === TRADUÇÃO DE INGLÊS PARA PORTUGUÊS ===
            words = [
                ["undefined", "indefinido"],
                ["nan", "não é um número"],
                ["infinity", "infinito"],
                ["sin(", "sen("],
            ]
        } else if (Config.language == "en") {
            // === TRADUÇÃO DE PORTUGUÊS PARA INGLÊS ===
            completeSentences = [
                ["bem-vindo ao analisador de funções matemáticas", "welcome to the mathematical function analyzer"],
                [
                    "este programa analisa funções do tipo constante, afim, quadrática, exponencial e logarítmica — identificando suas propriedades e características. para começar, informe os dados da função quando solicitado",
                    "this program analyzes functions of the following types: constant, affine, quadratic, exponential, and logarithmic — identifying their properties and characteristics. to get started, enter the function's data when prompted",
                ],
                ["analisador de funções matemáticas", "mathematical function analyzer"],
                ["tu queres alterar a língua para", "do you want to change the language to"],
                ["a função pode assumir qualquer", "the function can take any"],
                ["a função só tem esse", "the function only has this"],
                ["a função será sempre", "the function will always be"],
                ["a função não é", "the function is not"],
                ["não existe raiz real, portanto não há", "there is no real root, therefore there is no"],
                [
                    "ainda não posso resolver equações com funções não polinomiais",
                    "i can not solve equations with non-polynomial functions yet",
                ],
                [
                    "porque as funções são iguais, em todos os pontos, elas se encontram",
                    "because the functions are the same at all points, they intersect",
                ],
                [
                    "porque as funções são diferentes, não há ponto em que elas se encontrarão",
                    "because the functions are different, there is no point at which they will meet",
                ],
                [
                    "tu tentaste dividir um número por zero, o que não é possível",
                    "you tried to divide a number by zero, which is not possible",
                ],
                [
                    "tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível",
                    "you tried to calculate a logarithm with a base less than or equal to 1, which is not possible",
                ],
                [
                    "se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado",
                    "if this is a variable and what was typed is not a number, it will be transformed into the variable name, not what was typed",
                ],
                [
                    "essas mensagens podem ser desativadas nas configurações, em",
                    "these messages can be disabled in the settings, under",
                ],
                [
                    "toda e qualquer coisa digitada passará a ter que ser confirmada",
                    "everything typed will have to be confirmed",
                ],
                [
                    "isso irá ativar uma mensagem antes de sair / fechar o programa",
                    "this will enable a message before exiting / closing the program",
                ],
                [
                    "essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                    "this setting is useful to avoid infinite loops in the code if something goes wrong",
                ],
                ["isso irá alterar a língua do sistema inteiro", "this will change the entire system language"],
                ["a quantidade de interações passou do limite", "the number of iterations exceeded the limit"],
                ["tu escolheste algo fora do intervalo", "you chose a value outside the interval"],
                ["não há raízes reais", "there are no real roots"],
                ["não há interseção com o eixo x", "there is no intersection with the x-axis"],
                ["interseção com o eixo x", "intersection with the x-axis"],
                ["interseções com o eixo x", "intersections with the x-axis"],
                [
                    "ponto mais baixo (ou mais alto, conforme a concavidade) da função",
                    "lowest (or highest, depending on concavity) point of the function",
                ],
                ["entre o vértice e o ∞", "between the vertex and ∞"],
                ["entre -∞ e o vértice", "between -∞ and the vertex"],
                ["entre c e ∞, exceto o próprio c", "between c and ∞, excluding c itself"],
                ["entre -∞ e c, exceto o próprio c", "between -∞ and c, excluding c itself"],
                ["não há histórico o suficiente para mudanças", "not enough history for changes"],
                [
                    "escrevestes apenas uma função até agora. use “alterar” para escrever outra função",
                    "you have only written one function so far. use “change” to write another function",
                ],
                ["todas as configurações já estão na forma padrão", "all settings are already in their default form"],
                ["não há necessidade de restaurar", "there is no need to restore"],
                ["voltar às configurações padrão", "reset to default settings"],
                ["configurações não são salvas ao fechar", "settings are not saved on close"],
                ["isso irá afetar todas as configurações acima", "this will affect all the settings above"],
                ["essa alteração é permanente", "this change is permanent"],

                // Unicode
                [
                    "caracteres unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. desativar fará com que eles sejam transformados em uma palavra correspondente, tais como:",
                    "unicode characters are special symbols, such as: “ℝ”, “∀”, etc. disabling them will cause them to be replaced by a corresponding word, such as:",
                ],
                ["nem todos os caracteres unicode serão desativados", "not all unicode characters will be disabled"],
                ["essa configuração pode mudar algumas explicações", "this setting may change some explanations"],

                // Explicações
                [
                    "ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do delta,",
                    "enabling will cause certain messages to be different and include explanations, for example: the calculation of delta,",
                ],
                ["sem ser só o resultado dele", "instead of just the result"],
                ["nem todas as mensagens têm versão explicada", "not all messages have an explained version"],
                [
                    "desativar o unicode fará com que seja mostrado: delta = b^2 - 4 * a * c",
                    "disabling unicode will show: delta = b^2 - 4 * a * c",
                ],

                // Acentos
                [
                    "essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação",
                    "this setting will remove all diacritical marks from words, which may cause misinterpretation",
                ],

                // Capitalizadas
                [
                    "essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas",
                    "this setting will transform words into “normal” form, meaning the first letter of each sentence in uppercase and all others in lowercase",
                ],
                [
                    "essa configuração irá desativar “maiúsculas” e “minúsculas”",
                    "this setting will disable “uppercase” and “lowercase”",
                ],

                // Maiúsculas
                [
                    "essa configuração irá transformar todas as letras em maiúsculas",
                    "this setting will transform all letters into uppercase",
                ],
                [
                    "essa configuração irá desativar “capitalizadas” e “minúsculas”",
                    "this setting will disable “capitalized” and “lowercase”",
                ],

                // Minúsculas
                [
                    "essa configuração irá transformar todas as letras em minúsculas",
                    "this setting will transform all letters into lowercase",
                ],
                [
                    "essa configuração irá desativar “capitalizadas” e “maiúsculas”",
                    "this setting will disable “capitalized” and “uppercase”",
                ],

                // Ponto decimal
                [
                    "essa configuração irá transformar os números com “.” em números com “,”",
                    "this setting will transform numbers with “.” into numbers with “,”",
                ],
                [
                    "isso é apenas estético e não irá afetar as contas",
                    "this is only aesthetic and will not affect calculations",
                ],
                [
                    "tu também poderás escrever os números com “,” em vez de “.”",
                    "you will also be able to write numbers with “,” instead of “.”",
                ],

                // Multiplicação simples
                [
                    "isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”",
                    "this will aesthetically change polynomial expressions from: “a · x² + b · x + c” to: “ax² + bx + c”",
                ],
                ["desativar o unicode irá transformar o “·” em “*”", "disabling unicode will transform “·” into “*”"],
                [
                    "isso não irá afetar o “×”, porém o unicode irá transformá-lo em “*”",
                    "this will not affect “×”, but unicode will transform it into “*”",
                ],

                // Confirmações de entrada
                [
                    "toda e qualquer coisa digitada passará a ter que ser confirmada",
                    "everything typed will have to be confirmed",
                ],

                // Confirmações de saída
                [
                    "isso irá ativar uma mensagem antes de sair / fechar o programa",
                    "this will enable a message before exiting / closing the program",
                ],

                // Erros
                [
                    "desativar pode fazer com que tu não percebas algum erro que estás cometendo",
                    "disabling may cause you not to notice an error you are making",
                ],

                // Mostrar função
                [
                    "“mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções",
                    "“show function” means the function (for example: ax² + bx + c) will be shown at the beginning of menus, before the options",
                ],
                [
                    "a função ainda continuará sendo mostrada quando for escolhida a opção “6” (rever / mostrar função)",
                    "the function will still be shown when option “6” (review / show function) is selected",
                ],

                // Casas decimais
                [
                    "um número muito pequeno de casas decimais pode fazer as contas ficarem erradas",
                    "too few decimal places may cause calculations to be incorrect",
                ],
                [
                    "os números já digitados serão arredondados para o novo número de casas decimais",
                    "numbers already entered will be rounded to the new number of decimal places",
                ],

                // Precisão do log
                [
                    "isso poderá afetar contas muito pequenas envolvendo logs",
                    "this may affect very small calculations involving logarithms",
                ],
                ["tu terás que escrever literalmente “1e-12”", "you will have to literally type “1e-12”"],

                // Precisão da divisão
                [
                    "isso poderá afetar contas muito pequenas envolvendo divisões",
                    "this may affect very small calculations involving divisions",
                ],

                // Limite de iterações
                [
                    "isso irá afetar todos os loops, tais como logs, menus, etc.",
                    "this will affect all loops, such as logarithms, menus, etc.",
                ],

                // Linguagem
                ["isso irá alterar a língua do sistema inteiro.", "this will change the entire system language."],
            ]

            partialSentences = [
                ["em construção", "under construction"],
                ["o que queres", "what do you want"],
                ["tu digitaste", "you typed"],
                ["tens certeza", "are you sure"],
                ["tu queres sair", "do you want to exit"],
                ["queres mudar os valores dos coeficientes", "do you want to change the coefficient values"],
                ["se quiser alterar os valores dos pontos, escolha", "if you want to change the point values, choose"],
                ["não posso ainda descobrir o valor de", "i cannot yet determine the value of"],
                ["quando tenho somente o", "when i only have"],
                ["tendo somente pontos", "given only points"],
                ["não possuem pontos de interseção reais", "have no real intersection points"],
                ["se encontram em", "meet at"],
                ["escolha um valor entre", "choose a value between"],
                ["ou selecione 0 para voltar / sair", "or select 0 to go back / exit"],
                ["configurações poderão voltar ao padrão caso saias", "settings may revert to default if you exit"],
                ["restaurar padrão", "restore defaults"],
                ["configurações afetadas", "affected settings"],
                ["para escrever outra função", "to write another function"],
                ["caso queira que", "if you want"],
                ["seja uma incógnita", "to be an unknown variable"],
                ["ponto da raiz", "root point"],
                ["o ponto é sempre", "the point is always"],
                ["para comparar", "to compare"],
                ["por enquanto", "for now"],
                ["neste caso", "in this case"],
                ["para cima", "upward"],
                ["para baixo", "downward"],
                ["| atual", "| current"],
                ["| padrão", "| default"],
                ["a raiz é", "the root is"],
                ["as raízes reais", "the real roots"],
                ["as funções", "the functions"],
                ["a função", "the function"],
                ["funções não polinomiais", "non-polynomial functions"],
                ["funções polinomiais", "polynomial functions"],
                ["função exponencial", "exponential function"],
                ["função logarítmica", "logarithmic function"],
                ["função atual", "current function"],
                ["sem termo linear", "without a linear term"],
                ["sem termo constante", "without a constant term"],
                ["ela é constante", "it is constant"],
                ["valores inválidos", "invalid values"],
                ["estudo do sinal", "signal analytics"],
                ["não há", "there is no"],
                ["não é", "is not"],
                ["divisão por zero", "division by zero"],
                ["ultrapassou o limite", "exceeded the limit"],
                ["assíntota horizontal", "horizontal asymptote"],
                ["confirmações de entrada", "input confirmations"],
                ["confirmações de saída", "output confirmations"],
                ["mensagens de erro", "error messages"],
                ["mostrar função", "show function"],
                ["casas decimais", "decimal places"],
                ["precisão do log", "log precision"],
                ["precisão da divisão", "division precision"],
                ["separador decimal", "decimal separator"],
                ["multiplicação simples", "multiplication simplification"],
                ["caracteres unicode", "unicode characters"],
                ["menu principal", "main menu"],
                [" x real", " real x"],
                [" y real", " real y"],
                ["valor de x", "x-value"],
                ["valor de y", "y-value"],
                ["eixo x", "x-axis"],
                ["eixo y", "y-axis"],
                ["para x", "for x"],
                ["para y", "for y"],
                ["como y", "since y"],
                ["pois c", "since c"],
                ["pois b", "since b"],
                ["pois y", "since y"],
            ]

            words = [
                ["histórico", "history"],
                ["erro", "error"],
                ["equações", "equations"],
                ["exceto", "except"],
                ["português brasileiro", "brazilian portuguese"],
                ["raiz real", "real root"],
                ["raízes reais", "real roots"],
                ["domínio", "domain"],
                ["imagem", "range"],
                ["positiva", "positive"],
                ["negativa", "negative"],
                ["constante", "constant"],
                ["concavidade", "concavity"],
                ["inclinação", "slope"],
                ["crescente", "increasing"],
                ["decrescente", "decreasing"],
                ["assíntota", "asymptote"],
                ["vértice", "vertex"],
                ["intervalo", "interval"],
                ["coeficiente", "coefficient"],
                ["interseção", "intersection"],
                ["interseções", "intersections"],
                ["raízes", "roots"],
                ["raiz", "root"],
                ["valores", "values"],
                ["valor", "value"],
                ["ponto", "point"],
                ["nula", "null"],
                ["afim", "affine"],
                ["quadrática", "quadratic"],
                ["exponencial", "exponential"],
                ["logarítmica", "logarithmic"],
                ["polinomiais", "polynomial"],
                ["polinomial", "polynomial"],
                ["incompleta", "incomplete"],
                ["identidade", "identity"],
                ["oposta", "opposite"],
                ["linear", "linear"],
                ["natural", "natural"],
                ["decimal", "decimal"],
                ["pura", "pure"],
                ["curva", "curve"],
                ["aponta", "points"],
                ["salva", "saved"],
                ["coincidem", "coincide"],
                ["infinitos", "infinite"],
                ["infinito", "infinity"],
                ["inválido", "invalid"],
                ["motivo", "reason"],
                ["número", "number"],
                ["página", "page"],
                ["anterior", "previous"],
                ["próxima", "next"],
                ["antigas", "history"],
                ["início", "start"],
                ["alterar", "change"],
                ["voltar", "back"],
                ["cancelar", "cancel"],
                ["desativar", "disable"],
                ["ativar", "enable"],
                ["sair", "exit"],
                ["rever", "review"],
                ["entre", "between"],
                ["sempre", "always"],
                ["aviso", "warning"],
                ["função", "function"],
                ["funções", "functions"],
                ["configurações", "settings"],
                ["configuração", "setting"],
                ["linguagem", "language"],
                ["inglês", "english"],
                ["acentos", "accents"],
                ["capitalizadas", "capitalized"],
                ["maiúsculas", "uppercase"],
                ["minúsculas", "lowercase"],
                ["explicações", "explanations"],
                ["padrão", "default"],
                ["atual", "current"],
                ["digitaste", "typed"],
                ["digite", "type"],
                ["interações", "iterations"],
                ["sen(", "sin("],
            ]

            connectors = [
                ["“cancelar”", "“cancel”"],
                ["“sim”", "“yes”"],
                ["“não”", "“no”"],
                ["obs.", "note"],
                ["pois", "because"],
                ["conforme", "according to"],
                [" com ", " with "],
                [" é ", " is "],
                // [" a ", " the "], - Problemas com a letra "a" em inglês, que pode ser um artigo ou uma variável
                [" as ", " the "],
                [" o ", " the "],
                [" os ", " the "],
                [" em ", " in "],
                [" se ", " if "],
                [" e ", " and "],
                [" ela ", " she "],
                [" ele ", " he "],
                [" tu ", " you "],
                [" você ", " you "],
                [" eu ", " i "],
            ]
        }

        text = Writing.replaceGroup(text, [].concat(completeSentences, partialSentences, words, connectors))

        return text
    },

    /**
     * [TEXTO] Tradução de texto sem Unicode para a linguagem configurada
     * @param {string} text - Texto
     * @returns {string} - Texto traduzido
     */
    translateUnicode(text = "") {
        let replacements = [
            ["alfa", "alpha"],
            ["para todo", "for all"],
            ["não existe", "does not exist"],
            ["não pertencente a", "not belonging to"],
            ["pertencente a", "belonging to"],
            ["proporcional a", "proportional to"],
            ["semelhante a", "similar to"],
            ["congruente a", "congruent to"],
            ["aproximadamente igual a", "approximately equal to"],
            ["idêntico a", "identical to"],
            ["raiz quadrada de", "square root of"],
            ["raiz cúbica de", "cube root of"],
            ["raiz quarta de", "fourth root of"],
            ["menos infinito", "negative infinity"],
            ["ou exclusivo", "or exclusive"],
            ["ou não exclusivo", "or not exclusive"],
            ["integral dupla", "double integral"],
            ["integral tripla", "triple integral"],
            ["integral de linha", "line integral"],
            ["integral de superfície", "surface integral"],
            ["integral de volume", "volume integral"],
            ["derivada parcial", "partial derivative"],
            ["reais", "reals"],
            ["inteiros", "integers"],
            ["naturais", "naturals"],
            ["racionais", "rationals"],
            ["complexos", "complexes"],
            ["vazio", "empty"],
            ["união", "union"],
            ["ângulo", "angle"],
            ["soma", "sum"],
            ["produto", "product"],
        ]

        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Formatação geral de mensagens
     * @param {string} message - Mensagem
     * @param {string} explanation - Mensagem para a explicação
     * @returns {string} - Mensagem formatada
     * @since v6.1.0
     */
    format(message = "", explanation = "") {
        // === ADIÇÃO DE EXPLICAÇÕES ===
        // Se explicações estão ativadas e há uma explicação, adiciona à mensagem
        if (Config.explanations && explanation != "") {
            message += "\n\n" + explanation
        }

        // === SIMPLIFICAÇÃO DE MULTIPLICAÇÃO ===
        // Substitui símbolos de multiplicação complexos por simples, se ativado
        if (Config.simpleMulti) {
            message = Writing.multiSimples(message)
        }

        // === TRADUÇÃO ===
        // Traduz a mensagem para a linguagem configurada
        if (Config.language != "pt-br") {
            message = Writing.translate(message)
        }

        // === REMOÇÃO DE UNICODE ===
        // Remove símbolos Unicode especiais, se desativado
        if (!Config.unicode) {
            message = Writing.noUnicode(message)
            if (Config.language != "pt-br") {
                message = Writing.translateUnicode(message)
            }
        }

        // === REMOÇÃO DE ACENTOS ===
        // Remove acentos das letras, se desativado
        if (!Config.accents) {
            message = Writing.noAccents(message)
        }

        // === AJUSTE DE CASE (MAIÚSCULAS/MINÚSCULAS) ===
        // Aplica transformação de case baseada nas configurações
        if (Config.capitalized) {
            message = Writing.capitalized(message)
        } else if (Config.lowercase) {
            message = Writing.lowercase(message)
        } else if (Config.uppercase) {
            message = Writing.uppercase(message)
        }

        return message
    },

    /**
     * [TEXTO] Conversão para sobrescrito
     * @param {string | number} text - Número
     * @returns {string} - Número convertido
     * @since v6.1.0
     */
    superscript(text = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de sobrescrito simples
        if (!Config.unicode) {
            return "^" + text
        }

        let replacements = [
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
        ]

        // Substitui os números por seus equivalentes em sobrescrito
        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Conversão para subscrito
     * @param {string | number} text - Número
     * @returns {string} - Número subscrito
     * @since v6.1.0
     */
    subscript(text = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de subscrito simples
        if (!Config.unicode) {
            return "_" + text
        }

        let replacements = [
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
        ]

        // Substitui os números por seus equivalentes em subscrito
        text = Writing.replaceGroup(text, replacements)

        return text
    },

    /**
     * [TEXTO] Formatação de valores booleans
     * @param {string | number | boolean} value - Valor
     * @returns {string} - Valor formatado
     * @since v6.1.0
     */
    formatValue(value = true) {
        if (value == true || value == false) {
            return value ? "Sim" : "Não"
        }

        return String(value)
    },

    /**
     * [TEXTO] Formatação de itens de configuração
     * @param {string} message - Mensagem
     * @param {string} name - Nome em "config"
     * @returns {string} - Mensagem formatada
     * @since v6.1.0
     */
    configItem(message = "", name = "") {
        return (
            message +
            " | Atual: “" +
            Writing.formatValue(Config[name]) +
            "” | Padrão: “" +
            Writing.formatValue(DEFAULT_CONFIG[name]) +
            "”"
        )
    },

    /**
     * [TEXTO] Análise de texto para conversão de graus para radianos
     * @param {string} text - Texto
     * @returns {number} - Ângulo em radianos
     */
    parseDegree(text = "") {
        let degrees = parseFloat(Writing.replace(text, "°", ""))
        return degrees * (Math.PI / 180)
    },

    /**
     * [TEXTO] Análise de texto para conversão de radianos para graus
     * @param {string} text - Texto
     * @returns {number} - Ângulo em radianos
     */
    parseRadian(text = "") {
        let parts = text.split("/"),
            denominator = parts[1] ? parseFloat(parts[1]) : 1,
            multiParts = parts[0].split("*"),
            multiplier = multiParts.length > 1 ? parseFloat(multiParts[0]) : 1
        return (multiplier * Math.PI) / denominator
    },

    /**
     * [TEXTO] Análise de texto para conversão de ângulos
     * @param {string} text - Texto
     * @returns {number} - Ângulo
     */
    parseAngle(text = "") {
        if (text.includes("°")) {
            return Writing.parseDegree(text)
        } else {
            return Writing.parseRadian(text)
        }
    },

    /**
     * [TEXTO] Formatação de ângulos para exibição
     * @param {number} value - Ângulo em radianos
     * @returns {string} - Ângulo formatado
     */
    formatAngle(value = 0) {
        let ratio = value / Math.PI // PI/6 → ratio = 1/6 ≈ 0.1666...

        // Testa denominadores comuns (1 a 12 cobre os casos típicos)
        for (let denominator = 1; denominator <= 12; denominator++) {
            let numerator = Algebra.round(ratio * denominator, 0)
            if (Algebra.absolute(numerator / denominator - ratio) < 1e-9) {
                // Achou uma fração exata
                if (numerator == 0) {
                    return "0"
                } else if (denominator == 1) {
                    return numerator == 1 ? "PI" : numerator + " * PI"
                } else {
                    return (numerator == 1 ? "" : numerator + " * ") + "PI / " + denominator
                }
            }
        }

        // Se não achou fração simples, retorna decimal normal
        return Writing.decimal(value)
    },
}
