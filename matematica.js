console.log("" +
"====================================================" + "\n" +
"Analisador de Funções Matemáticas - Versão 5.5" + "\n" +
"Todos os direitos reservados © Adriano Lima 2025 - 2026" + "\n" +
"===================================================="
)

// === OBJETOS GLOBAIS ===
/**
 * Configurações do programa
 * - Edite os valores aqui para mudar os valores padrões das configurações. Porém tente não ultrapassar os limites ou alterar os tipos dos valores
 */
let config = {
    linguagem: "en", // Linguagem para as mensagens do programa (em construção, por enquanto só pt-br / en)

    unicode: true, // Usar Unicode para deixar bonitinhas as frases / expressões (como Δ, ∈, etc.)
    explicacoes: true, // Exibir explicações detalhadas junto com os resultados
    acentos: false, // Usar acentos nas palavras (como "raízes" em vez de "raizes")
    capitalizadas: true, // Forma normal de texto, com a primeira letra de cada frase em maiúscula
    maiusculas: false, // Todas as letras em maiúscula
    minusculas: false, // Todas as letras em minúscula

    separadorDecimal: false, // Usar vírgula como separador decimal (em vez de ponto)
    multiSimples: true, // Juntar letras em multiplos (como "2x" em vez de "2 · x")
    confirmacoesEntrada: false, // Exibir mensagens de confirmação para as entradas do usuário
    confirmacoesSaida: true, // Exibir mensagem de confirmação para sair do programa
    erros: true, // Exibir mensagens de erro detalhadas para o usuário
    mostrarFuncao: true, // Exibir a função que está sendo analisada antes dos resultados

    casasDecimais: 6, // Número de casas decimais para arredondar os resultados numéricos
    logPrecisao: 1e-12, // Precisão para cálculos logarítmicos (para evitar erros de arredondamento)
    divPrecisao: 1e-12, // Precisão para cálculos de divisão (para evitar divisão por zero)
    limiteInteracoes: 1000 // Limite de interações para evitar loops infinitos (como no estudo do sinal de uma função sem raízes reais, onde o programa pode tentar testar infinitos valores de x para encontrar as raízes)
},

/**
 * Configurações padrão do programa (para restaurar as configurações)
 */
padraoConfig = JSON.parse(JSON.stringify(config)),

/**
 * Objeto base para as ajudas de código (repetições) e cálculos comuns
 * - Use as funções aqui para obter ajudas comuns, como o domínio, imagem, interseção com os eixos, estudo do sinal, etc. As funções de ajuda também são usadas para exibir os resultados, então as explicações são feitas automaticamente conforme as configurações.
 */
