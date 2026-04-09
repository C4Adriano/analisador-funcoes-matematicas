# Sistema de Versionamento e Commits

## Versão — `MAJOR.MINOR.PATCH`

| Número  | Quando incrementar                                             |
| ------- | -------------------------------------------------------------- |
| `MAJOR` | Nova função matemática, reformulação pesada, breaking change   |
| `MINOR` | Feature nova pequena, novo comando, nova opção de configuração |
| `PATCH` | Bug fix, texto, tradução, refatoração, config                  |

- Ao incrementar `MAJOR`, zera `MINOR` e `PATCH`
- Ao incrementar `MINOR`, zera só `PATCH`

## Tipos de Commit

### ➕ Adições

- `add` — Nova função, arquivo, feature, recurso
- `doc` — Qualquer arquivo `.md`, comentários, README
- `tst` — Adicionar ou corrigir testes

### ✏️ Mudanças Mínimas

- `txt` — Palavras, nomes de variáveis, mensagens ao usuário
- `fmt` — Espaços, vírgulas, indentação, Prettier
- `lng` — Traduções, PT-BR/EN
- `cfg` — `.json`, `.yml`, `package.json`, configs do projeto

### 🔧 Mudanças Médias

- `fix` — Comportamento errado sendo corrigido
- `rfr` — Reorganização sem mudar o que o código faz
- `prf` — Mesmo resultado, mais rápido ou eficiente

### 🔨 Mudanças Grandes

- `ovr` — Reescrita ou reformulação pesada de algo existente
- `brk` — Mudança que quebra compatibilidade com versão anterior

### 🗑️ Remoções

- `rmv` — Deletar função, arquivo ou recurso inteiro

### ↩️ Controle

- `rvt` — Desfazer um commit anterior

### Impacto na versão

| Tipo                                            | Impacto                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `add` grande, `ovr`, `brk`                      | `MAJOR`                                  |
| `add` pequeno, `fix` de feature                 | `MINOR`                                  |
| `fix`, `rfr`, `txt`, `fmt`, `lng`, `cfg`, `doc` | `PATCH`                                  |
| `rmv`                                           | `MINOR` ou `MAJOR` dependendo do impacto |

## Fluxo

```text
commit → commit → commit...
              ↓
           push (MINOR)

commit → commit → commit...
              ↓
     push + Release (MAJOR)
```

- **Commit:** a cada mudança atômica, local
- **Push:** ao completar um MINOR
- **Push + Release:** ao completar um MAJOR

---
