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
      url: "#",
      items: [
        {
          title: "Floor 2",
          url: "#",
        },
        {
          title: "Floor 4",
          url: "#",
        },
        {
          title: "Floor 6",
          url: "#",
        },
        {
          title: "Floor 8",
          url: "#",
        },
        {
          title: "Floor 10",
          url: "#",
        },
      ],
    },
    {
      title: "Harper Hall",
      url: "#",
    },
    {
      title: "Heitz Hall",
      url: "#",
      items: [
        {
          title: "Floor 1B",
          url: "#",
        },
        {
          title: "Floor 3B",
          url: "#",
        },
      ],
    },
    {
      title: "University Hall",
      url: "#",
    },
    {
      title: "Williams Hall",
      url: "#",
      items: [
        {
          title: "Floor 1",
          url: "#",
        },
        {
          title: "Floor 2",
          url: "#",
        },
        {
          title: "Floor 3",
          url: "#",
        },
        {
          title: "Floor 4",
          url: "#",
        },
        {
          title: "Floor 5",
          url: "#",
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
