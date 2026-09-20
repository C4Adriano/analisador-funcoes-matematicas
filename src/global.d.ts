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
type Variable = "a" | "b" | "c"

/**
 * Valor qualquer.
 * @since ~v6.2.0
 */
type Value = Str | Numeric

/**
 * Valor matemático.
 * @since v7.0.0
 */
type MathValue = Variable | Numeric

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
    a: MathValue
    /** Coeficiente `b`. */
    b: MathValue
    /** Coeficiente `c`. */
    c: MathValue
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
type LinearBasis = { [coefficient: Str]: (x: Numeric) => Numeric }

/**
 * Unidades de ângulo suportadas pelo programa.
 * @since ~v6.2.0
 */
type Degrees = "deg" | "rad"

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
type CommandsNames = "change" | "config" | "exit" | "history" | "review" | "start"

/**
 * Tipos de mensagens suportadas pelo programa.
 * @since v6.6.2
 */
type TypeMessage = "confirm" | "console" | "display" | "error" | "warning"

/**
 * Tipos de formatação de texto suportadas pelo programa.
 * @since v6.6.7
 */
type TextCase = "capitalized" | "lowercase" | "normal" | "uppercase"
