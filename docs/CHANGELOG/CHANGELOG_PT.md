<div align="center">
    <h1><b>Analisador de Funções Matemáticas</b></h1>
    <h2>Registro de Alterações <em>(Changelog)</em></h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - presente</em></p>
</div>

---

🌐 [Voltar à Documentação](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/CHANGELOG.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_EN.md)

---

## Geral

> **Datado de:** _`2025-07-10 -> hoje`_

---

## Versões **1.x**

> **Linhas nestas versões:** _`185`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

---

### Versão **1.0** - **Funções Quadráticas, Afins e Constantes**

> **Linhas nesta versão:** _`165`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Separadas **Funções Constantes, Afins e Quadráticas**
- Realizadas todas as contas com `a`, `b`, `c`, independentemente dos seus valores
- Mostrados menus distintos para cada **Função**
- Mostrados erros quando necessários
- A opção de menu _Sair_ foi definida permanentemente como 0

#### Menus

- **Constante:**
    - 1 = Rever
    - 2 = Mudar
    - 0 = Sair
- **Afim:**
    - 1 = Inclinação
    - 2 = Raiz
    - 3 = Ponto X
    - 4 = Ponto Y
    - 5 = Rever
    - 6 = Mudar
    - 0 = Sair
- **Quadrática:**
    - 1 = Concavidade
    - 2 = Raízes
    - 3 = Vértice
    - 4 = Ponto X
    - 5 = Ponto Y
    - 6 = Rever
    - 7 = Mudar
    - 0 = Sair

---

### Versão **1.1** - Melhorias nos `alerts`

> **Linhas nesta versão:** _`185`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Definida uma variável para controlar a mensagem de `alert`: `t`

#### Mudanças

- Alterada a mensagem de `alert` quando o valor for negativo ou zero

---

## Versões **2.x**

> **Linhas nestas versões:** _`422`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

### Versão **2.0** - Melhorias

> **Linhas nesta versão:** _`≈ 296`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Adicionada a possibilidade de fazer contas com as **Funções Quadráticas e Afins**
- Contas para `y`, tendo o `x`
- Contas para `x`, tendo o `y`
- Adicionadas, ao fim dos menus, antes de _Rever_, _Mudar_ e _Sair_, várias opções

#### Menus

- **Afim:**
    - ...
    - 5 = Atribuir valores para X
    - 6 = Atribuir valores para Y
    - 7 = Rever
    - 8 = Mudar
    - 0 = Sair
- **Quadrática:**
    - ...
    - 6 = Atribuir valores para X
    - 7 = Atribuir valores para Y
    - 8 = Rever
    - 9 = Mudar
    - 0 = Sair

---

### Versão **2.1** - **Função Exponencial**

> **Linhas nesta versão:** _`≈ 402`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Adicionada a **Função Exponencial**
- Adicionado um novo menu para a **Função Exponencial**

#### Mudanças

- Atualizada a variável `t` para controlar qual tipo de **Função** o usuário quer

#### Menus

- **Tipo:**
    - 1 = **Quadrática, Afim, Constante**
    - 2 = **Exponencial**
- **Exponencial:**
    - 1 = Inclinação
    - 2 = Assíntota
    - 3 = Ponto que cruza o eixo do X
    - 4 = Ponto que cruza o eixo do Y
    - 5 = Atribuir valores para X
    - 6 = Atribuir valores para Y
    - 7 = Rever
    - 8 = Mudar
    - 0 = Sair

---

### Versão **2.2** - Melhorias

> **Linhas nesta versão:** _`422`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Quando a **Função Exponencial** se torna uma **Constante**, os valores são ajustados e a **Função Constante** é exibida
- Definido se o usuário deve escolher os valores de `a`, `b`, `c` e `t`

#### Mudanças

- As opções de menu _Rever (8)_ e _Mudar (9)_ passaram a ter sempre os mesmos valores de opção em **Funções** não **Constantes**

---

## Versões **3.x**

> **Linhas nestas versões:** _`1068`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-12`_

### Versão **3.0** - Variáveis `a`, `b`, `c` nas **Funções Quadráticas, Afins e Constantes**

> **Linhas nesta versão:** _`≈ 692`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-10`_

