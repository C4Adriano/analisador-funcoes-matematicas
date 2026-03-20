<div align="center">
    <h1>Mathematical <b>Function Analyzer</b> - Version 6.0 / Analisador de <b>Funções Matemáticas</b> - Versão 6.0</h1>
    <p>All rights reserved / Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

> **Total lines / Total de linhas:** *`3296`*<br>
> **Dated / Datado de:** *`2025-07-23 -> today / hoje`*

---

## English

# Versions **1.x**

> **Lines in these versions:** *`185`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

---

### Version **1.0** - **Quadratic, Linear, and Constant Functions**

> **Lines in this version:** *`185`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Separated **Constant, Linear, and Quadratic Functions**
- All calculations performed with `a`, `b`, `c`, regardless of their values
- Distinct menus displayed for each **Function**
- Errors displayed when necessary
- The *Exit* menu option was permanently set to 0

#### Menus
* **Constant:**
    + 1 = Review
    + 2 = Change
    + 0 = Exit
* **Linear:**
    + 1 = Slope
    + 2 = Root
    + 3 = Point X
    + 4 = Point Y
    + 5 = Review
    + 6 = Change
    + 0 = Exit
* **Quadratic:**
    + 1 = Concavity
    + 2 = Roots
    + 3 = Vertex
    + 4 = Point X
    + 5 = Point Y
    + 6 = Review
    + 7 = Change
    + 0 = Exit

---

### Version **1.1** - Improvements to `alerts`

> **Lines in this version:** *`185`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Defined a variable to control the `alert` message: `t`

#### Changes
- Changed the `alert` message when the value is negative or zero

---

# Versions **2.x**

> **Lines in these versions:** *`422`*<br>
> **Dated:** *`2025-07-23 -> 2026-03-04`*

### Version **2.0** - Improvements

> **Lines in this version:** *`422`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added the ability to perform calculations with **Quadratic and Linear Functions**
- Calculations for `y`, given `x`
- Calculations for `x`, given `y`
- Added several options at the end of the menus, before *Review*, *Change*, and *Exit*

#### Menus
* **Linear:**
    + ...
    + 5 = Assign values for X
    + 6 = Assign values for Y
    + 7 = Review
    + 8 = Change
    + 0 = Exit
* **Quadratic:**
    + ...
    + 6 = Assign values for X
    + 7 = Assign values for Y
    + 8 = Review
    + 9 = Change
    + 0 = Exit

---

### Version **2.1** - **Exponential Function**

> **Lines in this version:** *`422`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added the **Exponential Function**
- Added a new menu for the **Exponential Function**

#### Changes
- Updated the variable `t` to control which type of **Function** the user wants

#### Menus
* **Type:**
    + 1 = **Quadratic, Linear, Constant**
    + 2 = **Exponential**
* **Exponential:**
    + 1 = Slope
    + 2 = Asymptote
    + 3 = Point that crosses the X axis
    + 4 = Point that crosses the Y axis
    + 5 = Assign values for X
    + 6 = Assign values for Y
    + 7 = Review
    + 8 = Change
    + 0 = Exit

---

### Version **2.2** - Improvements

> **Lines in this version:** *`422`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- When the **Exponential Function** becomes a **Constant**, values are adjusted and the **Constant Function** is displayed
- Defined whether the user should choose the values of `a`, `b`, `c`, and `t`

#### Changes
- The *Review (8)* and *Change (9)* menu options now always have the same option values in non-**Constant Functions**

---

# Versions **3.x**

> **Lines in these versions:** *`1068`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

### Version **3.0** - Variables `a`, `b`, `c` in **Quadratic, Linear, and Constant Functions**

> **Lines in this version:** *`785`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added the ability for `a`, `b`, `c` to be variables, with no value predefined by the user
- Added calculations using the **Function**'s known points to determine the values of `a`, `b`, `c`

---

### Version **3.1** - Bug fixes and improvements

