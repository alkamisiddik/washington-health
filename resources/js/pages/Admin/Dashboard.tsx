import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { DashboardProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, FileBarChart, Package, TrendingUp, Truck } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function Dashboard({ stats, recent_deliveries, chart_data }: DashboardProps) {
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
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Overview</h1>
                    <Link
                        href="/admin/reports"
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                    >
                        <FileBarChart className="h-4 w-4" />
                        View Reports
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/50">
                                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Today</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total_today}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-purple-50 p-3 dark:bg-purple-900/50">
                                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.in_progress}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/50">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Today</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completed_today}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/50">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                            7-Day Delivery Trend
                        </h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: '#FFF',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b px-4 py-2 dark:border-gray-700">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Deliveries</h2>
                        <Link
                            href="/admin/deliveries"
                            className="rounded-md border border-indigo-100/50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="overflow-x-auto border-t dark:border-gray-700">
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
                                                <Link href={`/admin/deliveries/${delivery.id}`} className="hover:underline">
                                                    #{delivery.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="max-w-[180px] truncate px-3 py-2 text-muted-foreground" title={`${delivery.pickup_location} → ${delivery.delivery_location}`}>
                                                {delivery.pickup_location}
                                                <span className="mx-1 text-muted-foreground/50">→</span>
                                                {delivery.delivery_location}
                                            </TableCell>
                                            <TableCell className="truncate px-3 py-2 text-muted-foreground max-w-[100px]">
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
        </AdminLayout>
    );
}
