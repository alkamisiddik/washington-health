import OfficerLayout from '@/layouts/OfficerLayout';
import { Head, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';

export default function Show({ delivery, drivers = [], vehicles = [] }: { delivery: any, drivers?: any[], vehicles?: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        driver_id: delivery?.driver_id?.toString() || '',
        vehicle_id: delivery?.vehicle_id?.toString() || '',
    });

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('officer.deliveries.assign', delivery.id), {
            preserveScroll: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    return (
        <OfficerLayout breadcrumbs={[
            { title: 'Deliveries', href: '/officer/deliveries' },
            { title: `Delivery #${delivery.id}`, href: `/officer/deliveries/${delivery.id}` }
        ]}>
            <Head title={`Delivery #${delivery.id}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Delivery #{delivery.id}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Requested by you on {new Date(delivery.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(delivery.status)}`}>
                            {delivery.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {delivery.status === 'completed' && (
                            <a 
                                href={route('compliance.export', delivery.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
                            >
                                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                Export PDF
                            </a>
                        )}
                    </div>
                </div>

                {['pending', 'assigned', 'in_progress'].includes(delivery.status) && (
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {delivery.status === 'pending' ? 'Assign Driver & Vehicle' : 'Change Driver or Vehicle'}
                        </h2>
                        <form onSubmit={submitAssign} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Driver</label>
                                <select
                                    id="driver_id"
                                    value={data.driver_id || delivery.driver_id || ''}
                                    onChange={(e) => setData('driver_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                                    required
                                >
                                    <option value="">Select a driver...</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                {errors.driver_id && <p className="mt-1 text-sm text-red-600">{errors.driver_id}</p>}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle</label>
                                <select
                                    id="vehicle_id"
                                    value={data.vehicle_id || delivery.vehicle_id || ''}
                                    onChange={(e) => setData('vehicle_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                                    required
                                >
                                    <option value="">Select a vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.vehicle_number} - {v.description}</option>
                                    ))}
                                </select>
                                {errors.vehicle_id && <p className="mt-1 text-sm text-red-600">{errors.vehicle_id}</p>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {delivery.status === 'pending' ? 'Assign' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Details Card */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
                            Details
                        </h2>
                        
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup Location</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">{delivery.pickup_location}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Location</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">{delivery.delivery_location}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <dt className="text-xs uppercase text-gray-500 dark:text-gray-400">Scheduled Time</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{new Date(delivery.scheduled_time).toLocaleString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase text-gray-500 dark:text-gray-400">Driver</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{delivery.driver?.name || 'Unassigned'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase text-gray-500 dark:text-gray-400">Vehicle</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{delivery.vehicle?.vehicle_number || 'Unassigned'}</dd>
                                </div>
                            </div>
                            {delivery.notes && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 italic">{delivery.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Timeline Card */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Timeline</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Requested</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(delivery.created_at).toLocaleString()}</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${(delivery.pickup_time || delivery.chain_of_custody?.pickup_time) ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Picked Up</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(delivery.pickup_time || delivery.chain_of_custody?.pickup_time) ? new Date(delivery.pickup_time || delivery.chain_of_custody.pickup_time).toLocaleString() : 'Pending'}</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${delivery.start_time ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">In Transit</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{delivery.start_time ? new Date(delivery.start_time).toLocaleString() : 'Pending'}</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${delivery.end_time ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Delivered</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{delivery.end_time ? new Date(delivery.end_time).toLocaleString() : 'Pending'}</p>
                                </div>
                            </li>
                        </ul>
                        {delivery.duration_minutes && (
                            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Duration: <span className="font-medium text-gray-900 dark:text-gray-100">{delivery.duration_minutes} minutes</span></p>
                            </div>
                        )}
                    </div>
                </div>

                {delivery.status === 'completed' && (
                    <div className="mt-4 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
                            Chain of Custody
                        </h2>
                        <ChainOfCustodyForm delivery={delivery} coc={delivery.chain_of_custody} readOnly={true} />
                    </div>
                )}

            </div>
        </OfficerLayout>
    );
}
