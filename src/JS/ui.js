import { algebra } from "./algebra.js"
import { config } from "./config.js"
import { erro } from "./erro.js"
import { escrita } from "./escrita.js"
import { helpers } from "./helpers.js"
import { state } from "./state.js"
import { comandos } from "./comandos.js"

/**
 * Objeto base para as funções envolvendo UI / UX e interação com o usuário
 * - Use as funções aqui para exibir mensagens, menus, prompts e outras interações. As mensagens são formatadas automaticamente conforme as configurações, então use a função "escrita.verificar" para formatar as mensagens antes de exibi-las.
 */
export const ui = {
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
            return (ui.confirmar("=== Aviso ===\n" + mensagem, explicacao))
        }
    },

    /**
     * Formata um menu paginado
     * @param {string[]} opcoes Array com todas as opções possíveis
     * @param {number} pagina Página atual
     * @returns Retorna a resposta, a página atual, as opções por página
     */
    menu(opcoes = ["---"], pagina = 1) {
        let resposta = 0, menu = "", opcao = 1, opcoesPag = [""], total = 0, lista = [].concat(opcoes)

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
            opcoesPag = lista.slice((5 * (pagina - 1)), (5 * pagina))

            // Responde
            resposta = ui.intervalo(menu, "", 0, 9, 0, true)
            if (resposta == 0) { // Voltar
                state.pedirCoefs = false
                state.loop = true
            } else if (resposta == 7) { // Alterar
                state.pedirCoefs = true
                state.loop = true
                resposta = 0
            } else if (resposta == 8) { // -1
                resposta = -1
                pagina -= 1
            } else if (resposta == 9) { // +1
                resposta = -1
                pagina += 1
            } /* else if (comandos.nomes().includes(resposta)) {
                state.loop = true
                state.manterTipo = true
                return (resposta)
            } */

            // Limite
            if (helpers.estourouLimite(++limite)) {
                resposta = 0
                state.loop = true
            }
        } while (!((0 <= resposta) && (resposta <= 9))) // && (!comandos.nomes().includes(resposta)))

        return ([resposta, pagina, opcoesPag])
    },

    /**
     * Exibe um prompt personalizado e verifica ele
     * @param {string} mensagem Mensagem
     * @param {string} explicacao Explicação
     * @param {boolean} numero true = número, false = string
     * @param {number} casas Casas para arredondar (0 = sem casas)
     * @returns Valor verificado
     */
    entrada(mensagem = "", explicacao = "", numero = false, casas = config.casasDecimais, aceitaComandos = false) {
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

            /* Comandos
            if ((valido) && (bruto[0] == "/") && (aceitaComandos)) {
                let acao = comandos.processar(bruto)
                if (acao != null) {
                    return (acao) 
                }
                valido = false
            } */

            // Número
            if ((valido) && (numero)) {
                valor = Number(escrita.decimal(texto, true))
                if (!isFinite(valor)) {
                    valido = false
                }
            }

            // Confirma
            if ((valido) && (config.confirmacoesEntrada)) {
                valido = ui.aviso("Tu digitaste: “" + (numero ? escrita.decimal(valor) : texto) + "”\nTens certeza?", "Obs.₁: Se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado\nObs.₂: Essas mensagens podem ser desativadas nas configurações, em “Confirmações de entrada”", true)
            }

            // Retorna
            if (valido) {
                if (numero) {
                    return (algebra.arredonda(valor, casas))
                }
                return (texto)
            }

            // Limite
            if (helpers.estourouLimite(++limite)) {
                valido = true
            }
        } while (!valido)

        return (numero ? 0 : "")
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
    funcao(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = 0, mostrar = config.mostrarFuncao) {
        if (!mostrar) { // Não mostrar
            return ("")
        }

        let func = "A função: ƒ(x) = "

        if ((!funcExp) && (!funcLog) && (funcTrig == 0)) { // Polinomial
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
        } else if ((funcExp) && (funcTrig == 0)) { // Exponencial
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
        } else if ((funcLog) && (funcTrig == 0)) { // Logarítmica
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
    intervalo(mensagem = "", explicacao = "", min = 0, max = 1, casas = 0, aceitaComandos = false) {
        let valor = 0

        // Loop
        do { // Pede um valor
            valor = ui.entrada(mensagem, explicacao, true, casas, aceitaComandos)

            /* if (comandos.nomes().includes(valor)) {
                return (valor)
            } */

            if ((!((min <= valor) && (valor <= max)))) { // Se o valor não estiver entre o intervalo, mostra um erro
                erro.intervalo(min, max)
            }
        } while ((!((min <= valor) && (valor <= max))))

        return (valor)
    }
}
