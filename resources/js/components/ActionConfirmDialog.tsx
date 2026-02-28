import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface ActionConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

export function ActionConfirmDialog({
    open,
    title,
    description,
    onCancel,
    onConfirm,
    isLoading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
}: ActionConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={
                            variant === 'destructive'
                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
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
