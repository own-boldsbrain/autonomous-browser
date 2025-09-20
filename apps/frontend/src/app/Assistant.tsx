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
    <div className="p-4 flex flex-col space-y-2 h-screen overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant={level === 0 ? "default" : "outline"}
            onClick={() => {
              setTodos([]);
              setLevel(0);
            }}
          >
            <Zap className="h-4 w-4 mr-2" /> Level 0 - automated
          </Button>
          <Button
            size="sm"
            variant={level === 1 ? "default" : "outline"}
            onClick={() => {
              setTodos([]);
              setLevel(1);
            }}
          >
            <Bot className="h-4 w-4 mr-2" /> Level 1 - agentic
          </Button>
          <Button
            size="sm"
            variant={level === 2 ? "default" : "outline"}
            onClick={() => setLevel(2)}
          >
            <Brain className="h-4 w-4 mr-2" /> Level 2 - autonomous
          </Button>
          <Button
            size="sm"
            variant={level === 3 ? "default" : "outline"}
            onClick={() => setLevel(3)}
          >
            <Cpu className="h-4 w-4 mr-2" /> Level 3 - general
          </Button>
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
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Homologação Digital YSH 360°</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={async () => {
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
            }
          }}>Criar UC</Button>
          <Button onClick={async () => {
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
            }
          }}>Validar Endereço</Button>
          <Button disabled={!ucId} onClick={async () => {
            if (!ucId) return;
            try {
              const result = await analyzeConsumption(ucId);
              setHomologationResults(prev => [...prev, { action: "Analisar Consumo", result }]);
            } catch (error) {
              console.error(error);
            }
          }}>Analisar Consumo</Button>
          <Button disabled={!ucId} onClick={async () => {
            if (!ucId) return;
            try {
              const result = await generateProdistForm(ucId);
              setHomologationResults(prev => [...prev, { action: "Gerar PRODIST", result }]);
            } catch (error) {
              console.error(error);
            }
          }}>Gerar PRODIST</Button>
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
