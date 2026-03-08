import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/shared/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { ModeToggle } from "@/shared/components/mode-toggle";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex flex-col h-svh">
        {/* Header (non-scrollable) */}
        <header className="sticky top-0 z-40 flex h-11 items-center justify-between px-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <ModeToggle />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pt-2 scrollbar-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
