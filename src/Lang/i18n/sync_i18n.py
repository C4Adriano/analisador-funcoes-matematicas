import argparse
import hashlib
import json
import re
import sys
import time
import traceback
from collections.abc import Callable, Iterator, Sequence
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, cast

type JsonValue = (
    str | int | float | bool | None | list[JsonValue] | dict[str, JsonValue]
)
type JsonObject = dict[str, JsonValue]
type Replacement = str | Callable[[re.Match[str]], str]

# ---------------------------------------------------------------------------
# Estrutura dos arquivos
#
#   BASES     -> escritos à mão, completos (pt-BR é o mestre).
#   VARIANTS  -> GERADOS (variante -> base de onde derivam). Não edite!
#                Eles = base + regras regionais + overrides/<variante>.json.
#   overrides -> só o que REALMENTE difere do que as regras produzem.
# ---------------------------------------------------------------------------
MASTER = "pt-BR"
BASES = ["pt-BR", "en-US", "es-419"]
VARIANTS = {"pt-PT": "pt-BR", "en-GB": "en-US", "es-ES": "es-419"}

TODO_MARKER = "[//TODO] "
OVERRIDES_DIRNAME = "overrides"
LOCK_FILENAME = "i18n.lock.json"
SCHEMA_FILENAME = "i18n.schema.json"
DTS_FILENAME = "pt-BR.d.ts"

PAUSE_SECONDS = 0.5  # pausa entre os tópicos (--nosleep zera)
MAX_LISTED = 10  # itens listados por vez (-v mostra todos)
TAG_WIDTH = 12  # largura da coluna das etiquetas [OK], [AVISO]...

# Trechos que nenhuma regra pode alterar: {placeholders} e o marcador de TODO.
PROTECTED = re.compile(r"(\{[^{}]*\}|\[//TODO\])")
PLACEHOLDER = re.compile(r"\{[^{}]*\}")


# ===========================================================================
# MENSAGENS: tudo o que o script imprime fica nesta seção.
#
# Regras para editar:
#   - Os textos passam por str.format(); chaves LITERAIS precisam ser dobradas:
#     "{{placeholders}}" imprime {placeholders}.
#   - {campos} são preenchidos pelo código (veja onde a mensagem é usada).
#   - Valores inseridos (caminhos, chaves) nunca precisam de escape.
# ===========================================================================
class Tag:
    OK = "OK"
    CHANGED = "ALTERADO"
    WARN = "AVISO"
    ERROR = "ERRO"
    BLOCKED = "BLOQUEADO"
    TIP = "DICA"
    MIGRATED = "MIGRADO"
    PRUNED = "PODADO"
    PENDING = "PENDENTE"
    INTERRUPTED = "INTERROMPIDO"


