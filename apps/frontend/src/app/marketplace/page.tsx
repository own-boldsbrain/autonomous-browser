"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ShoppingCart,
  Star,
  Zap,
  Battery,
  Sun,
  Wind,
  Send,
  Bot,
  User,
} from "lucide-react";

interface Equipamento {
  categoria: string;
  fabricante: string;
  modelo: string;
  familia?: string;
  datasheet?: {
    potencia_nominal_wp?: number;
    potencia_nominal_ac_kw?: number;
    eficiencia_pct?: number;
    rendimento_max_pct?: number;
  };
  certificacao?: Record<string, unknown>;
  urls?: Record<string, unknown>;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function MarketplacePage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [filteredEquipamentos, setFilteredEquipamentos] = useState<
    Equipamento[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFabricante, setSelectedFabricante] = useState("all");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou seu assistente especializado em energia solar. Como posso ajudar você a encontrar o equipamento ideal para seu projeto?",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fetchEquipamentos = async () => {
    try {
      // Tentar buscar os dados da API local
      const response = await fetch("/api/datasheets");
      if (response.ok) {
        const data = await response.json();
        setEquipamentos(data);
      } else {
        console.error("Erro ao buscar dados da API:", response.statusText);
        // Dados fallback em caso de erro
        setEquipamentos([
          {
            categoria: "modulo_fotovoltaico",
            fabricante: "BYD",
            modelo: "AURO N-NLBK-39-650W",
            familia: "AURO N Series",
            datasheet: { potencia_nominal_wp: 650, eficiencia_pct: 23.25 },
          },
          {
            categoria: "inversor_on_grid",
            fabricante: "Enphase",
            modelo: "IQ8",
            familia: "IQ8 Series",
            datasheet: { potencia_nominal_ac_kw: 0.366, rendimento_max_pct: 97.5 },
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
      // Fallback to mock data
      setEquipamentos([
        {
          categoria: "modulo_fotovoltaico",
          fabricante: "BYD",
          modelo: "AURO N-NLBK-39-650W",
          familia: "AURO N Series",
          datasheet: { potencia_nominal_wp: 650, eficiencia_pct: 23.25 },
        },
        {
          categoria: "inversor_on_grid",
          fabricante: "Enphase",
          modelo: "IQ8",
          familia: "IQ8 Series",
          datasheet: {
            potencia_nominal_ac_kw: 0.366,
            rendimento_max_pct: 97.5,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const filterEquipamentos = useCallback(() => {
    let filtered = equipamentos;

    if (searchTerm) {
      filtered = filtered.filter(
        (equip) =>
          equip.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equip.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (equip.familia &&
            equip.familia.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (equip) => equip.categoria === selectedCategory
      );
    }

    if (selectedFabricante !== "all") {
      filtered = filtered.filter(
        (equip) => equip.fabricante === selectedFabricante
      );
    }

    setFilteredEquipamentos(filtered);
  }, [equipamentos, searchTerm, selectedCategory, selectedFabricante]);

  useEffect(() => {
    filterEquipamentos();
  }, [filterEquipamentos]);

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "modulo_fotovoltaico":
        return <Sun className="h-4 w-4" />;
      case "inversor_on_grid":
      case "inversor_hibrido":
        return <Zap className="h-4 w-4" />;
      case "bateria_bess":
        return <Battery className="h-4 w-4" />;
      default:
        return <Wind className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      modulo_fotovoltaico: "Módulo Fotovoltaico",
      inversor_on_grid: "Inversor On-Grid",
      inversor_hibrido: "Inversor Híbrido",
      bateria_bess: "Bateria",
      controlador_carga_mppt: "Controlador MPPT",
    };
    return labels[categoria] || categoria;
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(currentMessage),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("módulo") || lowerMessage.includes("painel")) {
      return "Para módulos fotovoltaicos, recomendo considerar a eficiência, potência e garantia. Temos opções da BYD, Canadian Solar e JinkoSolar com certificação INMETRO. Qual potência você precisa para seu projeto?";
    }

    if (lowerMessage.includes("inversor")) {
      return "Para inversores, o tipo depende se é on-grid ou híbrido. Temos opções da Growatt, Deye e Enphase. Qual a potência do seu sistema e se precisa de bateria?";
    }

    if (lowerMessage.includes("bateria")) {
      return "Para sistemas de bateria, recomendamos tecnologias LiFePO4 pela segurança e durabilidade. Temos opções da BYD e Pylontech com garantia de 10 anos.";
    }

    return "Posso ajudar você a encontrar equipamentos solares certificados. Me diga mais sobre seu projeto: tipo de instalação, potência necessária, localização, etc.";
  };

  const uniqueCategories = [...new Set(equipamentos.map((e) => e.categoria))];
  const uniqueFabricantes = [...new Set(equipamentos.map((e) => e.fabricante))];

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
          One Stop Solar Shop - Equipamentos certificados para sua instalação
          fotovoltaica
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
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fabricante</label>
              <Select
                value={selectedFabricante}
                onValueChange={setSelectedFabricante}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os fabricantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fabricantes</SelectItem>
                  {uniqueFabricantes.map((fabricante) => (
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
                      <p>
                        Potência AC: {equip.datasheet.potencia_nominal_ac_kw}kW
                      </p>
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
          <Card className="w-full max-w-2xl h-3/4 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Assistente Solar IA
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <Bot className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce animation-delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua pergunta sobre energia solar..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
