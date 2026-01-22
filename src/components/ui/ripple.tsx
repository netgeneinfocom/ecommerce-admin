import { useState, useCallback } from "react";
import { cn } from "@/core/utils";

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
}

interface RippleState {
  x: number;
  y: number;
  size: number;
  show: boolean;
}

export function Ripple({ children, className, rippleColor = "bg-primary/30" }: RippleProps) {
  const [ripples, setRipples] = useState<(RippleState & { id: number })[]>([]);

  const addRipple = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rippleContainer = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rippleContainer.width, rippleContainer.height);
      const x = event.clientX - rippleContainer.left - size / 2;
      const y = event.clientY - rippleContainer.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        show: true,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 600);
    },
    []
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={cn(
            "absolute rounded-full animate-ripple pointer-events-none",
            rippleColor
          )}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </div>
  );
}
