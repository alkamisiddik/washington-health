import { CheckCircle2, ClipboardCheck, Clock, PackageCheck, Truck } from 'lucide-react';

interface TimelineStep {
    label: string;
    sublabel: string;
    description: string;
    time: string | null;
    done: boolean;
    active: boolean;
}

interface DeliveryTimelineProps {
    delivery: {
        status: string;
        created_at: string;
        scheduled_time: string;
        pickup_time?: string | null;
        start_time?: string | null;
        end_time?: string | null;
        duration_minutes?: number | null;
        chain_of_custody?: {
            pickup_time?: string | null;
            delivery_time?: string | null;
        } | null;
    };
}

function fmt(dt: string | null | undefined): string {
    if (!dt) return '';
    try {
        // Normalize for browsers: replace space with T if needed
        const normalized = dt.includes('T') ? dt : dt.replace(' ', 'T');
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return dt;

        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return dt || '';
    }
}

export default function DeliveryTimeline({ delivery }: DeliveryTimelineProps) {
    const { status, created_at, scheduled_time, start_time, end_time, duration_minutes, chain_of_custody } = delivery;
    const pickupTime = delivery.pickup_time || chain_of_custody?.pickup_time || null;

    const isCompleted = status === 'completed';
    const isInProgress = status === 'in_progress';
    const isAssigned = status === 'assigned' || isInProgress || isCompleted;

    const steps: (TimelineStep & { icon: React.ReactNode })[] = [
        {
            label: 'Delivery Requested',
            sublabel: 'Officer',
            description: 'Delivery order created and submitted',
            time: fmt(created_at),
            done: true,
            active: status === 'pending',
            icon: <ClipboardCheck className="h-4 w-4" />,
        },
        {
            label: 'Assigned to Driver',
            sublabel: 'Admin / Officer',
            description: 'Driver & vehicle assigned; driver notified',
            time: isAssigned ? fmt(scheduled_time) : null,
            done: isAssigned,
            active: status === 'assigned',
            icon: <Truck className="h-4 w-4" />,
        },
        {
            label: 'Items Picked Up',
            sublabel: 'Driver → Pickup Location',
            description: 'Driver collected specimens / items at pickup dept.',
            time: pickupTime ? fmt(pickupTime) : null,
            done: !!pickupTime,
            active: isInProgress && !pickupTime,
            icon: <PackageCheck className="h-4 w-4" />,
        },
        {
            label: 'In Transit',
            sublabel: 'Driver',
            description: 'Delivery in progress, heading to destination',
            time: start_time ? fmt(start_time) : null,
            done: !!start_time,
            active: isInProgress && !!start_time,
            icon: <Clock className="h-4 w-4" />,
        },
        {
            label: 'Delivered & Completed',
            sublabel: 'Driver → Delivery Location',
            description:
                isCompleted && duration_minutes
                    ? `Completed in ${duration_minutes} minute${duration_minutes !== 1 ? 's' : ''}`
                    : 'Items delivered; chain of custody signed',
            time: end_time ? fmt(end_time) : null,
            done: isCompleted,
            active: false,
            icon: <CheckCircle2 className="h-4 w-4" />,
        },
    ];

    return (
        <div className="space-y-0">
            {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1;
                const dotClass = step.done
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                    : step.active
                      ? 'bg-amber-500 dark:bg-amber-400 text-white ring-2 ring-amber-200 dark:ring-amber-800 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500';

                const lineClass = step.done ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-200 dark:bg-gray-700';

                return (
                    <div key={idx} className="flex gap-4">
                        {/* Icon + Connector */}
                        <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${dotClass}`}>
                                {step.icon}
                            </div>
                            {!isLast && <div className={`min-h-[20px] w-0.5 flex-1 transition-colors ${lineClass}`} />}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 ${isLast ? '' : ''}`}>
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                <p
                                    className={`text-sm font-semibold ${step.done ? 'text-gray-900 dark:text-gray-100' : step.active ? 'text-amber-700 dark:text-amber-300' : 'text-gray-400 dark:text-gray-500'}`}
                                >
                                    {step.label}
                                </p>
                                <span
                                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${step.done ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : step.active ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}`}
                                >
                                    {step.sublabel}
                                </span>
                            </div>
                            <p className={`mt-0.5 text-xs ${step.done ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                {step.description}
                            </p>
                            {step.time && (
                                <p className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                    {step.time}
                                </p>
                            )}
                            {!step.done && !step.time && <p className="mt-1 text-xs text-gray-400 italic dark:text-gray-600">Pending</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
