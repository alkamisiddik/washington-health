import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutGrid, Truck } from 'lucide-react';

const driverNavItems = [
    { title: "Dashboard", href: "/driver/dashboard", icon: LayoutGrid },
    { title: "My Deliveries", href: "/driver/deliveries", icon: Truck },
];

export default function DriverLayout({ children, breadcrumbs }) {
    const { props: pageProps } = usePage();
    const flashMessage = pageProps?.flash?.message;
    const success = flashMessage?.success;
    const errorMsg = flashMessage?.error;

    useEffect(() => {
        if (success) toast.success(success);
        if (errorMsg) toast.error(errorMsg);
    }, [success, errorMsg]);

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} navItems={driverNavItems} />
            <AppContent>
                <ToastContainer position="bottom-right" autoClose={3000} />
                {children}
            </AppContent>
        </AppShell>
    );
}
