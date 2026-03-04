import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_number: '',
        description: '',
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.vehicles.store'));
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Vehicles', href: '/admin/vehicles' },
            { title: 'Create Vehicle', href: '/admin/vehicles/create' }
        ]}>
            <Head title="Add Vehicle" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Vehicle</h1>
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
                                placeholder="e.g. VH-001"
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
                                placeholder="e.g. White Ford Transit, biohazard certified"
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
                                Save Vehicle
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
