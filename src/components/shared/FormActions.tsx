import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormActionsProps {
  cancelPath: string;
  submitLabel: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export function FormActions({ cancelPath, submitLabel, isSubmitting = false, disabled = false, disabledTooltip }: FormActionsProps) {
  const navigate = useNavigate();

  const buttonContent = (
    <Button type="submit" disabled={isSubmitting || disabled}>
      {submitLabel}
    </Button>
  );

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate(cancelPath)} disabled={isSubmitting}>
        Cancel
      </Button>
      {disabled && disabledTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block">
                {buttonContent}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}
    </div>
  );
}
