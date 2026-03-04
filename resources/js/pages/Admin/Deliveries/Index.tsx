import AdminLayout from '@/layouts/AdminLayout';
import { Head, router, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Filter, Eye, FileText, Trash2 } from 'lucide-react';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DeliveriesProps {
    deliveries: any;
    drivers: any[];
    vehicles: any[];
    filters: any;
}

export default function Index({ deliveries, drivers, vehicles, filters }: DeliveriesProps) {
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const { data, setData, get, processing } = useForm({
        status: filters.status || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.deliveries'), { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (data.status) params.set('status', data.status);
        if (data.driver_id) params.set('driver_id', data.driver_id);
        if (data.vehicle_id) params.set('vehicle_id', data.vehicle_id);
        if (data.date_from) params.set('date_from', data.date_from);
        if (data.date_to) params.set('date_to', data.date_to);
        window.open(route('admin.deliveries.export') + (params.toString() ? '?' + params.toString() : ''), '_blank');
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
                    <Button variant="outline" onClick={handleExport} className="gap-2 self-start">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    {/* Filter Bar */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
                            <div className="flex-1 min-w-[130px] space-y-1">
                                <Label className="text-xs">Status</Label>
                                <Select value={data.status || 'all'} onValueChange={v => setData('status', v === 'all' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[130px] space-y-1">
                                <Label className="text-xs">Driver</Label>
                                <Select value={data.driver_id || 'all'} onValueChange={v => setData('driver_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Drivers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Drivers</SelectItem>
                                        {drivers.map((d: any) => (
                                            <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[130px] space-y-1">
                                <Label className="text-xs">Vehicle</Label>
                                <Select value={data.vehicle_id || 'all'} onValueChange={v => setData('vehicle_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Vehicles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Vehicles</SelectItem>
                                        {vehicles.map((v: any) => (
                                            <SelectItem key={v.id} value={String(v.id)}>{v.vehicle_number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[130px] space-y-1">
                                <Label className="text-xs">Date From</Label>
                                <Input
                                    type="date"
                                    value={data.date_from}
                                    onChange={e => setData('date_from', e.target.value)}
                                />
                            </div>
                            <div className="flex-1 min-w-[130px] space-y-1">
                                <Label className="text-xs">Date To</Label>
                                <Input
                                    type="date"
                                    value={data.date_to}
                                    onChange={e => setData('date_to', e.target.value)}
                                />
                            </div>
                            <div className="mt-auto">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </Button>
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
                                                    title="Export PDF"
                                                >
                                                    <Button variant="outline" size="sm" className="gap-1.5">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <Link href={route('admin.deliveries.show', delivery.id)}>
                                                    <Button variant="outline" size="sm" className="gap-1.5">
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-1.5"
                                                    onClick={() => setDeleteConfirmId(delivery.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
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
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {deliveries.links.map((link: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active
                                                    ? 'z-10 bg-indigo-600 text-white'
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
