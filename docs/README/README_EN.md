<div align="center">
    <h1>Mathematical <b>Function Analyzer</b></h1>
    <h2>README</h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

🌐 [Back to Documentation](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Back to main](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🇧🇷 [Português](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/README/README_PT.md)

---

[![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

---

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

Full changelog in [`CHANGELOG`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md).

### Upcoming updates

- Verify which functions are valid for known points
- `/` commands for quick access *(in development)*
- Help, summaries, and reports by function type
- Equations between Exponential Functions

Full upcoming updates in [`ROADMAP`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_EN.md)

### Technologies

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)

---
