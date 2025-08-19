import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS globally

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { props: pageProps } = usePage();
    const { success, error } = pageProps?.flash?.message || {};

    useEffect(() => {
        if (success) {
            toast.success(success);
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
            />
            {children}
        </AppLayoutTemplate>
    );
}
