import { Assistant } from "./Assistant";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageSquare, Sun, Zap, Battery, Settings } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Yello Solar Hub</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Welcome Section */}
        <section
          className="text-center space-y-4 py-8"
          aria-labelledby="welcome-heading"
        >
          <h1
            id="welcome-heading"
            className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
          >
            Yello Solar Hub 360°
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One Stop Solar Shop - Marketplace completo de equipamentos solares
            certificados com assistente IA para consultoria técnica e
            homologação PRODIST
          </p>
        </section>

        {/* Quick Access Cards */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          aria-labelledby="quick-access-heading"
        >
          <h2 id="quick-access-heading" className="sr-only">
            Acesso Rápido aos Serviços
          </h2>
          <Card className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart
                  className="h-5 w-5 text-blue-500"
                  aria-hidden="true"
                />
                Marketplace
              </CardTitle>
              <CardDescription>
                Explore nosso catálogo completo de equipamentos solares
                certificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/marketplace"
                aria-label="Acessar marketplace de equipamentos solares"
              >
                <Button className="w-full" aria-describedby="marketplace-desc">
                  Explorar Equipamentos
                </Button>
              </Link>
              <div id="marketplace-desc" className="sr-only">
                Navegue pelo catálogo completo de equipamentos solares
                certificados INMETRO
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare
                  className="h-5 w-5 text-green-500"
                  aria-hidden="true"
                />
                Assistente IA
              </CardTitle>
              <CardDescription>
                Consultoria técnica especializada em energia solar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/chat"
                aria-label="Conversar com assistente de IA especializado em energia solar"
              >
                <Button
                  className="w-full"
                  variant="outline"
                  aria-describedby="ai-desc"
                >
                  Conversar com IA
                </Button>
              </Link>
              <div id="ai-desc" className="sr-only">
                Obtenha consultoria técnica especializada em energia solar com
                assistente IA
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings
                  className="h-5 w-5 text-purple-500"
                  aria-hidden="true"
                />
                Homologação
              </CardTitle>
              <CardDescription>
                Sistema completo de homologação PRODIST e Portaria 140
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
                disabled
                aria-describedby="homologacao-desc"
              >
                Em Desenvolvimento
              </Button>
              <div id="homologacao-desc" className="sr-only">
                Sistema de homologação PRODIST e Portaria 140 - atualmente em
                desenvolvimento
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Recursos e Serviços
          </h2>
          <Card>
            <CardContent className="p-6 text-center">
              <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="font-semibold mb-2">Equipamentos Premium</h3>
              <p className="text-sm text-muted-foreground">
                Módulos, inversores e baterias certificados INMETRO
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">Consultoria Técnica</h3>
              <p className="text-sm text-muted-foreground">
                Dimensionamento e projeto personalizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Battery className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Sistemas Completos</h3>
              <p className="text-sm text-muted-foreground">
                Soluções on-grid, off-grid e híbridas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Homologação 360°</h3>
              <p className="text-sm text-muted-foreground">
                PRODIST, ANEEL e documentação completa
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Assistant Section */}
        <Assistant />
      </div>
    </>
  );
}
