import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Calendar as CalendarIcon, Eye, FileText, Trash2, Truck, User as UserIcon } from 'lucide-react';
import type { Delivery } from '@/types';

interface AdminDeliveryCardProps {
    delivery: Delivery;
    statusLabel: string;
    statusClassName: string;
    onDelete: (id: number) => void;
}

export function AdminDeliveryCard({ delivery, statusLabel, statusClassName, onDelete }: AdminDeliveryCardProps) {
    return (
        <Card className="shadow-sm transition-shadow last:mb-0 dark:border-gray-700 md:mb-0">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                #{delivery.id}
                            </span>
                            <Badge variant="outline" className={`text-[10px] font-bold uppercase ${statusClassName}`}>
                                {statusLabel}
                            </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3 w-3" />
                                {new Date(delivery.scheduled_time).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>

                        <div className="space-y-1 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                <span className="truncate font-medium" title={delivery.pickup_location}>
                                    {delivery.pickup_location}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                <span className="truncate font-medium" title={delivery.delivery_location}>
                                    {delivery.delivery_location}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <UserIcon className="h-3.5 w-3.5" />
                                {delivery.driver ? delivery.driver.name : 'Unassigned'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5" />
                                {delivery.vehicle ? delivery.vehicle.vehicle_number : 'Unassigned'}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild className="h-11 w-11 touch-manipulation text-blue-600">
                                <a
                                    href={route('compliance.export', delivery.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Export PDF"
                                >
                                    <FileText className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild className="h-11 w-11 touch-manipulation text-blue-600">
                                <Link href={route('admin.deliveries.show', delivery.id)} title="View Details">
                                    <Eye className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 touch-manipulation text-red-600 hover:text-red-700"
                                onClick={() => onDelete(delivery.id)}
                                title="Delete Delivery"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
