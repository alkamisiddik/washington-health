import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { Edit, Trash2, Truck } from 'lucide-react';
import type { Vehicle } from '@/types';

interface VehicleCardProps {
    vehicle: Vehicle;
    onStatusChange: (vehicleId: number, newStatus: string) => void;
    onDelete: (vehicleId: number) => void;
}

export function VehicleCard({ vehicle, onStatusChange, onDelete }: VehicleCardProps) {
    return (
        <Card className="shadow-sm transition-shadow last:mb-0 dark:border-gray-700 md:mb-0">
            <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
                                <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{vehicle.vehicle_number}</span>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">{vehicle.description || '—'}</p>
                        <div className="mt-2">
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
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Select
                            defaultValue={vehicle.status}
                            onValueChange={(v) => onStatusChange(vehicle.id, v)}
                        >
                            <SelectTrigger className="h-11 min-w-[130px] touch-manipulation bg-muted/80">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" asChild className="h-11 w-11 touch-manipulation text-blue-600">
                                <Link href={route('admin.vehicles.edit', vehicle.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(vehicle.id)}
                                className="h-11 w-11 touch-manipulation text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