class Msg:
    # Cabeçalho e tópicos
    TITLE = "Sincronização dos arquivos de i18n"
    HEADER_DIR = "Diretório: {path}"
    HEADER_MASTER = "Arquivo mestre: {name}.json"
    SEC_BASES = "1/5  Bases em relação ao mestre ({master}.json)"
    SEC_VARIANTS = "2/5  Variantes (base + regras + overrides)"
    SEC_ORPHANS = "3/5  Chaves órfãs nas bases"
    SEC_PLACEHOLDERS = "4/5  {{placeholders}}"
    SEC_ARTIFACTS = "5/5  Schema e .d.ts"
    SEC_SUMMARY = "Resumo"
    MORE = "... e mais {count} (use -v para listar tudo)"

    # 1/5 Bases
    BASE_MISSING = "{name}.json não foi encontrado em {dir}; a base foi ignorada."
    BASE_MISSING_NOTE = "Variantes que dependem dela e não serão geradas: {variants}"
    BASE_ADDED = "{name}.json: {count} chave(s) nova(s) copiada(s) do mestre, marcadas com {marker}."
    BASE_OK = "{name}.json já tem todas as chaves do mestre."
    BASE_PENDING = "{name}.json: {count} texto(s) ainda marcado(s) com {marker} (precisam de tradução):"

    # 2/5 Variantes
    VARIANT_BASE_MISSING = (
        "{variant}.json não foi gerado: a base {base}.json não está disponível."
    )
    MIGRATED = "{path}: {count} override(s) criado(s) a partir de {variant}.json."
    MIGRATED_NOTE = "Só entra em overrides o que as regras não reproduzem. Confira o arquivo antes de seguir."
    OVERRIDE_ORPHANS = "{path}: {count} chave(s) sem correspondente em {base}.json (foram renomeadas ou apagadas na base?):"
    PRUNED = "{path}: {count} override(s) redundante(s) removido(s) (as regras já geram o mesmo texto)."
    REDUNDANT = "{path}: {count} override(s) já são gerados pelas regras. Rode com --prune para limpá-los."
    RULES_LIST = "{variant}: {count} chave(s) alteradas só pelas regras:"
    BLOCKED = "{variant}.json foi editado à mão depois da última geração; nada foi sobrescrito."
    BLOCKED_DIFF = "{count} chave(s) diferem do que seria gerado agora:"
    BLOCKED_KEEP = "Para manter a edição: mova-a para {path}."
    BLOCKED_DROP = "Para descartá-la e regenerar: rode de novo com --force."
    VARIANT_CREATED = "{variant}.json criado ({total} chaves)."
    VARIANT_UNCHANGED = "{variant}.json já estava atualizado ({total} chaves)."
    VARIANT_UPDATED = (
        "{variant}.json atualizado: {changed} chave(s) mudaram ({total} no total)."
    )
    VARIANT_REFORMATTED = (
        "{variant}.json reescrito: mesmo conteúdo, só a formatação mudou."
    )

    # 3/5 Órfãs e 4/5 placeholders
    ORPHANS_OK = "{name}.json não tem chaves órfãs."
    ORPHANS_FOUND = "{name}.json: {count} chave(s) sem correspondente em {master}.json:"
    PLACEHOLDERS_OK = "Todos os {{placeholders}} batem com {master}.json ({count} arquivo(s) conferidos)."
    PLACEHOLDERS_BAD = (
        "{name}: {count} chave(s) com {{placeholders}} diferentes de {master}.json:"
    )
    PLACEHOLDERS_NOTE = "Placeholder faltando ou renomeado aparece literal para o usuário (ex.: {{language}})."

    # 5/5 Schema e .d.ts
    SCHEMA_UPDATED = "Schema atualizado: {path}"
    SCHEMA_UNCHANGED = "Schema já estava atualizado: {path}"
    DTS_UPDATED = ".d.ts atualizado: {path}"
    DTS_UNCHANGED = ".d.ts já estava atualizado: {path}"

    # Resumo
    SUMMARY_LINE = "{label:<19} {total} chaves = {inherited} herdadas + {rules} por regras + {overrides} overrides"
    SUMMARY_BLOCKED = "{label:<19} BLOQUEADA, o arquivo não foi atualizado"
    ISSUE_BLOCKED = "{count} variante(s) bloqueada(s)"
    ISSUE_WARNINGS = "{count} aviso(s)"
    ISSUE_PENDING = "{count} texto(s) aguardando tradução ({marker})"
    FINAL_CLEAN = "Concluído. Nenhuma pendência."
    FINAL_ISSUES = "Concluído com pendências: {issues}."
    FINAL_QUIET = "i18n: {text}"
    INTERRUPTED = (
        "Interrompido pelo usuário (Ctrl+C). Arquivos já gravados foram mantidos."
    )

    # Ajuda da linha de comando
    HELP_DESCRIPTION = (
        "Sincroniza os arquivos de i18n (bases escritas à mão + variantes geradas)."
    )
    HELP_DIRECTORY = "pasta dos JSONs (padrão: a pasta deste script)"
    HELP_MIGRATE = "cria overrides/ a partir das variantes atuais (use UMA vez)"
    HELP_PRUNE = "apaga dos overrides o que as regras já geram"
    HELP_FORCE = "sobrescreve variantes editadas à mão e overrides existentes"
    HELP_QUIET = "só avisos, erros e a linha final"
    HELP_VERBOSE = "mostra também as listas completas de chaves"
    HELP_NOSLEEP = "sem pausas entre os tópicos"
    HELP_DEBUG = "mostra o traceback completo quando algo falha"


@dataclass(frozen=True)
class ErrorInfo:
    what: str  # o que aconteceu
    cause: str  # por que costuma acontecer
    fix: str  # o que fazer


# Cada erro tem um código (E01...), para você achar rápido neste bloco.
# Campos extras: {script} = nome deste arquivo.
ERRORS: dict[str, ErrorInfo] = {
    "E01": ErrorInfo(
        what="Arquivo mestre não encontrado: {path}",
        cause="O script procura o mestre na pasta {dir} e ele não está lá.",
        fix="Rode o script a partir da pasta dos JSONs ou passe a pasta: python {script} <pasta>",
    ),
    "E02": ErrorInfo(
        what="JSON inválido em {path} (linha {line}, coluna {col}): {reason}",
        cause="{hint}",
        fix="Abra o arquivo nessa linha e corrija (o VS Code sublinha o problema). "
        "Se for o i18n.lock.json, pode apagá-lo: ele é recriado.",
    ),
    "E03": ErrorInfo(
        what="Não foi possível {action} {path}: {detail}",
        cause="Arquivo aberto ou bloqueado por outro programa, sem permissão, caminho inexistente "
        "ou texto fora de UTF-8.",
        fix="Feche o arquivo em outros programas, confira permissões e o caminho, e rode de novo.",
    ),
    "E04": ErrorInfo(
        what="O --migrate não sobrescreve overrides que já existem: {paths}",
        cause="O --migrate deve rodar UMA vez; refazer apagaria overrides escritos à mão.",
        fix="Se quer mesmo refazer, use --migrate --force (as diferenças serão recalculadas a partir "
        "das variantes atuais).",
    ),
    "E05": ErrorInfo(
        what="Não há o que migrar: arquivo(s) ausente(s) em {path}: {variants}",
        cause="O --migrate lê as variantes atuais para descobrir o que difere das regras.",
        fix="Se a variante é nova, crie o arquivo dela em {overrides_dir} contendo {{}} e rode sem --migrate.",
    ),
    "E06": ErrorInfo(
        what="{variant}.json existe, mas {override} não.",
        cause="Sem o override, a variante seria gerada só pelas regras e sobrescreveria "
        "as diferenças escritas à mão.",
        fix="Rode uma vez: python {script} --migrate (cria os overrides a partir dos arquivos atuais).",
    ),
    "E07": ErrorInfo(
        what="{path} deve ter um objeto JSON na raiz, mas contém {kind}.",
        cause="Os arquivos de i18n são sempre {{ ... }} com as chaves dentro.",
        fix="Corrija o arquivo para começar com {{ e terminar com }}.",
    ),
    "E08": ErrorInfo(
        what="Tipo não suportado ao gerar o schema: {kind} em {path}",
        cause="O schema só entende texto, número, booleano, lista, objeto e null.",
        fix="Troque o valor dessa chave em {master}.json por um dos tipos suportados.",
    ),
    "E99": ErrorInfo(
        what="Erro inesperado ({kind}): {detail}",
        cause="Provavelmente um bug do script ou um arquivo fora do formato esperado.",
        fix="Rode de novo com --debug para ver o traceback completo e anote a saída.",
    ),
}

