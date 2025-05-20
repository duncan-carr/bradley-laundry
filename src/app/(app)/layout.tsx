import Link from "next/link";
import { AnnouncementBar } from "~/components/announcement-bar";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeToggle } from "~/components/theme-toggle";
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
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Link href="/">Bradley Laundry</Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
          </div>
        </header>
        <AnnouncementBar />
        {children}
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
