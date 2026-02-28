import { Breadcrumbs } from '@/components/breadcrumbs';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, LayoutGrid, Users, Truck, FileBarChart, PlusSquare } from 'lucide-react';
import React from 'react';
import NotificationDropdown from './NotificationDropdown';

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
                { title: 'All Deliveries', href: '/admin/deliveries', icon: Truck },
                { title: 'Reports', href: '/admin/reports', icon: FileBarChart },
            ];
        case 'officer':
            return [
                { title: 'Dashboard', href: '/officer/dashboard', icon: LayoutGrid },
                { title: 'Deliveries', href: '/officer/deliveries', icon: Truck },
                { title: 'Create Delivery', href: '/officer/deliveries/create', icon: PlusSquare },
            ];
        case 'driver':
            return [
                { title: 'Dashboard', href: '/driver/dashboard', icon: LayoutGrid },
                { title: 'My Deliveries', href: '/driver/deliveries', icon: Truck },
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
            return paths.some(path => url.startsWith(path));
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

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <header className="bg-white shadow-md dark:bg-gray-800">
                <div className="container mx-auto px-4 md:max-w-4/5">
                    <div className="flex h-16 items-center justify-between">
                        <Link href={dashboardRoute} className="flex items-center">
                            <span className="hidden text-2xl font-bold text-blue-600 md:block dark:text-blue-400">{appName}</span>
                            <span className="text-2xl font-bold text-blue-600 md:hidden dark:text-blue-400">{shortName}</span>
                        </Link>

                        <nav className="hidden md:block">
                            <ul className="flex space-x-8">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                                    isActive(item.href)
                                                        ? 'font-medium text-amber-600 dark:text-amber-400'
                                                        : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <NotificationDropdown />
                                </li>
                                <li>
                                    <Link
                                        href="/settings"
                                        className={`flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                            isActive(settingRoutes)
                                                ? 'font-medium text-amber-600 dark:text-amber-400'
                                                : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Mobile menu */}
                        <div className="flex space-x-5 md:hidden">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={isActive(item.href) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}
                                    >
                                        <Icon />
                                    </Link>
                                );
                            })}
                            <NotificationDropdown />
                            <Link
                                href="/settings"
                                className={isActive(settingRoutes) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}
                            >
                                <Settings />
                            </Link>
                            <Link method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                <LogOut />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
