import { cn } from "@/core/utils";

interface LoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    message?: string;
    fullScreen?: boolean;
}

export const Loader = ({ className, size = "md", message, fullScreen = false }: LoaderProps) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4",
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={cn(
                    "animate-spin rounded-full border-primary border-t-transparent",
                    sizeClasses[size],
                    className
                )}
            />
            {message && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="fixed z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    padding: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    maxHeight: '100vh'
                }}
            >
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};
