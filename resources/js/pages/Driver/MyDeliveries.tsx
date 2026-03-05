import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import ChecklistForm from '@/components/ChecklistForm';
import ElapsedTimer from '@/components/ElapsedTimer';
import EnvironmentForm from '@/components/EnvironmentForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import DriverLayout from '@/layouts/DriverLayout';
import { Delivery } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Clock, Package, Truck } from 'lucide-react';
import { useCallback, useState } from 'react';

function getStatusBadge(status: string) {
    switch (status) {
        case 'pending':
            return (
                <Badge variant="outline" className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                    PENDING
                </Badge>
            );
        case 'assigned':
            return (
                <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    ASSIGNED
                </Badge>
            );
        case 'picked_up':
            return (
                <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    PICKED UP
                </Badge>
            );
        case 'in_transit':
        case 'in_progress':
            return (
                <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                    IN PROGRESS
                </Badge>
            );
        case 'completed':
            return (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    COMPLETED
                </Badge>
            );
        default:
            return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
}

function groupDeliveriesByDate(deliveries: Delivery[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const byDate = new Map<string, { dateLabel: string; dateKey: string; deliveries: Delivery[] }>();
    const sorted = [...deliveries].sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());

    for (const d of sorted) {
        const dt = new Date(d.scheduled_time);
        const dDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        const dateKey = dDate.toISOString().slice(0, 10);
        let dateLabel: string;
        if (dDate.getTime() === today.getTime()) {
            dateLabel = 'Today';
        } else if (dDate.getTime() === tomorrow.getTime()) {
            dateLabel = 'Tomorrow';
        } else {
            dateLabel = dt.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: dt.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
            });
        }
        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, { dateLabel, dateKey, deliveries: [] });
        }
        byDate.get(dateKey)!.deliveries.push(d);
    }
    return Array.from(byDate.values());
}

interface DeliveryCardProps {
    delivery: Delivery;
    hasInProgress: boolean;
    canStartDelivery: (d: Delivery) => boolean;
    onStartClick: (id: number) => void;
    onEndClick: (id: number) => void;
    onChecklistCompleteChange: (deliveryId: number, complete: boolean) => void;
}