#### Adições

- Adicionada a possibilidade de `a`, `b`, `c` serem variáveis, sem valor predefinido pelo usuário
- Adicionadas contas com os pontos conhecidos da **Função** para definir os números de `a`, `b`, `c`

---

### Versão **3.1** - Correção de `bugs` e melhorias

> **Linhas nesta versão:** _`786`_<br>
> **Datada de:** _`2025-07-10 -> 2025-07-12`_

#### Adições

- Adicionadas páginas na **Função Quadrática**, com definição de um novo tipo de menu e opções globais
- Adição da marca d'água

#### Mudanças

- É mostrada a **Função** antes de pedir os pontos conhecidos
- As opções de menu _Rever (8)_ e _Mudar (9)_ passaram a ter sempre os mesmos valores de opção em **Funções Constantes**

#### Correções

- Corrigidos os `bugs` que surgiram com a atualização da Versão 3.0

#### Menus

- **Quadrática:**
    - **Página 1:**
        - 1 = Concavidade
        - 2 = Raízes
        - 3 = Vértice
        - 4 = Ponto que cruza o eixo do X
        - 5 = Ponto que cruza o eixo do Y
    - **Página 2:**
        - 1 = Atribuir valores para X
        - 2 = Atribuir valores para Y
        - 3 = Estudo do Sinal
        - 4 = `N/A`
        - 5 = `N/A`
    - **Globais:**
        - 6 = Avançar página
        - 7 = Voltar página
        - 8 = Rever
        - 9 = Mudar
        - 0 = Sair

---

### Versão **3.2** - Variáveis nas **Funções Exponenciais**

> **Linhas nesta versão:** _`1068`_<br>
> **Datada de:** _`2025-07-12 -> 2025-07-12`_

#### Adições

- Adicionadas variáveis para a **Função Exponencial** _(Ainda não é possível resolver variáveis quando não há o valor de `b`)_
- Adicionados o domínio e a imagem da **Função**
- Adicionados _Rever_ e _Mudar_ quando é escolhido o tipo da **Função**

#### Mudanças

- O menu da **Função Afim** tem páginas

#### Correções

- Corrigidos alguns erros com `NaN`
- Tratados novos erros, como quando o `prompt` é cancelado `(v == null)`

#### Menus

- **Constante:**
    - 1 = Domínio
    - 2 = Imagem
    - ...
- **Afim:**
    - **Página 1:**
        - 1 = Inclinação
        - 2 = Raiz
        - 3 = Ponto que cruza o eixo do X
        - 4 = Ponto que cruza o eixo do Y
        - 5 = Atribuir valores para X
    - **Página 2:**
        - 1 = Atribuir valores para Y
        - 2 = Estudo do Sinal
        - 3 = Domínio
        - 4 = Imagem
        - 5 = `N/A`
    - **Globais:**
        - ...
- **Quadrática:**
    - **Página 2:**
        - ...
        - 4 = Domínio
        - 5 = Imagem

#### Histórico

- E com isso, foram ultrapassadas 1000 linhas de código **(Dia: _`2025-09-11`_; Hora: _`18:00`_)**

### Versão **3.3** - Melhorias

> **Linhas nesta versão:** _`1068`_<br>
> **Datada de:** _`2025-12-30 -> 2025-03-04`_

#### Adições

- Adicionadas declarações _let_

---

## Versões **4.x**

> **Linhas nestas versões:** _`1568`_<br>
> **Datada de:** _`2025-12-30 -> 2026-03-04`_

### Versão **4.0** - **Funções _JS_**

> **Linhas nesta versão:** _`1220`_<br>
> **Datada de:** _`2025-12-30 -> 2026-03-04`_

#### Adições

- Adicionadas **Funções _JS_**
- Adicionadas equações entre **Funções** _(exceto **Exponenciais**)_

#### Mudanças

- Mudados alguns nomes de variáveis
- Melhorias em alguns pontos do código

#### Correções

- Correção de `bugs`

---

### Versão **4.1** - Melhorias

> **Linhas nesta versão:** _`1220`_<br>
> **Datada de:** _`2025-10-18 -> 2025-12-30`_

