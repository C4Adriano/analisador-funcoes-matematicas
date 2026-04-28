# Arquitetura do Projeto

## Estrutura de Módulos

| Arquivo       | Responsabilidade                          |
| ------------- | ----------------------------------------- |
| `main.js`     | Ponto de entrada; inicializa o programa   |
| `state.js`    | Estado global da sessão                   |
| `analisar.js` | Lógica de análise das funções matemáticas |
| `algebra.js`  | Cálculos matemáticos puros                |
| `ui.js`       | Manipulação do DOM e interface            |
| `escrita.js`  | Formatação e exibição de texto            |
| `comandos.js` | Processamento de slash commands           |
| `config.js`   | Sistema de configurações                  |
| `helpers.js`  | Funções utilitárias reutilizáveis         |
| `erro.js`     | Tratamento de erros                       |
| `teste.js`    | Utilitários de debug e teste              |

## Fluxo Geral

`main.js` → lê input do usuário → `analisar.js` → `algebra.js` → `escrita.js` → `ui.js`

---
