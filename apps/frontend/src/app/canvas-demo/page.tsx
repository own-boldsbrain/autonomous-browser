"use client";

import { useState } from "react";
import { 
  CanvasShell, 
  VerticalToolbar, 
  Tool, 
  ShortcutMenu, 
  InlineSuggestion, 
  InlineCommentThread,
  VersionHistoryTimeline, 
  Version 
} from "@/components/canvas";
import { GradientButton } from "@/components/ysh/gradient-button";
import { GradientBadge } from "@/components/ysh/gradient-badge";

export default function CanvasDemoPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [versions] = useState<Version[]>([
    { id: "v3", label: "V3 — Ajuste de leitura", createdAt: new Date().toISOString() },
    { id: "v2", label: "V2 — Correção de bugs", createdAt: new Date(Date.now() - 3600e3).toISOString() },
    { id: "v1", label: "V1 — Rascunho inicial", createdAt: new Date(Date.now() - 7200e3).toISOString() },
  ]);

  const [comments] = useState([
    {
      id: "1",
      author: "Alice",
      text: "Este trecho poderia ser mais claro para iniciantes.",
      createdAt: new Date(Date.now() - 1800e3).toISOString()
    },
    {
      id: "2", 
      author: "Bob",
      text: "Concordo! Talvez adicionar um exemplo prático ajude.",
      createdAt: new Date(Date.now() - 900e3).toISOString()
    }
  ]);

  const tools: Tool[] = [
    { 
      id: "suggest-edits", 
      label: "Sugerir edições", 
      icon: () => null, 
      onClick: () => setShowMenu(true) 
    },
    { 
      id: "adjust-length-shorter", 
      label: "Encurtar texto", 
      icon: () => null, 
      onClick: () => setActiveAction("shorten") 
    },
    { 
      id: "adjust-length-longer", 
      label: "Alongar texto", 
      icon: () => null, 
      onClick: () => setActiveAction("expand") 
    },
    { 
      id: "reading-level", 
      label: "Alterar nível de leitura", 
      icon: () => null, 
      onClick: () => setActiveAction("reading-level") 
    },
    { 
      id: "review-code", 
      label: "Revisar código", 
      icon: () => null, 
      onClick: () => setActiveAction("review-code") 
    },
    {
      id: "final-polish",
      label: "Ajustes finais",
      icon: () => null,
      onClick: () => setActiveAction("polish")
    }
  ];

  const handleAction = (id: string) => {
    setShowMenu(false);
    setActiveAction(id);
    // Simular processamento
    setTimeout(() => setActiveAction(null), 2000);
  };

  const handleRestore = (versionId: string) => {
    alert(`Restaurando versão: ${versionId}`);
    // Aqui implementaria a lógica de restauração
  };

  const handleCommentReply = (text: string) => {
    console.log("Nova resposta:", text);
    // Implementar lógica de adição de comentário
  };

  return (
    <CanvasShell
      title="Canvas Demo - Documento Colaborativo"
      onBack={() => window.history.back()}
      onOpenVersions={() => alert("Abrir painel de versões")}
      left={<VerticalToolbar tools={tools} />}
      right={
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Histórico de Versões</h3>
            <VersionHistoryTimeline 
              versions={versions} 
              onRestore={handleRestore} 
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Comentários</h3>
            <InlineCommentThread 
              comments={comments}
              onReply={handleCommentReply}
            />
          </div>
        </div>
      }
    >
      {showMenu && (
        <ShortcutMenu 
          open={showMenu}
          onOpenChange={setShowMenu}
          onAction={handleAction} 
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header da demo */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold ysh-text-gradient">
              Canvas Kit Demo
            </h1>
            <GradientBadge>Next.js 15</GradientBadge>
            <GradientBadge>Radix UI</GradientBadge>
            <GradientBadge>Framer Motion</GradientBadge>
          </div>
          <p className="text-lg text-[var(--geist-fg-muted)]">
            Explore as funcionalidades do Canvas: edição colaborativa, 
            atalhos de escrita/código e controle de versões.
          </p>
        </header>

        {/* Status da ação atual */}
        {activeAction && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
            <p className="text-sm font-medium">
              Ação ativa: <span className="ysh-text-gradient">{activeAction}</span>
            </p>
            <p className="text-xs opacity-70 mt-1">
              Processando... (Esta é uma simulação)
            </p>
          </div>
        )}

        {/* Conteúdo editável */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2>Documento de Exemplo</h2>
          <p>
            Este é um documento colaborativo onde você pode testar 
            as funcionalidades do Canvas. Selecione texto ou use a 
            toolbar lateral para acionar edições direcionadas.
          </p>

          <InlineSuggestion
            text="Este parágrafo tem alguns problemas de clareza e precisa ser melhorado."
            suggestion="Este parágrafo foi otimizado para maior clareza e compreensão, seguindo melhores práticas de redação técnica."
            onAccept={() => alert("Sugestão aceita!")}
            onReject={() => alert("Sugestão rejeitada!")}
          />

          <h3>Funcionalidades Disponíveis</h3>
          <ul>
            <li><strong>Sugerir edições:</strong> Melhorias automáticas no texto</li>
            <li><strong>Ajustar comprimento:</strong> Encurtar ou alongar conteúdo</li>
            <li><strong>Nível de leitura:</strong> Adaptar para diferentes audiências</li>
            <li><strong>Revisar código:</strong> Análise e otimização de código</li>
            <li><strong>Controle de versões:</strong> Voltar/restaurar versões anteriores</li>
            <li><strong>Comentários:</strong> Colaboração em tempo real</li>
          </ul>

          <h3>Código de Exemplo</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{`// Exemplo de código para revisão
function processarDados(dados) {
  // TODO: Adicionar validação
  return dados.map(item => {
    return {
      id: item.id,
      nome: item.name,
      processado: true
    };
  });
}`}</code>
          </pre>

          <h3>Instruções de Uso</h3>
          <ol>
            <li>Use a <strong>toolbar vertical</strong> à esquerda para acessar ferramentas</li>
            <li>Pressione <kbd>Cmd/Ctrl + K</kbd> para abrir o menu de atalhos</li>
            <li>Visualize o <strong>histórico de versões</strong> no painel direito</li>
            <li>Adicione <strong>comentários</strong> para colaboração</li>
            <li>Use o botão <strong>&quot;Voltar&quot;</strong> para restaurar versões</li>
          </ol>
        </div>

        {/* Footer com ações */}
        <footer className="flex justify-center gap-4 pt-8 border-t">
          <GradientButton onClick={() => setShowMenu(true)}>
            Abrir Menu de Atalhos
          </GradientButton>
          <GradientButton 
            onClick={() => handleRestore("v1")}
            className="bg-neutral-100 hover:bg-neutral-200"
          >
            Restaurar V1
          </GradientButton>
        </footer>
      </div>
    </CanvasShell>
  );
}