import { NextResponse } from 'next/server';

// Dados de exemplo para simulação do marketplace
const equipamentos = [
  {
    categoria: "modulo_fotovoltaico",
    fabricante: "BYD",
    modelo: "AURO N-NLBK-39-650W",
    familia: "AURO N Series",
    datasheet: { potencia_nominal_wp: 650, eficiencia_pct: 23.25 },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "modulo_fotovoltaico",
    fabricante: "Canadian Solar",
    modelo: "CS6R-MS-545MS",
    familia: "HiKu7 MS",
    datasheet: { potencia_nominal_wp: 545, eficiencia_pct: 21.50 },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "modulo_fotovoltaico",
    fabricante: "JinkoSolar",
    modelo: "JKM580N-72HL4-V",
    familia: "Tiger Neo",
    datasheet: { potencia_nominal_wp: 580, eficiencia_pct: 22.30 },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "inversor_on_grid",
    fabricante: "Growatt",
    modelo: "MIN 10000TL-X",
    familia: "MIN TL-X Series",
    datasheet: {
      potencia_nominal_ac_kw: 10.0,
      rendimento_max_pct: 98.3,
    },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "inversor_on_grid",
    fabricante: "Deye",
    modelo: "SUN-12K-G03",
    familia: "Sunshine Series",
    datasheet: {
      potencia_nominal_ac_kw: 12.0,
      rendimento_max_pct: 98.2,
    },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "inversor_hibrido",
    fabricante: "Deye",
    modelo: "SUN-8K-SG01HP1-EU",
    familia: "Hybrid Series",
    datasheet: {
      potencia_nominal_ac_kw: 8.0,
      rendimento_max_pct: 97.6,
    },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "bateria_bess",
    fabricante: "BYD",
    modelo: "Battery-Box Premium HVS 5.1",
    familia: "HVS Series",
    datasheet: {
      capacidade_kwh: 5.1,
      ciclos_vida: 6000,
    },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "bateria_bess",
    fabricante: "Pylontech",
    modelo: "US3000C",
    familia: "US Series",
    datasheet: {
      capacidade_kwh: 3.55,
      ciclos_vida: 6000,
    },
    certificacao: { inmetro: true, portaria140: true }
  },
  {
    categoria: "controlador_carga_mppt",
    fabricante: "Victron Energy",
    modelo: "SmartSolar MPPT 100/50",
    familia: "SmartSolar Series",
    datasheet: {
      corrente_max_a: 50,
      tensao_maxima_v: 100,
    },
    certificacao: { inmetro: true }
  }
];

export async function GET() {
  // Adiciona um pequeno atraso para simular a comunicação com o servidor
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(equipamentos);
}