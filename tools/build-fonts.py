#!/usr/bin/env python3
# Źródło: child-train@b881e09:tools/build-fonts.py (podzbiory Google Fonts osadzone jako data URL).
# Zmiany: urllib zamiast curl (curl tylko awaryjnie), ścieżki względem repozytorium, sprawdzenie wyniku
# i opcja --from, która kopiuje gotowy src/fonts.css z lokalnego klonu child-train.
"""Generuje src/fonts.css z fontami DM Sans i Fraunces osadzonymi jako data URL.

Aplikacja musi działać offline z jednego pliku HTML, więc fonty nie mogą być osobnymi plikami
ani pobierać się z CDN w trakcie zabawy. Skrypt pobiera podzbiory Latin i Latin Extended
(Latin Extended zawiera polskie znaki) i zapisuje je w src/fonts.css jako data URL w base64.

Użycie:
  python3 tools/build-fonts.py                            pobiera z Google Fonts (potrzebny internet)
  python3 tools/build-fonts.py --from ./child-train-repo
                                                          kopiuje src/fonts.css z klonu child-train
                                                          (te same rodziny i grubości)
"""
from __future__ import annotations

import argparse
import base64
import pathlib
import re
import shutil
import subprocess
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "fonts.css"

CSS_API = (
    "https://fonts.googleapis.com/css2"
    "?family=DM+Sans:wght@500"
    "&family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500"
    "&display=swap"
)
# Nowoczesny user agent sprawia, że API odpowiada zwartymi plikami woff2.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
SUBSETS = ("latin", "latin-ext")
FAMILIES = ("DM Sans", "Fraunces")

HEADER = """/* Fonty: DM Sans i Fraunces, SIL Open Font License (zob. src/assets/licenses/).
   Podzbiory Latin + Latin Extended (polskie znaki) osadzone jako data URL, więc zbudowany
   plik działa offline i nigdy nie pobiera fontów z sieci.
   Wygenerowano narzędziem tools/build-fonts.py. */
"""


def fetch(url: str, user_agent: str | None = None) -> bytes:
    headers = {"User-Agent": user_agent} if user_agent else {}
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.read()
    except Exception as error:  # np. brak certyfikatów w Pythonie na macOS
        if shutil.which("curl") is None:
            raise SystemExit(f"Nie udało się pobrać {url}: {error}") from error
        command = ["curl", "-sSL", "--fail", url] + (["-A", user_agent] if user_agent else [])
        return subprocess.run(command, capture_output=True, check=True).stdout


def field(pattern: str, block: str) -> str:
    match = re.search(pattern, block)
    if not match:
        raise SystemExit(f"Nieoczekiwany format odpowiedzi Google Fonts (brak: {pattern}).")
    return match.group(1)


def check(css: str, source: str) -> None:
    missing = [
        family
        for family in FAMILIES
        if f'font-family: "{family}"' not in css and f"font-family: '{family}'" not in css
    ]
    if missing or "data:font/woff2;base64," not in css:
        raise SystemExit(f"{source}: brak osadzonych fontów ({', '.join(missing) or 'woff2'}).")


def copy_from(checkout: pathlib.Path) -> None:
    source = checkout / "src" / "fonts.css"
    if not source.is_file():
        raise SystemExit(f"Nie znaleziono {source}. Sklonuj child-train (np. bash checkout.sh) albo podaj inną ścieżkę.")
    check(source.read_text(encoding="utf-8"), str(source))
    shutil.copyfile(source, OUTPUT)
    print(f"Skopiowano {source} -> {OUTPUT} ({OUTPUT.stat().st_size / 1024:.0f} KB)")


def download() -> None:
    api_css = fetch(CSS_API, USER_AGENT).decode("utf-8")
    blocks = re.findall(r"/\* (" + "|".join(SUBSETS) + r") \*/\s*(@font-face \{.*?\})", api_css, re.S)
    if not blocks:
        raise SystemExit("Nie znaleziono pasujących bloków @font-face.")

    parts = [HEADER]
    for subset, block in blocks:
        url = field(r"url\((https://[^)]+)\)", block)
        family = field(r"font-family: '([^']+)'", block)
        style = field(r"font-style: (\w+)", block)
        weight = field(r"font-weight: ([^;]+);", block)
        unicode_range = field(r"unicode-range: ([^;]+);", block)
        data = base64.b64encode(fetch(url)).decode("ascii")
        parts.append(
            f"/* {family} {style} {subset} */\n"
            "@font-face {\n"
            f'  font-family: "{family}";\n'
            f"  font-style: {style};\n"
            f"  font-weight: {weight};\n"
            "  font-display: swap;\n"
            f'  src: url("data:font/woff2;base64,{data}") format("woff2");\n'
            f"  unicode-range: {unicode_range};\n"
            "}\n"
        )
        print(f"{family} {style} {subset}")

    css = "\n".join(parts)
    check(css, "Google Fonts")
    OUTPUT.write_text(css, encoding="utf-8")
    print(f"Zapisano {OUTPUT} ({OUTPUT.stat().st_size / 1024:.0f} KB)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Osadza fonty DM Sans i Fraunces w src/fonts.css.")
    parser.add_argument(
        "--from",
        dest="checkout",
        type=pathlib.Path,
        metavar="KATALOG",
        help="lokalny klon child-train, z którego skopiować src/fonts.css",
    )
    args = parser.parse_args()
    if args.checkout:
        copy_from(args.checkout.resolve())
    else:
        download()


if __name__ == "__main__":
    main()
