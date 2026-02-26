"use client";

import { Building2, GitBranch, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { campus } from "~/lib/new-util";

const standaloneBuildings = campus
  .getAllBuildings()
  .filter((b) => !b.isPartOfComplex(campus))
  .map((b) => ({
    title: b.displayName,
    url: `/dorms/${b.id}`,
  }));

const parentBuildings = campus.getAllParentBuildings().map((parent) => ({
  title: parent.displayName,
  children: parent.getSubBuildings(campus).map((b) => ({
    title: b.displayName,
    url: `/dorms/${b.id}`,
  })),
}));

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/" className="text-[13px] font-medium">
                    <Home className="size-3.5" />
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Residence Halls
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {standaloneBuildings.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url} className="text-[13px] font-medium">
                      <Building2 className="size-3.5" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {parentBuildings.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.children.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url} className="text-[13px] font-medium">
                        <Building2 className="size-3.5" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild isActive={pathname === "/changelog"}>
          <Link className="text-[13px] text-muted-foreground" href="/changelog">
            <GitBranch className="size-3.5" />
            Changelog
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
