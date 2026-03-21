<div align="center">
    <h1>Analisador de <b>Funções Matemáticas</b></h1>
    <h2>CHANGELOG</h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - 2026</em></p>
</div>

---

🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/CHANGELOG.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOGS/CHANGELOG_EN.md)

---

> **Total de linhas:** *`3296`*<br>
> **Datado de:** *`2025-07-23 -> hoje`*

---

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
    + Ajuda com comandos `/ajuda`
    + Rever coeficientes / função `/rever`
    + Histórico `/historico`
    + Configurações `/config`
    + Sair `/sair`

- Todos os comandos têm versão funcional em inglês e português, para que seja mais acessível
- Todos os comandos têm variações, por exemplo:
    + `///` => `/sair`
    + `/configuracoes` => `/config`
    + `/cmd` => `/ajuda`

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
