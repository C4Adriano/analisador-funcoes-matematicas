/**
 * Texto genérico.
 * @since ~v6.2.0
 */
export type Text = string

/**
 * Número genérico.
 * @since ~v6.2.0
 */
export type Numeric = number

/**
 * Variável matemática.
 * @since ~v6.2.0
 */
export type Variable = Text

/**
 * Valor matemático.
 * @since ~v6.2.0
 */
export type Value = Variable | Numeric

/**
 * Precisão numérica.
 * @since ~v6.2.0
 */
export type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12

/**
 * Casas decimais.
 * @since ~v6.2.0
 */
export type Places = Numeric

/**
 * Dígito numérico.
 * @since ~v6.2.0
 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Vetor de valores matemáticos.
 * @since ~v6.2.0
 */
export type ValueArray = Value[]

/**
 * Matriz de valores matemáticos.
 * @since ~v6.2.0
 */
export type ValueMatrix = Value[][]

/**
 * Array de números.
 * @since ~v6.2.0
 */
export type NumericArray = Numeric[]

/**
 * Funções trigonométricas suportadas pelo programa.
 * @since ~v6.2.0
 */
export type TrigonometricFunction =
    | /** Seno. */ "sin"
    | /** Cosseno. */ "cos"
    | /** Tangente. */ "tan"
    | /** Cossecante. */ "csc"
    | /** Secante. */ "sec"
    | /** Cotangente. */ "cot"
    | /** Nenhuma função trigonométrica. */ ""

/**
 * Funções suportadas pelo programa.
 * @since v6.6.0
 */
export type FunctionType =
    | /** Polinomial. */ "poly"
    | /** Exponencial. */ "exp"
    | /** Logarítmica. */ "log"
    | Exclude<TrigonometricFunction, "">

/**
 * Coeficientes suportados pelo programa.
 * @since v6.6.0
 */
export type Coefficients = {
    /** Coeficiente `a`. */
    a: Value
    /** Coeficiente `b`. */
    b: Value
    /** Coeficiente `c`. */
    c: Value
}

/**
 * Um par ordenado de um ponto qualquer.
 * @since v6.6.0
 */
export type PointPair = {
    /** Valor de `x` */
    x: number
    /** Valor de `y` */
    y: number
}

/**
 * Usado para montar a matriz de um sistema linear genérico.
 * @since v6.6.0
 */
export type LinearBasis = {
    [coefficient: string]: (x: number) => number
}

/**
 * Unidades de ângulo suportadas pelo programa.
 * @since ~v6.2.0
 */
export type Degrees = /** Graus (°). */ "deg" | /** Radianos (PI rad). */ "rad"

/**
 * Idiomas suportados pelo programa.
 * @since ~v6.2.0
 */
export type Language =
    | /** Português (Brasil). */ "pt-br"
    | /** Português (Portugal). */ "pt-pt"
    | /** Inglês (Estados Unidos). */ "en-us"
    | /** Inglês (Reino Unido). */ "en-gb"
    | /** Espanhol (América Latina). */ "es-419"
    | /** Espanhol (Espanha). */ "es-es"

/**
 * Comandos suportados pelo programa.
 * @since ~v6.2.0
 */
export type CommandsNames =
    | /** Abre as configurações do programa. */ "config"
    | /** Reinicia o fluxo de análise. */ "start"
    | /** Reexibe a última função analisada. */ "review"
    | /** Troca os coeficientes da função atual. */ "change"
    | /** Exibe o histórico de funções analisadas. */ "history"
    | /** Encerra o programa. */ "exit"

/**
 * Opções básicas suportadas pelo programa.
 * @since v6.6.1
 */
export type Options = {
    /** Arredondamento. */
    round?: boolean
    /** Precisão. */
    precision?: Precision
    /** Casas decimais. */
    places?: Places
}

/**
 * Opções básicas para mensagens suportadas pelo programa.
 * @since v6.6.1
 */
export type MessageOptions = {
    /** Explicação. */
    explanation?: Text
    /** Depuração. */
    debug?: boolean
    /** É `confirm`? */
    asConfirm?: boolean
    /** Permite `commands`? */
    allowCommands?: boolean
    /** Tipo de mensagem. */
    type?: TypeMessage
}

/**
 * Tipos de mensagens suportadas pelo programa.
 * @since v6.6.2
 */
export type TypeMessage =
    | /** Mensagem informativa simples. */ "display"
    | /** Mensagem de erro. */ "error"
    | /** Mensagem que exige confirmação do usuário. */ "confirm"
    | /** Mensagem de aviso. */ "warning"
