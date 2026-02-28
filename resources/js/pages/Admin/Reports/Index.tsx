import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Package, Truck, Clock, CheckCircle, Car } from 'lucide-react';

interface ReportProps {
    totalDeliveries: number;
    completedDeliveries: number;
    pendingDeliveries: number;
    inProgressDeliveries: number;
    deliveriesByDriver: any[];
    recentCompleted: any[];
}

export default function Index({
    totalDeliveries,
    completedDeliveries,
    pendingDeliveries,
    inProgressDeliveries,
    deliveriesByDriver,
    recentCompleted
}: ReportProps) {
    
    const statusData = [
        { name: 'Completed', value: completedDeliveries, color: '#10b981' },
        { name: 'In Progress', value: inProgressDeliveries, color: '#8b5cf6' },
        { name: 'Pending', value: pendingDeliveries, color: '#f59e0b' },
    ].filter(v => v.value > 0);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Reports', href: '/admin/reports' }]}>
            <Head title="System Reports" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">System Reports</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of delivery system statistics and driver performance.</p>
                    </div>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/50">
                                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deliveries</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDeliveries}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/50">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedDeliveries}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-purple-50 p-3 dark:bg-purple-900/50">
                                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inProgressDeliveries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/50">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingDeliveries}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Charts */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700 h-[450px] flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-full mb-6">Delivery Status Distribution</h2>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">No data available</div>
                        )}
                    </div>

                    {/* Top Drivers */}
                    <div className="rounded-xl border bg-white overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col h-[450px]">
                        <div className="border-b px-6 py-4 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Car className="h-5 w-5 text-gray-400" />
                                Top Drivers by Deliveries
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 stick top-0">
                                    <tr>
                                        <th className="px-6 py-3">Driver Name</th>
                                        <th className="px-6 py-3 text-right">Completed Deliveries</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {deliveriesByDriver.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No drivers found.
                                            </td>
                                        </tr>
                                    ) : deliveriesByDriver.map((driver) => (
                                        <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                {driver.name}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                                                {driver.deliveries_as_driver_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Completed Deliveries */}
                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="border-b px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recently Completed</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Route</th>
                                    <th className="px-6 py-3">Driver</th>
                                    <th className="px-6 py-3">End Time</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentCompleted.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No completed deliveries found.
                                        </td>
                                    </tr>
                                ) : recentCompleted.map((delivery) => (
                                    <tr key={delivery.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">#{delivery.id}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate max-w-xs">{delivery.pickup_location} → {delivery.delivery_location}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{delivery.driver?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(delivery.end_time).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/deliveries/${delivery.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
