import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ vehicles, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilterChange = (e) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        router.get(route('admin.vehicles.index'), { status: newStatus }, { preserveState: true });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Vehicles', href: '/admin/vehicles' }]}>
            <Head title="Vehicles" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Vehicles</h1>
                    <Link
                        href={route('admin.vehicles.create')}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Add Vehicle
                    </Link>
                </div>

                <div className="mb-4 flex items-center gap-4">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by Status:
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Vehicle #
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {vehicles.data.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {vehicle.vehicle_number}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {vehicle.description || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            vehicle.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            vehicle.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Link href={route('admin.vehicles.edit', vehicle.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No vehicles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
