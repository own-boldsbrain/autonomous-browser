"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bot, User, Zap, Sun, Battery, Settings, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou o assistente especializado da Yello Solar Hub. Como posso ajudar você hoje com seu projeto de energia solar?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Simular resposta da IA (integrar com API real depois)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(currentInput),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("painel") || lowerMessage.includes("módulo")) {
      return "Para painéis solares, recomendamos módulos com eficiência acima de 20% e garantia de 25 anos. Temos opções da BYD, Canadian Solar e JinkoSolar. Que potência você precisa?";
    }

    if (lowerMessage.includes("inversor")) {
      return "Temos inversores on-grid e híbridos certificados INMETRO. Os híbridos são ideais para sistemas com bateria. Qual a potência do seu sistema?";
    }

    if (lowerMessage.includes("bateria")) {
      return "Oferecemos baterias LFP (Lithium Ferro Fosfato) com 10 anos de garantia. Capacidades de 5kWh a 15kWh. Compatíveis com inversores híbridos.";
    }

    if (
      lowerMessage.includes("homologação") ||
      lowerMessage.includes("prodist")
    ) {
      return "Cuidamos de toda a homologação PRODIST e Portaria 140/2022. Incluímos laudos técnicos, ART e documentação completa no projeto.";
    }

    return "Entendi sua pergunta sobre energia solar. Posso ajudar com dimensionamento, seleção de equipamentos, homologação ou qualquer aspecto do seu projeto fotovoltaico. O que você gostaria de saber?";
  };

  const quickActions = [
    {
      label: "Dimensionar Sistema",
      icon: <Zap className="h-4 w-4" />,
      message: "Preciso dimensionar um sistema fotovoltaico",
    },
    {
      label: "Comparar Painéis",
      icon: <Sun className="h-4 w-4" />,
      message: "Quais painéis solares vocês recomendam?",
    },
    {
      label: "Sistema com Bateria",
      icon: <Battery className="h-4 w-4" />,
      message: "Quero um sistema com bateria",
    },
    {
      label: "Homologação",
      icon: <Settings className="h-4 w-4" />,
      message: "Como funciona a homologação?",
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Assistente Solar IA
        </h1>
        <p className="text-muted-foreground">
          Tire suas dúvidas sobre energia solar e receba recomendações
          personalizadas
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  setInputValue(action.message);
                  handleSendMessage();
                }}
                disabled={isLoading}
              >
                {action.icon}
                <span className="text-sm text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[70%] ${message.role === "user" ? "order-first" : ""}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className="text-xs text-muted-foreground mt-1"
                    suppressHydrationWarning
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Digite sua pergunta sobre energia solar..."
              disabled={isLoading}
              className="flex-1"
              suppressHydrationWarning
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              💡 Dicas: dimensionamento, equipamentos, homologação
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-semibold">Consultoria Técnica</h3>
            <p className="text-sm text-muted-foreground">
              Análise completa do seu consumo e dimensionamento ideal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Battery className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Equipamentos Premium</h3>
            <p className="text-sm text-muted-foreground">
              Produtos certificados com garantia e suporte técnico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Homologação Completa</h3>
            <p className="text-sm text-muted-foreground">
              Cuidamos de toda documentação PRODIST e ANEEL
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
