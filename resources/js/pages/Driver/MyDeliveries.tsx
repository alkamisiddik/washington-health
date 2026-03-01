import DriverLayout from '@/layouts/DriverLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, Package, Calendar, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ElapsedTimer from '@/components/ElapsedTimer';
import ChecklistForm from '@/components/ChecklistForm';
import EnvironmentForm from '@/components/EnvironmentForm';
import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { Button } from '@/components/ui/button';

function getStatusColor(status: string) {
    switch (status) {
        case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 ring-amber-600/20';
        case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 ring-blue-600/20';
        case 'in_progress': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200 ring-violet-600/20';
        case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 ring-emerald-600/20';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'assigned': return <AlertCircle className="h-4 w-4" />;
        case 'in_progress': return <Clock className="h-4 w-4" />;
        case 'completed': return <CheckCircle2 className="h-4 w-4" />;
        default: return <Package className="h-4 w-4" />;
    }
}

interface DeliveryCardProps {
    delivery: any;
    hasInProgress: boolean;
    canStartDelivery: (d: { id: number; checklist?: Record<string, unknown> | null }) => boolean;
    onStartClick: (id: number) => void;
    onEndClick: (id: number) => void;
    onChecklistCompleteChange: (deliveryId: number, complete: boolean) => void;
}

