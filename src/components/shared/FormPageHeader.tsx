import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormPageHeaderProps {
  title: string;
  description: string;
  backPath: string;
}

export function FormPageHeader({ title, description, backPath }: FormPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