# Explicações em português para as mensagens de erro do json do Python.
JSON_HINTS: dict[str, str] = {
    "Expecting property name enclosed in double quotes": "Geralmente é uma vírgula sobrando antes de } ou uma chave sem aspas duplas.",
    "Expecting ',' delimiter": "Falta uma vírgula entre dois itens, ou há aspas sem fechar logo antes.",
    "Expecting ':' delimiter": "Falta o ':' depois do nome da chave.",
    "Expecting value": "Falta um valor, há vírgula sobrando antes de ] ou }, ou o arquivo está vazio.",
    "Unterminated string": "Há um texto com aspas abertas e sem fechar.",
    "Invalid control character": "Há uma quebra de linha ou tab dentro de um texto; use \\n.",
    "Invalid \\escape": "Há uma barra invertida inválida dentro de um texto; use \\\\ para uma barra.",
    "Extra data": "Há conteúdo depois do fim do JSON (chave '}' a mais, ou dois objetos no arquivo).",
    "Unexpected UTF-8 BOM": "O arquivo foi salvo com BOM; salve-o como UTF-8 sem BOM.",
}
JSON_HINT_DEFAULT = (
    "Erro de sintaxe perto dessa posição (vírgula, aspas ou chave faltando/sobrando)."
)


# ===========================================================================
# Erros e saída no terminal
# ===========================================================================
class SyncError(Exception):
    def __init__(
        self, code: str, extra: list[str] | None = None, **params: object
    ) -> None:
        super().__init__(code)
        self.code = code
        self.extra = extra or []
        self.params = params


class Console:
    def __init__(self, verbosity: int, pause: float) -> None:
        self.verbosity = verbosity  # 0 = -q, 1 = normal, 2 = -v
        self.pause = pause
        self.sections = 0
        self.warnings = 0

    def line(self, template: str, *, level: int = 1, **params: object) -> None:
        if self.verbosity >= level:
            print(template.format(**params))

    def say(self, tag: str, template: str, *, level: int = 1, **params: object) -> None:
        if self.verbosity >= level:
            label = f"[{tag}]"
            print(f"{label:<{TAG_WIDTH}}{template.format(**params)}")

    def warn(self, template: str, **params: object) -> None:
        self.warnings += 1
        self.say(Tag.WARN, template, level=0, **params)

    def note(self, template: str, *, level: int = 1, **params: object) -> None:
        if self.verbosity >= level:
            print(" " * TAG_WIDTH + template.format(**params))

    def items(self, items: Sequence[str], *, level: int = 1) -> None:
        if self.verbosity < level:
            return

        shown = items if self.verbosity >= 2 else items[:MAX_LISTED]

        for item in shown:
            print(" " * TAG_WIDTH + "- " + item)

        if len(shown) < len(items):
            self.note(Msg.MORE, level=level, count=len(items) - len(shown))

    def header(self, title: str) -> None:
        if self.verbosity >= 1:
            print(title)
            print("=" * 60)

    def section(self, title: str, **params: object) -> None:
        if self.verbosity < 1:
            return

        if self.sections and self.pause:
            time.sleep(self.pause)

        self.sections += 1
        print()
        print(title.format(**params))
        print("-" * 60)

    def final(self, text: str) -> None:
        if self.verbosity >= 1:
            print()
            print("=" * 60)
            print(text)
            print("=" * 60)
        else:
            print(Msg.FINAL_QUIET.format(text=text))

    def error(self, error: SyncError, script: str) -> None:
        info = ERRORS[error.code]
        params: dict[str, Any] = {"script": script, **error.params}
        label = f"[{Tag.ERROR} {error.code}]"
        print(f"{label:<{TAG_WIDTH}}{info.what.format(**params)}")

        for extra in error.extra:
            print(" " * TAG_WIDTH + extra)

        print(" " * TAG_WIDTH + "Causa: " + info.cause.format(**params))
        print(" " * TAG_WIDTH + "Como resolver: " + info.fix.format(**params))