> **Lines in this version:** *`786`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-03`*

#### Additions
- Added pages to the **Quadratic Function**, with a new type of menu and global options defined
- Added watermark

#### Changes
- The **Function** is now displayed before asking for known points
- The *Review (8)* and *Change (9)* menu options now always have the same option values in **Constant Functions**

#### Fixes
- Fixed the `bugs` that appeared with the Version 3.0 update

#### Menus
* **Quadratic:**
    * **Page 1:**
        + 1 = Concavity
        + 2 = Roots
        + 3 = Vertex
        + 4 = Point that crosses the X axis
        + 5 = Point that crosses the Y axis
    * **Page 2:**
        + 1 = Assign values for X
        + 2 = Assign values for Y
        + 3 = Sign study
        + 4 = `N/A`
        + 5 = `N/A`
    * **Global:**
        + 6 = Next page
        + 7 = Previous page
        + 8 = Review
        + 9 = Change
        + 0 = Exit

---

### Version **3.2** - Variables in **Exponential Functions**

> **Lines in this version:** *`1068`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added variables for the **Exponential Function** *(It is still not possible to solve variables when there is no value for `b`)*
- Added domain and range of the **Function**
- Added *Review* and *Change* when the **Function** type is selected

#### Changes
- The **Linear Function** menu now has pages

#### Fixes
- Fixed some errors with `NaN`
- Handled new errors, such as when `prompt` is cancelled `(v == null)`

#### Menus
* **Constant:**
    + 1 = Domain
    + 2 = Range
    + ...
* **Linear:**
    * **Page 1:**
        + 1 = Slope
        + 2 = Root
        + 3 = Point that crosses the X axis
        + 4 = Point that crosses the Y axis
        + 5 = Assign values for X
    * **Page 2:**
        + 1 = Assign values for Y
        + 2 = Sign study
        + 3 = Domain
        + 4 = Range
        + 5 = `N/A`
    * **Global:**
        + ...
* **Quadratic:**
    * **Page 2:**
        + ...
        + 4 = Domain
        + 5 = Range

#### History
- With this, 1000 lines of code were surpassed **(Day: *`2025-09-11`*; Time: *`18:00`*)**

### Version **3.3** - Improvements

> **Lines in this version:** *`1068`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added *let* declarations

---

# Versions **4.x**

> **Lines in these versions:** *`1568`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

### Version **4.0** - **JS Functions**

> **Lines in this version:** *`1220`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Additions
- Added **JS Functions**
- Added equations between **Functions** *(except **Exponential**)*

#### Changes
- Renamed some variables
- Improvements in some parts of the code

#### Fixes
- Bug fixes

---

### Version **4.1** - Improvements

> **Lines in this version:** *`1220`*<br>
> **Dated:** *`2025-10-18 -> 2025-12-30`*

#### Additions
- Added **JS Functions** for each **Mathematical Function** *(except **Exponential**)*

#### Changes
- Improvements to **JS Functions**
- Standardization of menus, creating global options

#### Fixes
- Bug fixes

#### Menus
* **Global:**
    + ...
    + 6 = Next page
    + 7 = Previous page
    + 8 = Review
    + 9 = Change
    + 0 = Exit

---

### Version **4.2** - **JS Functions** in **Exponential Functions**

> **Lines in this version:** *`1209`*<br>
> **Dated:** *`2025-09-17 -> 2025-12-30`*

#### Additions
- Added **JS Functions** for **Exponential Functions**

#### Changes
- Improvements in parts of the code

#### Fixes
- Bug fixes

---

### Version **4.3** - Improvements

> **Lines in this version:** *`1450`*<br>
> **Dated:** *`2025-10-31 -> 2025-12-30`*

#### Additions
- Added a global menu for **Exponential Functions**
- Added a new type of initial menu

#### Changes
- Improvements to **Exponential Functions**
- Code improvements

#### Menus
* **Exponential:**
    * **Page 1:**
        + 1 = Slope
        + 2 = Root
        + 3 = Asymptote
        + ...
    * **Page 2:**
        + ...
    * **Page 3:**
        + ...

* **Initial menu:**
    + 1 = **Polynomial Functions**
    + 2 = **Non-Polynomial Functions**

* **Submenus:**
    * **Polynomial Functions:**
        + 1 = **Quadratic, Linear, Constant**
    * **Non-Polynomial Functions:**
        + 1 = **Exponential**
        + 2 = **Logarithmic**

---

### Version **4.4** - **Logarithmic Functions**

> **Lines in this version:** *`1450`*<br>
> **Dated:** *`2025-10-31 -> 2025-12-30`*

#### Additions
- Added **Logarithmic Functions**
- Added the **JS Functions** for `log` and `ln`

#### Menus
* **Logarithmic:**
    * **Page 1:**
        + 1 = Curve
        + 2 = Root
        + ...
    * **Page 2:**
        + ...

#### History
- With this, 1500 lines of code were surpassed **(Day: *`2025-11-26`*; Time: *`10:00`*)**

---

### Version **4.5** - Official Release

> **Lines in this version:** *`1568`*<br>
> **Dated:** *`2025-12-30 -> 2026-03-04`*

#### Fixes
- Bug fixes

#### History
- After a long time, the Official Version was released **(Day: *`2025-11-27`*; Time: *`18:00`*)**

---

# Versions **5.x**

> **Lines in these versions:** *`3255`*<br>
> **Dated:** *`2025-11-26 -> 2026-03-09`*

### Version **5.0** - Code Restructuring

> **Lines in this version:** *`1483`*<br>
> **Dated:** *`2026-03-07 -> 2026-03-17`*

#### Additions
- Added the **JS Function** `erro`, which standardizes error messages for better understanding

#### Changes
- Technical change to the main code, with few changes for the user
- Changed messages for the user, using Unicode commands for better understanding — no code changes
- Renamed variables for better understanding — no code changes

---

### Version **5.1** - Improvements

> **Lines in this version:** *`1755`*<br>
> **Dated:** *`2026-02-07 -> 2026-02-08`*

#### Additions
- Added settings

#### Changes
- As a result of the settings, several **JS Functions** and variables can now be changed according to the user's preferences
- The *Exit* option in the Menus was changed to *Return to main menu*. *Exit* only appears in the main menu's menus

#### Menus
* **Settings:**
    + 1 = Number of decimal places
    + 2 = Input confirmations
    + 3 = Error messages
    + 4 = Unicode characters
    + 5 = Explanations
    + 6 = Show **Function**
    + 7 = Accents
    + 8 = Lowercase
    + 9 = Decimal point

---

### Version **5.2** - Objects and Settings Improvements

> **Lines in this version:** *`1867`*<br>
> **Dated:** *`2026-02-08 -> 2026-02-09`*

#### Changes
- **JS Functions** were grouped into objects for better code understanding
- Settings now follow a standard format
- Settings now include a *Restore defaults* option
- The settings menu now has pages with *Next page* and *Previous page*

#### Fixes
- Fixed some technical issues, such as `N/A` being permanently added to the end of menu arrays

#### Menus
* **Settings:**
    * **Page 1:**
        + 1 = Number of decimal places — **Default:** `6`
        + 2 = Input confirmations — **Default:** `No`
        + 3 = Error messages — **Default:** `Yes`
        + 4 = Unicode characters — **Default:** `Yes`
        + 5 = Explanations — **Default:** `Yes`
        + 6 = Show **Function** — **Default:** `Yes`
    * **Page 2:**
        + 1 = Accents — **Default:** `Yes`
        + 2 = Lowercase — **Default:** `No`
        + 3 = Decimal point — **Default:** `No`
        + 4 = `log` precision — **Default:** `1e-12`
        + 5 = Simple multiplication — **Default:** `No`
    * **Global:**
        + 7 = Restore defaults
        + 8 = Next page
        + 9 = Previous page
        + 0 = Return to main menu

---

### Version **5.3.1** - Settings Improvements

> **Lines in this version:** *`2162`*<br>
> **Dated:** *`2026-02-09 -> 2026-03-03`*

#### Additions
- Added new settings

#### Changes
- Settings were separated by type

#### Menus
* **Settings:**
    * **Page 1 *(Visual)*:**
        + 1 = Unicode
        + 2 = Explanations
        + 3 = Accents
        + 4 = Capitalized
        + 5 = Uppercase
        + 6 = Lowercase
    * **Page 2 *(Messages)*:**
        + 1 = Decimal point
        + 2 = Simple multiplication
        + 3 = Input confirmations
        + 4 = Exit confirmations
        + 5 = Error messages
        + 6 = Show **Function**
    * **Page 3 *(Numbers)*:**
        + 1 = Decimal places
        + 2 = `log` precision
        + 3 = Iteration limit

#### History
- With this, 2000 lines of code were surpassed **(Day: *`2026-02-10`*; Time: *`02:00`*)**

---

### Version **5.3.2** - Improvements to **Logarithmic Functions**

> **Lines in this version:** *`2162`*<br>
> **Dated:** *`2026-02-09 -> 2026-03-03`*

#### Additions
- Added variables for **Logarithmic Functions** as well

#### Changes
- Improved base displays

#### Fixes
- Fixed some errors with `log` and `ln`

---

### Version **5.3.3** - `UI` and `UX` Improvements

> **Lines in this version:** *`2162`*<br>
> **Dated:** *`2026-02-09 -> 2026-03-03`*

#### Changes
- Improvements to the formatting of `alerts`, `prompts`, and errors — for example: `=== Warning ===`
- Standardization of global options in Menus *(where applicable)*, to make them more intuitive *(since, in an interactive menu, the **Next** option would be on the right and **Previous** on the left)*
- Changed menu padding standard from `N/A` to `---` *(to indicate that the option does not exist, rather than implying it exists but has no function)*
- Restructured the data input **Function** for better code understanding
- Updated menu display with a visual footer showing global options
- Several other changes made for better understanding

#### Fixes
- Fixed various writing errors, including: extra spaces, agreement, grammar, etc.
- Fixed `bugs` with `NaN` and `Infinity` in various parts of the code

#### Menus
* **Global:**
    + 6 = Review
    + 7 = Change
    + 8 = Previous
    + 9 = Next
    + 0 = Back

---

### Version **5.4** - Improvements

> **Lines in this version:** *`2268`*<br>
> **Dated:** *`2026-02-24 -> 2026-03-06`*

#### Additions
- Created the **Function** `intervalo` to measure an interval
- Added several special types of **Functions**, such as pure **Quadratic**, natural **Exponential**, etc.
- Added comments to several parts of the code

#### Changes
- Split `log` precision so that division precision also exists separately
- Renamed all identifiers for greater coherence and consistency

---

### Version **5.5** - Improvements

> **Lines in this version:** *`3255`*<br>
> **Dated:** *`2026-03-07 -> 2026-03-17`*

#### Additions
- Added `helpers` to help minimize the code
- **Functions** can now be saved
- **Functions** can now be retrieved, with history *(while the program is not closed)*
- Added several descriptive comments for better code understanding *(using GitHub Copilot Inline Suggestions)*
- Added English translation to the code *(in development)*

#### Changes
- Some messages were updated due to standardization
- Improvements in parts of the code

#### Fixes
- Bug fixes

---

# Versions **6.x**

> **Lines in these versions:** *`3296`*<br>
> **Dated:** *`2026-03-18 -> 2026-03-19`*

### Version **6.0** - Release

> **Lines in this version:** *`3296`*<br>
> **Dated:** *`2026-03-18 -> 2026-03-19`*

#### Additions
- Added `/` commands to access from various places the options for:
    + Help with commands `/help`
    + Settings `/config`
    + Exit `/exit`

- All commands have working versions in both English and Portuguese, for greater accessibility
- All commands have variations, for example:
    + `///` => `/exit`
    + `/configuracoes` => `/config`
    + `/cmd` => `/help`

