import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 33, label: "Poor", color: "bg-destructive" };
    if (score <= 3) return { level: 66, label: "Fair", color: "bg-yellow-500" };
    return { level: 100, label: "Strong", color: "bg-green-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.level}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{strength.label}</p>
    </div>
  );
};
