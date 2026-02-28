import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Edit({ vehicle }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_number: vehicle.vehicle_number || '',
        description: vehicle.description || '',
        status: vehicle.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.vehicles.update', vehicle.id));
    };

    const deactivate = () => {
        if (confirm('Are you sure you want to deactivate this vehicle?')) {
            router.delete(route('admin.vehicles.destroy', vehicle.id));
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Vehicles', href: '/admin/vehicles' },
            { title: 'Edit Vehicle', href: `/admin/vehicles/${vehicle.id}/edit` }
        ]}>
            <Head title={`Edit Vehicle - ${vehicle.vehicle_number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Vehicle</h1>
                    {vehicle.status !== 'inactive' && (
                        <button
                            onClick={deactivate}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                        >
                            Deactivate
                        </button>
                    )}
                </div>

                <div className="mt-4 max-w-2xl rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="vehicle_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Vehicle Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="vehicle_number"
                                value={data.vehicle_number}
                                onChange={(e) => setData('vehicle_number', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                                required
                            />
                            {errors.vehicle_number && <div className="mt-1 text-sm text-red-600">{errors.vehicle_number}</div>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                            />
                            {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                            {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('admin.vehicles.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                Update Vehicle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
