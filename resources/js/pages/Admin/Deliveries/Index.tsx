import AdminLayout from '@/layouts/AdminLayout';
import { Head, router, usePage, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Filter, Eye, FileText, Trash2 } from 'lucide-react';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';

interface DeliveriesProps {
    deliveries: any;
    drivers: any[];
    filters: any;
}

export default function Index({ deliveries, drivers, filters }: DeliveriesProps) {
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const { data, setData, get, processing } = useForm({
        status: filters.status || '',
        driver_id: filters.driver_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.deliveries'), { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 ring-yellow-600/20';
            case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 ring-blue-600/20';
            case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 ring-purple-600/20';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 ring-green-600/20';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 ring-gray-600/20';
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Deliveries', href: '/admin/deliveries' }
        ]}>
            <Head title="All Deliveries" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">All Deliveries</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage all deliveries across the system.</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
                        >
                            <Download className="h-4 w-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="driver_id" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
                                <select
                                    id="driver_id"
                                    value={data.driver_id}
                                    onChange={e => setData('driver_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">All Drivers</option>
                                    {drivers.map((d: any) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="date_from" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
                                <input
                                    type="date"
                                    id="date_from"
                                    value={data.date_from}
                                    onChange={e => setData('date_from', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="date_to" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
                                <input
                                    type="date"
                                    id="date_to"
                                    value={data.date_to}
                                    onChange={e => setData('date_to', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Route</th>
                                    <th className="px-6 py-3">Driver</th>
                                    <th className="px-6 py-3">Vehicle</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                {deliveries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                                            No deliveries found matching your filters.
                                        </td>
                                    </tr>
                                ) : deliveries.data.map((delivery: any) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            #{delivery.id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(delivery.scheduled_time).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="max-w-[200px] truncate" title={delivery.pickup_location}>{delivery.pickup_location}</div>
                                            <div className="text-gray-300 dark:text-gray-600 text-xs my-0.5">↓</div>
                                            <div className="max-w-[200px] truncate" title={delivery.delivery_location}>{delivery.delivery_location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {delivery.driver?.name || <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {delivery.vehicle?.vehicle_number || <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(delivery.status)}`}>
                                                {delivery.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={route('compliance.export', delivery.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600"
                                                    title="Export PDF"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </a>
                                                <Link
                                                    href={route('admin.deliveries.show', delivery.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteConfirmId(delivery.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:ring-red-600 dark:hover:bg-red-900/20"
                                                    title="Delete delivery"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {deliveries.links && deliveries.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{deliveries.from || 0}</span> to <span className="font-medium">{deliveries.to || 0}</span> of{' '}
                                        <span className="font-medium">{deliveries.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {deliveries.links.map((link: any, idx: number) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${
                                                    idx === 0 ? 'rounded-l-md' : idx === deliveries.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ActionConfirmDialog
                open={deleteConfirmId !== null}
                onCancel={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    if (deleteConfirmId) {
                        router.delete(route('admin.deliveries.destroy', deleteConfirmId));
                        setDeleteConfirmId(null);
                    }
                }}
                title="Delete this delivery?"
                description="This will permanently remove the delivery and all related records (checklist, environment log, chain of custody). This cannot be undone."
                confirmText="Delete delivery"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
