import { useState } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/core/config/routes";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import shaheenLogo from "@/assets/profile_avatar.jpg";

interface ProfileMenuProps {
  variant?: "icon" | "full";
}

export function ProfileMenu({ variant = "icon" }: ProfileMenuProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const userRole = role ? role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ') : "User";

  return (
    <Popover>
      <PopoverTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={shaheenLogo} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-sidebar-accent">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={shaheenLogo} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </div>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={shaheenLogo} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">
              {userEmail} <span className="text-blue-500">({userRole})</span>
            </p>
          </div>
        </div>

        <Separator className="my-3" />

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogoutClick}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </PopoverContent>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </Popover>
  );
}
