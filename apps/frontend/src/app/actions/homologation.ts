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
    const response = await fetch(`${API_BASE_URL}/endereco/validate`, {
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
    const response = await fetch(`${API_BASE_URL}/ucs/${ucId}/analise-consumo`, {
      method: "POST",
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
    const response = await fetch(`${API_BASE_URL}/ucs/${ucId}/formulario-prodist`, {
      method: "POST",
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