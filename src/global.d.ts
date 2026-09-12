/**
 * Texto genérico.
 * @since ~v6.2.0
 */
type Str = string

/**
 * Número genérico.
 * @since ~v6.2.0
 */
type Numeric = number

/**
 * Variável matemática.
 * @since ~v6.2.0
 */
type Variable = Str

/**
 * Valor matemático.
 * @since ~v6.2.0
 */
type Value = Variable | Numeric

/**
 * Precisão numérica.
 * @since ~v6.2.0
 */
type Precision = 1e-6 | 1e-7 | 1e-8 | 1e-9 | 1e-10 | 1e-11 | 1e-12

/**
 * Casas decimais.
 * @since ~v6.2.0
 */
type Places = Numeric

/**
 * Vetor de valores matemáticos.
 * @since ~v6.2.0
 */
type ValueArray = Value[]

/**
 * Matriz de valores matemáticos.
 * @since ~v6.2.0
 */
type ValueMatrix = Value[][]

/**
 * Array de números.
 * @since ~v6.2.0
 */
type NumericArray = Numeric[]

/**
 * Matriz de números.
 * @since ~v6.2.0
 */
type NumericMatrix = Numeric[][]

/**
 * Funções trigonométricas suportadas pelo programa.
 * @since ~v6.2.0
 */
type TrigonometricFunction =
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
type FunctionType =
    | /** Polinomial. */ "poly"
    | /** Exponencial. */ "exp"
    | /** Logarítmica. */ "log"
    | /** Trigonométrica. */ Exclude<TrigonometricFunction, "">

/**
 * Coeficientes suportados pelo programa.
 * @since v6.6.0
 */
type Coefficients = {
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
type PointPair = {
    /** Valor de `x` */
    x: Numeric
    /** Valor de `y` */
    y: Numeric
}

/**
 * Usado para montar a matriz de um sistema linear genérico.
 * @since v6.6.0
 */
type LinearBasis = {
    [coefficient: Str]: (x: Numeric) => Numeric
}

/**
 * Unidades de ângulo suportadas pelo programa.
 * @since ~v6.2.0
 */
type Degrees = /** Graus (°). */ "deg" | /** Radianos (PI rad). */ "rad"

/**
 * Idiomas suportados pelo programa.
 * @since ~v6.2.0
 */
type Language =
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
type CommandsNames =
    | /** Abre as configurações do programa. */ "config"
    | /** Reinicia o fluxo de análise. */ "start"
    | /** Reexibe a última função analisada. */ "review"
    | /** Troca os coeficientes da função atual. */ "change"
    | /** Exibe o histórico de funções analisadas. */ "history"
    | /** Encerra o programa. */ "exit"

/**
 * Tipos de mensagens suportadas pelo programa.
 * @since v6.6.2
 */
type TypeMessage =
    | /** Mensagem informativa simples. */ "display"
    | /** Mensagem de erro. */ "error"
    | /** Mensagem que exige confirmação do usuário. */ "confirm"
    | /** Mensagem de aviso. */ "warning"
    | /** Mensagem no `console` */ "console"

/**
 * Tipos de formatação de texto suportadas pelo programa.
 * @since v6.6.7
 */
type TextCase =
    | /** Mensagens normais, escritas como vireram do `i18n`. */ "normal"
    | /** MENSAGENS EM MAIÚSCULAS */ "uppercase"
    | /** mensagens em minúsculas */ "lowercase"
    | /** Mensagens Com A Primeira Letra Maiúscula E As Outras Minúsculas */ "capitalized"
