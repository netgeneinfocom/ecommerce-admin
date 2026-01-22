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
import { LogOut, Loader2 } from "lucide-react";

interface LogoutConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function LogoutConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: LogoutConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 text-destructive animate-spin" />
                            ) : (
                                <LogOut className="h-5 w-5 text-destructive" />
                            )}
                        </div>
                        <AlertDialogTitle>
                            {isLoading ? "Logging Out..." : "Confirm Logout"}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-2">
                        {isLoading
                            ? "Please wait while we log you out..."
                            : "Are you sure you want to logout? You will be redirected to the login page."
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
                                Logging out...
                            </>
                        ) : (
                            "Logout"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
