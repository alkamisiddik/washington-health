import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEchoNotification, useEchoPublic } from '@laravel/echo-react';

/**
 * Listens for delivery.updated / delivery.deleted on public channel and for
 * private user notifications so all panels stay in sync and notification count/list update in real time.
 */
export default function DeliveryUpdatesListener() {
    const { props } = usePage<SharedData>();
    const userId = props.auth?.user?.id;

    // Public channel: any delivery update → reload current page so data is fresh (leading dot = no namespace duplicate)
    useEchoPublic('deliveries', '.delivery.updated', () => {
        router.reload({ only: [], preserveUrl: true });
    }, []);

    // Public channel: delivery deleted → reload so lists remove it
    useEchoPublic('deliveries', '.delivery.deleted', () => {
        router.reload({ only: [], preserveUrl: true });
    }, []);

    // Private channel: new notification → refresh auth (unread count) and notify dropdown to refetch list
    useEchoNotification(userId ? `App.Models.User.${userId}` : '', () => {
        router.reload({ only: ['auth'], preserveUrl: true });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('notification-received'));
        }
    }, [], [userId]);

    return null;
}