#### Adições

- Adicionadas **Funções _JS_** para cada uma das **Funções Matemáticas** _(exceto **Exponencial**)_

#### Mudanças

- Melhorias nas **Funções _JS_**
- Padronização dos menus, criando opções globais

#### Correções

- Correção de `bugs`

#### Menus

- **Globais:**
    - ...
    - 6 = Avançar página
    - 7 = Voltar página
    - 8 = Rever
    - 9 = Mudar
    - 0 = Sair

---

### Versão **4.2** - **Funções _JS_** nas **Funções Exponenciais**

> **Linhas nesta versão:** _`1209`_<br>
> **Datada de:** _`2025-09-17 -> 2025-12-30`_

#### Adições

- Adicionadas **Funções _JS_** para **Funções Exponenciais**

#### Mudanças

- Melhorias em partes do código

#### Correções

- Correção de `bugs`

---

### Versão **4.3** - Melhorias

> **Linhas nesta versão:** _`1450`_<br>
> **Datada de:** _`2025-10-31 -> 2025-12-30`_

#### Adições

- Adicionado um menu global para as **Funções Exponenciais**
- Adicionado um novo tipo de menu inicial

#### Mudanças

- Melhorias nas **Funções Exponenciais**
- Melhorias no código

#### Menus

- **Exponenciais:**
    - **Página 1:**
        - 1 = Inclinação
        - 2 = Raiz
        - 3 = Assíntota
        - ...
    - **Página 2:**
        - ...
    - **Página 3:**
        - ...

- **Menu inicial:**
    - 1 = **Funções Polinomiais**
    - 2 = **Funções não Polinomiais**

- **Submenus:**
    - **Funções Polinomiais:**
        - 1 = **Quadrática, Afim, Constante**
    - **Funções não Polinomiais:**
        - 1 = **Exponencial**
        - 2 = **Logarítmica**

---

### Versão **4.4** - **Funções Logarítmicas**

> **Linhas nesta versão:** _`1450`_<br>
> **Datada de:** _`2025-10-31 -> 2025-12-30`_

#### Adições

- Adicionadas **Funções Logarítmicas**
- Adicionadas as **Funções _JS_** de `log` e `ln`

#### Menus

- **Logarítmica:**
    - **Página 1:**
        - 1 = Curva
        - 2 = Raiz
        - ...
    - **Página 2:**
        - ...

#### Histórico

- E com isso, foram ultrapassadas 1500 linhas de código **(Dia: _`2025-11-26`_; Hora: _`10:00`_)**

---

### Versão **4.5** - Lançamento Oficial

> **Linhas nesta versão:** _`1568`_<br>
> **Datada de:** _`2025-12-30 -> 2026-03-04`_

#### Correções

- Correção de `bugs`

#### Histórico

- Depois de muito tempo, foi lançada a Versão Oficial **(Dia: _`2025-11-27`_; Hora: _`18:00`_)**

---

## Versões **5.x**

> **Linhas nestas versões:** _`3255`_<br>
> **Datada de:** _`2025-11-26 -> 2026-03-09`_

### Versão **5.0** - Reestruturação do Código

> **Linhas nesta versão:** _`1483`_<br>
> **Datada de:** _`2026-03-07 -> 2026-03-17`_

#### Adições

- Adicionada a **Função _JS_** `erro`, que padroniza as mensagens de erro para melhor entendimento

#### Mudanças

- Mudança técnica no código principal, sem muitas alterações para o usuário
- Mudança das mensagens para o usuário, com utilização dos comandos _Unicode_ para melhor entendimento — sem alterações no código
- Mudados os nomes das variáveis para melhor entendimento — sem alterações no código

---

### Versão **5.1** - Melhorias

> **Linhas nesta versão:** _`1755`_<br>
> **Datada de:** _`2026-02-07 -> 2026-02-08`_

#### Adições

- Adicionadas configurações

#### Mudanças

- Então, por causa das configurações, várias **Funções _JS_** e variáveis podem ser mudadas conforme o que o usuário quiser
- A opção _Sair_ dos menus foi alterada para _Voltar ao menu principal_ — só há _Sair_ nos menus do menu principal

