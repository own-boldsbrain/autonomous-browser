"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Star, Zap, Battery, Sun, Wind } from "lucide-react";
import { Conversation } from "ai-elements";

interface Equipamento {
  categoria: string;
  fabricante: string;
  modelo: string;
  familia?: string;
  datasheet?: any;
  certificacao?: any;
  urls?: any;
}

export default function MarketplacePage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [filteredEquipamentos, setFilteredEquipamentos] = useState<Equipamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFabricante, setSelectedFabricante] = useState("all");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  useEffect(() => {
    filterEquipamentos();
  }, [equipamentos, searchTerm, selectedCategory, selectedFabricante]);

  const fetchEquipamentos = async () => {
    try {
      // Fetch from the backend API
      const response = await fetch('http://localhost:8000/marketplace/items');
      if (response.ok) {
        const data = await response.json();
        setEquipamentos(data);
      } else {
        // Fallback to local JSON if API is not available
        const localResponse = await fetch('/api/datasheets');
        const data = await localResponse.json();
        setEquipamentos(data.equipamentos || []);
      }
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      // Fallback to mock data
      setEquipamentos([
        {
          categoria: "modulo_fotovoltaico",
          fabricante: "BYD",
          modelo: "AURO N-NLBK-39-650W",
          familia: "AURO N Series",
          datasheet: { potencia_nominal_wp: 650, eficiencia_pct: 23.25 }
        },
        {
          categoria: "inversor_on_grid",
          fabricante: "Enphase",
          modelo: "IQ8",
          familia: "IQ8 Series",
          datasheet: { potencia_nominal_ac_kw: 0.366, rendimento_max_pct: 97.5 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipamentos = () => {
    let filtered = equipamentos;

    if (searchTerm) {
      filtered = filtered.filter(equip =>
        equip.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equip.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (equip.familia && equip.familia.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(equip => equip.categoria === selectedCategory);
    }

    if (selectedFabricante !== "all") {
      filtered = filtered.filter(equip => equip.fabricante === selectedFabricante);
    }

    setFilteredEquipamentos(filtered);
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "modulo_fotovoltaico": return <Sun className="h-4 w-4" />;
      case "inversor_on_grid":
      case "inversor_hibrido": return <Zap className="h-4 w-4" />;
      case "bateria_bess": return <Battery className="h-4 w-4" />;
      default: return <Wind className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      "modulo_fotovoltaico": "Módulo Fotovoltaico",
      "inversor_on_grid": "Inversor On-Grid",
      "inversor_hibrido": "Inversor Híbrido",
      "bateria_bess": "Bateria",
      "controlador_carga_mppt": "Controlador MPPT"
    };
    return labels[categoria] || categoria;
  };

  const uniqueCategories = [...new Set(equipamentos.map(e => e.categoria))];
  const uniqueFabricantes = [...new Set(equipamentos.map(e => e.fabricante))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Yello Solar Hub Marketplace
        </h1>
        <p className="text-xl text-muted-foreground">
          One Stop Solar Shop - Equipamentos certificados para sua instalação fotovoltaica
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Modelo, fabricante ou família..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fabricante</label>
              <Select value={selectedFabricante} onValueChange={setSelectedFabricante}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os fabricantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fabricantes</SelectItem>
                  {uniqueFabricantes.map(fabricante => (
                    <SelectItem key={fabricante} value={fabricante}>
                      {fabricante}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                Consultar IA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipamentos.map((equip, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getCategoryIcon(equip.categoria)}
                  {getCategoryLabel(equip.categoria)}
                </Badge>
                <Button size="sm" variant="ghost">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{equip.modelo}</CardTitle>
              <CardDescription>
                {equip.fabricante} {equip.familia && `- ${equip.familia}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {equip.datasheet && (
                  <div className="text-sm text-muted-foreground">
                    {equip.datasheet.potencia_nominal_wp && (
                      <p>Potência: {equip.datasheet.potencia_nominal_wp}W</p>
                    )}
                    {equip.datasheet.potencia_nominal_ac_kw && (
                      <p>Potência AC: {equip.datasheet.potencia_nominal_ac_kw}kW</p>
                    )}
                    {equip.datasheet.eficiencia_pct && (
                      <p>Eficiência: {equip.datasheet.eficiencia_pct}%</p>
                    )}
                    {equip.datasheet.rendimento_max_pct && (
                      <p>Rendimento: {equip.datasheet.rendimento_max_pct}%</p>
                    )}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    Comparar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum equipamento encontrado com os filtros aplicados.
          </p>
        </div>
      )}

      {/* AI Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl h-3/4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Assistente Solar IA</h2>
              <Button variant="ghost" onClick={() => setChatOpen(false)}>
                ✕
              </Button>
            </div>
            <Conversation
              messages={[
                {
                  id: "1",
                  role: "assistant",
                  content: "Olá! Sou seu assistente especializado em energia solar. Como posso ajudar você a encontrar o equipamento ideal para seu projeto?"
                }
              ]}
              onSendMessage={(message: any) => {
                console.log("Mensagem enviada:", message);
                // Aqui você integraria com sua API de IA
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}