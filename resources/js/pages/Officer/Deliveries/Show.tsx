import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import DeliveryTimeline from '@/components/DeliveryTimeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Delivery, User, Vehicle } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, FileText, Info, MapPin, Truck, User as UserIcon } from 'lucide-react';

export default function Show({ delivery, drivers = [], vehicles = [] }: { delivery: Delivery; drivers?: User[]; vehicles?: Vehicle[] }) {
    const { data, setData, post, processing } = useForm({
        driver_id: delivery?.driver_id?.toString() || '',
        vehicle_id: delivery?.vehicle_id?.toString() || '',
    });

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('officer.deliveries.assign', delivery.id), {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
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
            case 'in_progress':
                return (
                    <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                        IN PROGRESS
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                        COMPLETED
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status.toUpperCase()}</Badge>;
        }
    };

    return (
        <OfficerLayout
            breadcrumbs={[
                { title: 'Deliveries', href: '/officer/deliveries' },
                { title: `Delivery #${delivery.id}`, href: '#' },
            ]}
        >
            <Head title={`Delivery #${delivery.id}`} />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Delivery Information</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Viewing status and compliance records for #{delivery.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {delivery.status === 'completed' && (
                            <Button variant="outline" size="sm" asChild className="gap-2">
                                <a href={route('compliance.export', delivery.id)} target="_blank" rel="noreferrer">
                                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    Export PDF
                                </a>
                            </Button>
                        )}
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <Link href={route('officer.deliveries.index')}>
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="overflow-hidden pt-0 shadow-sm dark:border-gray-700">
                            <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        SHIPMENT DETAILS
                                    </CardTitle>
                                    <div className="flex items-center gap-3">{getStatusBadge(delivery.status)}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-8 grid gap-6 sm:grid-cols-2">
                                    <div className="relative flex gap-4 rounded-xl border bg-indigo-50/20 p-4 dark:bg-indigo-900/10">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase">Pickup Location</p>
                                            <p className="mt-0.5 text-base leading-tight font-semibold text-gray-900 dark:text-white">
                                                {delivery.pickup_location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative flex gap-4 rounded-xl border bg-emerald-50/20 p-4 dark:bg-emerald-900/10">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">Delivery Location</p>
                                            <p className="mt-0.5 text-base leading-tight font-semibold text-gray-900 dark:text-white">
                                                {delivery.delivery_location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 border-t pt-6 text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Assigned Driver</p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                                                {delivery.driver?.name || <span className="text-gray-400 italic">None assigned</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Target vehicle</p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Truck className="h-3.5 w-3.5 text-gray-400" />
                                                {delivery.vehicle?.vehicle_number || <span className="text-gray-400 italic">None assigned</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Scheduled At</p>
                                            <p className="font-medium">{new Date(delivery.scheduled_time).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Created By</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {delivery.officer?.name || 'Security Dept'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {delivery.notes && (
                                    <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Officer Notes</p>
                                        <p className="text-sm text-gray-700 italic underline decoration-gray-200 underline-offset-4 dark:text-gray-300 dark:decoration-gray-700">
                                            {delivery.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {delivery.status === 'completed' && (
                            <Card className="overflow-hidden shadow-sm dark:border-gray-700">
                                <CardHeader className="border-b bg-indigo-100/50 py-3 dark:bg-indigo-900/30">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                        <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        CHAIN OF CUSTODY RECORDS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ChainOfCustodyForm delivery={delivery} coc={delivery.chain_of_custody} readOnly={true} />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {['pending', 'assigned', 'picked_up', 'in_transit', 'in_progress'].includes(delivery.status) && (
                            <Card className="border-indigo-200 shadow-sm dark:border-indigo-900/50">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-sm font-bold tracking-tight uppercase">Assignment Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submitAssign} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="driver_id">Driver</Label>
                                            <Select value={data.driver_id} onValueChange={(v) => setData('driver_id', v)}>
                                                <SelectTrigger id="driver_id">
                                                    <SelectValue placeholder="Select a driver..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {drivers.map((d) => (
                                                        <SelectItem key={d.id} value={String(d.id)}>
                                                            {d.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicle_id">Vehicle</Label>
                                            <Select value={data.vehicle_id} onValueChange={(v) => setData('vehicle_id', v)}>
                                                <SelectTrigger id="vehicle_id">
                                                    <SelectValue placeholder="Select a vehicle..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehicles.map((v) => (
                                                        <SelectItem key={v.id} value={String(v.id)}>
                                                            {v.vehicle_number} - {v.description}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                            {delivery.status === 'pending' ? 'Post Assignment' : 'Update Details'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="shadow-sm">
                            <CardHeader className="py-4">
                                <CardTitle className="text-sm font-bold tracking-tight uppercase">Event Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DeliveryTimeline delivery={delivery} />
                                {delivery.duration_minutes != null && (
                                    <div className="mt-6 border-t pt-4">
                                        <p className="text-xs text-muted-foreground">Total Cycle Time</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{delivery.duration_minutes} Minutes</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}