#### Menus

- **Configurações:**
    - 1 = Quantidade de casas decimais
    - 2 = Confirmações de entrada
    - 3 = Mensagens de erro
    - 4 = Caracteres _Unicode_
    - 5 = Explicações
    - 6 = Mostrar **Função**
    - 7 = Acentos
    - 8 = Minúsculas
    - 9 = Ponto decimal

---

### Versão **5.2** - Objetos e Melhorias das Configurações

> **Linhas nesta versão:** _`1867`_<br>
> **Datada de:** _`2026-02-08 -> 2026-02-09`_

#### Mudanças

- As **Funções _JS_** foram unidas em objetos para melhor entendimento do código
- As configurações têm uma forma padrão
- As configurações têm a opção _Voltar ao padrão_
- O menu das configurações tem páginas com _Avançar página_ e _Voltar página_

#### Correções

- Corrigidas algumas falhas técnicas, como a adição permanente de `N/A` ao fim dos arrays do menu

#### Menus

- **Configurações:**
    - **Página 1:**
        - 1 = Quantidade de casas decimais — **Padrão:** `6`
        - 2 = Confirmações de entrada — **Padrão:** `Não`
        - 3 = Mensagens de erro — **Padrão:** `Sim`
        - 4 = Caracteres _Unicode_ — **Padrão:** `Sim`
        - 5 = Explicações — **Padrão:** `Sim`
        - 6 = Mostrar **Função** — **Padrão:** `Sim`
    - **Página 2:**
        - 1 = Acentos — **Padrão:** `Sim`
        - 2 = Minúsculas — **Padrão:** `Não`
        - 3 = Ponto decimal — **Padrão:** `Não`
        - 4 = Precisão do `log` — **Padrão:** `1e-12`
        - 5 = Multiplicação simples — **Padrão:** `Não`
    - **Globais:**
        - 7 = Voltar ao padrão
        - 8 = Avançar página
        - 9 = Voltar página
        - 0 = Voltar ao menu principal

---

### Versão **5.3.1** - Melhorias nas Configurações

> **Linhas nesta versão:** _`2162`_<br>
> **Datada de:** _`2026-02-09 -> 2026-03-03`_

#### Adições

- Adicionadas novas configurações

#### Mudanças

- As configurações foram separadas por tipos

#### Menus

- **Configurações:**
    - **Página 1 _(Visual)_:**
        - 1 = _Unicode_
        - 2 = Explicações
        - 3 = Acentos
        - 4 = Capitalizadas
        - 5 = Maiúsculas
        - 6 = Minúsculas
    - **Página 2 _(Mensagens)_:**
        - 1 = Ponto decimal
        - 2 = Multiplicação simples
        - 3 = Confirmações de entrada
        - 4 = Confirmações de saída
        - 5 = Mensagens de erro
        - 6 = Mostrar **Função**
    - **Página 3 _(Números)_:**
        - 1 = Casas decimais
        - 2 = Precisão do `log`
        - 3 = Limite de iterações

#### Histórico

- E com isso, foram ultrapassadas 2000 linhas de código **(Dia: _`2026-02-10`_; Hora: _`02:00`_)**

---

### Versão **5.3.2** - Melhorias nas **Funções Logarítmicas**

> **Linhas nesta versão:** _`2162`_<br>
> **Datada de:** _`2026-02-09 -> 2026-03-03`_

#### Adições

- Adicionadas variáveis para as **Funções Logarítmicas** também

#### Mudanças

- Melhoradas as exibições de bases

#### Correções

- Corrigidos alguns erros com o `log` e o `ln`

---

### Versão **5.3.3** - Melhorias de `UI` e `UX`

> **Linhas nesta versão:** _`2162`_<br>
> **Datada de:** _`2026-02-09 -> 2026-03-03`_

#### Mudanças

- Melhorias na formatação dos `alerts`, `prompts` e erros — por exemplo: `=== Aviso ===`
- Padronização das opções globais dos menus _(quando aplicável)_, para que fiquem mais intuitivas _(pois, se fosse um menu interativo, a opção de **Próxima** estaria à direita e **Anterior**, à esquerda)_
- Trocada a padronização dos menus de `N/A` para `---` _(com a intenção de mostrar que aquela opção não existe, ao invés de mostrar que ela existe mas não tem função)_
- Reestruturação na **Função** de entrada de dados para melhor entendimento do código
- Editada a exibição dos menus, com um rodapé visual com as opções globais
- Feitas algumas outras mudanças para melhor entendimento

