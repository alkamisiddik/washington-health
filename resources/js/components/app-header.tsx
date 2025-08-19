import { Breadcrumbs } from '@/components/breadcrumbs';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LayoutGrid, ListChecks, LogOut, QrCode, Settings } from 'lucide-react';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const shortName = import.meta.env.VITE_SHORT_APP_NAME || 'Laravel';

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const role = auth.user.role;

    const routePrefix = `/${role}`;
    const dashboardRoute = `${routePrefix}/dashboard`;
    const cartsRoute = `${routePrefix}/carts`;
    const scanRoute = `${routePrefix}/scan`;
    const settingRoutes = ['/settings/profile', '/settings/password', '/settings/appearance', '/admin/locations'];

    const { url } = usePage();
    const isActive = (paths: string | string[]) => {
        if (Array.isArray(paths)) {
            return paths.some(path => url.startsWith(path));
        }
        return url.startsWith(paths);
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
                                <li>
                                    <Link
                                        href={dashboardRoute}
                                        className={`flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                            isActive(dashboardRoute)
                                                ? 'font-medium text-amber-600 dark:text-amber-400'
                                                : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <LayoutGrid size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={cartsRoute}
                                        className={`flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                            isActive(cartsRoute)
                                                ? 'font-medium text-amber-600 dark:text-amber-400'
                                                : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <ListChecks size={18} />
                                        <span>Carts</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={scanRoute}
                                        className={`flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                                            isActive(scanRoute)
                                                ? 'font-medium text-amber-600 dark:text-amber-400'
                                                : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <QrCode size={18} />
                                        <span>Scan QR</span>
                                    </Link>
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
                                        className="flex items-center space-x-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Mobile menu */}
                        <div className="flex space-x-5 md:hidden">
                            <Link
                                href={dashboardRoute}
                                className={isActive(dashboardRoute) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}
                            >
                                <LayoutGrid />
                            </Link>
                            <Link
                                href={cartsRoute}
                                className={isActive(cartsRoute) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}
                            >
                                <ListChecks />
                            </Link>
                            <Link
                                href={scanRoute}
                                className={isActive(scanRoute) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}
                            >
                                <QrCode />
                            </Link>
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
