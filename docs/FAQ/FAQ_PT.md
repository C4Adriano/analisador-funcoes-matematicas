<div align="center">
    <h1><b>Analisador de Funções Matemáticas</b></h1>
    <h2>Perguntas Frequentes <em>(FAQ / Frequently Asked Questions)</em></h2>
    <p>Todos os direitos reservados © <strong>Adriano Lima</strong> <em>2025 - presente</em></p>
</div>

---

🌐 [Voltar à Documentação](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/README.md) | 🌐 [Voltar ao geral](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ.md) | 🇺🇸 [English](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/FAQ/FAQ_EN.md)

---

### Geral

**O que é o Analisador de Funções Matemáticas?**
Uma ferramenta interativa que roda no navegador e analisa **Funções Matemáticas**, exibindo suas propriedades passo a passo — com explicações detalhadas opcionais.

**Quem desenvolveu?**
Desenvolvido por **Adriano Lima**, estudante do **Curso Técnico em Informática para Internet no IFRS campus Rio Grande**. O **Projeto** começou como trabalho escolar de **Matemática**.

**É gratuito?**
Sim. O **Projeto** é público e pode ser acessado sem custo pelo GitHub Pages.

### Uso

**Como acesso o programa?**
Diretamente no navegador em: **[Analisador](https://c4adriano.github.io/analisador-funcoes-matematicas/)**

Ou localmente:

1. Baixe ou clone o repositório
2. Abra o arquivo `index.html` no navegador
3. Não é necessário instalar nada

**Por que o programa usa `prompt` e `alert` em vez de uma interface gráfica?**
O **Projeto** foi desenvolvido intencionalmente sem frameworks ou bibliotecas gráficas. Os menus via `prompt` e `alert` tornam o código simples e acessível.

**Quais tipos de função são suportados?**

- Constante — `f(x) = c`
- Afim — `f(x) = bx + c`
- Quadrática — `f(x) = ax² + bx + c`
- Exponencial — `f(x) = b · aˣ`
- Logarítmica — `f(x) = b · logₐ(x) + c`
- Seno — `ƒ(x) = b × sen(a · x) + c`
- Cosseno — `ƒ(x) = b × cos(a · x) + c`
- Tangente — `ƒ(x) = b × tan(a · x) + c`

**O que o programa consegue analisar?**
Domínio, imagem, raízes, vértice, interseções com os eixos, estudo do sinal, assíntota, curva, valores de `x` e `y`, e equações entre **Funções**.

**Posso deixar coeficientes como incógnitas?**
Sim. Os coeficientes `a`, `b` e `c` podem ser deixados em branco — o programa calcula seus valores a partir de pontos conhecidos informados pelo usuário.

**Funciona em celular?**
Tecnicamente sim, mas a experiência não é ideal. O comportamento de `prompt` e `alert` pode variar entre navegadores mobile. Recomenda-se usar em um computador.

### Configurações

**O que dá para configurar?**
_Unicode_ e acentos, casas decimais, capitalização, separador decimal, precisão de logaritmos e divisões, limite de iterações e idioma (PT-BR / EN).

**Como acesso as configurações?**
Pelo menu principal do programa, onde cada configuração pode ser alterada individualmente.

### Técnico

**Quais tecnologias foram usadas?**
O **Projeto** é desenvolvido principalmente em **_JavaScript_**, com módulos curtos e simples escritos em **_TypeScript_** para checagem de tipos durante o desenvolvimento. Não são usados _frameworks_ ou bibliotecas gráficas — os módulos **_TypeScript_** são compilados para **_JavaScript_** puro via `tsc`, e o navegador só executa **_JS_** puro. _Husky_ e _lint-staged_ são usados como ferramentas de desenvolvimento (checagens em _pre-commit_); nenhuma dependência de execução é enviada ao navegador.

**Posso contribuir?**
Sim, contribuições pontuais são bem-vindas. Leia o arquivo de **[`Contribuindo`](https://github.com/C4Adriano/analisador-funcoes-matematicas/blob/main/docs/CONTRIBUTING/CONTRIBUTING_PT.md)** para mais informações.

**Encontrei um erro. O que faço?**
Abra uma issue usando o template `bug_report`. Descreva o que aconteceu, qual função estava usando e o resultado esperado.

---
