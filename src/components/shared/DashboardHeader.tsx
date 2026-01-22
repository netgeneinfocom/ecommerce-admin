import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/shared/ProfileMenu";
// import { NotificationDrawer } from "@/components/shared/NotificationDrawer";

export function DashboardHeader() {
  const [] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background">
        <div className="flex items-center gap-4 px-4 md:px-6">
          <SidebarTrigger className="hover:bg-sidebar-accent" />

          <div className="relative w-full max-w-xl">
            {/* Search or other content can go here */}
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto px-4 md:px-6">
          <div className="ml-2 pl-2 border-l">
            <ProfileMenu />
          </div>
        </div>
      </header>


    </>
  );
}