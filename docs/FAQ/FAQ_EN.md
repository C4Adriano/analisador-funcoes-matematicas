<div align="center">
    <h1><b>Mathematical Function Analyzer</b></h1>
    <h2>FAQ <em>(Frequently Asked Questions)</em></h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - present</em></p>
</div>

---

🌐 [Back to Documentation](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Back to main](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ.md) | 🇧🇷 [Português](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ/FAQ_PT.md)

---

### General

**What is the Mathematical Function Analyzer?**
An interactive tool that runs in the browser and analyzes **Mathematical Functions**, displaying their properties step by step — with optional detailed explanations.

**Who developed it?**
Developed by **Adriano Lima**, a student of the **Technical Course in Internet Computing at IFRS campus Rio Grande**. The **Project** started as a **Math** school assignment.

**Is it free?**
Yes. The **Project** is public and can be accessed for free via **GitHub Pages**.

### Usage

**How do I access the program?**
Directly in the browser at: **[Analyzer](https://c4adriano.github.io/analisador-funcoes-matematicas/)**

Or locally:

1. Download or clone the repository
2. Open `index.html` in your browser
3. No installation required

**Why does the program use `prompt` and `alert` instead of a graphical interface?**
The **Project** was intentionally built without UI frameworks or graphical libraries. Menus via `prompt` and `alert` keep the code simple and accessible.

**Which function types are supported?**

- Constant — `ƒ(x) = c`
- Linear — `ƒ(x) = bx + a`
- Quadratic — `ƒ(x) = ax² + bx + c`
- Exponential — `ƒ(x) = b · aˣ`
- Logarithmic — `ƒ(x) = b · logₐ(x) + c`
- Sine — `ƒ(x) = b × sin(a · x) + c`
- Cosine — `ƒ(x) = b × cos(a · x) + c`
- Tangent — `ƒ(x) = b × tan(a · x) + c`

**What can the program analyze?**
Domain, range, roots, vertex, axis intercepts, sign study, asymptote, curve, values of `x` and `y`, and equations between **Functions**.

**Can I leave coefficients as unknowns?**
Yes. Coefficients `a`, `b`, and `c` can be left blank — the program calculates their values from known points provided by the user.

**Does it work on mobile?**
Technically yes, but the experience is not ideal. The behavior of `prompt` and `alert` may vary across mobile browsers. A computer is recommended.

### Settings

**What can be configured?**
**Unicode** and accents, decimal places, capitalization, decimal separator, logarithm and division precision, iteration limit, and language _(**PT-BR** / **EN**)_.

**How do I access the settings?**
Through the main menu of the program, where each setting can be changed individually.

### Technical

**What technologies were used?**
The **Project** is built primarily in **JavaScript**, with short, simple modules written in **TypeScript** for type-checking during development. No UI frameworks or graphical libraries are used — the **TypeScript** modules compile to plain **JavaScript** via `tsc`, and the browser only ever runs plain **JS**. Husky and lint-staged are used as development tooling (pre-commit checks); no runtime dependencies are shipped to the browser.

**Can I contribute?**
Yes, occasional contributions are welcome. Read **[`CONTRIBUTING`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTING/CONTRIBUTING_EN.md)** for more information.

**I found a bug. What do I do?**
Open an issue using the `bug_report` template. Describe what happened, which function you were using, and the expected result.

---
