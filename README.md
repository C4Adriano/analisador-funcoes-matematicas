<div align="center">
    <h1>Analisador de <b>Funções Matemáticas</b></h1>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

## O que é?

Uma ferramenta interativa, rodando no navegador, que analisa funções matemáticas e exibe suas propriedades passo a passo — com explicações detalhadas opcionais.

Desenvolvida inteiramente em JavaScript puro, sem bibliotecas externas.

---

## Funcionalidades

- **Funções suportadas:** Constante, Afim, Quadrática, Exponencial e Logarítmica
- **Análises disponíveis:** Domínio, Imagem, Raízes, Vértice, Interseções com os eixos, Estudo do sinal, Assíntota, Curva, Valores de `x` e `y`, Equações entre funções
- **Coeficientes variáveis:** `a`, `b`, `c` podem ser deixados como incógnitas — o programa calcula seus valores a partir de pontos conhecidos
- **Histórico:** Salva e recupera funções anteriores durante a sessão
- **Configurações:** Unicode, acentos, casas decimais, capitalização, separador decimal, precisão de log e divisão, limite de iterações, idioma (PT-BR / EN) e mais
- **Bilíngue:** Português Brasileiro e Inglês *(em desenvolvimento)*

---

## Como usar

1. Clone ou baixe o repositório
2. Abra `matematica.html` no navegador
3. Siga os menus nos `prompts` e `alerts`

Não é necessário instalar nada.

---

## Estrutura do código

| Objeto | Responsabilidade |
|---|---|
| `config` | Configurações globais do programa |
| `ajudas` | Cálculos e montagem de resultados comuns |
| `escrita` | Formatação, tradução e conversão de texto |
| `ui` | Interação com o usuário (menus, entradas, erros) |
| `erro` | Mensagens de erro padronizadas |
| `algebra` | Cálculos matemáticos (log, ln, divisão segura, etc.) |
| `funcoes` | Análise de cada tipo de função |

---

## Histórico resumido

| Versão | Destaque |
|---|---|
| 1.0 | Funções Quadráticas, Afins e Constantes |
| 2.1 | Funções Exponenciais |
| 3.0 | Coeficientes como variáveis (incógnitas) |
| 4.4 | Funções Logarítmicas |
| 4.5 | Pré-Lançamento |
| 5.1 | Sistema de configurações |
| 5.2 | Objetos JS, padrão de configurações |
| 5.5 | Objeto `ajudas`, histórico de funções, tradução EN |
| 6.0 | Lançamento no GitHub |

Changelog completo em [`updates.md`](updates.md).

---

## Próximas atualizações

- Verificar quais funções são válidas para pontos conhecidos
- Comandos com `/` para acesso rápido
- Ajuda, resumos e relatórios por tipo de função
- Equações entre Funções Exponenciais

---

## Tecnologias

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