#### Changes
- Official release on GitHub
- Renamed variables in the code to make them more intuitive

---

# **Upcoming updates:**
+ Add option to verify which **Functions** can be valid for the known points
+ Add `/` commands to access **JS Functions** and **Help Functions**
+ Add help, summaries, reports, etc. for each type of **Function**
+ Add a **Function** that performs calculations safely
+ Add equations between **Exponential Functions**
+ Add a way to find `a` in **Exponential Functions**
+ Add **Trigonometric Functions** and their properties

---

## Português

# Versões **1.x**

> **Linhas nestas versões:** *`185`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

---

### Versão **1.0** - **Funções Quadráticas, Afins e Constantes**

> **Linhas nesta versão:** *`185`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Separadas **Funções Constantes, Afins e Quadráticas**
- Realizadas todas as contas com `a`, `b`, `c`, independentemente dos seus valores
- Mostrados menus distintos para cada **Função**
- Mostrados erros quando necessários
- A opção de menu *Sair* foi definida permanentemente como 0

#### Menus
* **Constante:**
    + 1 = Rever
    + 2 = Mudar
    + 0 = Sair
* **Afim:**
    + 1 = Inclinação
    + 2 = Raiz
    + 3 = Ponto X
    + 4 = Ponto Y
    + 5 = Rever
    + 6 = Mudar
    + 0 = Sair
