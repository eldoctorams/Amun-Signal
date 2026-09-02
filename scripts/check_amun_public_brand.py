#!/usr/bin/env python3
"""Fail CI when legacy branding leaks into AMUN SIGNAL public surfaces."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_SURFACES = (
    Path("README.md"),
    Path("pyproject.toml"),
    Path("uv.lock"),
    Path(".github/CODEOWNERS"),
    Path(".github/copilot-instructions.md"),
    Path(".github/pull_request_template.md"),
    Path("frontend/src/app/layout.tsx"),
    Path("frontend/src/lib/brand.ts"),
    Path("frontend/src/components/amun"),
    Path("frontend/src/i18n/translations"),
)
FORBIDDEN = {
    "legacy product name": re.compile(r"shadow\s*broker", re.IGNORECASE),
    "legacy repository owner": re.compile(r"bigbodycobain", re.IGNORECASE),
}
TEXT_SUFFIXES = {".html", ".json", ".md", ".ts", ".tsx", ".txt"}


def iter_public_files() -> list[Path]:
    files: list[Path] = []
    for relative in PUBLIC_SURFACES:
        target = ROOT / relative
        if target.is_file():
            files.append(target)
        elif target.is_dir():
            files.extend(
                path
                for path in target.rglob("*")
                if path.is_file() and path.suffix.lower() in TEXT_SUFFIXES
            )
        else:
            raise FileNotFoundError(f"Public brand surface does not exist: {relative}")
    return sorted(set(files))


def main() -> int:
    violations: list[str] = []
    for path in iter_public_files():
        text = path.read_text(encoding="utf-8")
        for label, pattern in FORBIDDEN.items():
            for match in pattern.finditer(text):
                line = text.count("\n", 0, match.start()) + 1
                relative = path.relative_to(ROOT)
                violations.append(f"{relative}:{line}: {label}")

    if violations:
        print("AMUN SIGNAL public-brand guard failed:", file=sys.stderr)
        print("\n".join(f"- {item}" for item in violations), file=sys.stderr)
        return 1

    print(f"AMUN SIGNAL public-brand guard passed ({len(iter_public_files())} files).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
