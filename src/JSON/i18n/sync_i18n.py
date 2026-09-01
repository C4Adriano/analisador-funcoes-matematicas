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
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        f.write("\n")


def fill_missing(target: dict, source: dict, mark_todo: bool, prefix: str = ""):
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
    orphans = []
    for key, value in target.items():
        path = f"{prefix}.{key}" if prefix else key
        if key not in source:
            orphans.append(path)
        elif isinstance(value, dict) and isinstance(source.get(key), dict):
            orphans += find_orphans(value, source[key], path)
    return orphans


def build_schema(node):
    if isinstance(node, dict):
        return {
            "type": "object",
            "additionalProperties": False,
            "required": list(node.keys()),
            "properties": {k: build_schema(v) for k, v in node.items()},
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
        return {"type": "array", "items": build_schema(node[0]) if node else {}}
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
    directory: Path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dir

    files = {}
    for name in LOCALES:
        path: Path = directory / f"{name}.json"
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
        added = fill_missing(
            files[target_name]["data"], files[source_name]["data"], mark_todo
        )
        if added:
            report[target_name] = added

    for name in report:
        save(files[name]["path"], files[name]["data"])

    print("=" * 60)
    if report:
        print("Chaves adicionadas:")
        for name, keys in report.items():
            print(f"\n  {name}.json — {len(keys)} chave(s):")
            for k in keys:
                print(f"    + {k}")
        print(
            f"\nDica: procure por “{TODO_MARKER.strip()}” nos arquivos para achar tudo que ainda falta traduzir."
        )
    else:
        print("Nenhuma chave nova para propagar. Tudo já está sincronizado.")

    print("\n" + "=" * 60)
    orphans_found = False
    pt_br = files[MASTER]["data"]
    for name, info in files.items():
        if name == MASTER:
            continue
        orphans = find_orphans(info["data"], pt_br)
        if orphans:
            orphans_found = True
            print(f"\nAVISO — chaves em {name}.json sem correspondente em pt-BR.json:")
            for k in orphans:
                print(f"    ? {k}")
    if not orphans_found:
        print("Nenhuma chave órfã encontrada.")
    print("=" * 60)

    schema_path = generate_schema(directory, pt_br)
    print(f"\nSchema atualizado em: {schema_path}")


if __name__ == "__main__":
    main()
