import { toast } from "@/components/ui/use-toast";

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export class ApplicationError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(message: string, code?: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleError = (error: unknown): AppError => {
  console.error("Error occurred:", error);

  if (error instanceof ApplicationError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "An unexpected error occurred",
  };
};

export const showErrorToast = (error: unknown) => {
  const appError = handleError(error);
  
  toast({
    title: "Error",
    description: appError.message,
    variant: "destructive",
  });
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes("network") || 
           error.message.includes("fetch") ||
           error.message.includes("Network");
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  return handleError(error).message;
};
