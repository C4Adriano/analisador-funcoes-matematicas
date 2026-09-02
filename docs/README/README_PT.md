<div align="center">
    <h1><b>Analisador de Funções Matemáticas</b></h1>
    <h2>LEIA-ME <em>(README)</em></h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - presente</em></p>
</div>

---

🌐 [Voltar à Documentação][Docs] | 🌐 [Voltar ao Geral][Main] | 🇺🇸 [English][EN]

---

[![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

---

### O que é?

Uma ferramenta interativa, rodando no navegador, que analisa **Funções Matemáticas** e exibe suas propriedades passo a passo — com explicações detalhadas opcionais.

Desenvolvida principalmente em **_JavaScript_** puro, com módulos curtos e simples escritos em **_TypeScript_** para checagem de tipos durante o desenvolvimento.

### Funcionalidades

- **Funções suportadas: Constante, Afim, Quadrática, Exponencial, Logarítmica, Seno, Cosseno, Tangente** e mais.
- **Análises disponíveis:** Domínio, Imagem, Raízes, Vértice, Interseções com os eixos, Estudo do Sinal, Assíntota, Curva, Valores de `x` e `y`, Equações entre **Funções**, etc.
- **Coeficientes variáveis:** `a`, `b`, `c` podem ser deixados como incógnitas — o **Programa** calcula seus valores a partir de pontos conhecidos.
- **Histórico:** Salva e recupera **Funções** anteriores durante a sessão.
- **Configurações: _Unicode_**, acentos, casas decimais, formatação de texto, separador decimal, precisão de log e divisão, limite de iterações, idioma _(PT-BR / EN)_ e mais.
- **Bilíngue: Português Brasileiro** _(PT-BR)_ e **Inglês** _(EN)_.

### Como usar

1. Abra [`index.html`](../../index.html) no navegador
2. Siga os menus nos `prompts` e `alerts`

Obs.: Não é necessário instalar nada.

Ou acesse diretamente: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### [Estrutura do código](https://github.com/C4Adriano/analisador-funcoes-matematicas/tree/main/src)

| Objeto         | Responsabilidade                                         |
| -------------- | -------------------------------------------------------- |
| [algebra]      | Cálculos **Matemáticos** (log, ln, divisão segura, etc.) |
| [analyze]      | Análise de cada tipo de função                           |
| [checks]       | Verificações de tipo para os arquivos `.ts`              |
| [commands]     | Comandos do **Programa**                                 |
| [config]       | Configurações globais do **Programa**                    |
| [error]        | Mensagens de erro padronizadas                           |
| [helpers]      | Cálculos e montagem de resultados comuns                 |
| [i18n]         | Funções de idioma _(internacionalização)_                |
| [main][mainJS] | Orquestra o **Programa**                                 |
| [state]        | Gerenciamento do estado do **Programa**                  |
| [ui]           | Interação com o usuário (menus, entradas, erros)         |
| [values]       | Tipos compartilhados para os arquivos `.ts`              |
| [version]      | Versão atual                                             |
| [writing]      | Formatação, tradução e conversão de texto                |

### Registro de Alterações resumido

| Versão          | Destaque                                           |
| --------------- | -------------------------------------------------- |
| [1.0][V1-0]     | **Funções Constantes, Afins e Quadráticas**        |
| [2.x][V2-X]     | Funções Exponenciais                               |
| [3.x][V3-X]     | Resolução de variáveis por pontos, páginas de menu |
| [4.x][V4-X]     | **Funções JS**, equações entre **Funções**         |
| [5.x][V5-X]     | **Funções Logarítmicas**, histórico, tradução _EN_ |
| [6.0.0][V6-0-0] | Lançamento no **GitHub**                           |
| [6.1.0][V6-1-0] | **Funções Trigonométricas**                        |

**Registro de Alterações** completo **[`aqui`][CHANGELOG]**.

### Próximas Atualizações resumidas

- Traduções em _Espanhol_ e outros idiomas
- Melhorias internas de código, como a passagem para **_TS_**

**Próximas Atualizações** completas **[`aqui`][ROADMAP]**

### Documentação

- **[Registro de Alterações][CHANGELOG]**
- **[Próximas Atualizações][ROADMAP]**
- **[Contribuidores][Contributors]**
- **[Política de Segurança][SECURITY]**
- **[Licença][LICENSE]**

### Tecnologias

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---

[Docs]: ../../README.md
[Main]: ../README.md
[EN]: ../README/README_EN.md
[algebra]: ../../src/algebra.js
[analyze]: ../../src/analyze.js
[checks]: ../../src/checks.js
[commands]: ../../src/commands.js
[config]: ../../src/config.ts
[error]: ../../src/errors.js
[helpers]: ../../src/helpers.js
[i18n]: ../../src/i18n.ts
[mainJS]: ../../src/main.js
[state]: ../../src/state.ts
[ui]: ../../src/ui.js
[values]: ../../src/values.d.ts
[version]: ../../src/version.js
[writing]: ../../src/writing.js
[CHANGELOG]: ../CHANGELOG/CHANGELOG_PT.md
[V1-0]: ../CHANGELOG/CHANGELOG_PT.md#10
[V2-X]: ../CHANGELOG/CHANGELOG_PT.md#2x
[V3-X]: ../CHANGELOG/CHANGELOG_PT.md#3x
[V4-X]: ../CHANGELOG/CHANGELOG_PT.md#4x---2025-11-27
[V5-X]: ../CHANGELOG/CHANGELOG_PT.md#5x
[V6-0-0]: ../CHANGELOG/CHANGELOG_PT.md#600---2026-03-19
[V6-1-0]: ../CHANGELOG/CHANGELOG_PT.md#610
[ROADMAP]: ../ROADMAP/ROADMAP_PT.md
[LICENSE]: (../../LICENSE.md)
[SECURITY]: (../SECURITY.md)
[Contributors]: (../CONTRIBUTORS/CONTRIBUTORS_PT.md)
