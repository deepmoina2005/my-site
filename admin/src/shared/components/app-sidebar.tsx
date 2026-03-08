"use client"

import * as React from "react"
import { SquareTerminal, BookOpen, FileText, Folder, FileArchive, User, Plus, List, Home, Settings2, Toolbox, Briefcase, GraduationCap, Award, Layers } from "lucide-react"

import { NavMain } from "@/shared/components/nav-main"
import { NavUser } from "@/shared/components/nav-user"
import { TeamSwitcher } from "@/shared/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar"

// Sidebar navigation data
const data = {
  user: {
    name: "Deepmoina Boruah",
    email: "deepmoinaboruah7@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Personal Hub",
      logo: SquareTerminal,
      plan: "My Personal Website",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: false,
    },
    {
      title: "Projects",
      icon: Folder,
      isActive: false,
      items: [
        { title: "Add Project", url: "/projects/add", icon: Plus },
        { title: "All Projects", url: "/projects/all", icon: List },
      ],
    },
    {
      title: "Blogs",
      icon: FileText,
      isActive: false,
      items: [
        { title: "Add Blog", url: "/blog/add", icon: Plus },
        { title: "All Blogs", url: "/blog/all", icon: List },
      ],
    },
    {
      title: "Notes",
      icon: FileArchive,
      isActive: false,
      items: [
        { title: "Add Note", url: "/notes/add", icon: Plus },
        { title: "All Notes", url: "/notes/all", icon: List },
      ],
    },
    {
      title: "Books",
      icon: BookOpen,
      isActive: false,
      items: [
        { title: "Add Book", url: "/books/add", icon: Plus },
        { title: "All Books", url: "/books/all", icon: List },
      ],
    },
    {
      title: "Products",
      icon: SquareTerminal,
      isActive: false,
      items: [
        { title: "Add Product", url: "/products/add", icon: Plus },
        { title: "All Products", url: "/products/all", icon: List },
      ],
    },
    {
      title: "Skills",
      icon: Toolbox,
      isActive: false,
      items: [
        { title: "Add Skill", url: "/skills/add", icon: Plus },
        { title: "All Skills", url: "/skills/all", icon: List },
      ],
    },
    {
      title: "Experience",
      icon: Briefcase,
      isActive: false,
      items: [
        { title: "Add Experience", url: "/experience/add", icon: Plus },
        { title: "All Experience", url: "/experience/all", icon: List },
      ],
    },
    {
      title: "Education",
      icon: GraduationCap,
      isActive: false,
      items: [
        { title: "Add Education", url: "/education/add", icon: Plus },
        { title: "All Education", url: "/education/all", icon: List },
      ],
    },
    {
      title: "Certificates",
      icon: Award,
      isActive: false,
      items: [
        { title: "Add Certificate", url: "/certificates/add", icon: Plus },
        { title: "All Certificates", url: "/certificates/all", icon: List },
      ],
    },
    {
      title: "Services",
      icon: Layers,
      isActive: false,
      items: [
        { title: "Add Service", url: "/services/add", icon: Plus },
        { title: "All Services", url: "/services/all", icon: List },
      ],
    },
    {
      title: "Categories",
      url: "/categories/all",
      icon: List,
      isActive: false,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: User,
      isActive: false,
    },
    {
      title: "Settings",
      icon: Settings2,
      isActive: false,
      url: "/settings",
    },
  ]

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with Team Switcher */}
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      {/* Sidebar content with main nav and submenus */}
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            Icon: item.icon,
            // Ensure submenus are properly passed as `items` with icons
            items: item.items?.map((sub) => ({
              ...sub,
              Icon: sub.icon,
            })),
          }))}
        />
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      {/* Optional collapsed rail */}
      <SidebarRail />
    </Sidebar>
  )
}
