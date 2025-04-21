import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Geisert Hall",
      url: "/dorms/geisert",
      items: [
        {
          title: "Floor 2",
          url: "/dorms/geisert/floor-2",
        },
        {
          title: "Floor 4",
          url: "/dorms/geisert/floor-4",
        },
        {
          title: "Floor 6",
          url: "/dorms/geisert/floor-6",
        },
        {
          title: "Floor 8",
          url: "/dorms/geisert/floor-8",
        },
        {
          title: "Floor 10",
          url: "/dorms/geisert/floor-10",
        },
      ],
    },
    {
      title: "Harper Hall",
      url: "/dorms/harper",
    },
    {
      title: "Heitz Hall",
      url: "/dorms/heitz",
      items: [
        {
          title: "Floor 1B",
          url: "/dorms/heitz/floor-1b",
        },
        {
          title: "Floor 3B",
          url: "/dorms/heitz/floor-3b",
        },
      ],
    },
    {
      title: "University Hall",
      url: "/dorms/university",
    },
    {
      title: "Williams Hall",
      url: "/dorms/williams",
      items: [
        {
          title: "Floor 1",
          url: "/dorms/williams/floor-1",
        },
        {
          title: "Floor 2",
          url: "/dorms/williams/floor-2",
        },
        {
          title: "Floor 3",
          url: "/dorms/williams/floor-3",
        },
        {
          title: "Floor 4",
          url: "/dorms/williams/floor-4",
        },
        {
          title: "Floor 5",
          url: "/dorms/williams/floor-5",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={false}>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
