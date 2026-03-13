import { Breadcrumbs } from '@/components/breadcrumbs';
import NotificationDropdown from '@/components/NotificationDropdown';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { confirmAction } from '@/utils/alerts';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCircle2, ClipboardCheck, FileBarChart, LayoutGrid, LogOut, PlusSquare, Settings, ShoppingBag, Truck, Users } from 'lucide-react';
import React from 'react';

export interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    navItems?: NavItem[];
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const shortName = import.meta.env.VITE_SHORT_APP_NAME || 'Laravel';

const getNavItems = (role: string): NavItem[] => {
    switch (role) {
        case 'admin':
            return [
                { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
                { title: 'Users', href: '/admin/users', icon: Users },
                { title: 'Vehicles', href: '/admin/vehicles', icon: Truck },
                { title: 'All Deliveries', href: '/admin/deliveries', icon: ShoppingBag },
                { title: 'Reports', href: '/admin/reports', icon: FileBarChart },
                { title: 'Quality Reports', href: '/admin/quality-reports', icon: ClipboardCheck },
            ];
        case 'officer':
            return [
                { title: 'Dashboard', href: '/officer/dashboard', icon: LayoutGrid },
                { title: 'Deliveries', href: '/officer/deliveries', icon: ShoppingBag },
                { title: 'Create Delivery', href: '/officer/deliveries/create', icon: PlusSquare },
            ];
        case 'driver':
            return [
                { title: 'Dashboard', href: '/driver/dashboard', icon: LayoutGrid },
                { title: 'My Deliveries', href: '/driver/deliveries', icon: ShoppingBag },
                { title: 'Completed', href: '/driver/deliveries/completed', icon: CheckCircle2 },
            ];
        default:
            return [];
    }
};

export function AppHeader({ breadcrumbs = [], navItems: propNavItems = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const role = (auth?.user?.role as string) || 'driver';

    // Auto-fill navItems if none provided (e.g. Settings pages)
    const navItems = propNavItems.length > 0 ? propNavItems : getNavItems(role);

    const routePrefix = `/${role}`;
    const dashboardRoute = `${routePrefix}/dashboard`;
    const settingRoutes = ['/settings/profile', '/settings/password', '/settings/appearance', '/admin/locations'];

    const { url } = usePage() as unknown as { url: string };
    const isActive = (paths: string | string[]) => {
        if (Array.isArray(paths)) {
            return paths.some((path) => url.startsWith(path));
        }
        if (paths === url) return true;
        // Deliveries pages: active when current path starts with the nav path
        if (paths === '/admin/deliveries' || paths === '/officer/deliveries') {
            return url.startsWith(paths);
        }
        // Other routes: active only on exact or single-segment match to avoid e.g. /officer/deliveries/create matching /officer/deliveries
        if (url.startsWith(paths)) return true;
        return false;
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b bg-white/95 shadow-sm backdrop-blur transition-all supports-[backdrop-filter]:bg-white/60 dark:bg-gray-800/95 dark:supports-[backdrop-filter]:bg-gray-800/60">
                <div className="mx-auto px-4 md:max-w-5/6 md:px-0">
                    <div className="flex h-16 gap-2 md:gap-4">
                        <Link href={dashboardRoute} className="flex shrink-0 items-center">
                            <span className="hidden text-2xl font-bold tracking-tight text-blue-600 lg:block dark:text-blue-400">{appName}</span>
                            <span className="text-xl font-bold tracking-tight text-blue-600 lg:hidden dark:text-blue-400">{shortName}</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex flex-1 items-center justify-center sm:justify-end md:justify-center">
                            <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                title={item.title}
                                                className={`flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-600 sm:min-h-0 sm:min-w-0 sm:justify-start sm:px-3 dark:hover:bg-gray-700 dark:hover:text-blue-400 ${
                                                    active
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                        : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="hidden xl:inline">{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Right Section Tools */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <NotificationDropdown>
                                <Button variant="ghost" size="icon" className="relative h-11 min-h-[44px] min-w-[44px] touch-manipulation rounded-full sm:h-10 sm:w-10 sm:min-h-0 sm:min-w-0">
                                    <Bell className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-300" />
                                    {auth.unread_notifications_count > 0 && (
                                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800">
                                            {auth.unread_notifications_count > 9 ? '9+' : auth.unread_notifications_count}
                                        </span>
                                    )}
                                </Button>
                            </NotificationDropdown>

                            <Link href="/settings/profile" title="Settings">
                                <Button
                                    variant={isActive(settingRoutes) ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-11 min-h-[44px] min-w-[44px] touch-manipulation rounded-full sm:h-10 sm:w-10 sm:min-h-0 sm:min-w-0"
                                >
                                    <Settings className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-300" />
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="icon"
                                title="Logout"
                                className="h-11 min-h-[44px] min-w-[44px] touch-manipulation rounded-full text-gray-600 hover:text-red-600 sm:h-10 sm:w-10 sm:min-h-0 sm:min-w-0 dark:text-gray-300 dark:hover:text-red-400"
                                onClick={async () => {
                                    if (await confirmAction('Logout', 'Are you sure you want to log out?', 'info')) {
                                        router.post(route('logout'));
                                    }
                                }}
                            >
                                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
                    <div className="mx-auto flex h-10 w-full items-center justify-start px-4 text-xs font-medium text-neutral-500 sm:px-6 md:max-w-5/6 lg:px-8">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
