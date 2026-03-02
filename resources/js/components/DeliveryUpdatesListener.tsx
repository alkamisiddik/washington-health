import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEcho, useEchoNotification } from '@laravel/echo-react';

/**
 * Listens for delivery.updated WebSocket events and Private notifications
 * so admin/officer/driver panels see real-time delivery changes and notifications.
 */
export default function DeliveryUpdatesListener() {
    const { props } = usePage<SharedData>();
    const userId = props.auth?.user?.id;

    // Listen for public delivery updates
    useEcho('deliveries', 'delivery.updated', () => {
        router.reload({ only: [], preserveUrl: true });
    }, [], 'public');

    // Listen for private notifications
    useEchoNotification(userId ? `App.Models.User.${userId}` : '', () => {
        // Reload page to get new notification data & update count in header
        router.reload({
            only: ['auth'],
            preserveUrl: true
        });
    }, [], [userId]);

    return null;
}
