#!/usr/bin/env python3
"""
generate_changelog.py
Lê os commits novos, determina a versão, traduz PT→EN e escreve nos dois CHANGELOGs.
"""

import subprocess
import sys
import re
import os

# ─── Configuração ────────────────────────────────────────────────────────────

# Prefixos que aparecem no CHANGELOG e sua seção
INCLUDED = {
    "feat":     ("Adições",  "Additions"),
    "fix":      ("Correções", "Bug Fixes"),
    "refactor": ("Mudanças", "Changes"),
    "perf":     ("Mudanças", "Changes"),
    "lang":     ("Mudanças", "Changes"),
}

# Prefixos ignorados
IGNORED = {"chore", "docs", "config", "test", "ci", "style", "build", "revert"}

CHANGELOG_PT = "docs/CHANGELOG/CHANGELOG_PT.md"
CHANGELOG_EN = "docs/CHANGELOG/CHANGELOG_EN.md"

# ─── Tradução ────────────────────────────────────────────────────────────────

def protect_and_translate(text_pt: str) -> str:
    """
    Protege backticks, nomes de arquivo e negrito da tradução,
    traduz o restante PT→EN e restaura os trechos protegidos.
    """
    placeholders = {}
    counter = [0]

    def protect(match):
        key = f"§{counter[0]}§"
        placeholders[key] = match.group(0)
        counter[0] += 1
        return key

    # Protege: `código`, **negrito**, palavras com ponto e extensão (arquivo.js)
    protected = re.sub(r'`[^`]+`', protect, text_pt)
    protected = re.sub(r'\*\*[^*]+\*\*', protect, protected)
    protected = re.sub(r'\b[\w/-]+\.\w{1,5}\b', protect, protected)

    try:
        from deep_translator import GoogleTranslator
        translated = GoogleTranslator(source="pt", target="en").translate(protected)
        if not translated:
            translated = protected
    except Exception:
        translated = protected  # fallback: sem tradução

    # Restaura os placeholders
    for key, original in placeholders.items():
        translated = translated.replace(key, original)

    return translated

# ─── Versão ──────────────────────────────────────────────────────────────────

def parse_version(v: str) -> tuple:
    """Converte 'v6.1.0' em (6, 1, 0)."""
    parts = v.lstrip("v").split(".")
    while len(parts) < 3:
        parts.append("0")
    return tuple(int(p) for p in parts[:3])

def format_version(t: tuple) -> str:
    return f"v{t[0]}.{t[1]}.{t[2]}"

def get_last_version(filepath: str) -> str:
    """Lê o CHANGELOG e retorna a última versão encontrada (ex: 'v6.0')."""
    pattern = re.compile(r"###\s+Versão\s+\*\*([0-9]+\.[0-9]+(?:\.[0-9]+)?)\*\*")
    last = None
    try:
        with open(filepath, encoding="utf-8") as f:
            for line in f:
                m = pattern.search(line)
                if m:
                    last = m.group(1)
    except FileNotFoundError:
        pass
    return last or "0.0"

def determine_version(commits: list[str], last_raw: str) -> str:
    """
    Se algum commit tiver [vX.Y], usa X.Y.0.
    Caso contrário, incrementa o último número da última versão.
    """
    tag_pattern = re.compile(r"\[v(\d+\.\d+(?:\.\d+)?)\]", re.IGNORECASE)
    for msg in commits:
        m = tag_pattern.search(msg)
        if m:
            t = parse_version(m.group(1))
            # garante formato X.Y.0
            return format_version((t[0], t[1], 0))

    # Sem tag → incrementa último número
    t = parse_version(last_raw)
    return format_version((t[0], t[1], t[2] + 1))

# ─── Commits ─────────────────────────────────────────────────────────────────

