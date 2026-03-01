import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, Package, RefreshCw, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        type: string;
        action_url: string;
        delivery_id: number;
    };
    read_at: string | null;
    created_at: string;
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'delivery_assigned':
            return <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        case 'status_updated':
            return <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
        default:
            return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
}

interface NotificationDropdownProps {
    children?: React.ReactNode;
}

export default function NotificationDropdown({ children }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get('/notifications');
            const list = response.data;
            setNotifications(list);
            setUnreadCount(list.filter((n: Notification) => !n.read_at).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    useEffect(() => {
        if (dropdownOpen) fetchNotifications();
    }, [dropdownOpen, fetchNotifications]);

    const markAsRead = (id: string) => {
        router.post(`/notifications/${id}/mark-read`, {}, {
            preserveScroll: true,
            onSuccess: () => fetchNotifications()
        });
    };

    const markAllAsRead = () => {
        router.post('/notifications/mark-read', {}, {
            preserveScroll: true,
            onSuccess: () => fetchNotifications()
        });
    };

    const clearAll = () => {
        setClearConfirmOpen(false);
        router.delete('/notifications/clear', {
            preserveScroll: true,
            onSuccess: () => fetchNotifications()
        });
    };

    const goToDetails = (n: Notification) => {
        if (!n.data?.action_url) return;
        if (!n.read_at) markAsRead(n.id);
        router.visit(n.data.action_url, { preserveScroll: true });
    };

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={(open) => { setDropdownOpen(open); }}>
                <DropdownMenuTrigger asChild>
                    {children ? children : (
                        <button
                            type="button"
                            className="relative flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white ring-2 ring-white dark:ring-gray-800">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                            <span className="hidden md:inline">Notifications</span>
                        </button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[400px] p-0 rounded-xl shadow-lg border" sideOffset={8}>
                    <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3 rounded-t-xl">
                        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={markAllAsRead}
                                >
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                    Mark all read
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={() => setClearConfirmOpen(true)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                    <ScrollArea className="h-[320px]">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <Bell className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-muted-foreground">No notifications yet</p>
                                <p className="mt-1 text-xs text-muted-foreground">You’ll see updates here when they arrive.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`px-4 py-3 transition-colors hover:bg-muted/50 ${!n.read_at ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex justify-between gap-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                {n.data.title}
                                            </span>
                                            <span className="shrink-0 text-[11px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-foreground">{n.data.message}</p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => goToDetails(n)}
                                                    className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                                                >
                                                    View details
                                                    <ChevronRight className="ml-1 h-3 w-3" />
                                                </button>
                                            {!n.read_at && (
                                                <button
                                                    type="button"
                                                    onClick={() => markAsRead(n.id)}
                                                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    aria-label="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            <ActionConfirmDialog
                open={clearConfirmOpen}
                onCancel={() => setClearConfirmOpen(false)}
                onConfirm={clearAll}
                title="Clear all notifications?"
                description="This will remove all notifications. This action cannot be undone."
                confirmText="Clear all"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}
