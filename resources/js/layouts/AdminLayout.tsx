import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutGrid, Users, Truck, FileBarChart } from 'lucide-react';

const adminNavItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Vehicles", href: "/admin/vehicles", icon: Truck },
    { title: "All Deliveries", href: "/admin/deliveries", icon: Truck },
    { title: "Reports", href: "/admin/reports", icon: FileBarChart },
];

export default function AdminLayout({ children, breadcrumbs }) {
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
            <AppHeader breadcrumbs={breadcrumbs} navItems={adminNavItems} />
            <AppContent>
                <ToastContainer position="bottom-right" autoClose={3000} />
                {children}
            </AppContent>
        </AppShell>
    );
}
