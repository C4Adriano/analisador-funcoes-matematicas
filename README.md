<div align="center">
    <h1>Mathematical <b>Function Analyzer</b> - Version 6.0 / Analisador de <b>Funções Matemáticas</b> - Versão 6.0</h1>
    <p>All rights reserved / Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

[![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

---

## English

### What is it?

An interactive tool that runs in the browser and analyzes mathematical functions, displaying their properties step by step — with optional detailed explanations.

Built entirely in pure JavaScript, with no external libraries.

### Features

- **Supported functions:** Constant, Linear, Quadratic, Exponential, and Logarithmic
- **Available analyses:** Domain, Range, Roots, Vertex, Axis intercepts, Sign study, Asymptote, Curve, Values of `x` and `y`, Equations between functions
- **Variable coefficients:** `a`, `b`, `c` can be left as unknowns — the program calculates their values from known points
- **History:** Saves and retrieves previous functions during the session
- **Settings:** Unicode, accents, decimal places, capitalization, decimal separator, log and division precision, iteration limit, language (PT-BR / EN), and more
- **Bilingual:** Brazilian Portuguese and English *(in development)*

### How to use

1. Clone or download the repository
2. Open `index.html` in your browser
3. Follow the menus in the `prompts` and `alerts`

No installation required.

Or access directly: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### Code structure

| Object | Responsibility |
|---|---|
| `config` | Global program settings |
| `helpers` | Common calculations and result assembly |
| `escrita` | Formatting, translation, and text conversion |
| `ui` | User interaction (menus, inputs, errors) |
| `erro` | Standardized error messages |
| `algebra` | Mathematical calculations (log, ln, safe division, etc.) |
| `analisar` | Analysis of each function type |

### Version history

| Version | Highlight |
|---|---|
| 1.0 | Quadratic, Linear, and Constant functions |
| 2.1 | Exponential functions |
| 3.0 | Coefficients as unknowns |
| 4.4 | Logarithmic functions |
| 4.5 | Pre-release |
| 5.1 | Settings system |
| 5.2 | JS objects, settings standard |
| 5.5 | `helpers` object, function history, EN translation |
| 6.0 | Public release on GitHub |

Full changelog in [`CHANGELOG.md`](docs/CHANGELOG.md).

### Upcoming updates

- Verify which functions are valid for known points
- `/` commands for quick access *(in development)*
- Help, summaries, and reports by function type
- Equations between Exponential Functions

### Technologies

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)

---

## Português

### O que é?

Uma ferramenta interativa, rodando no navegador, que analisa funções matemáticas e exibe suas propriedades passo a passo — com explicações detalhadas opcionais.

Desenvolvida inteiramente em JavaScript puro, sem bibliotecas externas.

### Funcionalidades

- **Funções suportadas:** Constante, Afim, Quadrática, Exponencial e Logarítmica
- **Análises disponíveis:** Domínio, Imagem, Raízes, Vértice, Interseções com os eixos, Estudo do sinal, Assíntota, Curva, Valores de `x` e `y`, Equações entre funções
- **Coeficientes variáveis:** `a`, `b`, `c` podem ser deixados como incógnitas — o programa calcula seus valores a partir de pontos conhecidos
- **Histórico:** Salva e recupera funções anteriores durante a sessão
- **Configurações:** Unicode, acentos, casas decimais, capitalização, separador decimal, precisão de log e divisão, limite de iterações, idioma (PT-BR / EN) e mais
- **Bilíngue:** Português Brasileiro e Inglês *(em desenvolvimento)*

### Como usar

1. Clone ou baixe o repositório
2. Abra `index.html` no navegador
3. Siga os menus nos `prompts` e `alerts`

Não é necessário instalar nada.

Ou acesse diretamente: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### Estrutura do código

| Objeto | Responsabilidade |
|---|---|
| `config` | Configurações globais do programa |
| `helpers` | Cálculos e montagem de resultados comuns |
| `escrita` | Formatação, tradução e conversão de texto |
| `ui` | Interação com o usuário (menus, entradas, erros) |
| `erro` | Mensagens de erro padronizadas |
| `algebra` | Cálculos matemáticos (log, ln, divisão segura, etc.) |
| `analisar` | Análise de cada tipo de função |

### Histórico resumido

| Versão | Destaque |
|---|---|
| 1.0 | Funções Quadráticas, Afins e Constantes |
| 2.1 | Funções Exponenciais |
| 3.0 | Coeficientes como variáveis (incógnitas) |
| 4.4 | Funções Logarítmicas |
| 4.5 | Pré-Lançamento |
| 5.1 | Sistema de configurações |
| 5.2 | Objetos JS, padrão de configurações |
| 5.5 | Objeto `helpers`, histórico de funções, tradução EN |
| 6.0 | Lançamento no GitHub |

Changelog completo em [`CHANGELOG.md`](docs/CHANGELOG.md).

### Próximas atualizações

- Verificar quais funções são válidas para pontos conhecidos
- Comandos com `/` para acesso rápido *(em desenvolvimento)*
- Ajuda, resumos e relatórios por tipo de função
- Equações entre Funções Exponenciais

### Tecnologias

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)