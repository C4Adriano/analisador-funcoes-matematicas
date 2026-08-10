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

An interactive tool that runs in the browser and analyzes **Mathematical** Functions**, displaying their properties step by step — with optional detailed explanations.

Built primarily in pure **JavaScript**, with short, simple modules written in **TypeScript** for type-checking during development.

### Features

- **Supported Functions: Constant, Linear, Quadratic, Exponential, Logarithmic, Sine, Cosine, Tangent**, and more.
- **Available analyses:** Domain, Range, Roots, Vertex, Axis intercepts, Sign study, Asymptote, Curve, Values of `x` and `y`, Equations between **Functions**, etc.
- **Variable coefficients:** `a`, `b`, `c` can be left as unknowns — the **Program** calculates their values from known points
- **History:** Saves and retrieves previous **Functions** during the session
- **Settings: Unicode**, accents, decimal places, capitalization, decimal separator, log and division precision, iteration limit, language _(PT-BR / EN)_, and more.
- **Bilingual: Brazilian Portuguese** and **English**

### How to use

1. Open [`index.html`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/index.html) in your browser
2. Follow the menus in the `prompts` and `alerts`

Note: No installation required.

Or access directly: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### Code structure

| Object                                                                                              | Responsibility                                               |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`algebra`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/algebra.js)   | **Mathematical** calculations (log, ln, safe division, etc.) |
| [`analyze`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/analyze.js)   | Analysis of each **Function** type                           |
| [`checks`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/checks.js)     | Type-checking utilities for `.ts` files                      |
| [`commands`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/commands.js) | Commands of the **Program**                                  |
| [`config`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/config.ts)     | Global **Program** settings                                  |
| [`error`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/errors.js)      | Standardized error messages                                  |
| [`helpers`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/helpers.js)   | Common calculations and result assembly                      |
| [`i18n`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/i18n.ts)         | Language functions _(internationalization)_                  |
| [`main`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/main.js)         | Orchestrates the **Program**                                 |
| [`state`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/state.ts)       | Management of the **Program**'s state                        |
| [`ui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/ui.js)             | User interaction (menus, inputs, errors)                     |
| [`values`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/values.d.ts)   | Shared types for `.ts` files                                 |
| [`version`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/version.js)   | Current version (`VERSION`)                                  |
| [`writing`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/writing.js)   | Formatting, translation, and text conversion                 |

### Version history

| Version                                                                                                                                                                             | Highlight                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [1.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-10---quadratic-linear-and-constant-functions)                    | **Quadratic, Linear, and Constant Functions**            |
| [2.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-21---exponential-**Function**)                                   | **Exponential Functions**                                |
| [3.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-30---variables-a-b-c-in-quadratic-linear-and-constant-functions) | Coefficients as unknowns                                 |
| [4.4](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-44---logarithmic-functions)                                      | **Logarithmic Functions**                                |
| [4.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-45---official-release)                                           | Pre-release                                              |
| [5.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-51---improvements)                                               | Settings system                                          |
| [5.2](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-52---objects-and-settings-improvements)                          | **JS** objects, settings standard                        |
| [5.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-55---improvements)                                               | `helpers` object, **Function** history, _EN_ translation |
| [6.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md#version-60---release)                                                    | Public release on **GitHub**                             |

Full **Changelog [`here`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md)**.

### Roadmap

- Translations into _Spanish_ and other languages
- Internal code improvements, such as the migration to **TS**

Full **Roadmap [`here`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_EN.md)**

### Documentation

- **[FAQ](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ/FAQ_EN.md)**
- **[Glossary](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/GLOSSARY/GLOSSARY_EN.md)**
- **[Changelog](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md)**
- **[Roadmap](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_EN.md)**
- **[Code of Conduct](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CODE_OF_CONDUCT/CODE_OF_CONDUCT_EN.md)**
- **[Contributing](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTING/CONTRIBUTING_EN.md)**
- **[Contributors](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTORS/CONTRIBUTORS_EN.md)**
- **[Security Policy](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/SECURITY.md)**
- **[License](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/LICENSE.md)**

### Technologies

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---