* **Quadrática:**
    + 1 = Concavidade
    + 2 = Raízes
    + 3 = Vértice
    + 4 = Ponto X
    + 5 = Ponto Y
    + 6 = Rever
    + 7 = Mudar
    + 0 = Sair

---

### Versão **1.1** - Melhorias nos `alerts`

> **Linhas nesta versão:** *`185`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Definida uma variável para controlar a mensagem de `alert`: `t`

#### Mudanças
- Alterada a mensagem de `alert` quando o valor for negativo ou zero

---

# Versões **2.x**

> **Linhas nestas versões:** *`422`*<br>
> **Datada de:** *`2025-07-23 -> 2026-03-04`*

### Versão **2.0** - Melhorias

> **Linhas nesta versão:** *`422`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionada a possibilidade de fazer contas com as **Funções Quadráticas e Afins**
- Contas para `y`, tendo o `x`
- Contas para `x`, tendo o `y`
- Adicionadas, ao fim dos menus, antes de *Rever*, *Mudar* e *Sair*, várias opções

#### Menus
* **Afim:**
    + ...
    + 5 = Atribuir valores para X
    + 6 = Atribuir valores para Y
    + 7 = Rever
    + 8 = Mudar
    + 0 = Sair
* **Quadrática:**
    + ...
    + 6 = Atribuir valores para X
    + 7 = Atribuir valores para Y
    + 8 = Rever
    + 9 = Mudar
    + 0 = Sair

