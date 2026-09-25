import json
import sys
from pathlib import Path

MASTER = "pt-BR"
LOCALES = ["pt-BR", "en-US", "es-419", "pt-PT", "en-GB", "es-ES"]

PROPAGATION: list[tuple[str, str, bool]] = [
    ("pt-BR", "en-US", True),
    ("pt-BR", "es-419", True),
    ("pt-BR", "pt-PT", False),
    ("en-US", "en-GB", False),
    ("es-419", "es-ES", False),
]

TODO_MARKER = "[//TODO] "
SCHEMA_FILENAME = "i18n.schema.json"


def load(path: Path) -> dict:
    with open(path, encoding="utf-8") as file:
        return json.load(file)


def save(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
        file.write("\n")


def fill_missing(
    target: dict,
    source: dict,
    mark_todo: bool,
    prefix: str = "",
) -> list[str]:
    added = []

    for key, value in source.items():
        path = f"{prefix}.{key}" if prefix else key

        if isinstance(value, dict):
            if key not in target or not isinstance(target.get(key), dict):
                target[key] = {}

            added.extend(fill_missing(target[key], value, mark_todo, path))
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
    target: dict,
    source: dict,
    prefix: str = "",
) -> list[str]:
    orphans = []

    for key, value in target.items():
        path = f"{prefix}.{key}" if prefix else key

        if key not in source:
            orphans.append(path)
            continue

        if isinstance(value, dict) and isinstance(source.get(key), dict):
            orphans.extend(find_orphans(value, source[key], path))

    return orphans


def build_schema(node):
    if isinstance(node, dict):
        return {
            "type": "object",
            "additionalProperties": False,
            "properties": {key: build_schema(value) for key, value in node.items()},
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
            "items": build_schema(node[0]) if node else {},
        }

    if node is None:
        return {"type": "null"}

    raise TypeError(f"Tipo não suportado no i18n: {type(node)!r} (valor: {node!r})")


def generate_schema(directory: Path, master_data: dict) -> Path:
    schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "i18n schema (gerado automaticamente a partir de pt-BR.json)",
        **build_schema(master_data),
    }

    schema_path = directory / "schemas" / SCHEMA_FILENAME
    schema_path.parent.mkdir(parents=True, exist_ok=True)
    save(schema_path, schema)

    return schema_path


def main() -> None:
    default_dir = Path(__file__).resolve().parent
    directory = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dir

    print("Sincronização dos arquivos de i18n")
    print("=" * 60)
    print(f"Diretório: {directory}")
    print(f"Arquivo mestre: {MASTER}.json")
    print()

    files = {}

    for name in LOCALES:
        path = directory / f"{name}.json"

        if not path.exists():
            print(f"[AVISO] {name}.json não encontrado; arquivo ignorado.")
            continue

        files[name] = {
            "path": path,
            "data": load(path),
        }

    if MASTER not in files:
        print(f"[ERRO] Arquivo mestre {MASTER}.json não foi encontrado.")
        sys.exit(1)

    print(f"{len(files)}/{len(LOCALES)} arquivos carregados.")
    print()

    report: dict[str, list[str]] = {}

    print("Sincronizando traduções...")
    print("-" * 60)

    for source_name, target_name, mark_todo in PROPAGATION:
        if source_name not in files or target_name not in files:
            continue

        added = fill_missing(
            files[target_name]["data"],
            files[source_name]["data"],
            mark_todo,
        )

        if added:
            report[target_name] = added

            marker = "com [//TODO]" if mark_todo else "sem [//TODO]"
            print(
                f"[ALTERADO] {target_name}.json: "
                f"{len(added)} chave(s) adicionada(s) ({marker})."
            )
        else:
            print(f"[OK] {target_name}.json já está sincronizado.")

    for name in report:
        save(files[name]["path"], files[name]["data"])

    total_added = sum(len(keys) for keys in report.values())

    print()
    print(f"Total de chaves adicionadas: {total_added}")

    if total_added:
        print(
            f'Procure por "{TODO_MARKER.strip()}" para localizar traduções pendentes.'
        )

    print()
    print("Verificando chaves órfãs...")
    print("-" * 60)

    orphans_found = False
    pt_br = files[MASTER]["data"]

    for name, info in files.items():
        if name == MASTER:
            continue

        orphans = find_orphans(info["data"], pt_br)

        if not orphans:
            print(f"[OK] {name}.json não possui chaves órfãs.")
            continue

        orphans_found = True
        print(
            f"[AVISO] {name}.json possui "
            f"{len(orphans)} chave(s) sem correspondente em {MASTER}.json:"
        )

        for key in orphans:
            print(f"    - {key}")

    print()
    print("Gerando schema...")
    print("-" * 60)

    schema_path = generate_schema(directory, pt_br)

    try:
        schema_display = schema_path.relative_to(Path.cwd())
    except ValueError:
        schema_display = schema_path

    print(f"[OK] Schema atualizado: {schema_display}")

    print()
    print("=" * 60)

    if not orphans_found and total_added == 0:
        print("Sincronização concluída. Nenhuma alteração necessária.")
    else:
        print("Sincronização concluída.")

    print("=" * 60)


if __name__ == "__main__":
    main()
