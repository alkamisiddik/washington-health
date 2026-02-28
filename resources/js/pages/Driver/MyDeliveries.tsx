import DriverLayout from '@/layouts/DriverLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import ElapsedTimer from '@/components/ElapsedTimer';
import ChecklistForm from '@/components/ChecklistForm';
import EnvironmentForm from '@/components/EnvironmentForm';
import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';

export default function MyDeliveries({ deliveries }: { deliveries: any[] }) {
    const [startConfirm, setStartConfirm] = useState<number | null>(null);
    const [endConfirm, setEndConfirm] = useState<number | null>(null);
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const actionRequired = deliveries.filter(d => ['assigned', 'in_progress'].includes(d.status));
    const completed = deliveries.filter(d => d.status === 'completed');
    const others = deliveries.filter(d => ['pending'].includes(d.status));

    const DeliveryCard = ({ delivery }: { delivery: any }) => {
        return (
            <div className="relative flex flex-col overflow-hidden rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                            {delivery.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Pickup</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{delivery.pickup_location}</p>
                        </div>
                        <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                            <ArrowRight size={20} />
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Delivery</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{delivery.delivery_location}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Scheduled</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {new Date(delivery.scheduled_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Vehicle</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {delivery.vehicle ? delivery.vehicle.vehicle_number : 'N/A'}
                            </p>
                        </div>
                    </div>
                    {delivery.status === 'completed' && delivery.duration_minutes && (
                        <div className="mt-3">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed in {delivery.duration_minutes} mins</p>
                        </div>
                    )}
                </div>

                {delivery.status === 'assigned' && (
                    <ChecklistForm delivery={delivery} checklist={delivery.checklist} />
                )}

                {(delivery.status === 'in_progress' || delivery.status === 'completed') && (
                    <>
                        <EnvironmentForm delivery={delivery} envLog={delivery.environment_log} readOnly={delivery.status === 'completed'} />
                        <ChainOfCustodyForm delivery={delivery} coc={delivery.chain_of_custody} readOnly={delivery.status === 'completed'} />
                    </>
                )}

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700 flex justify-end items-center gap-4">
                    {delivery.status === 'assigned' && (
                        <div className="relative group w-full sm:w-auto">
                            <button 
                                onClick={() => setStartConfirm(delivery.id)}
                                disabled={!delivery.checklist || !Object.keys(delivery.checklist).filter(k => k !== 'id' && k !== 'delivery_id' && k !== 'created_at' && k !== 'updated_at').every(k => delivery.checklist[k] === true)}
                                className="inline-flex w-full justify-center items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Delivery
                            </button>
                            {(!delivery.checklist || !Object.keys(delivery.checklist).filter(k => k !== 'id' && k !== 'delivery_id' && k !== 'created_at' && k !== 'updated_at').every(k => delivery.checklist[k] === true)) && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-xs rounded py-1 px-2 z-10 dark:bg-gray-700">
                                    Complete checklist first
                                </div>
                            )}
                        </div>
                    )}
                    
                    {delivery.status === 'in_progress' && (
                        <>
                            <div className="flex-1 text-gray-700 dark:text-gray-300">
                                <span className="text-xs uppercase font-medium text-gray-500 block">Elapsed Time</span>
                                <ElapsedTimer startTime={delivery.start_time} />
                            </div>
                            <button 
                                onClick={() => setEndConfirm(delivery.id)}
                                className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                            >
                                End Delivery
                            </button>
                        </>
                    )}

                    {delivery.status === 'completed' && delivery.duration_minutes && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Completed in {delivery.duration_minutes} mins
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DriverLayout breadcrumbs={[{ title: 'My Deliveries', href: '/driver/deliveries' }]}>
            <Head title="My Deliveries" />
            
            <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6 max-w-7xl mx-auto w-full">
                
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">My Deliveries</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage your assigned deliveries.</p>
                </div>

                {deliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 dark:border-gray-700">
                        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                            <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">No deliveries assigned yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You will see your assignments here when an officer schedules them.</p>
                    </div>
                ) : (
                    <>
                        <ActionConfirmDialog
                            open={startConfirm !== null}
                            onCancel={() => setStartConfirm(null)}
                            onConfirm={() => {
                                if (startConfirm) router.post(route('driver.deliveries.start', startConfirm), {}, { preserveScroll: true });
                                setStartConfirm(null);
                            }}
                            title="Start this delivery?"
                            description="You are about to start this delivery. The elapsed time will begin. Confirm to proceed."
                            confirmText="Start delivery"
                        />
                        <ActionConfirmDialog
                            open={endConfirm !== null}
                            onCancel={() => setEndConfirm(null)}
                            onConfirm={() => {
                                if (endConfirm) router.post(route('driver.deliveries.end', endConfirm), {}, { preserveScroll: true });
                                setEndConfirm(null);
                            }}
                            title="End this delivery?"
                            description="Confirm that this delivery is complete. Temperature & humidity and chain of custody should be filled as needed."
                            confirmText="End delivery"
                            variant="destructive"
                        />
                        {actionRequired.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Action Required
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {actionRequired.map(delivery => (
                                        <DeliveryCard key={delivery.id} delivery={delivery} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {others.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                    Other Updates
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-80">
                                    {others.map(delivery => (
                                        <DeliveryCard key={delivery.id} delivery={delivery} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {completed.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                    Completed
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
                                    {completed.map(delivery => (
                                        <DeliveryCard key={delivery.id} delivery={delivery} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

            </div>
        </DriverLayout>
    );
}
