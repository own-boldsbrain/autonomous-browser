"""Índice vetorial simples para normas / portarias.

Objetivo MVP:
- Carregar textos base (placeholder) de normas.
- Gerar embeddings (stub: média de hash chars) substituível por modelo real.
- Persistir em JSON (vector_index_normas.json).
- Função de busca por similaridade (cosine) com top_k.

Substituições futuras:
- Integrar modelo open-source (e.g., sentence-transformers) ou API.
- Persistir em SQLite / Chroma / FAISS.
"""

from __future__ import annotations
import json
import math
import os
from dataclasses import dataclass, asdict
from typing import List, Iterable, Tuple

INDEX_PATH = os.environ.get("NORMAS_INDEX_PATH", "vector_index_normas.json")

# Placeholder corpus (em produção: extrair de PDFs e normalizar)
CORPUS = [
    {
        "id": "portaria_140_art3",
        "texto": (
            "Portaria 140 artigo 3 estabelece requisitos de certificacao para "
            "inversores ate 75 kW."
        ),
    },
    {
        "id": "prodist_mod3_anexo3a",
        "texto": (
            "PRODIST Modulo 3 Anexo 3A define informacoes necessarias para "
            "solicitacao microgeracao."
        ),
    },
    {
        "id": "iec_61215_modulos",
        "texto": (
            "Norma IEC 61215 define testes de desempenho para modulos "
            "fotovoltaicos cristalinos."
        ),
    },
]


def _embed(text: str) -> List[float]:
    # Stub determinístico: conta frequência de caracteres a-z normalizados
    vec = [0] * 26
    for ch in text.lower():
        if "a" <= ch <= "z":
            vec[ord(ch) - 97] += 1
    # Normalização L2
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def _cos(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


@dataclass
class IndexEntry:
    id: str
    texto: str
    embedding: List[float]


def build_index(corpus: Iterable[dict]) -> List[IndexEntry]:
    entries = []
    for item in corpus:
        emb = _embed(item["texto"])
        entries.append(
            IndexEntry(
                id=item["id"],
                texto=item["texto"],
                embedding=emb,
            )
        )
    return entries


def save_index(entries: List[IndexEntry], path: str = INDEX_PATH) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(
            [asdict(e) for e in entries],
            f,
            ensure_ascii=False,
            indent=2,
        )


def load_index(path: str = INDEX_PATH) -> List[IndexEntry]:
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return [IndexEntry(**r) for r in raw]


def ensure_index() -> List[IndexEntry]:
    idx = load_index()
    if not idx:
        idx = build_index(CORPUS)
        save_index(idx)
    return idx


def search_normas(query: str, top_k: int = 3) -> List[Tuple[str, float, str]]:
    idx = ensure_index()
    q_emb = _embed(query)
    scored = []
    for e in idx:
        scored.append((e.id, _cos(q_emb, e.embedding), e.texto))
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]


__all__ = [
    "build_index",
    "search_normas",
    "ensure_index",
    "load_index",
    "save_index",
]
