import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Filter, Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    deliveries: any[];
    drivers: any[];
    vehicles: any[];
    filters: any;
}

function FilterBar({ drivers, vehicles, filters }: { drivers: any[]; vehicles: any[]; filters: any }) {
    const { data, setData, get, processing } = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.reports.coc-log'), { preserveState: true });
    };

    const exportUrl = () => {
        const params = new URLSearchParams({ export: 'csv' });
        if (data.date_from) params.set('date_from', data.date_from);
        if (data.date_to) params.set('date_to', data.date_to);
        if (data.driver_id) params.set('driver_id', data.driver_id);
        if (data.vehicle_id) params.set('vehicle_id', data.vehicle_id);
        return route('admin.reports.coc-log') + '?' + params.toString();
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[150px] space-y-1">
                <Label className="text-xs">Date From</Label>
                <Input
                    type="date"
                    value={data.date_from}
                    onChange={e => setData('date_from', e.target.value)}
                />
            </div>
            <div className="flex-1 min-w-[150px] space-y-1">
                <Label className="text-xs">Date To</Label>
                <Input
                    type="date"
                    value={data.date_to}
                    onChange={e => setData('date_to', e.target.value)}
                />
            </div>
            <div className="flex-1 min-w-[150px] space-y-1">
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
            <div className="flex-1 min-w-[150px] space-y-1">
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
            <div className="flex gap-2 mt-auto">
                <Button type="submit" disabled={processing} className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
                <a
                    href={exportUrl()}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button type="button" variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </a>
            </div>
        </form>
    );
}

function BoolCell({ value }: { value: boolean | null }) {
    if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
    return value
        ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
        : <XCircle className="h-4 w-4 text-red-400 mx-auto" />;
}

export default function ChainOfCustodyLog({ deliveries, drivers, vehicles, filters }: Props) {
    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Reports', href: '/admin/reports' },
            { title: 'Chain-of-Custody Log', href: '/admin/reports/chain-of-custody-log' },
        ]}>
            <Head title="Instrument Chain-of-Custody Log" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Instrument Chain-of-Custody Log
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Records of container transfers — pickup department, delivery department, condition, seal status, and driver signature.
                    </p>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <FilterBar drivers={drivers} vehicles={vehicles} filters={filters} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Time Out</th>
                                    <th className="px-4 py-3">From Dept</th>
                                    <th className="px-4 py-3">To Dept</th>
                                    <th className="px-4 py-3">Container ID</th>
                                    <th className="px-4 py-3 text-center">Clean / Soiled</th>
                                    <th className="px-4 py-3 text-center">Seal Intact</th>
                                    <th className="px-4 py-3">Condition</th>
                                    <th className="px-4 py-3">Driver Name</th>
                                    <th className="px-4 py-3 text-center">Driver Signed</th>
                                    <th className="px-4 py-3 text-center">Receiver Signed</th>
                                    <th className="px-4 py-3 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                {deliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                                            No chain-of-custody records found for the selected filters.
                                        </td>
                                    </tr>
                                ) : deliveries.map((d: any) => {
                                    const coc = d.chain_of_custody;
                                    return (
                                        <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                {new Date(d.scheduled_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                                                {coc?.pickup_time ? new Date(coc.pickup_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[140px] truncate" title={coc?.pickup_department}>
                                                {coc?.pickup_department || <span className="text-gray-400 italic">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[140px] truncate" title={coc?.delivery_department}>
                                                {coc?.delivery_department || <span className="text-gray-400 italic">—</span>}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                                                {coc?.container_ids || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${coc?.condition === 'clean' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : coc?.condition ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-500'}`}>
                                                    {coc?.condition ? coc.condition.charAt(0).toUpperCase() + coc.condition.slice(1) : '—'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <BoolCell value={!!coc?.driver_signature} />
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize text-xs">
                                                {coc?.condition || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                                                {d.driver?.name || <span className="text-gray-400 italic">Unassigned</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <BoolCell value={!!coc?.driver_signature} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <BoolCell value={!!coc?.receiver_signature} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={route('admin.deliveries.show', d.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
                                                    <FileText className="h-3.5 w-3.5" /> View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {deliveries.length > 0 && (
                        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{deliveries.length}</span> record{deliveries.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
