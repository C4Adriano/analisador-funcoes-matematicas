<div align="center">
    <h1><b>Analisador de Funções Matemáticas</b></h1>
    <h2>LEIA-ME <em>(README)</em></h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - presente</em></p>
</div>

---

🌐 [Voltar à Documentação](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/README/README_EN.md)

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

1. Abra [`index.html`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/index.html) no navegador
2. Siga os menus nos `prompts` e `alerts`

Obs.: Não é necessário instalar nada.

Ou acesse diretamente: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### [Estrutura do código](https://github.com/C4Adriano/analisador-funcoes-matematicas/tree/main/src)

| Objeto                                                                                              | Responsabilidade                                         |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [`algebra`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/algebra.js)   | Cálculos **Matemáticos** (log, ln, divisão segura, etc.) |
| [`analyze`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/analyze.js)   | Análise de cada tipo de função                           |
| [`checks`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/checks.ts)     | Verificações de tipo para os arquivos `.ts`              |
| [`commands`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/commands.js) | Comandos do **Programa**                                 |
| [`config`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/config.ts)     | Configurações globais do **Programa**                    |
| [`error`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/error.ts)       | Mensagens de erro padronizadas                           |
| [`helpers`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/helpers.js)   | Cálculos e montagem de resultados comuns                 |
| [`i18n`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/i18n.ts)         | Funções de idioma _(internacionalização)_                |
| [`main`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/main.js)         | Orquestra o **Programa**                                 |
| [`state`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/state.ts)       | Gerenciamento do estado do **Programa**                  |
| [`ui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/ui.js)             | Interação com o usuário (menus, entradas, erros)         |
| [`values`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/values.ts)     | Tipos compartilhados para os arquivos `.ts`              |
| [`version`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/version.js)   | Versão atual                                             |
| [`writing`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/writing.js)   | Formatação, tradução e conversão de texto                |

### Registro de Alterações resumido

| Versão                                                                                                                                                                                                      | Destaque                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [1.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-10---fun%C3%A7%C3%B5es-quadr%C3%A1ticas-afins-e-constantes)                          | **Funções Quadráticas, Afins e Constantes**               |
| [2.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-21---fun%C3%A7%C3%A3o-exponencial)                                                   | **Funções Exponenciais**                                  |
| [3.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-30---vari%C3%A1veis-a-b-c-nas-fun%C3%A7%C3%B5es-quadr%C3%A1ticas-afins-e-constantes) | Coeficientes como variáveis (incógnitas)                  |
| [4.4](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-44---fun%C3%A7%C3%B5es-logar%C3%ADtmicas)                                            | **Funções Logarítmicas**                                  |
| [4.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-45---lan%C3%A7amento-oficial)                                                        | Pré-Lançamento                                            |
| [5.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-51---melhorias)                                                                      | Sistema de configurações                                  |
| [5.2](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-52---objetos-e-melhorias-das-configura%C3%A7%C3%B5es)                                | Objetos **_JS_**. Padrão de configurações                 |
| [5.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-55---melhorias)                                                                      | Objeto `helpers`, histórico de **Funções**, tradução _EN_ |
| [6.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-60---lan%C3%A7amento)                                                                | Lançamento no **GitHub**                                  |

**Registro de Alterações** completo **[`aqui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md)**.

### Próximas Atualizações resumidas

- Traduções em _Espanhol_ e outros idiomas
- Melhorias internas de código, como a passagem para **_TS_**

**Próximas Atualizações** completas **[`aqui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_PT.md)**

### Documentação

- **[Perguntas Frequentes](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ/FAQ_PT.md)**
- **[Glossário](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/GLOSSARY/GLOSSARY_PT.md)**
- **[Registro de Alterações](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md)**
- **[Próximas Atualizações](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_PT.md)**
- **[Código de Conduta](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CODE_OF_CONDUCT/CODE_OF_CONDUCT_PT.md)**
- **[Contribuindo](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTING/CONTRIBUTING_PT.md)**
- **[Contribuidores](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTORS/CONTRIBUTORS_PT.md)**
- **[Política de Segurança](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/SECURITY.md)**
- **[Licença](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/LICENSE.md)**

### Tecnologias

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---
