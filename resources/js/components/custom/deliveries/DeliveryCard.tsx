import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Eye, MapPin } from 'lucide-react';
import type { Delivery } from '@/types';

interface DeliveryCardProps {
    delivery: Delivery;
    getStatusBadge: (status: string) => React.ReactNode;
}

export function DeliveryCard({ delivery, getStatusBadge }: DeliveryCardProps) {
    return (
        <Card className="shadow-sm transition-shadow last:mb-0 dark:border-gray-700 md:mb-0">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-muted-foreground">
                                #{delivery.id}
                            </span>
                            {getStatusBadge(delivery.status)}
                        </div>

                        <div className="mt-2 flex items-start gap-2 text-sm">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                            <div className="min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {delivery.delivery_location}
                                </div>
                                <div className="mt-0.5 text-[11px] uppercase tracking-tight text-muted-foreground">
                                    From: {delivery.pickup_location}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">
                                {new Date(delivery.scheduled_time).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="ml-1">
                                {new Date(delivery.scheduled_time).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>

                        {delivery.driver ? (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 uppercase dark:bg-indigo-900/30 dark:text-indigo-300">
                                    {delivery.driver.name.charAt(0)}
                                </div>
                                <span className="truncate text-sm font-medium">{delivery.driver.name}</span>
                            </div>
                        ) : (
                            <span className="mt-2 block text-xs italic text-muted-foreground">
                                Unassigned
                            </span>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-11 w-11 shrink-0 touch-manipulation text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
                    >
                        <Link href={route('officer.deliveries.show', delivery.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
