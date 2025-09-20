"""Guardrail de domínio para Homologação (energia regulatória / Portaria 140 / PRODIST).

Responsabilidade:
- Validar input e output de respostas de agentes antes de serem retornadas.
- Enforce escopo: termos obrigatórios e bloqueio de termos proibidos.
- Normalizar severidades e produzir estrutura auditável.

Design simples (stateless) com função:
    apply_guardrail(text: str, phase: Literal['input', 'output'])

Pode ser evoluído para incorporar modelos de classificação.
"""

from __future__ import annotations
import re
from dataclasses import dataclass, asdict
from typing import List, Literal, Dict, Any

# Termos esperados que indicam contexto regulatório válido
REQUIRED_KEYWORDS = [
    r"portaria\s*140",
    r"prodist",
    r"iec\s*61215",
    r"iec\s*61730",
    r"iec\s*62619",
    r"tarifa\s*branca",
    r"demanda\s*contratada",
]

# Termos suspeitos / proibidos (exfiltração, dados sensíveis, fuga de escopo)
BLOCKED_PATTERNS = [
    r"chave\s*api",
    r"segredo\s*api",
    r"senha",
    r"drop\s+table",
    r"select\s+.*from\s+pg_",
    r"instru[cç][aã]o\s+fora\s+escopo",
]


@dataclass
class GuardrailFinding:
    type: str  # required_keyword_missing | blocked_pattern_detected
    detail: str
    severity: str  # LOW | MEDIUM | HIGH
    pattern: str


@dataclass
class GuardrailResult:
    ok: bool
    phase: str
    findings: List[GuardrailFinding]
    normalized_text: str


_required_compiled = [re.compile(p, re.IGNORECASE) for p in REQUIRED_KEYWORDS]
_blocked_compiled = [re.compile(p, re.IGNORECASE) for p in BLOCKED_PATTERNS]


def _scan(text: str) -> Dict[str, Any]:
    findings: List[GuardrailFinding] = []

    # Blocked first (HIGH severity)
    for pat in _blocked_compiled:
        if pat.search(text):
            findings.append(
                GuardrailFinding(
                    type="blocked_pattern_detected",
                    detail=f"Termo proibido encontrado: '{pat.pattern}'",
                    severity="HIGH",
                    pattern=pat.pattern,
                )
            )

    # Missing required (LOW/MED depending on count)
    missing = []
    for pat in _required_compiled:
        if not pat.search(text):
            missing.append(pat.pattern)
    if missing:
        sev = "MEDIUM" if len(missing) > len(REQUIRED_KEYWORDS) // 2 else "LOW"
        findings.append(
            GuardrailFinding(
                type="required_keyword_missing",
                detail=f"Ausentes: {', '.join(missing)}",
                severity=sev,
                pattern="|".join(missing),
            )
        )

    return {"findings": findings, "ok": not any(f.severity == "HIGH" for f in findings)}


def apply_guardrail(
    text: str,
    phase: Literal["input", "output"],
) -> GuardrailResult:
    """Aplica validações simples.

    - Normaliza espaços
    - Roda escaneamento
    - Se HIGH severity presente -> ok False
    """
    normalized = re.sub(r"\s+", " ", text).strip()
    scan = _scan(normalized)
    return GuardrailResult(
        ok=scan["ok"],
        phase=phase,
        findings=scan["findings"],
        normalized_text=normalized,
    )


def serialize_result(result: GuardrailResult) -> Dict[str, Any]:
    return {
        "ok": result.ok,
        "phase": result.phase,
        "normalized_text": result.normalized_text,
        "findings": [asdict(f) for f in result.findings],
    }


__all__ = [
    "apply_guardrail",
    "serialize_result",
    "GuardrailResult",
    "GuardrailFinding",
]
