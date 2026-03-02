import DriverLayout from '@/layouts/DriverLayout';
import { Head, Link } from '@inertiajs/react';
import { Truck, CheckCircle, Navigation } from 'lucide-react';

export default function DriverDashboard({ stats, recent_deliveries }: any) {
    return (
        <DriverLayout breadcrumbs={[{ title: 'Driver Dashboard', href: '/driver/dashboard' }]}>
            <Head title="Driver Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Driver Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-2">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/50"><Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Today</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.assigned_today || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/50"><Navigation className="h-6 w-6 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.in_progress || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/50"><CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed All Time</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.completed_all || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 mt-6 overflow-hidden">
                    <div className="border-b px-6 py-4 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Recent Routes</h2>
                        <Link href="/driver/deliveries" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer">View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">ID</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Route</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Assigned By</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent_deliveries?.length > 0 ? recent_deliveries.map((delivery: any) => (
                                    <tr key={delivery.id}>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">#{delivery.id}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{delivery.pickup_location} → {delivery.delivery_location}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{delivery.officer?.name || 'System'}</td>
                                        <td className="px-6 py-4">
                                             <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                                 delivery.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                 delivery.status === 'picked_up' ? 'bg-amber-100 text-amber-700' :
                                                 delivery.status === 'in_transit' || delivery.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                                                 delivery.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                             }`}>
                                                 {delivery.status.replace('_', ' ').toUpperCase()}
                                             </span>
                                         </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No active routes assigned.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