function DeliveryCard({ delivery, hasInProgress, canStartDelivery, onStartClick, onEndClick, onChecklistCompleteChange }: DeliveryCardProps) {
    const handleChecklistChange = useCallback(
        (complete: boolean) => {
            onChecklistCompleteChange(delivery.id, complete);
        },
        [delivery.id, onChecklistCompleteChange],
    );

    const scheduled = new Date(delivery.scheduled_time);
    const timeStr = scheduled.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = scheduled.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <Card className="overflow-hidden pt-0 transition-all hover:shadow-md dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-stretch">
                    <div className="flex min-w-[6rem] flex-col justify-center border-r bg-indigo-50/50 px-4 py-3 dark:border-gray-700 dark:bg-indigo-900/20">
                        <span className="text-lg font-bold text-indigo-900 tabular-nums dark:text-indigo-200">{timeStr}</span>
                        <span className="text-[11px] font-medium tracking-tighter text-indigo-600 uppercase dark:text-indigo-400">{dateStr}</span>
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
                        <div className="flex items-center gap-2">{getStatusBadge(delivery.status)}</div>
                        <span className="font-mono text-xs text-muted-foreground">ID: #{delivery.id}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5">
                <div className="mb-4 flex items-stretch gap-3">
                    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-indigo-50/30 p-3 dark:bg-indigo-900/10">
                        <p className="text-[10px] font-bold tracking-wider text-indigo-600/70 uppercase dark:text-indigo-400/70">Pickup Location</p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-foreground" title={delivery.pickup_location}>
                            {delivery.pickup_location}
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center text-indigo-400">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-emerald-50/30 p-3 text-right dark:bg-emerald-900/10">
                        <p className="text-[10px] font-bold tracking-wider text-emerald-600/70 uppercase dark:text-emerald-400/70">
                            Delivery Location
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-foreground" title={delivery.delivery_location}>
                            {delivery.delivery_location}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {delivery.vehicle && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Truck className="h-3.5 w-3.5" />
                            <span className="font-mono text-xs font-semibold">{delivery.vehicle.vehicle_number}</span>
                        </div>
                    )}
                    {delivery.status === 'completed' && delivery.duration_minutes != null && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="font-semibold">{delivery.duration_minutes} min duration</span>
                        </div>
                    )}
                </div>

                {delivery.status === 'assigned' && (
                    <div className="mt-6 border-t border-dashed pt-4 dark:border-gray-700">
                        <ChecklistForm
                            key={delivery.id}
                            delivery={delivery}
                            checklist={delivery.checklist}
                            onAllCompleteChange={handleChecklistChange}
                        />
                    </div>
                )}

                {(delivery.status === 'in_transit' || delivery.status === 'in_progress' || delivery.status === 'completed') && (
                    <div className="mt-6 space-y-4 border-t border-dashed pt-4 dark:border-gray-700">
                        <EnvironmentForm delivery={delivery} envLog={delivery.environment_log} readOnly={delivery.status === 'completed'} />
                        <ChainOfCustodyForm delivery={delivery} coc={delivery.chain_of_custody} readOnly={delivery.status === 'completed'} />
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50/50 px-5 py-3 dark:bg-gray-800/30">
                <div className="flex items-center gap-4">
                    {(delivery.status === 'in_transit' || delivery.status === 'in_progress') && delivery.start_time && (
                        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 dark:bg-indigo-900/30">
                            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">ELAPSED:</span>
                            <ElapsedTimer startTime={delivery.start_time} />
                        </div>
                    )}
                    {delivery.status === 'completed' && delivery.duration_minutes != null && (
                        <span className="text-xs text-muted-foreground italic">Trip completed in {delivery.duration_minutes} minutes</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('driver.deliveries.show', delivery.id)}>View Details</Link>
                    </Button>

                    {(delivery.status === 'assigned' || delivery.status === 'picked_up') && (
                        <Button
                            size="sm"
                            onClick={() => onStartClick(delivery.id)}
                            disabled={hasInProgress || !canStartDelivery(delivery)}
                            className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                        >
                            Start Delivery
                        </Button>
                    )}

                    {(delivery.status === 'in_transit' || delivery.status === 'in_progress') && (
                        <Button size="sm" onClick={() => onEndClick(delivery.id)} variant="destructive" className="shadow-sm">
                            End Delivery
                        </Button>
                    )}
                </div>
            </CardFooter>

            {/* Status Warning for Start */}
            {(delivery.status === 'assigned' || delivery.status === 'picked_up') && (hasInProgress || !canStartDelivery(delivery)) && (
                <div className="border-t border-amber-100 bg-amber-50 px-5 py-2 dark:border-amber-900/30 dark:bg-amber-900/20">
                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" />
                        {hasInProgress
                            ? 'Finish your current delivery before starting another.'
                            : 'Complete and SAVE the checklist items above to enable starting.'}
                    </p>
                </div>
            )}
        </Card>
    );
}

const CHECKLIST_KEYS = [
    'vehicle_clean',
    'hvac_running',
    'logger_active',
    'separation_verified',
    'containers_sealed',
    'logs_completed',
    'chain_of_custody_signed',
] as const;

export default function MyDeliveries({ deliveries }: { deliveries: Delivery[] }) {
    const [startConfirm, setStartConfirm] = useState<number | null>(null);
    const [endConfirm, setEndConfirm] = useState<number | null>(null);
    const [clientChecklistComplete, setClientChecklistComplete] = useState<Record<number, boolean>>({});
    const [isStarting, setIsStarting] = useState(false);
    const [isEnding, setIsEnding] = useState(false);

    const hasInProgress = deliveries.some((d) => d.status === 'in_transit' || d.status === 'in_progress');
    const actionRequiredCount = deliveries.filter((d) => ['assigned', 'picked_up', 'in_transit', 'in_progress'].includes(d.status)).length;
    const groupedByDate = groupDeliveriesByDate(deliveries);

    const isChecklistComplete = useCallback(
        (d: Delivery) => !!d.checklist && CHECKLIST_KEYS.every((k) => !!(d.checklist as unknown as Record<string, boolean>)[k]),
        [],
    );

    const canStartDelivery = useCallback(
        (d: Delivery) => isChecklistComplete(d) || !!clientChecklistComplete[d.id],
        [clientChecklistComplete, isChecklistComplete],
    );

    const handleChecklistCompleteChange = useCallback((deliveryId: number, complete: boolean) => {
        setClientChecklistComplete((prev) => {
            if (prev[deliveryId] === complete) return prev;
            return { ...prev, [deliveryId]: complete };
        });
    }, []);

    return (
        <DriverLayout breadcrumbs={[{ title: 'My Deliveries', href: '/driver/deliveries' }]}>
            <Head title="My Deliveries" />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Deliveries</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your assigned routes and complete deliveries.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <Link href={route('driver.deliveries.completed')}>
                                <CheckCircle2 className="h-4 w-4" />
                                Completed History
                            </Link>
                        </Button>
                    </div>
                </div>

                {deliveries.length > 0 && actionRequiredCount > 0 && (
                    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-900/20">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            {actionRequiredCount} {actionRequiredCount === 1 ? 'delivery' : 'deliveries'} require your action
                        </span>
                    </div>
                )}

                {deliveries.length === 0 ? (
                    <Card className="border-dashed py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                                <Package className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No deliveries assigned</h3>
                            <p className="mt-1 max-w-[300px] text-sm text-gray-500 dark:text-gray-400">
                                Your assigned deliveries will appear here. Check back later or look for new notifications.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-10">
                        {groupedByDate.map(({ dateLabel, dateKey, deliveries: groupItems }) => (
                            <div key={dateKey} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                                    <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 dark:border-indigo-800 dark:bg-indigo-900/40">
                                        <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-xs font-bold tracking-wider text-indigo-900 uppercase dark:text-indigo-200">
                                            {dateLabel}
                                        </span>
                                    </div>
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                                </div>

                                <div className="grid gap-6">
                                    {groupItems.map((d) => (
                                        <DeliveryCard
                                            key={d.id}
                                            delivery={d}
                                            hasInProgress={hasInProgress}
                                            canStartDelivery={canStartDelivery}
                                            onStartClick={setStartConfirm}
                                            onEndClick={setEndConfirm}
                                            onChecklistCompleteChange={handleChecklistCompleteChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ActionConfirmDialog
                    open={startConfirm !== null}
                    onCancel={() => setStartConfirm(null)}
                    isLoading={isStarting}
                    onConfirm={() => {
                        const id = startConfirm;
                        if (id != null) {
                            router.post(
                                route('driver.deliveries.start', { delivery: id }),
                                {},
                                {
                                    preserveScroll: true,
                                    onStart: () => setIsStarting(true),
                                    onFinish: () => {
                                        setIsStarting(false);
                                        setStartConfirm(null);
                                    },
                                },
                            );
                        }
                    }}
                    title="Start this delivery?"
                    description="The elapsed time will begin. Confirm when you are ready to start."
                    confirmText="Start delivery"
                />

                <ActionConfirmDialog
                    open={endConfirm !== null}
                    onCancel={() => setEndConfirm(null)}
                    isLoading={isEnding}
                    onConfirm={() => {
                        const id = endConfirm;
                        if (id != null) {
                            router.post(
                                route('driver.deliveries.end', { delivery: id }),
                                {},
                                {
                                    preserveScroll: true,
                                    onStart: () => setIsEnding(true),
                                    onFinish: () => {
                                        setIsEnding(false);
                                        setEndConfirm(null);
                                    },
                                },
                            );
                        }
                    }}
                    title="End this delivery?"
                    description="Confirm that this delivery is complete. Ensure temperature & humidity and chain of custody are filled as needed."
                    confirmText="End delivery"
                    variant="destructive"
                />
            </div>
        </DriverLayout>
    );
}