---

### Versão **2.1** - **Função Exponencial**

> **Linhas nesta versão:** *`422`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionada a **Função Exponencial**
- Adicionado um novo menu para a **Função Exponencial**

#### Mudanças
- Atualizada a variável `t` para controlar qual tipo de **Função** o usuário quer

#### Menus
* **Tipo:**
    + 1 = **Quadrática, Afim, Constante**
    + 2 = **Exponencial**
* **Exponencial:**
    + 1 = Inclinação
    + 2 = Assíntota
    + 3 = Ponto que cruza o eixo do X
    + 4 = Ponto que cruza o eixo do Y
    + 5 = Atribuir valores para X
    + 6 = Atribuir valores para Y
    + 7 = Rever
    + 8 = Mudar
    + 0 = Sair

---

### Versão **2.2** - Melhorias

> **Linhas nesta versão:** *`422`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Quando a **Função Exponencial** se torna uma **Constante**, os valores são ajustados e a **Função Constante** é exibida
- Definido se o usuário deve escolher os valores de `a`, `b`, `c` e `t`

#### Mudanças
- As opções de menu *Rever (8)* e *Mudar (9)* passaram a ter sempre os mesmos valores de opção em **Funções** não **Constantes**

---

# Versões **3.x**

> **Linhas nestas versões:** *`1068`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

### Versão **3.0** - Variáveis `a`, `b`, `c` nas **Funções Quadráticas, Afins e Constantes**

> **Linhas nesta versão:** *`785`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionada a possibilidade de `a`, `b`, `c` serem variáveis, sem valor predefinido pelo usuário
- Adicionadas contas com os pontos conhecidos da **Função** para definir os números de `a`, `b`, `c`

---

### Versão **3.1** - Correção de `bugs` e melhorias

