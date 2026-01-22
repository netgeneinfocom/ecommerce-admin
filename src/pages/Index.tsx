import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/core/config/routes";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--gradient-auth)' }}>
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-foreground">Welcome to Able Pro</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          A modern authentication system with modular components
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link to={ROUTES.LOGIN}>
            <Button size="lg">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