# ---------------------------------------------------------------------------
# Regras regionais (a parte "tradutora")
#
# >>> Se você já mexeu nas regras, copie o SEU bloco RULES por cima do daqui. <<<
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Rules:
    # Palavras/expressões inteiras (sem diferenciar maiúsculas; a capitalização
    # do original é mantida). Ex.: {"slope": "gradient"}
    words: dict[str, str] = field(default_factory=dict)  # type: ignore
    # Regex (padrão, substituição). A substituição pode ser texto ou função.
    # Diferencia maiúsculas, a menos que o padrão comece com (?i).
    regex: tuple[tuple[str, Replacement], ...] = ()
    # Aspas de abertura/fechamento da variante. None = não mexe nas aspas.
    quotes: tuple[str, str] | None = None


def _subscript_to_number(match: re.Match[str]) -> str:
    """'Note₁' -> 'Note 1' (grupo 1 = palavra, grupo 2 = dígito subscrito)."""
    return f"{match.group(1)} {ord(match.group(2)) - 0x2080}"


_PRETERITE = {"ou": "aste", "eu": "este", "iu": "iste"}


def _voce_preterite(match: re.Match[str]) -> str:
    """'Você tentou' -> 'Tu tentaste' (pretérito regular após 'Você')."""
    pronoun, stem, ending = match.groups()
    tu = "Tu" if pronoun[0].isupper() else "tu"

    return f"{tu} {stem}{_PRETERITE[ending]}"


# en-US -> en-GB: -ize/-yze -> -ise/-yse (exceto size, prize, seize...).
_IZE = r"(?i)\b([A-Za-z]{2,}?)(iz|yz)(e|es|ed|ing|er|ers|ation|ations)\b"
_NOT_ISE = {
    "size", "sizes", "sized", "sizing", "resize", "resized", "resizing",
    "downsize", "downsized", "upsize", "oversize", "oversized",
    "prize", "prizes", "prized", "seize", "seized", "seizing",
    "capsize", "capsized",
}  # fmt: skip


def _ize_to_ise(match: re.Match[str]) -> str:
    word = match.group(0)

    if word.lower() in _NOT_ISE:
        return word

    stem, kind, ending = match.groups()
    result = stem + ("is" if kind.lower() == "iz" else "ys") + ending

    return result.upper() if word.isupper() else result


RULES: dict[str, Rules] = {
    "pt-PT": Rules(
        quotes=("«", "»"),
        regex=(
            (r"\b([Vv]ocê) (\w+?)(ou|eu|iu)\b", _voce_preterite),
            (r"\bObs\.", "Nota"),
            (r"\b(Nota)([₁-₉])", _subscript_to_number),
        ),
        words={
            "Configurações": "Definições",
            "Exibe": "Mostra",
            "Deseja": "Pretendes",
            "Digite": "Introduz",
            "restaura": "repõe",
            "Revisar": "Rever",
            "pertencente": "pertence",
            "ômega": "ómega",
            "rô": "ró",
            "parêntese": "parêntesis",
            "Inclinação": "Declive",
            "laços": "ciclos",
            "você quis": "quiseste",
        },
    ),
    "en-GB": Rules(
        regex=(
            (_IZE, _ize_to_ise),
            (r"\b(Note)([₁-₉])", _subscript_to_number),
        ),
        words={
            "color": "colour",
            "colors": "colours",
            "favorite": "favourite",
            "behavior": "behaviour",
            "center": "centre",
            "slope": "gradient",
            "parenthesis": "bracket",
            "parentheses": "brackets",
            "affine": "linear",
            "do you want": "would you like",
        },
    ),
    "es-ES": Rules(
        words={
            "aún": "todavía",
            "polinomiales": "polinómicas",
            "polinomial": "polinómica",
            "intersectan": "cortan",
            "ingresar": "introducir",
            "ingresado": "introducido",
            "ingresados": "introducidos",
            "deshabilitado": "desactivado",
            "deshabilitados": "desactivados",
            "deshabilitar": "desactivar",
            "deshabilitarán": "desactivarán",
            "deshabilitarse": "desactivarse",
            "habilitarlas": "activarlas",
            "reemplazar": "sustituir",
            "reemplazará": "sustituirá",
            "reemplazarán": "sustituirán",
            "variaciones": "variantes",
        },
    ),
}


class Translator:
    def __init__(self, rules: Rules) -> None:
        self.words = {word.lower(): new for word, new in rules.words.items()}
        self.word_pattern = (
            re.compile(
                r"\b("
                + "|".join(
                    re.escape(word)
                    for word in sorted(self.words, key=len, reverse=True)
                )
                + r")\b",
                re.IGNORECASE,
            )
            if self.words
            else None
        )
        self.regex = [(re.compile(pattern), repl) for pattern, repl in rules.regex]
        self.quote_table = (
            str.maketrans(
                {
                    "“": rules.quotes[0],
                    "«": rules.quotes[0],
                    "”": rules.quotes[1],
                    "»": rules.quotes[1],
                }
            )
            if rules.quotes
            else None
        )

    def _swap_word(self, match: re.Match[str]) -> str:
        source = match.group(0)
        target = self.words[source.lower()]

        if len(source) > 1 and source.isupper():
            return target.upper()

        if source[0].isupper():
            return target[0].upper() + target[1:]

        return target

    def _apply(self, text: str) -> str:
        if self.word_pattern:
            text = self.word_pattern.sub(self._swap_word, text)

        for pattern, repl in self.regex:
            text = pattern.sub(repl, text)

        if self.quote_table:
            text = text.translate(self.quote_table)

        return text

    def translate(self, text: str) -> str:
        parts = PROTECTED.split(text)

        for index in range(0, len(parts), 2):
            parts[index] = self._apply(parts[index])

        return "".join(parts)

    def derive(self, node: JsonValue) -> JsonValue:
        if isinstance(node, dict):
            return {key: self.derive(value) for key, value in node.items()}

        if isinstance(node, str):
            return self.translate(node)

        return node


