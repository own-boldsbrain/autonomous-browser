# Backend Python (Workflows / Guardrails)

Este serviço complementa a API principal executando workflows automáticos, guardrails e integrações com LLM.

## Execução local

```bash
poetry install
poetry run python -m src.main
```

## Via Docker Compose

O serviço é construído pelo `config/docker-compose.yml` como `backend-python`.

## Variáveis de ambiente relevantes

- OPENAI_API_KEY: chave para chamadas LLM
- DATABASE_URL: conexões futuras (placeholder)
