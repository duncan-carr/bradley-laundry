import { WashingMachine } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "~/components/app-sidebar";
import { Toolbar } from "~/components/toolbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/90 px-4 backdrop-blur-xl md:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <WashingMachine className="size-3.5" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              Bradley Laundry
            </span>
          </Link>
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </header>
        <Toolbar />
        <div className="relative">
          {children}
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
