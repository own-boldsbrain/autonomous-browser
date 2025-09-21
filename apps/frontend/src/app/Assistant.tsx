"use client";

import { useState, useEffect } from "react";
import { triggerWorkflow } from "@/app/actions/trigger";
import { sendEvent } from "@/app/actions/sendEvent";
import { Chat } from "../components/Chat";
import { createUnidadeConsumidora, validateAddress, analyzeConsumption, generateProdistForm } from "@/app/actions/homologation";
import { Button } from "../components/ui/button";
import { Todos } from "../components/Todos";
import { TodoType } from "../components/Todo";
import { Input } from "../components/ui/input";
import { Message } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { Zap, Bot, Brain, Cpu } from "lucide-react";

type AssistantWorkflow = {
  workflowId: string;
  runId: string;
};

type HomologationResult = { action: string; result: unknown };

export function Assistant() {
  const [assistantWorkflow, setAssistantWorkflow] =
    useState<AssistantWorkflow>();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [ucId, setUcId] = useState<string>("");
    const [homologationResults, setHomologationResults] = useState<HomologationResult[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    createUC: false,
    validateAddress: false,
    analyzeConsumption: false,
    generateProdist: false,
  });

  useEffect(() => {
    if (assistantWorkflow) {
      const { workflowId, runId } = assistantWorkflow;
      const eventSource = new EventSource(
        `http://localhost:3334/stream?workflowId=${workflowId}&runId=${runId}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "todos" && Array.isArray(data.data.todos)) {
          console.log("todos data", data);
          setTodos(data.data.todos);
        } else if (data.type === "todos" && !Array.isArray(data.data.todos)) {
          console.log("todos data", data);
          setTodos([]);
        } else if (data.name === "stream") {
          console.log("stream data", data);
          setMessages((prevMessages) => {
            const newMessages = new Map(prevMessages);
            newMessages.set(data.input.chunkId, {
              ...data,
              timestamp: event.timeStamp,
            });
            return newMessages;
          });
        }
      };

      eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [assistantWorkflow]);

  return (
    <div className="p-4 flex flex-col space-y-2 h-screen overflow-hidden" role="main" aria-label="Painel de Controle do Assistente IA">
      <div className="flex items-center justify-between gap-2" role="toolbar" aria-label="Controles de nível do assistente">
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant={level === 0 ? "default" : "outline"}
            onClick={() => {
              setTodos([]);
              setLevel(0);
            }}
            aria-pressed={level === 0}
            aria-describedby="level-0-desc"
          >
            <Zap className="h-4 w-4 mr-2" aria-hidden="true" /> Level 0 - automated
          </Button>
          <div id="level-0-desc" className="sr-only">
            Modo automatizado: executa tarefas predefinidas sem intervenção
          </div>

          <Button
            size="sm"
            variant={level === 1 ? "default" : "outline"}
            onClick={() => {
              setTodos([]);
              setLevel(1);
            }}
            aria-pressed={level === 1}
            aria-describedby="level-1-desc"
          >
            <Bot className="h-4 w-4 mr-2" aria-hidden="true" /> Level 1 - agentic
          </Button>
          <div id="level-1-desc" className="sr-only">
            Modo agentic: assistente inteligente com tomada de decisões
          </div>

          <Button
            size="sm"
            variant={level === 2 ? "default" : "outline"}
            onClick={() => setLevel(2)}
            aria-pressed={level === 2}
            aria-describedby="level-2-desc"
          >
            <Brain className="h-4 w-4 mr-2" aria-hidden="true" /> Level 2 - autonomous
          </Button>
          <div id="level-2-desc" className="sr-only">
            Modo autônomo: assistente opera independentemente
          </div>

          <Button
            size="sm"
            variant={level === 3 ? "default" : "outline"}
            onClick={() => setLevel(3)}
            aria-pressed={level === 3}
            aria-describedby="level-3-desc"
          >
            <Cpu className="h-4 w-4 mr-2" aria-hidden="true" /> Level 3 - general
          </Button>
          <div id="level-3-desc" className="sr-only">
            Modo geral: capacidades avançadas de processamento
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          {level > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsChatVisible(!isChatVisible)}
            >
              {isChatVisible ? "Hide Chat" : "Show Chat"}
            </Button>
          )}
          <Button
            size="sm"
            variant="default"
            disabled={level === 2 && !assistantWorkflow}
            onClick={async () => {
              try {
                if (level === 0) {
                  const todosResponse = await triggerWorkflow({
                    workflowName: "automatedWorkflow",
                    input: {},
                    getResult: true,
                  });
                  console.log("todosResponse", todosResponse);
                  setTodos(todosResponse.result.todos);
                }
                if (level === 1) {
                  const todosResponse = await triggerWorkflow({
                    workflowName: "assistantWorkflow",
                    input: {},
                  });
                  setAssistantWorkflow({
                    workflowId: todosResponse.workflowId,
                    runId: todosResponse.runId,
                  });
                }
                if (level === 2 && assistantWorkflow) {
                  sendEvent({
                    workflowId: assistantWorkflow.workflowId,
                    runId: assistantWorkflow.runId,
                    event: {
                      name: "schedule",
                      input: {},
                    },
                  });
                }
              } catch (error) {
                console.error("Failed to trigger workflow:", error);
              }
            }}
          >
            {level === 0 && "Get todos from HN"}
            {level === 1 && "Start HN assistant"}
            {level === 2 && "Schedule HN autonomous"}
          </Button>
        </div>
      </div>
      <div className="mt-4 p-4 border rounded-lg" role="region" aria-labelledby="homologation-heading">
        <h3 id="homologation-heading" className="text-lg font-semibold mb-2">Homologação Digital YSH 360°</h3>
        <div className="flex gap-2 flex-wrap" role="toolbar" aria-label="Ações de homologação">
          <Button
            onClick={async () => {
              setLoadingStates(prev => ({ ...prev, createUC: true }));
              try {
                const result = await createUnidadeConsumidora({
                  codigo_uc: "UC001",
                  classe: "Residencial",
                  subgrupo: "A",
                  modalidade_tarifaria: "Convencional",
                  endereco: { logradouro: "Rua A", numero: "123", cidade: "São Paulo" },
                  responsavel: { nome: "João", email: "joao@email.com" },
                  concessao: { nome: "CEMIG" },
                });
                setUcId(result.id);
                setHomologationResults(prev => [...prev, { action: "Criar UC", result }]);
              } catch (error) {
                console.error(error);
                setHomologationResults(prev => [...prev, { action: "Erro ao criar UC", result: error }]);
              } finally {
                setLoadingStates(prev => ({ ...prev, createUC: false }));
              }
            }}
            disabled={loadingStates.createUC}
            aria-describedby="create-uc-desc"
          >
            {loadingStates.createUC ? "Criando..." : "Criar UC"}
          </Button>
          <div id="create-uc-desc" className="sr-only">
            Criar nova Unidade Consumidora no sistema de homologação
          </div>

          <Button
            onClick={async () => {
              setLoadingStates(prev => ({ ...prev, validateAddress: true }));
              try {
                const result = await validateAddress({
                  logradouro: "Rua A",
                  numero: "123",
                  cidade: "São Paulo",
                  estado: "SP",
                  cep: "01234-567"
                });
                setHomologationResults(prev => [...prev, { action: "Validar Endereço", result }]);
              } catch (error) {
                console.error(error);
                setHomologationResults(prev => [...prev, { action: "Erro na validação", result: error }]);
              } finally {
                setLoadingStates(prev => ({ ...prev, validateAddress: false }));
              }
            }}
            disabled={loadingStates.validateAddress}
            aria-describedby="validate-address-desc"
          >
            {loadingStates.validateAddress ? "Validando..." : "Validar Endereço"}
          </Button>
          <div id="validate-address-desc" className="sr-only">
            Validar endereço para homologação PRODIST
          </div>

          <Button
            disabled={!ucId || loadingStates.analyzeConsumption}
            onClick={async () => {
              if (!ucId) return;
              setLoadingStates(prev => ({ ...prev, analyzeConsumption: true }));
              try {
                const result = await analyzeConsumption(ucId);
                setHomologationResults(prev => [...prev, { action: "Analisar Consumo", result }]);
              } catch (error) {
                console.error(error);
                setHomologationResults(prev => [...prev, { action: "Erro na análise", result: error }]);
              } finally {
                setLoadingStates(prev => ({ ...prev, analyzeConsumption: false }));
              }
            }}
            aria-describedby="analyze-consumption-desc"
          >
            {loadingStates.analyzeConsumption ? "Analisando..." : "Analisar Consumo"}
          </Button>
          <div id="analyze-consumption-desc" className="sr-only">
            Analisar padrão de consumo da unidade consumidora
          </div>

          <Button
            disabled={!ucId || loadingStates.generateProdist}
            onClick={async () => {
              if (!ucId) return;
              setLoadingStates(prev => ({ ...prev, generateProdist: true }));
              try {
                const result = await generateProdistForm(ucId);
                setHomologationResults(prev => [...prev, { action: "Gerar PRODIST", result }]);
              } catch (error) {
                console.error(error);
                setHomologationResults(prev => [...prev, { action: "Erro na geração", result: error }]);
              } finally {
                setLoadingStates(prev => ({ ...prev, generateProdist: false }));
              }
            }}
            aria-describedby="generate-prodist-desc"
          >
            {loadingStates.generateProdist ? "Gerando..." : "Gerar PRODIST"}
          </Button>
          <div id="generate-prodist-desc" className="sr-only">
            Gerar formulário PRODIST para homologação
          </div>
        </div>
        {homologationResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Resultados da Homologação:</h4>
            <div className="max-h-40 overflow-auto">
              {homologationResults.map((res, idx) => (
                <div key={idx} className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <strong>{res.action}:</strong> <pre className="text-xs">{JSON.stringify(res.result, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="w-full md:w-2/3 overflow-auto">
          {todos && (
            <Todos
              todos={todos}
              level={level}
              workflowId={assistantWorkflow?.workflowId}
              runId={assistantWorkflow?.runId}
            />
          )}
        </div>
        {level > 0 && isChatVisible && (
          <div className="w-full md:w-1/3 flex flex-col h-full">
            <div className="flex-grow overflow-auto">
              <Chat messages={messages} />
            </div>
            {assistantWorkflow && (
              <div className="sticky bottom-0 w-full">
                <Input
                  type="text"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={async (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (e.key === "Enter" && assistantWorkflow) {
                      try {
                        // Add the user's message to the messages state
                        setMessages((prevMessages) => {
                          const newMessages = new Map(prevMessages);
                          const userMessageId = `user-${Date.now()}`;
                          newMessages.set(userMessageId, {
                            input: { response: message },
                            role: "user",
                            timestamp: Date.now(),
                          });
                          return newMessages;
                        });

                        await sendEvent({
                          workflowId: assistantWorkflow.workflowId,
                          runId: assistantWorkflow.runId,
                          event: {
                            name: "message",
                            input: {
                              message,
                            },
                          },
                        });
                        setMessage("");
                      } catch (error) {
                        console.error("Failed to send event:", error);
                      }
                    }
                  }}
                  placeholder="Type your message and press Enter"
                  className="border p-2 mb-4"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