> **Linhas nesta versão:** *`786`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-03`*

#### Adições
- Adicionadas páginas na **Função Quadrática**, com definição de um novo tipo de menu e opções globais
- Adição da marca d'água

#### Mudanças
- É mostrada a **Função** antes de pedir os pontos conhecidos
- As opções de menu *Rever (8)* e *Mudar (9)* passaram a ter sempre os mesmos valores de opção em **Funções Constantes**

#### Correções
- Corrigidos os `bugs` que surgiram com a atualização da Versão 3.0

#### Menus
* **Quadrática:**
    * **Página 1:**
        + 1 = Concavidade
        + 2 = Raízes
        + 3 = Vértice
        + 4 = Ponto que cruza o eixo do X
        + 5 = Ponto que cruza o eixo do Y
    * **Página 2:**
        + 1 = Atribuir valores para X
        + 2 = Atribuir valores para Y
        + 3 = Estudo do Sinal
        + 4 = `N/A`
        + 5 = `N/A`
    * **Globais:**
        + 6 = Avançar página
        + 7 = Voltar página
        + 8 = Rever
        + 9 = Mudar
        + 0 = Sair

---

### Versão **3.2** - Variáveis nas **Funções Exponenciais**

> **Linhas nesta versão:** *`1068`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionadas variáveis para a **Função Exponencial** *(Ainda não é possível resolver variáveis quando não há o valor de `b`)*
- Adicionados o domínio e a imagem da **Função**
- Adicionados *Rever* e *Mudar* quando é escolhido o tipo da **Função**

#### Mudanças
- O menu da **Função Afim** tem páginas

#### Correções
- Corrigidos alguns erros com `NaN`
- Tratados novos erros, como quando o `prompt` é cancelado `(v == null)`

#### Menus
* **Constante:**
    + 1 = Domínio
    + 2 = Imagem
    + ...
* **Afim:**
    * **Página 1:**
        + 1 = Inclinação
        + 2 = Raiz
        + 3 = Ponto que cruza o eixo do X
        + 4 = Ponto que cruza o eixo do Y
        + 5 = Atribuir valores para X
    * **Página 2:**
        + 1 = Atribuir valores para Y
        + 2 = Estudo do Sinal
        + 3 = Domínio
        + 4 = Imagem
        + 5 = `N/A`
    * **Globais:**
        + ...
* **Quadrática:**
    * **Página 2:**
        + ...
        + 4 = Domínio
        + 5 = Imagem

#### Histórico
- E com isso, foram ultrapassadas 1000 linhas de código **(Dia: *`2025-09-11`*; Hora: *`18:00`*)**

### Versão **3.3** - Melhorias

> **Linhas nesta versão:** *`1068`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionadas declarações *let*

---

# Versões **4.x**

> **Linhas nestas versões:** *`1568`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

### Versão **4.0** - **Funções JS**

> **Linhas nesta versão:** *`1220`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Adições
- Adicionadas **Funções JS**
- Adicionadas equações entre **Funções** *(exceto **Exponenciais**)*

#### Mudanças
- Mudados alguns nomes de variáveis
- Melhorias em alguns pontos do código

#### Correções
- Correção de `bugs`

---

### Versão **4.1** - Melhorias

> **Linhas nesta versão:** *`1220`*<br>
> **Datada de:** *`2025-10-18 -> 2025-12-30`*

#### Adições
- Adicionadas **Funções JS** para cada uma das **Funções Matemáticas** *(exceto **Exponencial**)*

#### Mudanças
- Melhorias nas **Funções JS**
- Padronização dos menus, criando opções globais

#### Correções
- Correção de `bugs`

#### Menus
* **Globais:**
    + ...
    + 6 = Avançar página
    + 7 = Voltar página
    + 8 = Rever
    + 9 = Mudar
    + 0 = Sair

---

### Versão **4.2** - **Funções JS** nas **Funções Exponenciais**

> **Linhas nesta versão:** *`1209`*<br>
> **Datada de:** *`2025-09-17 -> 2025-12-30`*

#### Adições
- Adicionadas **Funções JS** para **Funções Exponenciais**

#### Mudanças
- Melhorias em partes do código

#### Correções
- Correção de `bugs`

---

### Versão **4.3** - Melhorias

> **Linhas nesta versão:** *`1450`*<br>
> **Datada de:** *`2025-10-31 -> 2025-12-30`*

#### Adições
- Adicionado um menu global para as **Funções Exponenciais**
- Adicionado um novo tipo de menu inicial

#### Mudanças
- Melhorias nas **Funções Exponenciais**
- Melhorias no código

#### Menus
* **Exponenciais:**
    * **Página 1:**
        + 1 = Inclinação
        + 2 = Raiz
        + 3 = Assíntota
        + ...
    * **Página 2:**
        + ...
    * **Página 3:**
        + ...

* **Menu inicial:**
    + 1 = **Funções Polinomiais**
    + 2 = **Funções não Polinomiais**

* **Submenus:**
    * **Funções Polinomiais:**
        + 1 = **Quadrática, Afim, Constante**
    * **Funções não Polinomiais:**
        + 1 = **Exponencial**
        + 2 = **Logarítmica**

---

### Versão **4.4** - **Funções Logarítmicas**

> **Linhas nesta versão:** *`1450`*<br>
> **Datada de:** *`2025-10-31 -> 2025-12-30`*

#### Adições
- Adicionadas **Funções Logarítmicas**
- Adicionadas as **Funções JS** de `log` e `ln`

#### Menus
* **Logarítmica:**
    * **Página 1:**
        + 1 = Curva
        + 2 = Raiz
        + ...
    * **Página 2:**
        + ...

#### Histórico
- E com isso, foram ultrapassadas 1500 linhas de código **(Dia: *`2025-11-26`*; Hora: *`10:00`*)**

---

### Versão **4.5** - Lançamento Oficial

> **Linhas nesta versão:** *`1568`*<br>
> **Datada de:** *`2025-12-30 -> 2026-03-04`*

#### Correções
- Correção de `bugs`

#### Histórico
- Depois de muito tempo, foi lançada a Versão Oficial **(Dia: *`2025-11-27`*; Hora: *`18:00`*)**

---

# Versões **5.x**

> **Linhas nestas versões:** *`3255`*<br>
> **Datada de:** *`2025-11-26 -> 2026-03-09`*

### Versão **5.0** - Reestruturação do Código

> **Linhas nesta versão:** *`1483`*<br>
> **Datada de:** *`2026-03-07 -> 2026-03-17`*

#### Adições
- Adicionada a **Função JS** `erro`, que padroniza as mensagens de erro para melhor entendimento

#### Mudanças
- Mudança técnica no código principal, sem muitas alterações para o usuário
- Mudança das mensagens para o usuário, com utilização dos comandos Unicode para melhor entendimento — sem alterações no código
- Mudados os nomes das variáveis para melhor entendimento — sem alterações no código

---

### Versão **5.1** - Melhorias

> **Linhas nesta versão:** *`1755`*<br>
> **Datada de:** *`2026-02-07 -> 2026-02-08`*

#### Adições
- Adicionadas configurações

#### Mudanças
- Então, por causa das configurações, várias **Funções JS** e variáveis podem ser mudadas conforme o que o usuário quiser
- A opção *Sair* dos menus foi alterada para *Voltar ao menu principal* — só há *Sair* nos menus do menu principal

#### Menus
* **Configurações:**
    + 1 = Quantidade de casas decimais
    + 2 = Confirmações de entrada
    + 3 = Mensagens de erro
    + 4 = Caracteres Unicode
    + 5 = Explicações
    + 6 = Mostrar **Função**
    + 7 = Acentos
    + 8 = Minúsculas
    + 9 = Ponto decimal

---

### Versão **5.2** - Objetos e Melhorias das Configurações

> **Linhas nesta versão:** *`1867`*<br>
> **Datada de:** *`2026-02-08 -> 2026-02-09`*

#### Mudanças
- As **Funções JS** foram unidas em objetos para melhor entendimento do código
- As configurações têm uma forma padrão
- As configurações têm a opção *Voltar ao padrão*
- O menu das configurações tem páginas com *Avançar página* e *Voltar página*

#### Correções
- Corrigidas algumas falhas técnicas, como a adição permanente de `N/A` ao fim dos arrays do menu

#### Menus
* **Configurações:**
    * **Página 1:**
        + 1 = Quantidade de casas decimais — **Padrão:** `6`
        + 2 = Confirmações de entrada — **Padrão:** `Não`
        + 3 = Mensagens de erro — **Padrão:** `Sim`
        + 4 = Caracteres Unicode — **Padrão:** `Sim`
        + 5 = Explicações — **Padrão:** `Sim`
        + 6 = Mostrar **Função** — **Padrão:** `Sim`
    * **Página 2:**
        + 1 = Acentos — **Padrão:** `Sim`
        + 2 = Minúsculas — **Padrão:** `Não`
        + 3 = Ponto decimal — **Padrão:** `Não`
        + 4 = Precisão do `log` — **Padrão:** `1e-12`
        + 5 = Multiplicação simples — **Padrão:** `Não`
    * **Globais:**
        + 7 = Voltar ao padrão
        + 8 = Avançar página
        + 9 = Voltar página
        + 0 = Voltar ao menu principal

---

### Versão **5.3.1** - Melhorias nas Configurações

> **Linhas nesta versão:** *`2162`*<br>
> **Datada de:** *`2026-02-09 -> 2026-03-03`*

#### Adições
- Adicionadas novas configurações

#### Mudanças
- As configurações foram separadas por tipos

#### Menus
* **Configurações:**
    * **Página 1 *(Visual)*:**
        + 1 = Unicode
        + 2 = Explicações
        + 3 = Acentos
        + 4 = Capitalizadas
        + 5 = Maiúsculas
        + 6 = Minúsculas
    * **Página 2 *(Mensagens)*:**
        + 1 = Ponto decimal
        + 2 = Multiplicação simples
        + 3 = Confirmações de entrada
        + 4 = Confirmações de saída
        + 5 = Mensagens de erro
        + 6 = Mostrar **Função**
    * **Página 3 *(Números)*:**
        + 1 = Casas decimais
        + 2 = Precisão do `log`
        + 3 = Limite de iterações

#### Histórico
- E com isso, foram ultrapassadas 2000 linhas de código **(Dia: *`2026-02-10`*; Hora: *`02:00`*)**

---

### Versão **5.3.2** - Melhorias nas **Funções Logarítmicas**

> **Linhas nesta versão:** *`2162`*<br>
> **Datada de:** *`2026-02-09 -> 2026-03-03`*

#### Adições
- Adicionadas variáveis para as **Funções Logarítmicas** também

#### Mudanças
- Melhoradas as exibições de bases

#### Correções
- Corrigidos alguns erros com o `log` e o `ln`

---

### Versão **5.3.3** - Melhorias de `UI` e `UX`

> **Linhas nesta versão:** *`2162`*<br>
> **Datada de:** *`2026-02-09 -> 2026-03-03`*

#### Mudanças
- Melhorias na formatação dos `alerts`, `prompts` e erros — por exemplo: `=== Aviso ===`
- Padronização das opções globais dos menus *(quando aplicável)*, para que fiquem mais intuitivas *(pois, se fosse um menu interativo, a opção de **Próxima** estaria à direita e **Anterior**, à esquerda)*
- Trocada a padronização dos menus de `N/A` para `---` *(com a intenção de mostrar que aquela opção não existe, ao invés de mostrar que ela existe mas não tem função)*
- Reestruturação na **Função** de entrada de dados para melhor entendimento do código
- Editada a exibição dos menus, com um rodapé visual com as opções globais
- Feitas algumas outras mudanças para melhor entendimento

#### Correções
- Corrigidos diversos erros de português, incluindo: espaços extras, concordância, gramática, etc.
- Correção de `bugs` com `NaN` e `Infinity` em várias partes do código

#### Menus
* **Globais:**
    + 6 = Rever
    + 7 = Alterar
    + 8 = Anterior
    + 9 = Próxima
    + 0 = Voltar

---

### Versão **5.4** - Melhorias

> **Linhas nesta versão:** *`2268`*<br>
> **Datada de:** *`2026-02-24 -> 2026-03-06`*

#### Adições
- Criada a **Função** `intervalo` para medir um intervalo
- Adicionados vários tipos especiais de **Funções**, tais como **Quadrática** pura, **Exponencial** natural, etc.
- Adicionados comentários para vários pontos do código

#### Mudanças
- Dividida a precisão do `log` para que exista também a precisão da divisão
- Mudados todos os nomes para que fiquem mais coerentes e consistentes

---

### Versão **5.5** - Melhorias

> **Linhas nesta versão:** *`3255`*<br>
> **Datada de:** *`2026-03-07 -> 2026-03-17`*

#### Adições
- Adicionados `helpers` para ajudar a minimizar o código
- **Funções** podem agora ser salvas
- **Funções** podem agora ser recuperadas, com histórico *(enquanto o programa não é fechado)*
- Adicionados vários comentários para melhor entendimento do código *(com o uso de Inline Suggestions do GitHub Copilot)*
- Adicionada a tradução para o inglês no código *(em desenvolvimento)*

#### Mudanças
- Algumas mensagens foram atualizadas por causa da padronização
- Melhorias em partes do código

#### Correções
- Correção de `bugs`

---

# Versões **6.x**

> **Linhas nestas versões:** *`3296`*<br>
> **Datada de:** *`2026-03-18 -> 2026-03-19`*

### Versão **6.0** - Lançamento

> **Linhas nesta versão:** *`3296`*<br>
> **Datada de:** *`2026-03-18 -> 2026-03-19`*

#### Adições
- Adicionados comandos com `/` para acessar de vários lugares as opções de:
    + Ajuda com comandos `/help`
    + Configurações `/config`
    + Sair `/exit`

- Todos os comandos têm versão funcional em inglês e português, para que seja mais acessível
- Todos os comandos têm variações, por exemplo:
    + `///` => `/exit`
    + `/configuracoes` => `/config`
    + `/cmd` => `/help`

#### Mudanças
- Lançamento oficial no GitHub
- Mudados os nomes das variáveis no código para que fiquem mais intuitivas

---

# **Próximas atualizações:**
+ Adicionar opção de verificar quais **Funções** podem ser válidas para os pontos conhecidos
+ Adicionar comandos com `/` para acessar as **Funções JS** e as **Funções de Ajuda**
+ Adicionar ajuda, resumos, relatórios, etc. para cada tipo de **Função**
+ Adicionar uma **Função** que faz contas de maneira segura
+ Adicionar equações entre **Funções Exponenciais**
+ Adicionar uma forma de achar `a` em **Funções Exponenciais**
+ Adicionar **Funções Trigonométricas** e suas propriedades

---

<!--
# Versões **6.x**

> **Linhas nestas versões:** *`3000`*<br>
> **Datada de:** *`2026-03-DD -> 2026-03-DD`*

## Versão **6.x** - ""

> **Linhas nesta versão:** *`3000`*<br>
> **Datada de:** *`2026-03-DD -> 2026-03-DD`*

### Adições


### Mudanças


### Correções


### Remoções


### Menus
-->
