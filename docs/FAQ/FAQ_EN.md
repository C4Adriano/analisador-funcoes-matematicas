<div align="center">
    <h1>Mathematical <b>Function Analyzer</b></h1>
    <h2>FAQ</h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

🌐 [Back to Documentation](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Back to main](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ.md) | 🇧🇷 [Português](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ/FAQ_PT.md)

---

### General

**What is the Mathematical Function Analyzer?**
An interactive tool that runs in the browser and analyzes mathematical functions, displaying their properties step by step — with optional detailed explanations.

**Who developed it?**
Developed by Adriano Lima, a student of the Technical Course in Internet Computing at IFRS campus Rio Grande. The project started as a math school assignment.

**Is it free?**
Yes. The project is public and can be accessed for free via GitHub Pages.

### Usage

**How do I access the program?**
Directly in the browser at: [Analyzer](https://c4adriano.github.io/analisador-funcoes-matematicas/)

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
No. Read [`CONTRIBUTING.md`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/CONTRIBUTING.md).

**I found a bug. What do I do?**
Open an issue using the `bug_report` template. Describe what happened, which function you were using, and the expected result.

---