function DeliveryCard({ delivery, hasInProgress, canStartDelivery, onStartClick, onEndClick, onChecklistCompleteChange }: DeliveryCardProps) {
    return (
        <article className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            {/* Card header with status */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">#{delivery.id}</span>
                </div>
            </div>

            {/* Route block */}
            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-stretch gap-3">
                    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-gray-50/80 p-3 dark:bg-gray-800/80">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pickup</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground truncate" title={delivery.pickup_location}>{delivery.pickup_location}</p>
                    </div>
                    <div className="flex shrink-0 items-center text-muted-foreground">
                        <ArrowRight className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-gray-50/80 p-3 dark:bg-gray-800/80 text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Delivery</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground truncate" title={delivery.delivery_location}>{delivery.delivery_location}</p>
                    </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(delivery.scheduled_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                    {delivery.vehicle && (
                        <span className="inline-flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" />
                            {delivery.vehicle.vehicle_number}
                        </span>
                    )}
                    {delivery.status === 'completed' && delivery.duration_minutes != null && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {delivery.duration_minutes} min
                        </span>
                    )}
                </div>
            </div>

            {/* Checklist (assigned only) */}
            {delivery.status === 'assigned' && (
                <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-700">
                    <ChecklistForm
                        key={delivery.id}
                        delivery={delivery}
                        checklist={delivery.checklist}
                        onAllCompleteChange={(complete) => onChecklistCompleteChange(delivery.id, complete)}
                    />
                </div>
            )}

            {/* Env + CoC (in progress / completed) */}
            {(delivery.status === 'in_progress' || delivery.status === 'completed') && (
                <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-700 space-y-4">
                    <EnvironmentForm delivery={delivery} envLog={delivery.environment_log} readOnly={delivery.status === 'completed'} />
                    <ChainOfCustodyForm delivery={delivery} coc={delivery.chain_of_custody} readOnly={delivery.status === 'completed'} />
                </div>
            )}

            {/* Actions footer */}
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/30">
                {delivery.status === 'assigned' && (
                    <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
                        <Button
                            onClick={() => onStartClick(delivery.id)}
                            disabled={hasInProgress || !canStartDelivery(delivery)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Start Delivery
                        </Button>
                        {hasInProgress ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400">Finish your current delivery before starting another.</span>
                        ) : !canStartDelivery(delivery) && (
                            <span className="text-xs text-muted-foreground">Complete all checklist items above (and click Save Checklist to store)</span>
                        )}
                    </div>
                )}

                {delivery.status === 'in_progress' && (
                    <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium text-foreground">Elapsed</span>
                            <ElapsedTimer startTime={delivery.start_time} />
                        </div>
                        <Button
                            onClick={() => onEndClick(delivery.id)}
                            variant="destructive"
                        >
                            End Delivery
                        </Button>
                    </>
                )}

                {delivery.status === 'completed' && delivery.duration_minutes != null && (
                    <span className="text-sm text-muted-foreground italic">Completed in {delivery.duration_minutes} min</span>
                )}

                <Link
                    href={route('driver.deliveries.show', delivery.id)}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    View details
                </Link>
            </div>
        </article>
    );
}

export default function MyDeliveries({ deliveries }: { deliveries: any[] }) {
    const [startConfirm, setStartConfirm] = useState<number | null>(null);
    const [endConfirm, setEndConfirm] = useState<number | null>(null);
    const [clientChecklistComplete, setClientChecklistComplete] = useState<Record<number, boolean>>({});

    const hasInProgress = deliveries.some(d => d.status === 'in_progress');
    const actionRequired = deliveries.filter(d => ['assigned', 'in_progress'].includes(d.status));
    const others = deliveries.filter(d => ['pending'].includes(d.status));

    const CHECKLIST_KEYS = ['vehicle_clean', 'hvac_running', 'logger_active', 'separation_verified', 'containers_sealed', 'logs_completed', 'chain_of_custody_signed'] as const;
    const isChecklistComplete = (d: { checklist?: Record<string, unknown> | null }) =>
        !!d.checklist && CHECKLIST_KEYS.every(k => !!d.checklist![k]);
    const canStartDelivery = (d: { id: number; checklist?: Record<string, unknown> | null }) =>
        isChecklistComplete(d) || !!clientChecklistComplete[d.id];

    return (
        <DriverLayout breadcrumbs={[{ title: 'My Deliveries', href: '/driver/deliveries' }]}>
            <Head title="My Deliveries" />

            <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6 max-w-6xl mx-auto w-full">
                {/* Page header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Deliveries</h1>
                    <p className="text-sm text-muted-foreground">Manage your assigned routes and complete deliveries.</p>
                </div>

                {/* Summary chips when there are deliveries */}
                {deliveries.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        {actionRequired.length > 0 && (
                            <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                <AlertCircle className="h-4 w-4" />
                                {actionRequired.length} need your action
                            </div>
                        )}
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('driver.deliveries.completed')} className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                View completed deliveries
                            </Link>
                        </Button>
                    </div>
                )}

                {deliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 dark:border-gray-700 dark:bg-gray-800/30">
                        <div className="rounded-full bg-gray-200/80 p-4 dark:bg-gray-700">
                            <Package className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h2 className="mt-5 text-lg font-semibold text-foreground">No deliveries assigned</h2>
                        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">When an officer assigns you a delivery, it will appear here. You can also check your notifications for new assignments.</p>
                    </div>
                ) : (
                    <>
                        <ActionConfirmDialog
                            open={startConfirm !== null}
                            onCancel={() => setStartConfirm(null)}
                            onConfirm={() => {
                                const id = startConfirm;
                                setStartConfirm(null);
                                if (id != null) {
                                    router.post(route('driver.deliveries.start', { delivery: id }), {}, { preserveScroll: true });
                                }
                            }}
                            title="Start this delivery?"
                            description="The elapsed time will begin. Confirm when you are ready to start."
                            confirmText="Start delivery"
                        />
                        <ActionConfirmDialog
                            open={endConfirm !== null}
                            onCancel={() => setEndConfirm(null)}
                            onConfirm={() => {
                                const id = endConfirm;
                                setEndConfirm(null);
                                if (id != null) {
                                    router.post(route('driver.deliveries.end', { delivery: id }), {}, { preserveScroll: true });
                                }
                            }}
                            title="End this delivery?"
                            description="Confirm that this delivery is complete. Ensure temperature & humidity and chain of custody are filled as needed."
                            confirmText="End delivery"
                            variant="destructive"
                        />

                        {actionRequired.length > 0 && (
                            <section>
                                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden />
                                    Action required
                                </h2>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {actionRequired.map(d => (
                                        <DeliveryCard
                                            key={d.id}
                                            delivery={d}
                                            hasInProgress={hasInProgress}
                                            canStartDelivery={canStartDelivery}
                                            onStartClick={setStartConfirm}
                                            onEndClick={setEndConfirm}
                                            onChecklistCompleteChange={(deliveryId, complete) => setClientChecklistComplete(prev => ({ ...prev, [deliveryId]: complete }))}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {others.length > 0 && (
                            <section>
                                <h2 className="text-base font-semibold text-foreground mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Other</h2>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {others.map(d => (
                                        <DeliveryCard
                                            key={d.id}
                                            delivery={d}
                                            hasInProgress={hasInProgress}
                                            canStartDelivery={canStartDelivery}
                                            onStartClick={setStartConfirm}
                                            onEndClick={setEndConfirm}
                                            onChecklistCompleteChange={(deliveryId, complete) => setClientChecklistComplete(prev => ({ ...prev, [deliveryId]: complete }))}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('driver.deliveries.completed')} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <CheckCircle2 className="h-4 w-4" />
                                    View completed deliveries
                                </Link>
                            </Button>
                        </section>
                    </>
                )}
            </div>
        </DriverLayout>
    );
}
