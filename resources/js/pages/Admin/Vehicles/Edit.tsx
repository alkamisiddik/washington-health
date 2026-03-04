import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { useState } from 'react';

interface Vehicle {
    id: number;
    vehicle_number: string;
    description: string;
    status: string;
}

export default function Edit({ vehicle }: { vehicle: Vehicle }) {
    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        vehicle_number: vehicle.vehicle_number || '',
        description: vehicle.description || '',
        status: vehicle.status || 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.vehicles.update', vehicle.id));
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Vehicles', href: '/admin/vehicles' },
            { title: 'Edit Vehicle', href: `/admin/vehicles/${vehicle.id}/edit` }
        ]}>
            <Head title={`Edit Vehicle - ${vehicle.vehicle_number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Vehicle</h1>
                    {vehicle.status !== 'inactive' && (
                        <Button variant="destructive" onClick={() => setDeactivateOpen(true)}>
                            Deactivate
                        </Button>
                    )}
                </div>

                <div className="mt-4 max-w-2xl rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="vehicle_number">
                                Vehicle Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="vehicle_number"
                                value={data.vehicle_number}
                                onChange={(e) => setData('vehicle_number', e.target.value)}
                                required
                            />
                            {errors.vehicle_number && <p className="text-sm text-destructive">{errors.vehicle_number}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="resize-none"
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('admin.vehicles.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Update Vehicle
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ActionConfirmDialog
                open={deactivateOpen}
                onCancel={() => setDeactivateOpen(false)}
                onConfirm={() => {
                    router.delete(route('admin.vehicles.destroy', vehicle.id));
                    setDeactivateOpen(false);
                }}
                title="Deactivate this vehicle?"
                description="This will mark the vehicle as inactive and it will no longer be available for new deliveries."
                confirmText="Deactivate"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
