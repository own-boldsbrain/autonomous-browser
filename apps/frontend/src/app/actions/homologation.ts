"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createUnidadeConsumidora(data: Record<string, unknown>) {
  try {
    const response = await fetch(`${API_BASE_URL}/ucs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create unidade consumidora:", error);
    throw error;
  }
}

export async function validateAddress(data: Record<string, unknown>) {
  try {
    const response = await fetch(`${API_BASE_URL}/validacao-endereco/completo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to validate address:", error);
    throw error;
  }
}

export async function analyzeConsumption(ucId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/analises/unidade-consumidora/${ucId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to analyze consumption:", error);
    throw error;
  }
}

export async function generateProdistForm(ucId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/formularios-prodist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_formulario: `PROD-${ucId}`,
        ug_id: ucId,
        versao_formulario: "PRODIST 2023",
        acessante: {
          nome: "Nome do Acessante",
          tipo_documento: "CPF",
          documento: "123.456.789-00",
          email: "email@exemplo.com",
          telefone: "(11) 99999-9999"
        },
        distribuidora: "ENEL",
        dados_conexao: {
          potencia_instalada_kw: 5.0,
          tensao_conexao_v: 220,
          codigo_uc: ucId,
          modalidade: "autoconsumo_remoto",
          classificacao: "residencial",
          tipo_fonte: "solar"
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to generate PRODIST form:", error);
    throw error;
  }
}