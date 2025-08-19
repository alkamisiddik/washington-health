import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Image, LockIcon, Map, UsersIcon } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: <UsersIcon/>,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: <LockIcon/>,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: <Image/>,
    },
    {
        title: 'Locations',
        href: '/admin/locations',
        icon: <Map/>,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="p-8">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-0 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-64">
                    <nav className="flex md:flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-center md:justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon}
                                    <span className="hidden md:block">{item.title}</span>
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-1/2">
                    <section className="max-w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
