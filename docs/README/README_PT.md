<div align="center">
    <h1>Analisador de <b>Funções Matemáticas</b></h1>
    <h2>README</h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

🌐 [Voltar à Documentação](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/README/README_EN.md)

---

[![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

---

### O que é?

Uma ferramenta interativa, rodando no navegador, que analisa funções matemáticas e exibe suas propriedades passo a passo — com explicações detalhadas opcionais.

Desenvolvida inteiramente em JavaScript puro, sem bibliotecas externas.

### Funcionalidades

- **Funções suportadas:** Constante, Afim, Quadrática, Exponencial e Logarítmica
- **Análises disponíveis:** Domínio, Imagem, Raízes, Vértice, Interseções com os eixos, Estudo do sinal, Assíntota, Curva, Valores de `x` e `y`, Equações entre funções
- **Coeficientes variáveis:** `a`, `b`, `c` podem ser deixados como incógnitas — o programa calcula seus valores a partir de pontos conhecidos
- **Histórico:** Salva e recupera funções anteriores durante a sessão
- **Configurações:** Unicode, acentos, casas decimais, capitalização, separador decimal, precisão de log e divisão, limite de iterações, idioma (PT-BR / EN) e mais
- **Bilíngue:** Português Brasileiro e Inglês _(em desenvolvimento)_

### Como usar

1. Clone ou baixe o repositório
2. Abra [`index.html`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/index.html) no navegador
3. Siga os menus nos `prompts` e `alerts`

Não é necessário instalar nada.

Ou acesse diretamente: [![GitHub Pages](https://img.shields.io/badge/Access%20here-GitHub%20Pages-blue)](https://c4adriano.github.io/analisador-funcoes-matematicas/)

### [Estrutura do código](https://github.com/C4Adriano/analisador-funcoes-matematicas/tree/main/src/JS)

| Objeto                                                                                                 | Responsabilidade                                     |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [`config`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/config.js)     | Configurações globais do programa                    |
| [`helpers`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/helpers.js)   | Cálculos e montagem de resultados comuns             |
| [`escrita`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/escrita.js)   | Formatação, tradução e conversão de texto            |
| [`ui`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/ui.js)             | Interação com o usuário (menus, entradas, erros)     |
| [`erro`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/erro.js)         | Mensagens de erro padronizadas                       |
| [`algebra`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/algebra.js)   | Cálculos matemáticos (log, ln, divisão segura, etc.) |
| [`analisar`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/src/JS/analisar.js) | Análise de cada tipo de função                       |

### Histórico resumido

| Versão                                                                                                                                                                                                      | Destaque                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [1.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-10---fun%C3%A7%C3%B5es-quadr%C3%A1ticas-afins-e-constantes)                          | Funções Quadráticas, Afins e Constantes             |
| [2.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-21---fun%C3%A7%C3%A3o-exponencial)                                                   | Funções Exponenciais                                |
| [3.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-30---vari%C3%A1veis-a-b-c-nas-fun%C3%A7%C3%B5es-quadr%C3%A1ticas-afins-e-constantes) | Coeficientes como variáveis (incógnitas)            |
| [4.4](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-44---fun%C3%A7%C3%B5es-logar%C3%ADtmicas)                                            | Funções Logarítmicas                                |
| [4.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-45---lan%C3%A7amento-oficial)                                                        | Pré-Lançamento                                      |
| [5.1](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-51---melhorias)                                                                      | Sistema de configurações                            |
| [5.2](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-52---objetos-e-melhorias-das-configura%C3%A7%C3%B5es)                                | Objetos JS, padrão de configurações                 |
| [5.5](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-55---melhorias)                                                                      | Objeto `helpers`, histórico de funções, tradução EN |
| [6.0](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md#vers%C3%A3o-60---lan%C3%A7amento)                                                                | Lançamento no GitHub                                |

Changelog completo em [`CHANGELOG`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md).

### Próximas atualizações

- Verificar quais funções são válidas para pontos conhecidos
- Comandos com `/` para acesso rápido _(em desenvolvimento)_
- Ajuda, resumos e relatórios por tipo de função
- Equações entre Funções Exponenciais

Próximas atualizações completo em [`ROADMAP`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_PT.md)

### Tecnologias

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)

---
