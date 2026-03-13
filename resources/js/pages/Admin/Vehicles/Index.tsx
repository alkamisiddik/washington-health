import { VehicleCard } from '@/components/custom/vehicles/VehicleCard';
import { Pagination } from '@/components/custom/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginatedData, Vehicle } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2, Truck, X } from 'lucide-react';
import { useState } from 'react';

export default function Index({ vehicles, filters }: { vehicles: PaginatedData<Vehicle>; filters: { status?: string } }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const { data, setData, post, processing, errors, reset } = useForm({
        vehicle_number: '',
        description: '',
        status: 'active',
    });

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(route('admin.vehicles.index'), { status: value }, { preserveState: true });
    };

    const handleStatusChange = (vehicleId: number, newStatus: string) => {
        router.patch(
            route('admin.vehicles.status', vehicleId),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.vehicles.store'), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const handleDelete = (vehicleId: number) => {
        if (confirm('Are you sure you want to deactivate this vehicle?')) {
            router.delete(route('admin.vehicles.destroy', vehicleId));
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Vehicles', href: '/admin/vehicles' }]}>
            <Head title="Manage Vehicles" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Vehicle Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage fleet inventory, monitor maintenance status, and assign vehicles.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-auto ${showAddForm ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                    >
                        {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showAddForm ? 'Cancel' : 'Add New Vehicle'}
                    </Button>
                </div>

                {showAddForm && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Add System Vehicle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle_number">Vehicle Number</Label>
                                    <Input
                                        id="vehicle_number"
                                        placeholder="e.g. VH-001"
                                        value={data.vehicle_number}
                                        onChange={(e) => setData('vehicle_number', e.target.value)}
                                        required
                                    />
                                    {errors.vehicle_number && <p className="text-xs text-destructive">{errors.vehicle_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="e.g. Ford Transit 2023, refrigerated"
                                        value={data.description || ''}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="h-20"
                                    />
                                    {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end pt-2 md:col-span-2">
                                    <Button type="submit" disabled={processing}>
                                        Register Vehicle
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="flex items-center gap-4">
                    <Label className="text-sm">Filter Status:</Label>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Vehicles</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive Only</SelectItem>
                            <SelectItem value="maintenance">Maintenance Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile: card list */}
                <div className="space-y-3 md:hidden">
                    {vehicles.data.map((vehicle: Vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                        />
                    ))}
                    {vehicles.data.length === 0 && (
                        <div className="rounded-xl border bg-white p-8 text-center text-muted-foreground dark:border-gray-700 dark:bg-gray-800">
                            No vehicles found matching the criteria.
                        </div>
                    )}
                </div>

                {/* Tablet/Desktop: table */}
                <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead>Vehicle Number</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.data.map((vehicle: Vehicle) => (
                                    <TableRow key={vehicle.id} className="transition-colors hover:bg-muted/50">
                                        <TableCell className="font-bold">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
                                                    <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                {vehicle.vehicle_number}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{vehicle.description || '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    vehicle.status === 'active'
                                                        ? 'default'
                                                        : vehicle.status === 'maintenance'
                                                          ? 'secondary'
                                                          : 'destructive'
                                                }
                                                className="px-2.5 py-1"
                                            >
                                                {vehicle.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Select defaultValue={vehicle.status} onValueChange={(v) => handleStatusChange(vehicle.id, v)}>
                                                    <SelectTrigger className="h-8 w-[130px] bg-muted/80">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex gap-1 border-l pl-3">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600">
                                                        <Link href={route('admin.vehicles.edit', vehicle.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="h-8 w-8 text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {vehicles.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No vehicles found matching the criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {vehicles.links && vehicles.links.length > 3 && <Pagination data={vehicles} />}
            </div>
        </AdminLayout>
    );
}
