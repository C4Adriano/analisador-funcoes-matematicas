<div align="center">
    <h1><b>Mathematical Function Analyzer</b></h1>
    <h2>README</h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - present</em></p>
</div>

---

🌐 [Back to Documentation][Docs] | 🌐 [Back to Main][Docs] | 🇧🇷 [Português][PT]

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

Access: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### [Code structure](https://github.com/C4Adriano/analisador-funcoes-matematicas/tree/main/src)

| Object     | Responsibility                                               |
| ---------- | ------------------------------------------------------------ |
| [algebra]  | **Mathematical** calculations (log, ln, safe division, etc.) |
| [analyze]  | Analysis of each **Function** type                           |
| [checks]   | Type-checking utilities for `.ts` files                      |
| [commands] | Commands of the **Program**                                  |
| [config]   | Global **Program** settings                                  |
| [error]    | Standardized error messages                                  |
| [helpers]  | Common calculations and result assembly                      |
| [i18n]     | Language functions _(internationalization)_                  |
| [main]     | Orchestrates the **Program**                                 |
| [state]    | Management of the **Program**'s state                        |
| [ui]       | User interaction (menus, inputs, errors)                     |
| [values]   | Shared types for `.ts` files                                 |
| [version]  | Current version (`VERSION`)                                  |
| [writing]  | Formatting, translation, and text conversion                 |

### Version history

| Version | Highlight                                            |
| ------- | ---------------------------------------------------- |
| [1.0]   | **Constant, Affine, and Quadratic Functions**        |
| [2.x]   | **Exponential Functions**                            |
| [3.x]   | Resolution of variables by points, menu pages        |
| [4.x]   | **JS Functions**, equations between **Functions**    |
| [5.x]   | **Logarithmic Functions**, history, _EN_ translation |
| [6.0.0] | Release on **GitHub**                                |
| [6.1.0] | **Trigonometric Functions**                          |

Full **Changelog [`here`][CHANGELOG]**.

### Roadmap

- Translations into _Spanish_ and other languages
- Internal code improvements, such as the migration to **TS**

Full **Roadmap [`here`][ROADMAP]**

### Documentation

- **[CHANGELOG]**
- **[ROADMAP]**
- **[Contributors]**
- **[Security Policy][SECURITY]**
- **[LICENSE]**

### Technologies

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---

[Docs]: /README.md
[PT]: README_PT.md
[algebra]: /src/algebra.js
[analyze]: /src/analyze.js
[checks]: /src/checks.js
[commands]: /src/commands.js
[config]: /src/config.ts
[error]: /src/errors.js
[helpers]: /src/helpers.js
[i18n]: /src/i18n.ts
[main]: /src/main.js
[state]: /src/state.ts
[ui]: /src/ui.js
[values]: /src/values.d.ts
[version]: /src/version.js
[writing]: /src/writing.js
[CHANGELOG]: ../CHANGELOG/CHANGELOG_EN.md
[1.0]: ../CHANGELOG/CHANGELOG_EN.md#10
[2.x]: ../CHANGELOG/CHANGELOG_EN.md#2x
[3.x]: ../CHANGELOG/CHANGELOG_EN.md#3x
[4.x]: ../CHANGELOG/CHANGELOG_EN.md#4x---2025-11-27
[5.x]: ../CHANGELOG/CHANGELOG_EN.md#5x
[6.0.0]: ../CHANGELOG/CHANGELOG_EN.md#600---2026-03-19
[6.1.0]: ../CHANGELOG/CHANGELOG_EN.md#610
[ROADMAP]: ../ROADMAP/ROADMAP_EN.md
[LICENSE]: /LICENSE.md
[SECURITY]: ../SECURITY.md
[Contributors]: ../CONTRIBUTORS/CONTRIBUTORS_EN.md
