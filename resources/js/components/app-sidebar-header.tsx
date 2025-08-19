import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Laptop2, LucideIcon, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Laptop2, label: 'System' },
    ];

    return (
        <header
            className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-4">
                {/* Left side: Sidebar + Breadcrumbs */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {/* Right side: Appearance toggle tabs */}
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div
                                className={cn(
                                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors cursor-pointer',
                                    appearance === 'dark'
                                        ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                        : 'bg-gray-200 hover:bg-neutral-200/60 text-black dark:hover:bg-neutral-700/60'
                                )}
                            >
                                {appearance === 'dark' ? (
                                    <>
                                        <Moon className="h-4 w-4" />
                                        <span className="hidden md:inline ml-1.5 text-sm">Dark</span>
                                    </>
                                ) : appearance === 'light' ? (
                                    <>
                                        <Sun className="h-4 w-4" />
                                        <span className="hidden md:inline ml-1.5 text-sm">Light</span>
                                    </>
                                ) : (
                                    <>
                                        <Laptop2 className="h-4 w-4" />
                                        <span className="hidden md:inline ml-1.5 text-sm">System</span>
                                    </>
                                )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2 space-y-1">
                            <button
                                onClick={() => updateAppearance('light')}
                                className={cn(
                                    'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700',
                                    appearance === 'light' && 'bg-neutral-100 dark:bg-neutral-700'
                                )}
                            >
                                <Sun className="h-4 w-4" />
                                Light
                            </button>
                            <button
                                onClick={() => updateAppearance('dark')}
                                className={cn(
                                    'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700',
                                    appearance === 'dark' && 'bg-neutral-100 dark:bg-neutral-700'
                                )}
                            >
                                <Moon className="h-4 w-4" />
                                Dark
                            </button>
                            <button
                                onClick={() => updateAppearance('system')}
                                className={cn(
                                    'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700',
                                    appearance === 'system' && 'bg-neutral-100 dark:bg-neutral-700'
                                )}
                            >
                                <Laptop2 className="h-4 w-4" />
                                System
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