# ---------------------------------------------------------------------------
# Utilitários de arquivo e JSON
# ---------------------------------------------------------------------------
@dataclass
class LocaleFile:
    path: Path
    data: JsonObject


def display_path(path: Path) -> Path:
    try:
        return path.relative_to(Path.cwd())
    except ValueError:
        return path


def json_error(path: Path, exc: json.JSONDecodeError) -> SyncError:
    lines = exc.doc.splitlines() or [""]
    text = lines[exc.lineno - 1] if 0 < exc.lineno <= len(lines) else ""
    text = text.replace("\t", " ").rstrip()
    shown = text if len(text) <= 100 else text[:100] + "..."
    prefix = f"linha {exc.lineno}: "
    caret = min(max(exc.colno - 1, 0), len(shown))
    hint = next(
        (text for start, text in JSON_HINTS.items() if exc.msg.startswith(start)),
        JSON_HINT_DEFAULT,
    )

    return SyncError(
        "E02",
        extra=[prefix + shown, " " * (len(prefix) + caret) + "^"],
        path=display_path(path),
        line=exc.lineno,
        col=exc.colno,
        reason=exc.msg,
        hint=hint,
    )


def load(path: Path) -> JsonObject:
    try:
        with open(path, encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError as exc:
        raise json_error(path, exc) from exc
    except (OSError, UnicodeDecodeError) as exc:
        raise SyncError(
            "E03", action="ler", path=display_path(path), detail=str(exc)
        ) from exc

    if not isinstance(data, dict):
        raise SyncError("E07", path=display_path(path), kind=type(data).__name__)

    return cast(JsonObject, data)


def dump_json(data: JsonObject) -> str:
    return json.dumps(data, ensure_ascii=False, indent=4) + "\n"


def write_text(path: Path, text: str) -> bool:
    """Grava só se o conteúdo mudou (não mexe na data do arquivo à toa)."""
    try:
        if path.exists() and path.read_text(encoding="utf-8") == text:
            return False

        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8", newline="\n")
    except (OSError, UnicodeDecodeError) as exc:
        raise SyncError(
            "E03", action="gravar", path=display_path(path), detail=str(exc)
        ) from exc

    return True


def digest(data: JsonObject) -> str:
    """Hash do CONTEÚDO (ignora formatação, então o Prettier não atrapalha)."""
    text = json.dumps(data, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def leaves(node: JsonObject, prefix: str = "") -> Iterator[tuple[str, JsonValue]]:
    for key, value in node.items():
        path = f"{prefix}.{key}" if prefix else key

        if isinstance(value, dict):
            yield from leaves(value, path)
        else:
            yield path, value


def differing_paths(first: JsonObject, second: JsonObject) -> list[str]:
    """Caminhos cujo valor difere (ou existe só de um lado), na ordem de `first`."""
    left, right = dict(leaves(first)), dict(leaves(second))
    paths = [path for path in left if left[path] != right.get(path)]

    return paths + [path for path in right if path not in left]


def merge(base: JsonObject, override: JsonObject) -> JsonObject:
    """Aplica o override sobre a base, mantendo a ordem das chaves da base."""
    result: JsonObject = {}

    for key, value in base.items():
        if key not in override:
            result[key] = value
            continue

        other = override[key]

        if isinstance(value, dict) and isinstance(other, dict):
            result[key] = merge(value, other)
        else:
            result[key] = other

    return result


def diff(actual: JsonObject, expected: JsonObject) -> JsonObject:
    """Só o que em `actual` difere de `expected` (usado para criar overrides)."""
    result: JsonObject = {}

    for key, value in actual.items():
        other = expected.get(key)

        if isinstance(value, dict) and isinstance(other, dict):
            nested = diff(value, other)

            if nested:
                result[key] = nested
        elif value != other:
            result[key] = value

    return result


def remove_redundant(override: JsonObject, derived: JsonObject) -> list[str]:
    """Apaga do override o que as regras já produzem. Devolve os caminhos."""
    removed: list[str] = []

    def walk(node: JsonObject, expected: JsonObject, prefix: str) -> None:
        for key in list(node):
            path = f"{prefix}.{key}" if prefix else key
            value, other = node[key], expected.get(key)

            if isinstance(value, dict) and isinstance(other, dict):
                walk(value, other, path)

                if not value:
                    del node[key]
            elif value == other:
                removed.append(path)
                del node[key]

    walk(override, derived, "")
    return removed


def fill_missing(
    target: JsonObject,
    source: JsonObject,
    mark_todo: bool,
    prefix: str = "",
) -> list[str]:
    added: list[str] = []

    for key, value in source.items():
        path = f"{prefix}.{key}" if prefix else key

        if isinstance(value, dict):
            existing = target.get(key)
            child: JsonObject = existing if isinstance(existing, dict) else {}
            target[key] = child

            added.extend(fill_missing(child, value, mark_todo, path))
            continue

        if key in target:
            continue

        if mark_todo and isinstance(value, str):
            target[key] = TODO_MARKER + value
        else:
            target[key] = value

        added.append(path)

    return added


def find_orphans(
    target: JsonObject,
    source: JsonObject,
    prefix: str = "",
) -> list[str]:
    orphans: list[str] = []

    for key, value in target.items():
        path = f"{prefix}.{key}" if prefix else key

        if key not in source:
            orphans.append(path)
            continue

        source_value = source[key]

        if isinstance(value, dict) and isinstance(source_value, dict):
            orphans.extend(find_orphans(value, source_value, path))

    return orphans


def todo_paths(data: JsonObject) -> list[str]:
    marker = TODO_MARKER.strip()

    return [
        path
        for path, value in leaves(data)
        if isinstance(value, str) and value.startswith(marker)
    ]


def placeholder_problems(data: JsonObject, master: JsonObject) -> list[str]:
    """Chaves cujos {placeholders} diferem dos do arquivo mestre."""
    expected = {
        path: sorted(PLACEHOLDER.findall(value))
        for path, value in leaves(master)
        if isinstance(value, str)
    }
    problems: list[str] = []

    for path, value in leaves(data):
        if path in expected and isinstance(value, str):
            found = sorted(PLACEHOLDER.findall(value))

            if found != expected[path]:
                problems.append(
                    f"{path}: esperado {expected[path]}, encontrado {found}"
                )

    return problems


# ---------------------------------------------------------------------------
# Schema e .d.ts
# ---------------------------------------------------------------------------
def build_schema(node: JsonValue, path: str = "") -> JsonObject:
    # Nenhum objeto leva "required": toda chave é OPCIONAL. Por isso o mesmo
    # schema serve para os arquivos completos e para os overrides parciais.
    # O additionalProperties=false continua barrando chaves digitadas errado.
    if isinstance(node, dict):
        return {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                key: build_schema(value, f"{path}.{key}" if path else key)
                for key, value in node.items()
            },
        }

    if isinstance(node, str):
        return {"type": "string"}

    if isinstance(node, bool):
        return {"type": "boolean"}

    if isinstance(node, int):
        return {"type": "integer"}

    if isinstance(node, float):
        return {"type": "number"}

    if isinstance(node, list):
        return {
            "type": "array",
            "items": build_schema(node[0], f"{path}[0]") if node else {},
        }

    if node is None:
        return {"type": "null"}

    raise SyncError(
        "E08", kind=type(node).__name__, path=path or "(raiz)", master=MASTER
    )


def write_schema(directory: Path, master_data: JsonObject) -> tuple[Path, bool]:
    schema: JsonObject = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "i18n schema (gerado automaticamente a partir de pt-BR.json; todas as chaves são opcionais)",
        **build_schema(master_data),
    }
    path = directory / "schemas" / SCHEMA_FILENAME

    return path, write_text(path, dump_json(schema))


