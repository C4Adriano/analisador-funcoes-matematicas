<div align="center">
    <h1>Mathematical <b>Function Analyzer</b></h1>
    <h2>CHANGELOG</h2>
    <p>All rights reserved © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

🌐 [Back to Documentation](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Back to main](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/CHANGELOG.md) | 🇧🇷 [Português](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md)

---

> **Total lines:** _`3296`_<br>
> **Dated:** _`2025-07-23 -> today`_

---

# Versions **1.x**

> **Lines in these versions:** _`185`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

---

### Version **1.0** - **Quadratic, Linear, and Constant Functions**

> **Lines in this version:** _`185`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Separated **Constant, Linear, and Quadratic Functions**
- All calculations performed with `a`, `b`, `c`, regardless of their values
- Distinct menus displayed for each **Function**
- Errors displayed when necessary
- The _Exit_ menu option was permanently set to 0

#### Menus

- **Constant:**
    - 1 = Review
    - 2 = Change
    - 0 = Exit
- **Linear:**
    - 1 = Slope
    - 2 = Root
    - 3 = Point X
    - 4 = Point Y
    - 5 = Review
    - 6 = Change
    - 0 = Exit
- **Quadratic:**
    - 1 = Concavity
    - 2 = Roots
    - 3 = Vertex
    - 4 = Point X
    - 5 = Point Y
    - 6 = Review
    - 7 = Change
    - 0 = Exit

---

### Version **1.1** - Improvements to `alerts`

> **Lines in this version:** _`185`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Defined a variable to control the `alert` message: `t`

#### Changes

- Changed the `alert` message when the value is negative or zero

---

# Versions **2.x**

> **Lines in these versions:** _`422`_<br>
> **Dated:** _`2025-07-23 -> 2026-03-04`_

### Version **2.0** - Improvements

> **Lines in this version:** _`422`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added the ability to perform calculations with **Quadratic and Linear Functions**
- Calculations for `y`, given `x`
- Calculations for `x`, given `y`
- Added several options at the end of the menus, before _Review_, _Change_, and _Exit_

#### Menus

- **Linear:**
    - ...
    - 5 = Assign values for X
    - 6 = Assign values for Y
    - 7 = Review
    - 8 = Change
    - 0 = Exit
- **Quadratic:**
    - ...
    - 6 = Assign values for X
    - 7 = Assign values for Y
    - 8 = Review
    - 9 = Change
    - 0 = Exit

---

### Version **2.1** - **Exponential Function**

> **Lines in this version:** _`422`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added the **Exponential Function**
- Added a new menu for the **Exponential Function**

#### Changes

- Updated the variable `t` to control which type of **Function** the user wants

#### Menus

- **Type:**
    - 1 = **Quadratic, Linear, Constant**
    - 2 = **Exponential**
- **Exponential:**
    - 1 = Slope
    - 2 = Asymptote
    - 3 = Point that crosses the X axis
    - 4 = Point that crosses the Y axis
    - 5 = Assign values for X
    - 6 = Assign values for Y
    - 7 = Review
    - 8 = Change
    - 0 = Exit

---

### Version **2.2** - Improvements

> **Lines in this version:** _`422`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- When the **Exponential Function** becomes a **Constant**, values are adjusted and the **Constant Function** is displayed
- Defined whether the user should choose the values of `a`, `b`, `c`, and `t`

#### Changes

- The _Review (8)_ and _Change (9)_ menu options now always have the same option values in non-**Constant Functions**

---

# Versions **3.x**

> **Lines in these versions:** _`1068`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

### Version **3.0** - Variables `a`, `b`, `c` in **Quadratic, Linear, and Constant Functions**

> **Lines in this version:** _`785`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added the ability for `a`, `b`, `c` to be variables, with no value predefined by the user
- Added calculations using the **Function**'s known points to determine the values of `a`, `b`, `c`

---

### Version **3.1** - Bug fixes and improvements

