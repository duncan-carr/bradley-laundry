import Link from "next/link";
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
        <div className="flex items-center gap-4 px-6 py-4 text-amber-600 dark:text-amber-500">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600 opacity-75 dark:bg-amber-400"></span>
            <span className="relative inline-flex size-2 rounded-full bg-amber-600 dark:bg-amber-500"></span>
          </span>
          <p>
            Data for the usage charts has been reset as usage will change
            throughout the summer.
          </p>
        </div>
        {children}
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
