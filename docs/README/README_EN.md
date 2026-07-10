<div align="center">
    <h1><b>Mathematical Function Analyzer</b></h1>
    <h2>README</h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - present</em></p>
</div>

---

🌐 [Back to Documentation](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Back to main](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🇧🇷 [Português](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/README/README_PT.md)

---

[![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

---

### What is it?

An interactive tool that runs in the browser and analyzes **Mathematical Functions**, displaying their properties step by step — with optional detailed explanations.

Built entirely in pure **JavaScript**, with no external libraries.

### Features

- **Supported **Functions**: Constant, Linear, Quadratic, Exponential, Logarithmic, Sine, Cosine, Tangent**, and more.
- **Available analyses:** Domain, Range, Roots, Vertex, Axis intercepts, Sign study, Asymptote, Curve, Values of `x` and `y`, Equations between **Functions**, etc.
- **Variable coefficients:** `a`, `b`, `c` can be left as unknowns — the program calculates their values from known points
- **History:** Saves and retrieves previous **Functions** during the session
- **Settings: Unicode**, accents, decimal places, capitalization, decimal separator, log and division precision, iteration limit, language _(PT-BR / EN)_, and more.
- **Bilingual: Brazilian Portuguese** and **English**

### How to use

1. Open [`index.html`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/index.html) in your browser
2. Follow the menus in the `prompts` and `alerts`

Note: No installation required.

Or access directly: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### Code structure

| Object                                                                                                 | Responsibility                                           |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [`algebra`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/algebra.js)   | Mathematical calculations (log, ln, safe division, etc.) |
| [`analyze`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/analyze.js)   | Analysis of each function type                           |
| [`commands`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/commands.js) | Commands of the program                                  |
| [`config`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/config.js)     | Global program settings                                  |
| [`error`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/error.js)       | Standardized error messages                              |
| [`helpers`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/helpers.js)   | Common calculations and result assembly                  |
| [`parse`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/parse.js)       | Analysis and parsing of **Functions**                    |
| [`state`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/state.js)       | Management of the program's state                        |
| [`test`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/test.js)         | Program tests                                            |
| [`ui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/ui.js)             | User interaction (menus, inputs, errors)                 |
| [`writing`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/writing.js)   | Formatting, translation, and text conversion             |

### Version history

| Version                                                                                                                                                                             | Highlight                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [1.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-10---quadratic-linear-and-constant-functions)                    | **Quadratic, Linear, and Constant Functions**        |
| [2.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-21---exponential-function)                                       | **Exponential Functions**                            |
| [3.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-30---variables-a-b-c-in-quadratic-linear-and-constant-functions) | Coefficients as unknowns                             |
| [4.4](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-44---logarithmic-functions)                                      | **Logarithmic Functions**                            |
| [4.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-45---official-release)                                           | Pre-release                                          |
| [5.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-51---improvements)                                               | Settings system                                      |
| [5.2](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-52---objects-and-settings-improvements)                          | **JS** objects, settings standard                    |
| [5.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-55---improvements)                                               | `helpers` object, function history, _EN_ translation |
| [6.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-60---release)                                                    | Public release on **GitHub**                         |

Full changelog in [`CHANGELOG`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md).

### Upcoming updates

- Verify which **Functions** are valid for known points
- `/` commands for quick access _(in development)_
- Help, summaries, and reports by function type
- Equations between **Exponential Functions**

Full upcoming updates in [`ROADMAP`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_EN.md)

### Technologies

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---
