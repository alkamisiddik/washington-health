import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import OfficerLayout from '@/layouts/OfficerLayout';
import { User, Vehicle } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Package, Send } from 'lucide-react';

export default function Create({ drivers = [], vehicles = [] }: { drivers?: User[]; vehicles?: Vehicle[] }) {
    const { data, setData, post, processing, errors } = useForm({
        pickup_location: '',
        delivery_location: '',
        scheduled_time: '',
        notes: '',
        driver_id: '',
        vehicle_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('officer.deliveries.store'));
    };

    return (
        <OfficerLayout
            breadcrumbs={[
                { title: 'Deliveries', href: '/officer/deliveries' },
                { title: 'New Request', href: '/officer/deliveries/create' },
            ]}
        >
            <Head title="New Delivery Request" />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create New Request</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Specify pickup/delivery details and assign assets.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                        <Link href={route('officer.deliveries.index')}>
                            <ChevronLeft className="h-4 w-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="overflow-hidden pt-0 shadow-md dark:border-gray-700">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            SHIPMENT DETAILS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            {(errors.driver_id || errors.vehicle_id) && (
                                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                                    {errors.driver_id && <p>• {errors.driver_id}</p>}
                                    {errors.vehicle_id && <p>• {errors.vehicle_id}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="driver_id" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Driver Assignment
                                    </Label>
                                    <Select value={data.driver_id || 'none'} onValueChange={(v) => setData('driver_id', v === 'none' ? '' : v)}>
                                        <SelectTrigger id="driver_id" className="bg-gray-50 dark:bg-gray-900/50">
                                            <SelectValue placeholder="Do not assign yet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Do not assign yet</SelectItem>
                                            {drivers.map((d: User) => (
                                                <SelectItem key={d.id} value={String(d.id)}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.driver_id && <p className="text-xs text-red-500">{errors.driver_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle_id" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Vehicle Assignment
                                    </Label>
                                    <Select value={data.vehicle_id || 'none'} onValueChange={(v) => setData('vehicle_id', v === 'none' ? '' : v)}>
                                        <SelectTrigger id="vehicle_id" className="bg-gray-50 dark:bg-gray-900/50">
                                            <SelectValue placeholder="Do not assign yet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Do not assign yet</SelectItem>
                                            {vehicles.map((v: Vehicle) => (
                                                <SelectItem key={v.id} value={String(v.id)}>
                                                    {v.vehicle_number} — {v.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_id && <p className="text-xs text-red-500">{errors.vehicle_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="pickup_location" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Pickup Point <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="pickup_location"
                                        value={data.pickup_location}
                                        onChange={(e) => setData('pickup_location', e.target.value)}
                                        required
                                        placeholder="e.g. Loading Dock A"
                                        className="bg-gray-50 dark:bg-gray-900/50"
                                    />
                                    {errors.pickup_location && <p className="text-xs text-red-500">{errors.pickup_location}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="delivery_location" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Delivery Point <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="delivery_location"
                                        value={data.delivery_location}
                                        onChange={(e) => setData('delivery_location', e.target.value)}
                                        required
                                        placeholder="e.g. Sterile Storage B"
                                        className="bg-gray-50 dark:bg-gray-900/50"
                                    />
                                    {errors.delivery_location && <p className="text-xs text-red-500">{errors.delivery_location}</p>}
                                </div>
                            </div>

                            <div className="max-w-sm space-y-2">
                                <Label htmlFor="scheduled_time" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                    Scheduled Timestamp <span className="text-red-500">*</span>
                                </Label>
                                <DateTimePicker
                                    value={data.scheduled_time}
                                    onChange={(v) => setData('scheduled_time', v)}
                                    placeholder="Select date and time"
                                />
                                <input type="hidden" value={data.scheduled_time} onChange={() => {}} required id="scheduled_time" />
                                {errors.scheduled_time && <p className="text-xs text-red-500">{errors.scheduled_time}</p>}
                            </div>

                            <div className="space-y-2 text-sm">
                                <Label htmlFor="notes" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                    Service Notes
                                </Label>
                                <Textarea
                                    id="notes"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add any specific instructions or requirements for this delivery..."
                                    className="resize-none bg-gray-50 dark:bg-gray-900/50"
                                />
                                {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                                <p className="text-[11px] text-gray-400 italic">Visible to driver and security officers.</p>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="ghost" asChild>
                                    <Link href={route('officer.deliveries.index')}>Discard</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2 bg-indigo-600 shadow-md transition-all hover:bg-indigo-700"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </OfficerLayout>
    );
}

