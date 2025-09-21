"use client";

import { GradientButton } from "@/components/ysh/gradient-button";
import { GradientCard } from "@/components/ysh/gradient-card";
import { GradientBadge } from "@/components/ysh/gradient-badge";
import { GradientIcon } from "@/components/ysh/gradient-icon";
import { Rocket, Zap, Sun, Battery, Cpu, Sparkles } from "lucide-react";

export default function YSHDemoPage() {
  return (
    <main className="min-h-screen bg-[var(--geist-bg)] text-[var(--geist-fg)] p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold ysh-text-gradient">
            Yello Solar Hub
          </h1>
          <p className="text-lg text-[var(--geist-fg-muted)] max-w-2xl mx-auto">
            Kit de componentes com design system Geist + gradientes YSH.
            Explore os componentes interativos abaixo.
          </p>
        </header>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Buttons Demo */}
          <GradientCard title="Botões Gradiente">
            <div className="space-y-4">
              <p className="text-sm text-[var(--geist-fg-subtle)]">
                Botões com borda gradiente YSH e animações Framer Motion.
              </p>
              <div className="flex flex-wrap gap-3">
                <GradientButton>
                  Padrão
                </GradientButton>
                <GradientButton glow>
                  Com Glow
                </GradientButton>
                <GradientButton className="px-6">
                  Customizado
                </GradientButton>
              </div>
            </div>
          </GradientCard>

          {/* Icons Demo */}
          <GradientCard title="Ícones Gradiente">
            <div className="space-y-4">
              <p className="text-sm text-[var(--geist-fg-subtle)]">
                Ícones Lucide com gradiente YSH aplicado.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <GradientIcon Icon={Rocket} size={32} />
                <GradientIcon Icon={Zap} size={28} />
                <GradientIcon Icon={Sun} size={36} />
                <GradientIcon Icon={Battery} size={30} />
                <GradientIcon Icon={Cpu} size={32} />
                <GradientIcon Icon={Sparkles} size={28} />
              </div>
            </div>
          </GradientCard>

          {/* Badges Demo */}
          <GradientCard title="Badges & Pills">
            <div className="space-y-4">
              <p className="text-sm text-[var(--geist-fg-subtle)]">
                Badges com fundo Geist e contorno gradiente YSH.
              </p>
              <div className="flex flex-wrap gap-2">
                <GradientBadge>Beta</GradientBadge>
                <GradientBadge>Novo</GradientBadge>
                <GradientBadge>Em Alta</GradientBadge>
                <GradientBadge>Solar Tech</GradientBadge>
                <GradientBadge>Premium</GradientBadge>
              </div>
            </div>
          </GradientCard>

          {/* Typography Demo */}
          <GradientCard title="Tipografia Geist">
            <div className="space-y-4">
              <p className="text-sm text-[var(--geist-fg-subtle)]">
                Fontes Geist Sans e Mono com hierarquia visual.
              </p>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold ysh-text-gradient">
                  Título Gradiente
                </h3>
                <p className="text-[var(--geist-fg)]">
                  Texto padrão com Geist Sans.
                </p>
                <code className="font-mono text-sm bg-[var(--geist-bg-soft)] px-2 py-1 rounded">
                  GeistMono(&quot;code-example&quot;)
                </code>
              </div>
            </div>
          </GradientCard>

        </div>

        {/* Full Width Demo */}
        <div className="space-y-6">
          <GradientCard title="Painel Completo" className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              
              <div className="space-y-3">
                <h4 className="font-medium text-[var(--geist-fg)]">Sistema de Cores</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="w-8 h-8 rounded bg-ysh-pink shadow-geist-sm"></div>
                  <div className="w-8 h-8 rounded bg-ysh-orange shadow-geist-sm"></div>
                  <div className="w-8 h-8 rounded bg-ysh-amber shadow-geist-sm"></div>
                  <div className="w-8 h-8 rounded bg-ysh-gold shadow-geist-sm"></div>
                  <div className="w-8 h-8 rounded bg-ysh-cream shadow-geist-sm"></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[var(--geist-fg)]">Gradientes</h4>
                <div className="space-y-2">
                  <div className="w-full h-6 rounded bg-ysh-linear shadow-geist-sm"></div>
                  <div className="w-full h-6 rounded bg-ysh-radial shadow-geist-sm"></div>
                  <div className="w-full h-6 rounded bg-ysh-conic shadow-geist-sm"></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[var(--geist-fg)]">Interações</h4>
                <div className="space-y-2">
                  <GradientButton className="w-full ysh-outline">
                    Hover Effect
                  </GradientButton>
                  <div className="text-center">
                    <GradientIcon Icon={Sparkles} size={24} />
                    <span className="ml-2 text-sm ysh-text-gradient font-medium">
                      Animado
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </GradientCard>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-[var(--geist-border)]">
          <p className="text-sm text-[var(--geist-fg-subtle)]">
            Design System • Geist + YSH • Next.js 15 + Tailwind + shadcn/ui
          </p>
        </footer>

      </div>
    </main>
  );
}