def get_new_commits() -> list[str]:
    """
    Retorna as mensagens dos commits desde o penúltimo push
    (ou desde o início se for o primeiro push).
    """
    # GITHUB_BEFORE é a SHA anterior ao push, disponível na Action
    before = os.environ.get("GITHUB_BEFORE", "")

    if before and before != "0000000000000000000000000000000000000000":
        result = subprocess.run(
            ["git", "log", f"{before}..HEAD", "--pretty=format:%s"],
            capture_output=True, text=True
        )
    else:
        result = subprocess.run(
            ["git", "log", "-20", "--pretty=format:%s"],
            capture_output=True, text=True
        )

    lines = [l.strip() for l in result.stdout.splitlines() if l.strip()]
    return lines

def classify_commits(commits: list[str]) -> dict:
    """
    Retorna dict: { (seção_pt, seção_en): [mensagens limpas] }
    """
    groups: dict = {}
    prefix_re = re.compile(r"^(\w+)(\(.+?\))?!?:\s*(.+)$")
    tag_re = re.compile(r"\[v\d+[\d.]*\]", re.IGNORECASE)

    for msg in commits:
        m = prefix_re.match(msg)
        if not m:
            continue
        prefix = m.group(1).lower()
        if prefix in IGNORED:
            continue
        if prefix not in INCLUDED:
            continue

        sections = INCLUDED[prefix]
        clean = tag_re.sub("", m.group(3)).strip()
        # Capitaliza primeira letra
        clean = clean[0].upper() + clean[1:] if clean else clean

        groups.setdefault(sections, []).append(clean)

    return groups

# ─── Escrita ─────────────────────────────────────────────────────────────────

def build_entry_pt(version: str, groups: dict, date: str) -> str:
    lines = [f"\n### Versão **{version}**\n"]
    lines.append(f"> **Datada de:** _`{date}`_\n")
    for (sec_pt, _sec_en), items in groups.items():
        lines.append(f"\n#### {sec_pt}\n")
        for item in items:
            lines.append(f"- {item}")
    lines.append("\n\n---\n")
    return "\n".join(lines)

def build_entry_en(version: str, groups: dict, date: str) -> str:
    lines = [f"\n### Version **{version}**\n"]
    lines.append(f"> **Dated:** _`{date}`_\n")
    for (_sec_pt, sec_en), items in groups.items():
        lines.append(f"\n#### {sec_en}\n")
        for item in items:
            translated = protect_and_translate(item)
            lines.append(f"- {translated}")
    lines.append("\n\n---\n")
    return "\n".join(lines)

def append_before_section(filepath: str, entry: str, anchor: str) -> None:
    """
    Insere a entrada antes da seção 'Próximas atualizações' (ou no fim do arquivo).
    """
    try:
        with open(filepath, encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        content = ""

    if anchor in content:
        content = content.replace(anchor, entry + anchor)
    else:
        content = content.rstrip() + "\n" + entry

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    from datetime import date as dt
    today = dt.today().strftime("%Y-%m-%d")

    commits = get_new_commits()
    if not commits:
        print("Nenhum commit novo encontrado.")
        sys.exit(0)

    groups = classify_commits(commits)
    if not groups:
        print("Nenhum commit relevante para o CHANGELOG.")
        sys.exit(0)

    last_raw = get_last_version(CHANGELOG_PT)
    version = determine_version(commits, last_raw)

    print(f"Versão determinada: {version}")
    print(f"Grupos: {list(groups.keys())}")

    entry_pt = build_entry_pt(version, groups, today)
    entry_en = build_entry_en(version, groups, today)

    # Âncora: insere antes da seção de próximas atualizações
    anchor_pt = "# **Próximas atualizações:**"
    anchor_en = "# **Next updates:**"

    append_before_section(CHANGELOG_PT, entry_pt, anchor_pt)
    append_before_section(CHANGELOG_EN, entry_en, anchor_en)

    print("CHANGELOGs atualizados com sucesso.")

if __name__ == "__main__":
    main()
