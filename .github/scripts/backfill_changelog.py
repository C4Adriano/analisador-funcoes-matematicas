#!/usr/bin/env python3
"""
backfill_changelog.py
Roda UMA VEZ localmente para preencher o CHANGELOG com os últimos N commits.

Uso:
    python backfill_changelog.py
    python backfill_changelog.py 30       # para pegar só 30 commits
    python backfill_changelog.py 50 v6.1  # forçar versão manualmente
"""

import subprocess
import sys
import re
import os
from datetime import date as dt

# ─── Configuração ────────────────────────────────────────────────────────────

N_COMMITS   = int(sys.argv[1]) if len(sys.argv) > 1 else 50
FORCE_VER   = sys.argv[2] if len(sys.argv) > 2 else None  # ex: "v6.1"

CHANGELOG_PT = "docs/CHANGELOG/CHANGELOG_PT.md"
CHANGELOG_EN = "docs/CHANGELOG/CHANGELOG_EN.md"

INCLUDED = {
    "feat":     ("Adições",   "Additions"),
    "fix":      ("Correções", "Bug Fixes"),
    "refactor": ("Mudanças",  "Changes"),
    "perf":     ("Mudanças",  "Changes"),
    "lang":     ("Mudanças",  "Changes"),
}

IGNORED = {"chore", "docs", "config", "test", "ci", "style", "build", "revert"}

TODAY = dt.today().strftime("%Y-%m-%d")

# ─── Helpers (mesmos do generate_changelog.py) ───────────────────────────────

def protect_and_translate(text_pt: str) -> str:
    placeholders = {}
    counter = [0]

    def protect(match):
        key = f"§{counter[0]}§"
        placeholders[key] = match.group(0)
        counter[0] += 1
        return key

    protected = re.sub(r'`[^`]+`', protect, text_pt)
    protected = re.sub(r'\*\*[^*]+\*\*', protect, protected)
    protected = re.sub(r'\b[\w/-]+\.\w{1,5}\b', protect, protected)

    try:
        from deep_translator import GoogleTranslator
        translated = GoogleTranslator(source="pt", target="en").translate(protected)
        if not translated:
            translated = protected
    except Exception as e:
        print(f"  [aviso] Tradução falhou: {e}. Usando texto original.")
        translated = protected

    for key, original in placeholders.items():
        translated = translated.replace(key, original)

    return translated

def parse_version(v: str) -> tuple:
    parts = v.lstrip("v").split(".")
    while len(parts) < 3:
        parts.append("0")
    return tuple(int(p) for p in parts[:3])

def format_version(t: tuple) -> str:
    return f"v{t[0]}.{t[1]}.{t[2]}"

def get_last_version(filepath: str) -> str:
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
    return last or "6.0"

def get_commits(n: int) -> list[str]:
    result = subprocess.run(
        ["git", "log", f"-{n}", "--pretty=format:%s"],
        capture_output=True, text=True
    )
    return [l.strip() for l in result.stdout.splitlines() if l.strip()]

def classify_commits(commits: list[str]) -> dict:
    groups: dict = {}
    prefix_re = re.compile(r"^(\w+)(\(.+?\))?!?:\s*(.+)$")
    tag_re    = re.compile(r"\[v\d+[\d.]*\]", re.IGNORECASE)

    for msg in commits:
        m = prefix_re.match(msg)
        if not m:
            continue
        prefix = m.group(1).lower()
        if prefix in IGNORED or prefix not in INCLUDED:
            continue

        sections = INCLUDED[prefix]
        clean = tag_re.sub("", m.group(3)).strip()
        clean = clean[0].upper() + clean[1:] if clean else clean
        groups.setdefault(sections, []).append(clean)

    return groups

def detect_version_tag(commits: list[str], last_raw: str) -> str:
    if FORCE_VER:
        t = parse_version(FORCE_VER)
        return format_version((t[0], t[1], 0))

    tag_re = re.compile(r"\[v(\d+\.\d+(?:\.\d+)?)\]", re.IGNORECASE)
    for msg in commits:
        m = tag_re.search(msg)
        if m:
            t = parse_version(m.group(1))
            return format_version((t[0], t[1], 0))

    t = parse_version(last_raw)
    return format_version((t[0], t[1], t[2] + 1))

def build_entry_pt(version: str, groups: dict) -> str:
    lines = [f"\n### Versão **{version}** - Atualizações\n"]
    lines.append(f"> **Datada de:** _`{TODAY}`_\n")
    for (sec_pt, _), items in groups.items():
        lines.append(f"\n#### {sec_pt}\n")
        for item in items:
            lines.append(f"- {item}")
    lines.append("\n\n---\n")
    return "\n".join(lines)

def build_entry_en(version: str, groups: dict) -> str:
    lines = [f"\n### Version **{version}** - Updates\n"]
    lines.append(f"> **Dated:** _`{TODAY}`_\n")
    for (_, sec_en), items in groups.items():
        lines.append(f"\n#### {sec_en}\n")
        for item in items:
            print(f"  Traduzindo: {item}")
            translated = protect_and_translate(item)
            lines.append(f"- {translated}")
    lines.append("\n\n---\n")
    return "\n".join(lines)

def append_before_anchor(filepath: str, entry: str, anchor: str) -> None:
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
    print(f"Lendo os últimos {N_COMMITS} commits...")
    commits = get_commits(N_COMMITS)
    print(f"  {len(commits)} commits encontrados.")

    groups = classify_commits(commits)
    if not groups:
        print("Nenhum commit relevante encontrado. Verifique se seus commits usam prefixos como feat:, fix:, etc.")
        sys.exit(0)

    last_raw = get_last_version(CHANGELOG_PT)
    print(f"Última versão no CHANGELOG: {last_raw}")

    version = detect_version_tag(commits, last_raw)
    print(f"Versão gerada: {version}")

    print("\nGerando entrada PT...")
    entry_pt = build_entry_pt(version, groups)

    print("Gerando entrada EN (com tradução)...")
    entry_en = build_entry_en(version, groups)

    print(f"\nEscrevendo em {CHANGELOG_PT}...")
    append_before_anchor(CHANGELOG_PT, entry_pt, "# **Próximas atualizações:**")

    print(f"Escrevendo em {CHANGELOG_EN}...")
    append_before_anchor(CHANGELOG_EN, entry_en, "# **Next updates:**")

    print("\nPronto! Revise os arquivos antes de fazer commit.")
    print("Sugestão de commit: chore: backfill CHANGELOG com histórico recente")

if __name__ == "__main__":
    main()