def write_dts(directory: Path, master_data: JsonObject) -> tuple[Path, bool]:
    literal = json.dumps(master_data, ensure_ascii=False, indent=4)
    path = directory / DTS_FILENAME

    return path, write_text(
        path, f"declare const ptBR: {literal}\n\nexport default ptBR\n"
    )


# ---------------------------------------------------------------------------
# Programa principal
# ---------------------------------------------------------------------------
def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=Msg.HELP_DESCRIPTION)
    parser.add_argument("directory", nargs="?", type=Path, help=Msg.HELP_DIRECTORY)
    parser.add_argument("--migrate", action="store_true", help=Msg.HELP_MIGRATE)
    parser.add_argument("--prune", action="store_true", help=Msg.HELP_PRUNE)
    parser.add_argument("--force", action="store_true", help=Msg.HELP_FORCE)
    parser.add_argument("--nosleep", action="store_true", help=Msg.HELP_NOSLEEP)
    parser.add_argument("--debug", action="store_true", help=Msg.HELP_DEBUG)

    verbosity = parser.add_mutually_exclusive_group()
    verbosity.add_argument("-q", "--quiet", action="store_true", help=Msg.HELP_QUIET)
    verbosity.add_argument(
        "-v", "--verbose", action="store_true", help=Msg.HELP_VERBOSE
    )

    return parser.parse_args()


@dataclass
class VariantReport:
    variant: str
    base: str
    total: int = 0
    inherited: int = 0
    rules: int = 0
    overrides: int = 0
    blocked: bool = False


