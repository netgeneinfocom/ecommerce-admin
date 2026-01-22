import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { ROUTES } from "@/core/config/routes";

interface AuthCardProps {
  children: ReactNode;
  logo?: string;
  title?: string;
}
export const AuthCard = ({
  children,
  logo = "Able",
  title
}: AuthCardProps) => {
  const location = useLocation();
  const isLogin = location.pathname === ROUTES.LOGIN;
  return <div className="min-h-screen flex items-center justify-center p-4" style={{
    background: 'var(--gradient-auth)'
  }}>
      <Card className="w-full max-w-md p-8 shadow-xl rounded-lg min-h-[600px]">
        <div className="pt-8 mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {isLogin ? <LogIn className="w-8 h-8 text-primary" /> : <UserPlus className="w-8 h-8 text-primary" />}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isLogin ? "Login" : "Register"}
          </h1>
          
        </div>
        {children}
      </Card>
    </div>;
};