<div align="center">
    <h1><b>Analisador de Funções Matemáticas</b></h1>
    <h2>Glossário <em>(Glossary)</em></h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - presente</em></p>
</div>

---

🌐 [Voltar à Documentação](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/GLOSSARY.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/GLOSSARY/GLOSSARY_EN.md)

---

Um guia de referência para os termos usados neste **Projeto** — **Matemáticos, Técnicos** e relacionados ao **GitHub**.

---

### 📐 Termos Matemáticos

**Amplitude**
A distância máxima que o gráfico de uma **Função** periódica se afasta do seu eixo central. Em `f(x) = a · sen(x)`, a **Amplitude** é `|a|`.

**Assíntota**
Uma reta que uma curva se aproxima mas nunca toca. Nas **Funções Exponenciais** e **Logarítmicas**, a **Assíntota** define o limite da imagem da **Função**.

**Coeficiente**
Um número que multiplica uma variável em uma **Função**. Em `f(x) = ax² + bx + c`, os coeficientes são `a`, `b` e `c`.

**Concavidade**
Descreve se uma **Função Quadrática** abre para cima (_face feliz_, `a > 0`) ou para baixo (_face triste_, `a < 0`).

**Domínio**
O conjunto de todos os valores de entrada (`x`) válidos para uma **Função**.

**Período**
A extensão de um ciclo completo de uma **Função** periódica, como **Seno, Cosseno** ou **Tangente**.

**Imagem**
O conjunto de todos os valores de saída (`y`) produzidos por uma **Função**.

**Raiz**
Um valor de `x` onde `f(x) = 0` — ou seja, onde a **Função** cruza o **eixo X**.

**Estudo do Sinal**
Uma análise que determina para quais valores de `x` a **Função** é positiva, negativa ou zero.

**Vértice**
O ponto mais alto ou mais baixo de uma **Função Quadrática**. Definido pelas coordenadas `(-b / 2a, -Δ / 4a)`.

**Inclinação**
Descreve o quão íngreme é uma **Função Afim**. Em uma **Função Afim**, é o coeficiente `a` em `f(x) = ax + b`.

**Incógnita**
Um coeficiente (`a`, `b` ou `c`) cujo valor não é fornecido diretamente — o **Programa** o calcula a partir de pontos conhecidos.

---

### 💻 Termos do Código

**Objeto**
Uma estrutura **_JavaScript_** que agrupa **Funções _JS_** e variáveis relacionadas. Este projeto usa objetos como `config`, `helpers`, `algebra` e `analyze` para organizar o código.

**Função _JS_**
Um bloco de código reutilizável em **_JavaScript_** que realiza uma tarefa específica. Diferente de uma **Função Matemática**.

**`algebra`**
O objeto responsável pelos cálculos **Matemáticos**, como logaritmos, logaritmo natural e divisão segura.

**`analyze`**
O objeto que realiza a análise de cada tipo de **Função** matemática.

**`checks`**
O objeto responsável pelas verificações de tipo usadas nos arquivos `.ts` do projeto. Escrito em **_TypeScript_**.

**`commands`**
O objeto que gerencia os comandos do **Programa**.

**`config`**
O objeto que armazena todas as configurações globais do **Programa**, como casas decimais, idioma e preferências de **_Unicode_**. Escrito em **_TypeScript_**.

**`error`**
O objeto que fornece mensagens de erro padronizadas em todo o **Programa**. Escrito em **_TypeScript_**.

**`helpers`**
O objeto que contém cálculos comuns e montagem de resultados usados em vários tipos de **Função**.

**`i18n`**
O objeto que fornece as **Funções** de idioma do **Programa** _(internacionalização)_. Escrito em **_TypeScript_**.

**`main`**
O objeto que orquestra o **Programa**, inicializando e coordenando os demais objetos.

**`state`**
O objeto responsável por gerenciar o estado do **Programa**. Escrito em **_TypeScript_**.

**`ui`**
O objeto que gerencia a interação com o usuário — menus, entradas e exibição de erros.

**`values`**
O objeto que define os tipos compartilhados usados nos arquivos `.ts` do projeto. Escrito em **_TypeScript_**.

**`version`**
O objeto que armazena a **Versão** atual do **Programa**.

**`writing`**
O objeto responsável por formatar, traduzir e converter textos para exibição.

**`prompt`**
Uma caixa de diálogo nativa do navegador que pede ao usuário que digite um valor. Usado como principal método de entrada neste projeto.

**`alert`**
Uma caixa de diálogo nativa do navegador que exibe uma mensagem ao usuário. Usado para mostrar resultados e menus.

**`NaN` (_Not a Number_ / Não é um Número)**
Um valor **_JavaScript_** que aparece quando uma operação matemática produz um resultado inválido, como dividir zero por zero.

**`Infinity`**
Um valor **_JavaScript_** que aparece quando um número ultrapassa o valor máximo representável, como dividir por zero.

---

### 🐙 Termos do GitHub

**_Branch_ (Ramificação)**
Uma **Versão** paralela do repositório. A _branch_ principal se chama `main`.

**_Changelog_ (Registro de Alterações)**
Um arquivo que documenta todas as alterações feitas ao longo das versões do projeto. Veja o **[`Registro de Alterações`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CHANGELOG/CHANGELOG_PT.md)** para mais informações.

**_Commit_ (Compromisso)**
Um registro salvo das alterações no repositório. Cada _commit_ tem uma mensagem descrevendo o que foi alterado.

**_Fork_ (Garfo)**
Uma cópia pessoal do repositório de outra pessoa, permitindo fazer alterações sem afetar o original.

**_Issue_ (Problema)**
Um relatório ou sugestão enviado pelo **GitHub**. Pode ser um reporte de bug ou uma solicitação de funcionalidade.

**_Pull Request (PR)_ (Solicitação de _Pull_)**
Uma proposta para mesclar alterações de uma _branch_ para outra. Usado para revisão de código e contribuições.

**_Release_ (Lançamento)**
Uma **Versão** publicada do projeto, marcada com uma tag de **Versão** _(ex.: `v6.0.0`)_.

**Repositório**
A pasta do projeto hospedada no **GitHub**, contendo todos os arquivos, histórico e configurações.

---
