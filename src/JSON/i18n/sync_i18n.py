"""
sync_i18n.py

Mantém as chaves dos arquivos de idioma sincronizadas, usando pt-BR como
arquivo mestre. Fluxo de trabalho pretendido:

    1. Você escreve/edita chaves apenas em pt-BR.json.
    2. Roda este script.
    3. Ele adiciona, nos outros arquivos, as chaves que faltam — marcando as
       que precisam de tradução com "[langauge] " (typo proposital de
       "language", reconhecido pelo CodeSpell) na frente do valor, para o
       CodeSpell acusar sozinho no lint/CI. Nunca sobrescreve o que já
       existe (traduções e ajustes regionais feitos manualmente ficam
       intocados).
    4. Ele avisa quais chaves foram adicionadas (para você traduzir) e quais
       chaves "sobram" em algum arquivo mas não existem mais em pt-BR
       (possível chave removida/renomeada em pt-BR).

Cadeia de propagação:

    pt-BR  --> en-US, es-419, pt-PT   (pt-PT é a mesma língua: copia direto)
    en-US  --> en-GB
    es-419 --> es-ES

Uso:
    python sync_i18n.py                # usa o diretório atual
    python sync_i18n.py /caminho/dir    # usa outro diretório

    Espera encontrar, no diretório informado:
    pt-BR.json, en-US.json, es-419.json, pt-PT.json, en-GB.json, es-ES.json
"""

import json
import sys
from pathlib import Path

MASTER = "pt-BR"

# (arquivo de origem, arquivo de destino, marca como "a traduzir"?)
PROPAGATION = [
    ("pt-BR", "en-US", True),
    ("pt-BR", "es-419", True),
    ("pt-BR", "pt-PT", False),  # mesma língua, não precisa marcar
    ("en-US", "en-GB", False),  # já traduzido em en-US, só herda para o dialeto
    ("es-419", "es-ES", False),  # já traduzido em es-419, só herda para o dialeto
]

# Marcador de "pendente de tradução". Usamos "langauge" (typo proposital de
# "language") em vez de um texto como "[TRADUZIR]" porque essa palavra já
# existe no dicionário padrão do CodeSpell (langauge ==> language), então o
# CodeSpell (rodando no CI/hook) acusa erro sozinho nas chaves ainda não
# traduzidas — sem precisar de configuração extra além da ignore-words-list
# (veja codespell-ignore.txt) para as palavras legítimas de PT/ES que o
# CodeSpell confunde com erros de inglês.
TODO_MARKER = "[langauge] "


def load(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        f.write("\n")


def fill_missing(target: dict, source: dict, mark_todo: bool, prefix: str = ""):
    """
    Percorre `source` recursivamente. Para cada chave ausente em `target`,
    adiciona (copiando o valor de `source`, opcionalmente marcado como
    pendente de tradução). Nunca sobrescreve chaves já existentes em `target`.
    Retorna a lista de caminhos de chave que foram adicionados.
    """
    added = []
    for key, value in source.items():
        path = f"{prefix}.{key}" if prefix else key

        if isinstance(value, dict):
            if key not in target or not isinstance(target.get(key), dict):
                target[key] = {}
            added += fill_missing(target[key], value, mark_todo, path)
        else:
            if key not in target:
                if mark_todo and isinstance(value, str):
                    target[key] = TODO_MARKER + value
                else:
                    target[key] = value
                added.append(path)
    return added


def find_orphans(target: dict, source: dict, prefix: str = ""):
    """
    Percorre `target` recursivamente e retorna os caminhos de chave que
    existem em `target` mas não existem (mais) em `source` (pt-BR).
    Não remove nada — só relata, para você decidir.
    """
    orphans = []
    for key, value in target.items():
        path = f"{prefix}.{key}" if prefix else key
        if key not in source:
            orphans.append(path)
        elif isinstance(value, dict) and isinstance(source.get(key), dict):
            orphans += find_orphans(value, source[key], path)
    return orphans


def main():
    directory = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")

    files = {}
    for name in ["pt-BR", "en-US", "es-419", "pt-PT", "en-GB", "es-ES"]:
        path = directory / f"{name}.json"
        if not path.exists():
            print(f"AVISO: {path} não encontrado, pulando.")
            continue
        files[name] = {"path": path, "data": load(path)}

    if MASTER not in files:
        print(
            f"ERRO: {MASTER}.json (arquivo mestre) não foi encontrado em {directory}."
        )
        sys.exit(1)

    report = {}

    for source_name, target_name, mark_todo in PROPAGATION:
        if source_name not in files or target_name not in files:
            continue
        source_data = files[source_name]["data"]
        target_data = files[target_name]["data"]
        added = fill_missing(target_data, source_data, mark_todo)
        if added:
            report[target_name] = added

    # Salva apenas os arquivos que realmente mudaram
    for name in report:
        save(files[name]["path"], files[name]["data"])

    # Relatório
    print("=" * 60)
    if report:
        print("Chaves adicionadas:")
        for name, keys in report.items():
            print(f"\n  {name}.json — {len(keys)} chave(s):")
            for k in keys:
                print(f"    + {k}")
        print(
            f'\nDica: procure por "{TODO_MARKER.strip()}" nos arquivos (ou '
            f"rode o codespell) para achar tudo que ainda falta traduzir."
        )
    else:
        print("Nenhuma chave nova para propagar. Tudo já está sincronizado.")

    # Órfãos: chaves que existem em algum arquivo mas sumiram do pt-BR
    print("\n" + "=" * 60)
    orphans_found = False
    pt_br = files[MASTER]["data"]
    for name, info in files.items():
        if name == MASTER:
            continue
        orphans = find_orphans(info["data"], pt_br)
        if orphans:
            orphans_found = True
            print(
                f"\nAVISO — chaves em {name}.json sem correspondente em pt-BR.json"
                f" (podem ter sido removidas/renomeadas na base):"
            )
            for k in orphans:
                print(f"    ? {k}")
    if not orphans_found:
        print("Nenhuma chave órfã encontrada.")
    print("=" * 60)


if __name__ == "__main__":
    main()
