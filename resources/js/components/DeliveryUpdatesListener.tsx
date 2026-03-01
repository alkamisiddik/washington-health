import { useEchoPublic } from '@laravel/echo-react';
import { router } from '@inertiajs/react';

/**
 * Listens for delivery.updated WebSocket events and reloads the current page
 * so admin/officer/driver panels see real-time delivery changes (e.g. driver started delivery).
 */
export default function DeliveryUpdatesListener() {
    useEchoPublic('deliveries', 'delivery.updated', () => {
        router.reload({ only: [], preserveScroll: true });
    });

    return null;
}