ajudas = {
    /**
     * Monta o domínio de uma função
     * @param {string} pertence Intervalo de pertencimento
     * @param {string} explicacao Explicação
     */
    dominio(pertence = "∈ ℝ", explicacao = "A função pode assumir qualquer x real") {
        ui.exibir("Domínio: x " + pertence, explicacao)
    },

    /**
     * Monta a imagem de uma função
     * @param {string} pertence Intervalo de pertencimento
     * @param {string} intervalo Se a função deve assumir algum intervalo diferente
     * @param {string} explicacao Explicação
     */
    imagem(pertence = "∈ ℝ", intervalo = ".", explicacao = "A função pode assumir qualquer y real") {
        ui.exibir("Imagem: y " + pertence, explicacao + intervalo)
    },

    /**
     * Monta a intercessão com o eixo x de uma função
     * @param {string} raiz Raiz da função
     * @param {string} explicacao Explicação
     * @param {string} naoHa Mensagem quando não há interseção com o eixo x
     */
    eixoX(raiz = "0", explicacao = "c", naoHa = "Não existe raiz real, portanto não há interseção com o eixo x.") {
        let intersecao = "Interseção com o eixo x: "

        if (raiz == "0") { // Constante
            if (explicacao == 0) { // Se c = 0, a função é nula, então existe infinitas raízes
                ui.exibir(intersecao + "∃∞ x ∈ ℝ", "y = 0, ∀ x ∈ ℝ")
            } else { // Se c ≠ 0, então não existe raiz
                ui.exibir(intersecao + "∄! x ∈ ℝ", "y = c; se c ≠ 0 ⇒ ∄ x")
            }
        } else { // Outras funções
            if (isNaN(raiz)) { // Não polinomial
                ui.exibir(intersecao + "∄", naoHa)
            } else { // Afim
                ui.exibir(intersecao + "(" + escrita.decimal(raiz) + ", 0)", "Ponto da raiz, (" + explicacao + ", 0)")
            }
        }
    },

    /**
     * Monta a intercessão com o eixo y de uma função
     * @param {string} ponto Ponto
     * @param {string} funcao Função
     * @param {string} explicacao Explicação
     */
    eixoY(ponto = "0", funcao = "c", explicacao = "c") {
        ui.exibir("Interseção com o eixo y: " + (ponto != "∄" ? "(0, " + escrita.decimal(ponto) + ")" : "∄"), "Como y = " + funcao + (ponto != "∄" ? ", o ponto é sempre (0, " + explicacao + ")" : explicacao))
    },

    /**
     * Monta o valor de y para o x dado
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    valoresX(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let x = ui.entrada("x = ", "", true), mensagem = "Para x = " + escrita.decimal(x) + ", "

        if ((!funcExp) && (!funcLog)) { // Polinomial
            ui.exibir(mensagem + "y = " + escrita.decimal(coefA * (x ** 2) + (coefB * x) + coefC), "y = " + (coefA != 0 ? "a · x² + " : "") + (coefB != 0 ? "b · x + " : "") + "c")
        } else if (funcExp) { // Exponencial
            ui.exibir(mensagem + "y = " + escrita.decimal((coefB * (coefA ** x) + coefC)), "y = b × aˣ + c")
        } else if (funcLog) { // Logarítmica
            if (x > 0) { // O logaritmo só é definido para x > 0
                ui.exibir(mensagem + "y = " + escrita.decimal(coefB * algebra.log(x, coefA) + coefC), "y = b × logₐ(x) + c")
            } else { // Se x ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse x
                ui.exibir(mensagem + "∄! y ∈ ℝ", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
            }
        }
    },

    /**
     * Monta o valor de x para o y dado
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    valoresY(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let y = ui.entrada("y = ", "", true), mensagem = "Para y = " + escrita.decimal(y) + ", "

        if ((!funcExp) && (!funcLog)) { // Polinomial
            if ((coefA == 0) && (coefB == 0)) { // Constante
                if (y == coefC) { // Se y = c, então existe infinitas soluções
                    ui.exibir(mensagem + "∃∞ x ∈ ℝ", "y = c, ∀ x ∈ ℝ")
                } else { // Se y ≠ c, então não existe solução
                    ui.exibir(mensagem + "∄! x ∈ ℝ", "y = c; se y ≠ c ⇒ ∄ x")
                }
            } else if ((coefA == 0) && (coefB != 0)) { // Afim
                ui.exibir(mensagem + "x = " + escrita.decimal(algebra.divisao((y - coefC), coefB)), "x = (y - c) / b")
            } else if (coefA != 0) { // Quadrática
                let delta = ajudas.calcDelta(coefA, coefB, (coefC - y))
                ajudas.exibDelta(delta[0], mensagem + "∄! x ∈ ℝ", mensagem + "x = " + escrita.decimal(delta[1]), mensagem + "x₁ = " + escrita.decimal(delta[1]) + ", x₂ = " + escrita.decimal(delta[2]), true)
            }
        } else { // Não polinomial
            let expoente = algebra.divisao((y - coefC), coefB, false) // (y - c) / b
            if (funcExp) { // Exponencial
                if (expoente > 0) { // Se (y - c) / b > 0, então o logaritmo é definido, então a função tem valor real para esse y
                    ui.exibir(mensagem + "x = " + escrita.decimal(algebra.divisao(algebra.ln(expoente), algebra.ln(coefA))), "x = ln((y - c) / b) / ln(a)")
                } else { // Se (y - c) / b ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse y
                    ui.exibir(mensagem + "∄! x ∈ ℝ", "(y - c) / b ≤ 0")
                }
            } else if (funcLog) { // Logarítmica
                ui.exibir(mensagem + "x = " + escrita.decimal(coefA ** (expoente)), "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾")
            }
        }
    },

    /**
     * Monta o estudo do sinal de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     */
    sinal(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let operacoes = [">", "<"], palavras = ["positiva", "negativa"]

        if ((!funcExp) && (!funcLog)) { // Polinomial
            if ((coefA == 0) && (coefB == 0)) { // Constante
                let op = (coefC > 0) ? 0 : 1
                ui.exibir("ƒ(x) " + ((coefC != 0) ? operacoes[op] : "=") + " 0, ∀ x ∈ ℝ", "A função será sempre " + ((coefC != 0) ? palavras[op] : "nula") + ", pois c " + ((coefC != 0) ? operacoes[op] : "=") + " 0")
            } else if ((coefA == 0) && (coefB != 0)) { // Afim
                let raizAfim = ajudas.calcRaiz(0, coefB, coefC), op = (coefB > 0) ? 0 : 1
                ui.exibir("ƒ(x) " + operacoes[op] + " 0 se x " + operacoes[(op + ((coefB < 0) ? 1 : 0)) % 2] + " " + raizAfim + "\nƒ(x) " + operacoes[1 - op] + " 0 se x " + operacoes[(1 - op + ((coefB < 0) ? 1 : 0)) % 2] + " " + raizAfim + "\nƒ(x) = 0 em x = " + raizAfim, "Pois b " + operacoes[op] + " 0.")
            } else if (coefA != 0) { // Quadrática
                let delta = ajudas.calcRaiz(coefA, coefB, coefC), op = (coefA > 0) ? 0 : 1
                if (delta[1] > delta[2]) { // Inverte para ficar de menor a maior
                    let temp = delta[2]
                    delta[2] = delta[1]
                    delta[1] = temp
                }
                if (delta[0] < 0) { // Sem raiz
                    ui.exibir("ƒ(x) " + operacoes[op] + " 0, ∀ x ∈ ℝ", "Conforme a concavidade e as raízes, a " + operacoes[op] + " 0 e Δ < 0.")
                } else if (delta[0] == 0) { // Uma raiz
                    ui.exibir("ƒ(x) " + operacoes[op] + " 0, exceto em x = " + escrita.decimal(delta[1]), "Conforme a concavidade e a raiz, a " + operacoes[op] + " 0 e Δ = 0.")
                } else { // Duas raízes
                    if (coefA < 0) { // Concavidade para baixo
                        ui.exibir("ƒ(x) > 0 se " + escrita.decimal(delta[1]) + " < x < " + escrita.decimal(delta[2]) + "\nƒ(x) < 0 se (x < " + escrita.decimal(delta[1]) + ") ∨ (x > " + escrita.decimal(delta[2]) + ")\nƒ(x) = 0 em x = " + escrita.decimal(delta[1]) + ", " + escrita.decimal(delta[2]), "Conforme a concavidade e as raízes, a < 0 e Δ > 0.")
                    } else { // Concavidade para cima
                        ui.exibir("ƒ(x) > 0 se (x < " + escrita.decimal(delta[1]) + ") ∨ (x > " + escrita.decimal(delta[2]) + ")\nƒ(x) < 0 se " + escrita.decimal(delta[1]) + " < x < " + escrita.decimal(delta[2]) + "\nƒ(x) = 0 em x = " + escrita.decimal(delta[1]) + ", " + escrita.decimal(delta[2]), "Conforme a concavidade e as raízes, a > 0 e Δ > 0.")
                    }
                }
            }
        } else { // Não polinomial
            if (funcExp) { // Exponencial
                if (algebra.divisao(-coefC, coefB, false) > 0) { // Raiz
                    let raizExp = ajudas.calcRaiz(coefA, coefB, coefC, true)
                    if (((coefA < 1) && (coefB < 0)) || ((coefA > 1) && (coefB > 0))) { // Curva para cima
                        ui.exibir("ƒ(x) > 0 se x > " + escrita.decimal(raizExp) + "\nƒ(x) < 0 se x < " + escrita.decimal(raizExp) + "\nƒ(x) = 0 em x = " + escrita.decimal(raizExp), "Conforme a curva e a raiz, neste caso, crescente e (−c) / b > 0.")
                    } else if (((coefA > 1) && (coefB < 0)) || ((coefA < 1) && (coefB > 0))) { // Curva para baixo
                        ui.exibir("ƒ(x) > 0 se x < " + escrita.decimal(raizExp) + "\nƒ(x) < 0 se x > " + escrita.decimal(raizExp) + "\nƒ(x) = 0 em x = " + escrita.decimal(raizExp), "Conforme a curva e a raiz, neste caso, decrescente e (−c) / b > 0.")
                    }
                } else if (coefB > 0) { // Sem raiz, mas curva para cima
                    ui.exibir("ƒ(x) > 0, ∀ x ∈ ℝ", "Conforme b > 0 e (−c) / b ≤ 0.")
                } else { // Sem raiz, mas curva para baixo
                    ui.exibir("ƒ(x) < 0, ∀ x ∈ ℝ", "Conforme b < 0 e (−c) / b ≤ 0.")
                }
            } else if (funcLog) { // Logarítmica
                let raizLog = ajudas.calcRaiz(coefA, coefB, coefC, false, true)
                if (((coefA < 1) && (coefB < 0)) || ((coefA > 1) && (coefB > 0))) { // Curva para cima
                    ui.exibir("ƒ(x) > 0 se x > " + escrita.decimal(raizLog) + "\nƒ(x) < 0 se x < " + escrita.decimal(raizLog) + "\nƒ(x) = 0 em x = " + escrita.decimal(raizLog), "Conforme a curva (crescente)")
                } else if (((coefA > 1) && (coefB < 0)) || ((coefA < 1) && (coefB > 0))) { // Curva para baixo
                    ui.exibir("ƒ(x) > 0 se x < " + escrita.decimal(raizLog) + "\nƒ(x) < 0 se x > " + escrita.decimal(raizLog) + "\nƒ(x) = 0 em x = " + escrita.decimal(raizLog), "Conforme a curva (decrescente)")
                }
            }
        }
    },

    /**
     * Monta a equação de duas funções
     * @param {boolean} polinomial Polinomial
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @returns Operação futura
     */
    equacoes(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) { // Polinomial
            if (funcaoBase.length == 0) { // Salvar a primeira função para comparar depois
                funcaoBase = [coefA, coefB, coefC]
                editar = true
                loop = true
                ui.aviso("ƒ₁(x) salva.", "Digite ƒ₂(x) para comparar.")
                return (0)
            } else { // Comparar as duas funções
                algebra.equacoes(funcaoBase, [coefA, coefB, coefC])
                funcaoBase = []
                return (1)
            }
        } else { // Não polinomial
            ui.aviso("Ainda não posso resolver equações com funções não polinomiais.", "Em construção, use valores para x e y por enquanto.")
        }
    },

    /**
     * Monta a curva de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {boolean} polinomial Polinomial
     */
    curva(coefA = 0, coefB = 0, polinomial = true) {
        if (!polinomial) {
            if (((coefA < 1) && (coefB < 0)) || ((coefA > 1) && (coefB > 0))) {
                ui.exibir("Crescente", "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)")
            } else if (((coefA > 1) && (coefB < 0)) || ((coefA < 1) && (coefB > 0))) {
                ui.exibir("Decrescente", "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)")
            }
        } else {
            if (coefB != 0) {
                if (coefB > 0) {
                    ui.exibir("Crescente", "Aponta para cima, pois b > 0")
                } else if (coefB < 0) {
                    ui.exibir("Decrescente", "Aponta para baixo, pois b < 0")
                }
            } else if (coefA != 0) {
                if (coefA > 0) {
                    ui.exibir("Concavidade para cima", "a > 0")
                } else if (coefA < 0) {
                    ui.exibir("Concavidade para baixo", "a < 0")
                }
            }
        }
    },

    /**
     * Calcula a raiz de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     * @returns Raiz
     */
    calcRaiz(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        if ((!funcExp) && (!funcLog)) {
            if ((coefA == 0) && (coefB == 0)) {
                return (NaN)
            } else if ((coefA == 0) && (coefB != 0)) {
                return (algebra.divisao(-coefC, coefB))
            } else if (coefA != 0) {
                return (ajudas.calcDelta(coefA, coefB, coefC))
            }
        } else {
            let expoente = algebra.divisao(-coefC, coefB, false)
            if (funcExp) {
                if (expoente > 0) {
                    return (algebra.divisao(algebra.ln(expoente), algebra.ln(coefA)))
                } else {
                    return (NaN)
                }
            } else if (funcLog) {
                return (algebra.arredonda(coefA ** (expoente)))
            }
        }
    },

    /**
     * Mostra a raiz de uma função
     * @param {string} raiz Raiz
     * @param {string} explicacao Explicação
     * @param {string} naoHa Mensagem quando não há raiz
     */
    exibRaiz(raiz = "0", explicacao = "c", naoHa = "") {
        let intersecao = "Raiz real: "
        if (isNaN(raiz)) {
            ui.exibir(intersecao + "∄! x ∈ ℝ", naoHa)
        } else {
            ui.exibir(intersecao + "x = " + escrita.decimal(raiz), "A raiz é x = " + explicacao)
        }
    },

    /**
     * Calcula o Delta de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} coefC Coeficiente c
     * @returns Delta
     */
    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        let array = [(coefB ** 2) + (-4 * coefA * coefC)]
        array.push((array[0] >= 0) ? algebra.divisao((-coefB + Math.sqrt(array[0])), (2 * coefA)) : NaN)
        array.push((array[0] > 0) ? algebra.divisao((-coefB - Math.sqrt(array[0])), (2 * coefA)) : NaN)

        if ((array[0] > 0) && (array[1] > array[2])) {
            let temp = array[2]
            array[2] = array[1]
            array[1] = temp
        }

        return (array)
    },

    /**
     * Exibe o Delta de uma função
     * @param {number} delta Delta
     * @param {string} menor Mensagem para Delta < 0
     * @param {string} igual Mensagem para Delta = 0
     * @param {string} maior Mensagem para Delta > 0
     * @param {boolean} temY Se é (c - y)
     */
    exibDelta(delta = 0, menor = "", igual = "", maior = "", temY = false) {
        if (delta < 0) {
            ui.exibir(menor, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ < 0 ⇒ x ∉ ℝ")
        } else if (delta == 0) {
            ui.exibir(igual, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ = 0 ⇒ x = (-b) / (2 · a)")
        } else {
            ui.exibir(maior, "Δ = b² - 4 · a · " + (temY ? "(c - y)" : "c") + " ⇒ Δ > 0 ⇒ x₁, x₂ = (-b ± √Δ) / (2 · a)")
        }
    },

    /**
     * Calcula o vértice de uma função
     * @param {number} coefA Coeficiente a
     * @param {number} coefB Coeficiente b
     * @param {number} delta Delta
     * @returns Vértice
     */
    vertice(coefA = 0, coefB = 0, delta = 0) {
        return ([algebra.divisao((-coefB), (2 * coefA)), algebra.divisao((-delta), (4 * coefA))])
    },

    /**
     * Vê se estourou o limite
     * @param {number} limite Limite
     * @returns Se estourou o limite
     */
    estourouLimite(limite = config.limiteInteracoes) {
        let estourou = limite >= config.limiteInteracoes

        // Exibe o erro se estourou o limite
        if (estourou) {
           erro.limiteEstourado()
        }

        return (estourou)
    }
},

/**
 * Objeto base para as funções envolvendo escrita e conversão de texto
 * - Use as funções aqui para converter os textos para o formato desejado, como sem acentos ou sem Unicode. As funções de escrita também são usadas para exibir os resultados, então as conversões são feitas automaticamente conforme as configurações.
 */
escrita = {
    /**
     * [SUBSTITUIÇÃO] - Substituição de strings
     * @param {string} texto Texto
     * @param {string} de O que será removido
     * @param {string} para O que será colocado no lugar
     * @returns Texto convertido
     */
    substituir(texto = "", de = "", para = "") {
        return (String(texto).split(de).join(para))
    },

    substituirGrupo(texto = "", lista = [["", ""]]) {
        for (let i = 0; (i < lista.length); i++) {
            let antigo = texto
            if ((lista[i][0] != undefined) && (lista[i][1] != undefined)) {
                texto = escrita.substituir(texto, lista[i][0], lista[i][1])
            }
            if (antigo != texto) {
                console.log("antigo:\n" + antigo, "texto:\n" + texto, "de:\n" + lista[i][0], "para:\n" + lista[i][1])
            }
        }
        return (texto)
    },

    /**
     * [GRAFIA] - Substituição da grafia de Unicode
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    semUnicode(texto = "") {
        let trocas = [
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
            ["∉", "pertencente a, mas não"],
            ["∉̸", "não pertencente a, mas não"],
            ["∌", "contém como elemento, mas não"],
            ["∌̸", "não contém como elemento, mas não"],

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
            ["•", "*"]
        ]

        texto = escrita.substituirGrupo(texto, trocas)

        return (texto)
    },

    /**
     * [GRAFIA] - Substituição da grafia de acentos
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    semAcentos(texto = "") {
        let trocas = [
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
            ["Ç", "C"]
        ]

        texto = escrita.substituirGrupo(texto, trocas)

        return (texto)
    },

    /**
     * [CAPITALIZAÇÃO] - Conversão para capitalização
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    capitalizadas(texto = "") {
        let resultado = ""
        let capitalizar = true

        for (let i = 0; (i < texto.length); i++) {
            let atual = texto[i], letra = escrita.semAcentos(atual).toLowerCase()

            if ((capitalizar) && (("a" <= letra) && (letra <= "z"))) {
                resultado += atual.toUpperCase()
                capitalizar = false
            } else {
                resultado += atual
            }

            if ((atual == ".") || (atual == "!") || (atual == "?") || (atual == "\n") || (atual == "|") || (atual == "“") || (atual == "'")) {
                capitalizar = true
            }
        }

        texto = resultado

        let trocas = [
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
            ["“B”", "“b”"],
            ["“C”", "“c”"],

            ["E-", "e-"],

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
            ["english", "English"]
        ]

        texto = escrita.substituirGrupo(texto, trocas)

        return (texto)
    },

    /**
     * [CAIXA ALTA/BAIXA] - Conversão para minúsculas
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    minusculas(texto = "") {
        texto = texto.toLowerCase()
        // Caso especial para a letra grega delta, que matematicamente tem uma forma diferente em maiúscula e minúscula
        texto = escrita.substituir(texto, "δ", "Δ")

        return (texto)
    },

    /**
     * [CAIXA ALTA/BAIXA] - Conversão para maiúsculas
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    maiusculas(texto = "") {
        texto = texto.toUpperCase()
        // Caso especial para a letra latina f, que matematicamente tem uma forma diferente em maiúscula e minúscula
        texto = escrita.substituir(texto, "Ƒ", "ƒ")

        return (texto)
    },

    /**
     * [SEPARADORES] - Manipulação de separadores decimais
     * @param {string | number} numero Número
     * @param {boolean} inverter Para inverter e não afetar nas contas
     * @param {boolean} arredondar Arredondar
     * @param {number} casas Casas decimais
     * @returns Número convertido
     */
    decimal(numero = 0, inverter = false, arredondar = true, casas = config.casasDecimais) {
        numero = String(numero)

        // Se inverter é verdadeiro, troca vírgulas por pontos para não afetar nas contas
        if (inverter) {
            return (escrita.substituir(numero, ",", "."))
        }

        // Se arredondar é verdadeiro, arredonda o número para o número de casas decimais configurado
        if (arredondar) {
            numero = algebra.arredonda(numero, casas)
        }

        // Se separadorDecimal é verdadeiro, troca pontos por vírgulas para exibição
        if (config.separadorDecimal) {
            return (escrita.substituir(numero, ".", ","))
        }

        return (numero)
    },

    /**
     * [MULTIPLICAÇÃO] - Simplificação de símbolos de multiplicação
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    multiSimples(texto = "") {
        return (escrita.substituir(texto, " · ", ""))
    },

    /**
     * [TRADUÇÃO] - Conversão de texto para a linguagem configurada
     * @param {string} texto Texto
     * @returns Texto convertido
     */
    traduzir(texto = "") {
        texto = escrita.minusculas(texto)

        let frasesCompletas = [["", ""]], frasesParciais = [["", ""]], palavras = [["", ""]], conectores = [["", ""]]

        if (config.linguagem == "pt-br") {
            // === TRADUÇÃO DE INGLÊS PARA PORTUGUÊS ===
            palavras = [
                ["undefined", "indefinido"],
                ["nan", "não é um número"],
                ["infinity", "infinito"]
            ]
        } else if (config.linguagem == "en") {
            // === TRADUÇÃO DE PORTUGUÊS PARA INGLÊS ===
            frasesCompletas = [
                ["a função pode assumir qualquer", "the function can take any"],
                ["a função só tem esse", "the function only has this"],
                ["a função será sempre", "the function will always be"],
                ["a função não é", "the function is not"],
                ["não existe raiz real, portanto não há", "there is no real root, therefore there is no"],
                ["ainda não posso resolver equações com funções não polinomiais", "i can't solve equations with non-polynomial functions yet"],
                ["porque as funções são iguais, em todos os pontos, elas se encontram", "because the functions are the same at all points, they intersect"],
                ["porque as funções são diferentes, não há ponto em que elas se encontrarão", "because the functions are different, there is no point at which they will meet"],
                ["tu tentaste dividir um número por zero, o que não é possível", "you tried to divide a number by zero, which is not possible"],
                ["tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível", "you tried to calculate a logarithm with a base less than or equal to 1, which is not possible"],
                ["se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado", "if this is a variable and what was typed is not a number, it will be transformed into the variable name, not what was typed"],
                ["essas mensagens podem ser desativadas nas configurações, em", "these messages can be disabled in the settings, under"],
                ["toda e qualquer coisa digitada passará a ter que ser confirmada", "everything typed will have to be confirmed"],
                ["isso irá ativar uma mensagem antes de sair / fechar o programa", "this will enable a message before exiting / closing the program"],
                ["essa configuração é útil para evitar loops infinitos no código, caso algo dê errado", "this setting is useful to avoid infinite loops in the code if something goes wrong"],
                ["isso irá alterar a língua do sistema inteiro", "this will change the entire system language"],
                ["a quantidade de interações passou do limite", "the number of iterations exceeded the limit"],            
                ["tu escolheste algo fora do intervalo", "you chose a value outside the interval"],
                ["não há raízes reais", "there are no real roots"],
                ["não há interseção com o eixo x", "there is no intersection with the x-axis"],
                ["interseções com o eixo x", "intersections with the x-axis"],
                ["ponto mais baixo (ou mais alto, conforme a concavidade) da função", "lowest (or highest, depending on concavity) point of the function"],
                ["entre o vértice e o ∞", "between the vertex and ∞"],
                ["entre -∞ e o vértice", "between -∞ and the vertex"],
                ["entre c e ∞, exceto o próprio c", "between c and ∞, excluding c itself"],
                ["entre -∞ e c, exceto o próprio c", "between -∞ and c, excluding c itself"],
                ["não há histórico o suficiente para mudanças", "not enough history for changes"],
                ["escrevestes apenas uma função até agora. use “alterar” para escrever outra função", "you have only written one function so far. use “change” to write another function"],
                ["todas as configurações já estão na forma padrão", "all settings are already in their default form"],
                ["não há necessidade de restaurar", "there is no need to restore"],
                ["voltar às configurações padrão", "reset to default settings"],
                ["configurações não são salvas ao fechar", "settings are not saved on close"],
                ["isso irá afetar todas as configurações acima", "this will affect all the settings above"],
                ["essa alteração é permanente", "this change is permanent"]
            ]

            frasesParciais = [
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
                ["configurações voltarão ao padrão caso saias", "settings will revert to default if you exit"],
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
                ["não há", "there is no"],
                ["não é", "is not"],
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
                ["pois y", "since y"]
            ]

            palavras = [
                ["erro", "error"]
                ["português brasileiro", "brazilian portuguese"],
                ["integral dupla", "double integral"],
                ["integral tripla", "triple integral"],
                ["integral de linha", "line integral"],
                ["integral de superfície", "surface integral"],
                ["integral de volume", "volume integral"],
                ["derivada parcial", "partial derivative"],
                ["raiz real", "real root"],
                ["raízes reais", "real roots"],
                ["conjunto de", "set of"],
                ["um único", "a single"],
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
                ["reais", "reals"],
                ["inteiros", "integers"],
                ["naturais", "naturals"],
                ["racionais", "rationals"],
                ["complexos", "complexes"],
                ["existem", "they exist"],
                ["vazio", "empty"],
                ["união", "union"],
                ["ângulo", "angle"],
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
                ["alfa", "alpha"],
                ["soma", "sum"],
                ["produto", "product"],
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
                ["digite", "type"]
            ]

            conectores = [
                ["“cancelar”", "“cancel”"],
                ["“sim”", "“yes”"],
                ["“não”", "“no”"],
                ["obs.", "note"],
                ["pois", "because"],
                ["conforme", "according to"],
                [" é ", " is "],
                [" a ", " the "],
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
                [" eu ", " i "]
            ]
        }

        texto = escrita.substituirGrupo(texto, [].concat(frasesCompletas, frasesParciais, palavras, conectores))

        return (texto)
    },

    /**
     * [FORMATAÇÃO] - Formatação geral de mensagens
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Mensagem para a explicação
     * @returns Mensagem formatada
     */
    verificar(mensagem = "", explicacao = "") {
        // === ADIÇÃO DE EXPLICAÇÕES ===
        // Se explicações estão ativadas e há uma explicação, adiciona à mensagem
        if ((config.explicacoes) && (explicacao != "")) {
            mensagem += "\n\n" + explicacao
        }

        // === SIMPLIFICAÇÃO DE MULTIPLICAÇÃO ===
        // Substitui símbolos de multiplicação complexos por simples, se ativado
        if (config.multiSimples) {
            mensagem = escrita.multiSimples(mensagem)
        }

        // === REMOÇÃO DE UNICODE ===
        // Remove símbolos Unicode especiais, se desativado
        if (!config.unicode) {
            mensagem = escrita.semUnicode(mensagem)
        }

        // === TRADUÇÃO ===
        // Traduz a mensagem para a linguagem configurada
        if (config.linguagem != "pt-br") {
            mensagem = escrita.traduzir(mensagem)
        }

        // === REMOÇÃO DE ACENTOS ===
        // Remove acentos das letras, se desativado
        if (!config.acentos) {
            mensagem = escrita.semAcentos(mensagem)
        }

        // === AJUSTE DE CASE (MAIÚSCULAS/MINÚSCULAS) ===
        // Aplica transformação de case baseada nas configurações
        if (config.capitalizadas) {
            mensagem = escrita.capitalizadas(mensagem)
        } else if (config.minusculas) {
            mensagem = escrita.minusculas(mensagem)
        } else if (config.maiusculas) {
            mensagem = escrita.maiusculas(mensagem)
        }

        return (mensagem)
    },

    /**
     * [ÍNDICES] - Conversão para sobrescrito
     * @param {string | number} texto Número
     * @returns Número convertido
     */
    expoente(texto = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de sobrescrito simples
        if (!config.unicode) {
            return ("^" + texto)
        }

        let trocas = [
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
            [".", "․"]
        ]

        // Substitui os números por seus equivalentes em sobrescrito
        texto = escrita.substituirGrupo(texto, trocas)

        return (texto)
    },

    /**
     * [ÍNDICES] - Conversão para subscrito
     * @param {string | number} texto Número
     * @returns Número subscrito
     */
    base(texto = "") {
        // Se Unicode está desativado, retorna o texto com um símbolo de subscrito simples
        if (!config.unicode) {
            return ("_" + texto)
        }

        let trocas = [
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
            [".", "․"]
        ]

        // Substitui os números por seus equivalentes em subscrito
        texto = escrita.substituirGrupo(texto, trocas)

        return (texto)
    },

    /**
     * [FORMATAÇÃO] - Formatação de valores booleanos
     * Formata um valor
     * @param {boolean | string | number} valor Valor
     * @returns "Sim" ou "Não" se for boolean, ou a string do valor
     */
    formatar(valor = true) {
        if ((valor == true) || (valor == false)) {
            return (valor ? "Sim" : "Não")
        }

        return (String(valor))
    },

    /**
     * [CONFIGURAÇÕES] - Formatação de itens de configuração
     * Formata um item para as configurações
     * @param {string} mensagem Mensagem
     * @param {string} nome Nome em "config"
     * @returns Mensagem formatada
     */
    itemConfig(mensagem = "", nome = "") {
        return (mensagem + " | Atual: “" + escrita.formatar(config[nome]) + "” | Padrão: “" + escrita.formatar(padraoConfig[nome]) + "”")
    },
},

/**
 * Objeto base para as funções envolvendo UI / UX e interação com o usuário
 * - Use as funções aqui para exibir mensagens, menus, prompts e outras interações. As mensagens são formatadas automaticamente conforme as configurações, então use a função "escrita.verificar" para formatar as mensagens antes de exibi-las.
 */
ui = {
    /**
     * Exibe um alert personalizado
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     */
    exibir(mensagem = "", explicacao = "") {
        alert(escrita.verificar(mensagem, explicacao))
    },

    /**
     * Exibe um confirm personalizado
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     * @returns Sim / Não
     */
    confirmar(mensagem = "", explicacao = "") {
        return (confirm(escrita.verificar(mensagem, explicacao + "\n\n“Ok” = “Sim” | “Cancelar” = “Não”")))
    },

    /**
     * Exibe uma mensagem de erro
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     */
    erro(mensagem = "", explicacao = "") {
        if (config.erros) {
            ui.exibir("=== Erro ===\n" + mensagem, explicacao)
        }
    },

    /**
     * Exibe uma mensagem de aviso
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     * @param {boolean} tipo Tipo da mensagem
     */
    aviso(mensagem = "", explicacao = "", tipo = false) {
        if (!tipo) { // Se tipo for falso, é um aviso simples, como um alert
            ui.exibir("=== Aviso ===\n" + mensagem, explicacao)
        } else { // Se tipo for verdadeiro, é um aviso de confirmação, como um confirm
            ui.confirmar("=== Aviso ===\n" + mensagem, explicacao)
        }
    },

    /**
     * Formata um menu paginado
     * @param {string[]} opcoes Array com todas as opções possíveis
     * @param {number} pagina Página atual
     * @returns Retorna a resposta, a página atual, as opções por página
     */
    menu(opcoes = ["---"], pagina = 1) {
        let resposta = 0, menu = "", opcao = 1, paginaOpcoes = [""], total = 0, lista = [].concat(opcoes)

        // Organiza
        while (((lista.length % 5) != 0) || (lista.length == 0)) {
            lista.push("---")
        }
        total = Math.ceil(lista.length / 5)

        // Loop
        let limite = 0
        do {
            // Arruma
            if (pagina < 1) {
                pagina = 1
            } else if (pagina > total) {
                pagina = total
            }

            // Pergunta
            menu = "=== Menu ===\nPágina " + String(pagina) + "/" + String(total) + "\nO que queres?"

            while (opcao <= 5) {
                menu += "\n" + String(opcao) + " = " + String(lista[(opcao - 1) + (5 * (pagina - 1))])
                opcao++
            }

            opcao = 1
            menu += "\n----------------\n6 = Rever | 7 = Alterar | 8 = Anterior | 9 = Próxima | 0 = Voltar"
            paginaOpcoes = lista.slice((5 * (pagina - 1)), (5 * pagina))

            // Responde
            resposta = ui.intervalo(menu, "", 0, 9)
            if (resposta == 0) { // Voltar
                editar = false
                loop = true
            } else if (resposta == 7) { // Alterar
                editar = true
                loop = true
                resposta = 0
            } else if (resposta == 8) { // -1
                resposta = -1
                pagina -= 1
            } else if (resposta == 9) { // +1
                resposta = -1
                pagina += 1
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                resposta = 0
                loop = true
            }
        } while (!((0 <= resposta) && (resposta <= 9)))

        return ([resposta, pagina, paginaOpcoes])
    },

    /**
     * Exibe um prompt personalizado e verifica ele
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     * @param {boolean} tipo true = número, false = string
     * @param {number} casas Casas para arredondar (0 = sem casas)
     * @returns Valor verificado
     */
    entrada(mensagem = "", explicacao = "", tipo = false, casas = config.casasDecimais) {
        let bruto = "", texto = "", valor = 0, valido = false

        mensagem = escrita.verificar(mensagem, explicacao)

        // Loop
        let limite = 0
        do {
            bruto = prompt(mensagem)

            // Cancelar
            if (bruto == null) {
                valido = false
            } else {
                texto = String(bruto).trim()
                valido = (texto != "")
            }

            // Número
            if ((valido) && (tipo)) {
                valor = Number(escrita.decimal(texto, true))
                if (!isFinite(valor)) {
                    valido = false
                }
            }

            // Confirma
            if ((valido) && (config.confirmacoesEntrada)) {
                valido = ui.aviso("Tu digitaste: “" + (tipo ? escrita.decimal(valor) : texto) + "”\nTens certeza?", "Obs.₁: Se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado\nObs.₂: Essas mensagens podem ser desativadas nas configurações, em “Confirmações de entrada”", true)
            }

            // Retorna
            if (valido) {
                if (tipo) {
                    return (algebra.arredonda(valor, casas))
                }
                return (texto)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                valido = true
            }
        } while (!valido)

        return (tipo ? 0 : "")
    },

    /**
     * Formata uma função
     * @param {number | string} coefA Coeficiente a
     * @param {number | string} coefB Coeficiente b
     * @param {number | string} coefC Coeficiente c
     * @param {boolean} funcExp Exponencial
     * @param {boolean} funcLog Logarítmica
     * @param {boolean} mostrar Mostrará a função ou não, baseado na configuração
     */
    funcao(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, mostrar = config.mostrarFuncao) {
        if (!mostrar) { // Não mostrar
            return ("")
        }

        let func = "A função: ƒ(x) = "

        if ((!funcExp) && (!funcLog)) { // Polinomial
            if ((coefA == 0) && (coefB == 0)) { // Constante
                if (coefC == "c") { // Variável
                    func += "c"
                } else if (coefC != "c") { // Não variável
                    func += String(coefC)
                }

                func += " é constante"

                // Especiais
                if (coefC == 0) { // Se for zero, é a função nula
                    func += " / nula"
                }
            } else if ((coefA == 0) && (coefB != 0)) { // Afim
                if (coefB == "b") { // Variável
                    func += "b · x"
                } else if (coefB != "b") { // Não variável
                    if (Math.abs(coefB) == 1) { // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefB == -1) { // Se for -1, mostra o sinal de menos
                            func += "−"
                        }
                        func += "x"
                    } else if (Math.abs(coefB) != 1) { // Se for diferente de 1 ou -1, mostra o número
                        func += String(coefB) + " · x"
                    }
                }

                if (coefC == "c") { // Variável
                    func += " + c"
                } else if (coefC != "c") { // Não variável
                    if (coefC > 0) { // Se for positivo, mostra o sinal de mais
                        func += " + " + String(coefC)
                    } else if (coefC < 0) { // Se for negativo, mostra o sinal de menos e o número positivo
                        func += " − " + String(-coefC)
                    }
                }

                func += " é afim"

                // Especiais
                if ((coefB != 1) && (coefC == 0)) { // Se o coeficiente b for diferente de 1 e o coeficiente c for zero, é uma função linear
                    func += " / linear"
                } else if ((coefB == 1) && (coefC == 0)) { // Se o coeficiente b for 1 e o coeficiente c for zero, é a função identidade
                    func += " / identidade"
                } else if (coefB == -1) { // Se o coeficiente b for -1, é a função oposta da identidade
                    func += " / oposta"
                }
            } else if (coefA != 0) { // Quadrática
                if (coefA == "a") { // Variável
                    func += "a · x²"
                } else if (coefA != "a") { // Não variável
                    if (Math.abs(coefA) == 1) { // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefA == -1) { // Se for -1, mostra o sinal de menos
                            func += "−"
                        }
                        func += "x²"
                    } else if (Math.abs(coefA) != 1) { // Se for diferente de 1 ou -1, mostra o número
                        func += String(coefA) + " · x²"
                    }
                }

                if (coefB == "b") { // Variável
                    func += " + b · x"
                } else if ((coefB != "b") && (coefB != 0)) { // Não variável e diferente de zero
                    if (coefB > 0) { // Se for positivo, mostra o sinal de mais
                        func += " + "
                    } else if (coefB < 0) { // Se for negativo, mostra o sinal de menos e o número positivo
                        func += " − "
                    }

                    if (Math.abs(coefB) == 1) { // Se for 1 ou -1, não mostra o número, só o sinal
                        func += "x"
                    } else if (Math.abs(coefB) != 1) { // Se for diferente de 1 ou -1, mostra o número
                        func += String(Math.abs(coefB)) + " · x"
                    }
                }

                if (coefC == "c") { // Variável
                    func += " + c"
                } else if (coefC != "c") { // Não variável
                    if (coefC > 0) { // Se for positivo, mostra o sinal de mais
                        func += " + " + String(coefC)
                    } else if (coefC < 0) { // Se for negativo, mostra o sinal de menos e o número positivo
                        func += " − " + String(-coefC)
                    }
                }

                func += " é quadrática"

                // Especiais
                if ((coefB == 0) && (coefC == 0)) { // Se os coeficientes b e c forem zero, é uma função quadrática pura
                    func += " / pura"
                } else if (coefB == 0) { // Se o coeficiente b for zero, é uma função incompleta sem termo linear
                    func += " / incompleta (sem termo linear)"
                } else if (coefC == 0) { // Se o coeficiente c for zero, é uma função incompleta sem termo constante
                    func += " / incompleta (sem termo constante)"
                }
            }
        } else if (funcExp) { // Exponencial
            if (coefB != "b") { // Não variável
                if (coefB != 1) { // Se for diferente de 1, mostra o número
                    func += String(coefB) + " × "
                }
            } else if (coefB == "b") { // Variável
                func += "b × "
            }

            if (coefA != "a") { // Não variável
                func += String(coefA) + "ˣ"
            } else if (coefA == "a") { // Variável
                func += "aˣ"
            }

            if (coefC != "c") { // Não variável
                if (coefC > 0) { // Se for positivo, mostra o sinal de mais
                    func += " + " + String(coefC)
                } else if (coefC < 0) { // Se for negativo, mostra o sinal de menos e o número positivo
                    func += " − " + String(-coefC)
                }
            } else if (coefC == "c") { // Variável
                func += " + c"
            }

            func += " é exponencial"

            // Especiais
            if ((coefB == 1) && (coefC == 0)) { // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função exponencial pura
                func += " / pura"
            }
            if (coefA == algebra.arredonda(Math.E)) { // Se o coeficiente a for igual a e, é uma função exponencial natural
                func += " / natural"
            }
        } else if (funcLog) { // Logarítmica
            if (coefB != "b") { // Não variável
                if (coefB != 1) {
                    func += String(coefB) + " × "
                }
            } else if (coefB == "b") { // Variável
                func += "b × "
            }

            if (coefA != "a") { // Não variável
                func += "log" + escrita.base(coefA) + "(x)"
            } else if (coefA == "a") { // Variável
                func += "logₐ(x)"
            }

            if (coefC != "c") { // Não variável
                if (coefC > 0) { // Se for positivo, mostra o sinal de mais
                    func += " + " + String(coefC)
                } else if (coefC < 0) { // Se for negativo, mostra o sinal de menos e o número positivo
                    func += " − " + String(-coefC)
                }
            } else if (coefC == "c") { // Variável
                func += " + c"
            }

            func += " é logarítmica"

            // Especiais
            if ((coefB == 1) && (coefC == 0)) { // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função logarítmica pura
                func += " / pura"
            }
            if (coefA == algebra.arredonda(Math.E)) { // Se o coeficiente a for igual a e, é uma função logarítmica natural
                func += " / natural"
            } else if (coefA == 10) { // Se o coeficiente a for igual a 10, é uma função logarítmica decimal
                func += " / decimal"
            }
        }

        ui.exibir("=== Função Atual ===\n" + escrita.decimal(func))
    },

    /**
     * Pede ao usuário um valor entre o intervalo
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     * @param {number} min Mínimo
     * @param {number} max Máximo
     * @param {number} casas Casas decimais
     * @returns Um valor escolhido entre o intervalo
     */
    intervalo(mensagem = "", explicacao = "", min = 0, max = 1, casas = 0) {
        let valor = 0

        // Loop
        do { // Pede um valor
            valor = ui.entrada(mensagem, explicacao, true, casas)

            if (!((min <= valor) && (valor <= max))) { // Se o valor não estiver entre o intervalo, mostra um erro
                erro.intervalo(min, max)
            }
        } while (!((min <= valor) && (valor <= max)))

        return (valor)
    }
},

