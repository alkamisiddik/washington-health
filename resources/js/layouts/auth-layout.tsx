import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
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
        <AuthLayoutTemplate title={title} description={description} {...props}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
            />
            {children}
        </AuthLayoutTemplate>
    );
}
