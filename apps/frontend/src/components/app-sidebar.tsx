"use client"

import * as React from "react"
import {
  Bot,
  ShoppingCart,
  MessageSquare,
  Sun,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Yello Solar Hub",
    email: "contato@yellosolarhub.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Yello Solar Hub",
      logo: Sun,
      plan: "One Stop Solar Shop",
    },
  ],
  navMain: [
    {
      title: "Navegação",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Marketplace",
          url: "/marketplace",
        },
        {
          title: "Chat IA",
          url: "/chat",
        },
      ],
    },
    {
      title: "Homologação",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Criar UC",
          url: "#",
        },
        {
          title: "Validar Endereço",
          url: "#",
        },
        {
          title: "Analisar Consumo",
          url: "#",
        },
        {
          title: "Gerar PRODIST",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Equipamentos Solares",
      url: "/marketplace",
      icon: ShoppingCart,
    },
    {
      name: "Consultoria IA",
      url: "/chat",
      icon: MessageSquare,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
