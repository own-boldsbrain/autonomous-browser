"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  SquareTerminal,
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
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Autonomous Browser",
      logo: Bot,
      plan: "AI Assistant",
    },
  ],
  navMain: [
    {
      title: "Levels",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Level 0 - Automated",
          url: "#",
        },
        {
          title: "Level 1 - Agentic",
          url: "#",
        },
        {
          title: "Level 2 - Autonomous",
          url: "#",
        },
        {
          title: "Level 3 - General",
          url: "#",
        },
      ],
    },
    {
      title: "Features",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Todos",
          url: "#",
        },
        {
          title: "Chat",
          url: "#",
        },
        {
          title: "Feedback",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "HN Content",
      url: "#",
      icon: BookOpen,
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
