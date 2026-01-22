import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    title = "Confirm Delete",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 text-destructive animate-spin" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            )}
                        </div>
                        <AlertDialogTitle>
                            {isLoading ? "Deleting..." : title}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-2">
                        {isLoading
                            ? "Please wait while we delete this item..."
                            : description
                        }
                    </AlertDialogDescription>
                    {isLoading && (
                        <div className="pt-4">
                            <Progress value={undefined} className="h-2" />
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