def run(args: argparse.Namespace, out: Console, script: str) -> int:
    directory: Path = args.directory or Path(__file__).resolve().parent
    overrides_dir = directory / OVERRIDES_DIRNAME
    lock_path = directory / LOCK_FILENAME
    marker = TODO_MARKER.strip()

    out.header(Msg.TITLE)
    out.line(Msg.HEADER_DIR, path=directory)
    out.line(Msg.HEADER_MASTER, name=MASTER)

    # 1/5 Bases ----------------------------------------------------------------
    out.section(Msg.SEC_BASES, master=MASTER)

    if not (directory / f"{MASTER}.json").exists():
        raise SyncError(
            "E01", path=display_path(directory / f"{MASTER}.json"), dir=directory
        )

    bases: dict[str, LocaleFile] = {}

    for name in BASES:
        path = directory / f"{name}.json"

        if not path.exists():
            out.warn(Msg.BASE_MISSING, name=name, dir=display_path(directory))
            dependents = [v for v, base in VARIANTS.items() if base == name]

            if dependents:
                out.note(Msg.BASE_MISSING_NOTE, level=0, variants=", ".join(dependents))

            continue

        bases[name] = LocaleFile(path=path, data=load(path))

    master = bases[MASTER].data

    for name, info in bases.items():
        if name == MASTER:
            continue

        added = fill_missing(info.data, master, mark_todo=True)

        if added:
            write_text(info.path, dump_json(info.data))
            out.say(
                Tag.CHANGED, Msg.BASE_ADDED, name=name, count=len(added), marker=marker
            )
        else:
            out.say(Tag.OK, Msg.BASE_OK, name=name)

    pending = 0

    for name, info in bases.items():
        todos = todo_paths(info.data)

        if todos:
            pending += len(todos)
            out.say(
                Tag.PENDING,
                Msg.BASE_PENDING,
                level=0,
                name=name,
                count=len(todos),
                marker=marker,
            )
            out.items(todos)

    # 2/5 Variantes ------------------------------------------------------------
    out.section(Msg.SEC_VARIANTS)

    lock = cast(dict[str, str], load(lock_path)) if lock_path.exists() else {}

    if args.migrate and not args.force:
        existing = [
            str(display_path(overrides_dir / f"{variant}.json"))
            for variant in VARIANTS
            if (overrides_dir / f"{variant}.json").exists()
        ]

        if existing:
            raise SyncError("E04", paths=", ".join(existing))

    if args.migrate:
        missing = [
            f"{variant}.json"
            for variant in VARIANTS
            if not (directory / f"{variant}.json").exists()
        ]

        if missing:
            raise SyncError(
                "E05",
                variants=", ".join(missing),
                path=directory,
                overrides_dir=display_path(overrides_dir),
            )

    reports: list[VariantReport] = []
    outputs: dict[str, JsonObject] = {}

    for variant, base_name in VARIANTS.items():
        if base_name not in bases:
            out.warn(Msg.VARIANT_BASE_MISSING, variant=variant, base=base_name)
            continue

        base = bases[base_name].data
        derived = cast(JsonObject, Translator(RULES[variant]).derive(base))
        variant_path = directory / f"{variant}.json"
        override_path = overrides_dir / f"{variant}.json"
        override_label = display_path(override_path)
        on_disk = load(variant_path) if variant_path.exists() else None

        if args.migrate:
            if on_disk is None:  # já checado acima; só para o tipo
                raise SyncError(
                    "E05",
                    variants=f"{variant}.json",
                    path=directory,
                    overrides_dir=display_path(overrides_dir),
                )

            override = diff(on_disk, derived)
            write_text(override_path, dump_json(override))
            out.say(
                Tag.MIGRATED,
                Msg.MIGRATED,
                path=override_label,
                count=sum(1 for _ in leaves(override)),
                variant=variant,
            )
            out.note(Msg.MIGRATED_NOTE)
        elif override_path.exists():
            override = load(override_path)
        elif on_disk is not None:
            raise SyncError("E06", variant=variant, override=override_label)
        else:
            override = {}

        orphans = find_orphans(override, base)

        if orphans:
            out.warn(
                Msg.OVERRIDE_ORPHANS,
                path=override_label,
                count=len(orphans),
                base=base_name,
            )
            out.items(orphans, level=0)

        if args.prune:
            removed = remove_redundant(override, derived)

            if removed:
                write_text(override_path, dump_json(override))
                out.say(Tag.PRUNED, Msg.PRUNED, path=override_label, count=len(removed))
                out.items(removed, level=2)
        else:
            redundant = remove_redundant(json.loads(json.dumps(override)), derived)

            if redundant:
                out.say(
                    Tag.TIP, Msg.REDUNDANT, path=override_label, count=len(redundant)
                )
                out.items(redundant, level=2)

        final = merge(derived, override)
        outputs[variant] = final

        overridden = {path for path, _ in leaves(override)} - set(orphans)
        rule_paths = [
            path
            for (path, new), (_, old) in zip(leaves(derived), leaves(base), strict=True)
            if new != old and path not in overridden
        ]
        report = VariantReport(
            variant=variant,
            base=base_name,
            total=sum(1 for _ in leaves(final)),
            rules=len(rule_paths),
            overrides=len(overridden),
        )
        report.inherited = report.total - report.rules - report.overrides
        reports.append(report)

        if rule_paths and out.verbosity >= 2:
            out.say(
                Tag.OK, Msg.RULES_LIST, level=2, variant=variant, count=len(rule_paths)
            )
            out.items(rule_paths, level=2)

        # Proteção contra edição manual do arquivo gerado.
        if (
            on_disk is not None
            and variant in lock
            and not args.migrate
            and not args.force
            and digest(on_disk) != lock[variant]
        ):
            report.blocked = True
            edited = differing_paths(on_disk, final)
            out.say(Tag.BLOCKED, Msg.BLOCKED, level=0, variant=variant)
            out.note(Msg.BLOCKED_DIFF, level=0, count=len(edited))
            out.items(edited, level=0)
            out.note(Msg.BLOCKED_KEEP, level=0, path=override_label)
            out.note(Msg.BLOCKED_DROP, level=0)
            continue

        wrote = write_text(variant_path, dump_json(final))
        lock[variant] = digest(final)

        if on_disk is None:
            out.say(
                Tag.CHANGED, Msg.VARIANT_CREATED, variant=variant, total=report.total
            )
        elif not wrote:
            out.say(Tag.OK, Msg.VARIANT_UNCHANGED, variant=variant, total=report.total)
        else:
            changed = differing_paths(on_disk, final)

            if changed:
                out.say(
                    Tag.CHANGED,
                    Msg.VARIANT_UPDATED,
                    variant=variant,
                    changed=len(changed),
                    total=report.total,
                )
                out.items(changed, level=2)
            else:
                out.say(Tag.CHANGED, Msg.VARIANT_REFORMATTED, variant=variant)

    write_text(lock_path, dump_json(cast(JsonObject, dict(sorted(lock.items())))))

    # 3/5 Órfãs nas bases ------------------------------------------------------
    out.section(Msg.SEC_ORPHANS)

    for name, info in bases.items():
        if name == MASTER:
            continue

        orphans = find_orphans(info.data, master)

        if not orphans:
            out.say(Tag.OK, Msg.ORPHANS_OK, name=name)
            continue

        out.warn(Msg.ORPHANS_FOUND, name=name, count=len(orphans), master=MASTER)
        out.items(orphans, level=0)

    # 4/5 Placeholders ---------------------------------------------------------
    out.section(Msg.SEC_PLACEHOLDERS)
    every_locale = {name: info.data for name, info in bases.items()} | outputs
    placeholders_ok = True

    for name, data in every_locale.items():
        problems = placeholder_problems(data, master)

        if not problems:
            continue

        placeholders_ok = False
        out.warn(Msg.PLACEHOLDERS_BAD, name=name, count=len(problems), master=MASTER)
        out.items(problems, level=0)

    if placeholders_ok:
        out.say(Tag.OK, Msg.PLACEHOLDERS_OK, master=MASTER, count=len(every_locale))
    else:
        out.note(Msg.PLACEHOLDERS_NOTE, level=0)

    # 5/5 Schema e .d.ts -------------------------------------------------------
    out.section(Msg.SEC_ARTIFACTS)

    path, wrote = write_schema(directory, master)
    out.say(
        Tag.OK,
        Msg.SCHEMA_UPDATED if wrote else Msg.SCHEMA_UNCHANGED,
        path=display_path(path),
    )

    path, wrote = write_dts(directory, master)
    out.say(
        Tag.OK, Msg.DTS_UPDATED if wrote else Msg.DTS_UNCHANGED, path=display_path(path)
    )

    # Resumo -------------------------------------------------------------------
    out.section(Msg.SEC_SUMMARY)

    for report in reports:
        if report.blocked:
            out.line(Msg.SUMMARY_BLOCKED, label=f"{report.variant} (de {report.base})")
        else:
            out.line(
                Msg.SUMMARY_LINE,
                label=f"{report.variant} (de {report.base})",
                total=report.total,
                inherited=report.inherited,
                rules=report.rules,
                overrides=report.overrides,
            )

    blocked = sum(1 for report in reports if report.blocked)
    issues: list[str] = []

    if blocked:
        issues.append(Msg.ISSUE_BLOCKED.format(count=blocked))

    if out.warnings:
        issues.append(Msg.ISSUE_WARNINGS.format(count=out.warnings))

    if pending:
        issues.append(Msg.ISSUE_PENDING.format(count=pending, marker=marker))

    out.final(
        Msg.FINAL_ISSUES.format(issues=", ".join(issues)) if issues else Msg.FINAL_CLEAN
    )

    return 1 if blocked else 0


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        cast(Any, sys.stdout).reconfigure(
            errors="replace"
        )  # nunca quebrar por causa de acento no console

    args = parse_args()
    verbosity = 0 if args.quiet else 2 if args.verbose else 1
    pause = 0 if args.nosleep or not sys.stdout.isatty() else PAUSE_SECONDS
    out = Console(verbosity, pause)
    script = Path(sys.argv[0]).name

    try:
        return run(args, out, script)
    except SyncError as error:
        print()
        out.error(error, script)

        if args.debug:
            traceback.print_exc()

        return 1
    except KeyboardInterrupt:
        print()
        out.say(Tag.INTERRUPTED, Msg.INTERRUPTED, level=0)
        return 130
    except Exception as exc:
        if args.debug:
            raise

        print()
        out.error(SyncError("E99", kind=type(exc).__name__, detail=str(exc)), script)
        return 1


if __name__ == "__main__":
    sys.exit(main())