#### Correções

- Corrigidos diversos erros de português, incluindo: espaços extras, concordância, gramática, etc.
- Correção de `bugs` com `NaN` e `Infinity` em várias partes do código

#### Menus

- **Globais:**
    - 6 = Rever
    - 7 = Alterar
    - 8 = Anterior
    - 9 = Próxima
    - 0 = Voltar

---

### Versão **5.4** - Melhorias

> **Linhas nesta versão:** _`2268`_<br>
> **Datada de:** _`2026-02-24 -> 2026-03-06`_

#### Adições

- Criada a **Função** `intervalo` para medir um intervalo
- Adicionados vários tipos especiais de **Funções**, tais como **Quadrática** pura, **Exponencial** natural, etc.
- Adicionados comentários para vários pontos do código

#### Mudanças

- Dividida a precisão do `log` para que exista também a precisão da divisão
- Mudados todos os nomes para que fiquem mais coerentes e consistentes

---

### Versão **5.5** - Melhorias

> **Linhas nesta versão:** _`3255`_<br>
> **Datada de:** _`2026-03-07 -> 2026-03-17`_

#### Adições

- Adicionados `helpers` para ajudar a minimizar o código
- **Funções** podem agora ser salvas
- **Funções** podem agora ser recuperadas, com histórico _(enquanto o programa não é fechado)_
- Adicionados vários comentários para melhor entendimento do código _(com o uso de Inline Suggestions do GitHub Copilot)_
- Adicionada a tradução para o inglês no código _(em desenvolvimento)_

#### Mudanças

- Algumas mensagens foram atualizadas por causa da padronização
- Melhorias em partes do código

#### Correções

- Correção de `bugs`

---

## Versões **6.x**

> **Linhas nestas versões:** _`3296`_<br>
> **Datada de:** _`2026-03-18 -> 2026-03-19`_

### Versão **6.0** - Lançamento

> **Linhas nesta versão:** _`3296`_<br>
> **Datada de:** _`2026-03-18 -> 2026-03-19`_

#### Adições

- Adicionados comandos com `/` para acessar de vários lugares as opções de:
    - Ajuda com comandos `/ajuda`
    - Rever coeficientes / função `/rever`
    - Histórico `/historico`
    - Configurações `/config`
    - Sair `/sair`

- Todos os comandos têm versão funcional em inglês e português, para que seja mais acessível
- Todos os comandos têm variações, por exemplo:
    - `///` => `/sair`
    - `/configuracoes` => `/config`
    - `/cmd` => `/ajuda`

#### Mudanças

- Lançamento oficial no GitHub
- Mudados os nomes das variáveis no código para que fiquem mais intuitivas

---

### Versão **v6.1.0** - Atualizações

> **Datada de:** _`2026-04-30`_

#### Correções

- .gitignore
- ROADMAP
- Geral
- Geral
- Trig funcs
- Files translate
- Translate
- Main
- Prettier changes
- Prettier changes
- Sign
- Code translate
- Code translate
- Code translate
- Mini
- Mini
- FormataÃ§Ã£o geral
- .md
- Commands

#### Adições

- Trig funcs
- Debug

---

## **Próximas atualizações:**

- Adicionar opção de verificar quais **Funções** podem ser válidas para os pontos conhecidos
- Adicionar comandos com `/` para acessar as **Funções _JS_** e as **Funções de Ajuda**
- Adicionar ajuda, resumos, relatórios, etc. para cada tipo de **Função**
- Adicionar uma **Função** que faz contas de maneira segura
- Adicionar equações entre **Funções Exponenciais**
- Adicionar uma forma de achar `a` em **Funções Exponenciais**
- Adicionar **Funções Trigonométricas** e suas propriedades

Próximas atualizações completo em [`ROADMAP`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/ROADMAP/ROADMAP_PT.md)

---