/**
 * Objeto base para as funções de erro
 * - Use as funções aqui para exibir mensagens de erro, como quando o usuário digita algo inválido ou quando acontece um erro inesperado. As mensagens são formatadas automaticamente conforme as configurações, então use a função "escrita.verificar" para formatar as mensagens antes de exibi-las.
 */
erro = {
    /**
     * Exibe um erro de intervalo
     * @param {number} min Mínimo
     * @param {number} max Máximo
     */
    intervalo(min = 0, max = 1) {
        ui.erro("ERRO-001: Escolha um valor entre " + String(min + (min == 0 ? 1 : 0)) + " e " + String(max) + (min == 0 ? " ou selecione 0 para voltar / sair" : ""), "Tu escolheste algo fora do intervalo.")
    },

    /**
     * Exibe um erro de divisão por zero
     * @param {string} moitvo Motivo
     */
    divZero(moitvo = "") {
        ui.erro("ERRO-002: Divisão por zero", (moitvo != "" ? "Motivo: " + moitvo : "Tu tentaste dividir um número por zero, o que não é possível."))
    },

    /**
     * Exibe um erro de limite estourado
     */
    limiteEstourado() {
        ui.erro("ERRO-003: Ultrapassou o limite", "A quantidade de interações passou do limite.")
    },

    /**
     * Exibe um erro de função que vira constante
     * @param {string} tipo Tipo
     */
    funcaoConstante(tipo = "") {
        ui.erro("ERRO-004: A função não é " + tipo + "; ela é constante", "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    /**
     * Exibe um erro de função inválida
     * @param {string} tipo Tipo
     */
    funcaoInvalida(tipo = "") {
        ui.erro("ERRO-005: A função não é " + tipo, "a < 0")
    },

    /**
     * Exibe um erro de logaritmo inválido
     * @param {string} tipo Tipo
     * @param {string} motivo Motivo
     */
    logInvalido(tipo = "log", motivo = "") {
        ui.erro("ERRO-006: " + tipo + " inválido", (motivo != "" ? "Motivo: " + motivo : "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível."))
    }
},

/**
 * Objeto base para as funções envolvendo algebra
 * - Use as funções aqui para fazer cálculos, pedir variáveis, pontos e outras coisas relacionadas à álgebra. As funções de escrita são usadas para exibir os resultados, então as mensagens são formatadas automaticamente conforme as configurações.
 */
algebra = {
    /**
     * Arredonda um número
     * @param {number} numero Número
     * @param {number} casas Casas decimais
     * @returns Número arredondado
     */
    arredonda(numero = 0, casas = config.casasDecimais) {
        numero = escrita.decimal(numero, true)

        if (isFinite(numero)) {
            numero = Math.round(numero * 10 ** casas) / 10 ** casas
            if (numero == "-0") {
                numero = 0
            }
        }

        return (numero)
    },

    /**
     * Pede uma variável
     * @param {string} nome Nome da variável
     * @returns Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     */
    variaveis(nome = "x") {
        let valor = ui.entrada(nome + " = ", "Digite “" + nome + "” caso queira que “" + nome + "” seja uma incógnita.")

        if (isFinite(escrita.decimal(valor, true))) {
            return (algebra.arredonda(valor))
        }

        return (nome)
    },

    /**
     * Pede um(ns) ponto(s)
     * @param {number} tipo Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     */
    ponto(tipo = 1) {
        let array = [], x1 = 0, x2 = 0, x3 = 0, y1 = 0, y2 = 0, y3 = 0

        // Pergunta
        x1 = ui.entrada("x₁ = ", "", true)
        y1 = ui.entrada("y₁ = ", "", true)
        array.push(x1, y1)

        if ((tipo == 2) || (tipo == 3)) {
            x2 = ui.entrada("x₂ = ", "", true)
            y2 = ui.entrada("y₂ = ", "", true)
            array.push(x2, y2)

            if (tipo == 3) {
                x3 = ui.entrada("x₃ = ", "", true)
                y3 = ui.entrada("y₃ = ", "", true)
                array.push(x3, y3)
            }
        }

        return (array)
    },

    /**
     * Vê se as funções têm pontos de encontro
     * @param {number[]} func1 Primeira função [a, b, c]
     * @param {number[]} func2 Segunda função [a, b, c]
     */
    equacoes(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        let coefA = func1[0] - func2[0], coefB = func1[1] - func2[1], coefC = func1[2] - func2[2], x = 0

        // Constante
        if ((coefA == 0) && (coefB == 0)) {
            if (coefC == 0) {
                ui.exibir("As funções coincidem: ƒ₁(x) = ƒ₂(x), ∀ x ∈ ℝ", "Porque as funções são iguais, em todos os pontos, elas se encontram.")
            } else if (coefC != 0) {
                ui.exibir("As funções nunca se encontrarão: ƒ₁(x) ≠ ƒ₂(x), ∀ x ∈ ℝ", "Porque as funções são diferentes, não há ponto em que elas se encontrarão.")
            }
        }

        // Afim
        else if ((coefA == 0) && (coefB != 0)) {
            x = algebra.divisao(-coefC, coefB)
            ui.exibir("As funções se encontram em: x = " + escrita.decimal(x), "x = −c / b")
        }

        // Quadrática
        else if ((coefA != 0)) {
            let delta = ajudas.calcDelta(coefA, coefB, coefC)
            ajudas.exibDelta(delta[0], "As funções não possuem pontos de interseção reais", "As funções se encontram em: x = " + escrita.decimal(delta[1]), "As funções se encontram em: x₁ = " + escrita.decimal(delta[1]) + ", x₂ = " + escrita.decimal(delta[2]))
        }
    },

    /**
     * Descobre quais são as incógnitas
     * @param {string | number} coefA Coeficiente a
     * @param {string | number} coefB Coeficiente b
     * @param {string | number} coefC Coeficiente c
     * @param {boolean} funcExp Se é exponencial
     * @param {boolean} funcLog Se é logarítmica
     * @returns Retorna os coeficientes em formato de array numérico [a, b, c]
     */
    incognita(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        let voltar = false, pontoConst = [0], pontoAfim = [0], pontoQuad = [0], pontoExp = [0], pontoLog = [0], denominador = 0, delta1 = 0, delta2 = 0, term1 = 0, term2 = 0, term3 = 0, term4 = 0

        if ((funcExp) || (funcLog)) {
            // Valida
            if ((coefA == 0) || (coefA == 1) || (coefB == 0)) {
                if ((!isFinite(coefA))) {
                    coefA = 0
                }
                if ((!isFinite(coefB))) {
                    coefB = 0
                }
                if ((!isFinite(coefC))) {
                    coefC = 0
                }

                return ([(coefA), (coefB), (coefC)])
            }
        }

        // Mostra
        ui.funcao(coefA, coefB, coefC, funcExp, funcLog)

        // Loop
        let limite = 0
        do {
            voltar = false

            // Polinomial
            if ((!funcExp) && (!funcLog)) {
                // Constante
                if ((coefA == 0) && (coefB == 0)) {
                    pontoConst = algebra.ponto()

                    coefC = pontoConst[1]
                }

                // Afim
                else if ((coefA == 0) && (coefB != 0)) {
                    // Únicas
                    if (((coefB == "b") && (coefC != "c")) || ((coefC == "c") && (coefB != "b"))) {
                        pontoAfim = algebra.ponto()

                        if (coefC == "c") {
                            coefC = pontoAfim[1] - (coefB * pontoAfim[0])
                        } else if (coefB == "b") {
                            if (pontoAfim[0] != 0) {
                                coefB = algebra.divisao((pontoAfim[1] - coefC), pontoAfim[0])
                            } else {
                                erro.divZero("x ≠ 0")
                                voltar = true
                            }
                        }
                    }

                    // Duplas
                    else if (((coefB == "b") && (coefC == "c"))) {
                        pontoAfim = algebra.ponto(2)

                        if ((pontoAfim[0] != pontoAfim[2]) && ((pontoAfim[0] != 0) || (pontoAfim[2] != 0))) {
                            coefB = algebra.divisao((pontoAfim[3] - pontoAfim[1]), (pontoAfim[2] - pontoAfim[0]))
                            coefC = pontoAfim[1] - (coefB * pontoAfim[0])
                        } else {
                            erro.divZero("x ≠ 0 e x₁ ≠ x₂")
                            voltar = true
                        }
                    }
                }

                // Quadrática
                else if (coefA != 0) {
                    // Únicas

                    // a
                    if ((coefA == "a") && ((coefB != "b") && (coefC != "c"))) {
                        pontoQuad = algebra.ponto()

                        if (pontoQuad[0] != 0) {
                            coefA = algebra.divisao((pontoQuad[1] - (coefB * pontoQuad[0]) - coefC), (pontoQuad[0] * pontoQuad[0]))
                        } else {
                            erro.divZero("x ≠ 0")
                            voltar = true
                        }
                    }

                    // b
                    else if ((coefB == "b") && ((coefA != "a") && (coefC != "c"))) {
                        pontoQuad = algebra.ponto()

                        if (pontoQuad[0] != 0) {
                            coefB = algebra.divisao((pontoQuad[1] - (coefA * (pontoQuad[0] * pontoQuad[0])) - coefC), (pontoQuad[0]))
                        } else {
                            erro.divZero("x ≠ 0")
                            voltar = true
                        }
                    }

                    // c
                    else if ((coefC == "c") && ((coefB != "b") && (coefA != "a"))) {
                        pontoQuad = algebra.ponto()

                        coefC = pontoQuad[1] - (coefA * (pontoQuad[0] * pontoQuad[0])) - (coefB * pontoQuad[0])
                    }

                    // Duplas

                    // a, b
                    else if ((coefA == "a") && (coefB == "b") && (coefC != "c")) {
                        pontoQuad = algebra.ponto(2)

                        if ((pontoQuad[0] != 0) && (pontoQuad[0] != pontoQuad[2])) {
                            denominador = pontoQuad[0] * pontoQuad[2] * (pontoQuad[0] - pontoQuad[2])
                            coefA = algebra.divisao(((pontoQuad[1] - coefC) * pontoQuad[2] - (pontoQuad[3] - coefC) * pontoQuad[0]), denominador)
                            coefB = algebra.divisao(((pontoQuad[3] - coefC) * pontoQuad[0] * pontoQuad[0] - (pontoQuad[1] - coefC) * pontoQuad[2] * pontoQuad[2]), denominador)
                        } else {
                            erro.divZero("x ≠ 0 e x₁ ≠ x₂")
                            voltar = true
                        }
                    }

                    // a, c
                    else if ((coefA == "a") && (coefB != "b") && (coefC == "c")) {
                        pontoQuad = algebra.ponto(2)

                        denominador = (pontoQuad[0] * pontoQuad[0]) - (pontoQuad[2] * pontoQuad[2])
                        if (denominador != 0) {
                            coefA = algebra.divisao(((pontoQuad[1] - coefB * pontoQuad[0]) - (pontoQuad[3] - coefB * pontoQuad[2])), denominador)
                            coefC = pontoQuad[1] - (coefA * (pontoQuad[0] * pontoQuad[0])) - (coefB * pontoQuad[0])
                        } else {
                            erro.divZero("x₁ ≠ x₂")
                            voltar = true
                        }
                    }

                    // b, c
                    else if ((coefA != "a") && (coefB == "b") && (coefC == "c")) {
                        pontoQuad = algebra.ponto(2)

                        if ((pontoQuad[0] != pontoQuad[2])) {
                            coefB = algebra.divisao(((pontoQuad[3] - (coefA * pontoQuad[2] * pontoQuad[2])) - (pontoQuad[1] - (coefA * pontoQuad[0] * pontoQuad[0]))), (pontoQuad[2] - pontoQuad[0]))
                            coefC = pontoQuad[1] - (coefA * (pontoQuad[0] * pontoQuad[0])) - (coefB * pontoQuad[0])
                        } else {
                            erro.divZero("x₁ ≠ x₂")
                            voltar = true
                        }
                    }

                    // Triplas
                    else if ((coefA == "a") && (coefB == "b") && (coefC == "c")) {
                        pontoQuad = algebra.ponto(3)

                        delta1 = pontoQuad[3] - pontoQuad[1]
                        delta2 = pontoQuad[5] - pontoQuad[1]
                        term1 = (pontoQuad[2] * pontoQuad[2]) - (pontoQuad[0] * pontoQuad[0])
                        term2 = pontoQuad[2] - pontoQuad[0]
                        term3 = (pontoQuad[4] * pontoQuad[4]) - (pontoQuad[0] * pontoQuad[0])
                        term4 = pontoQuad[4] - pontoQuad[0]
                        denominador = (term1 * term4) - (term2 * term3)

                        if (denominador != 0) {
                            coefA = algebra.divisao(((delta1 * term4) - (term2 * delta2)), denominador)
                            coefB = algebra.divisao(((term1 * delta2) - (delta1 * term3)), denominador)
                            coefC = pontoQuad[1] - (coefA * (pontoQuad[0] * pontoQuad[0])) - (coefB * pontoQuad[0])
                        } else {
                            erro.divZero("x₁ ≠ x₂")
                            voltar = true
                        }
                    }
                }
            }

            // Exponencial
            else if (funcExp) {
                // Únicas

                // a
                if ((coefA == "a") && ((coefB != "b") && (coefC != "c"))) {
                    pontoExp = algebra.ponto()

                    coefA = algebra.arredonda(algebra.divisao((pontoExp[1] - coefC), coefB, false) ** (algebra.divisao(1, pontoExp[0], false)))
                }

                // b
                else if ((coefB == "b") && ((coefA != "a") && (coefC != "c"))) {
                    pontoExp = algebra.ponto()

                    coefB = algebra.divisao((pontoExp[1] - coefC), (coefA ** pontoExp[0]))
                }

                // c
                else if ((coefC == "c") && ((coefB != "b") && (coefA != "a"))) {
                    pontoExp = algebra.ponto()

                    coefC = pontoExp[1] - (coefB * (coefA ** pontoExp[0]))
                }

                // Duplas

                // a, b
                else if ((coefA == "a") && (coefB == "b") && (coefC != "c")) {
                    pontoExp = algebra.ponto(2)

                    coefA = algebra.arredonda(algebra.divisao((pontoExp[1] - coefC), (pontoExp[3] - coefC), false) ** (algebra.divisao(1, (pontoExp[0] - pontoExp[2]), false)))
                    coefB = algebra.divisao((pontoExp[1] - coefC), (coefA ** pontoExp[0]))
                }

                // a, c
                else if ((coefA == "a") && (coefB != "b") && (coefC == "c")) {
                    // pontoExp = algebra.ponto(2)

                    ui.aviso("Não posso ainda descobrir o valor de a e c quando tenho somente o b", "Em construção.")
                    coefA = -1
                    coefC = 0
                }

                // b, c
                else if ((coefA != "a") && (coefB == "b") && (coefC == "c")) {
                    pontoExp = algebra.ponto(2)

                    coefB = algebra.divisao((pontoExp[3] - pontoExp[1]), ((coefA ** pontoExp[2]) - (coefA ** pontoExp[0])))
                    coefC = pontoExp[1] - (coefB * (coefA ** pontoExp[0]))
                }

                // Triplas
                else if ((coefA == "a") && (coefB == "b") && (coefC == "c")) {
                    // pontoExp = algebra.ponto(3)

                    ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Logarítmica
            else if (funcLog) {
                // Únicas

                // a
                if ((coefA == "a") && (coefB != "b") && (coefC != "c")) {
                    pontoLog = algebra.ponto()

                    coefA = algebra.arredonda(pontoLog[0] ** (algebra.divisao(coefB, (pontoLog[1] - coefC), false)))
                }

                // b
                else if ((coefA != "a") && (coefB == "b") && (coefC != "c")) {
                    pontoLog = algebra.ponto()

                    coefB = algebra.divisao((pontoLog[1] - coefC), algebra.log(pontoLog[0], coefA))
                }

                // c
                else if ((coefA != "a") && (coefB != "b") && (coefC == "c")) {
                    pontoLog = algebra.ponto()

                    coefC = pontoLog[1] - algebra.arredonda((coefB * algebra.log(pontoLog[0], coefA)))
                }

                // Duplas

                // a, b
                else if ((coefA == "a") && (coefB == "b") && (coefC != "c")) {
                    // pontoLog = algebra.ponto(2)

                    ui.aviso("Não posso ainda descobrir o valor de a e b quando tenho somente o c", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }

                // a, c
                else if ((coefA == "a") && (coefB != "b") && (coefC == "c")) {
                    pontoLog = algebra.ponto(2)

                    coefA = algebra.arredonda(algebra.divisao(pontoLog[0], pontoLog[2], false) ** (algebra.divisao(coefB, (pontoLog[1] - pontoLog[3]), false)))
                    coefC = pontoLog[1] - (coefB * algebra.log(pontoLog[0], coefA))
                }

                // b, c
                else if ((coefA != "a") && (coefB == "b") && (coefC == "c")) {
                    pontoLog = algebra.ponto(2)

                    coefB = algebra.divisao((pontoLog[1] - pontoLog[3]), (algebra.log(pontoLog[0], coefA) - algebra.log(pontoLog[2], coefA)))
                    coefC = pontoLog[1] - (coefB * algebra.log(pontoLog[0], coefA))
                }

                // Triplas
                else if ((coefA == "a") && (coefB == "b") && (coefC == "c")) {
                    // pontoLog = algebra.ponto(3)

                    ui.aviso("Não posso ainda descobrir o valor de a, b e c tendo somente pontos", "Em construção.")
                    coefA = -1
                    coefB = 1
                    coefC = 0
                }
            }

            // Erro
            if ((!isFinite(coefA)) || (!isFinite(coefB)) || (!isFinite(coefC))) {
                erro.divZero("Valores inválidos.")
                if (ui.confirmar("Queres mudar os valores dos coeficientes?", "Se quiser alterar os valores dos pontos, escolha “Cancelar”")) {
                    coefA = "a"
                    coefB = "b"
                    coefC = "c"
                    editar = true
                    loop = true
                    voltar = false
                    tipo = 9
                } else {
                    if ((!isFinite(coefA))) {
                        coefA = "a"
                    }
                    if ((!isFinite(coefB))) {
                        coefB = "b"
                    }
                    if ((!isFinite(coefC))) {
                        coefC = "c"
                    }
                    voltar = true
                }
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                voltar = false
            }
        } while (voltar)

        return ([(coefA), (coefB), (coefC)])
    },

    /**
     * Log de x na base
     * @param {number} x Número
     * @param {number} base Base
     * @param {number} precisao Casas decimais
     * @returns Resultado
     */
    log(x = 0, base = Math.E, precisao = config.logPrecisao) {
        let y = (x > 1 ? 1 : -1), numero = 0, delta = 0, lnX = 0, lnBase = 0

        // Valida
        if ((x <= 0) || (base <= 0) || (base == 1)) {
            erro.logInvalido("log", "x > 0 e base > 0, base ≠ 1")
            return (NaN)
        }

        numero = algebra.ln(base)
        delta = algebra.divisao(((base ** y) - x), ((base ** y) * numero), false)

        // Mudança de base
        if (base < 1) {
            lnX = algebra.ln(x)
            lnBase = algebra.ln(base)
            if ((!isFinite(lnX)) || (!isFinite(lnBase)) || (lnBase == 0)) {
                return (NaN)
            }

            return (algebra.divisao(lnX, lnBase))
        }

        // Loop
        let limite = 0
        while ((Math.abs(delta) > precisao) && (limite < config.limiteInteracoes)) {
            delta = algebra.divisao(((base ** y) - x), ((base ** y) * numero), false)
            y -= delta

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                return (NaN)
            }
        }

        return (algebra.arredonda(y))
    },

    /**
     * Log de x na base E
     * @param {number} x Número
     * @param {number} precisao Casas decimais
     * @returns Resultado
     */
    ln(x = 0, precisao = config.logPrecisao) {
        let y = (x > 1 ? 1 : -1), base = Math.E, delta = algebra.divisao(((base ** y) - x), ((base ** y)), false)

        // Valida
        if ((x <= 0)) {
            erro.logInvalido("ln", "x > 0")
            return (NaN)
        }

        // Loop
        let limite = 0
        while ((Math.abs(delta) > precisao) && (limite < config.limiteInteracoes)) {
            delta = algebra.divisao(((base ** y) - x), ((base ** y)), false)
            y -= delta

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                return (NaN)
            }
        }

        return (algebra.arredonda(y))
    },

    /**
     * Divide dois números
     * @param {number} numerador Parte de cima da fração
     * @param {number} denominador Parte de baixo da fração
     * @param {boolean} arredondar Se irá arredondar
     * @param {number} precisao Precisão do arredondamento
     * @returns a/b
     */
    divisao(numerador = 0, denominador = 1, arredondar = true, precisao = config.divPrecisao) {
        let resultado = 0

        // Valida
        if ((denominador == 0) || (!isFinite(numerador)) || (!isFinite(denominador))) {
            return (NaN)
        }

        // Denominador pequeno
        if (Math.abs(denominador) <= precisao) {
            return (NaN)
        }

        resultado = numerador / denominador

        // Infinito
        if (!isFinite(resultado)) {
            return (NaN)
        }

        // Arredonda
        if (arredondar) {
            return (algebra.arredonda(resultado))
        }

        return (resultado)
    }
},

/**
 * Objeto base para as funções envolvendo funções matemáticas, seus estudos e características
 * - Use as funções aqui para montar as funções constantes, afins, quadráticas, exponenciais e logarítmicas. As funções de escrita são usadas para exibir os resultados, então as mensagens são formatadas automaticamente conforme as configurações.
 */
funcoes = {
    /**
     * Monta uma função constante: ƒ(x) = c
     * @param {number} coefC Coeficiente c da função constante
     * @returns Retorna: [coefC]
     */
    constante(coefC = globalC) {
        let opcao = 0, pagina = 1, opcoesConst = [0, ""]

        // Mostra
        ui.funcao(0, 0, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            opcoesConst = ui.menu(menuConst, pagina)
            opcao = opcoesConst[0]
            pagina = opcoesConst[1]

            // Página 1
            if (pagina == 1) {
                // Domínio
                if (opcao == 1) {
                    ajudas.dominio()
                }

                // Imagem
                else if (opcao == 2) {
                    ajudas.imagem("= " + escrita.decimal(coefC), ".", "A função só tem esse valor de y, pois y = c")
                }

                // Interseção com o eixo x
                else if (opcao == 3) {
                    ajudas.eixoX("0", coefC)
                }

                // Interseção com o eixo y
                else if (opcao == 4) {
                    ajudas.eixoY(coefC, "c", "c")
                }

                // Valores para x
                else if (opcao == 5) {
                    ajudas.valoresX(0, 0, coefC)
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Valores para y
                if (opcao == 1) {
                    ajudas.valoresY(0, 0, coefC)
                }

                // Estudo do sinal
                else if (opcao == 2) {
                    ajudas.sinal(0, 0, coefC)
                }

                // Equações
                else if (opcao == 3) {
                    opcao = ajudas.equacoes(true, 0, 0, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(0, 0, coefC, false, false, true)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefC])
    },

    /**
     * Monta uma função afim: ƒ(x) = bx + c
     * @param {number} coefB Coeficiente b da função afim
     * @param {number} coefC Coeficiente c da função afim
     * @returns Retorna: [coefB, coefC]
     */
    afim(coefB = globalB, coefC = globalC) {
        let opcao = 0, pagina = 1, opcoesAfim = [0, ""]

        // Mostra
        ui.funcao(0, coefB, coefC)

        // Cálculo
        let raizAfim = ajudas.calcRaiz(0, coefB, coefC)

        // Loop
        let limite = 0
        do {
            // Menu
            opcoesAfim = ui.menu(menuAfim, pagina)
            pagina = opcoesAfim[1]
            opcao = opcoesAfim[0]

            // Página 1
            if (pagina == 1) {
                // Inclinação
                if (opcao == 1) {
                    ajudas.curva(0, coefB)
                }

                // Raiz
                else if (opcao == 2) {
                    ajudas.exibRaiz(raizAfim, "(−c) / b")
                }

                // Domínio
                else if (opcao == 3) {
                    ajudas.dominio()
                }

                // Imagem
                else if (opcao == 4) {
                    ajudas.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    ajudas.eixoX(raizAfim, "(−c) / b")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    ajudas.eixoY(coefC, "bx + c", "c")
                }

                // Valores para x
                else if (opcao == 2) {
                    ajudas.valoresX(0, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 3) {
                    ajudas.valoresY(0, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    ajudas.sinal(0, coefB, coefC)
                }

                // Equações
                else if (opcao == 5) {
                    opcao = ajudas.equacoes(true, 0, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(0, coefB, coefC, false, false, true)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefB, coefC])
    },

    /**
     * Monta uma função quadrática: ƒ(x) = ax² + bx + c
     * @param {number} coefA Coeficiente a da função quadrática
     * @param {number} coefB Coeficiente b da função quadrática
     * @param {number} coefC Coeficiente c da função quadrática
     * @returns Retorna: [coefA, coefB, coefC]
     */
    quadratica(coefA = globalA, coefB = globalB, coefC = globalC) {
        let opcao = 0, pagina = 1, opcoesQuad = [0, ""]

        // Mostra
        ui.funcao(coefA, coefB, coefC)

        // Cálculo
        let delta = ajudas.calcDelta(coefA, coefB, coefC), vertice = ajudas.vertice(coefA, coefB, delta[0])

        // Loop
        let limite = 0
        do {
            // Menu
            opcoesQuad = ui.menu(menuQuad, pagina)
            opcao = opcoesQuad[0]
            pagina = opcoesQuad[1]

            // Página 1
            if (pagina == 1) {
                // Concavidade
                if (opcao == 1) {
                    ajudas.curva(coefA)
                }

                // Raízes
                else if (opcao == 2) {
                    ajudas.exibDelta(delta[0], "Não há raízes reais.", "Raiz real: x₁ = x₂ = " + escrita.decimal(delta[1]), "Raízes reais: x₁ = " + escrita.decimal(delta[1]) + ", x₂ = " + escrita.decimal(delta[2]))
                }

                // Vértice
                else if (opcao == 3) {
                    ui.exibir("Vértice: (" + escrita.decimal(vertice[0]) + ", " + escrita.decimal(vertice[1]) + ")", "Ponto mais baixo (ou mais alto, conforme a concavidade) da função. Ponto (-b / (2 · a), -Δ / (4 · a))")
                }

                // Domínio
                else if (opcao == 4) {
                    ajudas.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefA > 0) {
                        ajudas.imagem("∈ [" + escrita.decimal(vertice[1]) + ", ∞)", " entre o vértice e o ∞.")
                    } else if (coefA < 0) {
                        ajudas.imagem("∈ (-∞, " + escrita.decimal(vertice[1]) + "]", " entre -∞ e o vértice.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    ajudas.exibDelta(delta[0], "Não há interseção com o eixo x.", "Interseção com o eixo x: (" + escrita.decimal(delta[1]) + ", 0)", "Interseções com o eixo x: (" + escrita.decimal(delta[1]) + ", 0) e (" + escrita.decimal(delta[2]) + ", 0)")
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    ajudas.eixoY(coefC, "ax² + bx + c", "c")
                }

                // Valores para x
                else if (opcao == 3) {
                    ajudas.valoresX(coefA, coefB, coefC)
                }

                // Valores para y
                else if (opcao == 4) {
                    ajudas.valoresY(coefA, coefB, coefC)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    ajudas.sinal(coefA, coefB, coefC)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    opcao = ajudas.equacoes(true, coefA, coefB, coefC)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, false, false, true)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    },

    /**
     * Monta uma função exponencial: ƒ(x) = b × aˣ + c
     * @param {number} coefA Coeficiente a da função exponencial
     * @param {number} coefB Coeficiente b da função exponencial
     * @param {number} coefC Coeficiente c da função exponencial
     * @returns Retorna: [coefA, coefB, coefC]
     */
    exponencial(coefA = globalA, coefB = globalB, coefC = globalC) {
        let opcao = 0, pagina = 1, opcoesExp = [], expoente = algebra.divisao(-coefC, coefB, false)

        // Mostra
        ui.funcao(coefA, coefB, coefC, true)

        // Cálculo
        let raizExp = ajudas.calcRaiz(coefA, coefB, coefC, true)

        // Loop
        let limite = 0
        do {
            // Menu
            opcoesExp = ui.menu(menuExp, pagina)
            opcao = opcoesExp[0]
            pagina = opcoesExp[1]

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    ajudas.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    ajudas.exibRaiz(raizExp, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Assíntota
                else if (opcao == 3) {
                    ui.exibir("Assíntota horizontal: y = " + escrita.decimal(coefC), "y = c")
                }

                // Domínio
                else if (opcao == 4) {
                    ajudas.dominio()
                }

                // Imagem
                else if (opcao == 5) {
                    if (coefB > 0) {
                        ajudas.imagem("∈ (" + escrita.decimal(coefC) + ", ∞)", " entre c e ∞, exceto o próprio c.")
                    } else {
                        ajudas.imagem("∈ (-∞, " + escrita.decimal(coefC) + ")", " entre -∞ e c, exceto o próprio c.")
                    }
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo x
                if (opcao == 1) {
                    ajudas.eixoX(raizExp, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0")
                }

                // Interseção com o eixo y
                else if (opcao == 2) {
                    ajudas.eixoY(coefB + coefC, "b × aˣ + c", "b + c")
                }

                // Valores para x
                else if (opcao == 3) {
                    ajudas.valoresX(coefA, coefB, coefC, true)
                }

                // Valores para y
                else if (opcao == 4) {
                    ajudas.valoresY(coefA, coefB, coefC, true)
                }

                // Estudo do sinal
                else if (opcao == 5) {
                    ajudas.sinal(coefA, coefB, coefC, true)
                }
            }

            // Página 3
            else if (pagina == 3) {
                // Equações
                if (opcao == 1) {
                    ajudas.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, true, false, true)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    },

    /**
     * Monta a função logarítmica: b × logₐ(x) + c
     * @param {number} coefA Coeficiente a da função logarítmica
     * @param {number} coefB Coeficiente b da função logarítmica
     * @param {number} coefC Coeficiente c da função logarítmica
     * @returns Retorna: [coefA, coefB, coefC]
     */
    logaritmica(coefA = globalA, coefB = globalB, coefC = globalC) {
        let opcao = 0, pagina = 1, opcoesLog = [], expoente = algebra.divisao(-coefC, coefB, false)

        // Mostra
        ui.funcao(coefA, coefB, coefC, false, true)

        // Cálculo
        let raizLog = algebra.arredonda(coefA ** (expoente))

        // Loop
        let limite = 0
        do {
            // Menu
            opcoesLog = ui.menu(menuLog, pagina)
            opcao = opcoesLog[0]
            pagina = opcoesLog[1]

            // Página 1
            if (pagina == 1) {
                // Curva
                if (opcao == 1) {
                    ajudas.curva(coefA, coefB, false)
                }

                // Raiz
                else if (opcao == 2) {
                    ajudas.exibRaiz(raizLog, "a⁽⁻ᶜ⁄ᵇ⁾")
                }

                // Domínio
                else if (opcao == 3) {
                    ajudas.dominio("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Imagem
                else if (opcao == 4) {
                    ajudas.imagem()
                }

                // Interseção com o eixo x
                else if (opcao == 5) {
                    ajudas.eixoX(raizLog, "a⁽⁻ᶜ⁄ᵇ⁾")
                }
            }

            // Página 2
            else if (pagina == 2) {
                // Interseção com o eixo y
                if (opcao == 1) {
                    ajudas.eixoY("∄", "b × logₐ(x) + c", " x = 0 ⇒ logₐ(x) ∉ ℝ")
                }

                // Valores para x
                else if (opcao == 2) {
                    ajudas.valoresX(coefA, coefB, coefC, false, true)
                }

                // Valores para y
                else if (opcao == 3) {
                    ajudas.valoresY(coefA, coefB, coefC, false, true)
                }

                // Estudo do sinal
                else if (opcao == 4) {
                    ajudas.sinal(coefA, coefB, coefC, false, true)
                }

                // Equações
                else if (opcao == 5) {
                    ajudas.equacoes(false)
                }
            }

            // Rever
            if (opcao == 6) {
                ui.funcao(coefA, coefB, coefC, false, true, true)
            }

            // Limite
            if (ajudas.estourouLimite(++limite)) {
                opcao = 0
            }
        } while (opcao != 0)

        return ([coefA, coefB, coefC])
    }
}

// Boolean
let manter = false, loop = false, editar = false, loop2 = false

// String
let globalA = algebra.variaveis("a"), globalB = algebra.variaveis("b"), globalC = algebra.variaveis("c")

// Number
let tipo = 0, subtipo = 0, escolha = 0, pagina = 1, total = 1, opcao = 1

// Array
let menuBasico = ["Domínio", "Imagem", "Interseção com o eixo x", "Interseção com o eixo y", "Valores para x", "Valores para y", "Estudo do sinal", "Equações entre funções"],
menuConst = [].concat(menuBasico),
menuAfim = ["Inclinação", "Raiz"].concat(menuBasico),
menuQuad = ["Concavidade", "Raízes", "Vértice"].concat(menuBasico),
menuExp = ["Curva", "Raiz", "Assíntota"].concat(menuBasico),
menuLog = ["Curva", "Raiz"].concat(menuBasico),
funcaoBase = [], coeficientes = [], funcaoAtual = [globalA, globalB, globalC], historico = [funcaoAtual.slice()]

// Código principal
do {
    // Variáveis globais
    if (editar) {
        globalA = algebra.variaveis("a")
        globalB = algebra.variaveis("b")
        globalC = algebra.variaveis("c")
    }

    // Salva histórico
    if ((globalA != funcaoAtual[0]) || (globalB != funcaoAtual[1]) || (globalC != funcaoAtual[2])) {
        funcaoAtual = [globalA, globalB, globalC], historico.push(funcaoAtual.slice())
        if (historico.length > 9) {
            historico.shift()
        }
    }

    // Tipo de função
    if (!manter) {
        tipo = ui.entrada("=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair", "", true, 0)
    }

    manter = false
    editar = false
    loop = false

    if (((0 <= tipo) && (tipo <= 2)) || ((6 <= tipo) && (tipo <= 9))) {
        // Polinomiais
        if (tipo == 1) {
            // Incógnitas
            if ((!isFinite(globalA)) || (!isFinite(globalB)) || (!isFinite(globalC))) {
                coeficientes = algebra.incognita(globalA, globalB, globalC)
                globalA = algebra.arredonda(coeficientes[0])
                globalB = algebra.arredonda(coeficientes[1])
                globalC = algebra.arredonda(coeficientes[2])
            }

            // Números
            if ((isFinite(globalA)) && (isFinite(globalB)) && (isFinite(globalC))) {
                if ((globalA == 0) && (globalB == 0)) {
                    funcoes.constante(globalC)
                } else if ((globalA == 0) && (globalB != 0)) {
                    funcoes.afim(globalB, globalC)
                } else if (globalA != 0) {
                    funcoes.quadratica(globalA, globalB, globalC)
                }
            }
        }

        // Não polinomial
        else if (tipo == 2) {
            // Loop do menu
            do {
                subtipo = ui.entrada("=== Menu ===\nO que queres?\n1 = Função exponencial\n2 = Função logarítmica\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar", "", true, 0)

                loop2 = false

                if (((0 <= subtipo) && (subtipo <= 2)) || ((6 <= subtipo) && (subtipo <= 9))) {
                    // Exponencial
                    if (subtipo == 1) {
                        // Incógnitas
                        if ((globalA == "a") || (globalB == "b") || (globalC == "c")) {
                            coeficientes = algebra.incognita(globalA, globalB, globalC, true)
                            globalA = algebra.arredonda(coeficientes[0])
                            globalB = algebra.arredonda(coeficientes[1])
                            globalC = algebra.arredonda(coeficientes[2])
                        }

                        // Números
                        if ((globalA != "a") && (globalB != "b") && (globalC != "c")) {
                            if (((globalA > 0) && (globalA != 1)) && (globalB != 0)) {
                                funcoes.exponencial(globalA, globalB, globalC)
                            }

                            // Constante
                            else if ((globalA == 0) || (globalA == 1) || (globalB == 0)) {
                                erro.funcaoConstante("exponencial")

                                if (globalA == 1) {
                                    globalC += globalB
                                }
                                globalA = 0
                                globalB = 0
                                tipo = 1
                                manter = true
                                loop = true
                            }

                            // Erro de base
                            else if (globalA < 0) {
                                erro.funcaoInvalida("exponencial")

                                editar = true
                                loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subtipo == 2) {
                        // Incógnitas
                        if ((globalA == "a") || (globalB == "b") || (globalC == "c")) {
                            coeficientes = algebra.incognita(globalA, globalB, globalC, false, true)
                            globalA = algebra.arredonda(coeficientes[0])
                            globalB = algebra.arredonda(coeficientes[1])
                            globalC = algebra.arredonda(coeficientes[2])
                        }

                        // Números
                        if ((globalA != "a") && (globalB != "b") && (globalC != "c")) {
                            if (((globalA > 0) && (globalA != 1)) && (globalB != 0)) {
                                funcoes.logaritmica(globalA, globalB, globalC)
                            }

                            // Constante
                            else if ((globalA == 0) || (globalA == 1) || (globalB == 0)) {
                                erro.funcaoConstante("logarítmica")
                                if (globalA == 1) {
                                    globalC += globalB
                                }
                                globalA = 0
                                globalB = 0
                                tipo = 1
                                manter = true
                                loop = true
                            }

                            // Erro de base
                            else if (globalA < 0) {
                                erro.funcaoInvalida("logarítmica")
                                editar = true
                                loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subtipo) && (subtipo <= 9)) {
                        tipo = subtipo
                        loop = true
                        manter = true
                    }

                    // Voltar
                    else if (subtipo == 0) {
                        loop = true
                    }
                }

                // Erro
                else {
                    erro.intervalo(0, 9)
                    loop2 = true
                }
            } while (loop2)
        }

        // Antigas
        else if (tipo == 6) {
            loop = true

            // Erro de histórico
            if (historico.length == 1) {
                ui.exibir("Não há histórico o suficiente para mudanças.", "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função.")
            } else {
                let mensagem = "=== Histórico ===\nO que queres?\n", resposta = 0, opcao = 1

                // Mostra histórico
                for (let func = historico.length - 1; func >= 0; func--) {
                    mensagem += String(opcao) + " ⇒ a = " + escrita.decimal(historico[func][0]) + "; b = " + escrita.decimal(historico[func][1]) + "; c = " + escrita.decimal(historico[func][2]) + "\n"
                    opcao++
                }

                do {
                    // Escolha
                    resposta = ui.entrada(mensagem, "", true, 0) - 1

                    // Erro
                    if (!((0 <= resposta) && (resposta < historico.length))) {
                        erro.intervalo(1, historico.length)
                    } else {
                        // Restaura função
                        let indice = historico.length - 1 - resposta
                        globalA = historico[indice][0], globalB = historico[indice][1], globalC = historico[indice][2]
                        if ((globalA != funcaoAtual[0]) || (globalB != funcaoAtual[1]) || (globalC != funcaoAtual[2])) {
                            funcaoAtual = [globalA, globalB, globalC]
                        }
                    }
                } while (!((0 <= resposta) && (resposta < historico.length)))
            }
        }

        // Configurações
        else if (tipo == 7) {
            pagina = 1
            // Loop
            do {
                loop = true

                // Menu de configurações
                let menuConfig = [
                    escrita.itemConfig("Caracteres Unicode", "unicode"),
                    escrita.itemConfig("Explicações", "explicacoes"),
                    escrita.itemConfig("Acentos", "acentos"),
                    escrita.itemConfig("Capitalizadas", "capitalizadas"),
                    escrita.itemConfig("Maiúsculas", "maiusculas"),
                    escrita.itemConfig("Minúsculas", "minusculas"),

                    escrita.itemConfig("Ponto decimal", "separadorDecimal"),
                    escrita.itemConfig("Multiplicação simples", "multiSimples"),
                    escrita.itemConfig("Confirmações de entrada", "confirmacoesEntrada"),
                    escrita.itemConfig("Confirmações de saída", "confirmacoesSaida"),
                    escrita.itemConfig("Mensagens de erro", "erros"),
                    escrita.itemConfig("Mostrar função", "mostrarFuncao"),

                    escrita.itemConfig("Casas decimais", "casasDecimais"),
                    escrita.itemConfig("Precisão do log", "logPrecisao"),
                    escrita.itemConfig("Precisão da divisão", "divPrecisao"),
                    escrita.itemConfig("Limite de interações", "limiteInteracoes"),
                    escrita.itemConfig("Linguagem", "linguagem")
                ]

                // Preenche com separadores
                while (((menuConfig.length % 6) != 0) || (menuConfig.length == 0)) {
                    menuConfig.push("---")
                }
                total = Math.ceil(menuConfig.length / 6)

                // Controla página
                if (pagina < 1) {
                    pagina = 1
                } else if (pagina > total) {
                    pagina = total
                }

                // Mostra opções
                let texto = "=== Configurações ===\nPágina " + String(pagina) + "/" + String(total) + "\nObs.: Configurações não são salvas ao fechar"
                while (opcao <= 6) {
                    texto += "\n" + String(opcao) + " = " + String(menuConfig[(opcao - 1) + (6 * (pagina - 1))])
                    opcao++
                }
                opcao = 1
                texto += "\n----------------\n7 = Restaurar padrão | 8 = Anterior | 9 = Próxima | 0 = Voltar"

                // Escolha
                escolha = ui.intervalo(texto, "", 0, 9)
                if (!((0 <= escolha) && (escolha <= 9))) { // Erro
                    erro.intervalo(0, 9)
                } else if (escolha == 7) { // Padrão
                    if (JSON.stringify(config) == JSON.stringify(padraoConfig)) {
                        ui.aviso("Todas as configurações já estão na forma padrão.", "Não há necessidade de restaurar.")
                    } else {
                        let mensagem = "Voltar às configurações padrão?\nConfigurações afetadas:\n", arrayConfig = Object.keys(config)

                        // Mostra configurações afetadas
                        for (let i = 0; i < arrayConfig.length; i++) {
                            mensagem += (config[arrayConfig[i]] != padraoConfig[arrayConfig[i]]) ? arrayConfig[i] + ", " : ""
                        }

                        // Remove última vírgula e espaço
                        mensagem = mensagem.slice(0, -2)

                        // Confirmação
                        if (ui.aviso(mensagem, "Obs.₁: Isso irá afetar todas as configurações acima\nObs.₂: Essa alteração é permanente", true)) {
                            config = JSON.parse(JSON.stringify(padraoConfig))
                        }
                    }
                } else if (escolha == 8) { // -1
                    escolha = -1
                    pagina -= 1
                } else if (escolha == 9) { // +1
                    escolha = -1
                    pagina += 1
                }

                // Página 1
                if (pagina == 1) {
                    // Unicode
                    if (escolha == 1) {
                        config.unicode = ui.confirmar(escrita.itemConfig("Ativar caracteres Unicode?", "unicode"), "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações")
                    }

                    // Explicações
                    else if (escolha == 2) {
                        config.explicacoes = ui.confirmar(escrita.itemConfig("Ativar explicações?", "explicacoes"), "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c")
                    }

                    // Acentos
                    else if (escolha == 3) {
                        config.acentos = ui.confirmar(escrita.itemConfig("Ativar acentos?", "acentos"), "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação")
                    }

                    // Capitalizadas
                    else if (escolha == 4) {
                        config.capitalizadas = ui.confirmar(escrita.itemConfig("Ativar letras capitalizadas?", "capitalizadas"), "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas\nObs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”")
                        if (config.capitalizadas) {
                            config.minusculas = false
                            config.maiusculas = false
                        } else if ((!config.maiusculas) && (!config.minusculas)) {
                            config.capitalizadas = true
                        }
                    }

                    // Maiúsculas
                    else if (escolha == 5) {
                        config.maiusculas = ui.confirmar(escrita.itemConfig("Ativar todas as letras maiúsculas?", "maiusculas"), "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”")
                        if (config.maiusculas) {
                            config.capitalizadas = false
                            config.minusculas = false
                        } else if ((!config.minusculas) && (!config.capitalizadas)) {
                            config.capitalizadas = true
                        }
                    }

                    // Minúsculas
                    else if (escolha == 6) {
                        config.minusculas = ui.confirmar(escrita.itemConfig("Ativar todas as letras minúsculas?", "minusculas"), "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”")
                        if (config.minusculas) {
                            config.capitalizadas = false
                            config.maiusculas = false
                        } else if ((!config.maiusculas) && (!config.capitalizadas)) {
                            config.capitalizadas = true
                        }
                    }
                }

                // Página 2
                else if (pagina == 2) {
                    // Ponto decimal
                    if (escolha == 1) {
                        config.separadorDecimal = ui.confirmar(escrita.itemConfig("Alterar ponto decimal?", "separadorDecimal"), "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: " + escrita.decimal(123.456) + "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”")
                    }

                    // Multiplicação simples
                    else if (escolha == 2) {
                        config.multiSimples = ui.confirmar(escrita.itemConfig("Alterar para multiplicação simples?", "multiSimples"), "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em “*”\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”")
                    }

                    // Confirmações de entrada
                    else if (escolha == 3) {
                        config.confirmacoesEntrada = ui.confirmar(escrita.itemConfig("Ativar confirmações de entrada?", "confirmacoesEntrada"), "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada")
                    }

                    // Confirmações de saída
                    else if (escolha == 4) {
                        config.confirmacoesSaida = ui.confirmar(escrita.itemConfig("Ativar confirmações de saída?", "confirmacoesSaida"), "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa")
                    }

                    // Erros
                    else if (escolha == 5) {
                        config.erros = ui.confirmar(escrita.itemConfig("Ativar mensagens de erro?", "erros"), "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo")
                    }

                    // Função
                    else if (escolha == 6) {
                        config.mostrarFuncao = ui.confirmar(escrita.itemConfig("Ativar exibição da função?", "mostrarFuncao"), "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)")
                    }
                }

                // Página 3
                else if (pagina == 3) {
                    // Casas decimais
                    if (escolha == 1) {
                        config.casasDecimais = ui.intervalo(escrita.itemConfig("Quantas casas decimais?", "casasDecimais"), "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas\nObs.₂: Os números já digitados serão arredondados para o novo número de casas decimais", 3, 10)

                        // Arredonda novamente
                        if (globalA != "a") {
                            globalA = algebra.arredonda(globalA)
                        }
                        if (globalB != "b") {
                            globalB = algebra.arredonda(globalB)
                        }
                        if (globalC != "c") {
                            globalC = algebra.arredonda(globalC)
                        }
                    }

                    // Precisão do log
                    else if (escolha == 2) {
                        config.logPrecisao = ui.intervalo(escrita.itemConfig("Qual a precisão do log?", "logPrecisao"), "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”", 1e-12, 1e-6, 20)
                    }

                    // Precisão da divisão
                    else if (escolha == 3) {
                        config.divPrecisao = ui.intervalo(escrita.itemConfig("Qual a precisão da divisão?", "divPrecisao"), "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”", 1e-12, 1e-6, 20)
                    }

                    // Limite de interações
                    else if (escolha == 4) {
                        config.limiteInteracoes = ui.intervalo(escrita.itemConfig("Qual o limite de interações?", "limiteInteracoes"), "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado", 100, 10000)
                    }

                    else if (escolha == 5) {
                        let lingua = ui.intervalo(escrita.itemConfig("Qual língua?", "linguagem") + "\n1 = Português Brasileiro\n2 = Inglês", "Obs.: Isso irá alterar a língua do sistema inteiro.", 1, 2, 0)
                        if (lingua == 1) {
                            config.linguagem = "pt-br"
                            config.separadorDecimal = true
                            config.acentos = true
                        } else if (lingua == 2) {
                            config.linguagem = "en"
                            config.separadorDecimal = false
                            config.acentos = false
                        }
                    }
                }
            } while (escolha != 0)
        }

        // Rever
        else if (tipo == 8) {
            ui.exibir("Valores:\na = " + escrita.decimal(globalA) + "\nb = " + escrita.decimal(globalB) + "\nc = " + escrita.decimal(globalC))
            loop = true
        }

        // Mudar
        else if (tipo == 9) {
            loop = true
            editar = true
        }

        // Sair
        else if (tipo == 0) {
            if (config.confirmacoesSaida) {
                loop = !(ui.confirmar("Tu queres sair?", "Obs.: Configurações voltarão ao padrão caso saias"))
            } else {
                loop = false
            }
        }
    }

    // Erro
    else {
        erro.intervalo(0, 9)
        loop = true
    }
} while (loop)
