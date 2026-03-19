# FAQ / Perguntas Frequentes

## English

### General

**What is the Mathematical Function Analyzer?**
An interactive tool that runs in the browser and analyzes mathematical functions, displaying their properties step by step — with optional detailed explanations.

**Who developed it?**
Developed by Adriano Lima, a student of the Technical Course in Internet Computing at IFRS campus Rio Grande. The project started as a math school assignment.

**Is it free?**
Yes. The project is public and can be accessed for free via GitHub Pages.

### Usage

**How do I access the program?**
Directly in the browser at: https://c4adriano.github.io/analisador-funcoes-matematicas/

Or locally:
1. Download or clone the repository
2. Open `index.html` in your browser
3. No installation required

**Why does the program use `prompt` and `alert` instead of a graphical interface?**
The project was intentionally built in pure JavaScript, with no frameworks or external libraries. Menus via `prompt` and `alert` keep the code simple and accessible.

**Which function types are supported?**
- Constant — `f(x) = c`
- Linear — `f(x) = bx + a`
- Quadratic — `f(x) = ax² + bx + c`
- Exponential — `f(x) = b · aˣ`
- Logarithmic — `f(x) = b · log_a(x) + c`

**What can the program analyze?**
Domain, range, roots, vertex, axis intercepts, sign study, asymptote, curve, values of `x` and `y`, and equations between functions.

**Can I leave coefficients as unknowns?**
Yes. Coefficients `a`, `b`, and `c` can be left blank — the program calculates their values from known points provided by the user.

**Does it work on mobile?**
Technically yes, but the experience is not ideal. The behavior of `prompt` and `alert` may vary across mobile browsers. A computer is recommended.

### Settings

**What can be configured?**
Unicode and accents, decimal places, capitalization, decimal separator, logarithm and division precision, iteration limit, and language (PT-BR / EN).

**How do I access the settings?**
Through the main menu of the program, where each setting can be changed individually.

### Technical

**What technologies were used?**
Pure JavaScript and HTML only. No libraries, frameworks, or external dependencies.

**Can I contribute?**
No. Read [`CONTRIBUTING.md`](CONTRIBUTING.md).

**I found a bug. What do I do?**
Open an issue using the `bug_report` template. Describe what happened, which function you were using, and the expected result.

---

## Português

### Geral

**O que é o Analisador de Funções Matemáticas?**
Uma ferramenta interativa que roda no navegador e analisa funções matemáticas, exibindo suas propriedades passo a passo — com explicações detalhadas opcionais.

**Quem desenvolveu?**
Desenvolvido por Adriano Lima, estudante do curso Técnico em Informática para Internet no IFRS campus Rio Grande. O projeto começou como trabalho escolar de matemática.

**É gratuito?**
Sim. O projeto é público e pode ser acessado sem custo pelo GitHub Pages.

### Uso

**Como acesso o programa?**
Diretamente no navegador em: https://c4adriano.github.io/analisador-funcoes-matematicas/

Ou localmente:
1. Baixe ou clone o repositório
2. Abra o arquivo `index.html` no navegador
3. Não é necessário instalar nada

**Por que o programa usa `prompt` e `alert` em vez de uma interface gráfica?**
O projeto foi desenvolvido intencionalmente em JavaScript puro, sem frameworks ou bibliotecas externas. Os menus via `prompt` e `alert` tornam o código simples e acessível.

**Quais tipos de função são suportados?**
- Constante — `f(x) = c`
- Afim — `f(x) = bx + c`
- Quadrática — `f(x) = ax² + bx + c`
- Exponencial — `f(x) = b · aˣ`
- Logarítmica — `f(x) = b · log_a(x) + c`

**O que o programa consegue analisar?**
Domínio, imagem, raízes, vértice, interseções com os eixos, estudo do sinal, assíntota, curva, valores de `x` e `y`, e equações entre funções.

**Posso deixar coeficientes como incógnitas?**
Sim. Os coeficientes `a`, `b` e `c` podem ser deixados em branco — o programa calcula seus valores a partir de pontos conhecidos informados pelo usuário.

**Funciona em celular?**
Tecnicamente sim, mas a experiência não é ideal. O comportamento de `prompt` e `alert` pode variar entre navegadores mobile. Recomenda-se usar em um computador.

### Configurações

**O que dá para configurar?**
Unicode e acentos, casas decimais, capitalização, separador decimal, precisão de logaritmos e divisões, limite de iterações e idioma (PT-BR / EN).

**Como acesso as configurações?**
Pelo menu principal do programa, onde cada configuração pode ser alterada individualmente.

### Técnico

**Quais tecnologias foram usadas?**
Apenas JavaScript puro e HTML. Sem bibliotecas, frameworks ou dependências externas.

**Posso contribuir?**
Não. Leia o [`CONTRIBUTING.md`](CONTRIBUTING.md).

**Encontrei um erro. O que faço?**
Abra uma issue usando o template `bug_report`. Descreva o que aconteceu, qual função estava usando e o resultado esperado.