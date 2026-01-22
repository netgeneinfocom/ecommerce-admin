import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { ProviderButtons } from "@/features/auth/components/ProviderButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/features/auth/hooks";
import { ROUTES } from "@/core/config/routes";
import { Loader } from "@/components/loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD.HOME;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD.HOME;
      navigate(from, { replace: true });
    }
  };


  return <AuthCard logo="Able" title="PRO">
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs text-muted-foreground">
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="info@phoenixcoded.co" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs text-muted-foreground">
          Password
        </Label>
        <PasswordInput id="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>

    <p className="text-center text-sm text-muted-foreground mt-4">
      Login using the credentials
    </p>
    {isLoading && <Loader fullScreen message="Logging in..." size="lg" />}
  </AuthCard>;
};
export default Login;