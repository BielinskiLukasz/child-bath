#!/usr/bin/env python3
# Źródło: child-train@b881e09:tools/generate-icons.py (płótno z nadpróbkowaniem i zapis PNG bez zewnętrznych bibliotek).
# Zmiany: rysunek wanny z pianą, malowanie tylko w obszarze kształtu (szybciej), wariant maskable
# z marginesem bezpieczeństwa i pomijanie aktualnych plików (--force wymusza generowanie).
"""Generuje ikony PNG aplikacji (PWA i Apple) wyłącznie biblioteką standardową Pythona.

Rysunek odpowiada plikom public/icons/bath-icon.svg i bath-maskable.svg: wanna na nóżkach
z kremową pianą na tle szałwiowych kafelków. Współrzędne są ułamkami boku ikony (0-1).

Użycie: python3 tools/generate-icons.py [--force]
"""
from __future__ import annotations

import argparse
import math
import pathlib
import struct
import zlib

SCRIPT = pathlib.Path(__file__).resolve()
ROOT = SCRIPT.parents[1] / "public" / "icons"

SAGE = "#a8bfaa"  # kafelki (tło)
FOAM = "#fffcf3"  # piana i brzeg wanny
TUB = "#f5eedb"  # korpus wanny
WOOD = "#9c7155"  # nóżki

# Nazwa pliku, bok w pikselach, skala rysunku. Ikona maskable mieści rysunek w bezpiecznym kole (80%).
ICONS = (
    ("icon-192.png", 192, 1.0),
    ("icon-512.png", 512, 1.0),
    ("maskable-512.png", 512, 0.8),
    ("apple-touch-icon.png", 180, 1.0),
)


class Canvas:
    def __init__(self, size: int, scale: int = 2, zoom: float = 1.0):
        self.size, self.scale, self.zoom = size, scale, zoom
        self.side = size * scale
        self.pixels = bytearray(self.side * self.side * 4)

    def _at(self, value: float) -> float:
        """Przelicza współrzędną rysunku po pomniejszeniu wokół środka ikony."""
        return 0.5 + (value - 0.5) * self.zoom

    def paint(self, color: str, inside, bbox: tuple[float, float, float, float]) -> None:
        """Maluje piksele wewnątrz kształtu, sprawdzając tylko jego prostokąt ograniczający."""
        rgba = bytes.fromhex(color.lstrip("#")) + b"\xff"
        side = self.side
        x_start = max(0, int(bbox[0] * side) - 1)
        y_start = max(0, int(bbox[1] * side) - 1)
        x_end = min(side, math.ceil(bbox[2] * side) + 1)
        y_end = min(side, math.ceil(bbox[3] * side) + 1)
        for y in range(y_start, y_end):
            cy = (y + 0.5) / side
            row = y * side
            for x in range(x_start, x_end):
                if inside((x + 0.5) / side, cy):
                    offset = (row + x) * 4
                    self.pixels[offset:offset + 4] = rgba

    def fill(self, color: str) -> None:
        self.pixels[:] = (bytes.fromhex(color.lstrip("#")) + b"\xff") * (self.side * self.side)

    def rect(self, x0: float, y0: float, x1: float, y1: float, color: str) -> None:
        x0, y0, x1, y1 = (self._at(v) for v in (x0, y0, x1, y1))
        self.paint(color, lambda x, y: x0 <= x <= x1 and y0 <= y <= y1, (x0, y0, x1, y1))

    def round_rect(self, x0: float, y0: float, x1: float, y1: float, radius: float, color: str) -> None:
        x0, y0, x1, y1 = (self._at(v) for v in (x0, y0, x1, y1))
        r = radius * self.zoom

        def inside(x: float, y: float) -> bool:
            cx = min(max(x, x0 + r), x1 - r)
            cy = min(max(y, y0 + r), y1 - r)
            return (x - cx) ** 2 + (y - cy) ** 2 <= r * r

        self.paint(color, inside, (x0, y0, x1, y1))

    def circle(self, cx: float, cy: float, radius: float, color: str) -> None:
        cx, cy, r = self._at(cx), self._at(cy), radius * self.zoom
        self.paint(color, lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 <= r * r, (cx - r, cy - r, cx + r, cy + r))

    def png(self) -> bytes:
        n, s = self.size, self.scale
        side, pixels = self.side, self.pixels
        count = s * s
        raw = bytearray()
        for y in range(n):
            raw.append(0)  # filtr wiersza: brak
            for x in range(n):
                r = g = b = a = 0
                for dy in range(s):
                    row = ((y * s + dy) * side + x * s) * 4
                    for dx in range(s):
                        i = row + dx * 4
                        r += pixels[i]
                        g += pixels[i + 1]
                        b += pixels[i + 2]
                        a += pixels[i + 3]
                raw.extend((r // count, g // count, b // count, a // count))

        def chunk(kind: bytes, data: bytes) -> bytes:
            body = kind + data
            return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

        return (
            b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">2I5B", n, n, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
            + chunk(b"IEND", b"")
        )


def draw_bath(c: Canvas) -> None:
    # Piana: kremowe bańki rysowane przed brzegiem wanny, który zasłania ich dół.
    for cx, cy, r in ((0.40, 0.22, 0.04), (0.62, 0.20, 0.028), (0.34, 0.44, 0.10), (0.52, 0.39, 0.13), (0.69, 0.445, 0.09)):
        c.circle(cx, cy, r, FOAM)
    # Nóżki wanny.
    c.round_rect(0.25, 0.74, 0.33, 0.83, 0.03, WOOD)
    c.round_rect(0.67, 0.74, 0.75, 0.83, 0.03, WOOD)
    # Korpus: prosta góra pod brzegiem i zaokrąglony dół.
    c.rect(0.16, 0.53, 0.84, 0.64, TUB)
    c.round_rect(0.16, 0.53, 0.84, 0.76, 0.11, TUB)
    # Brzeg wanny: najjaśniejszy pas u góry, jak w rysunkach child-train.
    c.round_rect(0.12, 0.47, 0.88, 0.545, 0.0375, FOAM)


def make_icon(size: int, path: pathlib.Path, zoom: float) -> None:
    canvas = Canvas(size, 2, zoom)
    canvas.fill(SAGE)
    draw_bath(canvas)
    path.write_bytes(canvas.png())


def is_fresh(outputs: list[pathlib.Path]) -> bool:
    script_time = SCRIPT.stat().st_mtime
    return all(path.exists() and path.stat().st_mtime >= script_time for path in outputs)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generuje ikony PNG Małej łazienki.")
    parser.add_argument("--force", action="store_true", help="generuj także wtedy, gdy pliki są aktualne")
    args = parser.parse_args()

    ROOT.mkdir(parents=True, exist_ok=True)
    outputs = [ROOT / name for name, _, _ in ICONS]
    if not args.force and is_fresh(outputs):
        print(f"Ikony PNG są aktualne ({ROOT}).")
        return
    for name, size, zoom in ICONS:
        make_icon(size, ROOT / name, zoom)
    print(f"Wygenerowano ikony PNG w {ROOT}")


if __name__ == "__main__":
    main()
