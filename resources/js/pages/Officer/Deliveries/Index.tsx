import OfficerLayout from '@/layouts/OfficerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ deliveries, filters }: { deliveries: any, filters: any }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        router.get(route('officer.deliveries.index'), { status: newStatus }, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'picked_up': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
            case 'in_transit':
            case 'in_progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    return (
        <OfficerLayout breadcrumbs={[{ title: 'Deliveries', href: '/officer/deliveries' }]}>
            <Head title="Deliveries" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Deliveries</h1>
                    <Link
                        href={route('officer.deliveries.create')}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        New Delivery
                    </Link>
                </div>

                <div className="mb-4">
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">Select a status</label>
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                            value={statusFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700" aria-label="Tabs">
                            {['all', 'pending', 'assigned', 'picked_up', 'in_transit', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange({ target: { value: status } } as any)}
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                                        statusFilter === status
                                            ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    {status === 'in_transit' ? 'In Transit' : status === 'picked_up' ? 'Picked Up' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {deliveries.data.map((delivery: any) => (
                        <div key={delivery.id} className="relative flex flex-col overflow-hidden rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                                        {delivery.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span className="text-sm">
                                        {delivery.driver ? (
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{delivery.driver.name}</span>
                                        ) : (
                                            <span className="italic text-gray-400">Unassigned</span>
                                        )}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    #{delivery.id}
                                </span>
                            </div>

                            <div className="mb-4 flex-1">
                                <div className="mb-2">
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Pickup</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{delivery.pickup_location}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Delivery</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{delivery.delivery_location}</p>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Scheduled</p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(delivery.scheduled_time).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Driver</p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {delivery.driver ? delivery.driver.name : <span className="text-gray-400 italic">Unassigned</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link href={route('officer.deliveries.show', delivery.id)} className="absolute inset-0" aria-label={`View delivery ${delivery.id}`}></Link>
                        </div>
                    ))}
                </div>

                {deliveries.data.length === 0 && (
                    <div className="rounded-lg border bg-white p-8 text-center dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No deliveries found matching the current filter.</p>
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
