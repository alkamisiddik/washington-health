import OfficerLayout from '@/layouts/OfficerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Textarea } from '@/components/ui/textarea';
import { User, Vehicle } from '@/types';

export default function Create({ drivers = [], vehicles = [] }: { drivers?: User[], vehicles?: Vehicle[] }) {
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
        <OfficerLayout breadcrumbs={[
            { title: 'Deliveries', href: '/officer/deliveries' },
            { title: 'New Delivery', href: '/officer/deliveries/create' }
        ]}>
            <Head title="New Delivery" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create New Delivery</h1>
                </div>

                <div className="mt-4 max-w-2xl rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <form onSubmit={submit} className="space-y-6">
                        {(errors.driver_id || errors.vehicle_id) && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
                                {errors.driver_id && <p>{errors.driver_id}</p>}
                                {errors.vehicle_id && <p>{errors.vehicle_id}</p>}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="driver_id">Assign Driver (Optional)</Label>
                                <Select value={data.driver_id || 'none'} onValueChange={(v) => setData('driver_id', v === 'none' ? '' : v)}>
                                    <SelectTrigger id="driver_id">
                                        <SelectValue placeholder="Do not assign yet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Do not assign yet</SelectItem>
                                        {drivers.map((d: User) => (
                                            <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.driver_id && <p className="text-sm text-destructive">{errors.driver_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_id">Assign Vehicle (Optional)</Label>
                                <Select value={data.vehicle_id || 'none'} onValueChange={(v) => setData('vehicle_id', v === 'none' ? '' : v)}>
                                    <SelectTrigger id="vehicle_id">
                                        <SelectValue placeholder="Do not assign yet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Do not assign yet</SelectItem>
                                        {vehicles.map((v: Vehicle) => (
                                            <SelectItem key={v.id} value={String(v.id)}>{v.vehicle_number} – {v.description}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.vehicle_id && <p className="text-sm text-destructive">{errors.vehicle_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickup_location">Pickup Location <span className="text-destructive">*</span></Label>
                            <Input
                                id="pickup_location"
                                value={data.pickup_location}
                                onChange={(e) => setData('pickup_location', e.target.value)}
                                required
                                placeholder="e.g. Building A, Loading Dock"
                            />
                            {errors.pickup_location && <p className="text-sm text-destructive">{errors.pickup_location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="delivery_location">Delivery Location <span className="text-destructive">*</span></Label>
                            <Input
                                id="delivery_location"
                                value={data.delivery_location}
                                onChange={(e) => setData('delivery_location', e.target.value)}
                                required
                                placeholder="e.g. Building B, Room 101"
                            />
                            {errors.delivery_location && <p className="text-sm text-destructive">{errors.delivery_location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scheduled_time">Scheduled Time <span className="text-destructive">*</span></Label>
                            <DateTimePicker
                                value={data.scheduled_time}
                                onChange={(v) => setData('scheduled_time', v)}
                                placeholder="Select date and time"
                            />
                            <input
                                type="hidden"
                                value={data.scheduled_time}
                                onChange={() => {}}
                                required
                                id="scheduled_time"
                            />
                            {errors.scheduled_time && <p className="text-sm text-destructive">{errors.scheduled_time}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                rows={4}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any special instructions..."
                                className="resize-none"
                            />
                            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('officer.deliveries.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </OfficerLayout>
    );
}
