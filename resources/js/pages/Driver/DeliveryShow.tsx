import DriverLayout from '@/layouts/DriverLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import ElapsedTimer from '@/components/ElapsedTimer';
import ChecklistForm from '@/components/ChecklistForm';
import EnvironmentForm from '@/components/EnvironmentForm';
import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import { Button } from '@/components/ui/button';

export default function DeliveryShow({ delivery }: { delivery: any }) {
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
        <DriverLayout breadcrumbs={[
            { title: 'My Deliveries', href: '/driver/deliveries' },
            { title: `Delivery #${delivery.id}`, href: '#' }
        ]}>
            <Head title={`Delivery #${delivery.id}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={route('driver.deliveries')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to My Deliveries
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(delivery.status)}`}>
                                {delivery.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-muted-foreground">Delivery #{delivery.id}</span>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 mb-6">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">Pickup</p>
                                <p className="font-medium text-foreground">{delivery.pickup_location}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">Delivery</p>
                                <p className="font-medium text-foreground">{delivery.delivery_location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t border-b py-4 dark:border-gray-700">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(delivery.scheduled_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                        {delivery.vehicle && (
                            <span>Vehicle: {delivery.vehicle.vehicle_number}</span>
                        )}
                        {delivery.status === 'in_progress' && delivery.start_time && (
                            <span className="flex items-center gap-1.5">
                                Elapsed: <ElapsedTimer startTime={delivery.start_time} />
                            </span>
                        )}
                        {delivery.status === 'completed' && delivery.duration_minutes != null && (
                            <span className="text-green-600 dark:text-green-400 font-medium">Completed in {delivery.duration_minutes} mins</span>
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

                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                        <Button variant="outline" asChild>
                            <Link href={route('driver.deliveries')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to list
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
