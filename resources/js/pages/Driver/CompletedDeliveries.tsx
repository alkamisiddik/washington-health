import DriverLayout from '@/layouts/DriverLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginatedDeliveries {
    data: { id: number; pickup_location: string; delivery_location: string; end_time?: string; duration_minutes?: number }[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function CompletedDeliveries({ deliveries }: { deliveries: PaginatedDeliveries }) {
    const list = deliveries.data || [];

    return (
        <DriverLayout breadcrumbs={[
            { title: 'My Deliveries', href: '/driver/deliveries' },
            { title: 'Completed', href: '/driver/deliveries/completed' },
        ]}>
            <Head title="Completed Deliveries" />

            <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6 max-w-6xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Completed Deliveries</h1>
                    <p className="text-sm text-muted-foreground">History of deliveries you have completed.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('driver.deliveries')}>Back to My Deliveries</Link>
                    </Button>
                </div>

                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 dark:border-gray-700 dark:bg-gray-800/30">
                        <div className="rounded-full bg-gray-200/80 p-4 dark:bg-gray-700">
                            <CheckCircle2 className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h2 className="mt-5 text-lg font-semibold text-foreground">No completed deliveries</h2>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">Completed deliveries will appear here.</p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href={route('driver.deliveries')}>My Deliveries</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {list.map((delivery: PaginatedDeliveries['data'][0]) => (
                            <Link
                                key={delivery.id}
                                href={route('driver.deliveries.show', delivery.id)}
                                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
                            >
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        COMPLETED
                                    </span>
                                    <span className="text-xs text-muted-foreground">#{delivery.id}</span>
                                </div>
                                <div className="flex items-stretch gap-2">
                                    <div className="min-w-0 flex-1 rounded bg-gray-50/80 p-2 dark:bg-gray-800/80">
                                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">Pickup</p>
                                        <p className="truncate text-sm font-medium">{delivery.pickup_location}</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground self-center" />
                                    <div className="min-w-0 flex-1 rounded bg-gray-50/80 p-2 text-right dark:bg-gray-800/80">
                                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">Delivery</p>
                                        <p className="truncate text-sm font-medium">{delivery.delivery_location}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {delivery.end_time ? new Date(delivery.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </span>
                                    {delivery.duration_minutes != null && (
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{delivery.duration_minutes} min</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {deliveries.links && deliveries.links.length > 3 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {deliveries.links.map((link: PaginatedDeliveries['links'][0], idx: number) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
