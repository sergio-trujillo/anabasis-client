// AppLayout — visual shell adapted from Praxema's praxema-client/src/components/layout/AppLayout.tsx.
//
// Same SidebarProvider → Sidebar + SidebarInset(Header + main) structure.
// CommandPalette + OnboardingDialog are deferred to F2.

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
