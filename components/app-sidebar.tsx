"use client";

import { Eye, Key, Laptop } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Projects",
    url: "/",
    icon: Laptop,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: Key,
  },
  {
    title: "Previews",
    url: "/previews",
    icon: Eye,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  if (pathname.startsWith("/t/")) {
    return null;
  }

  return (
    <Sidebar className="text-background isolate">
      <div className="bg-foreground absolute top-0 left-0 h-full w-[calc(100%+48px)]"></div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-background">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
