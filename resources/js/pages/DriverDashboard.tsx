import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DriverLayout from '@/layouts/DriverLayout';
import { DashboardProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Navigation, Truck } from 'lucide-react';

export default function DriverDashboard({ stats, recent_deliveries }: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 ring-yellow-600/20';
            case 'assigned':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 ring-blue-600/20';
            case 'picked_up':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 ring-amber-600/20';
            case 'in_transit':
            case 'in_progress':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 ring-indigo-600/20';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 ring-green-600/20';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 ring-gray-600/20';
        }
    };

    return (
        <DriverLayout breadcrumbs={[{ title: 'Driver Dashboard', href: '/driver/dashboard' }]}>
            <Head title="Driver Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Driver Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/50">
                                <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Today</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.assigned_today || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/50">
                                <Navigation className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.in_progress || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/50">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed All Time</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.completed_all || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b px-4 py-2 dark:border-gray-700">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Deliveries</h2>
                        <Link href="/driver/deliveries" className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            View all
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <Table className="text-xs">
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead className="h-9 px-3 py-2 font-medium">ID</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Route</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Driver</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Vehicle</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Duration</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_deliveries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-16 px-3 py-2 text-center text-muted-foreground">
                                            No recent deliveries found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recent_deliveries.map((delivery) => (
                                        <TableRow key={delivery.id} className="hover:bg-muted/50">
                                            <TableCell className="px-3 py-2 font-medium">
                                                <Link href={`/driver/deliveries/${delivery.id}`} className="hover:underline">
                                                    #{delivery.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="max-w-[180px] truncate px-3 py-2 text-muted-foreground" title={`${delivery.pickup_location} → ${delivery.delivery_location}`}>
                                                {delivery.pickup_location}
                                                <span className="mx-1 text-muted-foreground/50">→</span>
                                                {delivery.delivery_location}
                                            </TableCell>
                                            <TableCell className="max-w-[100px] truncate px-3 py-2 text-muted-foreground">
                                                {delivery.driver?.name ?? <span className="italic text-muted-foreground/60">—</span>}
                                            </TableCell>
                                            <TableCell className="px-3 py-2 text-muted-foreground">
                                                {delivery.vehicle?.vehicle_number ?? <span className="italic text-muted-foreground/60">—</span>}
                                            </TableCell>
                                            <TableCell className="px-3 py-2 text-muted-foreground">
                                                {delivery.duration_minutes ? `${delivery.duration_minutes} m` : '—'}
                                            </TableCell>
                                            <TableCell className="px-3 py-2">
                                                <span
                                                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${getStatusColor(
                                                        delivery.status,
                                                    )}`}
                                                >
                                                    {delivery.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