> **Lines in this version:** _`786`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-03`_

#### Additions

- Added pages to the **Quadratic Function**, with a new type of menu and global options defined
- Added watermark

#### Changes

- The **Function** is now displayed before asking for known points
- The _Review (8)_ and _Change (9)_ menu options now always have the same option values in **Constant Functions**

#### Fixes

- Fixed the `bugs` that appeared with the Version 3.0 update

#### Menus

- **Quadratic:**
    - **Page 1:**
        - 1 = Concavity
        - 2 = Roots
        - 3 = Vertex
        - 4 = Point that crosses the X axis
        - 5 = Point that crosses the Y axis
    - **Page 2:**
        - 1 = Assign values for X
        - 2 = Assign values for Y
        - 3 = Sign study
        - 4 = `N/A`
        - 5 = `N/A`
    - **Global:**
        - 6 = Next page
        - 7 = Previous page
        - 8 = Review
        - 9 = Change
        - 0 = Exit

---

### Version **3.2** - Variables in **Exponential Functions**

> **Lines in this version:** _`1068`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added variables for the **Exponential Function** _(It is still not possible to solve variables when there is no value for `b`)_
- Added domain and range of the **Function**
- Added _Review_ and _Change_ when the **Function** type is selected

#### Changes

- The **Linear Function** menu now has pages

#### Fixes

- Fixed some errors with `NaN`
- Handled new errors, such as when `prompt` is cancelled `(v == null)`

#### Menus

- **Constant:**
    - 1 = Domain
    - 2 = Range
    - ...
- **Linear:**
    - **Page 1:**
        - 1 = Slope
        - 2 = Root
        - 3 = Point that crosses the X axis
        - 4 = Point that crosses the Y axis
        - 5 = Assign values for X
    - **Page 2:**
        - 1 = Assign values for Y
        - 2 = Sign study
        - 3 = Domain
        - 4 = Range
        - 5 = `N/A`
    - **Global:**
        - ...
- **Quadratic:**
    - **Page 2:**
        - ...
        - 4 = Domain
        - 5 = Range

#### History

- With this, 1000 lines of code were surpassed **(Day: _`2025-09-11`_; Time: _`18:00`_)**

### Version **3.3** - Improvements

> **Lines in this version:** _`1068`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added _let_ declarations

---

# Versions **4.x**

> **Lines in these versions:** _`1568`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

### Version **4.0** - **JS Functions**

> **Lines in this version:** _`1220`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Additions

- Added **JS Functions**
- Added equations between **Functions** _(except **Exponential**)_

#### Changes

- Renamed some variables
- Improvements in some parts of the code

#### Fixes

- Bug fixes

---

### Version **4.1** - Improvements

> **Lines in this version:** _`1220`_<br>
> **Dated:** _`2025-10-18 -> 2025-12-30`_

#### Additions

- Added **JS Functions** for each **Mathematical Function** _(except **Exponential**)_

#### Changes

- Improvements to **JS Functions**
- Standardization of menus, creating global options

#### Fixes

- Bug fixes

#### Menus

- **Global:**
    - ...
    - 6 = Next page
    - 7 = Previous page
    - 8 = Review
    - 9 = Change
    - 0 = Exit

---

### Version **4.2** - **JS Functions** in **Exponential Functions**

> **Lines in this version:** _`1209`_<br>
> **Dated:** _`2025-09-17 -> 2025-12-30`_

#### Additions

- Added **JS Functions** for **Exponential Functions**

#### Changes

- Improvements in parts of the code

#### Fixes

- Bug fixes

---

### Version **4.3** - Improvements

> **Lines in this version:** _`1450`_<br>
> **Dated:** _`2025-10-31 -> 2025-12-30`_

#### Additions

- Added a global menu for **Exponential Functions**
- Added a new type of initial menu

#### Changes

- Improvements to **Exponential Functions**
- Code improvements

#### Menus

- **Exponential:**
    - **Page 1:**
        - 1 = Slope
        - 2 = Root
        - 3 = Asymptote
        - ...
    - **Page 2:**
        - ...
    - **Page 3:**
        - ...

- **Initial menu:**
    - 1 = **Polynomial Functions**
    - 2 = **Non-Polynomial Functions**

- **Submenus:**
    - **Polynomial Functions:**
        - 1 = **Quadratic, Linear, Constant**
    - **Non-Polynomial Functions:**
        - 1 = **Exponential**
        - 2 = **Logarithmic**

---

### Version **4.4** - **Logarithmic Functions**

> **Lines in this version:** _`1450`_<br>
> **Dated:** _`2025-10-31 -> 2025-12-30`_

#### Additions

- Added **Logarithmic Functions**
- Added the **JS Functions** for `log` and `ln`

#### Menus

- **Logarithmic:**
    - **Page 1:**
        - 1 = Curve
        - 2 = Root
        - ...
    - **Page 2:**
        - ...

#### History

- With this, 1500 lines of code were surpassed **(Day: _`2025-11-26`_; Time: _`10:00`_)**

---

### Version **4.5** - Official Release

> **Lines in this version:** _`1568`_<br>
> **Dated:** _`2025-12-30 -> 2026-03-04`_

#### Fixes

- Bug fixes

#### History

- After a long time, the Official Version was released **(Day: _`2025-11-27`_; Time: _`18:00`_)**

---

# Versions **5.x**

> **Lines in these versions:** _`3255`_<br>
> **Dated:** _`2025-11-26 -> 2026-03-09`_

### Version **5.0** - Code Restructuring

> **Lines in this version:** _`1483`_<br>
> **Dated:** _`2026-03-07 -> 2026-03-17`_

#### Additions

- Added the **JS Function** `erro`, which standardizes error messages for better understanding

#### Changes

- Technical change to the main code, with few changes for the user
- Changed messages for the user, using Unicode commands for better understanding — no code changes
- Renamed variables for better understanding — no code changes

---

### Version **5.1** - Improvements

> **Lines in this version:** _`1755`_<br>
> **Dated:** _`2026-02-07 -> 2026-02-08`_

#### Additions

- Added settings

#### Changes

- As a result of the settings, several **JS Functions** and variables can now be changed according to the user's preferences
- The _Exit_ option in the Menus was changed to _Return to main menu_. _Exit_ only appears in the main menu's menus

#### Menus

- **Settings:**
    - 1 = Number of decimal places
    - 2 = Input confirmations
    - 3 = Error messages
    - 4 = Unicode characters
    - 5 = Explanations
    - 6 = Show **Function**
    - 7 = Accents
    - 8 = Lowercase
    - 9 = Decimal point

---

### Version **5.2** - Objects and Settings Improvements

> **Lines in this version:** _`1867`_<br>
> **Dated:** _`2026-02-08 -> 2026-02-09`_

#### Changes

- **JS Functions** were grouped into objects for better code understanding
- Settings now follow a standard format
- Settings now include a _Restore defaults_ option
- The settings menu now has pages with _Next page_ and _Previous page_

#### Fixes

- Fixed some technical issues, such as `N/A` being permanently added to the end of menu arrays

#### Menus

- **Settings:**
    - **Page 1:**
        - 1 = Number of decimal places — **Default:** `6`
        - 2 = Input confirmations — **Default:** `No`
        - 3 = Error messages — **Default:** `Yes`
        - 4 = Unicode characters — **Default:** `Yes`
        - 5 = Explanations — **Default:** `Yes`
        - 6 = Show **Function** — **Default:** `Yes`
    - **Page 2:**
        - 1 = Accents — **Default:** `Yes`
        - 2 = Lowercase — **Default:** `No`
        - 3 = Decimal point — **Default:** `No`
        - 4 = `log` precision — **Default:** `1e-12`
        - 5 = Simple multiplication — **Default:** `No`
    - **Global:**
        - 7 = Restore defaults
        - 8 = Next page
        - 9 = Previous page
        - 0 = Return to main menu

---

### Version **5.3.1** - Settings Improvements

> **Lines in this version:** _`2162`_<br>
> **Dated:** _`2026-02-09 -> 2026-03-03`_

#### Additions

- Added new settings

#### Changes

- Settings were separated by type

#### Menus

- **Settings:**
    - **Page 1 _(Visual)_:**
        - 1 = Unicode
        - 2 = Explanations
        - 3 = Accents
        - 4 = Capitalized
        - 5 = Uppercase
        - 6 = Lowercase
    - **Page 2 _(Messages)_:**
        - 1 = Decimal point
        - 2 = Simple multiplication
        - 3 = Input confirmations
        - 4 = Exit confirmations
        - 5 = Error messages
        - 6 = Show **Function**
    - **Page 3 _(Numbers)_:**
        - 1 = Decimal places
        - 2 = `log` precision
        - 3 = Iteration limit

#### History

- With this, 2000 lines of code were surpassed **(Day: _`2026-02-10`_; Time: _`02:00`_)**

---

### Version **5.3.2** - Improvements to **Logarithmic Functions**

> **Lines in this version:** _`2162`_<br>
> **Dated:** _`2026-02-09 -> 2026-03-03`_

#### Additions

- Added variables for **Logarithmic Functions** as well

#### Changes

- Improved base displays

#### Fixes

- Fixed some errors with `log` and `ln`

---

### Version **5.3.3** - `UI` and `UX` Improvements

> **Lines in this version:** _`2162`_<br>
> **Dated:** _`2026-02-09 -> 2026-03-03`_

#### Changes

- Improvements to the formatting of `alerts`, `prompts`, and errors — for example: `=== Warning ===`
- Standardization of global options in Menus _(where applicable)_, to make them more intuitive _(since, in an interactive menu, the **Next** option would be on the right and **Previous** on the left)_
- Changed menu padding standard from `N/A` to `---` _(to indicate that the option does not exist, rather than implying it exists but has no function)_
- Restructured the data input **Function** for better code understanding
- Updated menu display with a visual footer showing global options
- Several other changes made for better understanding

#### Fixes

- Fixed various writing errors, including: extra spaces, agreement, grammar, etc.
- Fixed `bugs` with `NaN` and `Infinity` in various parts of the code

#### Menus

- **Global:**
    - 6 = Review
    - 7 = Change
    - 8 = Previous
    - 9 = Next
    - 0 = Back

---

### Version **5.4** - Improvements

> **Lines in this version:** _`2268`_<br>
> **Dated:** _`2026-02-24 -> 2026-03-06`_

#### Additions

- Created the **Function** `intervalo` to measure an interval
- Added several special types of **Functions**, such as pure **Quadratic**, natural **Exponential**, etc.
- Added comments to several parts of the code

#### Changes

- Split `log` precision so that division precision also exists separately
- Renamed all identifiers for greater coherence and consistency

---

### Version **5.5** - Improvements

> **Lines in this version:** _`3255`_<br>
> **Dated:** _`2026-03-07 -> 2026-03-17`_

#### Additions

- Added `helpers` to help minimize the code
- **Functions** can now be saved
- **Functions** can now be retrieved, with history _(while the program is not closed)_
- Added several descriptive comments for better code understanding _(using GitHub Copilot Inline Suggestions)_
- Added English translation to the code _(in development)_

#### Changes

- Some messages were updated due to standardization
- Improvements in parts of the code

#### Fixes

- Bug fixes

---

# Versions **6.x**

> **Lines in these versions:** _`3296`_<br>
> **Dated:** _`2026-03-18 -> 2026-03-19`_

### Version **6.0** - Release

> **Lines in this version:** _`3296`_<br>
> **Dated:** _`2026-03-18 -> 2026-03-19`_

#### Additions

- Added `/` commands to access from various places the options for:
    - Help with commands `/help`
    - Review coefficients / function `/review`
    - History `/history`
    - Settings `/config`
    - Exit `/exit`

- All commands have working versions in both English and Portuguese, for greater accessibility
- All commands have variations, for example:
    - `///` => `/exit`
    - `/settings` => `/config`
    - `/cmds` => `/help`

#### Changes

- Official release on GitHub
- Renamed variables in the code to make them more intuitive

---

# **Upcoming updates:**

- Add option to verify which **Functions** can be valid for the known points
- Add `/` commands to access **JS Functions** and **Help Functions**
- Add help, summaries, reports, etc. for each type of **Function**
- Add a **Function** that performs calculations safely
- Add equations between **Exponential Functions**
- Add a way to find `a` in **Exponential Functions**
- Add **Trigonometric Functions** and their properties

Full upcoming updates in [`ROADMAP`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_EN.md)

---
